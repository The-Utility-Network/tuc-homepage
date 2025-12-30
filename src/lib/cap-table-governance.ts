/**
 * Cap Table Governance Utilities
 * Functions for managing proposals, voting, and governance rules
 */

import { createClient } from './supabase'
import { calculateDilution, Stakeholder, DilutionImpact } from './dilution-calculator'

export interface GovernanceRule {
    id: string
    subsidiaryId: string
    ruleType: string
    title: string
    description?: string
    requiresApproval: boolean
    approvalThreshold: number
    voteWeightType: 'equal' | 'ownership_percentage' | 'share_class_weighted'
    eligibleVoters: any
    votingPeriodDays: number
    noticePeriodDays: number
    founderVeto: boolean
    boardApprovalRequired: boolean
    requiresUnanimous: boolean
    exemptions?: any
    isActive: boolean
}

export interface Proposal {
    id: string
    subsidiaryId: string
    proposalType: string
    title: string
    description?: string
    rationale?: string
    proposedChanges: any
    dilutionImpact?: DilutionImpact
    ownershipBefore?: any
    ownershipAfter?: any
    valuationImpact?: any
    status: string
    voteStartAt?: string
    voteEndAt?: string
    votesFor: number
    votesAgainst: number
    votesAbstain: number
    totalVotingPower?: number
    governanceRuleId?: string
    approvalThresholdUsed?: number
    requiresUnanimous: boolean
    proposedBy: string
    createdAt: string
    updatedAt: string
}

export interface Vote {
    id: string
    proposalId: string
    voterId: string
    voteChoice: 'for' | 'against' | 'abstain'
    voteWeight: number
    ownershipSnapshot?: any
    understandsDilution: boolean
    acknowledgedTerms: boolean
    reviewedFinancials: boolean
    signatureData?: string
    rationale?: string
    votedAt: string
}

/**
 * Get governance rules for a subsidiary
 */
export async function getGovernanceRules(subsidiaryId: string): Promise<GovernanceRule[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('governance_rules')
        .select('*')
        .eq('subsidiary_id', subsidiaryId)
        .eq('is_active', true)
        .order('rule_type')

    if (error) throw error

    return (data || []).map(rule => ({
        id: rule.id,
        subsidiaryId: rule.subsidiary_id,
        ruleType: rule.rule_type,
        title: rule.title,
        description: rule.description,
        requiresApproval: rule.requires_approval,
        approvalThreshold: rule.approval_threshold,
        voteWeightType: rule.vote_weight_type,
        eligibleVoters: rule.eligible_voters,
        votingPeriodDays: rule.voting_period_days,
        noticePeriodDays: rule.notice_period_days,
        founderVeto: rule.founder_veto,
        boardApprovalRequired: rule.board_approval_required,
        requiresUnanimous: rule.requires_unanimous,
        exemptions: rule.exemptions,
        isActive: rule.is_active,
    }))
}

/**
 * Create or update a governance rule
 */
export async function saveGovernanceRule(rule: Partial<GovernanceRule>): Promise<GovernanceRule> {
    const supabase = createClient()

    const ruleData = {
        subsidiary_id: rule.subsidiaryId,
        rule_type: rule.ruleType,
        title: rule.title,
        description: rule.description,
        requires_approval: rule.requiresApproval,
        approval_threshold: rule.approvalThreshold,
        vote_weight_type: rule.voteWeightType,
        eligible_voters: rule.eligibleVoters,
        voting_period_days: rule.votingPeriodDays,
        notice_period_days: rule.noticePeriodDays,
        founder_veto: rule.founderVeto,
        board_approval_required: rule.boardApprovalRequired,
        requires_unanimous: rule.requiresUnanimous,
        exemptions: rule.exemptions,
        is_active: rule.isActive,
    }

    if (rule.id) {
        const { data, error } = await supabase
            .from('governance_rules')
            .update(ruleData)
            .eq('id', rule.id)
            .select()
            .single()

        if (error) throw error
        return data as any
    } else {
        const { data, error } = await supabase
            .from('governance_rules')
            .insert(ruleData)
            .select()
            .single()

        if (error) throw error
        return data as any
    }
}

/**
 * Get proposals for a subsidiary
 */
export async function getProposals(
    subsidiaryId: string,
    status?: string
): Promise<Proposal[]> {
    const supabase = createClient()

    let query = supabase
        .from('cap_table_proposals')
        .select('*')
        .eq('subsidiary_id', subsidiaryId)

    if (status) {
        query = query.eq('status', status)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map(p => ({
        id: p.id,
        subsidiaryId: p.subsidiary_id,
        proposalType: p.proposal_type,
        title: p.title,
        description: p.description,
        rationale: p.rationale,
        proposedChanges: p.proposed_changes,
        dilutionImpact: p.dilution_impact,
        ownershipBefore: p.ownership_before,
        ownershipAfter: p.ownership_after,
        valuationImpact: p.valuation_impact,
        status: p.status,
        voteStartAt: p.vote_start_at,
        voteEndAt: p.vote_end_at,
        votesFor: p.votes_for,
        votesAgainst: p.votes_against,
        votesAbstain: p.votes_abstain,
        totalVotingPower: p.total_voting_power,
        governanceRuleId: p.governance_rule_id,
        approvalThresholdUsed: p.approval_threshold_used,
        requiresUnanimous: p.requires_unanimous,
        proposedBy: p.proposed_by,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
    }))
}

/**
 * Create a new proposal
 */
export async function createProposal(proposal: Partial<Proposal>): Promise<Proposal> {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('cap_table_proposals')
        .insert({
            subsidiary_id: proposal.subsidiaryId,
            proposal_type: proposal.proposalType,
            title: proposal.title,
            description: proposal.description,
            rationale: proposal.rationale,
            proposed_changes: proposal.proposedChanges,
            dilution_impact: proposal.dilutionImpact,
            ownership_before: proposal.ownershipBefore,
            ownership_after: proposal.ownershipAfter,
            valuation_impact: proposal.valuationImpact,
            governance_rule_id: proposal.governanceRuleId,
            approval_threshold_used: proposal.approvalThresholdUsed,
            requires_unanimous: proposal.requiresUnanimous,
            proposed_by: user.id,
        })
        .select()
        .single()

    if (error) throw error

    // Log activity
    await supabase.rpc('log_proposal_activity', {
        p_proposal_id: data.id,
        p_action_type: 'created',
    })

    return data as any
}

/**
 * Start voting on a proposal
 */
export async function startVoting(proposalId: string): Promise<void> {
    const supabase = createClient()

    // Get proposal and governance rule
    const { data: proposal } = await supabase
        .from('cap_table_proposals')
        .select('*, governance_rules(*)')
        .eq('id', proposalId)
        .single()

    if (!proposal) throw new Error('Proposal not found')

    const rule = proposal.governance_rules
    const voteStart = new Date()
    const voteEnd = new Date(voteStart.getTime() + (rule.voting_period_days * 24 * 60 * 60 * 1000))

    const { error } = await supabase
        .from('cap_table_proposals')
        .update({
            status: 'voting',
            vote_start_at: voteStart.toISOString(),
            vote_end_at: voteEnd.toISOString(),
        })
        .eq('id', proposalId)

    if (error) throw error

    // Log activity
    await supabase.rpc('log_proposal_activity', {
        p_proposal_id: proposalId,
        p_action_type: 'vote_started',
    })
}

/**
 * Cast a vote on a proposal
 */
export async function castVote(
    proposalId: string,
    voteChoice: 'for' | 'against' | 'abstain',
    acknowledgments: {
        understandsDilution: boolean
        acknowledgedTerms: boolean
        reviewedFinancials: boolean
    },
    signatureData?: string,
    rationale?: string
): Promise<Vote> {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Calculate vote weight
    const { data: voteWeight } = await supabase.rpc('calculate_vote_weight', {
        p_proposal_id: proposalId,
        p_voter_id: user.id,
    })

    // Get ownership snapshot
    const { data: ownership } = await supabase
        .from('cap_table')
        .select('*')
        .eq('user_id', user.id)
        .eq('subsidiary_id', (await supabase.from('cap_table_proposals').select('subsidiary_id').eq('id', proposalId).single()).data?.subsidiary_id)
        .single()

    // Insert vote
    const { data: vote, error } = await supabase
        .from('proposal_votes')
        .insert({
            proposal_id: proposalId,
            voter_id: user.id,
            vote_choice: voteChoice,
            vote_weight: voteWeight || 1,
            ownership_snapshot: ownership,
            understands_dilution: acknowledgments.understandsDilution,
            acknowledged_terms: acknowledgments.acknowledgedTerms,
            reviewed_financials: acknowledgments.reviewedFinancials,
            signature_data: signatureData,
            rationale,
        })
        .select()
        .single()

    if (error) throw error

    // Update proposal vote tallies
    const updateField = voteChoice === 'for' ? 'votes_for' : voteChoice === 'against' ? 'votes_against' : 'votes_abstain'
    await supabase.rpc('increment_vote', {
        p_proposal_id: proposalId,
        p_field: updateField,
        p_amount: voteWeight || 1,
    })

    // Log activity
    await supabase.rpc('log_proposal_activity', {
        p_proposal_id: proposalId,
        p_action_type: 'vote_cast',
        p_details: { vote_choice: voteChoice, vote_weight: voteWeight },
    })

    return vote as any
}

/**
 * Check if user has voted on a proposal
 */
export async function hasUserVoted(proposalId: string, userId?: string): Promise<boolean> {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const checkUserId = userId || user?.id

    if (!checkUserId) return false

    const { data } = await supabase
        .from('proposal_votes')
        .select('id')
        .eq('proposal_id', proposalId)
        .eq('voter_id', checkUserId)
        .single()

    return !!data
}

/**
 * Get voting results for a proposal
 */
export async function getVotingResults(proposalId: string) {
    const supabase = createClient()

    const { data: proposal } = await supabase
        .from('cap_table_proposals')
        .select('*')
        .eq('id', proposalId)
        .single()

    if (!proposal) return null

    const totalVotes = proposal.votes_for + proposal.votes_against + proposal.votes_abstain
    const forPercentage = totalVotes > 0 ? (proposal.votes_for / proposal.total_voting_power) * 100 : 0
    const againstPercentage = totalVotes > 0 ? (proposal.votes_against / proposal.total_voting_power) * 100 : 0

    const isApproved = await supabase.rpc('is_proposal_approved', {
        p_proposal_id: proposalId,
    })

    return {
        votesFor: proposal.votes_for,
        votesAgainst: proposal.votes_against,
        votesAbstain: proposal.votes_abstain,
        totalVotingPower: proposal.total_voting_power,
        forPercentage,
        againstPercentage,
        threshold: proposal.approval_threshold_used,
        isApproved: isApproved.data,
        requiresUnanimous: proposal.requires_unanimous,
    }
}
