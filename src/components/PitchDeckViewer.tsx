'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Maximize2, Minimize2, Loader2, FileText, Grid3x3 } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PDF_PATH = '/Cyber_Physical_Codex.pdf'

export default function PitchDeckViewer() {
    const [numPages, setNumPages] = useState(0)
    const [pageNumber, setPageNumber] = useState(1)
    const [scale, setScale] = useState(1.0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const [showThumbnails, setShowThumbnails] = useState(false)
    const [containerWidth, setContainerWidth] = useState(0)
    const [headerVisible, setHeaderVisible] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => { setTimeout(() => setHeaderVisible(true), 100) }, [])

    useEffect(() => {
        const measure = () => { if (containerRef.current) setContainerWidth(containerRef.current.clientWidth) }
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    }, [isFullscreen])

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setPageNumber(p => Math.min(numPages, p + 1)) }
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setPageNumber(p => Math.max(1, p - 1)) }
            else if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false)
            else if (e.key === 'f' || e.key === 'F') setIsFullscreen(f => !f)
        }
        window.addEventListener('keydown', handleKey)
        return () => window.removeEventListener('keydown', handleKey)
    }, [numPages, isFullscreen])

    const onDocumentLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => { setNumPages(n); setIsLoaded(true) }, [])
    const goToPage = (page: number) => { setPageNumber(page); setShowThumbnails(false) }
    const progress = numPages > 0 ? (pageNumber / numPages) * 100 : 0
    const pageWidth = isFullscreen ? Math.min(containerWidth - 80, 1200) : Math.min(containerWidth - 48, 960)

    return (
        <>
            {/* ═══ CINEMATIC HEADER ═══ */}
            <div className="relative overflow-hidden mb-12">
                {/* Animated scan line */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-[#F54029]/40 to-transparent animate-[scanDown_4s_ease-in-out_infinite]" />
                </div>
                {/* Animated grid */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(245,64,41,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,64,41,.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

                <div className="relative max-w-5xl mx-auto px-6 py-20 text-center">
                    {/* HUD corner brackets */}
                    <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-[#F54029]/30 rounded-tl-sm" />
                    <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-[#F54029]/30 rounded-tr-sm" />
                    <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-[#F54029]/30 rounded-bl-sm" />
                    <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-[#F54029]/30 rounded-br-sm" />

                    {/* System label with typing effect */}
                    <div className={`inline-flex items-center gap-3 mb-8 transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <span className="w-2 h-2 bg-[#F54029] rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono tracking-[0.4em] text-[#F54029] uppercase">
                            Classified Document // Pitch Deck
                        </span>
                        <span className="w-8 h-px bg-gradient-to-r from-[#F54029]/60 to-transparent" />
                    </div>

                    {/* Title with staggered reveal */}
                    <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-8 transition-all duration-1000 delay-200 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <span className="block text-white/90" style={{ textShadow: '0 0 80px rgba(255,255,255,0.1)' }}>CYBER-PHYSICAL</span>
                        <span className="block bg-gradient-to-r from-[#F54029] via-[#ff6040] to-[#F54029] bg-clip-text text-transparent mt-2 animate-[shimmer_3s_ease-in-out_infinite]" style={{ backgroundSize: '200% 100%' }}>
                            CODEX
                        </span>
                    </h1>

                    <p className={`text-base md:text-lg text-white/30 max-w-xl mx-auto font-light leading-relaxed transition-all duration-1000 delay-500 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        Our architecture for a world where every industry automates —<br className="hidden md:block" /> and communities captain the outcome.
                    </p>

                    {/* Animated divider */}
                    <div className={`flex items-center justify-center gap-4 mt-10 transition-all duration-1000 delay-700 ${headerVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#F54029]/40" />
                        <div className="w-1.5 h-1.5 rotate-45 border border-[#F54029]/40" />
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#F54029]/40" />
                    </div>
                </div>
            </div>

            {/* ═══ VIEWER ═══ */}
            <div ref={containerRef} className={`relative flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'max-w-6xl mx-auto px-4 sm:px-6'}`}>
                {/* Control bar */}
                <div className={`flex items-center justify-between gap-3 px-5 py-2.5 ${isFullscreen ? 'bg-black/90 backdrop-blur-2xl border-b border-white/5' : 'bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-t-2xl'}`}>
                    {/* Left */}
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#F54029]/10 border border-[#F54029]/20 flex items-center justify-center shrink-0">
                            <FileText size={14} className="text-[#F54029]" />
                        </div>
                        <div className="min-w-0 hidden sm:block">
                            <h3 className="text-xs font-bold text-white/80 truncate">Cyber-Physical Codex</h3>
                            <p className="text-[9px] text-white/20 font-mono">{isLoaded ? `${numPages} slides` : 'Loading...'}</p>
                        </div>
                    </div>
                    {/* Center: nav */}
                    {isLoaded && (
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}
                                className="w-7 h-7 rounded-md bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all">
                                <ChevronLeft size={13} />
                            </button>
                            <div className="flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/[0.06] rounded-md">
                                <input type="number" value={pageNumber} min={1} max={numPages}
                                    onChange={e => { const v = parseInt(e.target.value); if (v >= 1 && v <= numPages) setPageNumber(v) }}
                                    className="w-6 bg-transparent text-center text-[11px] text-white font-mono outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                <span className="text-[9px] text-white/15 font-mono">/</span>
                                <span className="text-[9px] text-white/30 font-mono">{numPages}</span>
                            </div>
                            <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages}
                                className="w-7 h-7 rounded-md bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 disabled:opacity-20 transition-all">
                                <ChevronRight size={13} />
                            </button>
                        </div>
                    )}
                    {/* Right: tools */}
                    <div className="flex items-center gap-1">
                        <div className="hidden md:flex items-center gap-1">
                            <button onClick={() => setScale(s => Math.max(0.5, s - 0.15))} className="w-7 h-7 rounded-md bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white transition-all"><ZoomOut size={12} /></button>
                            <button onClick={() => setScale(1.0)} className="px-2 h-7 rounded-md bg-white/5 border border-white/[0.06] text-[9px] text-white/30 hover:text-white font-mono transition-all">{Math.round(scale * 100)}%</button>
                            <button onClick={() => setScale(s => Math.min(2.5, s + 0.15))} className="w-7 h-7 rounded-md bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white transition-all"><ZoomIn size={12} /></button>
                        </div>
                        <div className="hidden md:block w-px h-5 bg-white/[0.06] mx-1" />
                        <button onClick={() => setShowThumbnails(t => !t)} className={`w-7 h-7 rounded-md border flex items-center justify-center transition-all ${showThumbnails ? 'bg-[#F54029]/10 border-[#F54029]/30 text-[#F54029]' : 'bg-white/5 border-white/[0.06] text-white/30 hover:text-white'}`}><Grid3x3 size={12} /></button>
                        <button onClick={() => setIsFullscreen(f => !f)} className="w-7 h-7 rounded-md bg-white/5 border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white transition-all">{isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}</button>
                        <a href={PDF_PATH} download="Cyber_Physical_Codex.pdf" className="h-7 px-3 rounded-md bg-[#F54029] text-white flex items-center justify-center gap-1.5 text-[9px] font-bold uppercase tracking-wider hover:bg-[#d63520] transition-all shadow-[0_0_20px_rgba(245,64,41,0.2)]">
                            <Download size={11} /><span className="hidden sm:inline">Download</span>
                        </a>
                    </div>
                </div>

                {/* Progress */}
                <div className="h-[2px] bg-white/[0.03] relative">
                    <div className="h-full bg-gradient-to-r from-[#F54029] to-[#ff6040] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(245,64,41,0.5)]" style={{ width: `${progress}%` }} />
                </div>

                {/* Main viewer */}
                <div ref={containerRef} className={`flex-1 overflow-auto relative ${isFullscreen ? '' : 'rounded-b-2xl border border-t-0 border-white/[0.06]'}`}
                    style={{ background: 'radial-gradient(ellipse at 50% 30%, #0d0d0d 0%, #050505 50%, #000 100%)' }}>
                    {showThumbnails && isLoaded ? (
                        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {Array.from({ length: numPages }, (_, i) => i + 1).map(pg => (
                                <button key={pg} onClick={() => goToPage(pg)}
                                    className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-[1.03] ${pg === pageNumber ? 'border-[#F54029] shadow-[0_0_25px_rgba(245,64,41,0.3)]' : 'border-white/[0.06] hover:border-white/15'}`}>
                                    <div className="bg-white/[0.01] aspect-[3/4] flex items-center justify-center overflow-hidden">
                                        <Document file={PDF_PATH} loading=""><Page pageNumber={pg} width={160} renderTextLayer={false} renderAnnotationLayer={false} /></Document>
                                    </div>
                                    <div className={`absolute bottom-0 inset-x-0 py-1.5 text-center text-[9px] font-mono font-bold backdrop-blur-sm ${pg === pageNumber ? 'bg-[#F54029] text-white' : 'bg-black/70 text-white/30 group-hover:text-white'}`}>{pg}</div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-10 min-h-[65vh] relative">
                            {/* Ambient glow */}
                            {isLoaded && <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(245,64,41,0.03) 0%, transparent 55%)' }} />}
                            <Document file={PDF_PATH} onLoadSuccess={onDocumentLoadSuccess}
                                loading={
                                    <div className="flex items-center justify-center min-h-[65vh]">
                                        <div className="text-center">
                                            <div className="relative w-14 h-14 mx-auto mb-5">
                                                <div className="absolute inset-0 border-2 border-[#F54029]/15 rounded-full" />
                                                <div className="absolute inset-0 border-2 border-transparent border-t-[#F54029] rounded-full animate-spin" />
                                            </div>
                                            <p className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">Decoding Codex</p>
                                        </div>
                                    </div>
                                }
                                error={
                                    <div className="flex items-center justify-center min-h-[65vh]">
                                        <div className="text-center">
                                            <FileText className="mx-auto text-red-400/30 mb-4" size={48} />
                                            <p className="text-sm text-red-400/50 mb-2">Failed to load</p>
                                            <a href={PDF_PATH} download className="text-xs text-[#F54029] hover:underline">Download directly →</a>
                                        </div>
                                    </div>
                                }>
                                <div className="relative group">
                                    {/* Animated corner brackets on the page */}
                                    <div className="absolute -top-2 -left-2 w-5 h-5 border-l border-t border-[#F54029]/30 rounded-tl-sm transition-all duration-300 group-hover:w-7 group-hover:h-7 group-hover:border-[#F54029]/50" />
                                    <div className="absolute -top-2 -right-2 w-5 h-5 border-r border-t border-[#F54029]/30 rounded-tr-sm transition-all duration-300 group-hover:w-7 group-hover:h-7 group-hover:border-[#F54029]/50" />
                                    <div className="absolute -bottom-2 -left-2 w-5 h-5 border-l border-b border-[#F54029]/30 rounded-bl-sm transition-all duration-300 group-hover:w-7 group-hover:h-7 group-hover:border-[#F54029]/50" />
                                    <div className="absolute -bottom-2 -right-2 w-5 h-5 border-r border-b border-[#F54029]/30 rounded-br-sm transition-all duration-300 group-hover:w-7 group-hover:h-7 group-hover:border-[#F54029]/50" />
                                    <div className="shadow-2xl shadow-black/60 rounded overflow-hidden">
                                        <Page pageNumber={pageNumber} width={pageWidth * scale} renderTextLayer={true} renderAnnotationLayer={true} />
                                    </div>
                                </div>
                            </Document>
                            {/* Click zones */}
                            {isLoaded && (
                                <>
                                    <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1} className="absolute left-0 top-0 bottom-0 w-1/5 group disabled:cursor-default z-10" aria-label="Previous">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/0 group-hover:bg-white/5 border border-transparent group-hover:border-white/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 group-disabled:hidden"><ChevronLeft size={15} className="text-white/50" /></div>
                                    </button>
                                    <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages} className="absolute right-0 top-0 bottom-0 w-1/5 group disabled:cursor-default z-10" aria-label="Next">
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/0 group-hover:bg-white/5 border border-transparent group-hover:border-white/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 group-disabled:hidden"><ChevronRight size={15} className="text-white/50" /></div>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom bar */}
                {isLoaded && (
                    <div className={`flex items-center justify-between px-5 py-2.5 text-[9px] font-mono text-white/15 ${isFullscreen ? 'bg-black/90 backdrop-blur-2xl border-t border-white/5' : 'mt-3'}`}>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500/80 rounded-full animate-pulse" />LOADED</span>
                            <span className="hidden sm:inline">{numPages} SLIDES</span>
                        </div>
                        {/* Mobile nav */}
                        <div className="flex sm:hidden items-center gap-3 text-white/30">
                            <button onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1} className="disabled:opacity-20"><ChevronLeft size={14} /></button>
                            <span>{pageNumber}/{numPages}</span>
                            <button onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages} className="disabled:opacity-20"><ChevronRight size={14} /></button>
                        </div>
                        <div className="hidden sm:flex items-center gap-4 tracking-wider">
                            <span>← → NAVIGATE</span><span>F FULLSCREEN</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Keyframe injection */}
            <style jsx global>{`
                @keyframes scanDown {
                    0% { top: -2%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 102%; opacity: 0; }
                }
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </>
    )
}
