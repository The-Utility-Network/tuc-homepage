import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, DollarSign, Users, Clock, Target, Zap, ArrowRight, CheckCircle, AlertCircle, Plus, LayoutGrid, Briefcase } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface Campaign {
    id: string
    name: string
    roundType: string
    targetAmount: number
    totalCommitted: number
    totalWired: number
    totalClosed: number
    numberOfInvestors: number
    status: string
    launchDate: string
    targetCloseDate: string
    preMoneyValuation: number
}

interface CampaignDashboardProps {
    subsidiaryId: string
    onOpenWizard: () => void
}

export default function CampaignDashboard({ subsidiaryId, onOpenWizard }: CampaignDashboardProps) {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchCampaigns()
    }, [subsidiaryId])

    async function fetchCampaigns() {
        // ... (fetch logic remains same)
        const { data, error } = await supabase
            .from('fundraising_campaigns')
            .select('*')
            .eq('subsidiary_id', subsidiaryId)
            .order('created_at', { ascending: false })

        if (data) {
            const formatted = data.map(c => ({
                id: c.id,
                name: c.name,
                roundType: c.round_type,
                targetAmount: c.target_amount,
                totalCommitted: c.total_committed,
                totalWired: c.total_wired,
                totalClosed: c.total_closed,
                numberOfInvestors: c.number_of_investors,
                status: c.status,
                launchDate: c.launch_date,
                targetCloseDate: c.target_close_date,
                preMoneyValuation: c.pre_money_valuation,
            }))

            setCampaigns(formatted)
            setActiveCampaign(formatted.find(c => c.status === 'active') || formatted[0] || null)
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

    if (!activeCampaign) {
        return (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-12 text-center">
                <Zap className="mx-auto mb-4 text-white/40" size={64} />
                <h3 className="text-2xl font-bold text-white mb-4 font-rajdhani">No Active Campaigns</h3>
                <p className="text-white/60 mb-8">Launch your first fundraising campaign to start raising capital.</p>
                <button
                    onClick={onOpenWizard}
                    className="px-8 py-4 bg-[#F54029] hover:bg-[#F54029]/90 text-white font-bold rounded-xl transition-all inline-flex items-center gap-3"
                >
                    <Target size={24} />
                    Launch Round
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8 relative">

            {/* Hero Stats */}
            {activeCampaign && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Primary Metric - Amount Raised */}
                    <div className="md:col-span-2 bg-gradient-to-br from-[#F54029]/20 via-purple-500/10 to-black/40 border border-[#F54029]/30 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-[#F54029]/20 rounded-lg">
                                <DollarSign className="text-[#F54029]" size={32} />
                            </div>
                            <div>
                                <p className="text-white/60 text-sm uppercase tracking-wider">Committed Capital</p>
                                <h2 className="text-5xl font-bold text-white font-rajdhani">
                                    ${(activeCampaign.totalCommitted / 1000000).toFixed(2)}M
                                </h2>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex justify-between mb-3">
                                <span className="text-white/80 text-sm font-medium">Progress to Target</span>
                                <span className="text-white font-bold">{((activeCampaign.totalCommitted / activeCampaign.targetAmount) * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-white/10">
                                <div
                                    className="h-full bg-gradient-to-r from-[#F54029] to-purple-500 transition-all duration-500"
                                    style={{ width: `${Math.min((activeCampaign.totalCommitted / activeCampaign.targetAmount) * 100, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-sm">
                                <span className="text-white/60">Wired: ${(activeCampaign.totalWired / 1000000).toFixed(2)}M</span>
                                <span className="text-white/60">Target: ${(activeCampaign.targetAmount / 1000000).toFixed(2)}M</span>
                            </div>
                        </div>
                    </div>

                    {/* Investors */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="text-purple-400" size={24} />
                            <p className="text-white/60 text-sm uppercase tracking-wider">Investors</p>
                        </div>
                        <h3 className="text-4xl font-bold text-white font-rajdhani mb-2">
                            {activeCampaign.numberOfInvestors}
                        </h3>
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                            <TrendingUp size={16} />
                            <span>On track</span>
                        </div>
                    </div>

                    {/* Deadline */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="text-blue-400" size={24} />
                            <p className="text-white/60 text-sm uppercase tracking-wider">Days Remaining</p>
                        </div>
                        <h3 className="text-4xl font-bold text-white font-rajdhani mb-2">
                            {activeCampaign.targetCloseDate
                                ? Math.max(0, Math.ceil((new Date(activeCampaign.targetCloseDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                                : 'Active'}
                        </h3>
                        <p className="text-white/60 text-sm">
                            {activeCampaign.targetCloseDate
                                ? new Date(activeCampaign.targetCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : 'No deadline set'}
                        </p>
                    </div>
                </div>
            )}

            {/* Campaign Info */}
            {activeCampaign && (
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-4 mb-2">
                                <h2 className="text-3xl font-bold text-white font-rajdhani">{activeCampaign.name}</h2>
                                <span className={`px-4 py-1 rounded-full text-sm font-medium ${activeCampaign.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                    activeCampaign.status === 'closing' ? 'bg-blue-500/20 text-blue-400' :
                                        activeCampaign.status === 'closed' ? 'bg-gray-500/20 text-gray-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {activeCampaign.status.toUpperCase()}
                                </span>
                            </div>
                            <p className="text-white/60">
                                {activeCampaign.roundType.replace('_', ' ').toUpperCase()} Round
                                {activeCampaign.preMoneyValuation && ` • $${(activeCampaign.preMoneyValuation / 1000000).toFixed(1)}M Pre-Money`}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={onOpenWizard}
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-all flex items-center gap-2"
                            >
                                <Plus size={20} />
                                New Round
                            </button>
                            {/* Removed detail view for now to keep it single page, can re-add if needed */}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6">
                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Avg. Commitment</p>
                            <p className="text-white text-2xl font-bold">
                                ${activeCampaign.numberOfInvestors > 0
                                    ? ((activeCampaign.totalCommitted / activeCampaign.numberOfInvestors) / 1000).toFixed(0)
                                    : 0}K
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Wire Completion</p>
                            <p className="text-white text-2xl font-bold">
                                {activeCampaign.totalCommitted > 0
                                    ? ((activeCampaign.totalWired / activeCampaign.totalCommitted) * 100).toFixed(0)
                                    : 0}%
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Fully Closed</p>
                            <p className="text-white text-2xl font-bold">
                                ${(activeCampaign.totalClosed / 1000).toFixed(0)}K
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-lg p-4">
                            <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Launch Date</p>
                            <p className="text-white text-xl font-bold">
                                {activeCampaign.launchDate
                                    ? new Date(activeCampaign.launchDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                    : 'TBD'}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            {activeCampaign && (
                <div className="grid grid-cols-3 gap-6">
                    <button
                        // onClick={() => router.push(`/nexus/fundraising/campaigns/${activeCampaign.id}/commitments`)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all group text-left"
                    >
                        <CheckCircle className="text-green-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-white font-bold text-lg mb-2">Manage Commitments</h3>
                        <p className="text-white/60 text-sm">Track investor commitments and wire transfers</p>
                    </button>

                    <button
                        // onClick={() => router.push(`/nexus/fundraising/campaigns/${activeCampaign.id}/communications`)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all group text-left"
                    >
                        <Zap className="text-blue-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-white font-bold text-lg mb-2">Send Update</h3>
                        <p className="text-white/60 text-sm">Communicate with investors</p>
                    </button>

                    <button
                        // onClick={() => router.push(`/nexus/fundraising/campaigns/${activeCampaign.id}/analytics`)}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-6 transition-all group text-left"
                    >
                        <TrendingUp className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" size={32} />
                        <h3 className="text-white font-bold text-lg mb-2">View Analytics</h3>
                        <p className="text-white/60 text-sm">Deep dive into campaign performance</p>
                    </button>
                </div>
            )}

            {/* All Campaigns List */}
            {campaigns.length > 0 && (
                <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-white mb-6 font-rajdhani">Active Rounds & Campaigns</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {campaigns.map(campaign => (
                            <div key={campaign.id} className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-[#F54029]/30 transition-all group relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${campaign.status === 'active' ? 'bg-[#F54029] text-white' : 'bg-white/10 text-white/40'}`}>
                                        {campaign.status}
                                    </span>
                                </div>
                                <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[#F54029] transition-colors truncate">{campaign.name}</h4>
                                <p className="text-xs text-white/40 uppercase tracking-widest mb-6">{campaign.roundType}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/40">Target</span>
                                        <span className="text-white font-mono">${(campaign.targetAmount / 1000000).toFixed(2)}M</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/40">Valuation</span>
                                        <span className="text-white font-mono">${(campaign.preMoneyValuation / 1000000).toFixed(2)}M</span>
                                    </div>
                                </div>

                                <div className="w-full py-2 bg-white/5 rounded-lg text-center text-xs text-white/40 uppercase tracking-wider border border-white/5 cursor-pointer hover:bg-white/10 hover:text-white" onClick={() => setActiveCampaign(campaign)}>
                                    View Details
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
