'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, TrendingDown, FileText, Settings, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import {
    calculateDilution,
    calculateOwnershipWithNewInvestors,
    calculatePostMoneyValuation,
    getDilutionSeverity,
    Stakeholder
} from '@/lib/dilution-calculator'
import { getGovernanceRules, GovernanceRule } from '@/lib/cap-table-governance'

interface Props {
    subsidiaryId: string
}

export default function ProposalWizard({ subsidiaryId }: Props) {
    const [step, setStep] = useState(1)
    const [proposalType, setProposalType] = useState<string>('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [rationale, setRationale] = useState('')

    // Fundraising specific
    const [roundName, setRoundName] = useState('')
    const [investmentAmount, setInvestmentAmount] = useState(0)
    const [valuationPre, setValuationPre] = useState(0)
    const [newInvestors, setNewInvestors] = useState<{ name: string; amount: number }[]>([])

    // Calculated values
    const [currentCapTable, setCurrentCapTable] = useState<Stakeholder[]>([])
    const [totalShares, setTotalShares] = useState(0)
    const [dilutionImpact, setDilutionImpact] = useState<any>(null)
    const [ownershipAfter, setOwnershipAfter] = useState<Stakeholder[]>([])

    // Governance
    const [governanceRules, setGovernanceRules] = useState<GovernanceRule[]>([])
    const [selectedRule, setSelectedRule] = useState<GovernanceRule | null>(null)
    const [requiresUnanimous, setRequiresUnanimous] = useState(false)

    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const totalSteps = 5

    useEffect(() => {
        fetchCapTable()
        fetchGovernanceRules()
    }, [subsidiaryId])

    async function fetchCapTable() {
        const { data } = await supabase
            .from('cap_table')
            .select('*, profiles(full_name)')
            .eq('subsidiary_id', subsidiaryId)

        if (data) {
            const stakeholders: Stakeholder[] = data.map((entry: any) => ({
                userId: entry.user_id,
                name: entry.profiles?.full_name || 'Unknown',
                currentShares: entry.shares,
                currentOwnership: entry.ownership_percentage,
            }))

            setCurrentCapTable(stakeholders)
            setTotalShares(stakeholders.reduce((sum, s) => sum + s.currentShares, 0))
        }
    }

    async function fetchGovernanceRules() {
        const rules = await getGovernanceRules(subsidiaryId)
        setGovernanceRules(rules)
    }

    // Calculate dilution when investment details change
    useEffect(() => {
        if (investmentAmount > 0 && valuationPre > 0 && currentCapTable.length > 0) {
            calculateImpact()
        }
    }, [investmentAmount, valuationPre, newInvestors, currentCapTable])

    function calculateImpact() {
        const valuationPost = calculatePostMoneyValuation(investmentAmount, 0, totalShares)
        const pricePerShare = valuationPost / (totalShares + (investmentAmount / (valuationPost / totalShares)))
        const newShares = Math.round(investmentAmount / pricePerShare)

        const dilution = calculateDilution(currentCapTable, newShares, valuationPre, valuationPost)
        setDilutionImpact(dilution)

        const investorShares = newInvestors.map(inv => ({
            name: inv.name,
            shares: Math.round((inv.amount / investmentAmount) * newShares),
        }))

        const afterOwnership = calculateOwnershipWithNewInvestors(currentCapTable, investorShares)
        setOwnershipAfter(afterOwnership)
    }

    function addInvestor() {
        setNewInvestors([...newInvestors, { name: '', amount: 0 }])
    }

    function updateInvestor(index: number, field: 'name' | 'amount', value: any) {
        const updated = [...newInvestors]
        if (field === 'name') {
            updated[index].name = value as string
        } else if (field === 'amount') {
            updated[index].amount = value as number
        }
        setNewInvestors(updated)
    }

    function removeInvestor(index: number) {
        setNewInvestors(newInvestors.filter((_, i) => i !== index))
    }

    async function handleSubmit() {
        setSubmitting(true)

        try {
            const proposedChanges = proposalType === 'fundraising' ? {
                round_name: roundName,
                amount: investmentAmount,
                valuation_pre: valuationPre,
                valuation_post: valuationPre + investmentAmount,
                investors: newInvestors,
            } : {}

            const response = await fetch('/api/cap-table/proposals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subsidiaryId,
                    proposalType,
                    title,
                    description,
                    rationale,
                    proposedChanges,
                    dilutionImpact,
                    ownershipBefore: currentCapTable,
                    ownershipAfter,
                    valuationImpact: {
                        valuationPre,
                        valuationPost: valuationPre + investmentAmount,
                    },
                    governanceRuleId: selectedRule?.id,
                    approvalThresholdUsed: selectedRule?.approvalThreshold,
                    requiresUnanimous,
                }),
            })

            if (!response.ok) throw new Error('Failed to create proposal')

            const { proposal } = await response.json()
            router.push(`/nexus/cap-table/proposals/${proposal.id}`)
        } catch (error) {
            console.error('Error creating proposal:', error)
            alert('Failed to create proposal')
        } finally {
            setSubmitting(false)
        }
    }

    const canProceed = () => {
        if (step === 1) return proposalType && title
        if (step === 2) {
            if (proposalType === 'fundraising') {
                return roundName && investmentAmount > 0 && valuationPre > 0 && newInvestors.length > 0
            }
            return true
        }
        if (step === 3) return dilutionImpact
        if (step === 4) return selectedRule
        return true
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-white/60 text-sm">Step {step} of {totalSteps}</span>
                    <span className="text-white/60 text-sm">{Math.round((step / totalSteps) * 100)}% Complete</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#F54029] transition-all"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>
            </div>

            <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                {/* Step 1: Proposal Type & Title */}
                {step === 1 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white font-rajdhani mb-6">Proposal Details</h2>

                        <div>
                            <label className="text-white/80 text-sm mb-3 block">Proposal Type</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['fundraising', 'equity_grant', 'share_issuance', 'buyback'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setProposalType(type)}
                                        className={`p-4 rounded-lg border-2 transition-all ${proposalType === type
                                            ? 'bg-[#F54029]/20 border-[#F54029]'
                                            : 'bg-white/5 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <p className="text-white font-medium capitalize">{type.replace('_', ' ')}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-white/80 text-sm mb-2 block">Proposal Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Series A Funding Round"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-white/80 text-sm mb-2 block">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Brief description of the proposal..."
                                className="w-full h-24 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-white/80 text-sm mb-2 block">Rationale</label>
                            <textarea
                                value={rationale}
                                onChange={(e) => setRationale(e.target.value)}
                                placeholder="Explain why this change is needed..."
                                className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none resize-none"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Specific Details */}
                {step === 2 && proposalType === 'fundraising' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white font-rajdhani mb-6">Fundraising Details</h2>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Round Name</label>
                                <input
                                    type="text"
                                    value={roundName}
                                    onChange={(e) => setRoundName(e.target.value)}
                                    placeholder="Series A"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Investment Amount</label>
                                <input
                                    type="number"
                                    value={investmentAmount || ''}
                                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                    placeholder="2000000"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Pre-Money Valuation</label>
                                <input
                                    type="number"
                                    value={valuationPre || ''}
                                    onChange={(e) => setValuationPre(Number(e.target.value))}
                                    placeholder="8000000"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Post-Money Valuation</label>
                                <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white/60">
                                    ${(valuationPre + investmentAmount).toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-white/80 text-sm">Investors</label>
                                <button
                                    onClick={addInvestor}
                                    className="px-4 py-2 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg text-sm flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add Investor
                                </button>
                            </div>

                            <div className="space-y-3">
                                {newInvestors.map((investor, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <input
                                            type="text"
                                            value={investor.name}
                                            onChange={(e) => updateInvestor(idx, 'name', e.target.value)}
                                            placeholder="Investor name"
                                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                                        />
                                        <input
                                            type="number"
                                            value={investor.amount || ''}
                                            onChange={(e) => updateInvestor(idx, 'amount', Number(e.target.value))}
                                            placeholder="Amount"
                                            className="w-40 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                                        />
                                        <button
                                            onClick={() => removeInvestor(idx)}
                                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Impact Analysis */}
                {step === 3 && dilutionImpact && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <TrendingDown className="text-[#F54029]" size={32} />
                            <h2 className="text-2xl font-bold text-white font-rajdhani">Dilution Impact Analysis</h2>
                        </div>

                        <div className="space-y-4">
                            {dilutionImpact.stakeholders.map((stakeholder: Stakeholder, idx: number) => {
                                const severity = stakeholder.dilutionPercent ? getDilutionSeverity(stakeholder.dilutionPercent) : null

                                return (
                                    <div key={idx} className="bg-white/5 rounded-lg p-6 border border-white/10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="text-white font-bold">{stakeholder.name}</h3>
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

                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-white/60 text-xs uppercase mb-1">Current</p>
                                                <p className="text-white text-xl font-bold">{stakeholder.currentOwnership.toFixed(2)}%</p>
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-xs uppercase mb-1">New</p>
                                                <p className="text-white text-xl font-bold">{stakeholder.newOwnership?.toFixed(2)}%</p>
                                            </div>
                                            <div>
                                                <p className="text-white/60 text-xs uppercase mb-1">Dilution</p>
                                                <p className={`text-xl font-bold ${(stakeholder.dilutionPercent || 0) < 5 ? 'text-green-400' :
                                                    (stakeholder.dilutionPercent || 0) < 15 ? 'text-yellow-400' :
                                                        (stakeholder.dilutionPercent || 0) < 30 ? 'text-orange-400' :
                                                            'text-red-400'
                                                    }`}>
                                                    -{stakeholder.dilution?.toFixed(2)}%
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Step 4: Governance Rules */}
                {step === 4 && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Settings className="text-[#F54029]" size={32} />
                            <h2 className="text-2xl font-bold text-white font-rajdhani">Governance Configuration</h2>
                        </div>

                        <div>
                            <label className="text-white/80 text-sm mb-3 block">Select Governance Rule</label>
                            <div className="space-y-3">
                                {governanceRules
                                    .filter(r => r.ruleType === proposalType || r.ruleType === 'amendment')
                                    .map(rule => (
                                        <button
                                            key={rule.id}
                                            onClick={() => setSelectedRule(rule)}
                                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedRule?.id === rule.id
                                                ? 'bg-[#F54029]/20 border-[#F54029]'
                                                : 'bg-white/5 border-white/10 hover:border-white/30'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-white font-bold">{rule.title}</h4>
                                                <span className="text-[#F54029] font-bold text-sm">{rule.approvalThreshold}%</span>
                                            </div>
                                            <p className="text-white/60 text-sm">{rule.description}</p>
                                            <div className="flex gap-4 mt-3 text-xs">
                                                <span className="text-white/40">Vote: {rule.voteWeightType.replace('_', ' ')}</span>
                                                <span className="text-white/40">Period: {rule.votingPeriodDays} days</span>
                                                {rule.founderVeto && <span className="text-orange-400">Founder Veto</span>}
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>

                        <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer">
                            <input
                                type="checkbox"
                                checked={requiresUnanimous}
                                onChange={(e) => setRequiresUnanimous(e.target.checked)}
                                className="w-5 h-5 accent-[#F54029]"
                            />
                            <div>
                                <p className="text-white font-medium">Require Unanimous Approval</p>
                                <p className="text-white/60 text-sm">All stakeholders must vote "for" to approve</p>
                            </div>
                        </label>
                    </div>
                )}

                {/* Step 5: Review & Submit */}
                {step === 5 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-white font-rajdhani mb-6">Review & Submit</h2>

                        <div className="bg-white/5 rounded-lg p-6 space-y-4">
                            <div>
                                <p className="text-white/60 text-sm mb-1">Title</p>
                                <p className="text-white font-bold text-lg">{title}</p>
                            </div>
                            {description && (
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Description</p>
                                    <p className="text-white/80">{description}</p>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Governance Rule</p>
                                    <p className="text-white">{selectedRule?.title}</p>
                                </div>
                                <div>
                                    <p className="text-white/60 text-sm mb-1">Approval Threshold</p>
                                    <p className="text-white font-bold">{selectedRule?.approvalThreshold}%</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-[#F54029]/10 to-purple-500/10 border border-[#F54029]/30 rounded-lg flex items-start gap-3">
                            <AlertTriangle className="text-[#F54029] flex-shrink-0 mt-1" size={24} />
                            <div>
                                <p className="text-white font-bold mb-1">Ready to Submit</p>
                                <p className="text-white/80 text-sm">
                                    Once submitted, stakeholders will be notified and voting will begin after the notice period.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg"
                        >
                            Back
                        </button>
                    )}

                    {step < totalSteps && (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={!canProceed()}
                            className="px-8 py-3 bg-[#F54029] hover:bg-[#F54029]/90 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg ml-auto flex items-center gap-2"
                        >
                            Continue
                            <ArrowRight size={20} />
                        </button>
                    )}

                    {step === totalSteps && (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || !canProceed()}
                            className="px-8 py-3 bg-[#F54029] hover:bg-[#F54029]/90 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg ml-auto flex items-center gap-2"
                        >
                            {submitting ? 'Creating...' : 'Create Proposal'}
                            <CheckCircle size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
