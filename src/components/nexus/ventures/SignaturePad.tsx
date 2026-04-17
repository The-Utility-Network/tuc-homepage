'use client'

import React, { useRef, useState, useEffect } from 'react'
import SignaturePadCore from 'signature_pad'
import { Pencil, Keyboard, CheckCircle, RotateCcw } from 'lucide-react'

// Injecting cursive font for typed signatures
const signatureFontCSS = `
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
.signature-font {
    font-family: 'Dancing Script', cursive;
}
`

interface SignaturePadProps {
    investorName: string
    onSign: (signatureData: string, type: 'drawn' | 'typed') => void
}

export default function SignaturePad({ investorName, onSign }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [pad, setPad] = useState<SignaturePadCore | null>(null)
    const [mode, setMode] = useState<'draw' | 'type'>('draw')
    const [typedSignature, setTypedSignature] = useState(investorName)
    const [consent, setConsent] = useState(false)
    const [isEmpty, setIsEmpty] = useState(true)

    useEffect(() => {
        // Inject font
        const style = document.createElement('style')
        style.innerHTML = signatureFontCSS
        document.head.appendChild(style)
        return () => { document.head.removeChild(style) }
    }, [])

    useEffect(() => {
        if (mode === 'draw' && canvasRef.current) {
            const canvas = canvasRef.current
            // Make it retina-aware
            const ratio = Math.max(window.devicePixelRatio || 1, 1)
            canvas.width = canvas.offsetWidth * ratio
            canvas.height = canvas.offsetHeight * ratio
            canvas.getContext('2d')?.scale(ratio, ratio)

            const sp = new SignaturePadCore(canvas, {
                penColor: 'black',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
            })
            
            sp.addEventListener("endStroke", () => setIsEmpty(sp.isEmpty()))
            setPad(sp)
            setIsEmpty(true)
        }
    }, [mode])

    const handleClear = () => {
        if (pad) {
            pad.clear()
            setIsEmpty(true)
        }
    }

    const handleSubmit = () => {
        if (!consent) return

        if (mode === 'draw') {
            if (pad && !pad.isEmpty()) {
                onSign(pad.toDataURL('image/png'), 'drawn')
            }
        } else {
            if (typedSignature.trim().length > 0) {
                onSign(typedSignature.trim(), 'typed')
            }
        }
    }

    const disableSubmit = !consent || (mode === 'draw' ? isEmpty : typedSignature.trim().length === 0)

    return (
        <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white font-rajdhani uppercase tracking-wider">E-Signature</h3>
                
                <div className="flex bg-black/40 border border-white/10 rounded-lg p-1">
                    <button 
                        onClick={() => setMode('draw')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${mode === 'draw' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        <Pencil size={14}/> Draw
                    </button>
                    <button 
                        onClick={() => setMode('type')}
                        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-colors ${mode === 'type' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
                    >
                        <Keyboard size={14}/> Type
                    </button>
                </div>
            </div>

            {/* Input Area */}
            <div className="mb-6 border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
                {mode === 'draw' ? (
                    <div className="relative">
                        <canvas 
                            ref={canvasRef} 
                            className="w-full h-[150px] cursor-crosshair touch-none"
                            style={{ WebkitTouchCallout: 'none' }}
                        />
                        <button 
                            onClick={handleClear}
                            className="absolute top-2 right-2 p-1.5 bg-black/40 text-white/40 hover:text-white rounded hover:bg-white/10 transition-colors"
                            title="Clear Signature"
                        >
                            <RotateCcw size={14} />
                        </button>
                        {isEmpty && (
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-white/20 uppercase tracking-widest text-sm font-bold">
                                Draw Signature Here
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-8 flex items-center justify-center border-b border-black">
                        <input 
                            type="text"
                            value={typedSignature}
                            onChange={(e) => setTypedSignature(e.target.value)}
                            className="w-full bg-transparent text-center text-white outline-none signature-font text-5xl"
                            placeholder="Type Name"
                            spellCheck="false"
                        />
                    </div>
                )}
            </div>

            {/* ESIGN Consent */}
            <div className="mb-6 p-4 bg-[#F54029]/5 border border-[#F54029]/20 rounded-lg flex items-start gap-3 cursor-pointer" onClick={() => setConsent(!consent)}>
                <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${consent ? 'bg-[#F54029] border-[#F54029] text-white' : 'border-white/20 bg-black/40'}`}>
                    {consent && <CheckCircle size={14} />}
                </div>
                <p className="text-xs text-white/60 leading-relaxed select-none">
                    I consent to be legally bound by this electronic signature, under the terms of the U.S. Electronic Signatures in Global and National Commerce Act (E-Sign Act). I understand this acts as my formal execution of the resulting SAFE or Equity agreement.
                </p>
            </div>

            <button 
                onClick={handleSubmit}
                disabled={disableSubmit}
                className="w-full py-4 bg-[#F54029] hover:bg-[#C53020] disabled:bg-white/5 disabled:text-white/40 text-white font-bold rounded-xl uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
                Execute Agreement
            </button>
        </div>
    )
}
