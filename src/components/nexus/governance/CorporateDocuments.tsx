'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FileText, Upload, Plus, X, MessageCircle, Send, Trash2, Eye, Tag, Filter, Clock, Loader2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize2, Pen, CheckCircle } from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import FillAndSign from './FillAndSign'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Comment {
    user_email: string
    user_name: string
    text: string
    created_at: string
}

interface CorpDoc {
    id: string
    title: string
    description: string
    category: string
    department: string
    file_url: string
    file_name: string
    file_size: number
    uploaded_by: string
    status: string
    version: number
    tags: string[]
    comments: Comment[]
    created_at: string
}

const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'charter', label: 'Charter' },
    { id: 'bylaws', label: 'Bylaws' },
    { id: 'agreement', label: 'Agreements' },
    { id: 'filing', label: 'Filings' },
    { id: 'policy', label: 'Policies' },
    { id: 'resolution', label: 'Resolutions' },
    { id: 'financial', label: 'Financial' },
    { id: 'other', label: 'Other' },
]

interface Props {
    isAdmin?: boolean
    userEmail?: string
    userName?: string
    directors?: { name: string; email: string; title?: string }[]
    officers?: { name: string; email: string; title?: string }[]
}

export default function CorporateDocuments({ isAdmin = false, userEmail = '', userName = '', directors = [], officers = [] }: Props) {
    const [documents, setDocuments] = useState<CorpDoc[]>([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('all')
    const [showUpload, setShowUpload] = useState(false)
    const [viewingDoc, setViewingDoc] = useState<CorpDoc | null>(null)
    const [commentText, setCommentText] = useState('')
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [numPages, setNumPages] = useState(0)
    const [pageNumber, setPageNumber] = useState(1)
    const [pdfScale, setPdfScale] = useState(1.2)
    const [form, setForm] = useState({
        title: '', description: '', category: 'other', department: '',
        file_url: '', file_name: '', file_size: 0, tags: '' as string,
        notify_recipients: [] as string[]
    })
    // Fill & Sign state
    const [signatureRequests, setSignatureRequests] = useState<Record<string, any>>({})
    const [fillSignDoc, setFillSignDoc] = useState<{ doc: CorpDoc; mode: 'prepare' | 'sign' | 'view'; request?: any } | null>(null)
    const [requiresSignatures, setRequiresSignatures] = useState(false)

    useEffect(() => { fetchDocuments(); fetchSignatureRequests() }, [category])

    async function fetchSignatureRequests() {
        try {
            const res = await fetch('/api/nexus/signatures')
            if (res.ok) {
                const data = await res.json()
                // Index by document_id
                const byDoc: Record<string, any> = {}
                for (const r of (data.requests || [])) {
                    if (!byDoc[r.document_id] || new Date(r.created_at) > new Date(byDoc[r.document_id].created_at)) {
                        byDoc[r.document_id] = r
                    }
                }
                setSignatureRequests(byDoc)
            }
        } catch (e) { console.error(e) }
    }

    async function fetchDocuments() {
        try {
            const res = await fetch(`/api/nexus/corporate-docs?category=${category}`)
            if (res.ok) {
                const data = await res.json()
                setDocuments(data.documents || [])
            }
        } catch (e) { console.error(e) }
        setLoading(false)
    }

    async function handleUpload() {
        if (!form.title) return
        setUploading(true)
        try {
            let fileUrl = form.file_url
            let fileName = form.file_name
            let fileSize = form.file_size

            // Upload file to S3 if a file is selected
            if (selectedFile) {
                const formData = new FormData()
                formData.append('file', selectedFile)
                formData.append('folder', 'nexus/corporate-docs')
                const uploadRes = await fetch('/api/nexus/upload', { method: 'POST', body: formData })
                if (!uploadRes.ok) throw new Error('Upload failed')
                const uploadData = await uploadRes.json()
                fileUrl = uploadData.key  // Store the S3 key, not the public URL
                fileName = uploadData.file_name
                fileSize = uploadData.file_size
            }

            const res = await fetch('/api/nexus/corporate-docs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    file_url: fileUrl,
                    file_name: fileName,
                    file_size: fileSize,
                    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                    uploaded_by: userEmail
                })
            })
            const resData = await res.json()

            setShowUpload(false)
            setSelectedFile(null)
            setForm({ title: '', description: '', category: 'other', department: '', file_url: '', file_name: '', file_size: 0, tags: '', notify_recipients: [] })
            fetchDocuments()

            // If signatures required, transition to FillAndSign after upload
            if (requiresSignatures && resData.id && fileUrl) {
                setRequiresSignatures(false)
                const newDoc: CorpDoc = {
                    id: resData.id,
                    title: form.title,
                    description: form.description,
                    category: form.category,
                    department: form.department,
                    file_url: fileUrl,
                    file_name: fileName,
                    file_size: fileSize,
                    uploaded_by: userEmail,
                    status: 'active',
                    version: 1,
                    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                    comments: [],
                    created_at: new Date().toISOString()
                }
                setFillSignDoc({ doc: newDoc, mode: 'prepare' })
            }
        } catch (e) { console.error(e) }
        setUploading(false)
    }

    async function handleComment() {
        if (!viewingDoc || !commentText.trim()) return
        try {
            await fetch('/api/nexus/corporate-docs', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: viewingDoc.id,
                    comment: { user_email: userEmail, user_name: userName, text: commentText }
                })
            })
            setViewingDoc(prev => prev ? {
                ...prev,
                comments: [...prev.comments, { user_email: userEmail, user_name: userName, text: commentText, created_at: new Date().toISOString() }]
            } : null)
            setCommentText('')
        } catch (e) { console.error(e) }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this document?')) return
        await fetch(`/api/nexus/corporate-docs?id=${id}`, { method: 'DELETE' })
        fetchDocuments()
        if (viewingDoc?.id === id) setViewingDoc(null)
    }

    function toggleRecipient(email: string) {
        setForm(f => ({
            ...f,
            notify_recipients: f.notify_recipients.includes(email)
                ? f.notify_recipients.filter(e => e !== email)
                : [...f.notify_recipients, email]
        }))
    }

    function formatSize(bytes: number) {
        if (!bytes) return '—'
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / 1048576).toFixed(1) + ' MB'
    }

    function timeAgo(d: string) {
        const diff = Date.now() - new Date(d).getTime()
        const m = Math.floor(diff / 60000)
        if (m < 60) return `${m}m ago`
        const h = Math.floor(m / 60)
        if (h < 24) return `${h}h ago`
        return `${Math.floor(h / 24)}d ago`
    }

    const catColor: Record<string, string> = {
        charter: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        bylaws: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
        agreement: 'text-red-400 bg-red-500/10 border-red-500/20',
        filing: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        policy: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
        resolution: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        financial: 'text-green-400 bg-green-500/10 border-green-500/20',
        other: 'text-white/40 bg-white/5 border-white/10'
    }

    // Combine all people for recipient picker
    const allPeople = [...directors, ...officers].filter((p, i, arr) => arr.findIndex(x => x.email === p.email) === i)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-rajdhani text-white tracking-wide">Corporate Documents</h2>
                    <p className="text-sm text-white/40 mt-1">Upload, view, and annotate corporate filings and agreements</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setShowUpload(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#F54029]/20 transition-all">
                        <Upload size={14} /> Upload Document
                    </button>
                )}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map(c => (
                    <button key={c.id} onClick={() => setCategory(c.id)}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${category === c.id ? 'bg-white/10 text-white border-white/20' : 'bg-white/[0.02] text-white/40 border-white/5 hover:text-white'}`}>
                        {c.label}
                    </button>
                ))}
            </div>

            {/* Document Grid */}
            {loading ? (
                <div className="py-16 text-center"><div className="w-6 h-6 border-2 border-[#F54029] border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : documents.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl">
                    <FileText className="mx-auto text-white/10 mb-4" size={48} />
                    <p className="text-white/40">No documents uploaded yet.</p>
                    {isAdmin && <p className="text-xs text-white/20 mt-2">Upload corporate filings, agreements, and policies.</p>}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map(doc => (
                        <div key={doc.id} className="group p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                    <FileText size={18} className="text-red-400" />
                                </div>
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${catColor[doc.category] || catColor.other}`}>
                                    {doc.category}
                                </span>
                            </div>
                            <h4 className="font-bold text-white text-sm mb-1 truncate">{doc.title}</h4>
                            {doc.description && <p className="text-xs text-white/30 line-clamp-2 mb-3">{doc.description}</p>}
                            <div className="flex items-center gap-3 text-[10px] text-white/20 mb-3">
                                <span>{formatSize(doc.file_size)}</span>
                                <span>v{doc.version}</span>
                                {doc.comments.length > 0 && (
                                    <span className="flex items-center gap-1"><MessageCircle size={10} />{doc.comments.length}</span>
                                )}
                            </div>
                            {/* Signature Status Badge */}
                            {(() => {
                                const sr = signatureRequests[doc.id]
                                if (!sr) return null
                                const signed = sr.signatories?.filter((s: any) => s.status === 'signed').length || 0
                                const total = sr.signatories?.length || 0
                                return (
                                    <div className={`flex items-center gap-2 p-2 rounded-lg border mb-3 text-[10px] font-bold ${sr.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'
                                        : sr.status === 'declined' ? 'bg-red-500/5 border-red-500/10 text-red-400'
                                            : sr.status === 'voided' ? 'bg-white/5 border-white/10 text-white/30'
                                                : 'bg-amber-500/5 border-amber-500/10 text-amber-400'
                                        }`}>
                                        {sr.status === 'completed' ? <CheckCircle size={12} /> : <Pen size={12} />}
                                        <span className="uppercase tracking-wider">
                                            {sr.status === 'completed' ? 'Signed' : sr.status === 'voided' ? 'Voided' : sr.status === 'declined' ? 'Declined' : `${signed}/${total} Signed`}
                                        </span>
                                    </div>
                                )
                            })()}
                            <div className="flex gap-2">
                                <button onClick={() => setViewingDoc(doc)}
                                    className="flex-1 py-2 bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#F54029]/20 transition-all flex items-center justify-center gap-1">
                                    <Eye size={12} /> View
                                </button>

                                {/* Sign Now — for ANY pending signatory (admin or not) */}
                                {doc.file_url && (() => {
                                    const sr = signatureRequests[doc.id]
                                    if (!sr) return null
                                    const mySig = sr.signatories?.find((s: any) => s.email === userEmail)
                                    if (mySig && (mySig.status === 'pending' || mySig.status === 'in_progress')) {
                                        return (
                                            <button onClick={() => setFillSignDoc({ doc, mode: 'sign', request: sr })}
                                                className="py-2 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-1 animate-pulse">
                                                <Pen size={12} /> Sign Now
                                            </button>
                                        )
                                    }
                                    // Show Track for admins who are NOT a pending signatory
                                    if (isAdmin && sr.status !== 'voided' && sr.status !== 'declined') {
                                        return (
                                            <button onClick={() => setFillSignDoc({ doc, mode: 'view', request: sr })}
                                                className="py-2 px-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold hover:bg-emerald-500/20 transition-all flex items-center gap-1">
                                                <Pen size={12} /> Track
                                            </button>
                                        )
                                    }
                                    return null
                                })()}
                                {isAdmin && (
                                    <button onClick={() => handleDelete(doc.id)}
                                        className="py-2 px-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-[10px] hover:bg-red-500/20 transition-all">
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PDF Viewer Modal */}
            {viewingDoc && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex animate-fadeIn" onClick={() => setViewingDoc(null)}>
                    <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] mx-auto p-4 gap-4" onClick={e => e.stopPropagation()}>
                        {/* PDF Viewer */}
                        <div className="flex-1 flex flex-col bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                                <div>
                                    <h3 className="text-sm font-bold text-white">{viewingDoc.title}</h3>
                                    <p className="text-[10px] text-white/30 mt-0.5">{viewingDoc.file_name} • {formatSize(viewingDoc.file_size)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Page Navigation */}
                                    {numPages > 1 && (
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}
                                                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition-all">
                                                <ChevronLeft size={14} />
                                            </button>
                                            <span className="text-[10px] text-white/40 font-mono min-w-[60px] text-center">{pageNumber} / {numPages}</span>
                                            <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages}
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
                                    <button onClick={() => setViewingDoc(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-auto bg-[#1a1a1a]">
                                {viewingDoc.file_url ? (
                                    <div className="flex justify-center py-6 min-h-[60vh]">
                                        <Document
                                            file={`/api/nexus/pdf-proxy?key=${encodeURIComponent(viewingDoc.file_url)}`}
                                            onLoadSuccess={({ numPages: n }) => { setNumPages(n); setPageNumber(1) }}
                                            loading={
                                                <div className="flex items-center justify-center min-h-[60vh]">
                                                    <div className="text-center">
                                                        <Loader2 className="mx-auto text-[#F54029] animate-spin mb-3" size={32} />
                                                        <p className="text-xs text-white/30">Loading PDF...</p>
                                                    </div>
                                                </div>
                                            }
                                            error={
                                                <div className="flex items-center justify-center min-h-[60vh]">
                                                    <div className="text-center">
                                                        <FileText className="mx-auto text-red-400/40 mb-3" size={48} />
                                                        <p className="text-xs text-red-400/60">Failed to load PDF</p>
                                                        <a href={viewingDoc.file_url} target="_blank" rel="noopener noreferrer"
                                                            className="text-[10px] text-[#F54029] hover:underline mt-2 block">Open in new tab →</a>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <Page
                                                pageNumber={pageNumber}
                                                scale={pdfScale}
                                                renderTextLayer={true}
                                                renderAnnotationLayer={true}
                                            />
                                        </Document>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full min-h-[60vh]">
                                        <div className="text-center">
                                            <FileText className="mx-auto text-white/10 mb-3" size={48} />
                                            <p className="text-xs text-white/30">No PDF file attached</p>
                                            <p className="text-[10px] text-white/20 mt-1">Upload a PDF URL when creating the document</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comment Sidebar */}
                        <div className="w-full md:w-96 bg-[#0A0A0A] border border-white/10 rounded-2xl flex flex-col">
                            <div className="px-5 py-3 border-b border-white/5">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <MessageCircle size={14} /> Comments ({viewingDoc.comments.length})
                                </h4>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh] md:max-h-none">
                                {viewingDoc.comments.length === 0 && (
                                    <div className="text-center py-8">
                                        <MessageCircle className="mx-auto text-white/10 mb-2" size={24} />
                                        <p className="text-[10px] text-white/30">No comments yet</p>
                                    </div>
                                )}
                                {viewingDoc.comments.map((c, i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-white">{c.user_name || c.user_email}</span>
                                            <span className="text-[10px] text-white/20">{timeAgo(c.created_at)}</span>
                                        </div>
                                        <p className="text-xs text-white/60 leading-relaxed">{c.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/5 p-4">
                                <div className="flex gap-2">
                                    <input
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') handleComment() }}
                                        placeholder="Add a comment..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-[#F54029] placeholder:text-white/20"
                                    />
                                    <button onClick={handleComment}
                                        className="w-10 h-10 bg-[#F54029]/10 border border-[#F54029]/20 rounded-xl flex items-center justify-center text-[#F54029] hover:bg-[#F54029]/20 transition-all">
                                        <Send size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setShowUpload(false)}>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-rajdhani text-white">Upload Corporate Document</h3>
                            <button onClick={() => setShowUpload(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Title *</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="e.g. Certificate of Incorporation" />
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Description</label>
                                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029] h-20 resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Category</label>
                                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" style={{ colorScheme: 'dark' }}>
                                        <option value="charter" className="bg-[#111] text-white">Charter</option>
                                        <option value="bylaws" className="bg-[#111] text-white">Bylaws</option>
                                        <option value="agreement" className="bg-[#111] text-white">Agreement</option>
                                        <option value="filing" className="bg-[#111] text-white">Filing</option>
                                        <option value="policy" className="bg-[#111] text-white">Policy</option>
                                        <option value="resolution" className="bg-[#111] text-white">Resolution</option>
                                        <option value="financial" className="bg-[#111] text-white">Financial</option>
                                        <option value="other" className="bg-[#111] text-white">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Department</label>
                                    <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="e.g. Legal" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">PDF File *</label>
                                <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
                                    onChange={e => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setSelectedFile(file)
                                            setForm(f => ({ ...f, file_name: file.name, file_size: file.size }))
                                        }
                                    }} />
                                <button onClick={() => fileInputRef.current?.click()}
                                    className={`w-full border-2 border-dashed rounded-xl p-6 text-center transition-all ${selectedFile ? 'border-[#F54029]/30 bg-[#F54029]/5' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'}`}>
                                    {selectedFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <FileText size={20} className="text-[#F54029]" />
                                            <div className="text-left">
                                                <p className="text-sm text-white font-bold">{selectedFile.name}</p>
                                                <p className="text-[10px] text-white/30">{formatSize(selectedFile.size)}</p>
                                            </div>
                                            <X size={14} className="text-white/30 hover:text-white ml-2" onClick={e => { e.stopPropagation(); setSelectedFile(null) }} />
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="mx-auto text-white/20 mb-2" size={24} />
                                            <p className="text-xs text-white/40">Click to select a PDF file</p>
                                            <p className="text-[10px] text-white/20 mt-1">Max 50MB</p>
                                        </div>
                                    )}
                                </button>
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Tags (comma-separated)</label>
                                <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="e.g. delaware, incorporation, 2025" />
                            </div>

                            {/* Notify Recipients */}
                            {allPeople.length > 0 && (
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">Notify Directors & Officers</label>
                                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                        {allPeople.map(p => (
                                            <button key={p.email} onClick={() => toggleRecipient(p.email)}
                                                className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${form.notify_recipients.includes(p.email)
                                                    ? 'bg-[#F54029]/10 border-[#F54029]/30 text-[#F54029]'
                                                    : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}>
                                                {p.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Requires Signatures Toggle */}
                            <div className="flex items-center gap-3 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="requiresSignatures"
                                    checked={requiresSignatures}
                                    onChange={e => setRequiresSignatures(e.target.checked)}
                                    className="accent-emerald-500 w-4 h-4"
                                />
                                <label htmlFor="requiresSignatures" className="flex-1 cursor-pointer">
                                    <span className="text-xs text-white/70 font-bold">Requires Signatures</span>
                                    <p className="text-[10px] text-white/30 mt-0.5">After uploading, you'll be prompted to place signature fields and assign signatories</p>
                                </label>
                                <Pen size={16} className="text-emerald-400/40" />
                            </div>

                            <button onClick={handleUpload} disabled={!form.title || (!selectedFile && !form.file_url) || uploading}
                                className="w-full py-3 bg-[#F54029] text-white font-bold rounded-xl uppercase tracking-wider text-xs hover:bg-[#C53020] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {uploading ? <><Loader2 size={14} className="animate-spin" /> Uploading...</> : requiresSignatures ? 'Upload & Set Up Signatures' : 'Upload Document'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Fill & Sign Full-Screen Modal */}
            {fillSignDoc && (
                <FillAndSign
                    mode={fillSignDoc.mode}
                    fileUrl={fillSignDoc.doc.file_url}
                    documentId={fillSignDoc.doc.id}
                    documentTitle={fillSignDoc.doc.title}
                    userEmail={userEmail}
                    userName={userName}
                    directors={directors.map(d => ({ name: d.name, email: d.email, title: d.title || 'Director' }))}
                    officers={officers.map(o => ({ name: o.name, email: o.email, title: o.title || 'Officer' }))}
                    existingRequest={fillSignDoc.request || null}
                    onClose={() => setFillSignDoc(null)}
                    onComplete={() => { fetchSignatureRequests(); fetchDocuments() }}
                />
            )}
        </div>
    )
}
