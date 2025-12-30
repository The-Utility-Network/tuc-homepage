'use client'

import { createClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { User, Mail, Phone, Shield, Save, Check, RefreshCw, Wallet, Landmark, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { ConnectButton } from "thirdweb/react"
import { client } from "@/lib/client"
import { getInvestorStatus } from '@/lib/investment-limits'
import Link from 'next/link'

export default function ProfilePage() {
    const supabase = createClient()
    const [profile, setProfile] = useState<any>(null)
    const [investorStatus, setInvestorStatus] = useState<any>(null)
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

                // Fetch investor status
                const status = await getInvestorStatus(user.id)
                setInvestorStatus(status)
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
                                    connectButton={{ label: "Connect Wallet" }}
                                    connectModal={{ title: "Link Wallet" }}
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
                                            setProfile((prev: any) => ({ ...prev, wallet_address: address }));
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

                {/* Accreditation Status */}
                <div className="border-t border-white/5 pt-8">
                    <h3 className="text-xl font-bold font-rajdhani text-white mb-6 flex items-center gap-2">
                        <Shield className="text-[#F54029]" size={24} /> Investor Accreditation
                    </h3>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                        {investorStatus ? (
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            {investorStatus.isVerified ? (
                                                <CheckCircle className="text-green-400" size={24} />
                                            ) : investorStatus.verificationPending ? (
                                                <AlertCircle className="text-yellow-400" size={24} />
                                            ) : (
                                                <AlertCircle className="text-orange-400" size={24} />
                                            )}
                                            <div>
                                                <p className="text-white font-bold">
                                                    {investorStatus.accreditationStatus === 'accredited' && 'Accredited Investor'}
                                                    {investorStatus.accreditationStatus === 'qualified_purchaser' && 'Qualified Purchaser'}
                                                    {investorStatus.accreditationStatus === 'non_accredited' && 'Non-Accredited Investor'}
                                                    {investorStatus.accreditationStatus === 'unknown' && 'Accreditation Required'}
                                                </p>
                                                <p className="text-white/60 text-sm">
                                                    {investorStatus.isVerified && 'Status verified by admin'}
                                                    {investorStatus.verificationPending && 'Pending admin review'}
                                                    {!investorStatus.isVerified && !investorStatus.verificationPending && 'Complete accreditation questionnaire'}
                                                </p>
                                            </div>
                                        </div>

                                        {investorStatus.investmentLimit && (
                                            <div className="bg-black/20 rounded-lg p-4 mt-4">
                                                <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Investment Limit</p>
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-white/60 text-xs">Maximum</p>
                                                        <p className="text-white font-bold">
                                                            {investorStatus.investmentLimit.maxInvestment >= 999999999999
                                                                ? 'Unlimited'
                                                                : `$${investorStatus.investmentLimit.maxInvestment.toLocaleString()}`}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/60 text-xs">Invested</p>
                                                        <p className="text-white font-bold">${investorStatus.investmentLimit.totalInvested.toLocaleString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/60 text-xs">Remaining</p>
                                                        <p className="text-green-400 font-bold">${investorStatus.investmentLimit.remainingCapacity.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    href="/nexus/onboarding"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                                >
                                    {investorStatus.accreditationStatus === 'unknown' ? 'Complete Accreditation' : 'Update Accreditation'}
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium mb-2">Complete Investor Accreditation</p>
                                    <p className="text-white/60 text-sm max-w-md">
                                        Complete the accreditation questionnaire to determine your investor status and investment limits.
                                    </p>
                                </div>
                                <Link
                                    href="/nexus/onboarding"
                                    className="px-6 py-3 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    Get Started
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        )}
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
