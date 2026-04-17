import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { sendEmail, FROM_ADDRESS } from '@/lib/aws/ses'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { campaignId, commitmentAmount, number_of_shares, share_price } = body

        if (!campaignId || !commitmentAmount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Insert pending commitment
        const { error } = await supabase
            .from('campaign_commitments')
            .insert({
                campaign_id: campaignId,
                investor_id: user.id,
                commitment_amount: commitmentAmount,
                status: 'pending',
                commitment_type: 'hard', // Assuming hard commit via UI
                number_of_shares: number_of_shares || null,
                share_price: share_price || null,
            })

        if (error) {
            console.error('Commitment error:', error)
            return NextResponse.json({ error: error.message }, { status: 400 })
        }

        // Send Wire Instructions
        const userEmail = user.email || ''
        if (userEmail) {
            const wireHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h1 style="color: #000;">Commitment Received - Wiring Instructions</h1>
                    <p>Hello,</p>
                    <p>Thank you for submitting your investment commitment of <strong>$${new Intl.NumberFormat('en-US').format(commitmentAmount)}</strong> via The Utility Network Nexus.</p>
                    <p>Your allocation has been reserved as "Pending". To finalize your position on the Cap Table, please initiate a domestic wire transfer using the following instructions:</p>
                    
                    <div style="background-color: #f9f9f9; padding: 16px; border-left: 4px solid #F54029; margin: 24px 0;">
                        <p style="margin: 4px 0;"><strong>Bank Name:</strong> Mercury (Evolve Bank & Trust)</p>
                        <p style="margin: 4px 0;"><strong>Account Name:</strong> The Utility Company LLC</p>
                        <p style="margin: 4px 0;"><strong>Routing Number:</strong> (Available securely in Nexus Portal)</p>
                        <p style="margin: 4px 0;"><strong>Account Number:</strong> (Available securely in Nexus Portal)</p>
                        <p style="margin: 4px 0; margin-top: 12px;"><em>Please include your email address or Nexus ID in the wire memo so we can quickly reconcile the inbound transaction.</em></p>
                    </div>

                    <p>If you have any questions, reply to this email to speak directly with the administrative team.</p>
                    <div style="margin-top: 40px; font-size: 11px; color: #888;">
                        <p><strong>Disclaimer:</strong> This message does not constitute an offer to sell or the solicitation of an offer to buy any securities. Any such offer or solicitation will be made only by means of a confidential Private Placement Memorandum.</p>
                        <p>The Utility Network</p>
                    </div>
                </div>
            `;

            await sendEmail({
                toAddresses: [userEmail],
                subject: `Action Required: Wiring Instructions for Pending Commitment`,
                htmlBody: wireHtml
            }).catch(e => console.error('Failed sending wire instruction email:', e))
        }

        // Admin Notification
        await sendEmail({
            toAddresses: ['founders@theutilitycompany.co'],
            subject: `[Audit] New Pending Commitment Received`,
            htmlBody: `
                <h3>Commitment Trace</h3>
                <ul>
                    <li><strong>Investor:</strong> ${userEmail} (${user.id})</li>
                    <li><strong>Campaign ID:</strong> ${campaignId}</li>
                    <li><strong>Amount:</strong> $${new Intl.NumberFormat('en-US').format(commitmentAmount)}</li>
                    <li><strong>Requested Shares (Optional):</strong> ${number_of_shares || 'N/A'}</li>
                </ul>
            `
        }).catch(e => console.error('Failed sending admin commitment alert:', e))

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('API commit error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
