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

        // Get recipient count
        let recipientCount = 0
        if (recipientType === 'all_investors' || !recipientType) {
            const { count } = await supabase
                .from('campaign_commitments')
                .select('*', { count: 'exact', head: true })
                .neq('status', 'cancelled')

            recipientCount = count || 0
        } else if (recipientType === 'campaign_specific' && campaignId) {
            const { count } = await supabase
                .from('campaign_commitments')
                .select('*', { count: 'exact', head: true })
                .eq('campaign_id', campaignId)
                .neq('status', 'cancelled')

            recipientCount = count || 0
        }

        // Create update
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

        // TODO: Send actual emails to investors
        // This would integrate with your email service (e.g., SendGrid, Postmark)

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
