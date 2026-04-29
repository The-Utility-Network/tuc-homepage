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
        const timeframe = req.nextUrl.searchParams.get('timeframe') || 'YTD'
        
        if (!subsidiaryId) return NextResponse.json({ error: 'subsidiaryId required' }, { status: 400 })

        const adminClient = createAdminClient()
        let query = adminClient.from('financial_snapshots').select('*').eq('subsidiary_id', subsidiaryId).order('period_start', { ascending: false })

        if (timeframe === 'YTD') {
            const startOfYear = new Date(new Date().getFullYear(), 0, 1)
            query = query.gte('period_start', startOfYear.toISOString())
        }

        const { data: snapshots, error } = await query
        if (error) {
            console.warn('Financials fetch error or table not found:', error)
            return NextResponse.json({ snapshots: [] })
        }

        const mapped = (snapshots || []).map((s: any) => ({
            id: s.id, subsidiaryId: s.subsidiary_id,
            periodStart: s.period_start, periodEnd: s.period_end,
            revenue: s.revenue, expenses: s.expenses,
            netIncome: s.net_income, cashOnHand: s.cash_on_hand,
            burnRate: s.burn_rate, runwayMonths: s.runway_months,
            metrics: s.metrics || {},
            reportedBy: s.reported_by, reportDate: s.report_date
        }))

        return NextResponse.json({ snapshots: mapped })
    } catch (error: any) {
        console.error('Financials fetch error:', error)
        return NextResponse.json({ snapshots: [] })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const adminClient = createAdminClient()
        
        const payload = {
            subsidiary_id: body.subsidiaryId,
            period_start: body.periodStart,
            period_end: body.periodEnd,
            revenue: body.revenue || 0,
            expenses: body.expenses || 0,
            net_income: (body.revenue || 0) - (body.expenses || 0),
            cash_on_hand: body.cashOnHand || 0,
            burn_rate: body.burnRate || 0,
            runway_months: body.runwayMonths || 0,
            metrics: body.metrics || {},
            reported_by: body.reportedBy,
            report_date: new Date()
        }

        const { data, error } = await adminClient.from('financial_snapshots').insert([payload]).select().single()
        if (error) throw error
        
        return NextResponse.json({ success: true, id: data.id }, { status: 201 })
    } catch (error: any) {
        console.error('Financials POST error:', error)
        return NextResponse.json({ error: 'Failed to create snapshot' }, { status: 500 })
    }
}
