'use client'

import { useState } from 'react'
import { X, DollarSign, TrendingUp, Calendar, FileText, Target, ArrowRight, ArrowLeft, Check, Calculator, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface FinancialWizardProps {
    subsidiaryId: string
    onClose: () => void
    onComplete: () => void
}

export default function FinancialWizard({ subsidiaryId, onClose, onComplete }: FinancialWizardProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    // Form state
    const [formData, setFormData] = useState({
        periodStart: '',
        periodEnd: new Date().toISOString().split('T')[0],
        totalRevenue: '',
        mrr: '',
        totalExpenses: '',
        cashBalance: '',
        totalUsers: '',
        payingCustomers: '',
        // Calculated/Advanced fields (optional input)
        cac: '',
        ltv: ''
    })

    const calculateMetrics = () => {
        const rev = parseFloat(formData.totalRevenue) || 0
        const mrr = parseFloat(formData.mrr) || 0
        const expenses = parseFloat(formData.totalExpenses) || 0
        const cash = parseFloat(formData.cashBalance) || 0
        const users = parseInt(formData.totalUsers) || 0
        const paying = parseInt(formData.payingCustomers) || 0
        const cac = parseFloat(formData.cac) || 0
        const ltv = parseFloat(formData.ltv) || 0

        const arr = mrr * 12
        const burnRate = Math.max(0, expenses - rev)
        const runway = burnRate > 0 ? cash / burnRate : 99 // 99 for infinite/profitable

        // Simple Rule of 40 approximation: Profit Margin + Revenue Growth
        // Since we don't have historical data here easily, we'll use a simplified margin calculation
        const profitMargin = rev > 0 ? ((rev - expenses) / rev) * 100 : 0
        // We'll assume 0 growth for initial snapshot or let user input it later if we want complexity
        const ruleOf40 = profitMargin // partial calculation

        const ltvCac = cac > 0 ? ltv / cac : 0

        return {
            arr,
            monthly_burn_rate: burnRate,
            runway_months: runway,
            rule_of_40: ruleOf40,
            ltv_cac_ratio: ltvCac
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const metrics = calculateMetrics()

            const { error } = await supabase
                .from('financial_snapshots')
                .insert({
                    subsidiary_id: subsidiaryId,
                    period_start: formData.periodStart || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
                    period_end: formData.periodEnd,
                    total_revenue: parseFloat(formData.totalRevenue) || 0,
                    mrr: parseFloat(formData.mrr) || 0,
                    arr: metrics.arr,
                    total_expenses: parseFloat(formData.totalExpenses) || 0,
                    cash_balance: parseFloat(formData.cashBalance) || 0,
                    monthly_burn_rate: metrics.monthly_burn_rate,
                    runway_months: metrics.runway_months,
                    total_users: parseInt(formData.totalUsers) || 0,
                    paying_customers: parseInt(formData.payingCustomers) || 0,
                    cac: parseFloat(formData.cac) || 0,
                    ltv: parseFloat(formData.ltv) || 0,
                    ltv_cac_ratio: metrics.ltv_cac_ratio,
                    rule_of_40: metrics.rule_of_40,
                    revenue_growth_rate: 0 // Default for first snapshot
                })

            if (error) throw error

            onComplete()
        } catch (error) {
            console.error('Error creating snapshot:', error)
            alert('Failed to create snapshot. Please try again.')
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
                        <h2 className="text-2xl font-bold text-white font-rajdhani">New Financial Snapshot</h2>
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
                            className={`flex-1 h-1 rounded-full transition-all ${s <= step ? 'bg-blue-500' : 'bg-white/10'
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
                                    <Calendar className="text-blue-500" size={24} />
                                    Period Details
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Period Start</label>
                                    <input
                                        type="date"
                                        value={formData.periodStart}
                                        onChange={e => setFormData({ ...formData, periodStart: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Period End (Snapshot Date)</label>
                                    <input
                                        type="date"
                                        value={formData.periodEnd}
                                        onChange={e => setFormData({ ...formData, periodEnd: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 mt-8 flex items-center gap-2">
                                    <DollarSign className="text-green-500" size={24} />
                                    Core Financials
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Total Monthly Revenue</label>
                                    <input
                                        type="number"
                                        value={formData.totalRevenue}
                                        onChange={e => setFormData({ ...formData, totalRevenue: e.target.value })}
                                        placeholder="50000"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Monthly Recurring Revenue (MRR)</label>
                                    <input
                                        type="number"
                                        value={formData.mrr}
                                        onChange={e => setFormData({ ...formData, mrr: e.target.value })}
                                        placeholder="45000"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-green-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Total Operating Expenses</label>
                                    <input
                                        type="number"
                                        value={formData.totalExpenses}
                                        onChange={e => setFormData({ ...formData, totalExpenses: e.target.value })}
                                        placeholder="60000"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Ending Cash Balance</label>
                                    <input
                                        type="number"
                                        value={formData.cashBalance}
                                        onChange={e => setFormData({ ...formData, cashBalance: e.target.value })}
                                        placeholder="500000"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Users className="text-purple-500" size={24} />
                                    Customer Metrics
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Total Users</label>
                                    <input
                                        type="number"
                                        value={formData.totalUsers}
                                        onChange={e => setFormData({ ...formData, totalUsers: e.target.value })}
                                        placeholder="1000"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Paying Customers</label>
                                    <input
                                        type="number"
                                        value={formData.payingCustomers}
                                        onChange={e => setFormData({ ...formData, payingCustomers: e.target.value })}
                                        placeholder="100"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-purple-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 mt-8 flex items-center gap-2">
                                    <Target className="text-orange-500" size={24} />
                                    Unit Economics (Optional)
                                </h3>
                                <p className="text-white/60 text-sm mb-4">You can enter these manually or let us calculate them later.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">CAC (Customer Acquisition Cost)</label>
                                    <input
                                        type="number"
                                        value={formData.cac}
                                        onChange={e => setFormData({ ...formData, cac: e.target.value })}
                                        placeholder="50"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">LTV (Lifetime Value)</label>
                                    <input
                                        type="number"
                                        value={formData.ltv}
                                        onChange={e => setFormData({ ...formData, ltv: e.target.value })}
                                        placeholder="500"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Calculator className="text-blue-500" size={24} />
                                    Calculated Summary
                                </h3>
                                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-white/60">Annual Run Rate (ARR)</span>
                                            <span className="text-white font-bold text-lg">
                                                ${((parseFloat(formData.mrr) || 0) * 12).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-white/60">Estimated Monthly Burn</span>
                                            <span className="text-white font-bold text-lg text-red-400">
                                                ${Math.max(0, (parseFloat(formData.totalExpenses) || 0) - (parseFloat(formData.totalRevenue) || 0)).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                                            <span className="text-white/60">Estimated Runway</span>
                                            <span className={`font-bold text-lg ${(parseFloat(formData.cashBalance) || 0) / Math.max(1, (parseFloat(formData.totalExpenses) || 0) - (parseFloat(formData.totalRevenue) || 0)) < 6 ? 'text-red-400' : 'text-green-400'}`}>
                                                {((parseFloat(formData.cashBalance) || 0) / Math.max(1, (parseFloat(formData.totalExpenses) || 0) - (parseFloat(formData.totalRevenue) || 0))).toFixed(1)} months
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-white/60">Customer Count</span>
                                            <span className="text-white font-bold text-lg">
                                                {(parseInt(formData.payingCustomers) || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <Check className="text-blue-400 mt-1" size={20} />
                                    <div>
                                        <h4 className="text-white font-bold text-sm">Ready to Create Snapshot</h4>
                                        <p className="text-white/60 text-xs mt-1">This will be saved as the latest financial record for {formData.periodEnd}. You can always add more historical snapshots later.</p>
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
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all flex items-center gap-2"
                        >
                            Next
                            <ArrowRight size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.periodEnd || !formData.totalRevenue}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-all flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Check size={20} />
                                    Save Snapshot
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
