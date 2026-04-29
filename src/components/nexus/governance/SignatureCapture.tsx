'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Pen, Type, RotateCcw, Check, Upload, Shield, Clock, Globe, Fingerprint } from 'lucide-react'

/* ── Signature font options for "Generic" / "Choose Style" tab ── */
const SIGNATURE_FONTS = [
    { name: 'Elegant', family: '"Dancing Script", cursive', weight: 400 },
    { name: 'Classic', family: '"Great Vibes", cursive', weight: 400 },
    { name: 'Formal', family: '"Allura", cursive', weight: 400 },
    { name: 'Modern', family: '"Pacifico", cursive', weight: 400 },
    { name: 'Script', family: '"Sacramento", cursive', weight: 400 },
    { name: 'Bold', family: '"Caveat", cursive', weight: 700 },
]

interface SignatureCaptureProps {
    onCapture: (data: { signature: string; initials: string }) => void
    onClose: () => void
    signerName?: string
    mode?: 'signature' | 'initials'
}

export default function SignatureCapture({ onCapture, onClose, signerName = '', mode = 'signature' }: SignatureCaptureProps) {
    const [tab, setTab] = useState<'style' | 'draw' | 'upload'>('style')
    const [typedText, setTypedText] = useState(signerName)
    const [initialsText, setInitialsText] = useState(signerName.split(' ').map(w => w?.[0] || '').join('').toUpperCase())
    const [selectedFont, setSelectedFont] = useState(0)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const initialsCanvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [hasDrawn, setHasDrawn] = useState(false)
    const [hasInitials, setHasInitials] = useState(false)
    const [activeCanvas, setActiveCanvas] = useState<'signature' | 'initials'>(mode)
    const lastPoint = useRef<{ x: number; y: number } | null>(null)
    const [uploadedSigUrl, setUploadedSigUrl] = useState<string>('')
    const [uploadedInitUrl, setUploadedInitUrl] = useState<string>('')
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const initFileInputRef = useRef<HTMLInputElement>(null)
    const [fontsLoaded, setFontsLoaded] = useState(false)

    // Load Google Fonts for the style tab
    useEffect(() => {
        const link = document.createElement('link')
        link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Allura&family=Pacifico&family=Sacramento&family=Caveat:wght@400;700&display=swap'
        link.rel = 'stylesheet'
        document.head.appendChild(link)
        link.onload = () => setFontsLoaded(true)
        return () => { document.head.removeChild(link) }
    }, [])

    /* ── Canvas setup ── */
    const getCtx = useCallback((canvas: HTMLCanvasElement | null) => {
        if (!canvas) return null
        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.strokeStyle = '#1e293b'
            ctx.lineWidth = 2.5
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
        }
        return ctx
    }, [])

    useEffect(() => {
        const initCanvas = (canvas: HTMLCanvasElement | null) => {
            if (!canvas) return
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width * 2
            canvas.height = rect.height * 2
            const ctx = canvas.getContext('2d')
            if (ctx) {
                ctx.scale(2, 2)
                ctx.fillStyle = '#fff'
                ctx.fillRect(0, 0, rect.width, rect.height)
            }
        }
        if (tab === 'draw') {
            setTimeout(() => {
                initCanvas(canvasRef.current)
                initCanvas(initialsCanvasRef.current)
            }, 50)
        }
    }, [tab])

    /* ── Drawing handlers ── */
    const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect()
        if ('touches' in e) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
        return { x: (e as React.MouseEvent).clientX - rect.left, y: (e as React.MouseEvent).clientY - rect.top }
    }

    const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = activeCanvas === 'signature' ? canvasRef.current : initialsCanvasRef.current
        if (!canvas) return
        e.preventDefault()
        setIsDrawing(true)
        lastPoint.current = getPos(e, canvas)
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = activeCanvas === 'signature' ? canvasRef.current : initialsCanvasRef.current
        if (!isDrawing || !canvas) return
        e.preventDefault()
        const ctx = getCtx(canvas)
        if (!ctx || !lastPoint.current) return
        const pos = getPos(e, canvas)
        ctx.beginPath()
        ctx.moveTo(lastPoint.current.x, lastPoint.current.y)
        ctx.lineTo(pos.x, pos.y)
        ctx.stroke()
        lastPoint.current = pos
        if (activeCanvas === 'signature') setHasDrawn(true)
        else setHasInitials(true)
    }

    const endDraw = () => { setIsDrawing(false); lastPoint.current = null }

    const clearCanvas = (which: 'signature' | 'initials') => {
        const canvas = which === 'signature' ? canvasRef.current : initialsCanvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        const rect = canvas.getBoundingClientRect()
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, rect.width, rect.height)
        if (which === 'signature') setHasDrawn(false)
        else setHasInitials(false)
    }

    /* ── Upload handlers ── */
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'sig' | 'init') => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => {
            const dataUrl = ev.target?.result as string
            if (target === 'sig') setUploadedSigUrl(dataUrl)
            else setUploadedInitUrl(dataUrl)
        }
        reader.readAsDataURL(file)
    }

    /* ── Render typed/styled signature to canvas for submission ── */
    const renderStyledSignature = (text: string, width: number, height: number, fontIdx: number): string => {
        const canvas = document.createElement('canvas')
        canvas.width = width * 2
        canvas.height = height * 2
        const ctx = canvas.getContext('2d')!
        ctx.scale(2, 2)
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = '#1e293b'
        const font = SIGNATURE_FONTS[fontIdx]
        ctx.font = `${font.weight} ${Math.min(height * 0.45, 36)}px ${font.family}`
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillText(text, width / 2, height / 2)
        return canvas.toDataURL('image/png')
    }

    /* ── Submit ── */
    const handleSubmit = () => {
        let sigData = ''
        let initData = ''

        if (tab === 'style') {
            sigData = renderStyledSignature(typedText || signerName, 400, 100, selectedFont)
            initData = renderStyledSignature(initialsText, 150, 80, selectedFont)
        } else if (tab === 'draw') {
            if (canvasRef.current) sigData = canvasRef.current.toDataURL('image/png')
            if (initialsCanvasRef.current) initData = initialsCanvasRef.current.toDataURL('image/png')
        } else if (tab === 'upload') {
            sigData = uploadedSigUrl
            initData = uploadedInitUrl || uploadedSigUrl // fallback to sig if no initials uploaded
        }

        onCapture({ signature: sigData, initials: initData })
    }

    const canSubmit = (() => {
        if (!agreedToTerms) return false
        if (tab === 'style') return !!typedText.trim()
        if (tab === 'draw') return hasDrawn
        if (tab === 'upload') return !!uploadedSigUrl
        return false
    })()

    const now = new Date()
    const timestamp = now.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <div>
                        <h2 className="text-lg font-bold text-white font-rajdhani">Apply Your Signature</h2>
                        <p className="text-xs text-white/30 mt-0.5">Choose how you'd like to sign</p>
                    </div>
                    <button onClick={onClose} className="text-white/20 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"><X size={18} /></button>
                </div>

                {/* Tab Selector — 3 tabs */}
                <div className="px-5 pt-4 flex gap-2">
                    {[
                        { key: 'style', label: 'Choose Style', icon: Type },
                        { key: 'draw', label: 'Draw', icon: Pen },
                        { key: 'upload', label: 'Upload', icon: Upload },
                    ].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${tab === t.key
                                ? 'bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029]'
                                : 'bg-white/5 border border-white/5 text-white/40 hover:text-white'
                                }`}>
                            <t.icon size={14} /> {t.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-5 space-y-5">

                    {/* ════ TAB: Choose Style ════ */}
                    {tab === 'style' && (
                        <>
                            {/* Name input */}
                            <div>
                                <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold block mb-2">Full Name</label>
                                <input type="text" value={typedText} onChange={e => setTypedText(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029]/50 outline-none transition-all"
                                    placeholder="Type your full name" />
                            </div>

                            {/* Initials input */}
                            <div>
                                <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold block mb-2">Initials</label>
                                <input type="text" value={initialsText} onChange={e => setInitialsText(e.target.value.toUpperCase())} maxLength={5}
                                    className="w-32 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029]/50 outline-none transition-all"
                                    placeholder="KP" />
                            </div>

                            {/* Font style picker */}
                            {typedText && (
                                <div>
                                    <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold block mb-3">Select Style</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {SIGNATURE_FONTS.map((font, i) => (
                                            <button key={i} onClick={() => setSelectedFont(i)}
                                                className={`p-4 bg-white rounded-xl border-2 text-left transition-all ${selectedFont === i
                                                    ? 'border-[#F54029] shadow-[0_0_12px_rgba(17,157,255,0.2)]'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}>
                                                <p className="text-[9px] text-gray-400 font-sans mb-1 uppercase tracking-wider">{font.name}</p>
                                                <p className="text-xl text-slate-800 truncate" style={{ fontFamily: font.family, fontWeight: font.weight, fontStyle: 'italic' }}>
                                                    {typedText}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ════ TAB: Draw ════ */}
                    {tab === 'draw' && (
                        <>
                            {/* Signature Canvas */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold cursor-pointer"
                                        onClick={() => setActiveCanvas('signature')}>
                                        Signature {activeCanvas === 'signature' && <span className="text-[#F54029]">• Active</span>}
                                    </label>
                                    <button onClick={() => clearCanvas('signature')} className="text-[10px] text-white/20 hover:text-white flex items-center gap-1 transition-all">
                                        <RotateCcw size={10} /> Clear
                                    </button>
                                </div>
                                <canvas ref={canvasRef}
                                    onClick={() => setActiveCanvas('signature')}
                                    onMouseDown={e => { setActiveCanvas('signature'); startDraw(e) }}
                                    onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                                    onTouchStart={e => { setActiveCanvas('signature'); startDraw(e) }}
                                    onTouchMove={draw} onTouchEnd={endDraw}
                                    className={`w-full h-28 rounded-xl cursor-crosshair bg-white border-2 transition-all ${activeCanvas === 'signature' ? 'border-[#F54029]/40 shadow-[0_0_20px_rgba(17,157,255,0.1)]' : 'border-white/20'}`}
                                    style={{ touchAction: 'none' }} />
                            </div>

                            {/* Initials Canvas */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold cursor-pointer"
                                        onClick={() => setActiveCanvas('initials')}>
                                        Initials {activeCanvas === 'initials' && <span className="text-[#F54029]">• Active</span>}
                                    </label>
                                    <button onClick={() => clearCanvas('initials')} className="text-[10px] text-white/20 hover:text-white flex items-center gap-1 transition-all">
                                        <RotateCcw size={10} /> Clear
                                    </button>
                                </div>
                                <canvas ref={initialsCanvasRef}
                                    onClick={() => setActiveCanvas('initials')}
                                    onMouseDown={e => { setActiveCanvas('initials'); startDraw(e) }}
                                    onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                                    onTouchStart={e => { setActiveCanvas('initials'); startDraw(e) }}
                                    onTouchMove={draw} onTouchEnd={endDraw}
                                    className={`w-48 h-20 rounded-xl cursor-crosshair bg-white border-2 transition-all ${activeCanvas === 'initials' ? 'border-[#F54029]/40 shadow-[0_0_20px_rgba(17,157,255,0.1)]' : 'border-white/20'}`}
                                    style={{ touchAction: 'none' }} />
                            </div>
                        </>
                    )}

                    {/* ════ TAB: Upload ════ */}
                    {tab === 'upload' && (
                        <>
                            {/* Signature upload */}
                            <div>
                                <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold block mb-2">Signature Image</label>
                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'sig')} />
                                {uploadedSigUrl ? (
                                    <div className="relative group">
                                        <div className="p-4 bg-white rounded-xl border border-gray-200">
                                            <img src={uploadedSigUrl} alt="Signature" className="max-h-24 object-contain mx-auto" />
                                        </div>
                                        <button onClick={() => { setUploadedSigUrl(''); if (fileInputRef.current) fileInputRef.current.value = '' }}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"><X size={14} /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => fileInputRef.current?.click()}
                                        className="w-full p-8 border-2 border-dashed border-white/10 rounded-xl text-sm text-white/30 hover:text-white/50 hover:border-white/20 transition-all flex flex-col items-center gap-2">
                                        <Upload size={24} />
                                        <span>Click to upload signature image</span>
                                        <span className="text-[10px] text-white/15">PNG, JPG, or SVG — transparent background preferred</span>
                                    </button>
                                )}
                            </div>

                            {/* Initials upload */}
                            <div>
                                <label className="text-[10px] text-white/30 uppercase tracking-widest font-bold block mb-2">Initials Image <span className="text-white/15">(Optional)</span></label>
                                <input ref={initFileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, 'init')} />
                                {uploadedInitUrl ? (
                                    <div className="relative group">
                                        <div className="p-3 bg-white rounded-xl border border-gray-200 inline-block">
                                            <img src={uploadedInitUrl} alt="Initials" className="max-h-16 object-contain" />
                                        </div>
                                        <button onClick={() => { setUploadedInitUrl(''); if (initFileInputRef.current) initFileInputRef.current.value = '' }}
                                            className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
                                    </div>
                                ) : (
                                    <button onClick={() => initFileInputRef.current?.click()}
                                        className="w-48 p-4 border-2 border-dashed border-white/10 rounded-xl text-xs text-white/20 hover:text-white/40 hover:border-white/20 transition-all flex flex-col items-center gap-1">
                                        <Upload size={16} />
                                        <span>Upload initials</span>
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* ════ E-Signature Metadata + Legal Consent ════ */}
                    <div className="border-t border-white/5 pt-4 space-y-3">
                        {/* Real-time metadata display */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-1.5">
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                                <Shield size={10} /> E-Signature Verification Details
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <div className="flex items-center gap-1.5">
                                    <Fingerprint size={10} className="text-white/15 shrink-0" />
                                    <span className="text-[9px] text-white/20">Signer:</span>
                                    <span className="text-[9px] text-white/40 font-mono truncate">{signerName || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={10} className="text-white/15 shrink-0" />
                                    <span className="text-[9px] text-white/20">Timestamp:</span>
                                    <span className="text-[9px] text-white/40 font-mono truncate">{timestamp}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Globe size={10} className="text-white/15 shrink-0" />
                                    <span className="text-[9px] text-white/20">IP Address:</span>
                                    <span className="text-[9px] text-white/40 font-mono">Captured on submit</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Shield size={10} className="text-white/15 shrink-0" />
                                    <span className="text-[9px] text-white/20">Method:</span>
                                    <span className="text-[9px] text-white/40 font-mono capitalize">{tab === 'style' ? 'Typed (Styled)' : tab === 'draw' ? 'Hand-drawn' : 'Uploaded Image'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Legal consent checkbox */}
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)}
                                className="accent-[#F54029] mt-0.5 w-4 h-4 shrink-0" />
                            <span className="text-[10px] text-white/25 leading-relaxed group-hover:text-white/35 transition-all">
                                By checking this box and clicking "Apply Signature", I agree that this electronic signature constitutes my legal signature
                                and is the legal equivalent of my handwritten signature. I understand that my signature, timestamp ({timestamp}),
                                IP address, and device information will be recorded and may be used as evidence of my intent to sign this document.
                                This signature is binding under the Electronic Signatures in Global and National Commerce (ESIGN) Act and
                                the Uniform Electronic Transactions Act (UETA).
                            </span>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-5 border-t border-white/5">
                    <p className="text-[9px] text-white/10 font-mono max-w-xs truncate">
                        SHA-256 verification available on completion
                    </p>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit}
                            className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        >
                            <Check size={14} /> Apply Signature
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
