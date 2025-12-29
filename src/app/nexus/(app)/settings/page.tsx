'use client'

import { createClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { Settings, Wallet, Server, Save, Check, RefreshCw, AlertCircle, Landmark } from 'lucide-react'

export default function SettingsPage() {
    const supabase = createClient()
    const [integrations, setIntegrations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [statusMessage, setStatusMessage] = useState<string | null>(null)

    const fetchSettings = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('integrations')
            .select('*')
            .order('category')

        if (!error && data) {
            setIntegrations(data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleUpdate = async (id: string, value: string) => {
        // Update local state immediately for UI
        setIntegrations(prev => prev.map(i => i.id === id ? { ...i, value } : i))
    }

    const saveChanges = async () => {
        setSaving(true)
        setStatusMessage(null)

        // Upsert all current configs
        for (const integ of integrations) {
            await supabase
                .from('integrations')
                .update({ value: integ.value, updated_at: new Date().toISOString() })
                .eq('id', integ.id)
        }

        setSaving(false)
        setStatusMessage('System configuration updated successfully.')
        setTimeout(() => setStatusMessage(null), 3000)
    }

    return (
        <div className="space-y-8 animate-fadeIn max-w-5xl">
            <header className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-4xl font-rajdhani font-bold text-white uppercase tracking-wider flex items-center gap-4">
                        <Settings className="text-white/20" size={40} />
                        System Configuration
                    </h1>
                    <p className="text-white/40 text-sm mt-2">
                        Manage financial rails, API keys, and blockchain wallet endpoints.
                    </p>
                </div>
                <button
                    onClick={saveChanges}
                    disabled={saving}
                    className="px-6 py-3 bg-[#F54029] hover:bg-[#C53020] disabled:bg-white/10 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-red-900/20"
                >
                    {saving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? 'Saving...' : 'Save Configuration'}
                </button>
            </header>

            {statusMessage && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3 text-green-400 text-sm font-bold animate-fadeIn">
                    <Check size={18} />
                    {statusMessage}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Financial Access */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-xl font-rajdhani font-bold text-white mb-6 flex items-center gap-3">
                            <Wallet className="text-[#F54029]" />
                            Treasury Wallets
                        </h2>

                        <div className="space-y-6">
                            {integrations.filter(i => i.category === 'wallet').map(wallet => (
                                <div key={wallet.id} className="bg-white/5 rounded-xl p-4 border border-white/5 focus-within:border-[#F54029]/50 transition-colors">
                                    <label className="text-xs uppercase tracking-widest text-white/40 block mb-2">{wallet.display_name}</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            value={wallet.value}
                                            onChange={(e) => handleUpdate(wallet.id, e.target.value)}
                                            className="bg-transparent text-white font-mono text-sm w-full outline-none"
                                            placeholder="0x..."
                                        />
                                    </div>
                                </div>
                            ))}
                            {integrations.filter(i => i.category === 'wallet').length === 0 && !loading && (
                                <p className="text-white/20 text-sm italic">No wallet integrations found. Run migration_v3.sql.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-xl font-rajdhani font-bold text-white mb-6 flex items-center gap-3">
                            <Server className="text-amber-400" />
                            API Connections
                        </h2>

                        <div className="space-y-6">
                            {integrations.filter(i => i.category === 'api').map(api => (
                                <div key={api.id} className="bg-white/5 rounded-xl p-4 border border-white/5 focus-within:border-[#F54029]/50 transition-colors">
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs uppercase tracking-widest text-white/40">{api.display_name}</label>
                                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 rounded font-bold uppercase">Active</span>
                                    </div>
                                    <input
                                        type="password"
                                        value={api.value}
                                        onChange={(e) => handleUpdate(api.id, e.target.value)}
                                        className="bg-transparent text-white font-mono text-sm w-full outline-none"
                                        placeholder="sk_..."
                                    />
                                </div>
                            ))}
                            {integrations.filter(i => i.category === 'api').length === 0 && !loading && (
                                <p className="text-white/20 text-sm italic">No API integrations found.</p>
                            )}
                        </div>
                    </div>

                    {/* Banking / Mercury Section */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-rajdhani font-bold text-white flex items-center gap-3">
                                <Landmark className="text-blue-400" />
                                Banking & Wire Instructions
                            </h2>
                            <div className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                Mercury Compatible
                            </div>
                        </div>

                        <p className="text-white/40 text-sm mb-6">
                            These details will be displayed to investors for Fiat/Wire transfers.
                        </p>

                        {/* Placeholder for Banking Form - In real app, map from bank_accounts table */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-xl border border-white/5">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">Bank Name</label>
                                <input type="text" defaultValue="Mercury / Evolve Bank & Trust" className="w-full bg-transparent border-b border-white/10 focus:border-blue-400 text-white outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">Beneficiary Name</label>
                                <input type="text" defaultValue="The Utility Company LLC" className="w-full bg-transparent border-b border-white/10 focus:border-blue-400 text-white outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">Routing Number</label>
                                <input type="text" placeholder="021..." className="w-full bg-transparent border-b border-white/10 focus:border-blue-400 text-white outline-none transition-colors font-mono" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">Account Number</label>
                                <input type="text" placeholder="**********" className="w-full bg-transparent border-b border-white/10 focus:border-blue-400 text-white outline-none transition-colors font-mono" />
                            </div>
                            <div className="col-span-2 space-y-2">
                                <label className="text-xs uppercase tracking-widest text-white/40">Swift Code</label>
                                <input type="text" placeholder="EVOLUS33" className="w-full bg-transparent border-b border-white/10 focus:border-blue-400 text-white outline-none transition-colors font-mono" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Security & Logs */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-red-900/10 to-transparent border border-[#F54029]/20 rounded-2xl p-6">
                        <h3 className="text-lg font-rajdhani font-bold text-white mb-4 flex items-center gap-2">
                            <AlertCircle size={18} className="text-[#F54029]" />
                            Security Audit
                        </h3>
                        <div className="space-y-4 text-sm text-white/60">
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <span>Config Permission</span>
                                <span className="text-green-400">Admin Only</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <span>2FA Enforcement</span>
                                <span className="text-yellow-400">Optional</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <span>Last Migration</span>
                                <span className="text-white">V3 (Current)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
