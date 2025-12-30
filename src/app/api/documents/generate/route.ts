import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { generateHtmlDocument, generateDocumentMetadata, DocumentType, DocumentVariables } from '@/lib/document-generator'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { documentType, variables, campaignId } = body as {
            documentType: DocumentType
            variables: DocumentVariables
            campaignId?: string
        }

        if (!documentType || !variables) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Generate HTML document
        const htmlContent = await generateHtmlDocument(documentType, variables)
        const metadata = generateDocumentMetadata(documentType, variables)

        // Store in database
        const { data: document, error: dbError } = await supabase
            .from('generated_documents')
            .insert({
                id: metadata.id,
                template_id: null, // Can be linked later
                investor_id: user.id,
                campaign_id: campaignId,
                document_type: documentType,
                status: 'draft',
                variables_used: variables,
                html_content: htmlContent,
            })
            .select()
            .single()

        if (dbError) {
            console.error('Database error:', dbError)
            return NextResponse.json({ error: 'Failed to save document' }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            document: {
                id: metadata.id,
                type: documentType,
                status: 'draft',
                createdAt: metadata.createdAt,
            },
            htmlContent,
        })
    } catch (error) {
        console.error('Document generation error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const documentId = searchParams.get('id')

        if (!documentId) {
            // Return all documents for user
            const { data: documents, error } = await supabase
                .from('generated_documents')
                .select('*')
                .eq('investor_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
            }

            return NextResponse.json({ documents })
        }

        // Return specific document
        const { data: document, error } = await supabase
            .from('generated_documents')
            .select('*')
            .eq('id', documentId)
            .eq('investor_id', user.id)
            .single()

        if (error || !document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 })
        }

        return NextResponse.json({ document })
    } catch (error) {
        console.error('Document fetch error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
