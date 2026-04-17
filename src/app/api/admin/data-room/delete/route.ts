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
            return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 })
        }

        const body = await request.json()
        const { fileId } = body

        if (!fileId) {
            return NextResponse.json({ error: 'Missing required field: fileId' }, { status: 400 })
        }

        const adminClient = createAdminClient()
        
        // 1. Get the file metadata to find the storage path
        const { data: fileData, error: fetchError } = await adminClient
            .from('data_room_files')
            .select('file_path')
            .eq('id', fileId)
            .single()

        if (fetchError || !fileData) {
            console.error('File fetch error:', fetchError)
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        // 2. Delete from storage bucket
        const { error: storageError } = await adminClient.storage
            .from('data-room')
            .remove([fileData.file_path])

        if (storageError) {
            console.error('Storage deletion error:', storageError)
            // Even if storage deletion fails, we might still want to delete the DB record if it's orphaned, 
            // but usually we want to throw to avoid ghost files.
            throw storageError
        }

        // 3. Delete from database
        const { error: dbError } = await adminClient
            .from('data_room_files')
            .delete()
            .eq('id', fileId)

        if (dbError) {
            console.error('DB deletion error:', dbError)
            throw dbError
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Admin POST delete file error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
