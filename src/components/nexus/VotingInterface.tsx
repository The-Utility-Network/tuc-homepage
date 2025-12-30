'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, AlertTriangle, FileText, TrendingDown, Shield, Pen } from 'lucide-react'
import { castVote } from '@/lib/cap-table-governance'
import { getDilutionSeverity } from '@/lib/dilution-calculator'
import SignaturePad from './SignaturePad'

interface Props {
    proposal: any
    userStakeholder?: any
}

export default function VotingInterface({ proposal, userStakeholder }: Props) {
    const [step, setStep] = useState(1)
    const [voteChoice, setVoteChoice] = useState<'for' | 'against' | 'abstain' | null>(null)
    const [acknowledgments, setAcknowledgments] = useState({
        understandsDilution: false,
        acknowledgedTerms: false,
        reviewedFinancials: false,
    })
    const [rationale, setRationale] = useState('')
    const [signature, setSignature] = useState<string>('')
    const [submitting, setSubmitting] = useState(false)
    const [timeOnStep, setTimeOnStep] = useState<Record<number, number>>({})
    const router = useRouter()

    const totalSteps = 7
    const dilutionSeverity = userStakeholder?.dilutionPercent
        ? getDilutionSeverity(userStakeholder.dilutionPercent)
        : null

    // Track time spent on each step (minimum 5 seconds per step for important ones)
    const canProceed = (currentStep: number) => {
        const minTime = [2, 3, 4, 5].includes(currentStep) ? 5000 : 0
        const timeSpent = timeOnStep[currentStep] || 0
        return timeSpent >= minTime
    }

    const handleNext = () => {
        if (step < totalSteps) {
            setTimeOnStep(prev => ({ ...prev, [step]: Date.now() - (prev[step] || Date.now()) }))
            setStep(step + 1)
            setTimeOnStep(prev => ({ ...prev, [step + 1]: Date.now() }))
        }
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = async () => {
        if (!voteChoice || !signature) return

        setSubmitting(true)
        try {
            await castVote(
                proposal.id,
                voteChoice,
                acknowledgments,
                signature,
                rationale || undefined
            )

            // Redirect to proposal detail with success message
            router.push(`/nexus/cap-table/proposals/${proposal.id}?voted=true`)
        } catch (error) {
            console.error('Error casting vote:', error)
            alert('Failed to submit vote. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const allAcknowledged = acknowledgments.understandsDilution &&
        acknowledgments.acknowledgedTerms &&
        acknowledgments.reviewedFinancials

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-white/60 text-sm">Step {step} of {totalSteps}</span>
                    <span className="text-white/60 text-sm">{Math.round((step / totalSteps) * 100)}% Complete</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#F54029] transition-all duration-300"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                {/* Step 1: Review Proposal */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="text-[#F54029]" size={32} />
                            <h2 className="text-2xl font-bold text-white font-rajdhani">Review Proposal</h2>
                        </div>

                        <div className="bg-white/5 rounded-lg p-6 space-y-4">
                            <div>
                                <h3 className="text-white font-bold text-xl mb-2">{proposal.title}</h3>
                                <p className="text-white/80">{proposal.description}</p>
                            </div>

                            {proposal.rationale && (
                                <div className="border-t border-white/10 pt-4">
                                    <h4 className="text-white/60 text-sm uppercase tracking-wider mb-2">Rationale</h4>
                                    <p className="text-white/80">{proposal.rationale}</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {proposal.proposedChanges.amount && (
                                <div className="bg-white/5 rounded-lg p-4">
                                    <p className="text-white/60 text-sm mb-1">Investment Amount</p>
                                    <p className="text-white text-xl font-bold">${proposal.proposedChanges.amount.toLocaleString()}</p>
                                </div>
                            )}
                            {proposal.proposedChanges.valuation_post && (
                                <div className="bg-white/5 rounded-lg p-4">
                                    <p className="text-white/60 text-sm mb-1">Post-Money Valuation</p>
                                    <p className="text-white text-xl font-bold">${proposal.proposedChanges.valuation_post.toLocaleString()}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 2: Understand Dilution */}
                {step === 2 && userStakeholder && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingDown className="text-[#F54029]" size={32} />
                            <h2 className="text-2xl font-bold text-white font-rajdhani">Understand Your Dilution</h2>
                        </div>

                        {dilutionSeverity && dilutionSeverity.level !== 'low' && (
                            <div className={`p-6 rounded-lg border ${dilutionSeverity.level === 'severe' ? 'bg-red-500/10 border-red-500/30' :
                                dilutionSeverity.level === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                                    'bg-yellow-500/10 border-yellow-500/30'
                                } flex items-start gap-4`}>
                                <AlertTriangle className={
                                    dilutionSeverity.level === 'severe' ? 'text-red-400' :
                                        dilutionSeverity.level === 'high' ? 'text-orange-400' :
                                            'text-yellow-400'
                                } size={32} />
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-2">Important: {dilutionSeverity.description}</h3>
                                    <p className="text-white/80">Please carefully review the impact on your ownership below.</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white/5 rounded-lg p-6">
                            <h3 className="text-white font-bold mb-6">Your Ownership Impact</h3>

                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="text-center p-6 bg-black/20 rounded-lg">
                                    <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Current Ownership</p>
                                    <p className="text-white text-4xl font-bold">{userStakeholder.currentOwnership.toFixed(2)}%</p>
                                </div>
                                <div className="text-center p-6 bg-black/20 rounded-lg">
                                    <p className="text-white/60 text-sm uppercase tracking-wider mb-2">New Ownership</p>
                                    <p className="text-white text-4xl font-bold">{userStakeholder.newOwnership?.toFixed(2)}%</p>
                                </div>
                            </div>

                            <div className="text-center p-6 bg-gradient-to-r from-[#F54029]/10 to-purple-500/10 border border-[#F54029]/30 rounded-lg">
                                <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Dilution</p>
                                <p className={`text-5xl font-bold ${(userStakeholder.dilutionPercent || 0) < 5 ? 'text-green-400' :
                                    (userStakeholder.dilutionPercent || 0) < 15 ? 'text-yellow-400' :
                                        (userStakeholder.dilutionPercent || 0) < 30 ? 'text-orange-400' :
                                            'text-red-400'
                                    }`}>
                                    -{userStakeholder.dilution?.toFixed(2)}%
                                </p>
                                <p className="text-white/60 text-sm mt-2">
                                    ({Math.abs(userStakeholder.dilutionPercent || 0).toFixed(1)}% of your original stake)
                                </p>
                            </div>

                            {userStakeholder.actualChange !== undefined && (
                                <div className="mt-6 text-center">
                                    <p className="text-white/60 text-sm mb-2">Estimated Value Impact</p>
                                    <p className={`text-2xl font-bold ${userStakeholder.actualChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {userStakeholder.actualChange >= 0 ? '+' : ''}${userStakeholder.actualChange.toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Review Terms */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="text-[#F54029]" size={32} />
                            <h2 className="text-2xl font-bold text-white font-rajdhani">Terms & Conditions</h2>
                        </div>

                        <div className="bg-white/5 rounded-lg p-6 max-h-96 overflow-y-auto space-y-4">
                            <div>
                                <h3 className="text-white font-bold mb-2">Voting Rights Agreement</h3>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    By participating in this governance vote, you acknowledge and agree that:
                                </p>
                                <ul className="list-disc list-inside text-white/80 text-sm space-y-2 mt-3 ml-4">
                                    <li>Your vote is binding and cannot be changed once submitted</li>
                                    <li>You have reviewed and understand the dilution impact on your ownership</li>
                                    <li>You have had adequate time to review the proposal details</li>
                                    <li>You are voting in accordance with your fiduciary duties (if applicable)</li>
                                    <li>The vote will be recorded with a complete audit trail</li>
                                </ul>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <h3 className="text-white font-bold mb-2">Dilution Disclosure</h3>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    You acknowledge that approving this proposal will result in dilution of your ownership percentage
                                    as detailed in this voting interface. While your ownership percentage will decrease, the value of
                                    your stake may increase if the company valuation increases proportionally or more.
                                </p>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <h3 className="text-white font-bold mb-2">Information Rights</h3>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    You have the right to request additional information about this proposal from the company's
                                    management or board of directors before casting your vote. Contact the company administrator
                                    if you require clarification on any aspect of this proposal.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Acknowledge Understanding */}
                {step === 4 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <CheckCircle className="text-[#F54029]" size={32} />
                            <h2 className="text-2xl font-bold text-white font-rajdhani">Acknowledge Understanding</h2>
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-start gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={acknowledgments.understandsDilution}
                                    onChange={(e) => setAcknowledgments(prev => ({ ...prev, understandsDilution: e.target.checked }))}
                                    className="mt-1 w-5 h-5 accent-[#F54029]"
                                />
                                <div>
                                    <p className="text-white font-medium">I understand this will dilute my ownership</p>
                                    {userStakeholder && (
                                        <p className="text-white/60 text-sm mt-1">
                                            from {userStakeholder.currentOwnership.toFixed(2)}% to {userStakeholder.newOwnership?.toFixed(2)}%
                                        </p>
                                    )}
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={acknowledgments.reviewedFinancials}
                                    onChange={(e) => setAcknowledgments(prev => ({ ...prev, reviewedFinancials: e.target.checked }))}
                                    className="mt-1 w-5 h-5 accent-[#F54029]"
                                />
                                <div>
                                    <p className="text-white font-medium">I have reviewed the financial impact of this change</p>
                                    <p className="text-white/60 text-sm mt-1">
                                        Including valuation, pricing, and economic terms
                                    </p>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={acknowledgments.acknowledgedTerms}
                                    onChange={(e) => setAcknowledgments(prev => ({ ...prev, acknowledgedTerms: e.target.checked }))}
                                    className="mt-1 w-5 h-5 accent-[#F54029]"
                                />
                                <div>
                                    <p className="text-white font-medium">I acknowledge the terms and conditions</p>
                                    <p className="text-white/60 text-sm mt-1">
                                        I have read and agree to the voting rights agreement
                                    </p>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-4 bg-gradient-to-r from-[#F54029]/10 to-purple-500/10 border border-[#F54029]/30 rounded-lg">
                                <input
                                    type="checkbox"
                                    checked={allAcknowledged}
                                    disabled
                                    className="mt-1 w-5 h-5"
                                />
                                <div>
                                    <p className="text-white font-bold">I understand this vote is binding</p>
                                    <p className="text-white/60 text-sm mt-1">
                                        Once submitted, your vote cannot be changed
                                    </p>
                                </div>
                            </label>
                        </div>

                        {!allAcknowledged && (
                            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-3">
                                <AlertTriangle className="text-orange-400" size={20} />
                                <p className="text-orange-400 text-sm">You must check all boxes to proceed</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 5: Cast Vote */}
                {step === 5 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white font-rajdhani mb-6">Cast Your Vote</h2>

                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => setVoteChoice('for')}
                                className={`p-6 rounded-lg border-2 transition-all ${voteChoice === 'for'
                                    ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20'
                                    : 'bg-white/5 border-white/10 hover:border-green-500/50'
                                    }`}
                            >
                                <CheckCircle className={`mx-auto mb-3 ${voteChoice === 'for' ? 'text-green-400' : 'text-white/40'}`} size={48} />
                                <p className="text-white font-bold text-center">For</p>
                            </button>

                            <button
                                onClick={() => setVoteChoice('against')}
                                className={`p-6 rounded-lg border-2 transition-all ${voteChoice === 'against'
                                    ? 'bg-red-500/20 border-red-500 shadow-lg shadow-red-500/20'
                                    : 'bg-white/5 border-white/10 hover:border-red-500/50'
                                    }`}
                            >
                                <AlertTriangle className={`mx-auto mb-3 ${voteChoice === 'against' ? 'text-red-400' : 'text-white/40'}`} size={48} />
                                <p className="text-white font-bold text-center">Against</p>
                            </button>

                            <button
                                onClick={() => setVoteChoice('abstain')}
                                className={`p-6 rounded-lg border-2 transition-all ${voteChoice === 'abstain'
                                    ? 'bg-gray-500/20 border-gray-500 shadow-lg shadow-gray-500/20'
                                    : 'bg-white/5 border-white/10 hover:border-gray-500/50'
                                    }`}
                            >
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full border-4 border-current" style={{ color: voteChoice === 'abstain' ? '#9ca3af' : 'rgba(255,255,255,0.4)' }} />
                                <p className="text-white font-bold text-center">Abstain</p>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 6: Optional Rationale */}
                {step === 6 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white font-rajdhani mb-6">Explain Your Vote (Optional)</h2>

                        <textarea
                            value={rationale}
                            onChange={(e) => setRationale(e.target.value)}
                            placeholder="You may provide a brief explanation for your vote..."
                            className="w-full h-40 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:border-[#F54029] focus:outline-none resize-none"
                        />

                        <p className="text-white/60 text-sm">
                            Your rationale will be recorded in the voting history but is not required.
                        </p>
                    </div>
                )}

                {/* Step 7: Sign */}
                {step === 7 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Pen className="text-[#F54029]" size={32} />
                            <h2 className="text-2xl font-bold text-white font-rajdhani">Sign Your Vote</h2>
                        </div>

                        <div className="bg-white/5 rounded-lg p-6">
                            <SignaturePad onSave={setSignature} />
                        </div>

                        <div className="p-4 bg-white/5 rounded-lg">
                            <h4 className="text-white font-bold mb-2">Vote Summary</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-white/60">Your Vote:</span>
                                    <span className={`font-bold ${voteChoice === 'for' ? 'text-green-400' :
                                        voteChoice === 'against' ? 'text-red-400' :
                                            'text-gray-400'
                                        }`}>
                                        {voteChoice?.toUpperCase()}
                                    </span>
                                </div>
                                {userStakeholder && (
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Ownership After:</span>
                                        <span className="text-white font-bold">{userStakeholder.newOwnership?.toFixed(2)}%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                    {step > 1 && (
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                        >
                            Back
                        </button>
                    )}

                    {step < totalSteps && (
                        <button
                            onClick={handleNext}
                            disabled={(step === 4 && !allAcknowledged) || (step === 5 && !voteChoice)}
                            className="px-8 py-3 bg-[#F54029] hover:bg-[#F54029]/90 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-all ml-auto"
                        >
                            Continue
                        </button>
                    )}

                    {step === totalSteps && (
                        <button
                            onClick={handleSubmit}
                            disabled={!signature || !voteChoice || submitting}
                            className="px-8 py-3 bg-[#F54029] hover:bg-[#F54029]/90 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-all ml-auto flex items-center gap-2"
                        >
                            {submitting ? 'Submitting...' : 'Submit Vote'}
                            <CheckCircle size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
