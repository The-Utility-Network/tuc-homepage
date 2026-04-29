import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const status = searchParams.get('status')
    
    try {
        const adminClient = createAdminClient()
        if (id) {
            const { data, error } = await adminClient.from('resolutions').select('*').eq('id', id).single()
            if (error) throw error
            return NextResponse.json({ resolution: data })
        }

        let query = adminClient.from('resolutions').select('*').order('created_at', { ascending: false })
        if (status) query = query.eq('status', status)

        const { data, error } = await query
        if (error) throw error

        return NextResponse.json({ resolutions: data })
    } catch (error) {
        console.error('Resolutions GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        const adminClient = createAdminClient()
        if (body.id) {
            const { error } = await adminClient.from('resolutions').update({ ...body, updated_at: new Date() }).eq('id', body.id)
            if (error) throw error
            return NextResponse.json({ success: true })
        }

        const { data, error } = await adminClient.from('resolutions').insert([body]).select().single()
        if (error) throw error
        return NextResponse.json({ success: true, id: data.id })
    } catch (error) {
        console.error('Resolutions POST error:', error)
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const body = await req.json()
    try {
        const adminClient = createAdminClient()

        if (body.action === 'vote') {
            const { id, user_email, vote } = body
            
            // Get current resolution
            const { data: res, error: resError } = await adminClient.from('resolutions').select('*').eq('id', id).single()
            if (resError || !res) throw resError

            // Determine if user has already voted
            const existingVotes = res.votes || []
            const existingVoteIndex = existingVotes.findIndex((v: any) => v.user_email === user_email)

            if (existingVoteIndex >= 0) {
                existingVotes[existingVoteIndex] = { user_email, vote, timestamp: new Date() }
            } else {
                existingVotes.push({ user_email, vote, timestamp: new Date() })
            }

            // Recalculate totals
            const votes_for = existingVotes.filter((v: any) => v.vote === 'for').length
            const votes_against = existingVotes.filter((v: any) => v.vote === 'against').length
            const votes_abstain = existingVotes.filter((v: any) => v.vote === 'abstain').length

            // Total eligible voters (all active directors)
            const { data: directors } = await adminClient.from('board_members').select('*').eq('is_active', true)
            const totalVoters = directors?.length || 0

            // Apply Fixed Algebra Unanimous Rule for Board Resolutions
            // We ignore db approval_threshold and enforce 100% consent of ALL directors
            let newStatus = res.status
            let approvedAt = res.approved_at

            if (votes_for >= totalVoters && totalVoters > 0) {
                newStatus = 'approved'
                approvedAt = new Date()
            } else if (votes_against > 0) {
                // Any single rejection breaks unanimous consent immediately
                newStatus = 'rejected'
            } else if (existingVotes.length === totalVoters && votes_for < totalVoters) {
                // Everyone voted, but didn't hit 100% 'for'
                newStatus = 'rejected'
            }

            const { error: updateError } = await adminClient.from('resolutions').update({
                votes: existingVotes,
                votes_for,
                votes_against,
                votes_abstain,
                status: newStatus,
                approved_at: approvedAt,
                updated_at: new Date()
            }).eq('id', id)

            if (updateError) throw updateError

            return NextResponse.json({ success: true, status: newStatus })
        }

        if (body.id) {
            const { error } = await adminClient.from('resolutions').update({ ...body, updated_at: new Date() }).eq('id', body.id)
            if (error) throw error
            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    } catch (error) {
        console.error('Resolutions PATCH error:', error)
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}
