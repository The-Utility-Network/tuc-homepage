import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const proposalId = params.id
        const body = await req.json()
        const {
            voteChoice,
            acknowledgments,
            signatureData,
            rationale,
        } = body

        // Validate required fields
        if (!voteChoice || !acknowledgments) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        if (!['for', 'against', 'abstain'].includes(voteChoice)) {
            return NextResponse.json(
                { error: 'Invalid vote choice' },
                { status: 400 }
            )
        }

        // Check if user has already voted
        const { data: existingVote } = await supabase
            .from('proposal_votes')
            .select('id')
            .eq('proposal_id', proposalId)
            .eq('voter_id', user.id)
            .single()

        if (existingVote) {
            return NextResponse.json(
                { error: 'You have already voted on this proposal' },
                { status: 400 }
            )
        }

        // Get proposal to check status and get subsidiary_id
        const { data: proposal } = await supabase
            .from('cap_table_proposals')
            .select('*, governance_rules(*)')
            .eq('id', proposalId)
            .single()

        if (!proposal) {
            return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
        }

        if (proposal.status !== 'voting') {
            return NextResponse.json(
                { error: 'Proposal is not open for voting' },
                { status: 400 }
            )
        }

        // Calculate vote weight
        const { data: voteWeight, error: weightError } = await supabase.rpc('calculate_vote_weight', {
            p_proposal_id: proposalId,
            p_voter_id: user.id,
        })

        if (weightError) throw weightError

        // Get ownership snapshot
        const { data: ownership } = await supabase
            .from('cap_table')
            .select('*')
            .eq('user_id', user.id)
            .eq('subsidiary_id', proposal.subsidiary_id)
            .single()

        // Insert vote
        const { data: vote, error: voteError } = await supabase
            .from('proposal_votes')
            .insert({
                proposal_id: proposalId,
                voter_id: user.id,
                vote_choice: voteChoice,
                vote_weight: voteWeight || 1,
                ownership_snapshot: ownership,
                understands_dilution: acknowledgments.understandsDilution || false,
                acknowledged_terms: acknowledgments.acknowledgedTerms || false,
                reviewed_financials: acknowledgments.reviewedFinancials || false,
                signature_data: signatureData,
                rationale,
            })
            .select()
            .single()

        if (voteError) throw voteError

        // Update proposal vote tallies
        const updateField = voteChoice === 'for' ? 'votes_for' :
            voteChoice === 'against' ? 'votes_against' : 'votes_abstain'

        const currentValue = proposal[updateField] || 0
        const { error: updateError } = await supabase
            .from('cap_table_proposals')
            .update({
                [updateField]: currentValue + (voteWeight || 1),
            })
            .eq('id', proposalId)

        if (updateError) throw updateError

        // Log activity
        await supabase.rpc('log_proposal_activity', {
            p_proposal_id: proposalId,
            p_action_type: 'vote_cast',
            p_details: { vote_choice: voteChoice, vote_weight: voteWeight },
        })

        // Check if proposal should be auto-approved
        const { data: isApproved } = await supabase.rpc('is_proposal_approved', {
            p_proposal_id: proposalId,
        })

        if (isApproved && new Date() > new Date(proposal.vote_end_at)) {
            await supabase
                .from('cap_table_proposals')
                .update({ status: 'approved' })
                .eq('id', proposalId)

            await supabase.rpc('log_proposal_activity', {
                p_proposal_id: proposalId,
                p_action_type: 'approved',
            })
        }

        return NextResponse.json({ vote }, { status: 201 })
    } catch (error: any) {
        console.error('Error casting vote:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
