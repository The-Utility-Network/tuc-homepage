'use client'

import { useState, useEffect } from 'react'
import { Briefcase, Plus, X, Edit2, Building2 } from 'lucide-react'

interface OfficerRecord {
    id: string
    name: string
    email: string
    title: string
    department: string
    appointed_by: string
    appointment_date: string
    is_active: boolean
    responsibilities: string
    compensation_reference: string
}

const STANDARD_TITLES = [
    'Chief Executive Officer', 'Chief Technology Officer', 'Chief Revenue Officer',
    'Chief Financial Officer', 'Chief Operating Officer', 'Secretary', 'Treasurer',
    'General Counsel', 'VP of Engineering', 'VP of Sales', 'VP of Marketing'
]

export default function OfficerRegistry({ isAdmin = false }: { isAdmin?: boolean }) {
    const [officers, setOfficers] = useState<OfficerRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState<OfficerRecord | null>(null)
    const [form, setForm] = useState({
        name: '', email: '', title: '', department: '',
        appointed_by: 'board', responsibilities: '', appointment_date: ''
    })

    useEffect(() => { fetchOfficers() }, [])

    async function fetchOfficers() {
        try {
            const res = await fetch('/api/nexus/board?type=officer')
            const data = await res.json()
            setOfficers(data.officers || [])
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
                    entity_type: 'officer',
                    ...(editing ? { id: editing.id } : {})
                })
            })
            setShowForm(false)
            setEditing(null)
            fetchOfficers()
        } catch (e) { console.error(e) }
    }

    async function handleRemove(id: string) {
        if (!confirm('Remove this officer?')) return
        try {
            await fetch(`/api/nexus/board?id=${id}&type=officer`, { method: 'DELETE' })
            fetchOfficers()
        } catch (e) { console.error(e) }
    }

    function getTitleAbbr(title: string) {
        const map: Record<string, string> = {
            'Chief Executive Officer': 'CEO', 'Chief Technology Officer': 'CTO',
            'Chief Revenue Officer': 'CRO', 'Chief Financial Officer': 'CFO',
            'Chief Operating Officer': 'COO', 'General Counsel': 'GC',
        }
        return map[title] || title.split(' ').map(w => w[0]).join('')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold font-rajdhani text-white tracking-wide">Corporate Officers</h2>
                    <p className="text-sm text-white/40 mt-1">DGCL §142 — Appointed by the Board of Directors</p>
                </div>
                {isAdmin && (
                    <button onClick={() => { setEditing(null); setForm({ name: '', email: '', title: '', department: '', appointed_by: 'board', responsibilities: '', appointment_date: '' }); setShowForm(true) }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#F54029]/20 transition-all">
                        <Plus size={14} /> Appoint Officer
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {officers.map(o => (
                    <div key={o.id} className="group p-6 bg-white/[0.02] border border-white/5 rounded-xl hover:border-[#F54029]/20 transition-all relative">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F54029]/10 to-[#F54029]/5 flex items-center justify-center text-[#F54029] font-bold text-sm border border-[#F54029]/10">
                                {getTitleAbbr(o.title)}
                            </div>
                            {isAdmin && (
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => { setEditing(o); setForm({ name: o.name, email: o.email || '', title: o.title, department: o.department || '', appointed_by: o.appointed_by || 'board', responsibilities: o.responsibilities || '', appointment_date: o.appointment_date || '' }); setShowForm(true) }}
                                        className="text-white/30 hover:text-white p-1"><Edit2 size={12} /></button>
                                    <button onClick={() => handleRemove(o.id)}
                                        className="text-white/30 hover:text-red-400 p-1"><X size={12} /></button>
                                </div>
                            )}
                        </div>
                        <h4 className="font-bold text-white mb-0.5">{o.name}</h4>
                        <p className="text-sm text-[#F54029]/80 font-bold uppercase tracking-wider mb-2">{o.title}</p>
                        {o.department && <p className="text-xs text-white/30 flex items-center gap-1"><Building2 size={10} /> {o.department}</p>}
                        {o.appointment_date && (
                            <p className="text-[10px] text-white/20 uppercase tracking-wider mt-3">
                                Appointed {new Date(o.appointment_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {!loading && officers.length === 0 && (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
                    <Briefcase className="mx-auto text-white/10 mb-4" size={40} />
                    <p className="text-white/40">No officers appointed.</p>
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setShowForm(false)}>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-rajdhani text-white">{editing ? 'Edit Officer' : 'Appoint Officer'}</h3>
                            <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Name</label>
                                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" />
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Title</label>
                                <select value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]">
                                    <option value="">Select title...</option>
                                    {STANDARD_TITLES.map(t => <option key={t} value={t}>{t}</option>)}
                                    <option value="custom">Custom Title</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Email</label>
                                    <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" />
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Department</label>
                                    <input value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Appointment Date</label>
                                <input type="date" value={form.appointment_date} onChange={e => setForm(f => ({ ...f, appointment_date: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" />
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Responsibilities</label>
                                <textarea value={form.responsibilities} onChange={e => setForm(f => ({ ...f, responsibilities: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029] h-20 resize-none" />
                            </div>
                            <button onClick={handleSave}
                                className="w-full py-3 bg-[#F54029] text-white font-bold rounded-xl uppercase tracking-wider text-xs hover:bg-[#C53020] transition-all">
                                {editing ? 'Update Officer' : 'Appoint Officer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
