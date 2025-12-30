'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, DollarSign, FileText, Download, Calendar, PieChart, Award, Bell } from 'lucide-react'
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

export default function InvestorPortal() {
    const [investments, setInvestments] = useState<Investment[]>([])
    const [updates, setUpdates] = useState<Update[]>([])
    const [portfolioValue, setPortfolioValue] = useState(0)
    const [totalInvested, setTotalInvested] = useState(0)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchInvestments()
        fetchUpdates()
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
                    <div className="bg-gradient-to-br from-green-500/20 to-black/40 border border-green-500/30 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4 font-rajdhani text-lg">Company Health</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-white/80 text-sm">Revenue Growth</span>
                                    <span className="text-green-400 font-bold text-sm">+43%</span>
                                </div>
                                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: '86%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-white/80 text-sm">Cash Runway</span>
                                    <span className="text-green-400 font-bold text-sm">18 mo.</span>
                                </div>
                                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: '75%' }} />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-white/80 text-sm">User Growth</span>
                                    <span className="text-green-400 font-bold text-sm">+67%</span>
                                </div>
                                <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{ width: '92%' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Milestone */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-white font-bold mb-4 font-rajdhani text-lg">Next Milestone</h3>
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-[#F54029] font-bold mb-2">Series B Fundraise</p>
                            <p className="text-white/60 text-sm mb-3">Target: Q2 2025</p>
                            <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-[#F54029]" style={{ width: '65%' }} />
                            </div>
                            <p className="text-white/40 text-xs mt-2">65% complete</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
