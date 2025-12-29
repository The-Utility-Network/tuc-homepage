import { createClient } from '@/lib/supabase-server'
import { Users, DollarSign, FileText, TrendingUp, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

async function getAdminStats() {
    const supabase = await createClient()

    // 1. Total Raised (Sum of completed investment transactions)
    const { data: txs } = await supabase
        .from('transactions')
        .select('amount')
        .eq('status', 'completed')
        .eq('type', 'investment')

    // 2. Total Campaigns
    const { data: campaigns } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')

    // 3. Active Investors
    const { count: investorCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'investor')

    // 4. Pending Requests (Assuming we add a 'status' to profiles later, for now just new users)
    // using recent signups as proxy
    const { data: recentUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

    const totalRaised = txs?.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) || 0

    return {
        totalRaised,
        investorCount: investorCount || 0,
        activeCampaigns: campaigns || [],
        recentUsers: recentUsers || []
    }
}

export default async function AdminDashboard({ profile }: { profile: any }) {
    const stats = await getAdminStats()

    // Format currency
    const formatUSD = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)

    const statCards = [
        { label: 'Total Raised', value: formatUSD(stats.totalRaised), change: 'Live', icon: DollarSign },
        { label: 'Active Investors', value: stats.investorCount.toString(), change: 'Total', icon: Users },
        { label: 'Active Campaigns', value: stats.activeCampaigns.length.toString(), change: 'Open', icon: TrendingUp },
        { label: 'Pending Docs', value: '0', change: '--', icon: FileText }, // Placeholder until doc system
    ]

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.label} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-[#F54029]/10 rounded-lg text-[#F54029] group-hover:text-[#ff8062] transition-colors">
                                <stat.icon size={20} />
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change === 'Live' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/40'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold font-rajdhani text-white mb-1">{stat.value}</h3>
                        <p className="text-white/40 text-xs uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold font-rajdhani text-white mb-6 flex items-center gap-2">
                        <Users className="text-[#F54029]" size={20} />
                        Recent Users
                    </h3>
                    <div className="space-y-4">
                        {stats.recentUsers.map((user: any) => (
                            <div key={user.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F54029]/20 to-orange-500/20 flex items-center justify-center text-[#F54029] font-bold text-xs">
                                        {user.full_name?.charAt(0) || user.email?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{user.full_name || 'User'}</p>
                                        <p className="text-xs text-white/40">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1.5 bg-white/5 text-white/40 text-xs rounded-lg uppercase tracking-wider">
                                        {user.role}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {stats.recentUsers.length === 0 && (
                            <p className="text-white/40 text-sm text-center py-4">No users found.</p>
                        )}
                    </div>
                    <Link href="/nexus/manage/investors" className="block text-center mt-6 text-xs text-[#F54029] hover:text-[#ff8062] uppercase tracking-widest">
                        View All Users
                    </Link>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold font-rajdhani text-white flex items-center gap-2">
                            <TrendingUp className="text-[#F54029]" size={20} />
                            Active Campaigns
                        </h3>
                        <Link href="/nexus/ventures" className="p-2 hover:bg-white/10 rounded-lg text-[#F54029] transition-colors">
                            <Plus size={18} />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {stats.activeCampaigns.map((campaign: any) => (
                            <div key={campaign.id} className="p-4 bg-gradient-to-r from-red-900/10 to-orange-900/10 border border-[#F54029]/20 rounded-xl">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-white">{campaign.name}</h4>
                                    <span className="text-xs px-2 py-1 bg-[#F54029]/20 text-[#F54029] rounded-full uppercase tracking-wider">{campaign.status}</span>
                                </div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="bg-gradient-to-r from-[#F54029] to-orange-500 h-full rounded-full"
                                        style={{ width: `${Math.min(((campaign.raised_amount || 0) / (campaign.target_amount || 1)) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-white/60">
                                    <span>{formatUSD(campaign.raised_amount || 0)} Raised</span>
                                    <span>Target: {formatUSD(campaign.target_amount || 0)}</span>
                                </div>
                            </div>
                        ))}
                        {stats.activeCampaigns.length === 0 && (
                            <p className="text-white/40 text-sm text-center py-4">No active campaigns.</p>
                        )}
                    </div>
                    <Link href="/nexus/ventures" className="block text-center mt-6 text-xs text-[#F54029] hover:text-[#ff8062] uppercase tracking-widest">
                        Manage Campaigns
                    </Link>
                </div>
            </div>
        </div>
    )
}
