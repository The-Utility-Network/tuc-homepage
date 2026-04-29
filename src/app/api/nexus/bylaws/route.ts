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
    const docType = searchParams.get('document_type')
    const currentOnly = searchParams.get('current') !== 'false'

    try {
        const adminClient = createAdminClient()
        let query = adminClient.from('bylaws').select('*')
        
        if (docType) query = query.eq('document_type', docType)
        if (currentOnly) query = query.eq('is_current', true)
        
        // Supabase allows order by multiple columns via chaining
        query = query.order('document_type', { ascending: true })
            .order('article_number', { ascending: true })
            .order('section_number', { ascending: true })

        const { data: bylaws, error } = await query
        if (error) throw error

        return NextResponse.json({ bylaws })
    } catch (error) {
        console.error('Bylaws GET error:', error)
        return NextResponse.json({ error: 'Failed to fetch bylaws' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    const body = await req.json()

    try {
        const adminClient = createAdminClient()
        
        if (body.id) {
            // Amendment: archive old version & create new
            const { data: existing, error: fetchError } = await adminClient.from('bylaws').select('*').eq('id', body.id).single()
            
            if (existing) {
                const amendment = {
                    amended_at: new Date(),
                    resolution_id: body.resolution_id || '',
                    previous_content: existing.content,
                    description: body.amendment_description || 'Amendment'
                }

                const existingHistory = Array.isArray(existing.amendment_history) ? existing.amendment_history : []
                existingHistory.push(amendment)

                const updates: any = {
                    content: body.content,
                    title: body.title || existing.title,
                    last_amended: new Date(),
                    version: (existing.version || 1) + 1,
                    amendment_history: existingHistory,
                    updated_at: new Date()
                }

                // Update Delaware filing info if provided
                if (body.filed_with_delaware !== undefined) {
                    updates.filed_with_delaware = body.filed_with_delaware
                    updates.delaware_filing_date = body.delaware_filing_date
                    updates.delaware_filing_number = body.delaware_filing_number
                }

                const { error } = await adminClient.from('bylaws').update(updates).eq('id', body.id)
                if (error) throw error
            }
        } else {
            const { error } = await adminClient.from('bylaws').insert([{
                ...body,
                effective_date: body.effective_date || new Date(),
                version: 1,
                is_current: true
            }])
            if (error) throw error
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Bylaws POST error:', error)
        return NextResponse.json({ error: 'Failed to save bylaw' }, { status: 500 })
    }
}
