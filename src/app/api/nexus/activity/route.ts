import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET(req: NextRequest) {
    try {
        const type = req.nextUrl.searchParams.get('type')
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50')
        
        const adminClient = createAdminClient()
        let query = adminClient.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(limit)

        if (type && type !== 'all') {
            query = query.eq('action_type', type)
        }

        const { data: logs, error } = await query
        if (error) {
            console.warn('Activity fetch error or table not found:', error)
            return NextResponse.json({ activities: [] })
        }

        return NextResponse.json({ activities: logs })
    } catch (error: any) {
        console.error('Activity fetch error:', error)
        return NextResponse.json({ activities: [] })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const adminClient = createAdminClient()
        
        // Use ip from headers
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

        const { error } = await adminClient.from('activity_logs').insert([{
            user_id: body.user_id,
            user_email: body.user_email,
            action_type: body.action_type,
            target_id: body.target_id,
            target_type: body.target_type,
            details: body.details || {},
            ip_address: ip,
            user_agent: req.headers.get('user-agent') || 'unknown'
        }])

        if (error) throw error

        return NextResponse.json({ success: true }, { status: 201 })
    } catch (error: any) {
        console.error('Activity logging error:', error)
        // Activity log failures shouldn't crash the client flow usually
        return NextResponse.json({ success: false, error: 'Logging failed' }, { status: 500 })
    }
}
