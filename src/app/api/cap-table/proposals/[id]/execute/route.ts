import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const supabase = createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id: proposalId } = await params

        // Get proposal
        const { data: proposal } = await supabase
            .from('cap_table_proposals')
            .select('*')
            .eq('id', proposalId)
            .single()

        if (!proposal) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
        }

        // Check if user is admin for this subsidiary
        const { data: isAdmin } = await supabase.rpc('is_subsidiary_admin', {
            p_user_id: user.id,
            p_subsidiary_id: proposal.subsidiary_id,
        })

        const { data: isSuperAdmin } = await supabase.rpc('is_super_admin', {
            p_user_id: user.id,
        })

        if (!isAdmin && !isSuperAdmin) {
            return NextResponse.json(
                { error: 'Only admins can execute proposals' },
                { status: 403 }
            )
        }

        // Check if proposal is approved
        if (proposal.status !== 'approved') {
            return NextResponse.json(
                { error: 'Only approved proposals can be executed' },
                { status: 400 }
            )
        }

        // Update proposal status
        const { error: updateError } = await supabase
            .from('cap_table_proposals')
            .update({
                status: 'executed',
                executed_at: new Date().toISOString(),
                executed_by: user.id,
                execution_notes: 'Proposal executed successfully',
            })
            .eq('id', proposalId)

        if (updateError) throw updateError

        // Log activity
        await supabase.rpc('log_proposal_activity', {
            p_proposal_id: proposalId,
            p_action_type: 'executed',
        })

        // TODO: Actually execute the cap table changes
        // This would involve:
        // 1. Updating cap_table entries
        // 2. Creating new stakeholder entries
        // 3. Recalculating ownership percentages
        // 4. Sending notifications

        return NextResponse.json({
            message: 'Proposal executed successfully',
            proposalId
        })
    } catch (error: any) {
        console.error('Error executing proposal:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
