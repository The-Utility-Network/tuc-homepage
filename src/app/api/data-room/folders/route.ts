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
        const subsidiaryId = searchParams.get('subsidiaryId')

        if (!subsidiaryId) {
            return NextResponse.json({ error: 'Missing subsidiaryId' }, { status: 400 })
        }

        // Verify auth (all users with an account can see folders, we filter contents later)
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const adminClient = createAdminClient()

        // Fetch folders bypassing RLS
        const { data: folders, error: foldersError } = await adminClient
            .from('data_room_folders')
            .select('*')
            .eq('subsidiary_id', subsidiaryId)
            .is('parent_id', null)
            .order('display_order')

        if (foldersError) {
            console.error('Folders fetch error:', foldersError)
            return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 })
        }

        // Attach file counts
        const foldersWithCounts = await Promise.all(
            (folders || []).map(async (folder) => {
                const { count } = await adminClient
                    .from('data_room_files')
                    .select('*', { count: 'exact', head: true })
                    .eq('folder_id', folder.id)

                return {
                    id: folder.id,
                    name: folder.name,
                    description: folder.description || '',
                    icon: folder.icon || 'folder',
                    accessLevel: folder.access_level,
                    requiresNda: folder.requires_nda,
                    fileCount: count || 0,
                }
            })
        )

        return NextResponse.json({ folders: foldersWithCounts })
    } catch (error: any) {
        console.error('Data room folders API error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
