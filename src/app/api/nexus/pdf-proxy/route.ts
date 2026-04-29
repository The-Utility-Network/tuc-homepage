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
    if (!key) return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 })

    try {
        const adminClient = createAdminClient()
        let bucket = 'signed-documents'
        let { data, error } = await adminClient.storage.from(bucket).download(key)
        
        if (error || !data) {
            bucket = 'verification-documents'
            const fallback = await adminClient.storage.from(bucket).download(key)
            data = fallback.data
            error = fallback.error
        }

        if (error || !data) {
            return NextResponse.json({ error: 'Failed to fetch PDF from Supabase Storage' }, { status: 404 })
        }

        const buffer = await data.arrayBuffer()

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline',
                'Cache-Control': 'public, max-age=3600',
            }
        })
    } catch (error: any) {
        console.error('PDF proxy error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
