import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendMeetingScheduledEmail } from '@/lib/aws/ses'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    try {
        const adminClient = createAdminClient()
        let query = adminClient.from('board_meetings').select('*').order('date', { ascending: false }).limit(limit)
        
        if (status) query = query.eq('status', status)

        const { data: meetings, error } = await query
        if (error) throw error

        return NextResponse.json({ meetings })
    } catch (error) {
        console.error('Meetings GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch meetings' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json()

    try {
        const adminClient = createAdminClient()
        
        if (body.id) {
            const { error } = await adminClient.from('board_meetings').update({ ...body, updated_at: new Date() }).eq('id', body.id)
            if (error) throw error
        } else {
            const { error } = await adminClient.from('board_meetings').insert([body])
            if (error) throw error

            // SES: notify all active directors of the scheduled meeting
            const { data: directors } = await adminClient.from('board_members').select('*').eq('is_active', true)
            
            const dateStr = body.date ? new Date(body.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'
            for (const d of directors || []) {
                if (d.email) {
                    sendMeetingScheduledEmail(d.email, body.title, body.meeting_type || 'regular', dateStr, body.time, body.location)
                        .catch(err => console.error(`[SES] Meeting notification to ${d.email} failed:`, err))
                }
            }
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Meetings POST error:', error)
        return NextResponse.json({ error: 'Failed to save meeting' }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    const body = await req.json()

    try {
        const adminClient = createAdminClient()
        const { id, ...updates } = body
        if (!id) return NextResponse.json({ error: 'Meeting ID required' }, { status: 400 })

        const { error } = await adminClient.from('board_meetings').update({ ...updates, updated_at: new Date() }).eq('id', id)
        if (error) throw error
        
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Meetings PATCH error:', error)
        return NextResponse.json({ error: 'Failed to update meeting' }, { status: 500 })
    }
}
