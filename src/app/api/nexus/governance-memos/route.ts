import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendMemoNotificationEmail, sendMemoStatusUpdateEmail, sendMemoCommentEmail, sendMemoResponseEmail } from '@/lib/aws/ses'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET(req: NextRequest) {
    try {
        const type = req.nextUrl.searchParams.get('type')
        const department = req.nextUrl.searchParams.get('department')
        const status = req.nextUrl.searchParams.get('status')

        const adminClient = createAdminClient()
        let query = adminClient.from('governance_memos').select('*').order('created_at', { ascending: false })

        if (type && type !== 'all') query = query.eq('type', type)
        if (department && department !== 'all') query = query.eq('department', department)
        if (status && status !== 'all') query = query.eq('status', status)

        const { data: memos, error } = await query
        if (error) {
            console.warn('Governance memos error or table missing:', error)
            return NextResponse.json({ memos: [] })
        }

        const mapped = (memos || []).map((m: any) => ({
            ...m,
            // Map table fields back to frontend expectations if necessary
        }))

        return NextResponse.json({ memos: mapped })
    } catch (error: any) {
        console.error('Governance memos GET error:', error)
        return NextResponse.json({ memos: [] })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const adminClient = createAdminClient()

        // Generate reference number
        const { count, error: countError } = await adminClient.from('governance_memos').select('*', { count: 'exact', head: true }).eq('type', body.type)
        const currentCount = count || 0
        const prefix = body.type === 'memo' ? 'MEMO' : body.type === 'proposal' ? 'PROP' : 'RPT'
        const year = new Date().getFullYear()
        const refNumber = `${prefix}-${year}-${String(currentCount + 1).padStart(3, '0')}`

        const { data: memo, error } = await adminClient.from('governance_memos').insert([{
            title: body.title,
            type: body.type,
            department: body.department,
            author_email: body.author_email,
            author_name: body.author_name,
            content: body.content,
            summary: body.summary,
            priority: body.priority || 'normal',
            status: body.status || 'draft',
            notify_recipients: body.notify_recipients || [],
            notify_all_directors: body.notify_all_directors || false,
            notify_all_officers: body.notify_all_officers || false,
            notify_departments: body.notify_departments || [],
            attachments: body.attachments || [],
            requires_response: body.requires_response || false,
            response_deadline: body.response_deadline ? new Date(body.response_deadline) : null,
            reference_number: refNumber,
            tags: body.tags || [],
            published_at: body.status === 'published' ? new Date() : null,
            created_at: new Date(),
            updated_at: new Date()
        }]).select().single()

        if (error) throw error

        // Build notification recipient list
        const recipientEmails = new Set<string>(body.notify_recipients || [])

        if (body.notify_all_directors) {
            const { data: directors } = await adminClient.from('board_members').select('email').eq('is_active', true)
            directors?.forEach((d: any) => { if (d.email) recipientEmails.add(d.email) })
        }
        if (body.notify_all_officers) {
            const { data: officers } = await adminClient.from('officers').select('email').eq('is_active', true)
            officers?.forEach((o: any) => { if (o.email) recipientEmails.add(o.email) })
        }

        const depts = body.notify_departments || []
        if (depts.length > 0) {
            const { data: deptDirectors } = await adminClient.from('board_members').select('email').eq('is_active', true).in('department', depts)
            deptDirectors?.forEach((d: any) => { if (d.email) recipientEmails.add(d.email) })
            
            const { data: deptOfficers } = await adminClient.from('officers').select('email').eq('is_active', true).in('department', depts)
            deptOfficers?.forEach((o: any) => { if (o.email) recipientEmails.add(o.email) })
        }

        if (recipientEmails.size > 0) {
            const typeLabel = body.type.charAt(0).toUpperCase() + body.type.slice(1)
            const notifications = Array.from(recipientEmails).map(email => ({
                recipient_email: email,
                type: body.type,
                title: `New ${typeLabel}: ${body.title}`,
                body: body.summary || `A new ${body.type} has been created in ${body.department}: ${body.title}`,
                link: `/nexus/governance?tab=memos`,
                source_id: memo.id,
                created_at: new Date()
            }))
            await adminClient.from('notifications').insert(notifications)

            // SES: email each recipient
            for (const email of recipientEmails) {
                sendMemoNotificationEmail(email, body.type, body.title, body.department, body.author_name || 'Unknown', body.summary, memo.id)
                    .catch(err => console.error(`[SES] Memo notification to ${email} failed:`, err))
            }
        }

        return NextResponse.json({ success: true, id: memo.id, reference_number: refNumber })
    } catch (error: any) {
        console.error('Governance memos POST error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const adminClient = createAdminClient()

        if (body.response) {
            const { data: memo, error: fetchError } = await adminClient.from('governance_memos').select('*').eq('id', body.id).single()
            if (fetchError) throw fetchError

            const responses = Array.isArray(memo.responses) ? memo.responses : []
            responses.push({
                user_email: body.response.user_email,
                user_name: body.response.user_name,
                response: body.response.response,
                comment: body.response.comment,
                responded_at: new Date()
            })

            await adminClient.from('governance_memos').update({ responses, updated_at: new Date() }).eq('id', body.id)

            if (memo.author_email && memo.author_email !== body.response.user_email) {
                sendMemoResponseEmail(memo.author_email, memo.type, memo.title, body.response.user_name || body.response.user_email, body.response.response, body.response.comment, body.id)
                    .catch(err => console.error('[SES] Memo response email failed:', err))
            }
        } else if (body.message) {
            const { data: memo, error: fetchError } = await adminClient.from('governance_memos').select('*').eq('id', body.id).single()
            if (fetchError) throw fetchError

            const messages = Array.isArray(memo.messages) ? memo.messages : []
            messages.push({
                user_email: body.message.user_email,
                user_name: body.message.user_name,
                text: body.message.text,
                created_at: new Date()
            })

            await adminClient.from('governance_memos').update({ messages, updated_at: new Date() }).eq('id', body.id)

            if (memo.author_email && memo.author_email !== body.message.user_email) {
                sendMemoCommentEmail(memo.author_email, memo.type, memo.title, body.message.user_name || body.message.user_email, body.message.text, body.id)
                    .catch(err => console.error('[SES] Memo comment email failed:', err))
            }
        } else if (body.status) {
            const update: any = { status: body.status, updated_at: new Date() }
            if (body.status === 'published') update.published_at = new Date()
            await adminClient.from('governance_memos').update(update).eq('id', body.id)

            if (['published', 'approved', 'rejected'].includes(body.status)) {
                const { data: memo } = await adminClient.from('governance_memos').select('*').eq('id', body.id).single()
                if (memo?.author_email) {
                    sendMemoStatusUpdateEmail(memo.author_email, memo.type, memo.title, body.status, body.id)
                        .catch(err => console.error('[SES] Memo status email failed:', err))
                }
            }
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Governance memos PATCH error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
        const adminClient = createAdminClient()
        await adminClient.from('governance_memos').delete().eq('id', id)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Governance memos DELETE error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
