import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { getInvestorStatus, canInvestAmount } from '@/lib/investment-limits'

/**
 * GET /api/investor/status
 * Returns the current investor's accreditation status and investment limits
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const status = await getInvestorStatus(user.id)

        return NextResponse.json({ success: true, status })
    } catch (error) {
        console.error('Status fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/investor/status
 * Check if investor can make a specific investment
 * Body: { amount: number }
 */
export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { amount } = body

        if (!amount || typeof amount !== 'number' || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
        }

        const result = await canInvestAmount(user.id, amount)

        return NextResponse.json({
            success: true,
            ...result,
        })
    } catch (error) {
        console.error('Investment check error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
