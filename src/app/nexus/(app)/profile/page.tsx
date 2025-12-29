'use client'

import { createClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { User, Mail, Phone, Shield, Save, Check, RefreshCw, Wallet, Landmark } from 'lucide-react'
import { ConnectButton } from "thirdweb/react"
import { client } from "@/lib/client"

export default function ProfilePage() {
    const supabase = createClient()
    const [profile, setProfile] = useState<any>(null)
    const [bankAccounts, setBankAccounts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
                setProfile(data)
            }

            // Fetch Mercury Accounts
            try {
                const res = await fetch('/api/mercury/accounts')
                const data = await res.json()
                if (data.accounts) {
                    // We map to a clean structure
                    const mapped = data.accounts.map((acc: any) => ({
                        nickname: acc.nickname,
                        bank_name: 'Choice Financial Group', // Common for Mercury, but better if we could detect
                        routing_number: acc.routingNumber,
                        account_number: acc.accountNumber,
                        beneficiary_name: 'The Utility Company LLC',
                        beneficiary_address: '5901 Indian School Road Northeast, Suite 151, Albuquerque, NM 87110',
                        bank_address: '4501 23rd Avenue S, Fargo, ND 58104'
                    }))
                    setBankAccounts(mapped)
                }
            } catch (e) {
                console.error('Failed to fetch banking details')
            }

            setLoading(false)
        }
        fetchProfile()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: profile.full_name,
                company_name: profile.company_name,
                updated_at: new Date().toISOString()
            })
            .eq('id', profile.id)

        setSaving(false)
        if (!error) {
            setMessage('Profile updated successfully.')
            setTimeout(() => setMessage(null), 3000)
        }
    }

    if (loading) return <div className="text-white/40 p-8">Loading profile...</div>

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn">
            <header className="border-b border-white/5 pb-8">
                <h1 className="text-4xl font-rajdhani font-bold text-white uppercase tracking-wider flex items-center gap-4">
                    <User className="text-[#F54029]" size={40} />
                    My Profile
                </h1>
                <p className="text-white/40 text-sm mt-2">
                    Manage your personal information and account security.
                </p>
            </header>

            {message && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-sm font-bold">
                    <Check size={18} /> {message}
                </div>
            )}

            <div className="bg-black/40 border border-white/10 rounded-2xl p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <User size={12} /> Full Name
                        </label>
                        <input
                            type="text"
                            value={profile?.full_name || ''}
                            onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029]/50 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <Shield size={12} /> Company / Entity
                        </label>
                        <input
                            type="text"
                            value={profile?.company_name || ''}
                            onChange={e => setProfile({ ...profile, company_name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-[#F54029]/50 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <Mail size={12} /> Email Address
                        </label>
                        <input
                            type="text"
                            value={profile?.email || ''}
                            disabled
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/50 cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest text-white/40 flex items-center gap-2">
                            <Shield size={12} /> Role
                        </label>
                        <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-[#F54029] font-bold uppercase tracking-wider text-sm">
                            {profile?.role}
                        </div>
                    </div>
                </div>

                {/* ... existing form ... */}

                <div className="border-t border-white/5 pt-8">
                    <h3 className="text-xl font-bold font-rajdhani text-white mb-6 flex items-center gap-2">
                        <Wallet className="text-[#F54029]" size={24} /> Connected Wallet
                    </h3>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left">
                            <p className="text-sm text-white/80 font-medium">Link your Web3 Wallet</p>
                            <p className="text-xs text-white/40 max-w-sm">
                                Connect your supported crypto wallet (MetaMask, Coinbase, etc.) to enable seamless investment transactions and asset verification.
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            {/* 
                                Ideally we use ThirdWeb's ConnectButton here. 
                                Since we are in a pure client component, we can use it.
                                We need to make sure 'client' is passed if needed, or context usage.
                                Assuming ThirdwebProvider is in layout.
                            */}
                            <div className="thirdweb-connect-wrapper">
                                <ConnectButton
                                    client={client}
                                    theme={"dark"}
                                    btnTitle={"Connect Wallet"}
                                    modalTitle={"Link Wallet"}
                                    auth={{
                                        isLoggedIn: async (address) => {
                                            // Optional: Verification logic
                                            return true;
                                        },
                                        doLogin: async (params) => {
                                            // Handle login/signing if needed
                                        },
                                        getLoginPayload: async (params) => {
                                            return {} as any;
                                        },
                                        doLogout: async () => {
                                            // Handle logout
                                        }
                                    }}
                                    onConnect={async (wallet) => {
                                        const address = wallet.getAccount()?.address;
                                        if (address && profile) {
                                            await supabase
                                                .from('profiles')
                                                .update({ wallet_address: address })
                                                .eq('id', profile.id);
                                            setMessage('Wallet linked successfully.');
                                            setProfile(prev => ({ ...prev, wallet_address: address }));
                                        }
                                    }}
                                />
                            </div>
                            {profile?.wallet_address && (
                                <p className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                                    <Check size={10} /> Saved: {profile.wallet_address.slice(0, 6)}...{profile.wallet_address.slice(-4)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-4 bg-[#F54029] hover:bg-[#C53020] text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}
