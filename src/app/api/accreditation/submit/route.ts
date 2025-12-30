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
        const { responses, determination, uploadedDocuments } = body

        if (!responses || !determination) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const responseId = crypto.randomUUID()

        // Save accreditation response
        const { error: dbError } = await supabase
            .from('accreditation_responses')
            .insert({
                id: responseId,
                investor_id: user.id,
                investor_type: responses.investorType,
                annual_income: responses.annualIncome,
                joint_income: responses.jointIncome,
                net_worth: responses.netWorth,
                has_series_7: responses.hasSeriesLicense || false,
                license_type: responses.licenseType,
                entity_assets: responses.entityAssets,
                all_owners_accredited: responses.allOwnersAccredited,
                is_501c3: responses.is501c3,
                trust_assets: responses.trustAssets,
                trustor_accredited: responses.trustorAccredited,
                responses: responses,
                determination: determination.status,
                determination_reasoning: determination.reasoning.join('; '),
                verified_status: 'pending',
            })

        if (dbError) {
            console.error('Database error:', dbError)
            return NextResponse.json({ error: 'Failed to save accreditation data' }, { status: 500 })
        }

        // Save uploaded document references
        if (uploadedDocuments && uploadedDocuments.length > 0) {
            const docInserts = uploadedDocuments.map((doc: any) => ({
                accreditation_id: responseId,
                investor_id: user.id,
                document_type: 'verification_document',
                file_url: doc.url,
                file_name: doc.name,
                file_size: doc.size,
                status: 'pending',
            }))

            await supabase.from('verification_documents').insert(docInserts)
        }

        // Update investor profile
        await supabase
            .from('investor_profiles')
            .update({
                accreditation_status: determination.status,
                onboarding_completed: false, // Still need to complete other steps
                onboarding_step: 'document_review', // Next step
            })
            .eq('id', user.id)

        return NextResponse.json({
            success: true,
            accreditationId: responseId,
            status: determination.status,
        })
    } catch (error) {
        console.error('Accreditation submission error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
