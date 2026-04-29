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
        const email = req.nextUrl.searchParams.get('email')
        if (!email) return NextResponse.json({ notifications: [] })

        const adminClient = createAdminClient()
        const { data, error } = await adminClient
            .from('notifications')
            .select('*')
            .eq('recipient_email', email)
            .order('created_at', { ascending: false })
            .limit(50)

        if (error) throw error

        return NextResponse.json({ notifications: data })
    } catch (error: any) {
        console.error('Notifications GET error:', error)
        return NextResponse.json({ notifications: [] })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const adminClient = createAdminClient()

        if (body.markAllRead && body.email) {
            const { error } = await adminClient
                .from('notifications')
                .update({ read: true })
                .eq('recipient_email', body.email)
                .eq('read', false)
            if (error) throw error
        } else if (body.id) {
            const { error } = await adminClient
                .from('notifications')
                .update({ read: true })
                .eq('id', body.id)
            if (error) throw error
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Notifications PATCH error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
