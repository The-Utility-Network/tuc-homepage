'use client'

import { useState, useEffect, useRef } from 'react'
import { Gavel, Plus, X, AlertTriangle, CheckCircle, XCircle, Clock, Shield, FileText, Lock, Vote, Eye, Paperclip, Upload, Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Highlighter, MessageCircle, ThumbsUp, ThumbsDown, MinusCircle } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import PdfAnnotationOverlay, { userColor } from './PdfAnnotationOverlay'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Attachment {
    file_name: string
    file_url: string // S3 key
}

interface VoteRecord {
    member_id: string
    member_name: string
    vote: 'for' | 'against' | 'abstain'
    voted_at: string
    notes: string
}

interface ResolutionRecord {
    id: string
    title: string
    resolution_number: string
    resolution_type: string
    category: string
    status: string
    description: string
    resolved_text: string
    requires_unanimous_consent: boolean
    requires_shareholder_approval: boolean
    debt_amount: number
    protected_action_type: string
    votes: VoteRecord[]
    approval_threshold: number
    votes_for: number
    votes_against: number
    votes_abstain: number
    proposed_by: string
    proposed_at: string
    approved_at: string
    effective_date: string
    filed_with_state: boolean
    filing_reference: string
    attachments: Attachment[]
    created_at: string
}

const CATEGORIES = [
    { value: 'general', label: 'General' },
    { value: 'officer_appointment', label: 'Officer Appointment' },
    { value: 'officer_removal', label: 'Officer Removal' },
    { value: 'compensation', label: 'Compensation' },
    { value: 'stock_issuance', label: 'Stock Issuance' },
    { value: 'stock_option_grant', label: 'Stock Option Grant' },
    { value: 'dividend_declaration', label: 'Dividend Declaration' },
    { value: 'bylaw_amendment', label: 'Bylaw Amendment' },
    { value: 'certificate_amendment', label: 'Certificate Amendment' },
    { value: 'merger_acquisition', label: 'Merger / Acquisition' },
    { value: 'debt_authorization', label: 'Debt Authorization' },
    { value: 'bank_account', label: 'Bank Account' },
    { value: 'contract_approval', label: 'Contract Approval' },
    { value: 'budget_approval', label: 'Budget Approval' },
    { value: 'committee_formation', label: 'Committee Formation' },
    { value: 'policy_adoption', label: 'Policy Adoption' },
    { value: 'other', label: 'Other' },
]

const PROTECTED_CATEGORIES = ['bylaw_amendment', 'certificate_amendment', 'stock_issuance', 'merger_acquisition', 'debt_authorization']

const STATUS_BADGES: Record<string, { label: string; color: string; icon: any }> = {
    draft: { label: 'Draft', color: 'text-white/40 bg-white/5 border-white/10', icon: FileText },
    pending_vote: { label: 'Pending Vote', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: Clock },
    voting: { label: 'Voting', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Vote },
    approved: { label: 'Approved', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: XCircle },
    withdrawn: { label: 'Withdrawn', color: 'text-white/20 bg-white/5 border-white/5', icon: X },
    archived: { label: 'Archived', color: 'text-white/20 bg-white/5 border-white/5', icon: FileText },
}

interface Props {
    isAdmin?: boolean
    userEmail: string
    userName: string
    directors: { name: string; email: string; title: string }[]
    officers: { name: string; email: string; title: string }[]
}

export default function ResolutionCenter({ isAdmin = false, userEmail, userName, directors, officers }: Props) {
    const [resolutions, setResolutions] = useState<ResolutionRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [selected, setSelected] = useState<ResolutionRecord | null>(null)
    const [filter, setFilter] = useState<string>('all')
    const [form, setForm] = useState({
        title: '', category: 'general', description: '', resolved_text: '',
        resolution_type: 'board', debt_amount: 0, proposed_by: ''
    })

    // Attachment upload state
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // PDF viewer state
    const [viewingPdf, setViewingPdf] = useState<string | null>(null)
    const [viewingResolution, setViewingResolution] = useState<ResolutionRecord | null>(null)
    const [pdfPages, setPdfPages] = useState(0)
    const [pdfPage, setPdfPage] = useState(1)
    const [pdfScale, setPdfScale] = useState(1.2)
    const [pageDims, setPageDims] = useState({ width: 0, height: 0 })
    const [annotTool, setAnnotTool] = useState<'none' | 'highlight' | 'comment'>('none')
    const myColor = userColor(userEmail)

    // Voting state
    const [voteNotes, setVoteNotes] = useState('')

    useEffect(() => { fetchResolutions() }, [])

    async function fetchResolutions() {
        try {
            const res = await fetch('/api/nexus/resolutions')
            const data = await res.json()
            setResolutions(data.resolutions || [])
        } catch (e) { console.error(e) }
        setLoading(false)
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files?.length) return
        setUploading(true)
        for (const file of Array.from(files)) {
            const formData = new FormData()
            formData.append('file', file)
            try {
                const res = await fetch('/api/nexus/upload', { method: 'POST', body: formData })
                const data = await res.json()
                if (data.key) setAttachments(prev => [...prev, { file_name: file.name, file_url: data.key }])
            } catch (err) { console.error('Upload failed:', err) }
        }
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    async function handleCreate() {
        try {
            await fetch('/api/nexus/resolutions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, attachments, proposed_by: userName || userEmail })
            })
            setShowForm(false)
            setForm({ title: '', category: 'general', description: '', resolved_text: '', resolution_type: 'board', debt_amount: 0, proposed_by: '' })
            setAttachments([])
            fetchResolutions()
        } catch (e) { console.error(e) }
    }

    async function updateStatus(id: string, status: string) {
        try {
            await fetch('/api/nexus/resolutions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            })
            fetchResolutions()
        } catch (e) { console.error(e) }
    }

    async function deleteResolution(id: string) {
        if (!confirm('Are you sure you want to permanently delete this resolution?')) return
        try {
            await fetch(`/api/nexus/resolutions?id=${id}`, { method: 'DELETE' })
            setSelected(null)
            fetchResolutions()
        } catch (e) { console.error(e) }
    }

    async function castVote(resolutionId: string, vote: 'for' | 'against' | 'abstain') {
        try {
            await fetch('/api/nexus/resolutions', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: resolutionId,
                    action: 'vote',
                    member_id: userEmail,
                    member_name: userName || userEmail,
                    vote,
                    notes: voteNotes
                })
            })
            setVoteNotes('')
            fetchResolutions()
            // Refresh selected resolution
            const res = await fetch('/api/nexus/resolutions')
            const data = await res.json()
            const updated = (data.resolutions || []).find((r: ResolutionRecord) => r.id === resolutionId)
            if (updated) setSelected(updated)
        } catch (e) { console.error(e) }
    }

    function openPdfViewer(attachment: Attachment, resolution: ResolutionRecord) {
        setViewingPdf(attachment.file_url)
        setViewingResolution(resolution)
        setPdfPage(1)
        setPdfPages(0)
        setPdfScale(1.2)
        setPageDims({ width: 0, height: 0 })
        setAnnotTool('none')
    }

    function closePdfViewer() {
        setViewingPdf(null)
        setViewingResolution(null)
        setAnnotTool('none')
        setPageDims({ width: 0, height: 0 })
    }

    const isProtected = PROTECTED_CATEGORIES.includes(form.category)
    const isDebtGated = form.category === 'debt_authorization' && form.debt_amount > 50000
    const filtered = filter === 'all' ? resolutions : resolutions.filter(r => r.status === filter)

    // Check if current user is a director or officer (eligible to vote)
    const allMembers = [...directors, ...officers]
    const isVoter = allMembers.some(m => m.email === userEmail)

    function getUserVote(resolution: ResolutionRecord): VoteRecord | undefined {
        return resolution.votes?.find(v => v.member_id === userEmail)
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-rajdhani text-white tracking-wide">Resolutions</h2>
                    <p className="text-sm text-white/40 mt-1">DGCL §141(f) — Board & shareholder actions</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
                        {['all', 'draft', 'voting', 'approved', 'rejected'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${filter === f ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
                                {f}
                            </button>
                        ))}
                    </div>
                    {isAdmin && (
                        <button onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#F54029]/20 transition-all">
                            <Plus size={14} /> New Resolution
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {['draft', 'voting', 'approved', 'rejected', 'archived'].map(s => {
                    const info = STATUS_BADGES[s]
                    const count = resolutions.filter(r => r.status === s).length
                    return (
                        <div key={s} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl text-center">
                            <p className="text-2xl font-mono text-white">{count}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${info.color.split(' ')[0]}`}>{info.label}</p>
                        </div>
                    )
                })}
            </div>

            {/* Resolution List */}
            <div className="space-y-3">
                {filtered.map(r => {
                    const badge = STATUS_BADGES[r.status] || STATUS_BADGES.draft
                    const BadgeIcon = badge.icon
                    const myVote = getUserVote(r)
                    const totalVotes = r.votes_for + r.votes_against + r.votes_abstain
                    const isExpanded = selected?.id === r.id
                    return (
                        <div key={r.id} onClick={() => setSelected(isExpanded ? null : r)}
                            className={`p-5 bg-white/[0.02] border rounded-xl cursor-pointer transition-all hover:border-white/20 ${isExpanded ? 'border-[#F54029]/30 bg-[#F54029]/5' : 'border-white/5'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 shrink-0">
                                        <Gavel size={18} className="text-white/30" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs text-white/20 font-mono">{r.resolution_number}</span>
                                            {r.requires_unanimous_consent && (
                                                <span className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[9px] text-red-400 font-bold uppercase flex items-center gap-1">
                                                    <Lock size={8} /> §4.4 Unanimous
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-white truncate">{r.title}</h4>
                                        <p className="text-xs text-white/30 mt-0.5 capitalize">{r.category?.replace(/_/g, ' ')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    {totalVotes > 0 && (
                                        <div className="text-xs text-white/30 text-right">
                                            <span className="text-emerald-400">{r.votes_for}</span> / <span className="text-red-400">{r.votes_against}</span>
                                            {r.votes_abstain > 0 && <> / <span className="text-white/30">{r.votes_abstain}</span></>}
                                        </div>
                                    )}
                                    {myVote && (
                                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border rounded ${myVote.vote === 'for' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : myVote.vote === 'against' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-white/30 bg-white/5 border-white/10'}`}>
                                            You: {myVote.vote}
                                        </span>
                                    )}
                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-md flex items-center gap-1 ${badge.color}`}>
                                        <BadgeIcon size={10} /> {badge.label}
                                    </span>
                                </div>
                            </div>

                            {/* Expanded Detail */}
                            {isExpanded && (
                                <div className="mt-6 pt-6 border-t border-white/5 space-y-5 animate-fadeIn" onClick={e => e.stopPropagation()}>
                                    {r.description && <p className="text-sm text-white/60">{r.description}</p>}
                                    {r.resolved_text && (
                                        <div className="p-4 bg-black/30 rounded-xl border border-white/5">
                                            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Resolved Text</p>
                                            <p className="text-sm text-white/80 italic">{r.resolved_text}</p>
                                        </div>
                                    )}

                                    {/* Attachments with PDF Viewer */}
                                    {r.attachments?.length > 0 && (
                                        <div>
                                            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Attachments</p>
                                            <div className="space-y-2">
                                                {r.attachments.map((a, i) => (
                                                    <button key={i} onClick={() => openPdfViewer(a, r)}
                                                        className="flex items-center gap-2 p-3 w-full text-left rounded-lg border transition-all bg-white/[0.03] border-white/5 hover:border-[#F54029]/30 hover:bg-[#F54029]/5">
                                                        <Paperclip size={14} className="text-[#F54029]" />
                                                        <span className="text-xs text-white/60 flex-1">{a.file_name}</span>
                                                        <Eye size={12} className="text-white/20" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Voting Section */}
                                    {r.status === 'voting' && (
                                        <div className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Vote size={14} className="text-amber-400" />
                                                <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Cast Your Vote</p>
                                            </div>

                                            {/* Vote progress bar */}
                                            {totalVotes > 0 && (
                                                <div className="mb-4">
                                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
                                                        {r.votes_for > 0 && <div className="bg-emerald-400 h-full transition-all" style={{ width: `${(r.votes_for / totalVotes) * 100}%` }} />}
                                                        {r.votes_against > 0 && <div className="bg-red-400 h-full transition-all" style={{ width: `${(r.votes_against / totalVotes) * 100}%` }} />}
                                                        {r.votes_abstain > 0 && <div className="bg-white/20 h-full transition-all" style={{ width: `${(r.votes_abstain / totalVotes) * 100}%` }} />}
                                                    </div>
                                                    <div className="flex justify-between mt-1.5">
                                                        <span className="text-[9px] text-emerald-400">{r.votes_for} For</span>
                                                        <span className="text-[9px] text-white/30">{r.votes_abstain} Abstain</span>
                                                        <span className="text-[9px] text-red-400">{r.votes_against} Against</span>
                                                    </div>
                                                </div>
                                            )}

                                            {isVoter ? (
                                                <>
                                                    <textarea
                                                        value={voteNotes}
                                                        onChange={e => setVoteNotes(e.target.value)}
                                                        placeholder="Optional: Add notes to your vote..."
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none h-12 focus:border-amber-500/30 placeholder:text-white/20 mb-3"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button onClick={() => castVote(r.id, 'for')}
                                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${myVote?.vote === 'for' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/[0.03] border-white/10 text-white/40 hover:border-emerald-500/30 hover:text-emerald-400'}`}>
                                                            <ThumbsUp size={12} /> For
                                                        </button>
                                                        <button onClick={() => castVote(r.id, 'against')}
                                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${myVote?.vote === 'against' ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/[0.03] border-white/10 text-white/40 hover:border-red-500/30 hover:text-red-400'}`}>
                                                            <ThumbsDown size={12} /> Against
                                                        </button>
                                                        <button onClick={() => castVote(r.id, 'abstain')}
                                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${myVote?.vote === 'abstain' ? 'bg-white/10 border-white/20 text-white/60' : 'bg-white/[0.03] border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'}`}>
                                                            <MinusCircle size={12} /> Abstain
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-xs text-white/30 italic">Only directors and officers can vote on resolutions.</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Vote ledger */}
                                    {r.votes?.length > 0 && (
                                        <div>
                                            <p className="text-xs text-white/30 uppercase tracking-widest mb-2">Vote Ledger</p>
                                            <div className="space-y-1.5">
                                                {r.votes.map((v, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                                                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${v.vote === 'for' ? 'bg-emerald-400' : v.vote === 'against' ? 'bg-red-400' : 'bg-white/20'}`} />
                                                        <span className="text-sm text-white/60 flex-1">{v.member_name}</span>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${v.vote === 'for' ? 'text-emerald-400' : v.vote === 'against' ? 'text-red-400' : 'text-white/30'}`}>{v.vote}</span>
                                                        {v.notes && <span className="text-[9px] text-white/20 max-w-[150px] truncate">"{v.notes}"</span>}
                                                        <span className="text-[9px] text-white/15 font-mono">{new Date(v.voted_at).toLocaleDateString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Admin controls */}
                                    {isAdmin && r.status === 'draft' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => updateStatus(r.id, 'voting')}
                                                className="px-4 py-2 bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#F54029]/20 transition-all">
                                                Open Voting
                                            </button>
                                            <button onClick={() => updateStatus(r.id, 'withdrawn')}
                                                className="px-4 py-2 bg-white/5 border border-white/10 text-white/40 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                                                Withdraw
                                            </button>
                                        </div>
                                    )}


                                    {r.filed_with_state && (
                                        <div className="flex items-center gap-2 text-xs text-emerald-400/60">
                                            <Shield size={12} /> Filed with Delaware — {r.filing_reference}
                                        </div>
                                    )}

                                    {/* Delete */}
                                    {isAdmin && (
                                        <div className="pt-2 border-t border-white/5">
                                            <button onClick={() => deleteResolution(r.id)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400/40 hover:text-red-400 transition-all">
                                                <X size={10} /> Delete Resolution
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}

                {!loading && filtered.length === 0 && (
                    <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
                        <Gavel className="mx-auto text-white/10 mb-4" size={40} />
                        <p className="text-white/40">No resolutions found.</p>
                    </div>
                )}
            </div>

            {/* Create Resolution Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setShowForm(false)}>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-rajdhani text-white">New Resolution</h3>
                            <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>

                        {/* Protected Action Warning */}
                        {isProtected && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6 flex items-start gap-3">
                                <Lock size={16} className="text-red-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">§4.4 Protected Action</p>
                                    <p className="text-xs text-red-300/80">This category requires unanimous written consent of all Class F stockholders (Founder Directors). Each founder has individual veto power.</p>
                                </div>
                            </div>
                        )}

                        {isDebtGated && (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6 flex items-start gap-3">
                                <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">§8.6A Debt Gate Triggered</p>
                                    <p className="text-xs text-amber-300/80">Debt authorization over $50,000 requires Board resolution AND unanimous founder consent. Board-only approval is void.</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Title</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]"
                                    placeholder="e.g. Approval of Q1 2026 Operating Budget" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Category</label>
                                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" style={{ colorScheme: 'dark' }}>
                                        {CATEGORIES.map(c => <option key={c.value} value={c.value} className="bg-[#111] text-white">{c.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Type</label>
                                    <select value={form.resolution_type} onChange={e => setForm(f => ({ ...f, resolution_type: e.target.value }))}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" style={{ colorScheme: 'dark' }}>
                                        <option value="board" className="bg-[#111] text-white">Board Resolution</option>
                                        <option value="written_consent" className="bg-[#111] text-white">Written Consent</option>
                                        <option value="shareholder" className="bg-[#111] text-white">Shareholder Resolution</option>
                                        <option value="unanimous_consent" className="bg-[#111] text-white">Unanimous Consent</option>
                                    </select>
                                </div>
                            </div>
                            {form.category === 'debt_authorization' && (
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Debt Amount ($)</label>
                                    <input type="number" value={form.debt_amount} onChange={e => setForm(f => ({ ...f, debt_amount: parseFloat(e.target.value) || 0 }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" />
                                </div>
                            )}
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Description</label>
                                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029] h-20 resize-none" />
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Resolved Text</label>
                                <textarea value={form.resolved_text} onChange={e => setForm(f => ({ ...f, resolved_text: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029] h-24 resize-none"
                                    placeholder='RESOLVED, that the Board of Directors hereby approves...' />
                            </div>

                            {/* Attachment Upload */}
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">Attachments</label>
                                {attachments.length > 0 && (
                                    <div className="space-y-1.5 mb-2">
                                        {attachments.map((a, i) => (
                                            <div key={i} className="flex items-center gap-2 p-2 bg-white/[0.03] border border-white/5 rounded-lg">
                                                <Paperclip size={12} className="text-[#F54029]" />
                                                <span className="text-xs text-white/60 flex-1">{a.file_name}</span>
                                                <button onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-white/20 hover:text-red-400"><X size={12} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept=".pdf" multiple onChange={handleUpload} className="hidden" />
                                <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/40 hover:text-white hover:border-white/20 transition-all disabled:opacity-30">
                                    {uploading ? <><Loader2 size={12} className="animate-spin" /> Uploading...</> : <><Upload size={12} /> Upload PDF</>}
                                </button>
                            </div>

                            <button onClick={handleCreate} disabled={!form.title || uploading}
                                className="w-full py-3 bg-[#F54029] text-white font-bold rounded-xl uppercase tracking-wider text-xs hover:bg-[#C53020] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {uploading ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : 'Create Resolution'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Full-screen PDF Viewer Modal */}
            {viewingPdf && (
                <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col animate-fadeIn" onClick={closePdfViewer}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0A0A0A]/80" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                            <FileText size={16} className="text-[#F54029]" />
                            <span className="text-sm text-white/60 font-mono">
                                {viewingResolution?.attachments.find(a => a.file_url === viewingPdf)?.file_name || 'Document'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            {pdfPages > 1 && (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setPdfPage(p => Math.max(1, p - 1))} disabled={pdfPage <= 1}
                                        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition-all">
                                        <ChevronLeft size={14} />
                                    </button>
                                    <span className="text-[10px] text-white/40 font-mono min-w-[60px] text-center">{pdfPage} / {pdfPages}</span>
                                    <button onClick={() => setPdfPage(p => Math.min(pdfPages, p + 1))} disabled={pdfPage >= pdfPages}
                                        className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition-all">
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <button onClick={() => setPdfScale(s => Math.max(0.5, s - 0.2))}
                                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                    <ZoomOut size={12} />
                                </button>
                                <button onClick={() => setPdfScale(1.2)}
                                    className="px-2 h-7 rounded-lg bg-white/5 border border-white/10 text-[10px] text-white/40 hover:text-white font-mono transition-all">
                                    {Math.round(pdfScale * 100)}%
                                </button>
                                <button onClick={() => setPdfScale(s => Math.min(3, s + 0.2))}
                                    className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all">
                                    <ZoomIn size={12} />
                                </button>
                            </div>
                            <button onClick={closePdfViewer} className="text-white/40 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                    {/* Annotation Toolbar */}
                    <div className="flex items-center gap-2 px-6 py-2 border-b border-white/5 bg-[#0A0A0A]/60" onClick={e => e.stopPropagation()}>
                        <span className="text-[9px] text-white/30 uppercase tracking-wider mr-2">Annotate:</span>
                        <button onClick={() => setAnnotTool(t => t === 'highlight' ? 'none' : 'highlight')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${annotTool === 'highlight' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/[0.03] border-white/5 text-white/30 hover:text-white'}`}>
                            <Highlighter size={12} /> Highlight
                        </button>
                        <button onClick={() => setAnnotTool(t => t === 'comment' ? 'none' : 'comment')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${annotTool === 'comment' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/[0.03] border-white/5 text-white/30 hover:text-white'}`}>
                            <MessageCircle size={12} /> Comment
                        </button>
                        <div className="flex items-center gap-1 ml-auto">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: myColor }} />
                            <span className="text-[9px] text-white/30">Your color</span>
                        </div>
                    </div>
                    {/* PDF Render */}
                    <div className="flex-1 overflow-auto flex justify-center py-8" onClick={e => e.stopPropagation()}>
                        <Document
                            file={`/api/nexus/pdf-proxy?key=${encodeURIComponent(viewingPdf)}`}
                            onLoadSuccess={({ numPages }) => { setPdfPages(numPages); setPdfPage(1) }}
                            loading={
                                <div className="flex items-center justify-center py-32">
                                    <div className="text-center">
                                        <Loader2 className="mx-auto text-[#F54029] animate-spin mb-3" size={32} />
                                        <p className="text-xs text-white/30">Loading PDF...</p>
                                    </div>
                                </div>
                            }
                            error={
                                <div className="flex items-center justify-center py-32">
                                    <div className="text-center">
                                        <FileText className="mx-auto text-red-400/40 mb-3" size={48} />
                                        <p className="text-xs text-red-400/60">Failed to load PDF</p>
                                    </div>
                                </div>
                            }
                        >
                            <div className="relative" style={{ width: pageDims.width || 'auto', height: pageDims.height || 'auto' }}>
                                <Page
                                    pageNumber={pdfPage}
                                    scale={pdfScale}
                                    renderTextLayer={true}
                                    renderAnnotationLayer={true}
                                    onRenderSuccess={() => {
                                        const canvas = document.querySelector('.react-pdf__Page__canvas') as HTMLCanvasElement
                                        if (canvas) setPageDims({ width: canvas.offsetWidth, height: canvas.offsetHeight })
                                    }}
                                />
                                {pageDims.width > 0 && (
                                    <PdfAnnotationOverlay
                                        documentKey={viewingPdf}
                                        pageNumber={pdfPage}
                                        userEmail={userEmail}
                                        userName={userName}
                                        activeTool={annotTool}
                                    />
                                )}
                            </div>
                        </Document>
                    </div>
                </div>
            )}
        </div>
    )
}
