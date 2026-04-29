'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Plus, X, Shield, Lock, History, FileText, ChevronDown, ChevronRight } from 'lucide-react'

interface BylawRecord {
    id: string
    document_type: string
    article_number: string
    section_number: string
    title: string
    content: string
    is_protected: boolean
    protection_type: string
    effective_date: string
    last_amended: string
    amendment_history: { amended_at: string; description: string; resolution_id: string }[]
    filed_with_delaware: boolean
    delaware_filing_date: string
    delaware_filing_number: string
    version: number
    tags: string[]
}

const DOC_TYPES = [
    { value: 'certificate_of_incorporation', label: 'Certificate of Incorporation', icon: '📜' },
    { value: 'bylaws', label: 'Bylaws', icon: '📋' },
    { value: 'stockholder_agreement', label: 'Stockholder Agreement', icon: '🤝' },
    { value: 'voting_agreement', label: 'Voting Agreement', icon: '🗳️' },
    { value: 'rofr_agreement', label: 'ROFR / Co-Sale Agreement', icon: '⚖️' },
    { value: 'board_policy', label: 'Board Policy', icon: '📌' },
]

export default function BylawsViewer({ isAdmin = false }: { isAdmin?: boolean }) {
    const [bylaws, setBylaws] = useState<BylawRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [showHistory, setShowHistory] = useState<string | null>(null)
    const [activeDocType, setActiveDocType] = useState<string>('all')
    const [form, setForm] = useState({
        document_type: 'bylaws', article_number: '', section_number: '',
        title: '', content: '', is_protected: false, protection_type: '',
        tags: [] as string[], filed_with_delaware: false,
        delaware_filing_date: '', delaware_filing_number: ''
    })

    useEffect(() => { fetchBylaws() }, [])

    async function fetchBylaws() {
        try {
            const res = await fetch('/api/nexus/bylaws')
            const data = await res.json()
            setBylaws(data.bylaws || [])
        } catch (e) { console.error(e) }
        setLoading(false)
    }

    async function handleSave() {
        try {
            await fetch('/api/nexus/bylaws', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            setShowForm(false)
            fetchBylaws()
        } catch (e) { console.error(e) }
    }

    const grouped = bylaws.reduce((acc: Record<string, BylawRecord[]>, b) => {
        const key = b.document_type || 'bylaws'
        if (!acc[key]) acc[key] = []
        acc[key].push(b)
        return acc
    }, {})

    const filteredGroups = activeDocType === 'all' ? grouped : { [activeDocType]: grouped[activeDocType] || [] }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-rajdhani text-white tracking-wide">Corporate Documents</h2>
                    <p className="text-sm text-white/40 mt-1">Charter, bylaws, and governing documents with amendment tracking</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#F54029]/20 transition-all">
                        <Plus size={14} /> Add Provision
                    </button>
                )}
            </div>

            {/* Doc Type Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button onClick={() => setActiveDocType('all')}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${activeDocType === 'all' ? 'bg-white/10 text-white border-white/20' : 'bg-white/5 text-white/40 border-white/5 hover:text-white'}`}>
                    All Documents
                </button>
                {DOC_TYPES.map(dt => (
                    <button key={dt.value} onClick={() => setActiveDocType(dt.value)}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${activeDocType === dt.value ? 'bg-white/10 text-white border-white/20' : 'bg-white/5 text-white/40 border-white/5 hover:text-white'}`}>
                        {dt.icon} {dt.label}
                    </button>
                ))}
            </div>

            {/* Document Sections */}
            {Object.entries(filteredGroups).map(([docType, provisions]) => {
                const docInfo = DOC_TYPES.find(d => d.value === docType)
                return (
                    <div key={docType} className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 mb-4">
                            <span>{docInfo?.icon || '📄'}</span> {docInfo?.label || docType}
                            <span className="text-white/20 font-mono ml-auto">{provisions.length} provisions</span>
                        </h3>
                        {provisions.map(b => (
                            <div key={b.id} className={`border rounded-xl transition-all ${b.is_protected ? 'bg-amber-500/[0.02] border-amber-500/10 hover:border-amber-500/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                                <div className="p-5 cursor-pointer" onClick={() => setExpanded(expanded === b.id ? null : b.id)}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {expanded === b.id ? <ChevronDown size={14} className="text-white/30 shrink-0" /> : <ChevronRight size={14} className="text-white/30 shrink-0" />}
                                            {b.section_number && <span className="text-xs text-white/20 font-mono shrink-0">§{b.section_number}</span>}
                                            <h4 className="font-bold text-white truncate">{b.title}</h4>
                                            {b.is_protected && (
                                                <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] text-amber-400 font-bold uppercase flex items-center gap-1 shrink-0">
                                                    <Lock size={8} /> Protected
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0 ml-4">
                                            {b.filed_with_delaware && (
                                                <span className="text-[10px] text-emerald-400/60 flex items-center gap-1"><Shield size={10} /> Filed</span>
                                            )}
                                            {b.amendment_history?.length > 0 && (
                                                <button onClick={(e) => { e.stopPropagation(); setShowHistory(showHistory === b.id ? null : b.id) }}
                                                    className="text-[10px] text-white/20 hover:text-white/40 flex items-center gap-1">
                                                    <History size={10} /> v{b.version}
                                                </button>
                                            )}
                                            <span className="text-[10px] text-white/15 font-mono">v{b.version}</span>
                                        </div>
                                    </div>
                                </div>

                                {expanded === b.id && (
                                    <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-fadeIn">
                                        <div className="prose prose-invert prose-sm max-w-none text-white/70 leading-relaxed whitespace-pre-wrap">
                                            {b.content}
                                        </div>
                                        {b.filed_with_delaware && (
                                            <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center gap-2 text-xs text-emerald-400/60">
                                                <Shield size={12} />
                                                Filed with Delaware Division of Corporations
                                                {b.delaware_filing_number && <span className="font-mono">#{b.delaware_filing_number}</span>}
                                                {b.delaware_filing_date && <span>on {new Date(b.delaware_filing_date).toLocaleDateString()}</span>}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {showHistory === b.id && b.amendment_history?.length > 0 && (
                                    <div className="px-5 pb-5 border-t border-white/5 pt-4 animate-fadeIn">
                                        <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Amendment History</p>
                                        <div className="space-y-2">
                                            {b.amendment_history.map((h, i) => (
                                                <div key={i} className="p-3 bg-black/20 rounded-lg text-xs">
                                                    <div className="flex justify-between text-white/40">
                                                        <span>{h.description}</span>
                                                        <span className="font-mono">{new Date(h.amended_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )
            })}

            {!loading && bylaws.length === 0 && (
                <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl">
                    <BookOpen className="mx-auto text-white/10 mb-4" size={48} />
                    <p className="text-white/40">No corporate documents configured.</p>
                    <p className="text-xs text-white/20 mt-2">Add your Certificate of Incorporation and Bylaws to start.</p>
                </div>
            )}

            {/* Add Provision Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setShowForm(false)}>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-rajdhani text-white">Add Corporate Provision</h3>
                            <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Document Type</label>
                                <select value={form.document_type} onChange={e => setForm(f => ({ ...f, document_type: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]">
                                    {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Article</label>
                                    <input value={form.article_number} onChange={e => setForm(f => ({ ...f, article_number: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="e.g. IV" />
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Section</label>
                                    <input value={form.section_number} onChange={e => setForm(f => ({ ...f, section_number: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="e.g. 4.4" />
                                </div>
                                <div className="flex items-end">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.is_protected} onChange={e => setForm(f => ({ ...f, is_protected: e.target.checked }))}
                                            className="w-4 h-4 accent-amber-500" />
                                        <span className="text-xs text-amber-400/60 flex items-center gap-1"><Lock size={10} /> Protected</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Title</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="Provision title" />
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Content</label>
                                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029] h-40 resize-none font-mono text-xs leading-relaxed" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={form.filed_with_delaware} onChange={e => setForm(f => ({ ...f, filed_with_delaware: e.target.checked }))}
                                            className="w-4 h-4 accent-emerald-500" />
                                        <span className="text-xs text-white/40">Filed with Delaware</span>
                                    </label>
                                </div>
                                {form.filed_with_delaware && (
                                    <div>
                                        <input value={form.delaware_filing_number} onChange={e => setForm(f => ({ ...f, delaware_filing_number: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="Filing number" />
                                    </div>
                                )}
                            </div>
                            <button onClick={handleSave}
                                className="w-full py-3 bg-[#F54029] text-white font-bold rounded-xl uppercase tracking-wider text-xs hover:bg-[#C53020] transition-all">
                                Save Provision
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
