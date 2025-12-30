'use client'

import { useState, useEffect } from 'react'
import SignaturePad from './SignaturePad'
import { FileText, CheckCircle, AlertCircle, Download } from 'lucide-react'

interface SigningInterfaceProps {
    documentId: string
    documentHtml: string
    documentType: string
    onSigningComplete?: (signatureData: string) => void
}

export default function SigningInterface({
    documentId,
    documentHtml,
    documentType,
    onSigningComplete
}: SigningInterfaceProps) {
    const [step, setStep] = useState<'review' | 'consent' | 'sign' | 'complete'>('review')
    const [hasScrolled, setHasScrolled] = useState(false)
    const [consent, setConsent] = useState(false)
    const [signature, setSignature] = useState<string | null>(null)
    const [signing, setSigning] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDocumentScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget
        const scrolledToBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50
        if (scrolledToBottom) {
            setHasScrolled(true)
        }
    }

    const handleConsentComplete = () => {
        if (consent) {
            setStep('sign')
        }
    }

    const handleSignatureSave = async (signatureData: string) => {
        try {
            setSigning(true)
            setError(null)
            setSignature(signatureData)

            // Submit signature to API
            const response = await fetch('/api/documents/sign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    documentId,
                    signatureData,
                    consentText: 'I have read and agree to the terms of this document and consent to electronic signature.',
                    ipAddress: await fetch('https://api.ipify.org?format=json')
                        .then(r => r.json())
                        .then(d => d.ip)
                        .catch(() => 'unknown'),
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to save signature')
            }

            const result = await response.json()
            setStep('complete')

            if (onSigningComplete) {
                onSigningComplete(signatureData)
            }
        } catch (err) {
            console.error('Signing error:', err)
            setError('Failed to complete signing. Please try again.')
        } finally {
            setSigning(false)
        }
    }

    const downloadDocument = () => {
        // Create a downloadable HTML file
        const blob = new Blob([documentHtml], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${documentType}_${documentId}.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-black py-12 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {['Review', 'Consent', 'Sign', 'Complete'].map((label, index) => {
                            const stepIndex = ['review', 'consent', 'sign', 'complete'].indexOf(step)
                            const isActive = index === stepIndex
                            const isComplete = index < stepIndex

                            return (
                                <div key={label} className="flex items-center flex-1">
                                    <div className="flex flex-col items-center flex-1">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isComplete
                                                    ? 'bg-green-500 text-white'
                                                    : isActive
                                                        ? 'bg-[#F54029] text-white'
                                                        : 'bg-white/10 text-white/40'
                                                }`}
                                        >
                                            {isComplete ? (
                                                <CheckCircle size={20} />
                                            ) : (
                                                <span className="text-sm font-bold">{index + 1}</span>
                                            )}
                                        </div>
                                        <span
                                            className={`mt-2 text-xs font-medium ${isActive ? 'text-white' : 'text-white/40'
                                                }`}
                                        >
                                            {label}
                                        </span>
                                    </div>
                                    {index < 3 && (
                                        <div
                                            className={`h-0.5 flex-1 mx-2 transition-all ${isComplete ? 'bg-green-500' : 'bg-white/10'
                                                }`}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                    {/* Step 1: Review Document */}
                    {step === 'review' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                                <FileText className="text-[#F54029]" size={32} />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Review Document</h2>
                                    <p className="text-white/60 text-sm mt-1">
                                        Please read the entire document before proceeding
                                    </p>
                                </div>
                            </div>

                            {/* Document viewer with scroll tracking */}
                            <div
                                onScroll={handleDocumentScroll}
                                className="h-[600px] overflow-y-auto bg-white p-8 rounded-lg shadow-2xl prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: documentHtml }}
                            />

                            {!hasScrolled && (
                                <div className="flex items-center gap-2 text-amber-400 text-sm">
                                    <AlertCircle size={16} />
                                    <span>Please scroll to the bottom of the document to continue</span>
                                </div>
                            )}

                            <div className="flex gap-4 justify-between pt-6">
                                <button
                                    onClick={downloadDocument}
                                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
                                >
                                    <Download size={18} />
                                    Download
                                </button>
                                <button
                                    onClick={() => setStep('consent')}
                                    disabled={!hasScrolled}
                                    className="px-8 py-3 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                                >
                                    Continue to Consent
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Electronic Signature Consent */}
                    {step === 'consent' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                                <CheckCircle className="text-[#F54029]" size={32} />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Electronic Signature Consent</h2>
                                    <p className="text-white/60 text-sm mt-1">
                                        Please review and accept the terms below
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
                                <h3 className="font-bold text-white text-lg">
                                    Consent to Electronic Signatures
                                </h3>
                                <div className="text-white/80 space-y-3 text-sm leading-relaxed">
                                    <p>
                                        By checking the box below, you agree to electronically sign this document and
                                        acknowledge that:
                                    </p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>
                                            Your electronic signature is the legal equivalent of your manual signature
                                            on this document.
                                        </li>
                                        <li>
                                            You consent to be legally bound by this document's terms and conditions.
                                        </li>
                                        <li>
                                            This document will be stored electronically and made available to you for
                                            download.
                                        </li>
                                        <li>
                                            Your signature, IP address, and timestamp will be recorded for
                                            verification purposes.
                                        </li>
                                        <li>
                                            You have the right to request a paper copy of this document at any time.
                                        </li>
                                    </ul>
                                    <p className="pt-4 text-white/60 italic">
                                        This consent is governed by the Electronic Signatures in Global and National
                                        Commerce Act (ESIGN) and the Uniform Electronic Transactions Act (UETA).
                                    </p>
                                </div>
                            </div>

                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={consent}
                                    onChange={(e) => setConsent(e.target.checked)}
                                    className="w-5 h-5 mt-0.5 accent-[#F54029] cursor-pointer"
                                />
                                <span className="text-white/80 text-sm group-hover:text-white transition-colors">
                                    I have read and agree to the Electronic Signature Consent and understand that my
                                    electronic signature will be legally binding.
                                </span>
                            </label>

                            <div className="flex gap-4 justify-between pt-6">
                                <button
                                    onClick={() => setStep('review')}
                                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleConsentComplete}
                                    disabled={!consent}
                                    className="px-8 py-3 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                                >
                                    Proceed to Signature
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Sign Document */}
                    {step === 'sign' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                                <FileText className="text-[#F54029]" size={32} />
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Sign Document</h2>
                                    <p className="text-white/60 text-sm mt-1">
                                        Please provide your signature below
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-4">
                                    <AlertCircle size={20} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <SignaturePad
                                onSave={handleSignatureSave}
                                onCancel={() => setStep('consent')}
                                width={600}
                                height={200}
                            />

                            {signing && (
                                <div className="text-center text-white/60">
                                    <div className="animate-pulse">Processing signature...</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Complete */}
                    {step === 'complete' && (
                        <div className="space-y-6 text-center py-12">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle className="text-green-500" size={48} />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">Document Signed Successfully!</h2>
                                <p className="text-white/60">
                                    Your signature has been recorded and the document has been finalized.
                                </p>
                            </div>

                            {signature && (
                                <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-md mx-auto">
                                    <p className="text-sm text-white/60 mb-3">Your Signature:</p>
                                    <img src={signature} alt="Signature" className="w-full bg-white rounded p-2" />
                                </div>
                            )}

                            <div className="flex gap-4 justify-center pt-6">
                                <button
                                    onClick={downloadDocument}
                                    className="flex items-center gap-2 px-6 py-3 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg transition-all"
                                >
                                    <Download size={18} />
                                    Download Signed Document
                                </button>
                            </div>

                            <p className="text-xs text-white/40 max-w-md mx-auto mt-8">
                                A copy of the signed document has been saved to your account. You can access it
                                anytime from your dashboard.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
