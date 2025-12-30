/**
 * Dilution Calculator & Cap Table Utilities
 * Calculates dilution impact and ownership changes for cap table proposals
 */

export interface Stakeholder {
    userId: string
    name: string
    currentShares: number
    currentOwnership: number
    newShares?: number
    newOwnership?: number
    dilution?: number
    dilutionPercent?: number
    currentValue?: number
    newValue?: number
    actualChange?: number
}

export interface DilutionImpact {
    stakeholders: Stakeholder[]
    totalSharesBefore: number
    totalSharesAfter: number
    newSharesIssued: number
}

export interface ValuationImpact {
    valuationPre: number
    valuationPost: number
    pricePerShare: number
    newPricePerShare?: number
}

/**
 * Calculate dilution impact of issuing new shares
 */
export function calculateDilution(
    currentCapTable: Stakeholder[],
    newShares: number,
    valuationPre?: number,
    valuationPost?: number
): DilutionImpact {
    const totalSharesBefore = currentCapTable.reduce((sum, s) => sum + s.currentShares, 0)
    const totalSharesAfter = totalSharesBefore + newShares

    const stakeholders: Stakeholder[] = currentCapTable.map(stakeholder => {
        const newOwnership = (stakeholder.currentShares / totalSharesAfter) * 100
        const dilution = stakeholder.currentOwnership - newOwnership
        const dilutionPercent = (dilution / stakeholder.currentOwnership) * 100

        let currentValue: number | undefined
        let newValue: number | undefined
        let actualChange: number | undefined

        if (valuationPre && valuationPost) {
            currentValue = (stakeholder.currentOwnership / 100) * valuationPre
            newValue = (newOwnership / 100) * valuationPost
            actualChange = newValue - currentValue
        }

        return {
            ...stakeholder,
            newShares: stakeholder.currentShares,
            newOwnership,
            dilution,
            dilutionPercent,
            currentValue,
            newValue,
            actualChange,
        }
    })

    return {
        stakeholders,
        totalSharesBefore,
        totalSharesAfter,
        newSharesIssued: newShares,
    }
}

/**
 * Calculate ownership breakdown with new investors
 */
export function calculateOwnershipWithNewInvestors(
    currentCapTable: Stakeholder[],
    newInvestments: { name: string; shares: number; userId?: string }[]
): Stakeholder[] {
    const totalSharesBefore = currentCapTable.reduce((sum, s) => sum + s.currentShares, 0)
    const newSharesTotal = newInvestments.reduce((sum, inv) => sum + inv.shares, 0)
    const totalSharesAfter = totalSharesBefore + newSharesTotal

    // Calculate dilution for existing stakeholders
    const existingStakeholders: Stakeholder[] = currentCapTable.map(stakeholder => {
        const newOwnership = (stakeholder.currentShares / totalSharesAfter) * 100
        const dilution = stakeholder.currentOwnership - newOwnership
        const dilutionPercent = (dilution / stakeholder.currentOwnership) * 100

        return {
            ...stakeholder,
            newShares: stakeholder.currentShares,
            newOwnership,
            dilution,
            dilutionPercent,
        }
    })

    // Add new investors
    const newStakeholders: Stakeholder[] = newInvestments.map(inv => ({
        userId: inv.userId || '',
        name: inv.name,
        currentShares: 0,
        currentOwnership: 0,
        newShares: inv.shares,
        newOwnership: (inv.shares / totalSharesAfter) * 100,
        dilution: 0,
        dilutionPercent: 0,
    }))

    return [...existingStakeholders, ...newStakeholders]
}

/**
 * Calculate price per share based on valuation and shares
 */
export function calculatePricePerShare(
    valuation: number,
    totalShares: number
): number {
    return valuation / totalShares
}

/**
 * Calculate post-money valuation from investment
 */
export function calculatePostMoneyValuation(
    investmentAmount: number,
    newShares: number,
    totalSharesBefore: number
): number {
    const pricePerShare = investmentAmount / newShares
    const totalSharesAfter = totalSharesBefore + newShares
    return pricePerShare * totalSharesAfter
}

/**
 * Format dilution for display
 */
export function formatDilution(dilution: number, dilutionPercent: number): string {
    const sign = dilution > 0 ? '-' : dilution < 0 ? '+' : ''
    return `${sign}${Math.abs(dilution).toFixed(2)}% (${Math.abs(dilutionPercent).toFixed(1)}% of original stake)`
}

/**
 * Determine dilution severity level
 */
export function getDilutionSeverity(dilutionPercent: number): {
    level: 'low' | 'medium' | 'high' | 'severe'
    color: string
    description: string
} {
    const absDilution = Math.abs(dilutionPercent)

    if (absDilution < 5) {
        return {
            level: 'low',
            color: 'green',
            description: 'Minor dilution',
        }
    } else if (absDilution < 15) {
        return {
            level: 'medium',
            color: 'yellow',
            description: 'Moderate dilution',
        }
    } else if (absDilution < 30) {
        return {
            level: 'high',
            color: 'orange',
            description: 'Significant dilution',
        }
    } else {
        return {
            level: 'severe',
            color: 'red',
            description: 'Major dilution - requires careful review',
        }
    }
}

/**
 * Check if stakeholder should receive special dilution warnings
 */
export function requiresSpecialWarning(
    stakeholder: Stakeholder,
    isFounder: boolean = false
): boolean {
    if (!stakeholder.dilutionPercent) return false

    // Founders get warnings at lower threshold
    const threshold = isFounder ? 10 : 20
    return Math.abs(stakeholder.dilutionPercent) >= threshold
}

/**
 * Convert ownership percentage to shares
 */
export function percentageToShares(
    percentage: number,
    totalShares: number
): number {
    return Math.round((percentage / 100) * totalShares)
}

/**
 * Convert shares to ownership percentage
 */
export function sharesToPercentage(
    shares: number,
    totalShares: number
): number {
    return (shares / totalShares) * 100
}
