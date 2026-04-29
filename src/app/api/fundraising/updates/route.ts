import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/aws/ses'

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
            subsidiaryId,
            updateType,
            title,
            summary,
            content,
            keyMetrics,
            achievements,
            challenges,
            nextSteps,
            recipientType,
            campaignId,
        } = body

        // Validate
        if (!subsidiaryId || !title || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if user is admin
        const { data: isAdmin } = await supabase.rpc('is_subsidiary_admin', {
            p_user_id: user.id,
            p_subsidiary_id: subsidiaryId,
        })

        const { data: isSuperAdmin } = await supabase.rpc('is_super_admin', {
            p_user_id: user.id,
        })

        if (!isAdmin && !isSuperAdmin) {
            return NextResponse.json(
                { error: 'Only admins can send updates' },
                { status: 403 }
            )
        }

        // Resolve Recipient Emails
        let recipientEmails: string[] = []
        
        if (recipientType === 'all_investors' || !recipientType) {
            // Find all campaigns for this subsidiary
            const { data: campaigns } = await supabase
                .from('fundraising_campaigns')
                .select('id')
                .eq('subsidiary_id', subsidiaryId)
                
            const campaignIds = (campaigns || []).map(c => c.id)

            if (campaignIds.length > 0) {
                const { data: commitments } = await supabase
                    .from('campaign_commitments')
                    .select('profiles(email)')
                    .neq('status', 'cancelled')
                    .in('campaign_id', campaignIds)
                    
                const rawEmails = (commitments || []).map((c: any) => c.profiles?.email).filter(Boolean)
                recipientEmails = Array.from(new Set(rawEmails)) // Deduplicate
            }
        } else if (recipientType === 'campaign_specific' && campaignId) {
            const { data: commitments } = await supabase
                .from('campaign_commitments')
                .select('profiles(email)')
                .eq('campaign_id', campaignId)
                .neq('status', 'cancelled')
                
            const rawEmails = (commitments || []).map((c: any) => c.profiles?.email).filter(Boolean)
            recipientEmails = Array.from(new Set(rawEmails))
        }

        const recipientCount = recipientEmails.length

        // Create update record
        const { data: update, error } = await supabase
            .from('investor_updates')
            .insert({
                subsidiary_id: subsidiaryId,
                update_type: updateType || 'custom',
                title,
                summary,
                content,
                key_metrics: keyMetrics,
                achievements,
                challenges,
                next_steps: nextSteps,
                recipient_type: recipientType || 'all_investors',
                campaign_id: campaignId,
                total_recipients: recipientCount,
                sent_at: new Date().toISOString(),
                created_by: user.id,
            })
            .select()
            .single()

        if (error) throw error

        // Dispatch SES Emails
        if (recipientEmails.length > 0) {
            // Bcc everyone by looping, or sending individually to prevent seeing other investors' emails.
            // A simple approach is to use SES's sendEmail looping concurrently (for a few scale), 
            // or pass to SES in BCC. For optimal privacy, we can dispatch individual emails asynchronously.
            const htmlMessage = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #000;">${title}</h2>
                    ${summary ? `<p style="font-size: 16px; color: #555;"><em>${summary}</em></p>` : ''}
                    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 24px 0;" />
                    <div style="font-size: 14px; line-height: 1.6;">
                        ${content.replace(/\ng/g, '<br />')}
                    </div>
                    <div style="margin-top: 40px; font-size: 12px; color: #888;">
                        <p>This is an automated investor update from The Utility Network Nexus.</p>
                    </div>
                </div>
            `;
            
            // To respect SES rate limits natively for tiny sets, we just map over promises.
            await Promise.all(recipientEmails.map(email => 
                sendEmail(
                    email,
                    `[Investor Update] ${title}`,
                    htmlMessage
                )
            ));
        }

        return NextResponse.json({
            update,
            recipientCount,
            message: 'Update sent successfully'
        }, { status: 201 })
    } catch (error: any) {
        console.error('Error sending update:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
