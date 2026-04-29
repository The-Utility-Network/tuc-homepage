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
    const type = searchParams.get('type') || 'all'

    try {
        const adminClient = createAdminClient()

        if (type === 'officer') {
            const { data: officers, error } = await adminClient
                .from('officers')
                .select('*')
                .eq('is_active', true)
                .order('title', { ascending: true })
            if (error) throw error
            return NextResponse.json({ officers })
        }
        
        if (type === 'director') {
            const { data: directors, error } = await adminClient
                .from('board_members')
                .select('*')
                .eq('is_active', true)
                .order('seat_type', { ascending: true })
            if (error) throw error
            return NextResponse.json({ directors })
        }

        // All
        const { data: directors } = await adminClient.from('board_members').select('*').eq('is_active', true).order('seat_type', { ascending: true })
        const { data: officers } = await adminClient.from('officers').select('*').eq('is_active', true).order('title', { ascending: true })
        
        return NextResponse.json({ directors, officers })
    } catch (error) {
        console.error('Board API error:', error)
        return NextResponse.json({ error: 'Failed to fetch board data' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json()
    const entityType = body.entity_type || 'director'

    try {
        const adminClient = createAdminClient()

        if (entityType === 'officer') {
            if (body.id) {
                const { error } = await adminClient.from('officers').update({ ...body, updated_at: new Date() }).eq('id', body.id)
                if (error) throw error
            } else {
                const { error } = await adminClient.from('officers').insert([body])
                if (error) throw error
            }
            return NextResponse.json({ success: true })
        }

        // Director
        if (body.id) {
            const { error } = await adminClient.from('board_members').update({ ...body, updated_at: new Date() }).eq('id', body.id)
            if (error) throw error
        } else {
            const { error } = await adminClient.from('board_members').insert([body])
            if (error) throw error
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Board POST error:', error)
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type') || 'director'

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 })

    try {
        const adminClient = createAdminClient()

        if (type === 'officer') {
            const { error } = await adminClient.from('officers').update({ is_active: false, updated_at: new Date() }).eq('id', id)
            if (error) throw error
        } else {
            const { error } = await adminClient.from('board_members').update({ is_active: false, updated_at: new Date() }).eq('id', id)
            if (error) throw error
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Board DELETE error:', error)
        return NextResponse.json({ error: 'Failed to remove' }, { status: 500 })
    }
}
