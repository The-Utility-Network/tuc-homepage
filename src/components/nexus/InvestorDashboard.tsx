'use client'

import { Download, FileText, PieChart, TrendingUp, ExternalLink, Activity, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import InvestorStatusCard from './InvestorStatusCard'

export default function InvestorDashboard({ profile }: { profile: any }) {
    const supabase = createClient()
    const [campaigns, setCampaigns] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase
                .from('campaigns')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(3)

            setCampaigns(data || [])
            setLoading(false)
        }
        fetchData()
    }, [])

    const formatUSD = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Investor Status & Accreditation */}
            <InvestorStatusCard />

            {/* Portfolio Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Value Card */}
                <div className="lg:col-span-2 bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-[#F54029]/20 rounded-2xl p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F54029]/10 blur-[100px] rounded-full -mr-32 -mt-32" />

                    <h2 className="text-white/60 uppercase tracking-widest text-xs font-bold mb-2 flex items-center gap-2">
                        <Activity size={14} className="text-[#F54029]" />
                        Total Asset Value
                    </h2>
                    <div className="flex items-baseline gap-4">
                        <h3 className="text-5xl md:text-6xl font-bold font-rajdhani text-white tracking-tight">
                            $0.00
                        </h3>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-white/40 text-xs border border-white/5 font-mono">
                            No active positions
                        </span>
                    </div>

                    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Total Invested</p>
                            <p className="text-xl font-rajdhani font-semibold text-white">$0.00</p>
                        </div>
                        <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">IRR (Est.)</p>
                            <p className="text-xl font-rajdhani font-semibold text-[#F54029]">--%</p>
                        </div>
                        <div>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Distributions</p>
                            <p className="text-xl font-rajdhani font-semibold text-white">$0.00</p>
                        </div>
                    </div>
                </div>

                {/* Contact/Support Card */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-8 flex flex-col justify-between hover:border-[#F54029]/30 transition-colors group">
                    <div>
                        <h3 className="text-lg font-bold font-rajdhani text-white mb-2">Concierge Support</h3>
                        <p className="text-white/40 text-sm mb-6 leading-relaxed">
                            Direct line to our Investor Relations team for inquiries about open rounds or portfolio management.
                        </p>
                    </div>
                    <Link href="mailto:ir@tuc.network" className="w-full py-3 bg-white/5 hover:bg-[#F54029]/10 border border-white/10 hover:border-[#F54029]/50 text-white hover:text-[#F54029] rounded-lg transition-all text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2">
                        Contact IR Team
                    </Link>
                </div>
            </div>

            {/* Documents & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold font-rajdhani text-white flex items-center gap-2">
                            <FileText className="text-[#F54029]" size={20} />
                            Recent Documents
                        </h3>
                        <Link href="/nexus/documents" className="text-xs text-[#F54029] hover:text-white uppercase tracking-wide transition-colors">
                            View Console
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <div className="p-4 rounded-xl border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-center py-12">
                            <FileText className="text-white/20 mb-3" size={32} />
                            <p className="text-white/40 text-sm font-medium">Secure Vault Empty</p>
                            <p className="text-white/20 text-xs mt-1">Confidential documents will be provisioned here.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold font-rajdhani text-white flex items-center gap-2">
                            <TrendingUp className="text-[#F54029]" size={20} />
                            Live Opportunities
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center text-white/20 py-8 text-xs uppercase tracking-widest animate-pulse">Syncing Opportunities...</div>
                        ) : campaigns.length === 0 ? (
                            <div className="p-8 text-center border border-white/5 rounded-xl">
                                <p className="text-white/40 text-sm">No active rounds at this moment.</p>
                            </div>
                        ) : (
                            campaigns.map(campaign => (
                                <div key={campaign.id} className="p-4 bg-gradient-to-r from-red-900/5 to-transparent border border-[#F54029]/10 rounded-xl group hover:border-[#F54029]/40 transition-all cursor-pointer hover:bg-white/[0.02]">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-[#F54029] transition-colors font-rajdhani">{campaign.name}</h4>
                                            <p className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
                                                Target: {formatUSD(campaign.target_amount)}
                                            </p>
                                        </div>
                                        <span className="text-[10px] px-2 py-1 bg-[#F54029]/20 text-[#F54029] rounded-full uppercase tracking-wider font-bold">Live</span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-xs text-white/60">
                                            <div className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                <span>Min: {formatUSD(campaign.min_investment)}</span>
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#F54029] group-hover:text-white transition-all">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

