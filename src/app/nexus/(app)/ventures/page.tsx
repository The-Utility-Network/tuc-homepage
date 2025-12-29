'use client'

import { createClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { PieChart, TrendingUp, Users, DollarSign, Plus, ChevronRight, Layers, ArrowUpRight, FileSignature, Landmark, Wallet, Check, Download, Lock, Trash2, X, AlertOctagon, LayoutGrid, Briefcase, Menu } from 'lucide-react'
import { format } from 'date-fns'
import LegalDocument from '@/components/nexus/LegalDocument'
import CapTableManager from '@/components/nexus/ventures/CapTableManager'
import RoundWizard from '@/components/nexus/ventures/RoundWizard'

export default function VenturesPage() {
    const supabase = createClient()
    const [role, setRole] = useState<string>('investor')
    const [fullName, setFullName] = useState('')

    // Data State
    const [subsidiaries, setSubsidiaries] = useState<any[]>([])
    const [campaigns, setCampaigns] = useState<any[]>([])
    const [bankAccounts, setBankAccounts] = useState<any[]>([])
    const [integrations, setIntegrations] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    // UI State
    const [activeTab, setActiveTab] = useState<string>('network')
    const [viewMode, setViewMode] = useState<'overview' | 'rounds' | 'captable'>('overview')
    const [createWizardOpen, setCreateWizardOpen] = useState(false)

    // Mobile Sidebar Toggle
    const [mobileSubsidiaryOpen, setMobileSubsidiaryOpen] = useState(false)

    // Investment Flow State
    const [investModalOpen, setInvestModalOpen] = useState(false)
    const [investStep, setInvestStep] = useState<'safe' | 'wire' | 'funding' | 'confirm'>('safe')
    const [selectedRound, setSelectedRound] = useState<any>(null)
    const [investmentAmount, setInvestmentAmount] = useState('')
    const [safeSigned, setSafeSigned] = useState(false)

    // Initial Load
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
                if (data) {
                    setRole(data.role)
                    setFullName(data.full_name)
                    // if (data.role === 'admin') setViewMode('overview') // Defaulting everyone to overview
                }
            }

            // Integrations
            const { data: config } = await supabase.from('integrations').select('*')
            if (config) setIntegrations(config)

            // Bank Accounts (Mercury)
            try {
                const res = await fetch('/api/mercury/accounts')
                const data = await res.json()
                if (data.accounts) {
                    const mapped = data.accounts.map((acc: any) => ({
                        subsidiary: 'network',
                        bank_name: 'Mercury',
                        routing_number: acc.routingNumber,
                        account_number: acc.accountNumber,
                        account_holder_name: 'The Utility Company LLC'
                    }))
                    setBankAccounts(mapped)
                }
            } catch (e) {
                console.error('Mercury API Error', e)
            }
        }

        const fetchSubs = async () => {
            const { data } = await supabase.from('subsidiaries').select('*').order('name')
            if (data) {
                const sorted = data.sort((a, b) => {
                    if (a.id === 'network') return -1
                    if (b.id === 'network') return 1
                    return a.name.localeCompare(b.name)
                })
                setSubsidiaries(sorted)
                if (sorted.length > 0) setActiveTab(sorted[0].id)
            }
        }

        fetchUser()
        fetchSubs()
    }, [])

    // Fetch Entity Data
    useEffect(() => {
        if (!activeTab) return
        const fetchData = async () => {
            setLoading(true)
            const { data: camps } = await supabase
                .from('campaigns')
                .select('*')
                .eq('subsidiary', activeTab)
                .order('created_at', { ascending: false })
            setCampaigns(camps || [])
            setLoading(false)
        }
        fetchData()
    }, [activeTab, refreshTrigger])

    // --- Helpers ---
    const currentEntity = subsidiaries.find(e => e.id === activeTab)
    const formatUSD = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)

    // Actions
    const handleInvestClick = (round: any) => {
        setSelectedRound(round)
        setInvestStep('safe')
        setSafeSigned(false)
        setInvestModalOpen(true)
    }

    const handleDeleteRound = async (id: string, e: any) => {
        e.stopPropagation()
        if (!confirm('Are you sure you want to delete this round? This cannot be undone.')) return
        await supabase.from('campaigns').delete().eq('id', id)
        setRefreshTrigger(p => p + 1)
    }

    return (
        <div className="flex h-[calc(100vh-100px)] animate-fadeIn overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] relative">

            {/* 1. LEFT SIDEBAR (Subsidiary List) - Desktop: Visible, Mobile: Hidden (Drawer) */}
            <div className={`
                absolute inset-y-0 left-0 z-20 w-72 bg-black/90 backdrop-blur-xl border-r border-white/10 transform transition-transform duration-300 md:relative md:translate-x-0 md:bg-black/40 md:backdrop-blur-sm
                ${mobileSubsidiaryOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xs font-bold font-rajdhani text-white/50 uppercase tracking-widest flex items-center gap-2">
                        <Layers size={14} /> Ecosystem Entities
                    </h3>
                    <button onClick={() => setMobileSubsidiaryOpen(false)} className="md:hidden text-white/40">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide h-[calc(100%-65px)]">
                    {subsidiaries.map(sub => (
                        <button
                            key={sub.id}
                            onClick={() => {
                                setActiveTab(sub.id);
                                setViewMode('overview');
                                setMobileSubsidiaryOpen(false);
                            }}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 group relative overflow-hidden ${activeTab === sub.id
                                    ? 'bg-white/5 border-white/10 shadow-lg'
                                    : 'bg-transparent border-transparent text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center p-2 transition-all ${activeTab === sub.id ? 'bg-black/40 opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                                <img src={sub.logo_url} className="w-full h-full object-contain" />
                            </div>
                            <span className={`text-sm font-bold uppercase tracking-wide transition-colors ${activeTab === sub.id ? 'text-white' : ''}`}>
                                {sub.name}
                            </span>
                            {activeTab === sub.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F54029]" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Mobile Overlay for Sidebar */}
            {mobileSubsidiaryOpen && (
                <div className="absolute inset-0 bg-black/50 z-10 md:hidden backdrop-blur-sm" onClick={() => setMobileSubsidiaryOpen(false)} />
            )}

            {/* 2. MAIN CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 relative scrollbar-thin scrollbar-thumb-white/10 w-full">
                {/* Mobile Trigger for Sidebar */}
                <button
                    onClick={() => setMobileSubsidiaryOpen(true)}
                    className="md:hidden mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F54029] border border-[#F54029]/20 px-4 py-2 rounded-lg bg-[#F54029]/5"
                >
                    <Menu size={14} /> Select Entity
                </button>

                {currentEntity && (
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Header Banner */}
                        <div className="flex flex-col md:flex-row items-start justify-between gap-6 pb-8 border-b border-white/5">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3 md:p-5 shadow-2xl shrink-0">
                                    <img src={currentEntity.logo_url} className="w-full h-full object-contain" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl md:text-4xl font-bold text-white font-rajdhani">{currentEntity.name}</h2>
                                    <p className="text-white/60 text-sm md:text-lg leading-tight max-w-2xl">{currentEntity.description}</p>
                                </div>
                            </div>

                            {/* View Switcher - Scrollable on mobile */}
                            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10 self-start shrink-0 overflow-x-auto max-w-full">
                                {[
                                    { id: 'overview', icon: LayoutGrid, label: 'Overview' },
                                    { id: 'captable', icon: PieChart, label: 'Cap Table' },
                                    { id: 'rounds', icon: Briefcase, label: 'Rounds' }
                                ].map(mode => (
                                    <button
                                        key={mode.id}
                                        onClick={() => setViewMode(mode.id as any)}
                                        className={`px-3 md:px-4 py-2 rounded-md flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${viewMode === mode.id
                                                ? 'bg-white/10 text-white shadow-sm'
                                                : 'text-white/40 hover:text-white'
                                            }`}
                                    >
                                        <mode.icon size={14} /> {mode.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* VIEW: OVERVIEW */}
                        {viewMode === 'overview' && (
                            <div className="space-y-8 animate-fadeIn">
                                {/* Row 1: Financial Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-8 bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5">
                                            <TrendingUp size={100} />
                                        </div>
                                        <div className="flex justify-between items-start mb-6 relative z-10">
                                            <h3 className="text-sm font-bold text-white/60 font-rajdhani uppercase tracking-widest">Financial Status</h3>
                                            <TrendingUp className="text-[#F54029]" size={20} />
                                        </div>
                                        <div className="space-y-6 relative z-10">
                                            <div>
                                                <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Total Raised</p>
                                                <p className="text-4xl font-mono text-white tracking-tight">$0</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                                <div>
                                                    <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Active Rounds</p>
                                                    <p className="text-2xl font-mono text-[#F54029]">{campaigns.filter(c => c.status === 'active').length}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Latest Val</p>
                                                    <p className="text-2xl font-mono text-white">{formatUSD(campaigns[0]?.valuation || 0)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 p-8 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
                                        <h3 className="text-sm font-bold text-white/60 font-rajdhani uppercase tracking-widest mb-6">Recent Activity</h3>
                                        <div className="flex-1 flex items-center justify-center text-white/20 border border-dashed border-white/5 rounded-xl bg-black/20">
                                            No recent transactions found on chain.
                                        </div>
                                    </div>
                                </div>

                                {/* Row 2: Cap Table (Full Width) */}
                                <div>
                                    <CapTableManager subsidiaryId={currentEntity.id} authorizedShares={currentEntity.total_authorized_shares || 10000000} />
                                </div>
                            </div>
                        )}

                        {/* VIEW: CAP TABLE */}
                        {viewMode === 'captable' && (
                            <div className="animate-fadeIn">
                                <CapTableManager subsidiaryId={currentEntity.id} authorizedShares={currentEntity.total_authorized_shares || 10000000} />
                            </div>
                        )}

                        {/* VIEW: ROUNDS */}
                        {viewMode === 'rounds' && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold font-rajdhani text-white uppercase tracking-wider">Investment Vehicles</h3>
                                    {role === 'admin' && (
                                        <button
                                            onClick={() => setCreateWizardOpen(true)}
                                            className="px-6 py-3 bg-[#F54029] hover:bg-[#C53020] text-white font-bold rounded-xl flex items-center gap-2 uppercase tracking-wide text-xs shadow-lg"
                                        >
                                            <Plus size={16} /> Launch Pro Round
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {campaigns.map(round => (
                                        <div key={round.id} className="bg-white/[0.02] border border-white/10 rounded-xl p-6 hover:border-[#F54029]/30 transition-all group relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${round.status === 'active' ? 'bg-[#F54029] text-white' : 'bg-white/10 text-white/40'}`}>
                                                    {round.status}
                                                </span>
                                                {role === 'admin' && (
                                                    <button onClick={(e) => handleDeleteRound(round.id, e)} className="text-white/20 hover:text-red-500 z-10 relative">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                            <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[#F54029] transition-colors truncate">{round.name}</h4>
                                            <p className="text-xs text-white/40 uppercase tracking-widest mb-6">{round.round_type}</p>

                                            <div className="space-y-2 mb-6">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-white/40">Target</span>
                                                    <span className="text-white font-mono">{formatUSD(round.target_amount)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-white/40">Valuation</span>
                                                    <span className="text-white font-mono">{formatUSD(round.valuation || 0)}</span>
                                                </div>
                                            </div>

                                            {(role === 'investor' && round.status === 'active') && (
                                                <button
                                                    onClick={() => handleInvestClick(round)}
                                                    className="w-full py-3 border border-white/20 hover:bg-white hover:text-black text-white rounded-lg font-bold uppercase tracking-wider text-xs transition-all"
                                                >
                                                    Invest Now
                                                </button>
                                            )}
                                            {role === 'admin' && (
                                                <div className="w-full py-2 bg-white/5 rounded-lg text-center text-xs text-white/40 uppercase tracking-wider border border-white/5">
                                                    Manage via Admin Ops
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {campaigns.length === 0 && (
                                        <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl">
                                            <p className="text-white/40">No rounds found for {currentEntity.name}.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* MODALS */}
            {createWizardOpen && activeTab && (
                <RoundWizard
                    subsidiaryId={activeTab}
                    subsidiaryName={currentEntity?.name}
                    onClose={() => setCreateWizardOpen(false)}
                    onComplete={() => {
                        setCreateWizardOpen(false)
                        setRefreshTrigger(p => p + 1)
                    }}
                />
            )}

            {investModalOpen && selectedRound && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fadeIn p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-6xl h-[90vh] flex shadow-2xl relative overflow-hidden flex-col md:flex-row">
                        <button
                            onClick={() => setInvestModalOpen(false)}
                            className="absolute top-4 right-4 z-50 text-white/40 hover:text-white bg-black/50 rounded-full p-2"
                        >
                            <X size={24} />
                        </button>

                        {/* Left: Inputs */}
                        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-white/[0.02] p-8 overflow-y-auto">
                            <h3 className="text-2xl font-bold font-rajdhani text-white mb-2">Investment</h3>
                            <p className="text-white/40 text-xs uppercase tracking-widest mb-8">
                                {currentEntity?.name} / {selectedRound.name}
                            </p>

                            {investStep === 'safe' && (
                                <div className="space-y-6 flex-1">
                                    <div className="space-y-2">
                                        <label className="text-xs text-white/40 uppercase tracking-widest">Investment Amount ($)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                                            <input
                                                type="number"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-4 text-white text-lg font-mono outline-none focus:border-[#F54029]"
                                                value={investmentAmount}
                                                onChange={e => setInvestmentAmount(e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    {/* ... rest of inputs ... */}
                                    {/* Simplified for brevity - reuse logic */}
                                    <div className="p-4 bg-white/5 rounded-xl space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Round Type</span>
                                            <span className="text-white font-bold">{selectedRound.round_type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/40">Valuation</span>
                                            <span className="text-white font-mono">{formatUSD(selectedRound.valuation)}</span>
                                        </div>
                                    </div>

                                    <div className="flex-1" />

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3 p-4 bg-[#F54029]/10 rounded-xl border border-[#F54029]/20">
                                            <Check className="text-[#F54029] mt-0.5" size={16} />
                                            <p className="text-xs text-white/80 leading-relaxed">
                                                By proceeding, I certify that I have reviewed the risks and am an accredited investor.
                                            </p>
                                        </div>
                                        <button
                                            disabled={!investmentAmount}
                                            onClick={() => {
                                                if (!investmentAmount) return;
                                                // Normally proceed to 'doc view' or confirm
                                            }}
                                            className="w-full py-4 bg-[#F54029] disabled:opacity-50 hover:bg-[#C53020] text-white font-bold rounded-xl uppercase tracking-widest shadow-lg transition-all"
                                        >
                                            Generate Agreement
                                        </button>
                                    </div>
                                </div>
                            )}

                            {investStep === 'funding' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                                        <Check className="mx-auto text-green-400 mb-2" size={32} />
                                        <h4 className="text-green-400 font-bold uppercase tracking-widest">Agreement Signed</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-sm text-white/60 text-center">
                                            Please wire <strong>{formatUSD(parseFloat(investmentAmount))}</strong> to the account displayed on screen.
                                        </p>
                                        <button
                                            onClick={() => setInvestModalOpen(false)}
                                            className="w-full py-4 bg-white text-black hover:bg-white/90 font-bold rounded-xl uppercase tracking-widest transition-all"
                                        >
                                            I have sent funds
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Document Preview */}
                        <div className="flex-1 bg-gray-900 md:border-l border-white/10 relative overflow-hidden hidden md:block">
                            <div className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar bg-gray-100">
                                <LegalDocument
                                    type={selectedRound.round_type === 'Equity' ? 'EQUITY' : 'SAFE'}
                                    investorName={fullName || 'Valued Investor'}
                                    entityName={currentEntity?.name || 'Network Entity'}
                                    roundName={selectedRound.name}
                                    amount={parseFloat(investmentAmount) || 0}
                                    valuation={selectedRound.valuation || 0}
                                    sharePrice={selectedRound.share_price}
                                    date={new Date().toLocaleDateString()}
                                    themeColor={currentEntity?.hex_color || '#000000'}
                                />
                            </div>

                            {investStep === 'safe' && investmentAmount && (
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
                                    <div className="flex items-center gap-3">
                                        <div
                                            onClick={() => setSafeSigned(!safeSigned)}
                                            className={`w-6 h-6 border-2 rounded cursor-pointer transition-colors flex items-center justify-center ${safeSigned ? 'bg-black border-black text-white' : 'border-gray-400'}`}
                                        >
                                            {safeSigned && <Check size={14} />}
                                        </div>
                                        <span className="text-sm font-bold text-gray-900 text-xs uppercase tracking-wider">I agree to terms</span>
                                    </div>
                                    <button
                                        onClick={() => setInvestStep('funding')}
                                        disabled={!safeSigned}
                                        className="px-8 py-3 bg-[#F54029] disabled:bg-gray-300 text-white font-bold rounded-lg uppercase tracking-wider text-xs transition-all"
                                    >
                                        Counter-Sign & Fund
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
