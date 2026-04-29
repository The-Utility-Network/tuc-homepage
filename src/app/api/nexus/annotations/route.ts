import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET(req: NextRequest) {
    const key = req.nextUrl.searchParams.get('key')
    if (!key) return NextResponse.json({ error: 'key required' }, { status: 400 })

    const page = req.nextUrl.searchParams.get('page')

    try {
        const adminClient = createAdminClient()
        let query = adminClient.from('document_annotations').select('*').eq('document_key', key).order('created_at', { ascending: true })
        if (page) query = query.eq('page', parseInt(page))

        const { data: annotations, error } = await query
        if (error) throw error

        return NextResponse.json({ annotations: annotations || [] })
    } catch (error: any) {
        console.error('Annotations fetch error:', error)
        return NextResponse.json({ annotations: [] })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const adminClient = createAdminClient()

        const { data: annotation, error } = await adminClient.from('document_annotations').insert([{
            document_key: body.document_key,
            page: body.page,
            type: body.type,
            x: body.x,
            y: body.y,
            width: body.width || 0,
            height: body.height || 0,
            text: body.text || '',
            user_email: body.user_email,
            user_name: body.user_name,
            user_color: body.user_color,
            rects: body.rects || []
        }]).select().single()

        if (error) throw error

        return NextResponse.json({
            success: true,
            id: annotation.id
        }, { status: 201 })
    } catch (error: any) {
        console.error('Annotation create error:', error)
        return NextResponse.json({ error: 'Failed to create annotation' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id')
    const email = req.nextUrl.searchParams.get('email')
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

    try {
        const adminClient = createAdminClient()
        
        const { data: annotation, error: fetchError } = await adminClient.from('document_annotations').select('*').eq('id', id).single()
        if (fetchError || !annotation) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        
        if (annotation.user_email !== email) {
            return NextResponse.json({ error: 'Can only delete your own annotations' }, { status: 403 })
        }

        const { error } = await adminClient.from('document_annotations').delete().eq('id', id)
        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Annotation delete error:', error)
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}
