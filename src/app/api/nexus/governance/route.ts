import { NextResponse, NextRequest } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function GET(req: NextRequest) {
    try {
        const subsidiaryId = req.nextUrl.searchParams.get('subsidiaryId')
        if (!subsidiaryId) return NextResponse.json({ error: 'subsidiaryId required' }, { status: 400 })
        
        const adminClient = createAdminClient()
        const { data: rules, error } = await adminClient
            .from('governance_rules')
            .select('*')
            .eq('subsidiary_id', subsidiaryId)
            .eq('is_active', true)

        if (error) {
            // Table might not exist in tuc-homepage yet if we didn't migrate it, just return empty array
            console.warn('Governance rules table might not exist or error:', error)
            return NextResponse.json({ rules: [] })
        }

        const mappedRules = (rules || []).map((r: any) => ({
            id: r.id, subsidiaryId: r.subsidiary_id, ruleType: r.rule_type,
            title: r.title, description: r.description, requiresApproval: r.requires_approval,
            approvalThreshold: r.approval_threshold, voteWeightType: r.vote_weight_type,
            eligibleVoters: r.eligible_voters, votingPeriodDays: r.voting_period_days,
            noticePeriodDays: r.notice_period_days, founderVeto: r.founder_veto,
            boardApprovalRequired: r.board_approval_required, requiresUnanimous: r.requires_unanimous,
            exemptions: r.exemptions, isActive: r.is_active,
        }))

        return NextResponse.json({ rules: mappedRules })
    } catch (error: any) {
        console.error('Governance fetch error:', error)
        return NextResponse.json({ rules: [] })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const adminClient = createAdminClient()

        if (body.id) {
            const { error } = await adminClient.from('governance_rules').update(body).eq('id', body.id)
            if (error) throw error
            return NextResponse.json({ success: true })
        }

        const { data, error } = await adminClient.from('governance_rules').insert([body]).select().single()
        if (error) throw error
        return NextResponse.json({ success: true, id: data.id }, { status: 201 })
    } catch (error: any) {
        console.error('Governance create error:', error)
        return NextResponse.json({ error: 'Failed to save rule' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
        const adminClient = createAdminClient()
        const { error } = await adminClient.from('governance_rules').update({ is_active: false }).eq('id', id)
        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Governance delete error:', error)
        return NextResponse.json({ error: 'Failed to delete rule' }, { status: 500 })
    }
}
