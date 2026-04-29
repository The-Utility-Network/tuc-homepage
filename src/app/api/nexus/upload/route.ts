import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const file = formData.get('file') as File | null
        const folder = (formData.get('folder') as string) || 'nexus/documents'

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
        }

        if (file.size > 50 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 })
        }

        const buffer = await file.arrayBuffer()
        const timestamp = Date.now()
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const key = `${folder}/${timestamp}_${safeName}`

        const adminClient = createAdminClient()
        
        const { data, error } = await adminClient.storage
            .from('signed-documents')
            .upload(key, buffer, {
                contentType: file.type,
                upsert: true
            })

        if (error) {
            // fallback to verification-documents if signed-documents bucket doesn't exist
            const fallback = await adminClient.storage
                .from('verification-documents')
                .upload(key, buffer, { contentType: file.type, upsert: true })
            if (fallback.error) throw fallback.error
            
            const { data: { publicUrl } } = adminClient.storage.from('verification-documents').getPublicUrl(key)
            return NextResponse.json({
                success: true,
                url: publicUrl,
                key,
                file_name: file.name,
                file_size: file.size,
            })
        }

        const { data: { publicUrl } } = adminClient.storage.from('signed-documents').getPublicUrl(key)

        return NextResponse.json({
            success: true,
            url: publicUrl,
            key,
            file_name: file.name,
            file_size: file.size,
        })
    } catch (error: any) {
        console.error('Upload error:', error)
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
    }
}
