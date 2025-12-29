'use client';

import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, DollarSign, Calendar, FileText, Settings, Download, Wallet, CreditCard, Copy, Check, Landmark } from 'lucide-react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';

export default function CampaignDetailPage() {
    const supabase = createClient();
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [campaign, setCampaign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;

            // 1. Fetch Campaign
            const { data: c } = await supabase.from('campaigns').select('*').eq('id', id).single();
            setCampaign(c);

            // 2. Fetch Transactions (The Ledger)
            const { data: txs } = await supabase
                .from('transactions')
                .select('*, user:profiles(full_name, email, company_name)')
                .eq('campaign_id', id)
                .order('created_at', { ascending: false });
            setTransactions(txs || []);

            // 3. Fetch Receiving Wallet
            // In a real app, this might be specific to the campaign, or a global default
            const { data: integ } = await supabase
                .from('integrations')
                .select('value')
                .eq('category', 'wallet')
                .limit(1)
                .single();

            if (integ) setWalletAddress(integ.value);

            setLoading(false);
        };
        fetchDetails();
    }, [id]);

    const handleCopy = () => {
        if (walletAddress) {
            navigator.clipboard.writeText(walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return <div className="text-white/40 p-10 animate-pulse">Initializing Secure Connection...</div>;
    if (!campaign) return <div className="text-red-400 p-10">Error: Campaign Restricted or Not Found</div>;

    const formatUSD = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    const progress = Math.min((campaign.raised_amount / campaign.target_amount) * 100, 100);

    return (
        <div className="space-y-8 animate-fadeIn pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <button onClick={() => router.back()} className="text-white/40 hover:text-white flex items-center gap-2 text-sm uppercase tracking-wider transition-colors w-fit">
                    <ArrowLeft size={16} /> Back to Rounds
                </button>

                <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl lg:text-5xl font-rajdhani font-bold text-white uppercase tracking-wide">{campaign.name}</h1>
                            <span className={`px-3 py-1 text-xs uppercase tracking-wider font-bold rounded-full border shadow-[0_0_15px_rgba(0,0,0,0.3)] ${campaign.status === 'active'
                                ? 'bg-[#F54029]/10 text-[#F54029] border-[#F54029]/20'
                                : 'bg-white/5 text-white/40 border-white/10'
                                }`}>
                                {campaign.status}
                            </span>
                        </div>
                        <p className="text-white/60 max-w-3xl text-lg font-light leading-relaxed">{campaign.description}</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Stats & Ledger */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Performance Card */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden backdrop-blur-sm group hover:border-[#F54029]/20 transition-colors">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F54029]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#F54029]/10 transition-colors duration-500" />

                        <h3 className="text-xl font-bold font-rajdhani text-white mb-8 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#F54029]/10 border border-[#F54029]/20">
                                <DollarSign className="text-[#F54029]" size={20} />
                            </div>
                            Live Capital Deployment
                        </h3>

                        <div className="mb-10">
                            <div className="flex flex-wrap justify-between items-end mb-4 gap-4">
                                <div>
                                    <p className="text-5xl lg:text-6xl font-rajdhani font-bold text-white tracking-tight">{formatUSD(campaign.raised_amount)}</p>
                                    <p className="text-white/40 text-sm uppercase tracking-wider mt-2 font-medium">
                                        Raised of <span className="text-white/60">{formatUSD(campaign.target_amount)}</span> Target
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-[#F54029]">{Math.round(progress)}%</p>
                                    <p className="text-white/30 text-[10px] uppercase tracking-widest">Completion</p>
                                </div>
                            </div>

                            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-[#F54029] to-[#961b0b] relative transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(245,64,41,0.5)]"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]" />
                                    <div className="absolute right-0 top-0 bottom-0 w-px bg-white/50 shadow-[0_0_10px_white]" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2 font-bold">Minimum Ticket</p>
                                <p className="text-xl font-mono text-white">{formatUSD(campaign.min_investment)}</p>
                            </div>
                            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2 font-bold">Round Open</p>
                                <p className="text-xl font-mono text-white">{campaign.start_date ? format(new Date(campaign.start_date), 'MMM d') : 'TBA'}</p>
                            </div>
                            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2 font-bold">Total Contributors</p>
                                <p className="text-xl font-mono text-white flex items-center gap-2">
                                    {transactions.length}
                                    <Users size={14} className="text-white/20" />
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Ledger */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold font-rajdhani text-white flex items-center gap-2">
                                <CreditCard className="text-[#F54029]" size={20} />
                                Investor Ledger
                            </h3>
                            <button className="text-xs text-white/40 hover:text-white flex items-center gap-2 uppercase tracking-wider transition-colors bg-white/5 px-3 py-2 rounded-lg hover:bg-white/10">
                                <Download size={14} /> Export CSV
                            </button>
                        </div>

                        {transactions.length === 0 ? (
                            <div className="p-12 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center bg-white/[0.02]">
                                <Users className="text-white/10 mb-4" size={48} />
                                <p className="text-white/40 text-sm font-medium">No transactions recorded on chain.</p>
                                <p className="text-white/20 text-xs mt-1">Pending incoming capital...</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-white/60">
                                    <thead>
                                        <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/30">
                                            <th className="pb-3 pl-2">Investor</th>
                                            <th className="pb-3">Type</th>
                                            <th className="pb-3">Amount</th>
                                            <th className="pb-3 text-right pr-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="py-4 pl-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-xs font-bold text-white border border-white/10">
                                                            {(tx.user?.full_name || 'U').charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-medium">{tx.user?.full_name || 'Unknown'}</p>
                                                            <p className="text-[10px] text-white/30">{formatDistanceToNow(new Date(tx.created_at))}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 font-mono text-xs uppercase text-white/50">{tx.provider || 'Direct'}</td>
                                                <td className="py-4 font-mono text-white">{formatUSD(tx.amount)}</td>
                                                <td className="py-4 text-right pr-2">
                                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${tx.status === 'completed' ? 'text-green-400 bg-green-400/10' :
                                                        tx.status === 'pending' ? 'text-amber-400 bg-amber-400/10' :
                                                            'text-red-400 bg-red-400/10'
                                                        }`}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Col: Funding Actions */}
                <div className="space-y-6">
                    {/* Wallet Card */}
                    <div className="bg-gradient-to-b from-[#1A1A1A] to-black border border-white/10 border-t-[#F54029]/50 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />

                        <h3 className="text-sm font-bold font-rajdhani text-white uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10">
                            <Wallet size={16} className="text-[#F54029]" />
                            Funding Designation
                        </h3>

                        <div className="relative z-10">
                            <p className="text-xs text-white/40 mb-2 uppercase tracking-wide">USDC / ETH Address</p>
                            <div
                                onClick={handleCopy}
                                className="bg-black/50 border border-white/10 hover:border-[#F54029]/50 rounded-xl p-4 flex items-center justify-between gap-3 cursor-pointer transition-all group/wallet"
                            >
                                <code className="text-xs text-white/80 font-mono truncate">
                                    {walletAddress || '0x... (Config Required)'}
                                </code>
                                <div className="text-white/40 group-hover/wallet:text-white transition-colors">
                                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                </div>
                            </div>
                            {walletAddress ? (
                                <p className="text-[10px] text-white/30 mt-2 text-center">
                                    Only send accepted stablecoins or ETH.
                                </p>
                            ) : (
                                <Link href="/nexus/settings" className="block text-[10px] text-[#F54029] mt-2 text-center hover:underline">
                                    ⚠ Configure Wallet in Settings
                                </Link>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                            <button className="w-full py-4 bg-[#F54029] hover:bg-[#C53020] text-white font-bold rounded-xl uppercase tracking-widest shadow-[0_0_20px_rgba(245,64,41,0.2)] hover:shadow-[0_0_30px_rgba(245,64,41,0.4)] transition-all flex items-center justify-center gap-2">
                                <DollarSign size={18} /> Initiate Transfer
                            </button>
                            <p className="text-[10px] text-white/20 text-center mt-3">
                                Powered by Nexus Financial Rails
                            </p>
                        </div>
                    </div>

                    {/* Admin Config */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <h3 className="text-sm font-bold font-rajdhani text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Settings size={16} className="text-[#F54029]" />
                            Admin Controls
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs uppercase tracking-wide transition-all text-left px-4 flex justify-between group">
                                Edit Parameters <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs uppercase tracking-wide transition-all text-left px-4 flex justify-between group">
                                Manage Documents <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>

                    {/* Docs Link */}
                    {campaign.terms_url && (
                        <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                            <a
                                href={campaign.terms_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#F54029]/30 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/5 rounded-lg text-white/40 group-hover:text-[#F54029] transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white font-bold group-hover:text-[#F54029] transition-colors">Deal Memo</p>
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider">Download PDF</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

function ChevronRight({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    )
}
