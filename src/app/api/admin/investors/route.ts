import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

/**
 * Helper: create a service-role Supabase client that bypasses RLS
 */
function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

/**
 * Helper: verify the requesting user is an admin
 */
async function verifyAdmin() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null

    const adminClient = createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') return null
    return user
}

/**
 * PATCH /api/admin/investors
 * Update investor status (approve / reject)
 * Body: { investorId: string, status: 'approved' | 'rejected' }
 */
export async function PATCH(request: NextRequest) {
    try {
        const admin = await verifyAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
        }

        const { investorId, status } = await request.json()

        if (!investorId || !['approved', 'rejected', 'pending'].includes(status)) {
            return NextResponse.json({ error: 'Invalid investorId or status' }, { status: 400 })
        }

        const adminClient = createAdminClient()
        const { error } = await adminClient
            .from('profiles')
            .update({ status })
            .eq('id', investorId)

        if (error) {
            console.error('Admin status update error:', error)
            return NextResponse.json({ error: 'Failed to update investor status' }, { status: 500 })
        }

        return NextResponse.json({ success: true, investorId, status })
    } catch (error) {
        console.error('Admin PATCH error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

/**
 * DELETE /api/admin/investors
 * Permanently delete an investor application and all associated data
 * Body: { investorId: string }
 */
export async function DELETE(request: NextRequest) {
    try {
        const admin = await verifyAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
        }

        const { investorId } = await request.json()

        if (!investorId) {
            return NextResponse.json({ error: 'Missing investorId' }, { status: 400 })
        }

        const adminClient = createAdminClient()

        // 1. Delete verification documents
        await adminClient
            .from('verification_documents')
            .delete()
            .eq('investor_id', investorId)

        // 2. Delete accreditation responses
        await adminClient
            .from('accreditation_responses')
            .delete()
            .eq('investor_id', investorId)

        // 3. Delete investor profile (if exists)
        await adminClient
            .from('investor_profiles')
            .delete()
            .eq('id', investorId)

        // 4. Delete the user profile
        const { error } = await adminClient
            .from('profiles')
            .delete()
            .eq('id', investorId)

        if (error) {
            console.error('Admin delete error:', error)
            return NextResponse.json({ error: 'Failed to delete investor' }, { status: 500 })
        }

        // 5. Delete the auth user (from Supabase Auth)
        const { error: authError } = await adminClient.auth.admin.deleteUser(investorId)
        if (authError) {
            console.warn('Failed to delete auth user (may not exist):', authError.message)
        }

        return NextResponse.json({ success: true, investorId })
    } catch (error) {
        console.error('Admin DELETE error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
