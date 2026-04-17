import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { sendEmail, FROM_ADDRESS } from '@/lib/aws/ses'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { signatureData, type, campaignId, amount } = body

        if (!signatureData || !type) {
            return NextResponse.json({ error: 'Missing signature payload' }, { status: 400 })
        }

        // Extract IP & User Agent for ESIGN Audit Trail
        const xForwardedFor = req.headers.get('x-forwarded-for')
        const ip = xForwardedFor ? xForwardedFor.split(',')[0] : '127.0.0.1' // fallback
        const userAgent = req.headers.get('user-agent') || 'Anonymous Client'
        const consentText = 'I consent to be legally bound by this electronic signature, under the terms of the U.S. Electronic Signatures in Global and National Commerce Act (E-Sign Act).'

        // 1. Create the Document Shell (Usually would link to a generated PDF in bucket)
        const { data: doc, error: docError } = await supabase
            .from('generated_documents')
            .insert({
                investor_id: user.id,
                campaign_id: campaignId,
                document_type: 'SAFE',
                status: 'executed', // Or signed
                variables_used: { amount, type }
            })
            .select()
            .single()

        if (docError) throw docError

        // 2. Commit the ESIGN footprint
        const { data: sig, error: sigError } = await supabase
            .from('document_signatures')
            .insert({
                document_id: doc.id,
                signer_id: user.id,
                signer_role: 'investor',
                signature_data: signatureData, // Base64 or typed name
                ip_address: ip,
                user_agent: userAgent,
                consent_text: consentText,
                audit_trail: { type, originalIp: ip, userAgent, timestamp: new Date().toISOString() }
            })
            .select()
            .single()

        if (sigError) throw sigError

        // 3. Dispatch ESIGN Compliance Receipts via SES
        const dateStr = new Date().toUTCString()
        const userEmail = user.email || ''

        const esignHtml = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <h1 style="color: #000;">Electronic Signature Confirmed</h1>
                <p>Hello,</p>
                <p>This email serves as an official receipt of your electronic signature applied via The Utility Network Nexus.</p>
                <div style="background-color: #f9f9f9; padding: 16px; border-left: 4px solid #F54029; margin-bottom: 24px;">
                    <p style="margin: 4px 0;"><strong>Document Type:</strong> ${type}</p>
                    <p style="margin: 4px 0;"><strong>Audit ID:</strong> ${sig.id}</p>
                    <p style="margin: 4px 0;"><strong>Timestamp:</strong> ${dateStr}</p>
                    <p style="margin: 4px 0;"><strong>Signer Email:</strong> ${userEmail}</p>
                </div>
                <p><em>${consentText}</em></p>
                <p>A copy of your fully executed agreement will be automatically placed in your Data Room upon administrative counter-signature.</p>
                <div style="margin-top: 40px; font-size: 12px; color: #888;">
                    <p>The Utility Company, ESIGN Compliance Gateway</p>
                </div>
            </div>
        `;

        if (userEmail) {
            await sendEmail({
                toAddresses: [userEmail],
                subject: `ESIGN Receipt: ${type} Execution [${sig.id}]`,
                htmlBody: esignHtml
            }).catch(e => console.error('Failed to send ESIGN receipt:', e))
        }

        // Admin Notification
        await sendEmail({
            toAddresses: ['founders@theutilitycompany.co'], // or FROM_ADDRESS
            subject: `[Audit] New Signature Executed`,
            htmlBody: `
                <h3>Signature Trace</h3>
                <ul>
                    <li><strong>Signer:</strong> ${userEmail} (${user.id})</li>
                    <li><strong>Audit ID:</strong> ${sig.id}</li>
                    <li><strong>Document:</strong> ${type}</li>
                    <li><strong>IP Address:</strong> ${ip}</li>
                </ul>
            `
        }).catch(e => console.error('Failed to send Admin Audit:', e))

        // Return the secure Audit ID (we'll use the signature row ID)
        return NextResponse.json({ success: true, auditId: sig.id, documentId: doc.id })

    } catch (error: any) {
        console.error('Signature Capture Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
