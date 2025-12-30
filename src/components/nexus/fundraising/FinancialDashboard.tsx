import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Users, Zap, Target, Activity, BarChart3, Plus, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import FinancialWizard from './FinancialWizard'

interface FinancialSnapshot {
    periodStart: string
    periodEnd: string
    totalRevenue: number
    mrr: number
    arr: number
    revenueGrowthRate: number
    totalExpenses: number
    cashBalance: number
    monthlyBurnRate: number
    runwayMonths: number
    totalUsers: number
    payingCustomers: number
    cac: number
    ltv: number
    ltvCacRatio: number
    ruleOf40: number
}

interface KPI {
    id: string
    name: string
    currentValue: number
    targetValue: number
    unit: string
    trend: string
    changePercent: number
    category: string
}

export default function FinancialDashboard({ subsidiaryId }: { subsidiaryId: string }) {
    const [snapshot, setSnapshot] = useState<FinancialSnapshot | null>(null)
    const [kpis, setKPIs] = useState<KPI[]>([])
    const [loading, setLoading] = useState(true)
    const [showWizard, setShowWizard] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchData()
    }, [subsidiaryId])

    async function fetchData() {
        setLoading(true)
        // Fetch latest financial snapshot
        const { data: snapshotData } = await supabase
            .from('financial_snapshots')
            .select('*')
            .eq('subsidiary_id', subsidiaryId)
            .order('period_end', { ascending: false })
            .limit(1)
            .single()

        if (snapshotData) {
            setSnapshot({
                periodStart: snapshotData.period_start,
                periodEnd: snapshotData.period_end,
                totalRevenue: snapshotData.total_revenue || 0,
                mrr: snapshotData.mrr || 0,
                arr: snapshotData.arr || 0,
                revenueGrowthRate: snapshotData.revenue_growth_rate || 0,
                totalExpenses: snapshotData.total_expenses || 0,
                cashBalance: snapshotData.cash_balance || 0,
                monthlyBurnRate: snapshotData.monthly_burn_rate || 0,
                runwayMonths: snapshotData.runway_months || 0,
                totalUsers: snapshotData.total_users || 0,
                payingCustomers: snapshotData.paying_customers || 0,
                cac: snapshotData.cac || 0,
                ltv: snapshotData.ltv || 0,
                ltvCacRatio: snapshotData.ltv_cac_ratio || 0,
                ruleOf40: snapshotData.rule_of_40 || 0,
            })
        } else {
            setSnapshot(null)
        }

        // Fetch KPIs
        const { data: kpiData } = await supabase
            .from('custom_kpis')
            .select('*')
            .eq('subsidiary_id', subsidiaryId)
            .eq('is_headline', true)
            .order('display_order')

        if (kpiData) {
            setKPIs(kpiData.map(k => ({
                id: k.id,
                name: k.name,
                currentValue: k.current_value || 0,
                targetValue: k.target_value || 0,
                unit: k.unit || '',
                trend: k.trend || 'flat',
                changePercent: k.change_percent || 0,
                category: k.category,
            })))
        }

        setLoading(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F54029]"></div>
            </div>
        )
    }

    if (!snapshot && !showWizard) {
        return (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-12 text-center">
                <BarChart3 className="mx-auto mb-4 text-white/40" size={64} />
                <h3 className="text-2xl font-bold text-white mb-4 font-rajdhani">No Financial Data</h3>
                <p className="text-white/60 mb-8">Add your first financial snapshot to track your startup's health.</p>
                <button
                    onClick={() => setShowWizard(true)}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all inline-flex items-center gap-3"
                >
                    <Plus size={24} />
                    Add Financial Snapshot
                </button>
            </div>
        )
    }

    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
        return `$${value.toFixed(0)}`
    }

    return (
        <div className="space-y-8 relative">
            {showWizard && (
                <FinancialWizard
                    subsidiaryId={subsidiaryId}
                    onClose={() => setShowWizard(false)}
                    onComplete={() => {
                        setShowWizard(false)
                        fetchData()
                    }}
                />
            )}

            {snapshot && (
                <>
                    <div className="flex justify-end">
                        <button
                            onClick={() => setShowWizard(true)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg transition-all flex items-center gap-2 text-sm"
                        >
                            <Plus size={16} />
                            New Snapshot
                        </button>
                    </div>

                    {/* Hero Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* ARR */}
                        <div className="bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-black/40 border border-green-500/30 rounded-2xl p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Annual Recurring Revenue</p>
                                    <h2 className="text-5xl font-bold text-white font-rajdhani">
                                        {formatCurrency(snapshot.arr)}
                                    </h2>
                                </div>
                                <div className="p-4 bg-green-500/20 rounded-xl">
                                    <DollarSign className="text-green-400" size={40} />
                                </div>
                            </div>
                            {snapshot.revenueGrowthRate > 0 && (
                                <div className="flex items-center gap-2 text-green-400">
                                    <TrendingUp size={20} />
                                    <span className="font-bold">+{snapshot.revenueGrowthRate.toFixed(1)}% MoM</span>
                                </div>
                            )}
                        </div>

                        {/* Cash & Runway */}
                        <div className="bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-black/40 border border-blue-500/30 rounded-2xl p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Cash Balance</p>
                                    <h2 className="text-5xl font-bold text-white font-rajdhani">
                                        {formatCurrency(snapshot.cashBalance)}
                                    </h2>
                                </div>
                                <div className="p-4 bg-blue-500/20 rounded-xl">
                                    <Zap className="text-blue-400" size={40} />
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/60 text-sm">Runway:</span>
                                <span className={`font-bold ${snapshot.runwayMonths > 12 ? 'text-green-400' :
                                    snapshot.runwayMonths > 6 ? 'text-yellow-400' :
                                        'text-red-400'
                                    }`}>
                                    {snapshot.runwayMonths.toFixed(1)} months
                                </span>
                            </div>
                        </div>

                        {/* Rule of 40 */}
                        <div className="bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-black/40 border border-purple-500/30 rounded-2xl p-8">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Rule of 40</p>
                                    <h2 className="text-5xl font-bold text-white font-rajdhani">
                                        {snapshot.ruleOf40.toFixed(1)}%
                                    </h2>
                                </div>
                                <div className="p-4 bg-purple-500/20 rounded-xl">
                                    <Target className="text-purple-400" size={40} />
                                </div>
                            </div>
                            <p className={`text-sm font-medium ${snapshot.ruleOf40 >= 40 ? 'text-green-400' :
                                snapshot.ruleOf40 >= 25 ? 'text-yellow-400' :
                                    'text-red-400'
                                }`}>
                                {snapshot.ruleOf40 >= 40 ? 'Excellent' :
                                    snapshot.ruleOf40 >= 25 ? 'Good' :
                                        'Needs Improvement'}
                            </p>
                        </div>
                    </div>

                    {/* Financial Health */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 font-rajdhani flex items-center gap-3">
                            <Activity className="text-[#F54029]" size={32} />
                            Financial Health Metrics
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-white/5 rounded-lg p-6">
                                <p className="text-white/60 text-xs uppercase tracking-wider mb-3">Monthly Burn</p>
                                <p className="text-white text-3xl font-bold">{formatCurrency(snapshot.monthlyBurnRate)}</p>
                                <p className="text-white/40 text-xs mt-2">Expenses - Revenue</p>
                            </div>

                            <div className="bg-white/5 rounded-lg p-6">
                                <p className="text-white/60 text-xs uppercase tracking-wider mb-3">Monthly Revenue</p>
                                <p className="text-white text-3xl font-bold">{formatCurrency(snapshot.totalRevenue)}</p>
                                <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                                    <TrendingUp size={12} />
                                    MRR: {formatCurrency(snapshot.mrr)}
                                </p>
                            </div>

                            <div className="bg-white/5 rounded-lg p-6">
                                <p className="text-white/60 text-xs uppercase tracking-wider mb-3">Paying Customers</p>
                                <p className="text-white text-3xl font-bold">{snapshot.payingCustomers.toLocaleString()}</p>
                                <p className="text-white/40 text-xs mt-2">of {snapshot.totalUsers.toLocaleString()} total</p>
                            </div>

                            <div className="bg-white/5 rounded-lg p-6">
                                <p className="text-white/60 text-xs uppercase tracking-wider mb-3">Total Expenses</p>
                                <p className="text-white text-3xl font-bold">{formatCurrency(snapshot.totalExpenses)}</p>
                                <p className="text-white/40 text-xs mt-2">Monthly operating cost</p>
                            </div>
                        </div>
                    </div>

                    {/* Unit Economics */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 font-rajdhani flex items-center gap-3">
                            <BarChart3 className="text-[#F54029]" size={32} />
                            Unit Economics
                        </h2>

                        <div className="grid grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="bg-white/5 rounded-xl p-8 mb-4">
                                    <p className="text-white/60 text-sm uppercase tracking-wider mb-3">Customer Acquisition Cost</p>
                                    <p className="text-white text-5xl font-bold font-rajdhani">{formatCurrency(snapshot.cac)}</p>
                                </div>
                                <p className="text-white/40 text-sm">Cost to acquire one customer</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-white/5 rounded-xl p-8 mb-4">
                                    <p className="text-white/60 text-sm uppercase tracking-wider mb-3">Lifetime Value</p>
                                    <p className="text-white text-5xl font-bold font-rajdhani">{formatCurrency(snapshot.ltv)}</p>
                                </div>
                                <p className="text-white/40 text-sm">Revenue from one customer</p>
                            </div>

                            <div className="text-center">
                                <div className="bg-gradient-to-br from-[#F54029]/20 to-purple-500/20 border border-[#F54029]/30 rounded-xl p-8 mb-4">
                                    <p className="text-white/60 text-sm uppercase tracking-wider mb-3">LTV:CAC Ratio</p>
                                    <p className={`text-5xl font-bold font-rajdhani ${snapshot.ltvCacRatio >= 3 ? 'text-green-400' :
                                        snapshot.ltvCacRatio >= 2 ? 'text-yellow-400' :
                                            'text-red-400'
                                        }`}>
                                        {snapshot.ltvCacRatio.toFixed(1)}:1
                                    </p>
                                </div>
                                <p className={`text-sm font-medium ${snapshot.ltvCacRatio >= 3 ? 'text-green-400' :
                                    snapshot.ltvCacRatio >= 2 ? 'text-yellow-400' :
                                        'text-red-400'
                                    }`}>
                                    {snapshot.ltvCacRatio >= 3 ? 'Excellent (Target: 3:1+)' :
                                        snapshot.ltvCacRatio >= 2 ? 'Good (Target: 3:1)' :
                                            'Below Target'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Custom KPIs */}
                    {kpis.length > 0 && (
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-2xl font-bold text-white mb-6 font-rajdhani">Key Performance Indicators</h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {kpis.map(kpi => (
                                    <div key={kpi.id} className="bg-white/5 rounded-lg p-6">
                                        <p className="text-white/60 text-xs uppercase tracking-wider mb-3">{kpi.name}</p>
                                        <p className="text-white text-3xl font-bold">
                                            {kpi.unit === '$' && '$'}
                                            {kpi.currentValue.toLocaleString()}
                                            {kpi.unit === '%' && '%'}
                                        </p>
                                        {kpi.targetValue > 0 && (
                                            <div className="mt-3">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-white/40 text-xs">Target: {kpi.targetValue.toLocaleString()}{kpi.unit === '%' && '%'}</span>
                                                    <span className={`text-xs font-medium ${kpi.currentValue >= kpi.targetValue ? 'text-green-400' :
                                                        kpi.currentValue >= kpi.targetValue * 0.8 ? 'text-yellow-400' :
                                                            'text-red-400'
                                                        }`}>
                                                        {((kpi.currentValue / kpi.targetValue) * 100).toFixed(0)}%
                                                    </span>
                                                </div>
                                                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full transition-all ${kpi.currentValue >= kpi.targetValue ? 'bg-green-500' :
                                                            kpi.currentValue >= kpi.targetValue * 0.8 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                            }`}
                                                        style={{ width: `${Math.min((kpi.currentValue / kpi.targetValue) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {kpi.changePercent !== 0 && (
                                            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${kpi.changePercent > 0 ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {kpi.changePercent > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                {Math.abs(kpi.changePercent).toFixed(1)}% vs. last period
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Health Score */}
                    <div className="bg-gradient-to-br from-[#F54029]/10 via-purple-500/5 to-black/40 border border-[#F54029]/20 rounded-2xl p-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-white text-sm uppercase tracking-wider mb-2">Investment Readiness Score</h3>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-6xl font-bold text-white font-rajdhani">
                                        {calculateHealthScore(snapshot, kpis)}
                                    </span>
                                    <span className="text-white/60 text-xl">/  100</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white/80 mb-2">Based on key metrics:</p>
                                <ul className="text-sm text-white/60 space-y-1">
                                    <li>✓ Revenue growth</li>
                                    <li>✓ Unit economics</li>
                                    <li>✓ Cash runway</li>
                                    <li>✓ Rule of 40</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

function calculateHealthScore(snapshot: FinancialSnapshot, kpis: KPI[]): number {
    let score = 0

    // Revenue growth (0-25 points)
    if (snapshot.revenueGrowthRate >= 20) score += 25
    else if (snapshot.revenueGrowthRate >= 10) score += 20
    else if (snapshot.revenueGrowthRate >= 5) score += 15
    else score += 10

    // LTV:CAC ratio (0-25 points)
    if (snapshot.ltvCacRatio >= 3) score += 25
    else if (snapshot.ltvCacRatio >= 2) score += 20
    else score += 10

    // Runway (0-25 points)
    if (snapshot.runwayMonths >= 18) score += 25
    else if (snapshot.runwayMonths >= 12) score += 20
    else if (snapshot.runwayMonths >= 6) score += 15
    else score += 5

    // Rule of 40 (0-25 points)
    if (snapshot.ruleOf40 >= 40) score += 25
    else if (snapshot.ruleOf40 >= 30) score += 20
    else if (snapshot.ruleOf40 >= 20) score += 15
    else score += 10

    return score
}
