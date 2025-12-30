'use client'

import { useRef, useEffect, useState } from 'react'
import { X, Check, RotateCcw } from 'lucide-react'

interface SignaturePadProps {
    onSave: (signatureData: string) => void
    onCancel?: () => void
    width?: number
    height?: number
    penColor?: string
}

export default function SignaturePad({
    onSave,
    onCancel,
    width = 600,
    height = 200,
    penColor = '#000000'
}: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)
    const [isEmpty, setIsEmpty] = useState(true)
    const [typedSignature, setTypedSignature] = useState('')
    const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw')

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        canvas.width = width
        canvas.height = height

        // Set drawing styles
        ctx.strokeStyle = penColor
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        // Fill with white background
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
    }, [width, height, penColor])

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        setIsDrawing(true)
        setIsEmpty(false)

        const rect = canvas.getBoundingClientRect()
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return

        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left
        const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top

        ctx.lineTo(x, y)
        ctx.stroke()

        e.preventDefault()
    }

    const stopDrawing = () => {
        setIsDrawing(false)
    }

    const clear = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        setIsEmpty(true)
        setTypedSignature('')
    }

    const renderTypedSignature = () => {
        const canvas = canvasRef.current
        if (!canvas || !typedSignature) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear canvas
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)

        // Draw typed signature in cursive font
        ctx.fillStyle = penColor
        ctx.font = 'italic 48px "Brush Script MT", cursive'
        ctx.textBaseline = 'middle'
        ctx.textAlign = 'center'
        ctx.fillText(typedSignature, width / 2, height / 2)

        setIsEmpty(false)
    }

    useEffect(() => {
        if (signatureMode === 'type' && typedSignature) {
            renderTypedSignature()
        }
    }, [typedSignature, signatureMode])

    const handleSave = () => {
        const canvas = canvasRef.current
        if (!canvas || isEmpty) return

        // Convert canvas to base64 PNG
        const signatureData = canvas.toDataURL('image/png')
        onSave(signatureData)
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Mode selector */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => {
                        setSignatureMode('draw')
                        clear()
                    }}
                    className={`px-6 py-2 rounded-lg transition-all ${signatureMode === 'draw'
                            ? 'bg-[#F54029] text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                >
                    Draw Signature
                </button>
                <button
                    onClick={() => {
                        setSignatureMode('type')
                        clear()
                    }}
                    className={`px-6 py-2 rounded-lg transition-all ${signatureMode === 'type'
                            ? 'bg-[#F54029] text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                >
                    Type Signature
                </button>
            </div>

            {/* Typed signature input */}
            {signatureMode === 'type' && (
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-white/60">Type your full name:</label>
                    <input
                        type="text"
                        value={typedSignature}
                        onChange={(e) => setTypedSignature(e.target.value)}
                        placeholder="John Doe"
                        className="px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:border-[#F54029] focus:outline-none transition-colors"
                    />
                </div>
            )}

            {/* Canvas */}
            <div className="bg-white rounded-xl border-2 border-black/10 overflow-hidden shadow-2xl">
                <canvas
                    ref={canvasRef}
                    onMouseDown={signatureMode === 'draw' ? startDrawing : undefined}
                    onMouseMove={signatureMode === 'draw' ? draw : undefined}
                    onMouseUp={signatureMode === 'draw' ? stopDrawing : undefined}
                    onMouseLeave={signatureMode === 'draw' ? stopDrawing : undefined}
                    onTouchStart={signatureMode === 'draw' ? startDrawing : undefined}
                    onTouchMove={signatureMode === 'draw' ? draw : undefined}
                    onTouchEnd={signatureMode === 'draw' ? stopDrawing : undefined}
                    className={signatureMode === 'draw' ? 'cursor-crosshair touch-none' : 'cursor-default'}
                    style={{ width: '100%', height: 'auto', maxWidth: `${width}px` }}
                />
            </div>

            {signatureMode === 'draw' && (
                <p className="text-center text-sm text-white/40 italic">
                    Sign above using your mouse or touch screen
                </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-4 justify-between">
                <button
                    onClick={clear}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-all"
                >
                    <RotateCcw size={18} />
                    Clear
                </button>

                <div className="flex gap-3">
                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-all"
                        >
                            <X size={18} />
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isEmpty}
                        className="flex items-center gap-2 px-8 py-3 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                    >
                        <Check size={18} />
                        Save Signature
                    </button>
                </div>
            </div>
        </div>
    )
}
