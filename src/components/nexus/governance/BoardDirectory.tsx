'use client'

import { useState, useEffect } from 'react'
import { Users, Crown, Eye, Shield, Plus, X, Edit2, UserCheck, Star } from 'lucide-react'

interface BoardMember {
    id: string
    name: string
    email: string
    seat_type: 'founder' | 'at_large' | 'observer' | 'independent'
    seat_class: string
    title: string
    committees: string[]
    appointed_by: string
    term_start: string
    term_end: string
    voting_rights: boolean
    equity_percentage: number
    bio: string
}

const SEAT_BADGES: Record<string, { label: string; color: string; icon: any }> = {
    founder: { label: 'Founder Director', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: Crown },
    at_large: { label: 'At-Large Director', color: 'text-red-400 bg-red-500/10 border-red-500/20', icon: UserCheck },
    independent: { label: 'Independent Director', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: Shield },
    observer: { label: 'Board Observer', color: 'text-white/40 bg-white/5 border-white/10', icon: Eye },
}

const COMMITTEES = ['audit', 'compensation', 'nominating', 'governance', 'strategy', 'finance']

export default function BoardDirectory({ isAdmin = false }: { isAdmin?: boolean }) {
    const [directors, setDirectors] = useState<BoardMember[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<BoardMember | null>(null)
    const [form, setForm] = useState({
        name: '', email: '', seat_type: 'at_large', seat_class: '', title: 'Director',
        committees: [] as string[], appointed_by: '', bio: '', equity_percentage: 0,
        term_start: '', term_end: '', voting_rights: true
    })

    useEffect(() => { fetchDirectors() }, [])

    async function fetchDirectors() {
        try {
            const res = await fetch('/api/nexus/board?type=director')
            const data = await res.json()
            setDirectors(data.directors || [])
        } catch (e) { console.error(e) }
        setLoading(false)
    }

    async function handleSave() {
        try {
            await fetch('/api/nexus/board', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    entity_type: 'director',
                    ...(editing ? { id: editing.id } : {})
                })
            })
            setShowForm(false)
            setEditing(null)
            resetForm()
            fetchDirectors()
        } catch (e) { console.error(e) }
    }

    async function handleRemove(id: string) {
        if (!confirm('Remove this director from the board?')) return
        try {
            await fetch(`/api/nexus/board?id=${id}&type=director`, { method: 'DELETE' })
            fetchDirectors()
        } catch (e) { console.error(e) }
    }

    function openEdit(d: BoardMember) {
        setEditing(d)
        setForm({
            name: d.name, email: d.email, seat_type: d.seat_type, seat_class: d.seat_class || '',
            title: d.title || 'Director', committees: d.committees || [], appointed_by: d.appointed_by || '',
            bio: d.bio || '', equity_percentage: d.equity_percentage || 0,
            term_start: d.term_start || '', term_end: d.term_end || '', voting_rights: d.voting_rights
        })
        setShowForm(true)
    }

    function resetForm() {
        setForm({
            name: '', email: '', seat_type: 'at_large', seat_class: '', title: 'Director',
            committees: [], appointed_by: '', bio: '', equity_percentage: 0,
            term_start: '', term_end: '', voting_rights: true
        })
    }

    function toggleCommittee(c: string) {
        setForm(f => ({
            ...f,
            committees: f.committees.includes(c) ? f.committees.filter(x => x !== c) : [...f.committees, c]
        }))
    }

    const founderSeats = directors.filter(d => d.seat_type === 'founder')
    const otherSeats = directors.filter(d => d.seat_type !== 'founder')

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-rajdhani text-white tracking-wide">Board of Directors</h2>
                    <p className="text-sm text-white/40 mt-1">DGCL §141 — Corporate governance and director management</p>
                </div>
                {isAdmin && (
                    <button onClick={() => { resetForm(); setEditing(null); setShowForm(true) }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#F54029]/20 transition-all">
                        <Plus size={14} /> Add Director
                    </button>
                )}
            </div>

            {/* Founder Directors */}
            {founderSeats.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400/60 flex items-center gap-2">
                        <Crown size={12} /> Class F — Founder Directors (§5.2)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {founderSeats.map(d => (
                            <div key={d.id} className="relative group p-6 bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10 rounded-2xl hover:border-amber-500/30 transition-all">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl" />
                                <div className="flex items-start justify-between mb-4 relative z-10">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center text-amber-400 font-bold text-lg border border-amber-500/20">
                                        {d.name.charAt(0)}
                                    </div>
                                    {isAdmin && (
                                        <button onClick={() => openEdit(d)} className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white transition-all">
                                            <Edit2 size={14} />
                                        </button>
                                    )}
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1">{d.name}</h4>
                                <p className="text-xs text-amber-400/60 uppercase tracking-wider font-bold mb-3">{d.seat_class || 'Class F'} • {d.title || 'Director'}</p>
                                {d.equity_percentage > 0 && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <Star size={12} className="text-amber-400/40" />
                                        <span className="text-xs text-white/60 font-mono">{d.equity_percentage}% Equity</span>
                                    </div>
                                )}
                                {d.committees?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {d.committees.map(c => (
                                            <span key={c} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[10px] text-white/40 uppercase tracking-wider capitalize">{c}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Other Directors */}
            {otherSeats.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                        <Users size={12} /> Additional Directors
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {otherSeats.map(d => {
                            const badge = SEAT_BADGES[d.seat_type] || SEAT_BADGES.at_large
                            const Icon = badge.icon
                            return (
                                <div key={d.id} className="group p-5 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-all">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/60 font-bold">
                                            {d.name.charAt(0)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${badge.color}`}>
                                                <Icon size={10} className="inline mr-1" />{badge.label}
                                            </span>
                                            {isAdmin && (
                                                <button onClick={() => openEdit(d)} className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-white transition-all">
                                                    <Edit2 size={12} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-white">{d.name}</h4>
                                    <p className="text-xs text-white/40 mt-1">{d.title || 'Director'}</p>
                                    {!d.voting_rights && <p className="text-[10px] text-white/20 mt-2 uppercase tracking-wider">Non-voting</p>}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {!loading && directors.length === 0 && (
                <div className="py-16 text-center border border-dashed border-white/10 rounded-2xl">
                    <Users className="mx-auto text-white/10 mb-4" size={48} />
                    <p className="text-white/40">No board members configured.</p>
                    {isAdmin && <p className="text-xs text-white/20 mt-2">Add founder directors to establish the board.</p>}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setShowForm(false)}>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-rajdhani text-white">{editing ? 'Edit Director' : 'Add Director'}</h3>
                            <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Name</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="Director name" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Seat Type</label>
                                    <select value={form.seat_type} onChange={e => setForm(f => ({ ...f, seat_type: e.target.value }))}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029] appearance-none cursor-pointer"
                                        style={{ colorScheme: 'dark' }}>
                                        <option value="founder" className="bg-[#111] text-white">Founder</option>
                                        <option value="at_large" className="bg-[#111] text-white">At-Large</option>
                                        <option value="independent" className="bg-[#111] text-white">Independent</option>
                                        <option value="observer" className="bg-[#111] text-white">Observer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Seat Class</label>
                                    <input value={form.seat_class} onChange={e => setForm(f => ({ ...f, seat_class: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="e.g. F-1" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Email</label>
                                    <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="Email" />
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Title</label>
                                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="Director" />
                                </div>
                            </div>
                            {form.seat_type === 'founder' && (
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Equity %</label>
                                    <input type="number" value={form.equity_percentage} onChange={e => setForm(f => ({ ...f, equity_percentage: parseFloat(e.target.value) }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" />
                                </div>
                            )}
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-2">Committees</label>
                                <div className="flex flex-wrap gap-2">
                                    {COMMITTEES.map(c => (
                                        <button key={c} onClick={() => toggleCommittee(c)}
                                            className={`px-3 py-1.5 text-xs rounded-lg border transition-all capitalize ${form.committees.includes(c) ? 'bg-[#F54029]/10 border-[#F54029]/30 text-[#F54029]' : 'bg-white/5 border-white/5 text-white/40 hover:text-white'}`}>
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Bio</label>
                                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029] h-20 resize-none" />
                            </div>
                            <button onClick={handleSave}
                                className="w-full py-3 bg-[#F54029] text-white font-bold rounded-xl uppercase tracking-wider text-xs hover:bg-[#C53020] transition-all">
                                {editing ? 'Update Director' : 'Add Director'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
