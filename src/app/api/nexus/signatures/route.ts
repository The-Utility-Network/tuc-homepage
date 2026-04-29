import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendSignatureRequestEmail, sendSignatureCompletedEmail, sendDocumentFullyExecutedEmail, sendSignatureDeclinedEmail, sendSignatureReminderEmail, sendSignatureVoidedEmail } from '@/lib/aws/ses'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET(req: NextRequest) {
    try {
        const documentId = req.nextUrl.searchParams.get('document_id')
        const signerEmail = req.nextUrl.searchParams.get('signer_email')
        const id = req.nextUrl.searchParams.get('id')
        
        const adminClient = createAdminClient()

        if (id) {
            const { data: sr, error } = await adminClient.from('signature_requests').select('*').eq('id', id).single()
            if (error || !sr) return NextResponse.json({ error: 'Not found' }, { status: 404 })
            return NextResponse.json({ request: sr })
        }

        let query = adminClient.from('signature_requests').select('*').order('created_at', { ascending: false })
        if (documentId) query = query.eq('document_id', documentId)

        const { data: requests, error } = await query
        if (error) throw error

        let filtered = requests || []
        // Manual JSONB filtering for signer email since PostgREST can be tricky with array of objects
        if (signerEmail) {
            filtered = filtered.filter((r: any) => {
                const signs = Array.isArray(r.signatories) ? r.signatories : []
                return signs.some((s: any) => s.email === signerEmail)
            })
        }

        return NextResponse.json({ requests: filtered })
    } catch (error: any) {
        console.error('Signatures GET error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { document_id, document_title, document_hash, requested_by, signatories, fields, message, expires_at } = body
        const adminClient = createAdminClient()

        const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

        const { data: sr, error } = await adminClient.from('signature_requests').insert([{
            document_id,
            document_title,
            document_hash,
            requested_by,
            status: 'pending',
            message,
            fields: fields || [],
            signatories: (signatories || []).map((s: any) => ({
                ...s,
                status: 'pending'
            })),
            audit_trail: [{
                action: 'created',
                actor_email: requested_by.email,
                actor_name: requested_by.name,
                timestamp: new Date(),
                ip_address,
                details: `Signature request created for "${document_title}" with ${signatories?.length || 0} signatories`
            }, {
                action: 'sent',
                actor_email: requested_by.email,
                actor_name: requested_by.name,
                timestamp: new Date(),
                ip_address,
                details: `Sent to: ${(signatories || []).map((s: any) => s.name || s.email).join(', ')}`
            }],
            expires_at: expires_at ? new Date(expires_at) : null,
            created_at: new Date(),
            updated_at: new Date()
        }]).select().single()

        if (error) throw error

        const notifications = (signatories || []).map((s: any) => ({
            recipient_email: s.email,
            type: 'signature',
            title: `Signature Requested: ${document_title}`,
            body: `${requested_by.name || requested_by.email} is requesting your signature${s.capacity ? ` as ${s.capacity}` : ''} on "${document_title}".${message ? ` Message: ${message}` : ''}`,
            link: `/nexus/governance?tab=documents&sign=${sr.id}`,
            source_id: sr.id,
            created_at: new Date()
        }))
        if (notifications.length > 0) {
            await adminClient.from('notifications').insert(notifications)
        }

        // SES: email each signatory
        for (const s of (signatories || [])) {
            sendSignatureRequestEmail(s.email, s.name, document_title, requested_by.name || requested_by.email, s.capacity, message, sr.id)
                .catch(err => console.error(`[SES] Signature request to ${s.email} failed:`, err))
        }

        return NextResponse.json({ success: true, id: sr.id })
    } catch (error: any) {
        console.error('Signatures POST error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json()
        const { id, action } = body
        const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
        const ua = req.headers.get('user-agent') || 'unknown'

        if (!id) return NextResponse.json({ error: 'Missing request id' }, { status: 400 })

        const adminClient = createAdminClient()
        const { data: sr, error: fetchError } = await adminClient.from('signature_requests').select('*').eq('id', id).single()
        if (fetchError || !sr) return NextResponse.json({ error: 'Signature request not found' }, { status: 404 })

        const signatories = Array.isArray(sr.signatories) ? sr.signatories : []
        const fields = Array.isArray(sr.fields) ? sr.fields : []
        const audit_trail = Array.isArray(sr.audit_trail) ? sr.audit_trail : []

        if (action === 'fill_field') {
            const { field_id, value, actor_email, actor_name } = body
            const field = fields.find((f: any) => f.field_id === field_id)
            if (!field) return NextResponse.json({ error: 'Field not found' }, { status: 404 })

            field.value = value
            field.filled_at = new Date()
            field.filled_by = actor_email

            const signatory = signatories.find((s: any) => s.email === actor_email)
            if (signatory && signatory.status === 'pending') {
                signatory.status = 'in_progress'
            }

            let newStatus = sr.status
            if (newStatus === 'pending') newStatus = 'in_progress'

            audit_trail.push({
                action: 'field_filled',
                actor_email, actor_name, timestamp: new Date(), ip_address: ip,
                details: `Filled ${field.type} field "${field.label || field.field_id}" on page ${field.page}`
            })

            await adminClient.from('signature_requests').update({
                fields, signatories, status: newStatus, audit_trail, updated_at: new Date()
            }).eq('id', id)

            return NextResponse.json({ success: true })
        }

        if (action === 'sign') {
            const { actor_email, actor_name, signature_data, initials_data } = body
            const signatory = signatories.find((s: any) => s.email === actor_email)
            if (!signatory) return NextResponse.json({ error: 'Not a signatory on this request' }, { status: 403 })

            signatory.status = 'signed'
            signatory.signature_data = signature_data
            signatory.initials_data = initials_data
            signatory.signed_at = new Date()
            signatory.ip_address = ip
            signatory.user_agent = ua

            for (const field of fields) {
                if (field.assigned_to === actor_email && !field.value) {
                    if (field.type === 'signature' && signature_data) {
                        field.value = signature_data
                        field.filled_at = new Date()
                        field.filled_by = actor_email
                    } else if (field.type === 'initials' && initials_data) {
                        field.value = initials_data
                        field.filled_at = new Date()
                        field.filled_by = actor_email
                    }
                }
            }

            audit_trail.push({
                action: 'signed',
                actor_email, actor_name, timestamp: new Date(), ip_address: ip,
                details: `${actor_name || actor_email} signed${signatory.capacity ? ` as ${signatory.capacity}` : ''} (IP: ${ip})`
            })

            const allSigned = signatories.every((s: any) => s.status === 'signed')
            let newStatus = 'in_progress'
            let completedAt = sr.completed_at

            if (allSigned) {
                newStatus = 'completed'
                completedAt = new Date()
                audit_trail.push({
                    action: 'completed',
                    actor_email: 'system', actor_name: 'System', timestamp: new Date(), ip_address: 'system',
                    details: `Document "${sr.document_title}" has been fully executed by all ${signatories.length} signatories`
                })

                const completionEmails = new Set<string>([sr.requested_by.email, ...signatories.map((s: any) => s.email)])
                const completionNotifs = Array.from(completionEmails).map(email => ({
                    recipient_email: email, type: 'signature',
                    title: `Document Fully Executed: ${sr.document_title}`,
                    body: `"${sr.document_title}" has been signed by all parties and is now fully executed.`,
                    link: `/nexus/governance?tab=documents&sign=${sr.id}`,
                    source_id: sr.id, created_at: new Date()
                }))
                await adminClient.from('notifications').insert(completionNotifs)

                for (const email of completionEmails) {
                    sendDocumentFullyExecutedEmail(email, sr.document_title, signatories.length, sr.id)
                        .catch(err => console.error(`[SES] Fully executed to ${email} failed:`, err))
                }
            } else {
                await adminClient.from('notifications').insert([{
                    recipient_email: sr.requested_by.email, type: 'signature',
                    title: `${actor_name || actor_email} Signed: ${sr.document_title}`,
                    body: `${actor_name || actor_email} has signed "${sr.document_title}"${signatory.capacity ? ` as ${signatory.capacity}` : ''}. ${signatories.filter((s: any) => s.status === 'signed').length}/${signatories.length} signatures complete.`,
                    link: `/nexus/governance?tab=documents&sign=${sr.id}`,
                    source_id: sr.id, created_at: new Date()
                }])

                const signedCount = signatories.filter((s: any) => s.status === 'signed').length;
                sendSignatureCompletedEmail(sr.requested_by.email, actor_name || actor_email, sr.document_title, signedCount, signatories.length, sr.id)
                    .catch(err => console.error('[SES] Signature progress email failed:', err))
            }

            const { data: updated, error: updateError } = await adminClient.from('signature_requests').update({
                fields, signatories, status: newStatus, completed_at: completedAt, audit_trail, updated_at: new Date()
            }).eq('id', id).select().single()

            if (updateError) throw updateError
            return NextResponse.json({ success: true, completed: allSigned, request: updated })
        }

        if (action === 'decline') {
            const { actor_email, actor_name, reason } = body
            const signatory = signatories.find((s: any) => s.email === actor_email)
            if (!signatory) return NextResponse.json({ error: 'Not a signatory' }, { status: 403 })

            signatory.status = 'declined'
            signatory.declined_at = new Date()
            signatory.decline_reason = reason || 'No reason provided'
            signatory.ip_address = ip

            audit_trail.push({
                action: 'declined', actor_email, actor_name, timestamp: new Date(), ip_address: ip,
                details: `${actor_name || actor_email} declined to sign. Reason: ${reason || 'No reason provided'}`
            })

            await adminClient.from('signature_requests').update({
                signatories, status: 'declined', audit_trail, updated_at: new Date()
            }).eq('id', id)

            await adminClient.from('notifications').insert([{
                recipient_email: sr.requested_by.email, type: 'signature',
                title: `Signature Declined: ${sr.document_title}`,
                body: `${actor_name || actor_email} declined to sign "${sr.document_title}". Reason: ${reason || 'No reason provided'}`,
                link: `/nexus/governance?tab=documents&sign=${sr.id}`,
                source_id: sr.id, created_at: new Date()
            }])

            sendSignatureDeclinedEmail(sr.requested_by.email, actor_name || actor_email, sr.document_title, reason, sr.id)
                .catch(err => console.error('[SES] Signature declined email failed:', err))

            return NextResponse.json({ success: true })
        }

        if (action === 'void') {
            const { actor_email, actor_name } = body
            audit_trail.push({
                action: 'voided', actor_email, actor_name, timestamp: new Date(), ip_address: ip,
                details: `Signature request voided by ${actor_name || actor_email}`
            })

            await adminClient.from('signature_requests').update({
                status: 'voided', voided_at: new Date(), voided_by: actor_email, audit_trail, updated_at: new Date()
            }).eq('id', id)

            const voidNotifs = signatories.filter((s: any) => s.status === 'pending' || s.status === 'in_progress').map((s: any) => ({
                recipient_email: s.email, type: 'signature',
                title: `Signature Request Voided: ${sr.document_title}`,
                body: `The signature request for "${sr.document_title}" has been voided by ${actor_name || actor_email}.`,
                link: `/nexus/governance?tab=documents`,
                source_id: sr.id, created_at: new Date()
            }))
            if (voidNotifs.length > 0) await adminClient.from('notifications').insert(voidNotifs)

            for (const s of signatories.filter((s: any) => s.status === 'pending' || s.status === 'in_progress')) {
                sendSignatureVoidedEmail(s.email, sr.document_title, actor_name || actor_email)
                    .catch(err => console.error(`[SES] Void notification to ${s.email} failed:`, err))
            }

            return NextResponse.json({ success: true })
        }

        if (action === 'remind') {
            const { actor_email, actor_name } = body
            const pendingSignatories = signatories.filter((s: any) => s.status === 'pending' || s.status === 'in_progress')

            const reminderNotifs = pendingSignatories.map((s: any) => ({
                recipient_email: s.email, type: 'signature',
                title: `Reminder: Signature Pending on ${sr.document_title}`,
                body: `${actor_name || actor_email} is reminding you to sign "${sr.document_title}"${s.capacity ? ` as ${s.capacity}` : ''}.`,
                link: `/nexus/governance?tab=documents&sign=${sr.id}`,
                source_id: sr.id, created_at: new Date()
            }))
            if (reminderNotifs.length > 0) await adminClient.from('notifications').insert(reminderNotifs)

            for (const s of pendingSignatories) {
                sendSignatureReminderEmail(s.email, s.name, sr.document_title, actor_name || actor_email, s.capacity, sr.id)
                    .catch(err => console.error(`[SES] Reminder to ${s.email} failed:`, err))
            }

            audit_trail.push({
                action: 'reminder_sent', actor_email, actor_name, timestamp: new Date(), ip_address: ip,
                details: `Reminder sent to: ${pendingSignatories.map((s: any) => s.name || s.email).join(', ')}`
            })

            await adminClient.from('signature_requests').update({
                audit_trail, updated_at: new Date()
            }).eq('id', id)

            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    } catch (error: any) {
        console.error('Signatures PATCH error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

        const adminClient = createAdminClient()
        const { data: sr, error: fetchError } = await adminClient.from('signature_requests').select('status').eq('id', id).single()
        if (fetchError || !sr) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        if (sr.status !== 'draft' && sr.status !== 'voided') {
            return NextResponse.json({ error: 'Can only delete draft or voided requests' }, { status: 400 })
        }

        await adminClient.from('signature_requests').delete().eq('id', id)
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Signatures DELETE error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
