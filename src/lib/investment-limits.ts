/**
 * Investment Limits Logic
 * New Mexico securities law compliance for investment limits
 */

import { createClient } from './supabase'

export interface InvestmentLimit {
    maxInvestment: number
    limitDescription: string
    legalReference: string
    remainingCapacity: number
    totalInvested: number
}

export interface InvestorStatus {
    accreditationStatus: 'unknown' | 'non_accredited' | 'accredited' | 'qualified_purchaser'
    isVerified: boolean
    residenceState: string
    residenceCountry: string
    isUSPerson: boolean
    investmentLimit?: InvestmentLimit
    canInvest: boolean
    verificationPending: boolean
}

/**
 * Get investor's current status and investment limits
 */
export async function getInvestorStatus(userId: string): Promise<InvestorStatus> {
    const supabase = createClient()

    // Get investor profile
    const { data: profile, error: profileError } = await supabase
        .from('investor_profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (profileError || !profile) {
        // Return default/unknown status
        return {
            accreditationStatus: 'unknown',
            isVerified: false,
            residenceState: 'NM',
            residenceCountry: 'United States',
            isUSPerson: true,
            canInvest: false,
            verificationPending: false,
        }
    }

    // Get latest accreditation response
    const { data: accreditation } = await supabase
        .from('accreditation_responses')
        .select('*')
        .eq('investor_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    const accreditationStatus = profile.accreditation_status || 'unknown'
    const isVerified = accreditation?.verified_status === 'verified'
    const verificationPending = accreditation?.verified_status === 'pending'

    // Calculate investment limit
    let investmentLimit: InvestmentLimit | undefined

    if (accreditation) {
        const { data: limitData } = await supabase.rpc('calculate_investment_limit', {
            p_investor_id: userId,
            p_annual_income: accreditation.annual_income || accreditation.joint_income,
            p_net_worth: accreditation.net_worth,
        })

        if (limitData && limitData.length > 0) {
            const limit = limitData[0]
            investmentLimit = {
                maxInvestment: limit.max_investment,
                limitDescription: limit.limit_description,
                legalReference: limit.legal_reference,
                totalInvested: profile.total_invested || 0,
                remainingCapacity: Math.max(0, limit.max_investment - (profile.total_invested || 0)),
            }
        }
    }

    // Determine if investor can invest
    const canInvest =
        isVerified &&
        accreditationStatus !== 'unknown' &&
        (!investmentLimit || investmentLimit.remainingCapacity > 0)

    return {
        accreditationStatus,
        isVerified,
        residenceState: profile.residence_state || 'NM',
        residenceCountry: profile.residence_country || 'United States',
        isUSPerson: profile.is_us_person ?? true,
        investmentLimit,
        canInvest,
        verificationPending,
    }
}

/**
 * Check if investor can make a specific investment amount
 */
export async function canInvestAmount(
    userId: string,
    amount: number
): Promise<{
    allowed: boolean
    reason?: string
    limit?: InvestmentLimit
}> {
    const status = await getInvestorStatus(userId)

    if (status.accreditationStatus === 'unknown') {
        return {
            allowed: false,
            reason: 'Please complete accreditation verification before investing',
        }
    }

    if (!status.isVerified) {
        if (status.verificationPending) {
            return {
                allowed: false,
                reason: 'Your accreditation is pending review. Please wait for admin approval.',
            }
        }
        return {
            allowed: false,
            reason: 'Your accreditation status has not been verified',
        }
    }

    if (!status.investmentLimit) {
        return {
            allowed: false,
            reason: 'Unable to determine investment limit. Please contact support.',
        }
    }

    if (amount > status.investmentLimit.remainingCapacity) {
        return {
            allowed: false,
            reason: `Investment amount exceeds your remaining capacity of $${status.investmentLimit.remainingCapacity.toLocaleString()}`,
            limit: status.investmentLimit,
        }
    }

    return {
        allowed: true,
        limit: status.investmentLimit,
    }
}

/**
 * Format investment limit for display
 */
export function formatInvestmentLimit(limit: InvestmentLimit): string {
    if (limit.maxInvestment >= 999999999999) {
        return 'No investment limit'
    }

    return `$${limit.maxInvestment.toLocaleString()} maximum`
}

/**
 * Get investment limit description for non-accredited investors
 */
export function getInvestmentLimitExplanation(
    accreditationStatus: string,
    isUSPerson: boolean
): string {
    if (accreditationStatus === 'accredited' || accreditationStatus === 'qualified_purchaser') {
        return 'As an accredited investor, you have no investment limit.'
    }

    if (accreditationStatus === 'non_accredited') {
        if (isUSPerson) {
            return 'Under New Mexico securities law, non-accredited domestic investors may invest up to the greater of $5,000 or 10% of their annual income or net worth.'
        } else {
            return 'International non-accredited investors may invest up to 5% of their annual income or net worth, subject to applicable foreign securities regulations.'
        }
    }

    return 'Please complete accreditation verification to determine your investment limit.'
}

/**
 * Get state-specific investment limits
 */
export async function getStateLimits(
    stateCode: string
): Promise<Record<string, any>[]> {
    const supabase = createClient()

    const { data, error } = await supabase
        .from('investment_limits')
        .select('*')
        .eq('state_code', stateCode)

    if (error) {
        console.error('Error fetching state limits:', error)
        return []
    }

    return data || []
}

/**
 * Update investor's total invested amount
 */
export async function updateTotalInvested(
    userId: string,
    additionalAmount: number
): Promise<boolean> {
    const supabase = createClient()

    // Get current total
    const { data: profile } = await supabase
        .from('investor_profiles')
        .select('total_invested')
        .eq('id', userId)
        .single()

    const currentTotal = profile?.total_invested || 0
    const newTotal = currentTotal + additionalAmount

    // Update total
    const { error } = await supabase
        .from('investor_profiles')
        .update({ total_invested: newTotal, updated_at: new Date().toISOString() })
        .eq('id', userId)

    return !error
}

/**
 * Accreditation status badge configuration
 */
export const ACCREDITATION_BADGES = {
    unknown: {
        label: 'Unknown',
        color: 'gray',
        description: 'Accreditation status not yet determined',
    },
    non_accredited: {
        label: 'Non-Accredited',
        color: 'amber',
        description: 'Standard investor with investment limits',
    },
    accredited: {
        label: 'Accredited Investor',
        color: 'green',
        description: 'SEC Rule 501 accredited investor',
    },
    qualified_purchaser: {
        label: 'Qualified Purchaser',
        color: 'blue',
        description: '$5M+ net worth or assets',
    },
} as const

/**
 * Verification status badge configuration
 */
export const VERIFICATION_BADGES = {
    pending: {
        label: 'Pending Review',
        color: 'yellow',
        icon: 'Clock',
    },
    verified: {
        label: 'Verified',
        color: 'green',
        icon: 'CheckCircle',
    },
    rejected: {
        label: 'Rejected',
        color: 'red',
        icon: 'XCircle',
    },
    needs_more_info: {
        label: 'More Info Needed',
        color: 'orange',
        icon: 'AlertCircle',
    },
} as const
