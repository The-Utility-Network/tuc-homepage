'use client'

import { createClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { PieChart, TrendingUp, Users, DollarSign, Plus, ChevronRight, Layers, ArrowUpRight, FileSignature, Landmark, Wallet, Check, Download, Lock, Trash2, X, AlertOctagon, LayoutGrid, Briefcase, Menu, FileText, Shield, Settings } from 'lucide-react'
import { format } from 'date-fns'
import LegalDocument from '@/components/nexus/LegalDocument'
import CapTableManager from '@/components/nexus/ventures/CapTableManager'
import RoundWizard from '@/components/nexus/ventures/RoundWizard'
import CampaignDashboard from '@/components/nexus/fundraising/CampaignDashboard'
import FinancialDashboard from '@/components/nexus/fundraising/FinancialDashboard'
import DataRoomManager from '@/components/nexus/fundraising/DataRoomManager'
import ComplianceCalendar from '@/components/nexus/fundraising/ComplianceCalendar'
import ActivityDashboard from '@/components/nexus/admin/ActivityDashboard'
import CompanySettings from '@/components/nexus/ventures/CompanySettings'
import PersonnelManager from '@/components/nexus/ventures/PersonnelManager'
import SignaturePad from '@/components/nexus/ventures/SignaturePad'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useRef } from 'react'

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
    const [viewMode, setViewMode] = useState<'overview' | 'invest' | 'captable' | 'fundraising' | 'metrics' | 'dataroom' | 'compliance' | 'settings' | 'governance'>('overview')
    const [createWizardOpen, setCreateWizardOpen] = useState(false)

    // Mobile Sidebar Toggle
    const [mobileSubsidiaryOpen, setMobileSubsidiaryOpen] = useState(false)

    // Investment Flow State
    const [investModalOpen, setInvestModalOpen] = useState(false)
    const [investStep, setInvestStep] = useState<'details' | 'safe' | 'funding' | 'confirm'>('details')
    const [selectedRound, setSelectedRound] = useState<any>(null)
    const [investmentAmount, setInvestmentAmount] = useState('')
    
    // E-Signature State
    const [signatureData, setSignatureData] = useState<string | undefined>()
    const [signatureType, setSignatureType] = useState<'drawn' | 'typed' | undefined>()
    const [auditId, setAuditId] = useState<string | undefined>()
    const [isSigning, setIsSigning] = useState(false)

    // DOM Ref for PDF Download
    const documentRef = useRef<HTMLDivElement>(null)

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
        setInvestStep('details')
        setSignatureData(undefined)
        setSignatureType(undefined)
        setAuditId(undefined)
        setInvestModalOpen(true)
    }

    const handleDeleteRound = async (id: string, e: any) => {
        e.stopPropagation()
        if (!confirm('Are you sure you want to delete this round? This cannot be undone.')) return
        await supabase.from('campaigns').delete().eq('id', id)
        setRefreshTrigger(p => p + 1)
    }

    const handleExecuteSignature = async (sigData: string, type: 'drawn' | 'typed') => {
        setIsSigning(true)
        try {
            const res = await fetch('/api/documents/sign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    signatureData: sigData,
                    type,
                    campaignId: selectedRound.id,
                    amount: parseFloat(investmentAmount)
                })
            })
            
            if (!res.ok) throw new Error('Signature capture failed')
            
            const { auditId } = await res.json()
            setSignatureData(sigData)
            setSignatureType(type)
            setAuditId(auditId)
            
            // Move instantly to Funding step
            setInvestStep('funding')
        } catch (error) {
            console.error(error)
            alert('Failed to execute signature layer. Check connection.')
        } finally {
            setIsSigning(false)
        }
    }

    const handleDownloadPDF = async () => {
        if (!documentRef.current) return
        
        try {
            const canvas = await html2canvas(documentRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                windowWidth: 800, // force width for consistency
            })
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0)
            
            // PDF configuration (Portrait, 8.5 x 11)
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'in',
                format: 'letter'
            })
            
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`${currentEntity?.name}_${selectedRound?.name}_Agreement.pdf`)
        } catch (error) {
            console.error('PDF Generation failed', error)
        }
    }

    return (
        <div className="flex w-full h-full animate-fadeIn overflow-hidden relative">

            {/* 1. LEFT SIDEBAR (Subsidiary List) - Desktop: Visible, Mobile: Hidden (Drawer) */}
            <div className={`
                absolute inset-y-0 left-0 z-20 w-72 bg-[#050505]/95 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 md:relative md:translate-x-0 md:bg-black/20
                ${mobileSubsidiaryOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center h-20">
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
                                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: sub.hex_color || '#F54029' }} />
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
                    className="md:hidden mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest border px-4 py-2 rounded-lg transition-colors"
                    style={{ color: currentEntity?.hex_color || '#F54029', borderColor: `${currentEntity?.hex_color || '#F54029'}33`, backgroundColor: `${currentEntity?.hex_color || '#F54029'}0D` }}
                >
                    <Menu size={14} /> Select Entity
                </button>

                {currentEntity && (
                    <div className="max-w-7xl mx-auto space-y-8">

                        {/* Conditional Rendering for BasaltHQ */}
                        {currentEntity.name === 'BasaltHQ' ? (
                            <div className="animate-fadeIn p-12 text-center border border-white/10 rounded-2xl bg-white/[0.02] flex flex-col items-center justify-center min-h-[500px]">
                                <div className="w-24 h-24 bg-black border border-white/10 rounded-2xl flex items-center justify-center p-4 mb-6 shadow-2xl">
                                    <img src={currentEntity.logo_url} className="w-full h-full object-contain" />
                                </div>
                                <h2 className="text-3xl font-rajdhani font-bold text-white mb-4 uppercase tracking-widest">Central Operations Managed Externally</h2>
                                <p className="text-white/60 max-w-lg mx-auto mb-10 text-sm leading-relaxed">
                                    BasaltHQ is managed directly through the primary Basalt Nexus portal. All investments, cap tables, and compliance requirements for this entity are handled at its native source.
                                </p>
                                <a 
                                    href="https://basalthq.com/nexus"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#F54029] hover:bg-[#C53020] text-white font-bold rounded-xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(245,64,41,0.2)] hover:shadow-[0_0_30px_rgba(245,64,41,0.4)]"
                                >
                                    Open Basalt Nexus <ArrowUpRight size={18} />
                                </a>
                            </div>
                        ) : (
                            <>
                                {/* Header Banner */}
                                <div className="flex flex-col gap-6 pb-8 border-b border-white/5">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3 md:p-5 shadow-2xl shrink-0">
                                            <img src={currentEntity.logo_url} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="space-y-2">
                                            <h2 className="text-2xl md:text-4xl font-bold text-white font-rajdhani whitespace-nowrap">{currentEntity.name}</h2>
                                            <p className="text-white/60 text-sm md:text-lg leading-tight max-w-2xl">{currentEntity.description}</p>
                                        </div>
                                    </div>

                            {/* View Switcher - Scrollable on mobile */}
                            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10 self-start shrink-0 overflow-x-auto max-w-full">
                                {[
                                    { id: 'overview', icon: LayoutGrid, label: 'Overview' },
                                    { id: 'captable', icon: PieChart, label: 'Cap Table' },
                                    ...(role === 'admin' ? [{ id: 'governance', icon: Landmark, label: 'Governance' }] : []),
                                    { id: 'invest', icon: Briefcase, label: 'Invest' }, // Renamed from Rounds
                                    // Fundraising only visible for admin? Or everyone? Let's show for all but maybe empty for investors if no permission
                                    ...(role === 'admin' ? [{ id: 'fundraising', icon: DollarSign, label: 'Fundraising' }] : []),
                                    { id: 'metrics', icon: TrendingUp, label: 'Metrics' },
                                    { id: 'dataroom', icon: FileText, label: 'Data Room' },
                                    { id: 'compliance', icon: Shield, label: 'Compliance' },
                                    ...(role === 'admin' ? [{ id: 'settings', icon: Settings, label: 'Settings' }] : [])
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
                                    <CapTableManager subsidiaryId={currentEntity.id} authorizedShares={currentEntity.total_authorized_shares || 10000000} themeColor={currentEntity.hex_color} />
                                </div>
                            </div>
                        )}

                        {/* VIEW: CAP TABLE */}
                        {viewMode === 'captable' && (
                            <div className="animate-fadeIn">
                                <CapTableManager subsidiaryId={currentEntity.id} authorizedShares={currentEntity.total_authorized_shares || 10000000} themeColor={currentEntity.hex_color} />
                            </div>
                        )}

                        {/* VIEW: INVEST (Formerly Rounds) */}
                        {viewMode === 'invest' && (
                            <div className="space-y-8 animate-fadeIn">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold font-rajdhani text-white uppercase tracking-wider">Investment Opportunities</h3>
                                    {/* Admin create button removed from here, moved to Fundraising tab */}
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
                                                    Switch to Fundraising Tab to Manage
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {campaigns.length === 0 && (
                                        <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl">
                                            <p className="text-white/40">No investment opportunities open for {currentEntity.name}.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* VIEW: FUNDRAISING (Admin Only) */}
                        {viewMode === 'fundraising' && (
                            <div className="animate-fadeIn">
                                <CampaignDashboard
                                    subsidiaryId={currentEntity.id}
                                    onOpenWizard={() => setCreateWizardOpen(true)}
                                />
                            </div>
                        )}

                        {/* VIEW: METRICS */}
                        {viewMode === 'metrics' && (
                            <div className="animate-fadeIn">
                                <FinancialDashboard subsidiaryId={currentEntity.id} />
                            </div>
                        )}

                        {/* VIEW: DATA ROOM */}
                        {viewMode === 'dataroom' && (
                            <div className="animate-fadeIn">
                                <DataRoomManager subsidiaryId={currentEntity.id} />
                            </div>
                        )}

                        {/* VIEW: COMPLIANCE */}
                        {viewMode === 'compliance' && (
                            <div className="animate-fadeIn">
                                <ComplianceCalendar subsidiaryId={currentEntity.id} />
                            </div>
                        )}

                        {/* VIEW: GOVERNANCE (Admin Only) */}
                        {viewMode === 'governance' && (
                            <div className="animate-fadeIn">
                                <PersonnelManager subsidiaryId={currentEntity.id} themeColor={currentEntity.hex_color} />
                            </div>
                        )}

                        {/* VIEW: SETTINGS (Admin Only) */}
                        {viewMode === 'settings' && (
                            <div className="animate-fadeIn">
                                <CompanySettings subsidiaryId={currentEntity.id} />
                            </div>
                        )}
                        </>
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
                                <div className="space-y-6 flex-1 animate-fadeIn flex flex-col justify-center">
                                    {isSigning ? (
                                        <div className="text-center py-12">
                                            <div className="animate-spin w-8 h-8 border-2 border-[#F54029] border-t-transparent rounded-full mx-auto mb-4" />
                                            <p className="text-white/60 text-xs uppercase tracking-widest">Generating Audit Footprint...</p>
                                        </div>
                                    ) : (
                                        <SignaturePad 
                                            investorName={fullName || 'Valued Investor'} 
                                            onSign={handleExecuteSignature} 
                                        />
                                    )}
                                </div>
                            )}

                            {investStep === 'funding' && (
                                <div className="space-y-6 animate-fadeIn">
                                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                                        <Check className="mx-auto text-green-400 mb-2" size={32} />
                                        <h4 className="text-green-400 font-bold uppercase tracking-widest">Agreement Signed</h4>
                                    </div>
                                    <div className="space-y-4 text-sm text-white/80">
                                        <p className="text-center">
                                            Please wire <strong>{formatUSD(parseFloat(investmentAmount))}</strong> to the account below. Your finalized legal agreement has been added to your Portfolio.
                                        </p>
                                        <div className="p-4 bg-black/40 border border-white/10 rounded-xl font-mono text-center space-y-1">
                                            <p>The Utility Company LLC</p>
                                            <p>Routing: XXXXXXXXX</p>
                                            <p>Account: 123456789</p>
                                        </div>
                                        
                                        <button
                                            onClick={handleDownloadPDF}
                                            className="w-full py-3 bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2 mt-4 transition-all uppercase tracking-widest text-xs"
                                        >
                                            <Download size={16} /> Download Signed PDF
                                        </button>
                                        
                                        <button
                                            onClick={() => setInvestModalOpen(false)}
                                            className="w-full py-4 bg-white text-black hover:bg-white/90 font-bold rounded-xl uppercase tracking-widest transition-all mt-4"
                                        >
                                            I have sent funds
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Document Preview */}
                        <div className="flex-1 bg-gray-900 md:border-l border-white/10 relative overflow-hidden hidden md:block">
                            <div className="absolute inset-0 overflow-y-auto p-4 md:p-12 custom-scrollbar bg-gray-100 flex items-start justify-center">
                                {/* The PDF capture bounds */}
                                <div ref={documentRef} className="w-[800px] min-h-[1056px] shadow-2xl bg-white origin-top" style={{ transform: 'scale(0.85)', transformOrigin: 'top center', paddingBottom: '40px' }}>
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
                                        entityConfig={{
                                            type: currentEntity?.entity_type || 'C-Corp',
                                            state: currentEntity?.incorporation_state || 'Delaware',
                                            ein: currentEntity?.ein || 'PENDING'
                                        }}
                                        signatureData={signatureData}
                                        signatureType={signatureType}
                                        auditId={auditId}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
