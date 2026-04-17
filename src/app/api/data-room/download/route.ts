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
        const fileId = searchParams.get('id')
        
        if (!fileId) {
            return NextResponse.json({ error: 'Missing file ID' }, { status: 400 })
        }

        // 1. Verify user is logged in
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const adminClient = createAdminClient()

        // 2. Get file metadata
        const { data: fileData, error: fileError } = await adminClient
            .from('data_room_files')
            .select('*')
            .eq('id', fileId)
            .single()

        if (fileError || !fileData) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 })
        }

        // 3. Verify access (Simplified version: assume if logged in they can view, 
        // a more complex version would check the 'access_level' field vs the user's status)
        // We will increment the download count
        await adminClient
            .from('data_room_files')
            .update({ download_count: (fileData.download_count || 0) + 1 })
            .eq('id', fileId)

        // 4. Generate signed URL for download using service role (bypassing bucket RLS)
        // Valid for 60 seconds
        const { data: signedData, error: signError } = await adminClient.storage
            .from('data-room')
            .createSignedUrl(fileData.file_path, 60, {
                download: true
            })

        if (signError || !signedData?.signedUrl) {
            console.error('Signing error:', signError)
            return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
        }

        return NextResponse.redirect(signedData.signedUrl)
    } catch (error) {
        console.error('Download handler error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
