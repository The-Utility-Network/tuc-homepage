import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-server'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

async function verifyAdmin() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null

    const adminClient = createAdminClient()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') return null
    return user
}

export async function POST(request: NextRequest) {
    try {
        const admin = await verifyAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const name = formData.get('name') as string
        const description = formData.get('description') as string
        const folderId = formData.get('folderId') as string
        const subsidiaryId = formData.get('subsidiaryId') as string
        const accessLevel = formData.get('accessLevel') as string

        if (!file || !folderId || !subsidiaryId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const adminClient = createAdminClient()

        // 1. Upload to Supabase Storage
        const fileBuffer = await file.arrayBuffer()
        const fileExtension = file.name.split('.').pop()
        const fileName = `${Date.now()}_${name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExtension}`
        const storagePath = `${subsidiaryId}/${folderId}/${fileName}`

        const { error: uploadError } = await adminClient.storage
            .from('data-room')
            .upload(storagePath, fileBuffer, {
                contentType: file.type,
                upsert: true
            })

        if (uploadError) {
            console.error('Storage upload error:', uploadError)
            return NextResponse.json({ error: 'Failed to upload physical file' }, { status: 500 })
        }

        // 2. Insert DB Record
        const { data: dbData, error: dbError } = await adminClient
            .from('data_room_files')
            .insert({
                subsidiary_id: subsidiaryId,
                folder_id: folderId,
                name: name,
                description: description || '',
                file_path: storagePath,
                file_size: file.size,
                file_type: file.type,
                access_level: accessLevel || 'all_investors',
                view_count: 0,
                download_count: 0
            })
            .select()
            .single()

        if (dbError) {
            console.error('DB insert error:', dbError)
            // Rollback storage if DB fails
            await adminClient.storage.from('data-room').remove([storagePath])
            return NextResponse.json({ error: 'Failed to save metadata' }, { status: 500 })
        }

        return NextResponse.json({ success: true, file: dbData })
    } catch (error: any) {
        console.error('Upload handler error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
