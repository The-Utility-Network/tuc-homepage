'use client'

import { useState, useEffect, useRef } from 'react'
import { FileText, Plus, X, Trash2, Send, Filter, Clock, AlertTriangle, CheckCircle, Eye, EyeOff, Paperclip, Users, Bell, ChevronDown, Upload, Loader2, MessageCircle, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Highlighter, Download, Layout, LayoutList } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import PdfAnnotationOverlay, { getUserColor, setUserColor, ANNOTATION_COLORS } from './PdfAnnotationOverlay'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Attachment {
    file_name: string
    file_url: string
    file_size: number
    uploaded_at: string
}

interface Message {
    user_email: string
    user_name: string
    text: string
    created_at: string
}

interface MemoResponse {
    user_email: string
    user_name: string
    response: string
    comment: string
    responded_at: string
}

interface GovMemo {
    id: string
    title: string
    type: 'memo' | 'proposal' | 'report'
    department: string
    author_email: string
    author_name: string
    content: string
    summary: string
    priority: string
    status: string
    notify_recipients: string[]
    notify_all_directors: boolean
    notify_all_officers: boolean
    attachments: Attachment[]
    requires_response: boolean
    response_deadline?: string
    responses: MemoResponse[]
    messages: Message[]
    reference_number: string
    tags: string[]
    published_at?: string
    created_at: string
}

const DEPARTMENTS = ['Executive', 'Engineering', 'Revenue', 'Finance', 'Legal', 'Operations', 'Corporate', 'Product', 'Marketing']
const TYPES = [
    { id: 'all', label: 'All' },
    { id: 'memo', label: 'Memos' },
    { id: 'proposal', label: 'Proposals' },
    { id: 'report', label: 'Reports' },
]
const PRIORITIES = ['low', 'normal', 'high', 'urgent']
const STATUSES = ['draft', 'under_review', 'published', 'approved', 'rejected', 'archived']

const priorityColors: Record<string, string> = {
    low: 'text-white/30 bg-white/5 border-white/10',
    normal: 'text-red-400 bg-red-500/10 border-red-500/20',
    high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    urgent: 'text-red-400 bg-red-500/10 border-red-500/20 animate-pulse',
}

const statusColors: Record<string, string> = {
    draft: 'text-white/40 bg-white/5 border-white/10',
    under_review: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    published: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    approved: 'text-green-400 bg-green-500/10 border-green-500/20',
    rejected: 'text-red-400 bg-red-500/10 border-red-500/20',
    archived: 'text-white/20 bg-white/[0.02] border-white/5',
}

const typeIcons: Record<string, string> = {
    memo: '📋',
    proposal: '📝',
    report: '📊',
}

interface Props {
    isAdmin?: boolean
    userEmail?: string
    userName?: string
    directors?: { name: string; email: string; title: string }[]
    officers?: { name: string; email: string; title: string }[]
}

export default function GovernanceMemos({ isAdmin = false, userEmail = '', userName = '', directors = [], officers = [] }: Props) {
    const [memos, setMemos] = useState<GovMemo[]>([])
    const [loading, setLoading] = useState(true)
    const [typeFilter, setTypeFilter] = useState('all')
    const [deptFilter, setDeptFilter] = useState('all')
    const [showCreate, setShowCreate] = useState(false)
    const [viewingMemo, setViewingMemo] = useState<GovMemo | null>(null)
    const [uploading, setUploading] = useState(false)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [messageText, setMessageText] = useState('')
    const messageEndRef = useRef<HTMLDivElement>(null)
    const [viewingPdf, setViewingPdf] = useState<string | null>(null) // S3 key of PDF being viewed
    const [pdfPages, setPdfPages] = useState(0)
    const [pdfPage, setPdfPage] = useState(1)
    const [pdfScale, setPdfScale] = useState(1.0)
    const [viewMode, setViewMode] = useState<'single' | 'scroll'>('scroll')
    const [showAnnotations, setShowAnnotations] = useState(true)
    const [annotTool, setAnnotTool] = useState<'none' | 'highlight' | 'comment'>('none')
    const [myColor, setMyColor] = useState(() => getUserColor(userEmail))
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [form, setForm] = useState({
        title: '', type: 'memo' as 'memo' | 'proposal' | 'report',
        department: 'Executive', content: '', summary: '',
        priority: 'normal', status: 'draft',
        selected_recipients: [] as string[], // composite keys: 'email|title'
        notify_all_directors: false, notify_all_officers: false,
        notify_departments: [] as string[],
        requires_response: false, response_deadline: '',
        tags: ''
    })

    // Fetch server-persisted color preference on mount
    useEffect(() => {
        if (!userEmail) return
        fetch(`/api/nexus/user-preferences?email=${encodeURIComponent(userEmail)}`)
            .then(r => r.json())
            .then(d => {
                if (d.annotation_color) {
                    setMyColor(d.annotation_color)
                    setUserColor(userEmail, d.annotation_color) // sync to localStorage too
                }
            })
            .catch(() => {})
    }, [userEmail])

    function handleColorChange(color: string) {
        setMyColor(color)
        setUserColor(userEmail, color) // localStorage
        setShowColorPicker(false)
        // Persist to server
        fetch('/api/nexus/user-preferences', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, annotation_color: color })
        }).catch(() => {})
    }

    useEffect(() => { fetchMemos() }, [typeFilter, deptFilter])

    async function fetchMemos() {
        try {
            const params = new URLSearchParams()
            if (typeFilter !== 'all') params.set('type', typeFilter)
            if (deptFilter !== 'all') params.set('department', deptFilter)
            const res = await fetch(`/api/nexus/governance-memos?${params}`)
            if (res.ok) {
                const data = await res.json()
                setMemos(data.memos || [])
            }
        } catch (e) { console.error(e) }
        setLoading(false)
    }

    async function handleCreate() {
        setUploading(true)
        try {
            let attachments: any[] = []

            // Upload file to S3 if selected
            if (selectedFile) {
                const formData = new FormData()
                formData.append('file', selectedFile)
                formData.append('folder', 'nexus/governance-memos')
                const uploadRes = await fetch('/api/nexus/upload', { method: 'POST', body: formData })
                if (!uploadRes.ok) throw new Error('Upload failed')
                const uploadData = await uploadRes.json()
                attachments = [{
                    file_name: uploadData.file_name,
                    file_url: uploadData.key,  // Store S3 key for proxy retrieval
                    file_size: uploadData.file_size
                }]
            }

            // Extract unique emails from composite keys (email|title)
            const uniqueEmails = [...new Set(form.selected_recipients.map(r => r.split('|')[0]))]
            const { selected_recipients, ...formData } = form

            await fetch('/api/nexus/governance-memos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    notify_recipients: uniqueEmails,
                    author_email: userEmail,
                    author_name: userName,
                    attachments,
                    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
                })
            })
            setShowCreate(false)
            setSelectedFile(null)
            resetForm()
            fetchMemos()
        } catch (e) { console.error(e) }
        setUploading(false)
    }

    async function handleStatusChange(id: string, newStatus: string) {
        await fetch('/api/nexus/governance-memos', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        })
        fetchMemos()
        if (viewingMemo?.id === id) setViewingMemo(prev => prev ? { ...prev, status: newStatus } : null)
    }

    async function handlePostMessage() {
        if (!viewingMemo || !messageText.trim()) return
        try {
            await fetch('/api/nexus/governance-memos', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: viewingMemo.id,
                    message: { user_email: userEmail, user_name: userName, text: messageText }
                })
            })
            setMessageText('')
            const res = await fetch('/api/nexus/governance-memos')
            const data = await res.json()
            const updated = data.memos?.find((m: any) => m.id === viewingMemo.id)
            if (updated) setViewingMemo(updated)
        } catch (e) { console.error(e) }
    }

    function canParticipate(memo: GovMemo): boolean {
        if (memo.author_email === userEmail) return true
        if (memo.notify_recipients?.includes(userEmail)) return true
        if (memo.notify_all_directors || memo.notify_all_officers) return true
        return false
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this item?')) return
        await fetch(`/api/nexus/governance-memos?id=${id}`, { method: 'DELETE' })
        fetchMemos()
        if (viewingMemo?.id === id) setViewingMemo(null)
    }

    function resetForm() {
        setForm({
            title: '', type: 'memo', department: 'Executive', content: '', summary: '',
            priority: 'normal', status: 'draft',
            selected_recipients: [], notify_all_directors: false, notify_all_officers: false,
            notify_departments: [],
            requires_response: false, response_deadline: '', tags: ''
        })
        setSelectedFile(null)
    }

    // Toggle a composite key: 'email|title'
    function toggleRecipient(compositeKey: string) {
        setForm(f => ({
            ...f,
            selected_recipients: f.selected_recipients.includes(compositeKey)
                ? f.selected_recipients.filter(k => k !== compositeKey)
                : [...f.selected_recipients, compositeKey]
        }))
    }

    const allPeople = [...directors, ...officers].filter((p, i, arr) => arr.findIndex(x => x.email === p.email) === i)

    function toggleDepartment(dept: string) {
        setForm(f => ({
            ...f,
            notify_departments: f.notify_departments.includes(dept)
                ? f.notify_departments.filter(d => d !== dept)
                : [...f.notify_departments, dept]
        }))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-rajdhani text-white tracking-wide">Memos, Proposals & Reports</h2>
                    <p className="text-sm text-white/40 mt-1">Internal governance communications by department</p>
                </div>
                {isAdmin && (
                    <button onClick={() => { resetForm(); setShowCreate(true) }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#F54029]/20 transition-all">
                        <Plus size={14} /> Create New
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
                <div className="flex gap-2">
                    {TYPES.map(t => (
                        <button key={t.id} onClick={() => setTypeFilter(t.id)}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${typeFilter === t.id ? 'bg-white/10 text-white border-white/20' : 'bg-white/[0.02] text-white/40 border-white/5 hover:text-white'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={12} className="text-white/20" />
                    <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
                        className="bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none" style={{ colorScheme: 'dark' }}>
                        <option value="all" className="bg-[#111] text-white">All Departments</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#111] text-white">{d}</option>)}
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['memo', 'proposal', 'report'].map(t => {
                    const count = memos.filter(m => m.type === t).length
                    return (
                        <div key={t} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                            <p className="text-2xl font-mono text-white font-bold">{count}</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mt-1">{t}s</p>
                        </div>
                    )
                })}
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-2xl font-mono text-amber-400 font-bold">{memos.filter(m => m.requires_response && m.responses.length === 0).length}</p>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mt-1">Pending Response</p>
                </div>
            </div>

            {/* Memo List */}
            {loading ? (
                <div className="py-16 text-center"><div className="w-6 h-6 border-2 border-[#F54029] border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : memos.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl">
                    <FileText className="mx-auto text-white/10 mb-4" size={48} />
                    <p className="text-white/40">No items found.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {memos.map(m => (
                        <div key={m.id} className="group p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="text-2xl shrink-0">{typeIcons[m.type] || '📄'}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-white text-sm truncate">{m.title}</h4>
                                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                <span className="text-[10px] text-white/20 font-mono">{m.reference_number}</span>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${priorityColors[m.priority]}`}>{m.priority}</span>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${statusColors[m.status]}`}>{m.status.replace('_', ' ')}</span>
                                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 rounded text-white/40">{m.department}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button onClick={() => setViewingMemo(m)}
                                                className="text-white/20 hover:text-[#F54029] transition-colors"><Eye size={14} /></button>
                                            {isAdmin && (
                                                <button onClick={() => handleDelete(m.id)}
                                                    className="text-white/20 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                                            )}
                                        </div>
                                    </div>
                                    {m.summary && <p className="text-xs text-white/30 mt-2 line-clamp-2">{m.summary}</p>}
                                    <div className="flex items-center gap-4 mt-3 text-[10px] text-white/20">
                                        <span>{m.author_name || m.author_email}</span>
                                        <span className="flex items-center gap-1"><Clock size={10} /> {new Date(m.created_at).toLocaleDateString()}</span>
                                        {m.attachments.length > 0 && <span className="flex items-center gap-1"><Paperclip size={10} /> {m.attachments.length} file(s)</span>}
                                        {m.requires_response && <span className="flex items-center gap-1"><AlertTriangle size={10} className="text-amber-400/60" /> Response required</span>}
                                        {m.responses.length > 0 && <span className="flex items-center gap-1"><CheckCircle size={10} className="text-emerald-400/60" /> {m.responses.length} response(s)</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail View Modal */}
            {viewingMemo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setViewingMemo(null)}>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">{typeIcons[viewingMemo.type]}</span>
                                    <span className="text-[10px] text-white/20 font-mono">{viewingMemo.reference_number}</span>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${statusColors[viewingMemo.status]}`}>{viewingMemo.status.replace('_', ' ')}</span>
                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${priorityColors[viewingMemo.priority]}`}>{viewingMemo.priority}</span>
                                </div>
                                <h3 className="text-xl font-bold font-rajdhani text-white">{viewingMemo.title}</h3>
                                <p className="text-xs text-white/30 mt-1">{viewingMemo.department} • {viewingMemo.author_name || viewingMemo.author_email} • {new Date(viewingMemo.created_at).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setViewingMemo(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>

                        {viewingMemo.summary && (
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl mb-4">
                                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Executive Summary</p>
                                <p className="text-sm text-white/70">{viewingMemo.summary}</p>
                            </div>
                        )}

                        {viewingMemo.content && (
                            <div className="prose prose-invert prose-sm max-w-none mb-6">
                                <div className="text-sm text-white/60 whitespace-pre-wrap leading-relaxed">{viewingMemo.content}</div>
                            </div>
                        )}

                        {viewingMemo.attachments.length > 0 && (
                            <div className="mb-6">
                                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Attachments</p>
                                <div className="space-y-2">
                                    {viewingMemo.attachments.map((a, i) => (
                                        <button key={i} onClick={() => { setViewingPdf(a.file_url); setPdfPage(1); setPdfPages(0); setPdfScale(1.2) }}
                                            className="flex items-center gap-2 p-3 w-full text-left rounded-lg border transition-all bg-white/[0.03] border-white/5 hover:border-[#F54029]/30 hover:bg-[#F54029]/5">
                                            <Paperclip size={14} className="text-[#F54029]" />
                                            <span className="text-xs text-white/60 flex-1">{a.file_name}</span>
                                            <Eye size={12} className="text-white/20" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Message Board */}
                        <div className="mb-6">
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <MessageCircle size={12} /> Discussion ({viewingMemo.messages?.length || 0})
                            </p>
                            <div className="bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden">
                                {/* Messages Thread */}
                                <div className="max-h-64 overflow-y-auto p-4 space-y-3">
                                    {(!viewingMemo.messages || viewingMemo.messages.length === 0) ? (
                                        <p className="text-xs text-white/20 text-center py-4">No messages yet. Start the discussion.</p>
                                    ) : (
                                        viewingMemo.messages.map((msg, i) => (
                                            <div key={i} className={`p-3 rounded-lg ${msg.user_email === userEmail ? 'bg-[#F54029]/5 border border-[#F54029]/10 ml-6' : 'bg-white/[0.03] border border-white/5 mr-6'}`}>
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className={`text-[10px] font-bold ${msg.user_email === userEmail ? 'text-[#F54029]' : 'text-white/60'}`}>
                                                        {msg.user_name || msg.user_email}
                                                        {msg.user_email === viewingMemo.author_email && <span className="ml-1 text-amber-400/60">• Author</span>}
                                                    </span>
                                                    <span className="text-[9px] text-white/20">{new Date(msg.created_at).toLocaleString()}</span>
                                                </div>
                                                <p className="text-xs text-white/50 leading-relaxed">{msg.text}</p>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messageEndRef} />
                                </div>

                                {/* Post Message Input */}
                                {canParticipate(viewingMemo) ? (
                                    <div className="border-t border-white/5 p-3 flex gap-2">
                                        <input
                                            value={messageText}
                                            onChange={e => setMessageText(e.target.value)}
                                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePostMessage() } }}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-[#F54029] placeholder:text-white/20"
                                        />
                                        <button onClick={handlePostMessage} disabled={!messageText.trim()}
                                            className="px-3 py-2 bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] rounded-lg hover:bg-[#F54029]/20 transition-all disabled:opacity-30">
                                            <Send size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="border-t border-white/5 p-3">
                                        <p className="text-[10px] text-white/20 text-center">Only tagged recipients and the author can participate in this discussion.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {viewingMemo.responses.length > 0 && (
                            <div className="mb-6">
                                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Responses ({viewingMemo.responses.length})</p>
                                <div className="space-y-2">
                                    {viewingMemo.responses.map((r, i) => (
                                        <div key={i} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-white">{r.user_name || r.user_email}</span>
                                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${r.response === 'approved' ? 'text-green-400 bg-green-500/10 border-green-500/20' : r.response === 'rejected' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-white/40 bg-white/5 border-white/5'}`}>
                                                    {r.response}
                                                </span>
                                            </div>
                                            {r.comment && <p className="text-xs text-white/40 mt-1">{r.comment}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Status Actions */}
                        {isAdmin && (
                            <div className="flex gap-2 pt-4 border-t border-white/5">
                                {viewingMemo.status === 'draft' && (
                                    <button onClick={() => handleStatusChange(viewingMemo.id, 'under_review')}
                                        className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-amber-500/20 transition-all">
                                        Submit for Review
                                    </button>
                                )}
                                {viewingMemo.status === 'under_review' && (
                                    <>
                                        <button onClick={() => handleStatusChange(viewingMemo.id, 'published')}
                                            className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-all">
                                            Publish
                                        </button>
                                        <button onClick={() => handleStatusChange(viewingMemo.id, 'approved')}
                                            className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-green-500/20 transition-all">
                                            Approve
                                        </button>
                                        <button onClick={() => handleStatusChange(viewingMemo.id, 'rejected')}
                                            className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-500/20 transition-all">
                                            Reject
                                        </button>
                                    </>
                                )}
                                {(viewingMemo.status === 'published' || viewingMemo.status === 'approved') && (
                                    <button onClick={() => handleStatusChange(viewingMemo.id, 'archived')}
                                        className="px-4 py-2 bg-white/5 border border-white/10 text-white/40 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                                        Archive
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setShowCreate(false)}>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-rajdhani text-white">Create New {form.type.charAt(0).toUpperCase() + form.type.slice(1)}</h3>
                            <button onClick={() => setShowCreate(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            {/* Type and Priority */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Type *</label>
                                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" style={{ colorScheme: 'dark' }}>
                                        <option value="memo" className="bg-[#111] text-white">Memo</option>
                                        <option value="proposal" className="bg-[#111] text-white">Proposal</option>
                                        <option value="report" className="bg-[#111] text-white">Report</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Department *</label>
                                    <select value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" style={{ colorScheme: 'dark' }}>
                                        {DEPARTMENTS.map(d => <option key={d} value={d} className="bg-[#111] text-white">{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Priority</label>
                                    <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" style={{ colorScheme: 'dark' }}>
                                        {PRIORITIES.map(p => <option key={p} value={p} className="bg-[#111] text-white capitalize">{p}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Title *</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="Title of the memo/proposal/report" />
                            </div>

                            {/* Summary */}
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Executive Summary</label>
                                <textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029] h-16 resize-none" placeholder="Brief summary for the notification" />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Full Content</label>
                                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029] h-32 resize-none" placeholder="Detailed content..." />
                            </div>

                            {/* PDF Attachment */}
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">PDF Attachment</label>
                                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
                                    onChange={e => {
                                        const file = e.target.files?.[0]
                                        if (file) setSelectedFile(file)
                                    }} />
                                <button onClick={() => fileInputRef.current?.click()}
                                    className={`w-full border-2 border-dashed rounded-xl p-4 text-center transition-all ${selectedFile ? 'border-[#F54029]/30 bg-[#F54029]/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}>
                                    {selectedFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <Paperclip size={16} className="text-[#F54029]" />
                                            <span className="text-sm text-white font-bold">{selectedFile.name}</span>
                                            <X size={14} className="text-white/30 hover:text-white" onClick={e => { e.stopPropagation(); setSelectedFile(null) }} />
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="mx-auto text-white/20 mb-1" size={20} />
                                            <p className="text-xs text-white/40">Click to attach a PDF</p>
                                        </div>
                                    )}
                                </button>
                            </div>

                            {/* Response Configuration */}
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                                <div className="flex items-center gap-3">
                                    <input type="checkbox" checked={form.requires_response}
                                        onChange={e => setForm(f => ({ ...f, requires_response: e.target.checked }))}
                                        className="w-4 h-4 accent-[#F54029]" />
                                    <label className="text-xs text-white/60 font-bold uppercase tracking-wider">Requires Response from Recipients</label>
                                </div>
                                {form.requires_response && (
                                    <div>
                                        <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Response Deadline</label>
                                        <input type="date" value={form.response_deadline}
                                            onChange={e => setForm(f => ({ ...f, response_deadline: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]"
                                            style={{ colorScheme: 'dark' }} />
                                    </div>
                                )}
                            </div>

                            {/* Notification Targeting */}
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                                <p className="text-xs text-white/40 uppercase tracking-widest flex items-center gap-2">
                                    <Bell size={12} /> Notification Targeting
                                </p>

                                {/* Broadcast */}
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Broadcast</p>
                                    <div className="flex gap-3">
                                        <label className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border cursor-pointer transition-all ${form.notify_all_directors ? 'bg-[#F54029]/10 border-[#F54029]/30 text-[#F54029]' : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white'}`}>
                                            <input type="checkbox" checked={form.notify_all_directors}
                                                onChange={e => setForm(f => ({ ...f, notify_all_directors: e.target.checked }))}
                                                className="w-3.5 h-3.5 accent-[#F54029]" />
                                            <Users size={12} /> All Directors
                                        </label>
                                        <label className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg border cursor-pointer transition-all ${form.notify_all_officers ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white'}`}>
                                            <input type="checkbox" checked={form.notify_all_officers}
                                                onChange={e => setForm(f => ({ ...f, notify_all_officers: e.target.checked }))}
                                                className="w-3.5 h-3.5 accent-emerald-400" />
                                            <Users size={12} /> All Officers
                                        </label>
                                    </div>
                                </div>

                                {/* Department Targeting */}
                                <div>
                                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">By Department</p>
                                    <div className="flex flex-wrap gap-2">
                                        {DEPARTMENTS.map(dept => (
                                            <button key={dept} onClick={() => toggleDepartment(dept)}
                                                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${form.notify_departments.includes(dept)
                                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                                    : 'bg-white/[0.02] border-white/5 text-white/30 hover:text-white hover:border-white/10'}`}>
                                                {dept}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Individual Selection */}
                                {(directors.length > 0 || officers.length > 0) && (
                                    <div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Specific Individuals</p>
                                        {directors.length > 0 && (
                                            <div className="mb-2">
                                                <p className="text-[9px] text-white/20 uppercase tracking-widest mb-1.5">Directors</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {directors.map((p, i) => {
                                                        const key = `${p.email}|${p.title}`
                                                        return (
                                                            <button key={`d-${key}-${i}`} onClick={() => toggleRecipient(key)}
                                                                className={`px-2.5 py-1 text-[10px] rounded-md border transition-all ${form.selected_recipients.includes(key)
                                                                    ? 'bg-[#F54029]/10 border-[#F54029]/30 text-[#F54029]'
                                                                    : 'bg-white/[0.02] border-white/5 text-white/30 hover:text-white'}`}>
                                                                {p.name} <span className="text-white/15">— {p.title}</span>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        {officers.length > 0 && (
                                            <div>
                                                <p className="text-[9px] text-white/20 uppercase tracking-widest mb-1.5">Officers</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {officers.map((p, i) => {
                                                        const key = `${p.email}|${p.title}`
                                                        return (
                                                            <button key={`o-${key}-${i}`} onClick={() => toggleRecipient(key)}
                                                                className={`px-2.5 py-1 text-[10px] rounded-md border transition-all ${form.selected_recipients.includes(key)
                                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                                    : 'bg-white/[0.02] border-white/5 text-white/30 hover:text-white'}`}>
                                                                {p.name} <span className="text-white/15">— {p.title}</span>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Tags (comma-separated)</label>
                                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="e.g. quarterly, finance, review" />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Initial Status</label>
                                <div className="flex gap-2">
                                    {['draft', 'published'].map(s => (
                                        <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                                            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${form.status === s ? 'bg-[#F54029]/10 border-[#F54029]/30 text-[#F54029]' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}>
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={handleCreate} disabled={!form.title || !form.department || uploading}
                                className="w-full py-3 bg-[#F54029] text-white font-bold rounded-xl uppercase tracking-wider text-xs hover:bg-[#C53020] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {uploading ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : `Create ${form.type.charAt(0).toUpperCase() + form.type.slice(1)}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Full-screen PDF Viewer Modal */}
            {viewingPdf && (
                <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex flex-col animate-fadeIn" onClick={() => { setViewingPdf(null); setAnnotTool('none'); }}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#0A0A0A]/80" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3">
                            <FileText size={16} className="text-[#F54029]" />
                            <span className="text-sm text-white/60 font-mono">
                                {viewingMemo?.attachments.find(a => a.file_url === viewingPdf)?.file_name || 'Document'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* View Mode Toggle */}
                            <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-0.5">
                                <button onClick={() => setViewMode('single')} className={`p-1.5 rounded-md transition-all ${viewMode === 'single' ? 'bg-[#F54029]/20 text-[#F54029]' : 'text-white/40 hover:text-white'}`} title="Single Page View">
                                    <Layout size={14} />
                                </button>
                                <button onClick={() => setViewMode('scroll')} className={`p-1.5 rounded-md transition-all ${viewMode === 'scroll' ? 'bg-[#F54029]/20 text-[#F54029]' : 'text-white/40 hover:text-white'}`} title="Continuous Scroll View">
                                    <LayoutList size={14} />
                                </button>
                            </div>

                            {/* Page Navigation */}
                            {pdfPages > 1 && viewMode === 'single' && (
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
                            {/* Zoom Controls */}
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

                            {/* Visibility Toggle */}
                            <button onClick={() => setShowAnnotations(!showAnnotations)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ml-2 ${showAnnotations ? 'bg-[#F54029]/20 border border-[#F54029]/30 text-[#F54029] hover:bg-[#F54029]/30' : 'bg-white/5 border border-white/10 text-white/40 hover:text-white'}`} title="Toggle Annotation Visibility">
                                {showAnnotations ? <Eye size={14} /> : <EyeOff size={14} />}
                            </button>

                            <a href={`/api/nexus/pdf-proxy?key=${encodeURIComponent(viewingPdf)}`} download
                                className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all ml-4">
                                <Download size={14} />
                            </a>
                            <button onClick={() => { setViewingPdf(null); setAnnotTool('none'); }} className="text-white/40 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                    {/* Annotation Toolbar */}
                    <div className="flex items-center gap-2 px-6 py-2 border-b border-white/5 bg-[#0A0A0A]/60" onClick={e => e.stopPropagation()}>
                        <span className="text-[9px] text-white/30 uppercase tracking-wider mr-2">Drawing Tools:</span>
                        <button onClick={() => setAnnotTool(t => t === 'highlight' ? 'none' : 'highlight')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${annotTool === 'highlight' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/[0.03] border-white/5 text-white/30 hover:text-white'}`}>
                            <Plus size={12} /> Area Highlight
                        </button>
                        <button onClick={() => setAnnotTool(t => t === 'comment' ? 'none' : 'comment')}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all ${annotTool === 'comment' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/[0.03] border-white/5 text-white/30 hover:text-white'}`}>
                            <MessageCircle size={12} /> Add Comment Tool
                        </button>
                        <div className="w-[1px] h-4 bg-white/10 mx-2" />
                        <span className="text-[9px] text-white/30 italic mr-2">Pro Tip: Standard text selection is always active.</span>
                        
                        <div className="flex items-center gap-1 ml-auto relative">
                            <div className="w-2.5 h-2.5 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-white/30 transition-all" style={{ backgroundColor: myColor }} onClick={() => setShowColorPicker(!showColorPicker)} />
                            <span className="text-[9px] text-white/30 cursor-pointer" onClick={() => setShowColorPicker(!showColorPicker)}>Your color</span>
                            {showColorPicker && (
                                <div className="absolute bottom-full right-0 mb-2 p-3 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-[70] annotation-toolbar">
                                    <p className="text-[9px] text-white/40 uppercase tracking-wider mb-2 font-bold">Pick Your Color</p>
                                    <div className="grid grid-cols-5 gap-1.5">
                                        {ANNOTATION_COLORS.map(c => (
                                            <button key={c} onClick={() => handleColorChange(c)}
                                                className={`w-6 h-6 rounded-full transition-all hover:scale-110 ${myColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111]' : ''}`}
                                                style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* PDF Render with Annotation Overlay */}
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
                            {viewMode === 'single' ? (
                                <div className="relative inline-block mx-auto mb-8 bg-white" style={{ boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                                    <Page
                                        pageNumber={pdfPage}
                                        scale={pdfScale}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                    />
                                    {showAnnotations && (
                                        <PdfAnnotationOverlay
                                            documentKey={viewingPdf}
                                            pageNumber={pdfPage}
                                            userEmail={userEmail}
                                            userName={userName}
                                            activeTool={annotTool as any}
                                            userColorOverride={myColor}
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-16 pb-32">
                                    {Array.from(new Array(pdfPages), (el, index) => {
                                        const p = index + 1;
                                        return (
                                            <div key={`page_${p}`} className="relative inline-block mx-auto bg-white" style={{ boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}>
                                                <Page
                                                    pageNumber={p}
                                                    scale={pdfScale}
                                                    renderTextLayer={true}
                                                    renderAnnotationLayer={true}
                                                />
                                                {showAnnotations && (
                                                    <PdfAnnotationOverlay
                                                        documentKey={viewingPdf}
                                                        pageNumber={p}
                                                        userEmail={userEmail}
                                                        userName={userName}
                                                        activeTool={annotTool as any}
                                                        userColorOverride={myColor}
                                                    />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </Document>
                    </div>
                </div>
            )}
        </div>
    )
}
