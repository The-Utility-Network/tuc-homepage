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
        const { subsidiaryId, name, description, requiresNda, accessLevel } = body

        if (!subsidiaryId || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const adminClient = createAdminClient()
        
        // Insert new folder
        const { data, error } = await adminClient
            .from('data_room_folders')
            .insert({
                subsidiary_id: subsidiaryId,
                name: name,
                description: description || '',
                requires_nda: requiresNda || false,
                access_level: accessLevel || 'all_investors'
            })
            .select()
            .single()

        if (error) {
            console.error('Folder insert error:', error)
            return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 })
        }

        return NextResponse.json({ success: true, folder: data })
    } catch (error: any) {
        console.error('Admin POST folder error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
