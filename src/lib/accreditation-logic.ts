/**
 * Accreditation Logic
 * Determines investor accreditation status based on SEC Rule 501 of Regulation D
 */

export type InvestorType = 'individual' | 'entity' | 'trust'
export type AccreditationStatus = 'non_accredited' | 'accredited' | 'qualified_purchaser'

export interface AccreditationCriteria {
    // Individual criteria
    investorType: InvestorType
    annualIncome?: number
    jointIncome?: number
    netWorth?: number
    excludePrimaryResidence?: boolean

    // Professional credentials
    hasSeriesLicense?: boolean // Series 7, 65, or 82
    licenseType?: string

    // Entity criteria
    entityAssets?: number
    allOwnersAccredited?: boolean
    is501c3?: boolean

    // Trust criteria
    trustAssets?: number
    trustorAccredited?: boolean
}

export interface AccreditationResult {
    status: AccreditationStatus
    reasoning: string[]
    meetsRequirements: boolean
    verificationNeeded: string[]
}

/**
 * Determine accreditation status based on SEC Rule 501
 */
export function determineAccreditation(criteria: AccreditationCriteria): AccreditationResult {
    const reasoning: string[] = []
    const verificationNeeded: string[] = []
    let status: AccreditationStatus = 'non_accredited'

    // Check for Qualified Purchaser status first ($5M+)
    if (criteria.investorType === 'individual') {
        if (criteria.netWorth && criteria.netWorth >= 5_000_000) {
            status = 'qualified_purchaser'
            reasoning.push('Net worth exceeds $5,000,000 qualifying as a Qualified Purchaser')
            verificationNeeded.push('Bank/brokerage statements showing net worth')
        }
    } else if (criteria.investorType === 'entity' && criteria.entityAssets && criteria.entityAssets >= 5_000_000) {
        status = 'qualified_purchaser'
        reasoning.push('Entity has assets exceeding $5,000,000 qualifying as a Qualified Purchaser')
        verificationNeeded.push('Financial statements showing entity assets')
    }

    // Check for standard Accredited Investor status
    if (status === 'non_accredited') {
        if (criteria.investorType === 'individual') {
            // Income test
            const hasIncomeQualification =
                (criteria.annualIncome && criteria.annualIncome >= 200_000) ||
                (criteria.jointIncome && criteria.jointIncome >= 300_000)

            if (hasIncomeQualification) {
                status = 'accredited'
                if (criteria.annualIncome && criteria.annualIncome >= 200_000) {
                    reasoning.push(
                        `Individual annual income of $${criteria.annualIncome.toLocaleString()} exceeds $200,000 threshold for the past 2 years`
                    )
                    verificationNeeded.push('Tax returns (Form 1040) for the past 2 years')
                }
                if (criteria.jointIncome && criteria.jointIncome >= 300_000) {
                    reasoning.push(
                        `Joint annual income of $${criteria.jointIncome.toLocaleString()} exceeds $300,000 threshold for the past 2 years`
                    )
                    verificationNeeded.push('Joint tax returns for the past 2 years')
                }
            }

            // Net worth test
            if (criteria.netWorth && criteria.netWorth >= 1_000_000) {
                status = 'accredited'
                reasoning.push(
                    `Net worth of $${criteria.netWorth.toLocaleString()} exceeds $1,000,000 threshold (excluding primary residence)`
                )
                verificationNeeded.push('Bank/brokerage statements or CPA letter confirming net worth')
            }

            // Professional credentials test
            if (criteria.hasSeriesLicense) {
                status = 'accredited'
                reasoning.push(
                    `Holds professional license in good standing (${criteria.licenseType || 'Series 7, 65, or 82'}) qualifying as an accredited investor`
                )
                verificationNeeded.push('Copy of professional license (Series 7, 65, or 82)')
            }
        } else if (criteria.investorType === 'entity') {
            // Entity with $5M+ assets (already checked above for QP)
            if (criteria.entityAssets && criteria.entityAssets >= 5_000_000) {
                status = 'accredited'
                reasoning.push(
                    `Entity has total assets of $${criteria.entityAssets.toLocaleString()} exceeding $5,000,000`
                )
                verificationNeeded.push('Audited financial statements')
            }

            // Entity where all equity owners are accredited
            if (criteria.allOwnersAccredited) {
                status = 'accredited'
                reasoning.push('All equity owners of the entity are accredited investors')
                verificationNeeded.push('Accreditation verification for all equity owners')
            }

            // 501(c)(3) organizations with $5M+ assets
            if (criteria.is501c3 && criteria.entityAssets && criteria.entityAssets >= 5_000_000) {
                status = 'accredited'
                reasoning.push('501(c)(3) organization with assets exceeding $5,000,000')
                verificationNeeded.push('501(c)(3) determination letter and financial statements')
            }
        } else if (criteria.investorType === 'trust') {
            if (criteria.trustAssets && criteria.trustAssets >= 5_000_000) {
                status = 'accredited'
                reasoning.push(
                    `Trust has assets exceeding $5,000,000`
                )
                verificationNeeded.push('Trust agreement and financial statements')
            }

            if (criteria.trustorAccredited) {
                status = 'accredited'
                reasoning.push('Trust formed by an accredited investor (revocable trust)')
                verificationNeeded.push('Accreditation verification of trustor')
            }
        }
    }

    // If still non-accredited, provide reasoning
    if (status === 'non_accredited') {
        reasoning.push('Does not meet any of the SEC Rule 501 accredited investor criteria')

        if (criteria.investorType === 'individual') {
            if (!criteria.annualIncome || criteria.annualIncome < 200_000) {
                reasoning.push('Individual income is below $200,000 threshold')
            }
            if (!criteria.jointIncome || criteria.jointIncome < 300_000) {
                reasoning.push('Joint income is below $300,000 threshold')
            }
            if (!criteria.netWorth || criteria.netWorth < 1_000_000) {
                reasoning.push('Net worth is below $1,000,000 threshold (excluding primary residence)')
            }
            if (!criteria.hasSeriesLicense) {
                reasoning.push('Does not hold Series 7, 65, or 82 license')
            }
        }
    }

    return {
        status,
        reasoning,
        meetsRequirements: status !== 'non_accredited',
        verificationNeeded,
    }
}

/**
 * Helper function to calculate net worth excluding primary residence
 */
export function calculateNetWorth(
    totalAssets: number,
    totalLiabilities: number,
    primaryResidenceValue: number = 0,
    primaryResidenceMortgage: number = 0
): number {
    // Exclude primary residence from assets
    const assetsExcludingHome = totalAssets - primaryResidenceValue

    // Exclude primary residence mortgage from liabilities
    // BUT include any mortgage amount that exceeds the home value (underwater mortgage)
    const mortgageToInclude = Math.max(0, primaryResidenceMortgage - primaryResidenceValue)
    const liabilitiesExcludingHomeMortgage = totalLiabilities - primaryResidenceMortgage + mortgageToInclude

    return assetsExcludingHome - liabilitiesExcludingHomeMortgage
}

/**
 * Validate income consistency over years
 */
export function validateIncomeHistory(incomeByYear: Record<number, number>): {
    isConsistent: boolean
    meetsThreshold: boolean
    threshold: number
} {
    const years = Object.keys(incomeByYear).map(Number).sort()
    if (years.length < 2) {
        return { isConsistent: false, meetsThreshold: false, threshold: 200_000 }
    }

    const recentYears = years.slice(-2)
    const incomes = recentYears.map(year => incomeByYear[year])
    const meetsThreshold = incomes.every(income => income >= 200_000)

    return {
        isConsistent: true,
        meetsThreshold,
        threshold: 200_000,
    }
}
