'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, X, Clock, Users, FileText, CheckCircle, AlertTriangle, Video, MapPin } from 'lucide-react'

interface Meeting {
    id: string
    title: string
    meeting_type: string
    date: string
    time: string
    location: string
    status: string
    agenda_items: { title: string; description: string; presenter: string; duration_minutes: number; status: string }[]
    attendees: { member_id: string; name: string; present: boolean }[]
    quorum_required: number
    quorum_met: boolean
    minutes: string
    minutes_approved: boolean
    action_items: { description: string; assigned_to: string; due_date: string; status: string }[]
    notice_sent_at: string
    notice_waived: boolean
    created_at: string
}

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
    regular: { label: 'Regular', color: 'text-red-400 bg-red-500/10' },
    special: { label: 'Special', color: 'text-amber-400 bg-amber-500/10' },
    annual: { label: 'Annual', color: 'text-emerald-400 bg-emerald-500/10' },
    organizational: { label: 'Organizational', color: 'text-purple-400 bg-purple-500/10' },
    committee: { label: 'Committee', color: 'text-cyan-400 bg-cyan-500/10' },
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    scheduled: { label: 'Scheduled', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    in_progress: { label: 'In Progress', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    completed: { label: 'Completed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
}

export default function MeetingManager({ isAdmin = false }: { isAdmin?: boolean }) {
    const [meetings, setMeetings] = useState<Meeting[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
    const [filter, setFilter] = useState<string>('all')
    const [form, setForm] = useState({
        title: '', meeting_type: 'regular', date: '', time: '10:00',
        location: '', agenda_items: [{ title: '', description: '', presenter: '', duration_minutes: 15, status: 'pending' }],
    })

    useEffect(() => { fetchMeetings() }, [])

    async function fetchMeetings() {
        try {
            const res = await fetch('/api/nexus/meetings')
            const data = await res.json()
            setMeetings(data.meetings || [])
        } catch (e) { console.error(e) }
        setLoading(false)
    }

    async function handleSave() {
        try {
            await fetch('/api/nexus/meetings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            })
            setShowForm(false)
            fetchMeetings()
        } catch (e) { console.error(e) }
    }

    async function updateStatus(id: string, status: string) {
        try {
            await fetch('/api/nexus/meetings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            })
            fetchMeetings()
        } catch (e) { console.error(e) }
    }

    function addAgendaItem() {
        setForm(f => ({
            ...f,
            agenda_items: [...f.agenda_items, { title: '', description: '', presenter: '', duration_minutes: 15, status: 'pending' }]
        }))
    }

    function removeAgendaItem(idx: number) {
        setForm(f => ({ ...f, agenda_items: f.agenda_items.filter((_, i) => i !== idx) }))
    }

    function updateAgendaItem(idx: number, field: string, value: any) {
        setForm(f => ({
            ...f,
            agenda_items: f.agenda_items.map((item, i) => i === idx ? { ...item, [field]: value } : item)
        }))
    }

    const filtered = filter === 'all' ? meetings : meetings.filter(m => m.status === filter)
    const upcoming = meetings.filter(m => m.status === 'scheduled' && new Date(m.date) >= new Date())
    const past = meetings.filter(m => m.status === 'completed')

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-rajdhani text-white tracking-wide">Board Meetings</h2>
                    <p className="text-sm text-white/40 mt-1">DGCL §141(b) — Meeting management and minutes archive</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
                        {['all', 'scheduled', 'completed', 'cancelled'].map(f => (
                            <button key={f} onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${filter === f ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}>
                                {f === 'all' ? 'All' : f}
                            </button>
                        ))}
                    </div>
                    {isAdmin && (
                        <button onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#F54029]/20 transition-all">
                            <Plus size={14} /> Schedule Meeting
                        </button>
                    )}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Total Meetings</p>
                    <p className="text-2xl font-mono text-white">{meetings.length}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Upcoming</p>
                    <p className="text-2xl font-mono text-[#F54029]">{upcoming.length}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Completed</p>
                    <p className="text-2xl font-mono text-emerald-400">{past.length}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Minutes Pending</p>
                    <p className="text-2xl font-mono text-amber-400">{past.filter(m => !m.minutes_approved).length}</p>
                </div>
            </div>

            {/* Meeting List */}
            <div className="space-y-3">
                {filtered.map(m => {
                    const typeInfo = TYPE_LABELS[m.meeting_type] || TYPE_LABELS.regular
                    const statusInfo = STATUS_LABELS[m.status] || STATUS_LABELS.scheduled
                    const meetingDate = new Date(m.date)
                    const isPast = meetingDate < new Date()

                    return (
                        <div key={m.id} onClick={() => setSelectedMeeting(selectedMeeting?.id === m.id ? null : m)}
                            className={`p-5 bg-white/[0.02] border rounded-xl cursor-pointer transition-all hover:border-white/20 ${selectedMeeting?.id === m.id ? 'border-[#F54029]/30 bg-[#F54029]/5' : 'border-white/5'}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/5">
                                        <span className="text-[10px] text-white/30 uppercase">{meetingDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                                        <span className="text-lg font-bold text-white font-mono">{meetingDate.getDate()}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{m.title}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${typeInfo.color}`}>{typeInfo.label}</span>
                                            <span className="text-xs text-white/30 flex items-center gap-1"><Clock size={10} /> {m.time || 'TBD'}</span>
                                            {m.location && <span className="text-xs text-white/30 flex items-center gap-1">{m.location.includes('http') ? <Video size={10} /> : <MapPin size={10} />} {m.location.includes('http') ? 'Virtual' : m.location}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {m.agenda_items?.length > 0 && (
                                        <span className="text-xs text-white/30">{m.agenda_items.length} agenda items</span>
                                    )}
                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-md ${statusInfo.color}`}>{statusInfo.label}</span>
                                </div>
                            </div>

                            {/* Expanded Detail */}
                            {selectedMeeting?.id === m.id && (
                                <div className="mt-6 pt-6 border-t border-white/5 space-y-4 animate-fadeIn">
                                    {m.agenda_items?.length > 0 && (
                                        <div>
                                            <h5 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Agenda</h5>
                                            <div className="space-y-2">
                                                {m.agenda_items.map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                                                        <span className="text-xs text-white/20 font-mono w-6">{i + 1}.</span>
                                                        <span className="text-sm text-white/80 flex-1">{item.title}</span>
                                                        {item.presenter && <span className="text-xs text-white/30">{item.presenter}</span>}
                                                        {item.duration_minutes && <span className="text-xs text-white/20">{item.duration_minutes}m</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {isAdmin && m.status === 'scheduled' && (
                                        <div className="flex gap-2">
                                            <button onClick={(e) => { e.stopPropagation(); updateStatus(m.id, 'completed') }}
                                                className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-all">
                                                <CheckCircle size={12} className="inline mr-1" /> Mark Complete
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); updateStatus(m.id, 'cancelled') }}
                                                className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-500/20 transition-all">
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}

                {!loading && filtered.length === 0 && (
                    <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
                        <Calendar className="mx-auto text-white/10 mb-4" size={40} />
                        <p className="text-white/40">No meetings found.</p>
                    </div>
                )}
            </div>

            {/* Create Meeting Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setShowForm(false)}>
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-rajdhani text-white">Schedule Board Meeting</h3>
                            <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Meeting Title</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="e.g. Q1 2026 Regular Board Meeting" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Type</label>
                                    <select value={form.meeting_type} onChange={e => setForm(f => ({ ...f, meeting_type: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]">
                                        <option value="regular">Regular</option>
                                        <option value="special">Special</option>
                                        <option value="annual">Annual</option>
                                        <option value="organizational">Organizational</option>
                                        <option value="committee">Committee</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Date</label>
                                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" />
                                </div>
                                <div>
                                    <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Time</label>
                                    <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Location / Meeting Link</label>
                                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#F54029]" placeholder="Virtual link or physical address" />
                            </div>

                            {/* Agenda Items */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs text-white/40 uppercase tracking-widest">Agenda Items</label>
                                    <button onClick={addAgendaItem} className="text-xs text-[#F54029] hover:text-[#F54029]/80 flex items-center gap-1"><Plus size={12} /> Add Item</button>
                                </div>
                                <div className="space-y-2">
                                    {form.agenda_items.map((item, i) => (
                                        <div key={i} className="flex gap-2 items-center">
                                            <span className="text-xs text-white/20 font-mono w-6">{i + 1}.</span>
                                            <input value={item.title} onChange={e => updateAgendaItem(i, 'title', e.target.value)}
                                                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#F54029]" placeholder="Agenda item" />
                                            <input value={item.presenter} onChange={e => updateAgendaItem(i, 'presenter', e.target.value)}
                                                className="w-32 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#F54029]" placeholder="Presenter" />
                                            {form.agenda_items.length > 1 && (
                                                <button onClick={() => removeAgendaItem(i)} className="text-white/20 hover:text-red-400"><X size={14} /></button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {form.meeting_type === 'special' && (
                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2">
                                    <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                                    <p className="text-xs text-amber-300/80">DGCL §222 requires written notice to all directors for special meetings. Ensure notice is sent at least 2 days prior.</p>
                                </div>
                            )}

                            <button onClick={handleSave}
                                className="w-full py-3 bg-[#F54029] text-white font-bold rounded-xl uppercase tracking-wider text-xs hover:bg-[#C53020] transition-all">
                                Schedule Meeting
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
