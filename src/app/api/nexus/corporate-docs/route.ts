import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendDocumentUploadedEmail, sendDocumentCommentEmail } from '@/lib/aws/ses'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET(req: NextRequest) {
    try {
        const category = req.nextUrl.searchParams.get('category')
        const adminClient = createAdminClient()
        
        let query = adminClient.from('corporate_documents').select('*').order('created_at', { ascending: false })
        if (category && category !== 'all') query = query.eq('category', category)

        const { data: docs, error } = await query
        if (error) throw error

        return NextResponse.json({ documents: docs })
    } catch (error: any) {
        console.error('Corporate docs GET error:', error)
        return NextResponse.json({ documents: [] })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const adminClient = createAdminClient()

        const { data: doc, error } = await adminClient.from('corporate_documents').insert([{
            title: body.title,
            description: body.description,
            category: body.category || 'other',
            department: body.department,
            file_url: body.file_url,
            file_name: body.file_name,
            file_size: body.file_size,
            file_type: body.file_type || 'application/pdf',
            uploaded_by: body.uploaded_by,
            notify_recipients: body.notify_recipients || [],
            status: body.status || 'active',
            effective_date: body.effective_date ? new Date(body.effective_date) : undefined,
            tags: body.tags || []
        }]).select().single()

        if (error) throw error

        // Send notifications to selected recipients
        if (body.notify_recipients?.length > 0) {
            const notifications = body.notify_recipients.map((email: string) => ({
                recipient_email: email,
                type: 'document',
                title: `New Document: ${body.title}`,
                body: body.description || `A new corporate document has been uploaded: ${body.title}`,
                link: `/nexus/governance?tab=documents`,
                source_id: doc.id,
                created_at: new Date()
            }))
            await adminClient.from('notifications').insert(notifications)

            // SES: email each recipient
            for (const email of body.notify_recipients) {
                sendDocumentUploadedEmail(email, body.title, body.uploaded_by || 'Admin', body.description, doc.id)
                    .catch(err => console.error(`[SES] Doc upload notification to ${email} failed:`, err))
            }
        }

        return NextResponse.json({ success: true, id: doc.id })
    } catch (error: any) {
        console.error('Corporate docs POST error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, comment } = body
        const adminClient = createAdminClient()

        if (!id || !comment) {
            return NextResponse.json({ error: 'Missing id or comment' }, { status: 400 })
        }

        // Fetch current document to get comments array
        const { data: doc, error: fetchError } = await adminClient.from('corporate_documents').select('*').eq('id', id).single()
        if (fetchError || !doc) throw fetchError

        const comments = Array.isArray(doc.comments) ? doc.comments : []
        comments.push({
            user_email: comment.user_email,
            user_name: comment.user_name,
            text: comment.text,
            created_at: new Date()
        })

        const { error } = await adminClient.from('corporate_documents').update({
            comments,
            updated_at: new Date()
        }).eq('id', id)

        if (error) throw error

        // SES: notify the document uploader that someone commented
        if (doc.uploaded_by && doc.uploaded_by !== comment.user_email) {
            sendDocumentCommentEmail(doc.uploaded_by, doc.title, comment.user_name || comment.user_email, comment.text, id)
                .catch(err => console.error('[SES] Doc comment email failed:', err))
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Corporate docs PATCH error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

        const adminClient = createAdminClient()
        const { error } = await adminClient.from('corporate_documents').delete().eq('id', id)
        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Corporate docs DELETE error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
