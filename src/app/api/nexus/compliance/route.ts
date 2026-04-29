import { NextResponse, NextRequest } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET(req: NextRequest) {
    try {
        const subsidiaryId = req.nextUrl.searchParams.get('subsidiaryId')
        const filter = req.nextUrl.searchParams.get('filter') || 'all'
        
        if (!subsidiaryId) return NextResponse.json({ error: 'subsidiaryId required' }, { status: 400 })

        const adminClient = createAdminClient()
        let query = adminClient.from('compliance_tasks').select('*').eq('subsidiary_id', subsidiaryId).order('due_date', { ascending: true })
        
        if (filter === 'pending') query = query.in('status', ['pending', 'in_progress'])
        else if (filter === 'overdue') query = query.eq('status', 'overdue')
        else if (filter === 'completed') query = query.in('status', ['filed', 'completed'])

        const { data: tasks, error } = await query
        if (error) {
            console.warn('Compliance fetch error or table not found:', error)
            return NextResponse.json({ tasks: [] })
        }

        const mappedTasks = (tasks || []).map((t: any) => ({
            id: t.id, taskType: t.task_type, title: t.title,
            description: t.description || '', jurisdiction: t.jurisdiction || '',
            dueDate: t.due_date, status: t.status, priority: t.priority,
            filingReference: t.filing_reference || '', assignedTo: t.assigned_to || '',
        }))

        return NextResponse.json({ tasks: mappedTasks })
    } catch (error: any) {
        console.error('Compliance fetch error:', error)
        return NextResponse.json({ tasks: [] })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const adminClient = createAdminClient()
        const { data: task, error } = await adminClient.from('compliance_tasks').insert([body]).select().single()
        
        if (error) throw error
        
        return NextResponse.json({ success: true, id: task.id }, { status: 201 })
    } catch (error: any) {
        console.error('Compliance create error:', error)
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
    }
}
