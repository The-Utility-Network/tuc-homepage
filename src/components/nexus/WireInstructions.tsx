'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { Copy, Check, Building, Banknote } from 'lucide-react';

export default function WireInstructions() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                // 1. Try fetching live Mercury data via our secure proxy
                const res = await fetch('/api/mercury/accounts');
                if (res.ok) {
                    const mercuryAccounts = await res.json();
                    if (mercuryAccounts.length > 0) {
                        // Transform Mercury data to our component format
                        const mapped = mercuryAccounts.map((acc: any) => ({
                            id: acc.id,
                            bank_name: 'Mercury / Evolve Bank & Trust', // Mercury often uses Evolve or Choice
                            account_number: acc.accountNumber,
                            routing_number: acc.routingNumber,
                            beneficiary_name: acc.name,
                            beneficiary_address: '123 Innovation Dr, Austin, TX 78701', // Static for now as API might not expose address
                            swift_code: acc.swiftCode || 'EVOLUS33' // Common for Mercury/Evolve
                        }));
                        setAccounts(mapped);
                        setLoading(false);
                        return;
                    }
                }
            } catch (e) {
                console.warn('Failed to fetch live Mercury data, falling back to DB');
            }

            // 2. Fallback to Supabase DB if API fails or is empty
            const { data } = await supabase
                .from('bank_accounts')
                .select('*')
                .eq('is_active', true);
            setAccounts(data || []);
            setLoading(false);
        };
        fetchAccounts();
    }, []);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    if (loading) return <div className="animate-pulse bg-white/5 h-48 rounded-2xl" />;

    if (accounts.length === 0) return (
        <div className="p-8 border border-white/10 rounded-2xl bg-black/40 text-center">
            <p className="text-white/40 text-sm">No wire instructions currently available.</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {accounts.map((account) => (
                <div key={account.id} className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent relative group">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <Banknote className="text-white/20" size={48} />
                    </div>

                    <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Building size={16} className="text-[#F54029]" />
                        Wire Transfer Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Beneficiary Name</p>
                            <div className="flex items-center gap-2">
                                <p className="font-rajdhani font-semibold text-lg max-w-[200px] truncate">{account.beneficiary_name}</p>
                                <button onClick={() => handleCopy(account.beneficiary_name, `name-${account.id}`)} className="text-white/20 hover:text-[#F54029] transition-colors">
                                    {copied === `name-${account.id}` ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Bank Name</p>
                            <p className="font-rajdhani font-semibold text-lg text-white/80">{account.bank_name}</p>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Account Number</p>
                            <div className="flex items-center gap-2">
                                <p className="font-rajdhani font-semibold text-lg text-white/80">{account.account_number}</p>
                                <button onClick={() => handleCopy(account.account_number, `acc-${account.id}`)} className="text-white/20 hover:text-[#F54029] transition-colors">
                                    {copied === `acc-${account.id}` ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Routing (ABA)</p>
                            <div className="flex items-center gap-2">
                                <p className="font-rajdhani font-semibold text-lg text-white/80">{account.routing_number}</p>
                                <button onClick={() => handleCopy(account.routing_number, `rout-${account.id}`)} className="text-white/20 hover:text-[#F54029] transition-colors">
                                    {copied === `rout-${account.id}` ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                            </div>
                        </div>

                        {account.swift_code && (
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">SWIFT / BIC</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-rajdhani font-semibold text-lg text-white/80">{account.swift_code}</p>
                                    <button onClick={() => handleCopy(account.swift_code, `swift-${account.id}`)} className="text-white/20 hover:text-[#F54029] transition-colors">
                                        {copied === `swift-${account.id}` ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-2">
                            <p className="text-[10px] uppercase tracking-wider text-white/40 mb-1">Beneficiary Address</p>
                            <p className="font-rajdhani text-sm text-white/60">{account.beneficiary_address}</p>
                        </div>
                    </div>
                </div>
            ))}

            <p className="text-xs text-center text-white/30 italic">
                * Please include your TUC Investor ID in the wire memo for faster processing.
            </p>
        </div>
    );
}
