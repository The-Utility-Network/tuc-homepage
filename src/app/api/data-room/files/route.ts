import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-server'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const folderId = searchParams.get('folderId')

        if (!folderId) {
            return NextResponse.json({ error: 'Missing folderId' }, { status: 400 })
        }

        // Verify auth
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const adminClient = createAdminClient()

        // Fetch files bypassing RLS
        const { data: files, error: filesError } = await adminClient
            .from('data_room_files')
            .select('*')
            .eq('folder_id', folderId)
            .order('created_at', { ascending: false })

        if (filesError) {
            console.error('Files fetch error:', filesError)
            return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 })
        }

        const formattedFiles = (files || []).map(f => ({
            id: f.id,
            name: f.name,
            description: f.description || '',
            fileSize: f.file_size || 0,
            fileType: f.file_type || 'unknown',
            accessLevel: f.access_level,
            viewCount: f.view_count || 0,
            downloadCount: f.download_count || 0,
            lastAccessedAt: f.last_accessed_at,
            uploadedAt: f.created_at,
        }))

        return NextResponse.json({ files: formattedFiles })
    } catch (error: any) {
        console.error('Data room files API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
