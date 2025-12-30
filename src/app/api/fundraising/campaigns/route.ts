import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
    const supabase = createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const searchParams = req.nextUrl.searchParams
        const subsidiaryId = searchParams.get('subsidiary_id')
        const status = searchParams.get('status')

        let query = supabase
            .from('fundraising_campaigns')
            .select('*')

        if (subsidiaryId) {
            query = query.eq('subsidiary_id', subsidiaryId)
        }

        if (status) {
            query = query.eq('status', status)
        }

        const { data: campaigns, error } = await query.order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ campaigns })
    } catch (error: any) {
        console.error('Error fetching campaigns:', error)
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
            name,
            roundType,
            targetAmount,
            minAmount,
            maxAmount,
            minInvestment,
            preMoneyValuation,
            sharePrice,
            securityType,
            sharesOffered,
            launchDate,
            targetCloseDate,
        } = body

        // Validate required fields
        if (!subsidiaryId || !name || !roundType || !targetAmount) {
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
                { error: 'Only admins can create campaigns' },
                { status: 403 })
        }

        // Calculate post-money valuation
        const postMoneyValuation = preMoneyValuation ? preMoneyValuation + targetAmount : null

        // Create campaign
        const { data: campaign, error } = await supabase
            .from('fundraising_campaigns')
            .insert({
                subsidiary_id: subsidiaryId,
                name,
                round_type: roundType,
                target_amount: targetAmount,
                min_amount: minAmount,
                max_amount: maxAmount,
                min_investment: minInvestment || 25000,
                pre_money_valuation: preMoneyValuation,
                post_money_valuation: postMoneyValuation,
                share_price: sharePrice,
                security_type: securityType,
                shares_offered: sharesOffered,
                launch_date: launchDate,
                target_close_date: targetCloseDate,
                primary_contact: user.id,
                status: 'draft',
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ campaign }, { status: 201 })
    } catch (error: any) {
        console.error('Error creating campaign:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
