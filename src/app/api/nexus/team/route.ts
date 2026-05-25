import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendApplicationApprovedEmail, sendApplicationSuspendedEmail } from '@/lib/aws/ses'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET() {
    try {
        const adminClient = createAdminClient()

        // Get all profiles
        const { data: profiles } = await adminClient.from('profiles').select('*').order('created_at', { ascending: false })

        // Get all board members and officers (including inactive for full picture)
        const { data: directors } = await adminClient.from('board_members').select('*').eq('is_active', true)
        const { data: officers } = await adminClient.from('officers').select('*').eq('is_active', true)

        // For each profile, find matching governance roles by email
        const enriched = (profiles || []).map((p: any) => {
            const matchedDirectors = (directors || []).filter((d: any) =>
                d.email && p.email && d.email.toLowerCase() === p.email.toLowerCase()
            ).map((d: any) => ({
                id: d.id,
                type: 'director',
                title: d.title || 'Director',
                seat_type: d.seat_type,
                seat_class: d.seat_class,
                linked: d.user_id === p.id
            }))

            const matchedOfficers = (officers || []).filter((o: any) =>
                o.email && p.email && o.email.toLowerCase() === p.email.toLowerCase()
            ).map((o: any) => ({
                id: o.id,
                type: 'officer',
                title: o.title,
                department: o.department,
                linked: o.user_id === p.id
            }))

            return {
                ...p,
                governance_roles: [...matchedDirectors, ...matchedOfficers]
            }
        })

        // Find unlinked governance roles (no user_id set and no email match to any profile)
        const profileEmails = (profiles || []).map((p: any) => p.email?.toLowerCase()).filter(Boolean)

        const unlinkedDirectors = (directors || []).filter((d: any) =>
            !d.user_id && (!d.email || !profileEmails.includes(d.email?.toLowerCase()))
        ).map((d: any) => ({
            id: d.id,
            type: 'director',
            name: d.name,
            email: d.email,
            title: d.title || 'Director',
            seat_type: d.seat_type
        }))

        const unlinkedOfficers = (officers || []).filter((o: any) =>
            !o.user_id && (!o.email || !profileEmails.includes(o.email?.toLowerCase()))
        ).map((o: any) => ({
            id: o.id,
            type: 'officer',
            name: o.name,
            email: o.email,
            title: o.title
        }))

        return NextResponse.json({
            profiles: enriched,
            unlinked_roles: [...unlinkedDirectors, ...unlinkedOfficers]
        })
    } catch (error) {
        console.error('Team GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch team data' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const body = await req.json()
    const { action, profile_id } = body

    if (!profile_id) {
        return NextResponse.json({ error: 'Profile ID required' }, { status: 400 })
    }

    try {
        const adminClient = createAdminClient()
        const { data: profile, error: profileError } = await adminClient.from('profiles').select('*').eq('id', profile_id).single()
        if (profileError || !profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

        if (action === 'approve') {
            const { role, link_roles } = body

            // Update profile status and role
            const updatePayload = {
                status: 'approved',
                role: role || profile.requested_role || 'investor',
                updated_at: new Date()
            }
            await adminClient.from('profiles').update(updatePayload).eq('id', profile_id)

            // Link governance roles by setting user_id
            if (link_roles?.length) {
                for (const lr of link_roles) {
                    if (lr.type === 'director') {
                        await adminClient.from('board_members').update({ user_id: profile_id, updated_at: new Date() }).eq('id', lr.id)
                    } else if (lr.type === 'officer') {
                        await adminClient.from('officers').update({ user_id: profile_id, updated_at: new Date() }).eq('id', lr.id)
                    }
                }
            }

            // SES: notify the user they've been approved
            if (profile.email) {
                sendApplicationApprovedEmail(profile.email, profile.full_name || profile.email, updatePayload.role).catch(err => console.error('[SES] Approval email failed:', err))
            }

            return NextResponse.json({ success: true })
        }

        if (action === 'link') {
            const { role_id, role_type } = body
            if (role_type === 'director') {
                await adminClient.from('board_members').update({ user_id: profile_id, email: profile.email, updated_at: new Date() }).eq('id', role_id)
            } else if (role_type === 'officer') {
                await adminClient.from('officers').update({ user_id: profile_id, email: profile.email, updated_at: new Date() }).eq('id', role_id)
            }
            return NextResponse.json({ success: true })
        }

        if (action === 'unlink') {
            const { role_id, role_type } = body
            if (role_type === 'director') {
                await adminClient.from('board_members').update({ user_id: null, updated_at: new Date() }).eq('id', role_id)
            } else if (role_type === 'officer') {
                await adminClient.from('officers').update({ user_id: null, updated_at: new Date() }).eq('id', role_id)
            }
            return NextResponse.json({ success: true })
        }

        if (action === 'suspend') {
            await adminClient.from('profiles').update({ status: 'suspended', updated_at: new Date() }).eq('id', profile_id)

            // SES: notify the user their account has been suspended
            if (profile.email) {
                sendApplicationSuspendedEmail(profile.email, profile.full_name || profile.email).catch(err => console.error('[SES] Suspension email failed:', err))
            }

            return NextResponse.json({ success: true })
        }

        if (action === 'update_role') {
            const { role } = body
            await adminClient.from('profiles').update({ role, updated_at: new Date() }).eq('id', profile_id)
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    } catch (error) {
        console.error('Team PATCH error:', error)
        return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const adminClient = createAdminClient()
        const { profile_id } = await req.json()

        if (!profile_id) {
            return NextResponse.json({ error: 'Profile ID required' }, { status: 400 })
        }

        // 1. Unlink governance seats to prevent foreign key errors
        await adminClient.from('board_members').update({ user_id: null }).eq('user_id', profile_id)
        await adminClient.from('officers').update({ user_id: null }).eq('user_id', profile_id)

        // 2. Delete the profile
        const { error: profileDeleteErr } = await adminClient.from('profiles').delete().eq('id', profile_id)
        if (profileDeleteErr) throw profileDeleteErr

        // 3. Delete from auth.users
        const { error: authDeleteErr } = await adminClient.auth.admin.deleteUser(profile_id)
        if (authDeleteErr) {
            console.log('Error deleting auth user:', authDeleteErr.message)
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Team DELETE error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
