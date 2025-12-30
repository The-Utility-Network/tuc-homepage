import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    const supabase = createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const {
            campaignId,
            commitmentAmount,
            commitmentType,
            securityType,
            numberOfShares,
            sharePrice,
        } = body

        // Validate
        if (!campaignId || !commitmentAmount) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if campaign is active
        const { data: campaign } = await supabase
            .from('fundraising_campaigns')
            .select('*')
            .eq('id', campaignId)
            .single()

        if (!campaign) {
            return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
        }

        if (campaign.status !== 'active') {
            return NextResponse.json(
                { error: 'Campaign is not accepting commitments' },
                { status: 400 }
            )
        }

        // Check minimum investment
        if (commitmentAmount < campaign.min_investment) {
            return NextResponse.json(
                { error: `Minimum investment is $${campaign.min_investment}` },
                { status: 400 }
            )
        }

        // Check if user is accredited (if required)
        const { data: investorProfile } = await supabase
            .from('investor_profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (campaign.min_investment >= 25000 && !investorProfile?.is_accredited) {
            return NextResponse.json(
                { error: 'Accreditation required for this investment amount' },
                { status: 403 }
            )
        }

        // Create commitment
        const { data: commitment, error } = await supabase
            .from('campaign_commitments')
            .insert({
                campaign_id: campaignId,
                investor_id: user.id,
                commitment_amount: commitmentAmount,
                commitment_type: commitmentType || 'soft',
                security_type: securityType,
                number_of_shares: numberOfShares,
                share_price: sharePrice,
                status: 'pending',
            })
            .select()
            .single()

        if (error) throw error

        // Update campaign totals
        await supabase
            .from('fundraising_campaigns')
            .update({
                total_committed: campaign.total_committed + commitmentAmount,
                number_of_investors: campaign.number_of_investors + 1,
            })
            .eq('id', campaignId)

        return NextResponse.json({ commitment }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating commitment:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
