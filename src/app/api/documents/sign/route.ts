import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { documentId, signatureData, consentText, ipAddress } = body

        if (!documentId || !signatureData) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Verify document belongs to user
        const { data: document, error: docError } = await supabase
            .from('generated_documents')
            .select('*')
            .eq('id', documentId)
            .single()

        if (docError || !document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 })
        }

        // Create signature record
        const signatureId = crypto.randomUUID()
        const timestamp = new Date().toISOString()

        const { error: sigError } = await supabase
            .from('document_signatures')
            .insert({
                id: signatureId,
                document_id: documentId,
                signer_id: user.id,
                signer_role: 'investor',
                signature_data: signatureData,
                signed_at: timestamp,
                ip_address: ipAddress,
                user_agent: request.headers.get('user-agent'),
                consent_text: consentText,
                audit_trail: {
                    timestamp,
                    userId: user.id,
                    ipAddress,
                    userAgent: request.headers.get('user-agent'),
                    documentId,
                },
            })

        if (sigError) {
            console.error('Signature save error:', sigError)
            return NextResponse.json({ error: 'Failed to save signature' }, { status: 500 })
        }

        // Update document status to signed
        const { error: updateError } = await supabase
            .from('generated_documents')
            .update({
                status: 'signed',
                finalized_at: timestamp,
            })
            .eq('id', documentId)

        if (updateError) {
            console.error('Document update error:', updateError)
        }

        return NextResponse.json({
            success: true,
            signatureId,
            timestamp,
        })
    } catch (error) {
        console.error('Signing error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
