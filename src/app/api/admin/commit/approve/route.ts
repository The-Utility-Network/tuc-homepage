import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase-server'
import { sendEmail } from '@/lib/aws/ses'

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
        const { commitmentId, campaignId, shares, certificateNumber } = body

        if (!commitmentId || !campaignId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const adminClient = createAdminClient()

        // 1. Fetch commitment to get amount
        const { data: commitment, error: commError } = await adminClient
            .from('campaign_commitments')
            .select('commitment_amount, status, investor_id')
            .eq('id', commitmentId)
            .single()

        if (commError || !commitment) return NextResponse.json({ error: 'Commitment not found' }, { status: 404 })
        if (commitment.status === 'closed') return NextResponse.json({ error: 'Commitment already closed' }, { status: 400 })

        // 2. Fetch campaign to get current progress
        const { data: campaign, error: campError } = await adminClient
            .from('fundraising_campaigns')
            .select('share_price, total_committed, total_wired, total_closed, number_of_investors, status')
            .eq('id', campaignId)
            .single()

        if (campError || !campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })

        const amount = commitment.commitment_amount

        // Calculate shares if not explicitly provided and we have a share_price
        const finalShares = shares || (campaign.share_price && campaign.share_price > 0 ? Math.floor(amount / campaign.share_price) : 0)

        // 3. Mark commitment closed
        const { error: updateCommError } = await adminClient
            .from('campaign_commitments')
            .update({
                status: 'closed',
                number_of_shares: finalShares,
                certificate_number: certificateNumber || `CERT-${commitmentId.split('-')[0].toUpperCase()}`,
                share_price: campaign.share_price || null,
                closed_at: new Date().toISOString(),
                wire_received_at: new Date().toISOString()
            })
            .eq('id', commitmentId)

        if (updateCommError) throw updateCommError

        // 4. Update campaign totals
        const newTotalClosed = (campaign.total_closed || 0) + amount
        
        const { error: updateCampError } = await adminClient
            .from('fundraising_campaigns')
            .update({
                total_closed: newTotalClosed,
                total_wired: (campaign.total_wired || 0) + amount,
                // total_committed should already include this if pending, but we'll ensure it counts just in case we didn't add it when pending
                // Actually, our UI should sum pending and closed commitments, or just closed. 
                // We'll increment total_committed if the UI requires it, but let's just make sure total_closed updates.
                number_of_investors: (campaign.number_of_investors || 0) + 1
            })
            .eq('id', campaignId)

        if (updateCampError) throw updateCampError

        // 5. Fetch investor email and send confirmation
        if (commitment.investor_id) {
            const { data: profile } = await adminClient
                .from('profiles')
                .select('email, full_name')
                .eq('id', commitment.investor_id)
                .single()
                
            if (profile?.email) {
                const confHtml = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                        <h1 style="color: #000;">Cap Table Allocation Confirmed</h1>
                        <p>Hello ${profile.full_name || ''},</p>
                        <p>We have successfully received your wire transfer and your committed capital. Your position on the Cap Table has been officially locked in.</p>
                        
                        <div style="background-color: #f9f9f9; padding: 16px; border-left: 4px solid #F54029; margin: 24px 0;">
                            <p style="margin: 4px 0;"><strong>Cleared Funds:</strong> $${new Intl.NumberFormat('en-US').format(amount)}</p>
                            <p style="margin: 4px 0;"><strong>Allocated Shares:</strong> ${new Intl.NumberFormat('en-US').format(finalShares)}</p>
                            <p style="margin: 4px 0;"><strong>Certificate Number:</strong> ${certificateNumber || `CERT-${commitmentId.split('-')[0].toUpperCase()}`}</p>
                        </div>

                        <p>You can view your fully digitized security portfolio and execute future actions directly inside The Utility Network Nexus.</p>
                        <div style="margin-top: 40px; font-size: 11px; color: #888;">
                            <p>The Utility Network Governance</p>
                        </div>
                    </div>
                `;

                await sendEmail(
                    profile.email,
                    'Official: Wire Received & Cap Table Shares Issued',
                    confHtml
                ).catch(e => console.error('Failed sending cap table conf email:', e))
            }
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Admin POST approve commitment error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
