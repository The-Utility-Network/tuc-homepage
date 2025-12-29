'use client';

import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, User, Building, Mail, Phone, Calendar, Shield, ExternalLink, FileText, Check, X, Ban } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

export default function InvestorDetailPage() {
    const supabase = createClient();
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [investments, setInvestments] = useState<any[]>([]);

    const fetchDetails = async () => {
        if (!id) return;

        const { data: u } = await supabase.from('profiles').select('*').eq('id', id).single();
        setUser(u);

        // Mock fetching investments
        // TODO: Join with real investments table
        setInvestments([]);

        setLoading(false);
    };

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const handleStatusChange = async (newStatus: string) => {
        if (!confirm(`Are you sure you want to set this user to ${newStatus}?`)) return;

        const { error } = await supabase
            .from('profiles')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            alert('Error updating status');
        } else {
            fetchDetails();
        }
    };

    if (loading) return <div className="text-white/40 py-20 text-center animate-pulse">Retrieving dossier...</div>;
    if (!user) return <div className="text-red-400 text-center py-20">Investor profile not found.</div>;

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header */}
            <div>
                <button onClick={() => router.back()} className="text-white/40 hover:text-white flex items-center gap-2 text-sm uppercase tracking-wider transition-colors mb-6">
                    <ArrowLeft size={16} /> Back to Directory
                </button>

                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#F54029] to-orange-800 flex items-center justify-center text-white font-bold text-4xl shadow-[0_0_30px_rgba(245,64,41,0.3)] border border-white/10">
                            {user.full_name?.charAt(0) || user.email?.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-rajdhani font-bold text-white mb-2">{user.full_name || 'Nameless User'}</h1>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${user.status === 'approved'
                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                    : user.status === 'rejected'
                                        ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                    }`}>
                                    {user.status || 'Pending Review'}
                                </span>
                                <span className="text-white/40 text-xs flex items-center gap-1">
                                    <Calendar size={12} />
                                    Joined {format(new Date(user.created_at), 'MMM d, yyyy')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {user.status !== 'approved' && (
                            <button onClick={() => handleStatusChange('approved')} className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-[#050505] font-bold rounded-xl transition-all shadow-lg shadow-green-900/20">
                                Approve Access
                            </button>
                        )}
                        {user.status !== 'rejected' && (
                            <button onClick={() => handleStatusChange('rejected')} className="px-5 py-2.5 bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 font-bold rounded-xl transition-all border border-white/10 hover:border-red-500/30">
                                Deny / Ban
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Info */}
                <div className="space-y-8">
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold font-rajdhani text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                            <User size={16} className="text-[#F54029]" />
                            Profile Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Company / Firm</p>
                                <div className="flex items-center gap-2 text-white">
                                    <Building size={16} className="text-white/40" />
                                    {user.company_name || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Email Address</p>
                                <div className="flex items-center gap-2 text-white">
                                    <Mail size={16} className="text-white/40" />
                                    {user.email}
                                </div>
                            </div>
                            <div>
                                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Role</p>
                                <div className="flex items-center gap-2 text-white capitalize">
                                    <Shield size={16} className="text-white/40" />
                                    {user.role}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Activity & Investments */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-8 min-h-[400px]">
                        <h3 className="text-lg font-bold font-rajdhani text-white mb-6">Investment History</h3>

                        {investments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                                <p className="text-white/40 text-sm">No investment activity recorded.</p>
                                <p className="text-white/20 text-xs mt-1">Allocations will appear here once finalized.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Map investments */}
                            </div>
                        )}
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                        <h3 className="text-lg font-bold font-rajdhani text-white mb-4">Internal Notes</h3>
                        <textarea
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white/80 h-32 focus:border-[#F54029] outline-none transition-colors resize-none"
                            placeholder="Add internal notes about this investor (KYC status, preferences, etc)..."
                        />
                        <div className="flex justify-end mt-4">
                            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wide font-bold rounded-lg transition-colors">
                                Save Notes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
