'use client'

import { useEffect, useState } from 'react'
import { Shield, CheckCircle, AlertCircle, Clock, XCircle, DollarSign, Globe, MapPin } from 'lucide-react'
import { getInvestorStatus, InvestorStatus, ACCREDITATION_BADGES, VERIFICATION_BADGES, formatInvestmentLimit, getInvestmentLimitExplanation } from '@/lib/investment-limits'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'

export default function InvestorStatusCard() {
    const [status, setStatus] = useState<InvestorStatus | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        async function fetchStatus() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const investorStatus = await getInvestorStatus(user.id)
                setStatus(investorStatus)
            } catch (error) {
                console.error('Error fetching investor status:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchStatus()
    }, [])

    if (loading) {
        return (
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 animate-pulse">
                <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-white/10 rounded w-2/3"></div>
            </div>
        )
    }

    if (!status) {
        return null
    }

    const accreditationBadge = ACCREDITATION_BADGES[status.accreditationStatus]
    const verificationBadge = status.verificationPending
        ? VERIFICATION_BADGES.pending
        : status.isVerified
            ? VERIFICATION_BADGES.verified
            : VERIFICATION_BADGES.needs_more_info

    const badgeColors = {
        gray: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
        amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        green: 'bg-green-500/20 text-green-400 border-green-500/30',
        blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        red: 'bg-red-500/20 text-red-400 border-red-500/30',
        orange: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    }

    const StatusIcon = status.verificationPending
        ? Clock
        : status.isVerified
            ? CheckCircle
            : AlertCircle

    return (
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#F54029]/20 flex items-center justify-center">
                        <Shield className="text-[#F54029]" size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-rajdhani text-white">Investor Status</h2>
                        <p className="text-white/60 text-sm">Accreditation & Investment Limits</p>
                    </div>
                </div>
            </div>

            {/* Accreditation Status */}
            <div className="space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-3">
                    <div
                        className={`px-4 py-2 rounded-lg border ${badgeColors[accreditationBadge.color as keyof typeof badgeColors]
                            } font-medium text-sm`}
                    >
                        {accreditationBadge.label}
                    </div>
                    <div
                        className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${badgeColors[verificationBadge.color as keyof typeof badgeColors]
                            } font-medium text-sm`}
                    >
                        <StatusIcon size={16} />
                        {verificationBadge.label}
                    </div>
                </div>

                {/* Description */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-white/80 text-sm leading-relaxed">
                        {accreditationBadge.description}
                    </p>
                </div>

                {/* Jurisdiction */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-white/40 mb-2">
                            <MapPin size={16} />
                            <span className="text-xs uppercase tracking-wider">Residence</span>
                        </div>
                        <p className="text-white font-medium">
                            {status.residenceState ? `${status.residenceState}, ` : ''}
                            {status.residenceCountry}
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-white/40 mb-2">
                            <Globe size={16} />
                            <span className="text-xs uppercase tracking-wider">Investor Type</span>
                        </div>
                        <p className="text-white font-medium">
                            {status.isUSPerson ? 'Domestic (US)' : 'International'}
                        </p>
                    </div>
                </div>

                {/* Investment Limits */}
                {status.investmentLimit && (
                    <div className="bg-gradient-to-br from-[#F54029]/10 to-[#F54029]/5 border border-[#F54029]/20 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <DollarSign className="text-[#F54029]" size={24} />
                            <h3 className="text-white font-bold text-lg">Investment Limit</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Maximum</p>
                                <p className="text-white font-bold text-xl">
                                    {formatInvestmentLimit(status.investmentLimit)}
                                </p>
                            </div>
                            <div>
                                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Invested</p>
                                <p className="text-white font-bold text-xl">
                                    ${status.investmentLimit.totalInvested.toLocaleString()}
                                </p>
                            </div>
                            <div>
                                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Remaining</p>
                                <p className="text-green-400 font-bold text-xl">
                                    ${status.investmentLimit.remainingCapacity.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="bg-black/20 rounded-lg p-4">
                            <p className="text-white/80 text-sm leading-relaxed">
                                {status.investmentLimit.limitDescription}
                            </p>
                            {status.investmentLimit.legalReference && (
                                <p className="text-white/40 text-xs mt-2 italic">
                                    Legal basis: {status.investmentLimit.legalReference}
                                </p>
                            )}
                        </div>

                        {/* Explanation */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-white/60 text-xs leading-relaxed">
                                {getInvestmentLimitExplanation(status.accreditationStatus, status.isUSPerson)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Call to Action */}
                {!status.isVerified && (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <h4 className="text-amber-400 font-bold mb-2">Action Required</h4>
                                <p className="text-white/80 text-sm mb-4">
                                    {status.verificationPending
                                        ? 'Your accreditation is being reviewed by our compliance team. This typically takes 1-2 business days.'
                                        : status.accreditationStatus === 'unknown'
                                            ? 'Complete your accreditation questionnaire to determine your investor status and investment limits.'
                                            : 'Please upload verification documents to complete your accreditation review.'}
                                </p>
                                {status.accreditationStatus === 'unknown' && (
                                    <Link
                                        href="/nexus/onboarding"
                                        className="inline-block px-6 py-2 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg transition-all text-sm font-medium"
                                    >
                                        Start Accreditation
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {status.isVerified && status.canInvest && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <h4 className="text-green-400 font-bold mb-2">Ready to Invest</h4>
                                <p className="text-white/80 text-sm mb-4">
                                    Your accreditation has been verified. You can now invest in available opportunities.
                                </p>
                                <Link
                                    href="/nexus/ventures"
                                    className="inline-block px-6 py-2 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg transition-all text-sm font-medium"
                                >
                                    View Opportunities
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
