'use client'

import { useState, useEffect } from 'react'
import { Shield, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { GovernanceRule, saveGovernanceRule } from '@/lib/cap-table-governance'

interface Props {
    subsidiaryId: string
}

const RULE_TEMPLATES = {
    'vc_standard': {
        title: 'VC Standard',
        description: 'Preferred shareholders have supermajority control',
        approvalThreshold: 66.67,
        voteWeightType: 'ownership_percentage' as const,
        founderVeto: false,
        boardApprovalRequired: true,
        requiresUnanimous: false,
    },
    'founder_friendly': {
        title: 'Founder Friendly',
        description: 'Founders maintain veto rights on major decisions',
        approvalThreshold: 50.00,
        voteWeightType: 'ownership_percentage' as const,
        founderVeto: true,
        boardApprovalRequired: false,
        requiresUnanimous: false,
    },
    'democratic': {
        title: 'Democratic',
        description: 'One vote per stakeholder, simple majority',
        approvalThreshold: 50.00,
        voteWeightType: 'equal' as const,
        founderVeto: false,
        boardApprovalRequired: false,
        requiresUnanimous: false,
    },
    'board_controlled': {
        title: 'Board Controlled',
        description: 'All decisions require board approval',
        approvalThreshold: 50.00,
        voteWeightType: 'ownership_percentage' as const,
        founderVeto: false,
        boardApprovalRequired: true,
        requiresUnanimous: false,
    },
}

export default function GovernanceSettings({ subsidiaryId }: Props) {
    const [rules, setRules] = useState<GovernanceRule[]>([])
    const [editing, setEditing] = useState<GovernanceRule | null>(null)
    const [showTemplates, setShowTemplates] = useState<string | false>(false)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchRules()
    }, [subsidiaryId])

    async function fetchRules() {
        const { data } = await supabase
            .from('governance_rules')
            .select('*')
            .eq('subsidiary_id', subsidiaryId)
            .eq('is_active', true)

        if (data) {
            setRules(data.map(r => ({
                id: r.id,
                subsidiaryId: r.subsidiary_id,
                ruleType: r.rule_type,
                title: r.title,
                description: r.description,
                requiresApproval: r.requires_approval,
                approvalThreshold: r.approval_threshold,
                voteWeightType: r.vote_weight_type,
                eligibleVoters: r.eligible_voters,
                votingPeriodDays: r.voting_period_days,
                noticePeriodDays: r.notice_period_days,
                founderVeto: r.founder_veto,
                boardApprovalRequired: r.board_approval_required,
                requiresUnanimous: r.requires_unanimous,
                exemptions: r.exemptions,
                isActive: r.is_active,
            })))
        }
        setLoading(false)
    }

    function applyTemplate(templateKey: string, ruleType: string) {
        const template = RULE_TEMPLATES[templateKey as keyof typeof RULE_TEMPLATES]
        setEditing({
            id: '',
            subsidiaryId,
            ruleType,
            ...template,
            requiresApproval: true,
            eligibleVoters: { all_stakeholders: true },
            votingPeriodDays: 7,
            noticePeriodDays: 3,
            exemptions: {},
            isActive: true,
        })
        setShowTemplates(false)
    }

    function createNewRule(ruleType: string) {
        setEditing({
            id: '',
            subsidiaryId,
            ruleType,
            title: `${ruleType.replace('_', ' ')} Rule`,
            description: '',
            requiresApproval: true,
            approvalThreshold: 50.00,
            voteWeightType: 'ownership_percentage',
            eligibleVoters: { all_stakeholders: true },
            votingPeriodDays: 7,
            noticePeriodDays: 3,
            founderVeto: false,
            boardApprovalRequired: false,
            requiresUnanimous: false,
            exemptions: {},
            isActive: true,
        })
    }

    async function handleSave() {
        if (!editing) return

        try {
            await saveGovernanceRule(editing)
            await fetchRules()
            setEditing(null)
        } catch (error) {
            console.error('Error saving rule:', error)
            alert('Failed to save governance rule')
        }
    }

    async function handleDelete(ruleId: string) {
        if (!confirm('Are you sure you want to delete this rule?')) return

        try {
            await supabase
                .from('governance_rules')
                .update({ is_active: false })
                .eq('id', ruleId)

            await fetchRules()
        } catch (error) {
            console.error('Error deleting rule:', error)
        }
    }

    if (loading) {
        return <div className="text-white/60 p-8">Loading governance settings...</div>
    }

    // Group rules by type
    const ruleTypes = ['share_issuance', 'fundraising', 'equity_grant', 'buyback', 'transfer', 'amendment']
    const rulesByType = ruleTypes.reduce((acc, type) => {
        acc[type] = rules.filter(r => r.ruleType === type)
        return acc
    }, {} as Record<string, GovernanceRule[]>)

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white font-rajdhani">Governance Rules</h2>
                    <p className="text-white/60 text-sm mt-1">Configure voting rules for cap table changes</p>
                </div>
            </div>

            {/* Rule Types */}
            <div className="space-y-6">
                {ruleTypes.map(type => (
                    <div key={type} className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-bold uppercase tracking-wider text-sm">{type.replace('_', ' ')}</h3>
                            {rulesByType[type].length === 0 && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowTemplates(type)}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm rounded-lg"
                                    >
                                        Use Template
                                    </button>
                                    <button
                                        onClick={() => createNewRule(type)}
                                        className="px-4 py-2 bg-[#F54029] hover:bg-[#F54029]/90 text-white text-sm rounded-lg flex items-center gap-2"
                                    >
                                        <Plus size={16} />
                                        Create Rule
                                    </button>
                                </div>
                            )}
                        </div>

                        {rulesByType[type].length > 0 ? (
                            rulesByType[type].map(rule => (
                                <div key={rule.id} className="bg-white/5 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="text-white font-bold">{rule.title}</h4>
                                            <p className="text-white/60 text-sm">{rule.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditing(rule)}
                                                className="p-2 bg-white/5 hover:bg-white/10 rounded text-white"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(rule.id)}
                                                className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-white/40 text-xs mb-1">Threshold</p>
                                            <p className="text-white font-bold">{rule.approvalThreshold}%</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 text-xs mb-1">Vote Weight</p>
                                            <p className="text-white">{rule.voteWeightType.replace('_', ' ')}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 text-xs mb-1">Voting Period</p>
                                            <p className="text-white">{rule.votingPeriodDays} days</p>
                                        </div>
                                        <div className="flex gap-2">
                                            {rule.founderVeto && <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">Founder Veto</span>}
                                            {rule.boardApprovalRequired && <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Board Approval</span>}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-white/40 text-sm text-center py-4">No rule defined for this type</p>
                        )}

                        {/* Template selector */}
                        {showTemplates === type && (
                            <div className="mt-4 grid grid-cols-2 gap-3">
                                {Object.entries(RULE_TEMPLATES).map(([key, template]) => (
                                    <button
                                        key={key}
                                        onClick={() => applyTemplate(key, type)}
                                        className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left"
                                    >
                                        <h5 className="text-white font-bold text-sm mb-1">{template.title}</h5>
                                        <p className="text-white/60 text-xs">{template.description}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="text-[#F54029]" size={32} />
                            <h2 className="text-2xl font-bold text-white font-rajdhani">
                                {editing.id ? 'Edit' : 'Create'} Governance Rule
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Title</label>
                                <input
                                    type="text"
                                    value={editing.title}
                                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-white/80 text-sm mb-2 block">Description</label>
                                <textarea
                                    value={editing.description || ''}
                                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                                    className="w-full h-20 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Approval Threshold (%)</label>
                                    <input
                                        type="number"
                                        value={editing.approvalThreshold}
                                        onChange={(e) => setEditing({ ...editing, approvalThreshold: Number(e.target.value) })}
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Vote Weight Type</label>
                                    <select
                                        value={editing.voteWeightType}
                                        onChange={(e) => setEditing({ ...editing, voteWeightType: e.target.value as any })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                                    >
                                        <option value="equal">Equal (1 per person)</option>
                                        <option value="ownership_percentage">Ownership %</option>
                                        <option value="share_class_weighted">Class Weighted</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Notice Period (days)</label>
                                    <input
                                        type="number"
                                        value={editing.noticePeriodDays}
                                        onChange={(e) => setEditing({ ...editing, noticePeriodDays: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="text-white/80 text-sm mb-2 block">Voting Period (days)</label>
                                    <input
                                        type="number"
                                        value={editing.votingPeriodDays}
                                        onChange={(e) => setEditing({ ...editing, votingPeriodDays: Number(e.target.value) })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editing.founderVeto}
                                        onChange={(e) => setEditing({ ...editing, founderVeto: e.target.checked })}
                                        className="w-5 h-5 accent-[#F54029]"
                                    />
                                    <div>
                                        <p className="text-white font-medium">Founder Veto Rights</p>
                                        <p className="text-white/60 text-sm">Founders can veto proposals</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editing.boardApprovalRequired}
                                        onChange={(e) => setEditing({ ...editing, boardApprovalRequired: e.target.checked })}
                                        className="w-5 h-5 accent-[#F54029]"
                                    />
                                    <div>
                                        <p className="text-white font-medium">Board Approval Required</p>
                                        <p className="text-white/60 text-sm">Proposals need board approval</p>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-4 bg-white/5 rounded-lg cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editing.requiresUnanimous}
                                        onChange={(e) => setEditing({ ...editing, requiresUnanimous: e.target.checked })}
                                        className="w-5 h-5 accent-[#F54029]"
                                    />
                                    <div>
                                        <p className="text-white font-medium">Require Unanimous Approval</p>
                                        <p className="text-white/60 text-sm">All stakeholders must approve</p>
                                    </div>
                                </label>
                            </div>

                            <div className="flex gap-4 pt-6 border-t border-white/10">
                                <button
                                    onClick={() => setEditing(null)}
                                    className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-6 py-3 bg-[#F54029] hover:bg-[#F54029]/90 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={20} />
                                    Save Rule
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
