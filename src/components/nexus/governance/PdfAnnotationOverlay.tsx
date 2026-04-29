'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { MessageCircle, Trash2, X, Highlighter, Send } from 'lucide-react'

interface Annotation {
    id: string
    document_key: string
    page: number
    type: 'highlight' | 'comment' | 'text-highlight'
    x: number
    y: number
    width: number
    height: number
    text: string
    user_email: string
    user_name: string
    user_color: string
    rects?: { x: number; y: number; width: number; height: number }[]
    created_at: string
}

// High-contrast annotation color palette
export const ANNOTATION_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#FF8C42', '#6BCB77', '#4D96FF', '#FF6B9D',
    '#C792EA', '#82AAFF', '#F78C6C', '#FFCB6B', '#89DDFF',
]

// Deterministic color from email using FNV-1a hash
export function userColor(email: string): string {
    let hash = 0x811c9dc5 // FNV offset basis
    for (let i = 0; i < email.length; i++) {
        hash ^= email.charCodeAt(i)
        hash = (hash * 0x01000193) >>> 0 // FNV prime, unsigned
    }
    return ANNOTATION_COLORS[hash % ANNOTATION_COLORS.length]
}

// localStorage-backed color preference
export function getUserColor(email: string): string {
    if (typeof window === 'undefined') return userColor(email)
    const stored = localStorage.getItem(`annotation-color-${email}`)
    return stored || userColor(email)
}

export function setUserColor(email: string, color: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem(`annotation-color-${email}`, color)
    }
}

interface Props {
    documentKey: string
    pageNumber: number
    userEmail: string
    userName: string
    activeTool: 'none' | 'highlight' | 'text-highlight' | 'comment'
    userColorOverride?: string
    onColorChange?: (color: string) => void
}

export default function PdfAnnotationOverlay({ documentKey, pageNumber, userEmail, userName, activeTool, userColorOverride, onColorChange }: Props) {
    const [annotations, setAnnotations] = useState<Annotation[]>([])
    const [drawing, setDrawing] = useState(false)
    const [drawStart, setDrawStart] = useState({ x: 0, y: 0 })
    const [drawCurrent, setDrawCurrent] = useState({ x: 0, y: 0 })
    const [commentPos, setCommentPos] = useState<{ x: number; y: number } | null>(null)
    const [commentText, setCommentText] = useState('')
    const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null)
    const overlayRef = useRef<HTMLDivElement>(null)

    interface PendingSelection {
        type: 'highlight' | 'text-highlight' | 'comment';
        rects?: { x: number; y: number; width: number; height: number }[];
        minX: number;
        minY: number;
        maxW: number;
        maxH: number;
        showCommentInput?: boolean;
    }
    const [pendingSelection, setPendingSelection] = useState<PendingSelection | null>(null)
    const [pendingComment, setPendingComment] = useState('')
    const myColor = userColorOverride || getUserColor(userEmail)

    // Fetch annotations for current page
    useEffect(() => {
        if (!documentKey) return
        fetch(`/api/nexus/annotations?key=${encodeURIComponent(documentKey)}&page=${pageNumber}`)
            .then(r => r.json())
            .then(d => setAnnotations(d.annotations || []))
            .catch(() => { })
    }, [documentKey, pageNumber])

    // Close comment input when switching tools
    useEffect(() => {
        if (activeTool !== 'comment') {
            setCommentPos(null)
            setCommentText('')
        }
    }, [activeTool])

    // Convert mouse event to percentage coordinates
    const toPercent = useCallback((e: React.MouseEvent) => {
        if (!overlayRef.current) return { x: 0, y: 0 }
        const rect = overlayRef.current.getBoundingClientRect()
        return {
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100
        }
    }, [])

    function handleMouseDown(e: React.MouseEvent) {
        if (activeTool === 'highlight') {
            const pos = toPercent(e)
            setDrawing(true)
            setDrawStart(pos)
            setDrawCurrent(pos)
        } else if (activeTool === 'comment') {
            const pos = toPercent(e)
            setCommentPos(pos)
        }
    }

    function handleMouseMove(e: React.MouseEvent) {
        if (drawing && activeTool === 'highlight') {
            setDrawCurrent(toPercent(e))
        }
    }

    async function handleMouseUp() {
        if (drawing && activeTool === 'highlight') {
            setDrawing(false)
            const x = Math.min(drawStart.x, drawCurrent.x)
            const y = Math.min(drawStart.y, drawCurrent.y)
            const w = Math.abs(drawCurrent.x - drawStart.x)
            const h = Math.abs(drawCurrent.y - drawStart.y)

            if (w < 1 && h < 1) return

            setPendingSelection({ type: 'highlight', minX: x, minY: y, maxW: w, maxH: h, showCommentInput: false })
        }
    }

    useEffect(() => {
        const handleGlobalMouseUp = async (e: MouseEvent) => {
            // Ignore mouse up if we are interacting with the toolbars
            if ((e.target as HTMLElement).closest('.annotation-toolbar')) return;

            if (activeTool === 'none') {
                const sel = window.getSelection();
                if (sel && sel.rangeCount > 0 && !sel.isCollapsed && sel.toString().trim() && overlayRef.current) {
                    const range = sel.getRangeAt(0);
                    const clientRects = Array.from(range.getClientRects());
                    if (clientRects.length > 0) {
                        const containerRect = overlayRef.current.getBoundingClientRect();
                        
                        // Filter out empty rects, very thin rects, and massive wrapper rects (height > 20% of page)
                        const validRects = clientRects.filter(r => r.width > 2 && r.height > 2 && r.height < containerRect.height * 0.2);
                        if (validRects.length === 0) return;

                        // Merge rects that are on the same vertical line to prevent sporadic fractured boxes
                        const mergedRects: { left: number, top: number, right: number, bottom: number }[] = [];
                        for (const r of validRects) {
                            let merged = false;
                            for (const m of mergedRects) {
                                // If they overlap vertically by at least 50%
                                const mHeight = m.bottom - m.top;
                                const verticalOverlap = Math.max(0, Math.min(r.bottom, m.bottom) - Math.max(r.top, m.top));
                                if (verticalOverlap > Math.min(r.height, mHeight) * 0.5) {
                                    m.left = Math.min(m.left, r.left);
                                    m.right = Math.max(m.right, r.right);
                                    m.top = Math.min(m.top, r.top);
                                    m.bottom = Math.max(m.bottom, r.bottom);
                                    merged = true;
                                    break;
                                }
                            }
                            if (!merged) {
                                mergedRects.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
                            }
                        }

                        const rects = mergedRects.map(m => ({
                            x: ((m.left - containerRect.left) / containerRect.width) * 100,
                            y: ((m.top - containerRect.top) / containerRect.height) * 100,
                            width: ((m.right - m.left) / containerRect.width) * 100,
                            height: ((m.bottom - m.top) / containerRect.height) * 100
                        }));

                        const minX = Math.min(...rects.map(r => r.x));
                        const minY = Math.min(...rects.map(r => r.y));
                        const maxW = Math.max(...rects.map(r => r.x + r.width)) - minX;
                        const maxH = Math.max(...rects.map(r => r.y + r.height)) - minY;

                        setPendingSelection({ type: 'text-highlight', rects, minX, minY, maxW, maxH, showCommentInput: false });
                    }
                } else if (sel?.isCollapsed) {
                    setPendingSelection(null);
                }
            }
        };

        const handleGlobalClick = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest('.annotation-toolbar') && !((e.target as HTMLElement).closest('[data-annotation-id]'))) {
                setSelectedAnnotation(null);
            }
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        window.addEventListener('click', handleGlobalClick, true);
        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
            window.removeEventListener('click', handleGlobalClick, true);
        };
    }, [activeTool, documentKey, pageNumber, userEmail, userName, myColor]);

    async function commitPendingSelection(textToSave: string | any = '') {
        if (!pendingSelection) return;
        const textToPersist = (typeof textToSave === 'string' && textToSave.trim() !== '') ? textToSave : pendingComment;
        const { type, minX, minY, maxW, maxH, rects } = pendingSelection;
        try {
            const body = {
                document_key: documentKey, page: pageNumber, type,
                x: minX, y: minY, width: maxW, height: maxH, text: textToPersist.trim(),
                user_email: userEmail, user_name: userName, user_color: myColor,
                ...(type === 'text-highlight' ? { rects } : {})
            };
            const res = await fetch('/api/nexus/annotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (data.id) {
                setAnnotations(prev => [...prev, {
                    id: data.id, document_key: documentKey, page: pageNumber,
                    type, x: minX, y: minY, width: maxW, height: maxH, rects: rects, text: textToPersist.trim(),
                    user_email: userEmail, user_name: userName, user_color: myColor,
                    created_at: new Date().toISOString()
                }]);
            }
        } catch (e) { console.error(e) }
        setPendingSelection(null);
        setPendingComment('');
        window.getSelection()?.removeAllRanges();
    }

    async function handleCommentSubmit() {
        if (!commentPos || !commentText.trim()) return
        try {
            const res = await fetch('/api/nexus/annotations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    document_key: documentKey, page: pageNumber, type: 'comment',
                    x: commentPos.x, y: commentPos.y,
                    text: commentText, user_email: userEmail, user_name: userName, user_color: myColor
                })
            })
            const data = await res.json()
            if (data.id) {
                setAnnotations(prev => [...prev, {
                    id: data.id, document_key: documentKey, page: pageNumber,
                    type: 'comment', x: commentPos.x, y: commentPos.y, width: 0, height: 0,
                    text: commentText, user_email: userEmail, user_name: userName, user_color: myColor,
                    created_at: new Date().toISOString()
                }])
            }
        } catch (e) { console.error(e) }
        setCommentText('')
        setCommentPos(null)
    }

    async function handleDelete(id: string) {
        try {
            await fetch(`/api/nexus/annotations?id=${id}&email=${encodeURIComponent(userEmail)}`, { method: 'DELETE' })
            setAnnotations(prev => prev.filter(a => a.id !== id))
        } catch (e) { console.error(e) }
    }

    return (
        <div
            ref={overlayRef}
            className="absolute inset-0"
            style={{
                cursor: activeTool === 'highlight' ? 'crosshair' : activeTool === 'comment' ? 'cell' : activeTool === 'text-highlight' ? 'text' : 'default',
                pointerEvents: (activeTool === 'highlight' || activeTool === 'comment') ? 'auto' : 'none',
                zIndex: 10,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* Pending Native Text Selection Floating Toolbar */}
            {pendingSelection && (
                <div className="absolute annotation-toolbar bg-[#111] border border-white/10 rounded-xl flex items-center gap-2 whitespace-nowrap z-[70] shadow-2xl p-1" style={{ 
                    left: `${pendingSelection.minX + (pendingSelection.maxW / 2)}%`, 
                    top: `calc(${pendingSelection.minY}% - 40px)`,
                    transform: 'translateX(-50%)',
                    pointerEvents: 'auto'
                }}>
                    {!pendingSelection.showCommentInput ? (
                        <>
                            <button onClick={() => commitPendingSelection()} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors">
                                <Highlighter size={12} /> Highlight
                            </button>
                            <div className="w-[1px] h-4 bg-white/10" />
                            <button onClick={() => setPendingSelection({ ...pendingSelection, showCommentInput: true })} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                <MessageCircle size={12} /> Comment
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 px-2 py-1">
                            <input autoFocus value={pendingComment} onChange={e => setPendingComment(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') commitPendingSelection(pendingComment) }} className="bg-transparent text-xs text-white outline-none w-48 placeholder:text-white/20" placeholder="Type a comment and press enter..." />
                            <button onClick={() => commitPendingSelection(pendingComment)} className="text-[#F54029] hover:text-white"><Send size={12} /></button>
                        </div>
                    )}
                </div>
            )}

            {/* Existing Area Highlights */}
            {annotations.filter(a => a.type === 'highlight').map(a => (
                <div
                    key={a.id}
                    className="absolute group"
                    style={{
                        left: `${a.x}%`, top: `${a.y}%`,
                        width: `${a.width}%`, height: `${a.height}%`,
                        backgroundColor: a.user_color + '35',
                        border: selectedAnnotation === a.id ? `3px solid ${a.user_color}` : `2px solid ${a.user_color}80`,
                        borderRadius: '2px',
                        pointerEvents: 'auto',
                        cursor: 'pointer'
                    }}
                    onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setSelectedAnnotation(a.id); }}
                >
                    {selectedAnnotation === a.id && (
                        <div className="absolute -top-7 left-0 bg-[#111] border border-white/10 rounded px-2 py-0.5 flex items-center gap-2 whitespace-nowrap z-20 shadow-xl" style={{ pointerEvents: 'auto' }}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.user_color }} />
                            <span className="text-[9px] text-white/60 font-bold">{a.user_name || a.user_email.split('@')[0]}</span>
                            {a.user_email === userEmail && (
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(a.id) }} className="text-red-400/60 hover:text-red-400 p-0.5 rounded hover:bg-white/5 transition-colors">
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}

                    {/* Existing Text Highlights */}
            {annotations.filter(a => a.type === 'text-highlight').map(a => (
                <div
                    key={a.id}
                    className="absolute"
                    data-annotation-id={a.id}
                    style={{
                        left: `${a.x}%`, top: `${a.y}%`,
                        width: `${a.width}%`, height: `${a.height}%`,
                        pointerEvents: 'none',
                        zIndex: 5
                    }}
                >
                    {a.rects?.map((r, i) => (
                        <div key={i} className="absolute" style={{
                            left: `${((r.x - a.x) / a.width) * 100}%`,
                            top: `${((r.y - a.y) / a.height) * 100}%`,
                            width: `${(r.width / a.width) * 100}%`,
                            height: `${(r.height / a.height) * 100}%`,
                            backgroundColor: a.user_color + (selectedAnnotation === a.id ? '60' : '35'),
                            pointerEvents: 'auto',
                            cursor: 'pointer'
                        }} 
                        onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setSelectedAnnotation(a.id); }} />
                    ))}

                    {/* Popover */}
                    {selectedAnnotation === a.id && (
                        <div className="absolute annotation-toolbar -top-9 left-1/2 -translate-x-1/2 bg-[#111] border border-white/10 rounded-lg px-3 py-2 flex flex-col gap-2 z-[60] shadow-2xl min-w-[150px]" style={{ pointerEvents: 'auto' }}>
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.user_color }} />
                                    <span className="text-[10px] text-white/60 font-bold">{a.user_name || a.user_email.split('@')[0]}</span>
                                </div>
                                {a.user_email === userEmail && (
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(a.id) }} className="text-red-400/60 hover:text-red-400 p-0.5 rounded hover:bg-white/5 transition-colors">
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Existing Comments (pins) */}
            {annotations.filter(a => a.type === 'comment').map(a => (
                <div
                    key={a.id}
                    className="absolute"
                    style={{
                        left: `${a.x}%`, top: `${a.y}%`,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'auto',
                        zIndex: selectedAnnotation === a.id ? 30 : 15
                    }}
                    onClick={(e) => { e.stopPropagation(); e.nativeEvent.stopImmediatePropagation(); setSelectedAnnotation(a.id); }}
                >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform ${selectedAnnotation === a.id ? 'scale-110 ring-2 ring-white/50' : 'hover:scale-110'}`}
                        style={{ backgroundColor: a.user_color }}>
                        <MessageCircle size={12} className="text-white" />
                    </div>
                    {selectedAnnotation === a.id && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-[#111] border border-white/10 rounded-lg p-3 min-w-[200px] max-w-[280px] z-30 shadow-xl" style={{ pointerEvents: 'auto' }}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: a.user_color }} />
                                    <span className="text-[10px] font-bold text-white/80">{a.user_name || a.user_email.split('@')[0]}</span>
                                </div>
                                {a.user_email === userEmail && (
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(a.id) }} className="text-red-400/60 hover:text-red-400 p-1 hover:bg-white/5 rounded transition-colors">
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* Active highlight drawing preview */}
            {drawing && (
                <div className="absolute pointer-events-none" style={{
                    left: `${Math.min(drawStart.x, drawCurrent.x)}%`,
                    top: `${Math.min(drawStart.y, drawCurrent.y)}%`,
                    width: `${Math.abs(drawCurrent.x - drawStart.x)}%`,
                    height: `${Math.abs(drawCurrent.y - drawStart.y)}%`,
                    backgroundColor: myColor + '30',
                    border: `2px dashed ${myColor}`,
                    borderRadius: '2px',
                }} />
            )}

            {/* Comment input popover */}
            {commentPos && (
                <div className="absolute z-30" style={{ left: `${commentPos.x}%`, top: `${commentPos.y}%`, pointerEvents: 'auto' }}
                    onClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: myColor, transform: 'translate(-50%, -50%)' }} />
                    <div className="absolute top-2 left-2 bg-[#111] border border-white/10 rounded-xl p-3 min-w-[200px] shadow-2xl">
                        <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: myColor }} />
                            <span className="text-[9px] text-white/40">{userName || 'You'}</span>
                        </div>
                        <textarea
                            autoFocus
                            value={commentText}
                            onChange={e => setCommentText(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white outline-none resize-none h-16 focus:border-[#F54029] placeholder:text-white/20"
                        />
                        <div className="flex gap-2 mt-2">
                            <button onClick={handleCommentSubmit} disabled={!commentText.trim()}
                                className="flex-1 py-1.5 bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#F54029]/20 transition-all disabled:opacity-30">
                                Post
                            </button>
                            <button onClick={() => { setCommentPos(null); setCommentText('') }}
                                className="py-1.5 px-3 bg-white/5 border border-white/10 text-white/40 rounded-lg text-[10px] hover:text-white transition-all">
                                <X size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Marginal Comments Sidebar */}
            {annotations.filter(a => a.text).length > 0 && (
                <div className="absolute top-0 -right-4 translate-x-full w-64 flex flex-col gap-3 pointer-events-auto z-10 max-h-full overflow-visible pb-16 hidden xl:flex">
                    {annotations.filter(a => a.text).map((a, i) => (
                        <div key={`margin-${a.id}`} 
                            onMouseEnter={() => setSelectedAnnotation(a.id)}
                            onMouseLeave={() => setSelectedAnnotation(null)}
                            className={`p-3 bg-[#111] border rounded-xl transition-all shadow-xl ${selectedAnnotation === a.id ? 'border-[#F54029]' : 'border-white/10'}`} 
                            style={{ borderLeftWidth: '4px', borderLeftColor: a.user_color }}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: a.user_color }} />
                                    <span className="text-[10px] text-white/60 font-bold">{a.user_name || a.user_email.split('@')[0]}</span>
                                </div>
                                {a.user_email === userEmail && (
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(a.id) }} className="text-red-400/60 hover:text-red-400 transition-colors">
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                            <p className="text-xs text-white/80 whitespace-pre-wrap">{a.text}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
