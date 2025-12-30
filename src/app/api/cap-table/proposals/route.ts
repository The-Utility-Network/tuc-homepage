import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
    const supabase = createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query params
    const searchParams = req.nextUrl.searchParams
    const subsidiaryId = searchParams.get('subsidiary_id')
    const status = searchParams.get('status')

    try {
        let query = supabase
            .from('cap_table_proposals')
            .select('*')

        if (subsidiaryId) {
            query = query.eq('subsidiary_id', subsidiaryId)
        }

        if (status) {
            query = query.eq('status', status)
        }

        const { data: proposals, error } = await query.order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ proposals })
    } catch (error: any) {
        console.error('Error fetching proposals:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

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
            proposalType,
            title,
            description,
            rationale,
            proposedChanges,
            dilutionImpact,
            ownershipBefore,
            ownershipAfter,
            valuationImpact,
            governanceRuleId,
            approvalThresholdUsed,
            requiresUnanimous,
        } = body

        // Validate required fields
        if (!subsidiaryId || !proposalType || !title || !proposedChanges) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if user is admin for this subsidiary
        const { data: isAdmin } = await supabase.rpc('is_subsidiary_admin', {
            p_user_id: user.id,
            p_subsidiary_id: subsidiaryId,
        })

        const { data: isSuperAdmin } = await supabase.rpc('is_super_admin', {
            p_user_id: user.id,
        })

        if (!isAdmin && !isSuperAdmin) {
            return NextResponse.json(
                { error: 'Only admins can create proposals' },
                { status: 403 }
            )
        }

        // Create proposal
        const { data: proposal, error } = await supabase
            .from('cap_table_proposals')
            .insert({
                subsidiary_id: subsidiaryId,
                proposal_type: proposalType,
                title,
                description,
                rationale,
                proposed_changes: proposedChanges,
                dilution_impact: dilutionImpact,
                ownership_before: ownershipBefore,
                ownership_after: ownershipAfter,
                valuation_impact: valuationImpact,
                governance_rule_id: governanceRuleId,
                approval_threshold_used: approvalThresholdUsed,
                requires_unanimous: requiresUnanimous || false,
                proposed_by: user.id,
            })
            .select()
            .single()

        if (error) throw error

        // Log activity
        await supabase.rpc('log_proposal_activity', {
            p_proposal_id: proposal.id,
            p_action_type: 'created',
        })

        return NextResponse.json({ proposal }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating proposal:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
