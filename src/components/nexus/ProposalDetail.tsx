'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Users, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { Proposal, getVotingResults, hasUserVoted } from '@/lib/cap-table-governance'
import { getDilutionSeverity, formatDilution, Stakeholder } from '@/lib/dilution-calculator'
import { createClient } from '@/lib/supabase'

interface Props {
    proposalId: string
}

export default function ProposalDetail({ proposalId }: Props) {
    const [proposal, setProposal] = useState<Proposal | null>(null)
    const [votingResults, setVotingResults] = useState<any>(null)
    const [userHasVoted, setUserHasVoted] = useState(false)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchProposal()
    }, [proposalId])

    async function fetchProposal() {
        try {
            const { data } = await supabase
                .from('cap_table_proposals')
                .select('*')
                .eq('id', proposalId)
                .single()

            if (data) {
                setProposal(data as any)

                if (data.status === 'voting') {
                    const results = await getVotingResults(proposalId)
                    setVotingResults(results)
                }

                const voted = await hasUserVoted(proposalId)
                setUserHasVoted(voted)
            }
        } catch (error) {
            console.error('Error fetching proposal:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || !proposal) {
        return <div className="text-white/60 p-8">Loading proposal...</div>
    }

    const dilutionStakeholders: Stakeholder[] = proposal.dilutionImpact?.stakeholders || []
    const daysRemaining = proposal.voteEndAt
        ? Math.ceil((new Date(proposal.voteEndAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="flex items-center gap-3">
                    {proposal.status === 'draft' && (
                        <span className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg text-sm font-medium">
                            Draft
                        </span>
                    )}
                    {proposal.status === 'voting' && (
                        <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium flex items-center gap-2">
                            <Clock size={16} />
                            Voting ({daysRemaining} days remaining)
                        </span>
                    )}
                    {proposal.status === 'approved' && (
                        <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center gap-2">
                            <CheckCircle size={16} />
                            Approved
                        </span>
                    )}
                    {proposal.status === 'rejected' && (
                        <span className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium flex items-center gap-2">
                            <XCircle size={16} />
                            Rejected
                        </span>
                    )}
                </div>
            </div>

            {/* Title & Description */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-white mb-4 font-rajdhani">{proposal.title}</h1>
                {proposal.description && (
                    <p className="text-white/80 text-lg leading-relaxed mb-6">{proposal.description}</p>
                )}
                {proposal.rationale && (
                    <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                        <h3 className="text-white font-bold mb-3">Rationale</h3>
                        <p className="text-white/80 leading-relaxed">{proposal.rationale}</p>
                    </div>
                )}
            </div>

            {/* Proposed Changes */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 font-rajdhani flex items-center gap-3">
                    <Users className="text-[#F54029]" size={28} />
                    Proposed Changes
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {proposal.proposedChanges.round_name && (
                        <div className="bg-white/5 rounded-lg p-6">
                            <p className="text-white/60 text-sm mb-2">Round Name</p>
                            <p className="text-white text-2xl font-bold">{proposal.proposedChanges.round_name}</p>
                        </div>
                    )}
                    {proposal.proposedChanges.amount && (
                        <div className="bg-white/5 rounded-lg p-6">
                            <p className="text-white/60 text-sm mb-2">Investment Amount</p>
                            <p className="text-white text-2xl font-bold">${proposal.proposedChanges.amount.toLocaleString()}</p>
                        </div>
                    )}
                    {proposal.proposedChanges.valuation_pre && (
                        <div className="bg-white/5 rounded-lg p-6">
                            <p className="text-white/60 text-sm mb-2">Pre-Money Valuation</p>
                            <p className="text-white text-2xl font-bold">${proposal.proposedChanges.valuation_pre.toLocaleString()}</p>
                        </div>
                    )}
                    {proposal.proposedChanges.valuation_post && (
                        <div className="bg-white/5 rounded-lg p-6">
                            <p className="text-white/60 text-sm mb-2">Post-Money Valuation</p>
                            <p className="text-white text-2xl font-bold">${proposal.proposedChanges.valuation_post.toLocaleString()}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Dilution Impact */}
            {dilutionStakeholders.length > 0 && (
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 font-rajdhani flex items-center gap-3">
                        <TrendingDown className="text-[#F54029]" size={28} />
                        Dilution Impact
                    </h2>

                    <div className="space-y-4">
                        {dilutionStakeholders.map((stakeholder, idx) => {
                            const severity = stakeholder.dilutionPercent ? getDilutionSeverity(stakeholder.dilutionPercent) : null

                            return (
                                <div key={idx} className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-white font-bold text-lg">{stakeholder.name}</h3>
                                            {severity && (
                                                <span className={`inline-block px-3 py-1 rounded text-xs font-medium mt-2 ${severity.color === 'green' ? 'bg-green-500/20 text-green-400' :
                                                        severity.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            severity.color === 'orange' ? 'bg-orange-500/20 text-orange-400' :
                                                                'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {severity.description}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Current</p>
                                            <p className="text-white text-xl font-bold">{stakeholder.currentOwnership.toFixed(2)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">New</p>
                                            <p className="text-white text-xl font-bold">{stakeholder.newOwnership?.toFixed(2)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Dilution</p>
                                            <p className={`text-xl font-bold ${(stakeholder.dilutionPercent || 0) < 5 ? 'text-green-400' :
                                                    (stakeholder.dilutionPercent || 0) < 15 ? 'text-yellow-400' :
                                                        (stakeholder.dilutionPercent || 0) < 30 ? 'text-orange-400' :
                                                            'text-red-400'
                                                }`}>
                                                {stakeholder.dilution && formatDilution(stakeholder.dilution, stakeholder.dilutionPercent || 0)}
                                            </p>
                                        </div>
                                        {stakeholder.actualChange !== undefined && (
                                            <div>
                                                <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Value Change</p>
                                                <p className={`text-xl font-bold ${stakeholder.actualChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {stakeholder.actualChange >= 0 ? '+' : ''}${stakeholder.actualChange.toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Voting Results */}
            {votingResults && (
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-white mb-6 font-rajdhani">Voting Results</h2>

                    <div className="space-y-4 mb-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-white/80">For ({votingResults.forPercentage.toFixed(1)}%)</span>
                                <span className="text-white font-bold">{votingResults.votesFor.toFixed(2)}</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 transition-all"
                                    style={{ width: `${votingResults.forPercentage}%` }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-white/80">Against ({votingResults.againstPercentage.toFixed(1)}%)</span>
                                <span className="text-white font-bold">{votingResults.votesAgainst.toFixed(2)}</span>
                            </div>
                            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-red-500 transition-all"
                                    style={{ width: `${votingResults.againstPercentage}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <span className="text-white/80">Approval Threshold:</span>
                        <span className="text-white font-bold text-lg">{votingResults.threshold}%</span>
                    </div>

                    {votingResults.isApproved ? (
                        <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3">
                            <CheckCircle className="text-green-400" size={24} />
                            <span className="text-green-400 font-bold">This proposal has been approved</span>
                        </div>
                    ) : (
                        <div className="mt-4 p-4 bg-white/5 rounded-lg">
                            <span className="text-white/60 text-sm">
                                Approval threshold not yet met. {votingResults.threshold - votingResults.forPercentage > 0
                                    ? `Need ${(votingResults.threshold - votingResults.forPercentage).toFixed(1)}% more votes.`
                                    : 'Waiting for voting period to end.'}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Vote Button */}
            {proposal.status === 'voting' && !userHasVoted && (
                <div className="bg-gradient-to-r from-[#F54029]/20 to-purple-500/20 border border-[#F54029]/30 rounded-2xl p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <AlertTriangle className="text-[#F54029] flex-shrink-0" size={32} />
                        <div>
                            <h3 className="text-white font-bold text-xl mb-2">Your Vote is Required</h3>
                            <p className="text-white/80">
                                Please review the proposal details and dilution impact carefully before casting your vote.
                                You have {daysRemaining} days remaining to vote.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push(`/nexus/cap-table/proposals/${proposalId}/vote`)}
                        className="w-full px-8 py-4 bg-[#F54029] hover:bg-[#F54029]/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3"
                    >
                        <CheckCircle size={24} />
                        Cast Your Vote
                    </button>
                </div>
            )}

            {userHasVoted && proposal.status === 'voting' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 flex items-center gap-4">
                    <CheckCircle className="text-green-400" size={32} />
                    <div>
                        <p className="text-green-400 font-bold text-lg">You have voted on this proposal</p>
                        <p className="text-white/60 text-sm">Thank you for participating in governance.</p>
                    </div>
                </div>
            )}
        </div>
    )
}
