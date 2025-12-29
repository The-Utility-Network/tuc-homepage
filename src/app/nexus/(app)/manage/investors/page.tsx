'use client';

import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Users, Search, Check, X, Shield, ExternalLink, Filter, Download, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function InvestorCRMPage() {
    const supabase = createClient();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'investor')
            .order('created_at', { ascending: false });
        setUsers(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const { error } = await supabase
            .from('profiles')
            .update({ status: newStatus })
            .eq('id', id);

        if (error) {
            alert('Error updating status');
        } else {
            fetchUsers(); // Refresh list to reflect changes
        }
    };

    const filteredUsers = users.filter((user) => {
        const matchesFilter = filter === 'all' || (user.status || 'pending') === filter;
        const matchesSearch =
            (user.full_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (user.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
            (user.company_name?.toLowerCase() || '').includes(search.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8">
            <header className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-6 border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-rajdhani font-bold text-white uppercase tracking-wider flex items-center gap-4">
                        <Users className="text-[#F54029]" size={40} />
                        Investor Relations
                    </h1>
                    <p className="text-white/40 text-sm mt-2 max-w-xl leading-relaxed">
                        Central command for accredited partners. Verify identities, manage access levels, and track portfolio allocation across the network.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                        <input
                            type="text"
                            placeholder="Search Name, Email, Firm..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-[#F54029] outline-none w-full sm:w-64 transition-colors"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
                        {['all', 'pending', 'approved', 'rejected'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-bold transition-all ${filter === f
                                    ? 'bg-[#F54029] text-white shadow-lg'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="text-white/40 text-center py-20 uppercase tracking-widest text-xs animate-pulse">Scanning secure database...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-20 border border-dashed border-white/10 rounded-2xl text-center bg-white/[0.02]">
                        <p className="text-white/40">No entries found matching criteria.</p>
                    </div>
                ) : (
                    <div className="space-y-3 animate-fadeInUp">
                        {filteredUsers.map((user) => (
                            <Link
                                href={`/nexus/manage/investors/${user.id}`}
                                key={user.id}
                                className="block"
                            >
                                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex flex-col lg:flex-row items-center gap-6 group hover:border-[#F54029]/30 hover:bg-white/[0.02] transition-all cursor-pointer">
                                    {/* Avatar & Basic Info */}
                                    <div className="flex items-center gap-4 flex-1 w-full lg:w-auto">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#F54029]/10 to-orange-600/10 flex items-center justify-center text-[#F54029] font-bold text-lg border border-[#F54029]/20 group-hover:scale-105 transition-transform">
                                            {user.full_name?.charAt(0) || user.email?.charAt(0)}
                                        </div>
                                        <div className="overflow-hidden min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-bold font-rajdhani text-white truncate group-hover:text-[#F54029] transition-colors">{user.full_name || 'Unknown User'}</h3>
                                                {user.company_name && (
                                                    <span className="hidden md:inline-block px-2 py-0.5 bg-white/5 rounded text-[10px] text-white/40 uppercase tracking-wider truncate max-w-[150px]">
                                                        {user.company_name}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-white/40 text-sm truncate">{user.email}</p>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="w-full lg:w-auto px-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${user.status === 'approved'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : user.status === 'rejected'
                                                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'approved' ? 'bg-green-500' : user.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'} animate-pulse`} />
                                            {user.status || 'pending'}
                                        </span>
                                    </div>

                                    {/* Metrics (Mock for now) */}
                                    <div className="w-full lg:w-auto flex items-center gap-8 px-4 text-center lg:text-left border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                                        <div>
                                            <p className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Total Deployed</p>
                                            <p className="text-white font-mono font-bold">$0.00</p>
                                        </div>
                                        <div>
                                            <p className="text-white/20 text-[10px] uppercase tracking-widest mb-1">Last Active</p>
                                            <p className="text-white/60 text-xs">{formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}</p>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0 justify-end">
                                        {user.status !== 'approved' && (
                                            <button
                                                onClick={(e) => handleStatusChange(user.id, 'approved', e)}
                                                className="p-2 hover:bg-green-500/10 text-green-400/60 hover:text-green-400 rounded-lg transition-colors"
                                                title="Approve"
                                            >
                                                <Check size={18} />
                                            </button>
                                        )}
                                        {user.status !== 'rejected' && (
                                            <button
                                                onClick={(e) => handleStatusChange(user.id, 'rejected', e)}
                                                className="p-2 hover:bg-red-500/10 text-red-400/60 hover:text-red-400 rounded-lg transition-colors"
                                                title="Deny"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                        <div className="w-px h-8 bg-white/10 mx-2" />
                                        <div className="text-white/20 group-hover:text-white transition-colors">
                                            <ArrowRight size={20} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

