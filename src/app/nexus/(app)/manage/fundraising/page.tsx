'use client';

import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import CampaignForm from '@/components/nexus/CampaignForm';
import { Briefcase, Plus, Calendar, DollarSign, Edit, Trash2, TrendingUp, Users, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function FundraisingPage() {
    const supabase = createClient();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<any>(null);

    const fetchCampaigns = async () => {
        const { data } = await supabase
            .from('campaigns')
            .select('*')
            .order('created_at', { ascending: false });
        setCampaigns(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this campaign?')) return;

        const { error } = await supabase.from('campaigns').delete().eq('id', id);
        if (error) {
            alert('Error deleting campaign');
        } else {
            fetchCampaigns();
        }
    };

    const formatUSD = (amount: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

    const getProgress = (raised: number, target: number) => {
        if (!target) return 0;
        return Math.min(Math.round((raised / target) * 100), 100);
    };

    // Calculate aggregate stats
    const totalRaised = campaigns.reduce((acc, c) => acc + (c.raised_amount || 0), 0);
    const activeCount = campaigns.filter(c => c.status === 'active').length;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-rajdhani font-bold text-white uppercase tracking-wider flex items-center gap-4">
                        <Briefcase className="text-[#F54029]" size={40} />
                        Fundraising Manager
                    </h1>
                    <p className="text-white/40 text-sm mt-2 max-w-xl leading-relaxed">
                        Orchestrate capital flow across the Utility Network. Monitor active rounds, structure new vehicles, and track aggregate performance.
                    </p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => { setEditingCampaign(null); setShowForm(true); }}
                        className="px-8 py-3 bg-[#F54029] hover:bg-[#C53020] text-white font-bold rounded-xl transition-all flex items-center gap-3 text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(245,64,41,0.3)] hover:shadow-[0_0_30px_rgba(245,64,41,0.5)] transform hover:-translate-y-1"
                    >
                        <Plus size={20} />
                        Launch New Round
                    </button>
                )}
            </header>

            {/* Stats Overview */}
            {!showForm && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeInUp">
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F54029]/10 rounded-full blur-[50px] -mr-16 -mt-16 group-hover:bg-[#F54029]/20 transition-all duration-500" />
                        <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <TrendingUp size={14} className="text-[#F54029]" />
                            Total Capital Raised
                        </h3>
                        <p className="text-4xl font-rajdhani font-bold text-white group-hover:text-[#F54029] transition-colors">{formatUSD(totalRaised)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] -mr-16 -mt-16 group-hover:bg-green-500/20 transition-all duration-500" />
                        <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Activity size={14} className="text-green-500" />
                            Active Rounds
                        </h3>
                        <p className="text-4xl font-rajdhani font-bold text-white group-hover:text-green-400 transition-colors">{activeCount}</p>
                    </div>
                    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-500" />
                        <h3 className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                            <Users size={14} className="text-blue-500" />
                            Total Vehicles
                        </h3>
                        <p className="text-4xl font-rajdhani font-bold text-white group-hover:text-blue-400 transition-colors">{campaigns.length}</p>
                    </div>
                </div>
            )}

            {showForm && (
                <div className="animate-fadeInUp">
                    <CampaignForm
                        campaign={editingCampaign}
                        onSuccess={() => { setShowForm(false); fetchCampaigns(); }}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {!showForm && (
                <div className="grid grid-cols-1 gap-6 animate-fadeInUp delay-100">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-2 border-[#F54029] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : campaigns.length === 0 ? (
                        <div className="p-12 border border-dashed border-white/10 rounded-2xl text-center bg-white/[0.02]">
                            <p className="text-white/40 mb-4">No funding rounds created yet.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="text-[#F54029] hover:text-white transition-colors uppercase tracking-wide text-xs font-bold"
                            >
                                Create your first campaign
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {campaigns.map((campaign) => (
                                <div key={campaign.id} className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden group hover:border-[#F54029]/40 transition-all hover:translate-y-[-2px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col">
                                    {/* Card Header */}
                                    <div className="p-6 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border shadow-[0_0_10px_inset] ${campaign.status === 'active'
                                                ? 'bg-[#F54029]/10 text-[#F54029] border-[#F54029]/20 shadow-[#F54029]/20'
                                                : 'bg-white/5 text-white/40 border-white/10 shadow-white/5'
                                                }`}>
                                                {campaign.status}
                                            </span>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setEditingCampaign(campaign); setShowForm(true); }}
                                                    className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(campaign.id, e)}
                                                    className="p-1.5 hover:bg-red-900/20 rounded-lg text-white/40 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-bold font-rajdhani text-white group-hover:text-[#F54029] transition-colors">{campaign.name}</h3>
                                        <p className="text-xs text-white/40 mt-1 line-clamp-2 min-h-[2.5em]">{campaign.description || 'No description provided.'}</p>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="px-6 py-4 border-b border-white/5">
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className="text-white/40 uppercase tracking-wider">Progress</span>
                                            <span className="text-white font-mono">{getProgress(campaign.raised_amount, campaign.target_amount)}%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#F54029] to-orange-500 rounded-full transition-all duration-1000"
                                                style={{ width: `${getProgress(campaign.raised_amount, campaign.target_amount)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
                                        <div>
                                            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Target Rise</p>
                                            <p className="text-white font-mono font-bold">{formatUSD(campaign.target_amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Raised So Far</p>
                                            <p className="text-[#F54029] font-mono font-bold">{formatUSD(campaign.raised_amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Min Ticket</p>
                                            <p className="text-white font-mono">{formatUSD(campaign.min_investment)}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Closing Date</p>
                                            <p className="text-white font-mono text-xs">{campaign.end_date || 'Open Ended'}</p>
                                        </div>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="mt-auto p-4 bg-white/[0.02]">
                                        <Link
                                            href={`/nexus/manage/fundraising/${campaign.id}`}
                                            className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40 group-hover:text-white group-hover:bg-white/5 rounded-lg transition-all"
                                        >
                                            Manage Campaign
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

