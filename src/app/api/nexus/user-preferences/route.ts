import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get('email')
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    try {
        const adminClient = createAdminClient()
        const { data: pref, error } = await adminClient.from('user_preferences').select('annotation_color').eq('user_email', email).single()

        if (error) {
            return NextResponse.json({ annotation_color: null })
        }

        return NextResponse.json({ annotation_color: pref?.annotation_color || null })
    } catch (error: any) {
        console.error('User preference fetch error:', error)
        return NextResponse.json({ annotation_color: null })
    }
}

export async function POST(req: NextRequest) {
    try {
        const { email, annotation_color } = await req.json()
        if (!email || !annotation_color) {
            return NextResponse.json({ error: 'email and annotation_color required' }, { status: 400 })
        }

        const adminClient = createAdminClient()
        
        // upsert requires PK. We might not have user ID here. So we check if exists by email.
        const { data: existing } = await adminClient.from('user_preferences').select('id').eq('user_email', email).single()

        if (existing) {
            const { error } = await adminClient.from('user_preferences').update({ annotation_color, updated_at: new Date() }).eq('id', existing.id)
            if (error) throw error
        } else {
            const { error } = await adminClient.from('user_preferences').insert([{ user_email: email, annotation_color }])
            if (error) throw error
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('User preference save error:', error)
        return NextResponse.json({ error: 'Failed to save preference' }, { status: 500 })
    }
}
