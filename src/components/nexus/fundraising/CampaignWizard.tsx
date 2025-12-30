'use client'

import { useState } from 'react'
import { X, DollarSign, TrendingUp, Calendar, FileText, Target, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface CampaignWizardProps {
    subsidiaryId: string
    onClose: () => void
    onComplete: () => void
}

export default function CampaignWizard({ subsidiaryId, onClose, onComplete }: CampaignWizardProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        roundType: 'seed',
        targetAmount: '',
        minAmount: '',
        maxAmount: '',
        minInvestment: '25000',
        preMoneyValuation: '',
        sharePrice: '',
        securityType: 'preferred_stock',
        sharesOffered: '',
        launchDate: '',
        targetCloseDate: '',
    })

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const { data: user } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            const postMoneyVal = formData.preMoneyValuation
                ? parseFloat(formData.preMoneyValuation) + parseFloat(formData.targetAmount)
                : null

            const { error } = await supabase
                .from('fundraising_campaigns')
                .insert({
                    subsidiary_id: subsidiaryId,
                    name: formData.name,
                    round_type: formData.roundType,
                    target_amount: parseFloat(formData.targetAmount),
                    min_amount: formData.minAmount ? parseFloat(formData.minAmount) : null,
                    max_amount: formData.maxAmount ? parseFloat(formData.maxAmount) : null,
                    min_investment: parseFloat(formData.minInvestment),
                    pre_money_valuation: formData.preMoneyValuation ? parseFloat(formData.preMoneyValuation) : null,
                    post_money_valuation: postMoneyVal,
                    share_price: formData.sharePrice ? parseFloat(formData.sharePrice) : null,
                    security_type: formData.securityType,
                    shares_offered: formData.sharesOffered ? parseInt(formData.sharesOffered) : null,
                    launch_date: formData.launchDate || null,
                    target_close_date: formData.targetCloseDate || null,
                    primary_contact: user.user?.id,
                    status: 'draft',
                })

            if (error) throw error

            onComplete()
        } catch (error) {
            console.error('Error creating campaign:', error)
            alert('Failed to create campaign. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-rajdhani">Launch Fundraising Campaign</h2>
                        <p className="text-white/60 text-sm mt-1">Step {step} of 3</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Progress */}
                <div className="flex gap-2 px-6 pt-6">
                    {[1, 2, 3].map(s => (
                        <div
                            key={s}
                            className={`flex-1 h-1 rounded-full transition-all ${s <= step ? 'bg-[#F54029]' : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Target className="text-[#F54029]" size={24} />
                                    Campaign Basics
                                </h3>
                            </div>

                            <div>
                                <label className="text-white/80 text-sm font-medium block mb-2">Campaign Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Series A - Q1 2025"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029] transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-white/80 text-sm font-medium block mb-2">Round Type *</label>
                                <select
                                    value={formData.roundType}
                                    onChange={e => setFormData({ ...formData, roundType: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029] transition-colors"
                                >
                                    <option value="pre_seed">Pre-Seed</option>
                                    <option value="seed">Seed</option>
                                    <option value="series_a">Series A</option>
                                    <option value="series_b">Series B</option>
                                    <option value="series_c">Series C</option>
                                    <option value="bridge">Bridge Round</option>
                                    <option value="convertible_note">Convertible Note</option>
                                    <option value="safe">SAFE</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-white/80 text-sm font-medium block mb-2">Security Type</label>
                                <select
                                    value={formData.securityType}
                                    onChange={e => setFormData({ ...formData, securityType: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029] transition-colors"
                                >
                                    <option value="common_stock">Common Stock</option>
                                    <option value="preferred_stock">Preferred Stock</option>
                                    <option value="safe">SAFE</option>
                                    <option value="convertible_note">Convertible Note</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <DollarSign className="text-[#F54029]" size={24} />
                                    Financial Terms
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Target Amount *</label>
                                    <input
                                        type="number"
                                        value={formData.targetAmount}
                                        onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
                                        placeholder="5000000"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Minimum Investment</label>
                                    <input
                                        type="number"
                                        value={formData.minInvestment}
                                        onChange={e => setFormData({ ...formData, minInvestment: e.target.value })}
                                        placeholder="25000"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Min Amount (Optional)</label>
                                    <input
                                        type="number"
                                        value={formData.minAmount}
                                        onChange={e => setFormData({ ...formData, minAmount: e.target.value })}
                                        placeholder="3000000"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Max Amount (Optional)</label>
                                    <input
                                        type="number"
                                        value={formData.maxAmount}
                                        onChange={e => setFormData({ ...formData, maxAmount: e.target.value })}
                                        placeholder="7000000"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029] transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Pre-Money Valuation</label>
                                    <input
                                        type="number"
                                        value={formData.preMoneyValuation}
                                        onChange={e => setFormData({ ...formData, preMoneyValuation: e.target.value })}
                                        placeholder="20000000"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Share Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.sharePrice}
                                        onChange={e => setFormData({ ...formData, sharePrice: e.target.value })}
                                        placeholder="2.50"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029] transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-white/80 text-sm font-medium block mb-2">Shares Offered</label>
                                <input
                                    type="number"
                                    value={formData.sharesOffered}
                                    onChange={e => setFormData({ ...formData, sharesOffered: e.target.value })}
                                    placeholder="2000000"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029] transition-colors"
                                />
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Calendar className="text-[#F54029]" size={24} />
                                    Timeline
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Launch Date</label>
                                    <input
                                        type="date"
                                        value={formData.launchDate}
                                        onChange={e => setFormData({ ...formData, launchDate: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029] transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Target Close Date</label>
                                    <input
                                        type="date"
                                        value={formData.targetCloseDate}
                                        onChange={e => setFormData({ ...formData, targetCloseDate: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029] transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6">
                                <h4 className="text-white font-bold mb-4">Campaign Summary</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Name:</span>
                                        <span className="text-white font-medium">{formData.name || 'Not set'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Round Type:</span>
                                        <span className="text-white font-medium">{formData.roundType.replace('_', ' ').toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Target Amount:</span>
                                        <span className="text-white font-medium">${parseInt(formData.targetAmount || '0').toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/60">Pre-Money Valuation:</span>
                                        <span className="text-white font-medium">
                                            {formData.preMoneyValuation ? `$${parseInt(formData.preMoneyValuation).toLocaleString()}` : 'Not set'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 p-6 border-t border-white/10">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-all flex items-center gap-2"
                        >
                            <ArrowLeft size={20} />
                            Back
                        </button>
                    )}

                    <div className="flex-1" />

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            disabled={step === 1 && !formData.name}
                            className="px-8 py-3 bg-[#F54029] hover:bg-[#F54029]/90 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-all flex items-center gap-2"
                        >
                            Next
                            <ArrowRight size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.name || !formData.targetAmount}
                            className="px-8 py-3 bg-[#F54029] hover:bg-[#F54029]/90 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-all flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Check size={20} />
                                    Launch Campaign
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
