'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, FileText, Download, Calendar, PieChart, Award, Bell, Zap, Target, Loader2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Investment {
    campaignName: string
    commitmentAmount: number
    numberOfShares: number
    sharePrice: number
    investmentDate: string
    status: string
    certificateNumber: string
}

interface Update {
    id: string
    title: string
    summary: string
    sentAt: string
    updateType: string
}

interface ActiveCampaign {
    id: string
    name: string
    subsidiaryName: string
    roundType: string
    targetAmount: number
    sharePrice: number
    minInvestment: number
    preMoneyValuation: number
}

export default function InvestorPortal() {
    const [investments, setInvestments] = useState<Investment[]>([])
    const [updates, setUpdates] = useState<Update[]>([])
    const [activeCampaigns, setActiveCampaigns] = useState<ActiveCampaign[]>([])
    const [portfolioValue, setPortfolioValue] = useState(0)
    const [totalInvested, setTotalInvested] = useState(0)
    const [loading, setLoading] = useState(true)

    // Investment Modal State
    const [isInvestModalOpen, setIsInvestModalOpen] = useState(false)
    const [selectedCampaign, setSelectedCampaign] = useState<ActiveCampaign | null>(null)
    const [commitAmount, setCommitAmount] = useState<number | ''>('')
    const [submitting, setSubmitting] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchInvestments()
        fetchUpdates()
        fetchActiveCampaigns()
    }, [])

    async function fetchInvestments() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('campaign_commitments')
            .select(`
                *,
                fundraising_campaigns(name)
            `)
            .eq('investor_id', user.id)
            .eq('status', 'closed')

        if (data) {
            const formatted = data.map(c => ({
                campaignName: c.fundraising_campaigns?.name || 'Unknown Campaign',
                commitmentAmount: c.commitment_amount,
                numberOfShares: c.number_of_shares || 0,
                sharePrice: c.share_price || 0,
                investmentDate: c.closed_at,
                status: c.status,
                certificateNumber: c.certificate_number || 'Pending',
            }))

            setInvestments(formatted)

            const total = formatted.reduce((sum, inv) => sum + inv.commitmentAmount, 0)
            setTotalInvested(total)
            setPortfolioValue(total) // In real app, calculate current value
        }

        setLoading(false)
    }

    async function fetchUpdates() {
        const { data } = await supabase
            .from('investor_updates')
            .select('*')
            .order('sent_at', { ascending: false })
            .limit(5)

        if (data) {
            setUpdates(data.map(u => ({
                id: u.id,
                title: u.title,
                summary: u.summary || '',
                sentAt: u.sent_at,
                updateType: u.update_type,
            })))
        }
    }

    async function fetchActiveCampaigns() {
        const { data } = await supabase
            .from('fundraising_campaigns')
            .select('*, subsidiaries(name)')
            .eq('status', 'active')

        if (data) {
            setActiveCampaigns(data.map(c => ({
                id: c.id,
                name: c.name,
                subsidiaryName: c.subsidiaries?.name || 'TUC Network',
                roundType: c.round_type,
                targetAmount: c.target_amount,
                sharePrice: c.share_price || 0,
                minInvestment: c.min_investment || 10000,
                preMoneyValuation: c.pre_money_valuation || 0
            })))
        }
    }

    async function handleCommit(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedCampaign || !commitAmount || commitAmount < selectedCampaign.minInvestment) return

        setSubmitting(true)
        try {
            const res = await fetch('/api/investor/commit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    campaignId: selectedCampaign.id,
                    commitmentAmount: commitAmount,
                    share_price: selectedCampaign.sharePrice
                })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to submit commitment')
            }

            alert('Commitment submitted successfully! An administrator will review your request.')
            setIsInvestModalOpen(false)
            setCommitAmount('')
        } catch (error: any) {
            alert('Error: ' + error.message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F54029]"></div>
            </div>
        )
    }

    const returns = portfolioValue - totalInvested
    const returnsPercent = totalInvested > 0 ? (returns / totalInvested) * 100 : 0

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#F54029]/20 via-purple-500/10 to-black/40 border border-[#F54029]/30 rounded-2xl p-12">
                <div className="grid grid-cols-3 gap-8">
                    <div>
                        <p className="text-white/60 text-sm uppercase tracking-wider mb-3">Total Invested</p>
                        <h2 className="text-5xl font-bold text-white font-rajdhani">
                            ${(totalInvested / 1000).toFixed(0)}K
                        </h2>
                        <p className="text-white/60 text-sm mt-2">{investments.length} investment{investments.length !== 1 && 's'}</p>
                    </div>

                    <div>
                        <p className="text-white/60 text-sm uppercase tracking-wider mb-3">Portfolio Value</p>
                        <h2 className="text-5xl font-bold text-white font-rajdhani">
                            ${(portfolioValue / 1000).toFixed(0)}K
                        </h2>
                        <div className={`flex items-center gap-2 mt-2 ${returns >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            <TrendingUp size={16} />
                            <span className="text-sm font-bold">
                                {returns >= 0 ? '+' : ''}{returnsPercent.toFixed(1)}%
                            </span>
                        </div>
                    </div>

                    <div>
                        <p className="text-white/60 text-sm uppercase tracking-wider mb-3">Unrealized Gains</p>
                        <h2 className={`text-5xl font-bold font-rajdhani ${returns >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {returns >= 0 ? '+' : ''}${(returns / 1000).toFixed(0)}K
                        </h2>
                        <p className="text-white/60 text-sm mt-2">Based on latest valuation</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-8">
                {/* Left Column - Investments */}
                <div className="col-span-8 space-y-6">
                    
                    {/* Active Offerings (New Feature) */}
                    {activeCampaigns.length > 0 && (
                        <div className="bg-gradient-to-r from-[#F54029]/10 to-transparent border border-[#F54029]/30 rounded-2xl p-8 mb-8">
                            <h2 className="text-2xl font-bold text-white mb-6 font-rajdhani flex items-center gap-3">
                                <Zap className="text-[#F54029]" size={32} />
                                Active Offerings
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {activeCampaigns.map(campaign => (
                                    <div key={campaign.id} className="bg-black/60 border border-white/10 rounded-xl p-5 hover:border-[#F54029]/50 transition-all">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] bg-[#F54029] text-white px-2 py-0.5 rounded font-bold uppercase">{campaign.roundType.replace('_', ' ')}</span>
                                            <span className="text-white/40 text-xs">{campaign.subsidiaryName}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#F54029] transition-colors">{campaign.name}</h3>
                                        
                                        <div className="space-y-1 my-4 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-white/40">Valuation</span>
                                                <span className="text-white font-medium">${(campaign.preMoneyValuation / 1000000).toFixed(1)}M</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-white/40">Min Check</span>
                                                <span className="text-white font-medium">${(campaign.minInvestment / 1000).toFixed(0)}K</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => { setSelectedCampaign(campaign); setIsInvestModalOpen(true); }}
                                            className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-sm text-white font-bold tracking-wider uppercase flex items-center justify-center gap-2"
                                        >
                                            <Target size={16} className="text-[#F54029]"/> Review & Subscribe
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* My Investments */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 font-rajdhani flex items-center gap-3">
                            <PieChart className="text-[#F54029]" size={32} />
                            My Investments
                        </h2>

                        <div className="space-y-4">
                            {investments.map((investment, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-6 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-white font-bold text-xl mb-2">{investment.campaignName}</h3>
                                            <p className="text-white/60 text-sm">
                                                Invested {new Date(investment.investmentDate).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white text-2xl font-bold font-rajdhani">
                                                ${(investment.commitmentAmount / 1000).toFixed(0)}K
                                            </p>
                                            <p className="text-white/60 text-sm">
                                                {investment.numberOfShares.toLocaleString()} shares
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                                        <div>
                                            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Share Price</p>
                                            <p className="text-white font-medium">${investment.sharePrice.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Certificate #</p>
                                            <p className="text-white font-medium">{investment.certificateNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Status</p>
                                            <span className="inline-block px-3 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                                                Active
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-4">
                                        <button className="flex-1 px-4 py-2 bg-[#F54029]/20 hover:bg-[#F54029]/30 text-[#F54029] rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                            <Download size={16} />
                                            Certificate
                                        </button>
                                        <button className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                            <FileText size={16} />
                                            Documents
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Updates */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 font-rajdhani flex items-center gap-3">
                            <Bell className="text-[#F54029]" size={32} />
                            Recent Updates
                        </h2>

                        {updates.length === 0 ? (
                            <div className="text-center py-12">
                                <Bell className="mx-auto mb-4 text-white/40" size={48} />
                                <p className="text-white/60">No updates yet</p>
                                <p className="text-white/40 text-sm mt-2">Check back for company news and reports</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {updates.map(update => (
                                    <div
                                        key={update.id}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-6 transition-all cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-500/20 rounded">
                                                    <FileText className="text-blue-400" size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold">{update.title}</h3>
                                                    <p className="text-white/60 text-sm">{update.summary}</p>
                                                </div>
                                            </div>
                                            <span className="text-white/40 text-xs whitespace-nowrap">
                                                {new Date(update.sentAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Quick Access */}
                <div className="col-span-4 space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4 font-rajdhani text-lg">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-3">
                                <FileText size={18} />
                                View Data Room
                            </button>
                            <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-3">
                                <Download size={18} />
                                Download K-1
                            </button>
                            <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-3">
                                <Calendar size={18} />
                                Upcoming Events
                            </button>
                            <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-all flex items-center gap-3">
                                <Award size={18} />
                                Investor Perks
                            </button>
                        </div>
                    </div>

                    {/* Company Health */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4 font-rajdhani text-lg">Company Health</h3>
                        <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                            <TrendingUp className="text-white/20 mb-3" size={32} />
                            <p className="text-white/40 text-sm">Metrics unavailable</p>
                            <p className="text-white/20 text-xs mt-1">Data will appear after first reporting period</p>
                        </div>
                    </div>

                    {/* Next Milestone */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4 font-rajdhani text-lg">Next Milestone</h3>
                        <div className="flex flex-col items-center justify-center py-8 border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                            <Award className="text-white/20 mb-3" size={32} />
                            <p className="text-white/40 text-sm">No milestones set</p>
                            <p className="text-white/20 text-xs mt-1">Check back for upcoming targets</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Investment Modal */}
            {isInvestModalOpen && selectedCampaign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-white font-rajdhani flex items-center gap-2">
                                <Target className="text-[#F54029]" /> Subscription Request
                            </h3>
                            <button onClick={() => setIsInvestModalOpen(false)} className="text-white/60 hover:text-white"><X size={24} /></button>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{selectedCampaign.subsidiaryName}</p>
                            <p className="text-white font-bold text-lg mb-3">{selectedCampaign.name}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-white/40 block">Price Per Share</span> <span className="text-white font-mono">${selectedCampaign.sharePrice.toFixed(2)}</span></div>
                                <div><span className="text-white/40 block">Minimum Investment</span> <span className="text-white font-mono">${selectedCampaign.minInvestment.toLocaleString()}</span></div>
                            </div>
                        </div>

                        <form onSubmit={handleCommit} className="space-y-6">
                            <div>
                                <label className="text-white/80 text-sm font-medium block mb-2">Commitment Amount (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                    <input
                                        type="number"
                                        min={selectedCampaign.minInvestment}
                                        step="1000"
                                        value={commitAmount}
                                        onChange={e => setCommitAmount(Number(e.target.value))}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg pl-12 pr-4 py-4 text-white text-lg outline-none focus:border-[#F54029] transition-colors"
                                        placeholder={`${selectedCampaign.minInvestment.toLocaleString()}`}
                                        required
                                    />
                                </div>
                                {typeof commitAmount === 'number' && commitAmount >= selectedCampaign.minInvestment && selectedCampaign.sharePrice > 0 && (
                                    <p className="text-[#F54029] text-sm mt-2 font-mono">
                                        ≈ {Math.floor(commitAmount / selectedCampaign.sharePrice).toLocaleString()} shares
                                    </p>
                                )}
                            </div>

                            <div className="p-4 bg-[#F54029]/10 border border-[#F54029]/20 rounded-lg flex items-start gap-3">
                                <input type="checkbox" required className="mt-1" />
                                <p className="text-xs text-white/60">
                                    By submitting this request, I understand this represents a hard commitment to invest. 
                                    I agree to sign the final Subscription Agreement and wire funds upon execution.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting || typeof commitAmount !== 'number' || commitAmount < selectedCampaign.minInvestment}
                                className="w-full py-4 bg-[#F54029] hover:bg-[#F54029]/90 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 group"
                            >
                                {submitting ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} className="group-hover:scale-110 transition-transform" />}
                                Sign & Commit
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
