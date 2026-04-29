'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import {
    X, Pen, Type, Calendar, CheckSquare, Hash, Plus, Trash2,
    Send, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
    Clock, CheckCircle, XCircle, RefreshCw,
    Shield, Loader2, GripVertical, MousePointer2
} from 'lucide-react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import SignatureCapture from './SignatureCapture'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

/* ────────────── Types ────────────── */

interface PlacedField {
    field_id: string
    type: 'signature' | 'initials' | 'date' | 'text' | 'checkbox'
    label: string
    page: number
    x: number; y: number; width: number; height: number
    assigned_to: string
    required: boolean
    value: string
    filled_at?: string
}

interface Signatory {
    email: string
    name: string
    capacity: string
    color: string
    status: string
    signature_data?: string
    initials_data?: string
    signed_at?: string
    declined_at?: string
    decline_reason?: string
    ip_address?: string
}

interface AuditEntry {
    action: string
    actor_email: string
    actor_name: string
    timestamp: string
    ip_address: string
    details: string
}

interface SigRequest {
    id: string
    document_id: string
    document_title: string
    status: string
    requested_by: { email: string; name: string }
    fields: PlacedField[]
    signatories: Signatory[]
    audit_trail: AuditEntry[]
    message?: string
    completed_at?: string
    created_at: string
}

interface FillAndSignProps {
    mode: 'prepare' | 'sign' | 'view'
    fileUrl: string
    documentId: string
    documentTitle: string
    userEmail: string
    userName: string
    directors?: { name: string; email: string; title: string }[]
    officers?: { name: string; email: string; title: string }[]
    existingRequest?: SigRequest | null
    onClose: () => void
    onComplete?: () => void
}

/* ────────────── Constants ────────────── */

const FIELD_TYPES = [
    { type: 'signature', label: 'Signature', icon: Pen, w: 22, h: 6 },
    { type: 'initials', label: 'Initials', icon: Type, w: 10, h: 5 },
    { type: 'date', label: 'Date', icon: Calendar, w: 18, h: 4 },
    { type: 'text', label: 'Text', icon: Hash, w: 22, h: 4 },
    { type: 'checkbox', label: 'Check', icon: CheckSquare, w: 4, h: 4 },
]

const SIGNER_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']

const PDF_WIDTH = 700

let _nextId = 1

/* ────────────── Component ────────────── */

export default function FillAndSign({
    mode, fileUrl, documentId, documentTitle, userEmail, userName,
    directors = [], officers = [], existingRequest, onClose, onComplete
}: FillAndSignProps) {
    // Core state
    const [numPages, setNumPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [scale, setScale] = useState(1.0)
    const [fields, setFields] = useState<PlacedField[]>(existingRequest?.fields || [])
    const [signatories, setSignatories] = useState<Signatory[]>(existingRequest?.signatories || [])
    const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(existingRequest?.audit_trail || [])
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)
    const [showSignatureCapture, setShowSignatureCapture] = useState(false)
    const [signingFieldId, setSigningFieldId] = useState<string | null>(null)
    const [status, setStatus] = useState(existingRequest?.status || 'draft')
    const [requestId, setRequestId] = useState(existingRequest?.id || '')
    const [showAuditTrail, setShowAuditTrail] = useState(false)
    const [showSignatoryPicker, setShowSignatoryPicker] = useState(false)
    const [addressFieldId, setAddressFieldId] = useState<string | null>(null)
    const [textFieldId, setTextFieldId] = useState<string | null>(null)

    // Refetch latest data on mount for sign/view modes (snapshot from card may be stale)
    useEffect(() => {
        if ((mode === 'sign' || mode === 'view') && requestId) {
            fetch(`/api/nexus/signatures?id=${requestId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.request) {
                        setSignatories(data.request.signatories || [])
                        setFields(data.request.fields || [])
                        setAuditTrail(data.request.audit_trail || [])
                        setStatus(data.request.status)
                    }
                })
                .catch(console.error)
        }
    }, [mode, requestId])

    // Prepare mode: which signatory is active, which field type to place
    const [activeSignatoryEmail, setActiveSignatoryEmail] = useState<string>('')
    const [placingFieldType, setPlacingFieldType] = useState<string | null>(null)

    // Dragging
    const [draggingField, setDraggingField] = useState<string | null>(null)
    const dragStart = useRef<{ x: number; y: number; fx: number; fy: number } | null>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    // People
    const allPeople = [
        ...directors.map(d => ({ ...d, role: 'Director' })),
        ...officers.map(o => ({ ...o, role: 'Officer' }))
    ]
    const uniquePeople = allPeople.filter((p, i, arr) => arr.findIndex(q => q.email === p.email) === i)

    // Active signatory color
    const activeSignatory = signatories.find(s => s.email === activeSignatoryEmail)
    const activeColor = activeSignatory?.color || '#666'

    /* ── Prepare: Place a field on click ── */
    const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (mode !== 'prepare' || !placingFieldType || !activeSignatoryEmail) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        const tmpl = FIELD_TYPES.find(ft => ft.type === placingFieldType)!
        const id = `f_${Date.now()}_${_nextId++}`
        const newField: PlacedField = {
            field_id: id,
            type: placingFieldType as PlacedField['type'],
            label: tmpl.label,
            page: currentPage,
            x: Math.max(0, Math.min(100 - tmpl.w, x - tmpl.w / 2)),
            y: Math.max(0, Math.min(100 - tmpl.h, y - tmpl.h / 2)),
            width: tmpl.w,
            height: tmpl.h,
            assigned_to: activeSignatoryEmail,
            required: true,
            value: ''
        }
        setFields(prev => [...prev, newField])
        setSelectedFieldId(id)
    }, [mode, placingFieldType, activeSignatoryEmail, currentPage])

    /* ── Drag field ── */
    const onFieldMouseDown = (e: React.MouseEvent, fieldId: string) => {
        if (mode !== 'prepare') return
        e.stopPropagation()
        e.preventDefault()
        const field = fields.find(f => f.field_id === fieldId)
        if (!field) return
        setDraggingField(fieldId)
        setSelectedFieldId(fieldId)
        dragStart.current = { x: e.clientX, y: e.clientY, fx: field.x, fy: field.y }
        const onMove = (ev: MouseEvent) => {
            if (!dragStart.current || !overlayRef.current) return
            const rect = overlayRef.current.getBoundingClientRect()
            const dx = ((ev.clientX - dragStart.current.x) / rect.width) * 100
            const dy = ((ev.clientY - dragStart.current.y) / rect.height) * 100
            setFields(prev => prev.map(f =>
                f.field_id === fieldId
                    ? { ...f, x: Math.max(0, Math.min(100 - f.width, dragStart.current!.fx + dx)), y: Math.max(0, Math.min(100 - f.height, dragStart.current!.fy + dy)) }
                    : f
            ))
        }
        const onUp = () => {
            setDraggingField(null)
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }

    /* ── Field helpers ── */
    const updateField = (fieldId: string, updates: Partial<PlacedField>) => {
        setFields(prev => prev.map(f => f.field_id === fieldId ? { ...f, ...updates } : f))
    }
    const deleteField = (fieldId: string) => {
        setFields(prev => prev.filter(f => f.field_id !== fieldId))
        if (selectedFieldId === fieldId) setSelectedFieldId(null)
    }

    /* ── Signatory management ── */
    const addSignatory = (email: string, name: string, title: string) => {
        if (signatories.find(s => s.email === email)) return
        const color = SIGNER_COLORS[signatories.length % SIGNER_COLORS.length]
        setSignatories(prev => [...prev, { email, name, capacity: title, color, status: 'pending' }])
        if (!activeSignatoryEmail) setActiveSignatoryEmail(email)
    }
    const removeSignatory = (email: string) => {
        setSignatories(prev => prev.filter(s => s.email !== email))
        setFields(prev => prev.filter(f => f.assigned_to !== email))
        if (activeSignatoryEmail === email) {
            setActiveSignatoryEmail(signatories.find(s => s.email !== email)?.email || '')
        }
    }

    /* ── Send for signing ── */
    const sendForSigning = async () => {
        if (fields.length === 0 || signatories.length === 0) return
        setSending(true)
        try {
            const payload = {
                document_id: documentId,
                document_title: documentTitle,
                requested_by: { email: userEmail, name: userName },
                signatories: signatories.map(s => ({ email: s.email, name: s.name, capacity: s.capacity, color: s.color, order: 0 })),
                fields: fields.map(f => ({ field_id: f.field_id, type: f.type, label: f.label, page: f.page, x: f.x, y: f.y, width: f.width, height: f.height, assigned_to: f.assigned_to, required: f.required, value: f.value || '' })),
                message
            }
            console.log('[FillAndSign] Sending signature request:', payload)
            const res = await fetch('/api/nexus/signatures', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            console.log('[FillAndSign] Response:', data)
            if (data.success) {
                setRequestId(data.id)
                setStatus('pending')
                onComplete?.()
                onClose()
            } else {
                console.error('[FillAndSign] Error:', data.error)
                alert(`Failed to send: ${data.error || 'Unknown error'}`)
            }
        } catch (e) { console.error(e) }
        setSending(false)
    }

    /* ── Sign Mode: Fill a field ── */
    const fillField = async (fieldId: string, value: string) => {
        if (!requestId) return
        setFields(prev => prev.map(f => f.field_id === fieldId ? { ...f, value, filled_at: new Date().toISOString() } : f))
        try {
            await fetch('/api/nexus/signatures', {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: requestId, action: 'fill_field', field_id: fieldId, value, actor_email: userEmail, actor_name: userName })
            })
        } catch (e) { console.error(e) }
    }

    /* ── Sign Mode: Submit signature ── */
    const submitSignature = async (sigData: { signature: string; initials: string }) => {
        if (!requestId) return
        setShowSignatureCapture(false)
        try {
            const res = await fetch('/api/nexus/signatures', {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: requestId, action: 'sign', actor_email: userEmail, actor_name: userName, signature_data: sigData.signature, initials_data: sigData.initials })
            })
            const data = await res.json()
            if (data.success && data.request) {
                // Sync full state from server response
                setSignatories(data.request.signatories || [])
                setFields(data.request.fields || [])
                setAuditTrail(data.request.audit_trail || [])
                setStatus(data.request.status)
            } else {
                // Fallback to local update
                setSignatories(prev => prev.map(s => s.email === userEmail ? { ...s, status: 'signed', signature_data: sigData.signature, signed_at: new Date().toISOString() } : s))
                setFields(prev => prev.map(f => {
                    if (f.assigned_to === userEmail && !f.value) {
                        if (f.type === 'signature') return { ...f, value: sigData.signature, filled_at: new Date().toISOString() }
                        if (f.type === 'initials') return { ...f, value: sigData.initials, filled_at: new Date().toISOString() }
                    }
                    return f
                }))
                if (data.completed) setStatus('completed')
                else setStatus('in_progress')
            }
            onComplete?.()
        } catch (e) { console.error(e) }
    }

    const handleDecline = async () => {
        const reason = prompt('Please provide a reason for declining:')
        if (!reason) return
        try {
            await fetch('/api/nexus/signatures', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: requestId, action: 'decline', actor_email: userEmail, actor_name: userName, reason }) })
            setStatus('declined'); onComplete?.()
        } catch (e) { console.error(e) }
    }

    const handleVoid = async () => {
        if (!confirm('Void this signature request? This cannot be undone.')) return
        try {
            await fetch('/api/nexus/signatures', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: requestId, action: 'void', actor_email: userEmail, actor_name: userName }) })
            setStatus('voided'); onComplete?.()
        } catch (e) { console.error(e) }
    }

    const handleRemind = async () => {
        try {
            await fetch('/api/nexus/signatures', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: requestId, action: 'remind', actor_email: userEmail, actor_name: userName }) })
            alert('Reminder sent to pending signatories.')
        } catch (e) { console.error(e) }
    }

    /* ── Derived ── */
    const getSignerColor = (email: string) => signatories.find(s => s.email === email)?.color || '#666'
    const getSignerName = (email: string) => signatories.find(s => s.email === email)?.name || email
    const myFields = fields.filter(f => f.assigned_to === userEmail)
    const myFilledCount = myFields.filter(f => f.value).length
    const myRequiredFields = myFields.filter(f => f.required !== false)
    const myIncompleteFields = myRequiredFields.filter(f => !f.value)
    const isAllComplete = myIncompleteFields.length === 0
    const mySignatory = signatories.find(s => s.email === userEmail)
    const currentPageFields = fields.filter(f => f.page === currentPage)
    const signedCount = signatories.filter(s => s.status === 'signed').length
    const totalSignatories = signatories.length
    const selectedField = fields.find(f => f.field_id === selectedFieldId)

    const isPlacing = mode === 'prepare' && !!placingFieldType && !!activeSignatoryEmail

    return (
        <div className="fixed inset-0 z-[9990] bg-[#060610] flex flex-col">
            {/* ═══════ TOP BAR ═══════ */}
            <div className="h-14 bg-[#0a0a14] border-b border-white/5 flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="text-white/30 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"><X size={18} /></button>
                    <div>
                        <h1 className="text-sm font-bold text-white font-rajdhani truncate max-w-[300px]">{documentTitle}</h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">
                            {mode === 'prepare' ? 'Prepare for Signing' : mode === 'sign' ? 'Fill & Sign' : 'View Signatures'}
                            {status !== 'draft' && <span className="ml-2 text-[#F54029]">• {status.replace('_', ' ')}</span>}
                        </p>
                    </div>
                </div>

                {/* Page & Zoom */}
                <div className="flex items-center gap-3">
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="text-white/30 hover:text-white p-1.5 rounded hover:bg-white/5"><ZoomOut size={16} /></button>
                    <span className="text-xs text-white/40 w-12 text-center">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="text-white/30 hover:text-white p-1.5 rounded hover:bg-white/5"><ZoomIn size={16} /></button>
                    <div className="w-px h-6 bg-white/10" />
                    <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="text-white/30 hover:text-white p-1.5 rounded hover:bg-white/5 disabled:opacity-20"><ChevronLeft size={16} /></button>
                    <span className="text-xs text-white/50 min-w-[60px] text-center">{currentPage} / {numPages || '?'}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages} className="text-white/30 hover:text-white p-1.5 rounded hover:bg-white/5 disabled:opacity-20"><ChevronRight size={16} /></button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {mode === 'prepare' && status === 'draft' && (
                        <button onClick={sendForSigning} disabled={sending || fields.length === 0 || signatories.length === 0}
                            className="px-5 py-2 bg-[#F54029] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#F54029]/80 disabled:opacity-30 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(17,157,255,0.3)]">
                            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Send for Signing
                        </button>
                    )}
                    {mode === 'sign' && mySignatory?.status !== 'signed' && mySignatory?.status !== 'declined' && (
                        <>
                            {isAllComplete ? (
                                <button onClick={() => {
                                    const sigField = myFields.find(f => f.type === 'signature' && f.value)
                                    const initField = myFields.find(f => f.type === 'initials' && f.value)
                                    if (sigField) {
                                        submitSignature({ signature: sigField.value, initials: initField?.value || '' })
                                    } else {
                                        setShowSignatureCapture(true)
                                    }
                                }}
                                    className="px-5 py-2 bg-[#F54029] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#F54029]/80 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(17,157,255,0.3)]">
                                    <CheckCircle size={14} /> Confirm & Save
                                </button>
                            ) : (
                                <div className="px-5 py-2 bg-emerald-600/10 text-emerald-500/50 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-not-allowed">
                                    <Pen size={14} /> {myIncompleteFields.length} Required Field{myIncompleteFields.length !== 1 ? 's' : ''} Left
                                </div>
                            )}
                            <button onClick={handleDecline} className="px-4 py-2 text-red-400/60 hover:text-red-400 text-xs font-bold uppercase tracking-wider transition-all">Decline</button>
                        </>
                    )}
                    {mode === 'sign' && (mySignatory?.status === 'signed' || mySignatory?.status === 'declined') && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-emerald-400/70 flex items-center gap-1.5">
                                <CheckCircle size={14} /> {mySignatory?.status === 'signed' ? 'Signature recorded' : 'Declined'}
                            </span>
                            <button onClick={onClose}
                                className="px-5 py-2 bg-[#F54029] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#F54029]/80 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(17,157,255,0.3)]">
                                <CheckCircle size={14} /> Done
                            </button>
                        </div>
                    )}
                    {(mode === 'view' || mode === 'prepare') && requestId && !['completed', 'voided', 'declined'].includes(status) && (
                        <>
                            <button onClick={handleRemind} className="px-3 py-2 text-white/30 hover:text-[#F54029] text-xs transition-all flex items-center gap-1.5"><RefreshCw size={14} /> Remind</button>
                            <button onClick={handleVoid} className="px-3 py-2 text-white/30 hover:text-red-400 text-xs transition-all flex items-center gap-1.5"><XCircle size={14} /> Void</button>
                        </>
                    )}
                </div>
            </div>

            {/* ═══════ MAIN CONTENT ═══════ */}
            <div className="flex-1 flex overflow-hidden">

                {/* ── LEFT PANEL ── */}
                <div className="w-72 bg-[#0a0a14] border-r border-white/5 flex flex-col shrink-0 overflow-hidden">
                    {mode === 'prepare' && (
                        <>
                            {/* Step 1: Signatories */}
                            <div className="p-4 border-b border-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[10px] text-white/30 uppercase tracking-widest font-bold">① Signatories</h3>
                                    <button onClick={() => setShowSignatoryPicker(true)} className="text-[10px] text-[#F54029]/60 hover:text-[#F54029] flex items-center gap-1 transition-all">
                                        <Plus size={10} /> Add
                                    </button>
                                </div>
                                {signatories.length === 0 ? (
                                    <button onClick={() => setShowSignatoryPicker(true)}
                                        className="w-full p-3 border-2 border-dashed border-white/10 rounded-xl text-xs text-white/30 hover:text-white/50 hover:border-white/20 transition-all">
                                        + Add signatories to get started
                                    </button>
                                ) : (
                                    <div className="space-y-1.5">
                                        {signatories.map(s => {
                                            const isActive = activeSignatoryEmail === s.email
                                            const fieldCount = fields.filter(f => f.assigned_to === s.email).length
                                            return (
                                                <div key={s.email}
                                                    onClick={() => setActiveSignatoryEmail(s.email)}
                                                    className={`w-full flex items-center gap-2 p-2.5 rounded-lg border transition-all text-left group cursor-pointer ${isActive
                                                        ? 'border-white/20 bg-white/[0.05]'
                                                        : 'border-white/5 bg-white/[0.02] hover:border-white/10'
                                                        }`}>
                                                    <div className="w-4 h-4 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: s.color }}>
                                                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-white/70 font-bold truncate">{s.name}</p>
                                                        <p className="text-[9px] text-white/25 truncate">{s.capacity} • {fieldCount} field{fieldCount !== 1 ? 's' : ''}</p>
                                                    </div>
                                                    <button onClick={(e) => { e.stopPropagation(); removeSignatory(s.email) }}
                                                        className="text-white/10 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Step 2: Field Type (only visible when a signatory is selected) */}
                            {activeSignatoryEmail && (
                                <div className="p-4 border-b border-white/5">
                                    <h3 className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-3">
                                        ② Place Fields
                                        <span className="ml-1 text-[9px] normal-case" style={{ color: activeColor }}>for {activeSignatory?.name?.split(' ')[0]}</span>
                                    </h3>
                                    <div className="grid grid-cols-3 gap-1.5">
                                        {FIELD_TYPES.map(ft => {
                                            const Icon = ft.icon
                                            const active = placingFieldType === ft.type
                                            return (
                                                <button key={ft.type} onClick={() => setPlacingFieldType(active ? null : ft.type)}
                                                    className={`p-2.5 rounded-lg border text-[9px] font-bold flex flex-col items-center gap-1 transition-all ${active
                                                        ? 'border-2'
                                                        : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:border-white/10'
                                                        }`}
                                                    style={active ? { borderColor: activeColor, color: activeColor, backgroundColor: activeColor + '15' } : undefined}>
                                                    <Icon size={16} />
                                                    <span className="uppercase tracking-wider">{ft.label}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                    {placingFieldType && (
                                        <div className="mt-3 p-2 rounded-lg text-center text-[10px] font-bold animate-pulse flex items-center justify-center gap-2" style={{ backgroundColor: activeColor + '15', color: activeColor }}>
                                            <MousePointer2 size={12} /> Click on the document to place
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Selected Field Properties */}
                            {selectedField && (
                                <div className="p-4 border-b border-white/5 bg-white/[0.01]">
                                    <h3 className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-3">Field Properties</h3>
                                    <div className="space-y-2.5">
                                        <div>
                                            <label className="text-[9px] text-white/20 uppercase tracking-widest block mb-1">Label</label>
                                            <input value={selectedField.label} onChange={e => updateField(selectedField.field_id, { label: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#F54029]/40" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] text-white/20 uppercase tracking-widest block mb-1">Assign To</label>
                                            <select value={selectedField.assigned_to} onChange={e => updateField(selectedField.field_id, { assigned_to: e.target.value })}
                                                className="w-full bg-[#111] border border-white/10 rounded px-2.5 py-1.5 text-xs text-white outline-none" style={{ colorScheme: 'dark' }}>
                                                {signatories.map(s => <option key={s.email} value={s.email} className="bg-[#111]">{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" checked={selectedField.required} onChange={e => updateField(selectedField.field_id, { required: e.target.checked })} className="accent-[#F54029]" />
                                            <span className="text-[10px] text-white/40">Required</span>
                                        </div>
                                        <button onClick={() => deleteField(selectedField.field_id)}
                                            className="w-full text-[10px] text-red-400/40 hover:text-red-400 py-1.5 border border-red-500/10 rounded hover:border-red-500/20 transition-all flex items-center justify-center gap-1">
                                            <Trash2 size={10} /> Remove Field
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Summary (bottom) */}
                            <div className="p-4 mt-auto">
                                <div className="p-3 bg-white/[0.02] border border-white/5 rounded-lg space-y-2 text-xs">
                                    <div className="flex justify-between"><span className="text-white/30">Fields</span><span className="text-white/60">{fields.length}</span></div>
                                    <div className="flex justify-between"><span className="text-white/30">Signatories</span><span className="text-white/60">{signatories.length}</span></div>
                                    <div className="flex justify-between"><span className="text-white/30">Pages</span><span className="text-white/60">{numPages}</span></div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Sign/View Mode */}
                    {(mode === 'sign' || mode === 'view') && (
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            {/* Progress */}
                            <div className="p-4 border-b border-white/5">
                                <h3 className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-3">Signing Progress</h3>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${totalSignatories ? (signedCount / totalSignatories) * 100 : 0}%` }} />
                                    </div>
                                    <span className="text-xs text-white/40 font-mono">{signedCount}/{totalSignatories}</span>
                                </div>
                            </div>

                            {/* Signatories */}
                            <div className="p-4 border-b border-white/5">
                                <h3 className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-3">Signatories</h3>
                                <div className="space-y-2">
                                    {signatories.map(s => (
                                        <div key={s.email} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                                                <span className="text-xs text-white/70 font-bold flex-1 truncate">{s.name}</span>
                                                {s.status === 'signed' && <CheckCircle size={14} className="text-emerald-400" />}
                                                {s.status === 'pending' && <Clock size={14} className="text-amber-400/40" />}
                                                {s.status === 'declined' && <XCircle size={14} className="text-red-400" />}
                                            </div>
                                            {s.signature_data && (
                                                <div className="mt-2 bg-white rounded p-1.5 inline-block"><img src={s.signature_data} alt="Sig" className="h-8 object-contain" /></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* My Fields */}
                            {mode === 'sign' && mySignatory && mySignatory.status !== 'signed' && (
                                <div className="p-4 border-b border-white/5">
                                    <h3 className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-3">Your Fields ({myFilledCount}/{myFields.length})</h3>
                                    <div className="space-y-1.5">
                                        {myFields.map(f => (
                                            <button key={f.field_id} onClick={() => { setCurrentPage(f.page); setSelectedFieldId(f.field_id) }}
                                                className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2 transition-all ${f.value ? 'bg-emerald-500/5 text-emerald-400/60' : 'bg-white/[0.02] text-white/40 hover:text-white'}`}>
                                                {f.value ? <CheckCircle size={12} /> : <div className="w-3 h-3 rounded border border-white/20" />}
                                                <span>{f.label || f.type} (p.{f.page})</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Audit Trail */}
                            <div className="p-4">
                                <button onClick={() => setShowAuditTrail(!showAuditTrail)} className="w-full text-[10px] text-white/20 hover:text-white/40 uppercase tracking-widest font-bold flex items-center justify-between py-2 transition-all">
                                    <span>Audit Trail ({auditTrail.length})</span><Shield size={12} />
                                </button>
                                {showAuditTrail && (
                                    <div className="mt-3 space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                                        {auditTrail.map((entry, i) => (
                                            <div key={i} className="p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] text-white/50 font-bold capitalize">{entry.action.replace('_', ' ')}</span>
                                                    <span className="text-[9px] text-white/15 font-mono">{new Date(entry.timestamp).toLocaleString()}</span>
                                                </div>
                                                <p className="text-[9px] text-white/25 mt-1">{entry.details}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── CENTER: PDF + Field Overlay ── */}
                <div className="flex-1 overflow-auto bg-[#1a1a2e]/30 flex justify-center py-8">
                    <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
                        {/* The key trick: PDF and overlay are siblings inside a relative wrapper */}
                        <div className="relative inline-block" style={{ width: PDF_WIDTH }}>
                            {/* PDF Canvas */}
                            <Document
                                file={`/api/nexus/pdf-proxy?key=${encodeURIComponent(fileUrl)}`}
                                onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
                                loading={<div className="flex items-center gap-3 text-white/30 py-40"><Loader2 size={20} className="animate-spin" /> Loading document...</div>}
                            >
                                <Page pageNumber={currentPage} width={PDF_WIDTH} renderTextLayer={false} renderAnnotationLayer={false} />
                            </Document>

                            {/* Click-to-place overlay — sits on top of the PDF canvas */}
                            <div
                                ref={overlayRef}
                                className="absolute inset-0"
                                style={{
                                    zIndex: 5,
                                    cursor: isPlacing ? 'crosshair' : 'default',
                                    pointerEvents: isPlacing ? 'auto' : 'none'
                                }}
                                onClick={handleOverlayClick}
                            />

                            {/* ── Field boxes on top ── */}
                            {currentPageFields.map(field => {
                                const isSelected = selectedFieldId === field.field_id
                                const color = getSignerColor(field.assigned_to)
                                const isMine = field.assigned_to === userEmail
                                const isInteractive = mode === 'sign' && isMine && mySignatory?.status !== 'signed'

                                return (
                                    <div
                                        key={field.field_id}
                                        className={`absolute rounded-[4px] flex items-center justify-center transition-shadow cursor-pointer group`}
                                        style={{
                                            left: `${field.x}%`,
                                            top: `${field.y}%`,
                                            width: `${field.width}%`,
                                            height: `${field.height}%`,
                                            zIndex: isSelected ? 20 : 10,
                                            border: `2px solid ${field.value ? '#10b981' : color}`,
                                            backgroundColor: field.value ? '#10b98110' : color + '20',
                                            boxShadow: isSelected ? `0 0 0 2px white, 0 0 16px ${color}40` : `0 1px 4px ${color}30`,
                                            minHeight: 24,
                                            minWidth: 36,
                                            pointerEvents: 'auto',
                                        }}
                                        onMouseDown={e => onFieldMouseDown(e, field.field_id)}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            if (mode === 'prepare') {
                                                setSelectedFieldId(field.field_id)
                                                setActiveSignatoryEmail(field.assigned_to)
                                            } else if (isInteractive) {
                                                if (field.type === 'signature' || field.type === 'initials') {
                                                    setSigningFieldId(field.field_id)
                                                    setShowSignatureCapture(true)
                                                } else if (field.type === 'date') {
                                                    fillField(field.field_id, new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }))
                                                } else if (field.type === 'checkbox') {
                                                    fillField(field.field_id, field.value === 'true' ? 'false' : 'true')
                                                } else if (field.type === 'text') {
                                                    const label = field.label?.toLowerCase() || '';
                                                    if (label.includes('address') && !label.includes('email')) {
                                                        setAddressFieldId(field.field_id)
                                                    } else {
                                                        setTextFieldId(field.field_id)
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        {field.value ? (
                                            field.type === 'signature' || field.type === 'initials' ? (
                                                <img src={field.value} alt={field.type} className="w-full h-full object-contain p-0.5" />
                                            ) : field.type === 'checkbox' ? (
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${field.value === 'true' ? 'bg-emerald-500 border-emerald-500' : 'border-gray-400'}`}>
                                                    {field.value === 'true' && <CheckSquare size={14} className="text-white" />}
                                                </div>
                                            ) : (
                                                <span 
                                                    className="text-slate-800 font-medium px-1.5 w-full text-center"
                                                    style={{ 
                                                        fontSize: field.value.length > 40 ? '7px' : field.value.length > 25 ? '8px' : field.value.length > 15 ? '9px' : '11px',
                                                        lineHeight: '1.1',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: Math.max(1, Math.floor(field.height / 2)),
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        wordBreak: 'break-word'
                                                    }}
                                                >
                                                    {field.value}
                                                </span>
                                            )
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-0.5 px-1 overflow-hidden">
                                                {mode === 'prepare' && (
                                                    <GripVertical size={10} style={{ color: color + '60' }} className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all" />
                                                )}
                                                <span className="text-[10px] font-bold uppercase tracking-wide leading-tight truncate" style={{ color }}>
                                                    {field.label || field.type}
                                                </span>
                                                <span className="text-[8px] leading-tight truncate" style={{ color: color + 'AA' }}>
                                                    {getSignerName(field.assigned_to).split(' ')[0]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Message (prepare mode) ── */}
                {mode === 'prepare' && (
                    <div className="w-56 bg-[#0a0a14] border-l border-white/5 flex flex-col shrink-0">
                        <div className="p-4">
                            <h3 className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-3">Message</h3>
                            <textarea value={message} onChange={e => setMessage(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/15 outline-none focus:border-[#F54029]/40 resize-none h-24"
                                placeholder="Optional message to signatories..." />
                        </div>
                        <div className="p-4 flex-1">
                            <h3 className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-3">Per Signer</h3>
                            {signatories.map(s => {
                                const sFields = fields.filter(f => f.assigned_to === s.email)
                                return (
                                    <div key={s.email} className="mb-3 pl-3 border-l-2" style={{ borderColor: s.color }}>
                                        <p className="text-white/50 text-[10px] font-bold">{s.name}</p>
                                        <p className="text-white/20 text-[9px]">{sFields.length} field{sFields.length !== 1 ? 's' : ''}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* ═══════ Signatory Picker ═══════ */}
            {showSignatoryPicker && (
                <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowSignatoryPicker(false)}>
                    <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-white font-rajdhani">Add Signatory</h2>
                            <button onClick={() => setShowSignatoryPicker(false)} className="text-white/20 hover:text-white p-1"><X size={16} /></button>
                        </div>
                        <div className="p-4 max-h-80 overflow-y-auto no-scrollbar">
                            {uniquePeople.filter(p => !signatories.find(s => s.email === p.email)).length === 0 ? (
                                <p className="text-xs text-white/30 py-4 text-center">All directors and officers have been added.</p>
                            ) : (
                                <div className="space-y-1.5">
                                    {uniquePeople.filter(p => !signatories.find(s => s.email === p.email)).map(p => (
                                        <button key={p.email} onClick={() => { addSignatory(p.email, p.name, p.title); setShowSignatoryPicker(false) }}
                                            className="w-full flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#F54029]/20 hover:bg-[#F54029]/5 transition-all text-left">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-white/30">{p.name?.[0]?.toUpperCase()}</div>
                                            <div>
                                                <p className="text-xs text-white/70 font-bold">{p.name}</p>
                                                <p className="text-[9px] text-white/25">{p.title} • {p.email}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════ Signature Capture ═══════ */}
            {showSignatureCapture && (
                <SignatureCapture
                    signerName={userName}
                    onCapture={(data) => {
                        if (signingFieldId) {
                            const field = fields.find(f => f.field_id === signingFieldId)
                            if (field) fillField(signingFieldId, field.type === 'initials' ? data.initials : data.signature)
                            setSigningFieldId(null)
                            setShowSignatureCapture(false)
                        } else {
                            submitSignature(data)
                        }
                    }}
                    onClose={() => { setShowSignatureCapture(false); setSigningFieldId(null) }}
                />
            )}
            {/* ═══════ Address Modal ═══════ */}
            {addressFieldId && (
                <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setAddressFieldId(null)}>
                    <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-white font-rajdhani">Enter Address</h2>
                            <button onClick={() => setAddressFieldId(null)} className="text-white/20 hover:text-white p-1"><X size={16} /></button>
                        </div>
                        <div className="p-5">
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                const fd = new FormData(e.currentTarget);
                                const street = fd.get('street');
                                const city = fd.get('city');
                                const state = fd.get('state');
                                const zip = fd.get('zip');
                                const country = fd.get('country');
                                
                                const fullAddress = `${street}, ${city}, ${state} ${zip}, ${country}`.replace(/,\s*,/g, ',').trim();
                                fillField(addressFieldId, fullAddress);
                                setAddressFieldId(null);
                            }} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-white/50 mb-1">Street Address</label>
                                    <input name="street" required defaultValue={fields.find(f => f.field_id === addressFieldId)?.value || ''} className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white outline-none focus:border-[#F54029]/40" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-white/50 mb-1">City</label>
                                        <input name="city" required className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white outline-none focus:border-[#F54029]/40" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-white/50 mb-1">State / Province</label>
                                        <input name="state" required className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white outline-none focus:border-[#F54029]/40" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-white/50 mb-1">ZIP / Postal Code</label>
                                        <input name="zip" required className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white outline-none focus:border-[#F54029]/40" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-white/50 mb-1">Country</label>
                                        <input name="country" required defaultValue="United States" className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white outline-none focus:border-[#F54029]/40" />
                                    </div>
                                </div>
                                <div className="pt-4 flex justify-end gap-3">
                                    <button type="button" onClick={() => setAddressFieldId(null)} className="px-4 py-2 text-xs text-white/50 hover:text-white transition-all">Cancel</button>
                                    <button type="submit" className="px-4 py-2 bg-[#F54029] text-white text-xs font-bold rounded hover:bg-[#F54029]/80 transition-all">Save Address</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            
            {/* ═══════ Text Input Modal ═══════ */}
            {textFieldId && (() => {
                const field = fields.find(f => f.field_id === textFieldId);
                return (
                    <div className="fixed inset-0 z-[9995] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setTextFieldId(null)}>
                        <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl w-full max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="p-5 border-b border-white/5 flex items-center justify-between">
                                <h2 className="text-sm font-bold text-white font-rajdhani">Enter {field?.label || 'Text'}</h2>
                                <button onClick={() => setTextFieldId(null)} className="text-white/20 hover:text-white p-1"><X size={16} /></button>
                            </div>
                            <div className="p-5">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const fd = new FormData(e.currentTarget);
                                    const val = fd.get('text_value') as string;
                                    if (val !== null) fillField(textFieldId, val);
                                    setTextFieldId(null);
                                }} className="space-y-4">
                                    <div>
                                        <input 
                                            name="text_value" 
                                            required 
                                            autoFocus
                                            defaultValue={field?.value || ''} 
                                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white outline-none focus:border-[#F54029]/40" 
                                            placeholder={`Enter ${field?.label || 'value'}...`}
                                        />
                                    </div>
                                    <div className="pt-2 flex justify-end gap-3">
                                        <button type="button" onClick={() => setTextFieldId(null)} className="px-4 py-2 text-xs text-white/50 hover:text-white transition-all">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-[#F54029] text-white text-xs font-bold rounded hover:bg-[#F54029]/80 transition-all">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    )
}
