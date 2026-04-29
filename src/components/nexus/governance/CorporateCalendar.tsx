'use client'

import { useState, useEffect } from 'react'
import { Calendar, Clock, FileText, AlertTriangle, CheckCircle, DollarSign, Users, Gavel, Building2 } from 'lucide-react'

interface CalendarEvent {
    id: string
    title: string
    date: string
    type: 'meeting' | 'resolution' | 'filing' | 'compliance' | 'officer_term' | 'franchise_tax'
    status: string
    description?: string
    source?: string
}

const EVENT_TYPES: Record<string, { label: string; color: string; icon: any }> = {
    meeting: { label: 'Board Meeting', color: 'bg-red-500/10 border-red-500/20 text-red-400', icon: Users },
    resolution: { label: 'Resolution', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400', icon: Gavel },
    filing: { label: 'State Filing', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', icon: Building2 },
    compliance: { label: 'Compliance', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400', icon: FileText },
    officer_term: { label: 'Officer Term', color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400', icon: Users },
    franchise_tax: { label: 'Franchise Tax', color: 'bg-red-500/10 border-red-500/20 text-red-400', icon: DollarSign },
}

// Delaware C-Corp standing requirements
const DELAWARE_DEADLINES = [
    { title: 'Delaware Annual Report Filing', month: 3, day: 1, type: 'filing' as const, description: 'Annual report due to Delaware Division of Corporations. Must be filed by March 1st each year.' },
    { title: 'Delaware Franchise Tax Payment', month: 6, day: 1, type: 'franchise_tax' as const, description: 'Annual franchise tax payment due June 1st. Minimum $400 for Authorized Shares method.' },
    { title: 'Annual Meeting of Stockholders', month: 0, day: 0, type: 'meeting' as const, description: 'DGCL §211 requires an annual meeting of stockholders for director election and other business.' },
]

export default function CorporateCalendar() {
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<string>('all')

    useEffect(() => { fetchEvents() }, [])

    async function fetchEvents() {
        try {
            const allEvents: CalendarEvent[] = []
            const currentYear = new Date().getFullYear()

            // Add Delaware standing deadlines for current and next year
            for (const year of [currentYear, currentYear + 1]) {
                DELAWARE_DEADLINES.forEach((dl, i) => {
                    if (dl.month > 0 || dl.day > 0) {
                        const date = new Date(year, dl.month - 1, dl.day)
                        allEvents.push({
                            id: `de-${year}-${i}`,
                            title: dl.title,
                            date: date.toISOString(),
                            type: dl.type,
                            status: date < new Date() ? 'past' : 'upcoming',
                            description: dl.description,
                            source: 'delaware'
                        })
                    }
                })
            }

            // Fetch meetings
            const meetingsRes = await fetch('/api/nexus/meetings')
            const meetingsData = await meetingsRes.json()
            if (meetingsData.meetings) {
                meetingsData.meetings.forEach((m: any) => {
                    allEvents.push({
                        id: m.id,
                        title: m.title,
                        date: m.date,
                        type: 'meeting',
                        status: m.status,
                        description: `${m.meeting_type} meeting — ${m.agenda_items?.length || 0} agenda items`,
                        source: 'meetings'
                    })
                })
            }

            // Fetch resolutions with voting deadlines
            const resRes = await fetch('/api/nexus/resolutions?status=voting')
            const resData = await resRes.json()
            if (resData.resolutions) {
                resData.resolutions.forEach((r: any) => {
                    if (r.voting_closes) {
                        allEvents.push({
                            id: r.id,
                            title: `Vote Closes: ${r.title}`,
                            date: r.voting_closes,
                            type: 'resolution',
                            status: 'active',
                            description: r.resolution_number,
                            source: 'resolutions'
                        })
                    }
                })
            }

            // Fetch compliance tasks
            const compRes = await fetch('/api/nexus/compliance')
            const compData = await compRes.json()
            if (compData.tasks) {
                compData.tasks.forEach((t: any) => {
                    allEvents.push({
                        id: t.id,
                        title: t.title,
                        date: t.due_date,
                        type: 'compliance',
                        status: t.status,
                        description: t.description,
                        source: 'compliance'
                    })
                })
            }

            // Sort by date
            allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            setEvents(allEvents)
        } catch (e) { console.error(e) }
        setLoading(false)
    }

    const now = new Date()
    const upcoming = events.filter(e => new Date(e.date) >= now)
    const overdue = events.filter(e => new Date(e.date) < now && e.status !== 'completed' && e.status !== 'past')
    const filtered = filter === 'all' ? events : events.filter(e => e.type === filter)

    // Group by month
    const grouped = filtered.reduce((acc: Record<string, CalendarEvent[]>, e) => {
        const d = new Date(e.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (!acc[key]) acc[key] = []
        acc[key].push(e)
        return acc
    }, {})

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold font-rajdhani text-white tracking-wide">Corporate Calendar</h2>
                    <p className="text-sm text-white/40 mt-1">Delaware standing requirements, meetings, filings, and deadlines</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Total Events</p>
                    <p className="text-2xl font-mono text-white">{events.length}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Upcoming</p>
                    <p className="text-2xl font-mono text-[#F54029]">{upcoming.length}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Overdue</p>
                    <p className={`text-2xl font-mono ${overdue.length > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{overdue.length}</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">Next Deadline</p>
                    <p className="text-sm font-mono text-white">{upcoming[0] ? new Date(upcoming[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</p>
                </div>
            </div>

            {/* Overdue Alert */}
            {overdue.length > 0 && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={16} />
                    <div>
                        <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">{overdue.length} Overdue Item{overdue.length > 1 ? 's' : ''}</p>
                        <div className="space-y-1">
                            {overdue.slice(0, 3).map(e => (
                                <p key={e.id} className="text-xs text-red-300/80">{e.title} — due {new Date(e.date).toLocaleDateString()}</p>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <button onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap ${filter === 'all' ? 'bg-white/10 text-white border-white/20' : 'bg-white/5 text-white/40 border-white/5 hover:text-white'}`}>
                    All
                </button>
                {Object.entries(EVENT_TYPES).map(([key, info]) => {
                    const Icon = info.icon
                    return (
                        <button key={key} onClick={() => setFilter(key)}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all whitespace-nowrap flex items-center gap-1 ${filter === key ? 'bg-white/10 text-white border-white/20' : 'bg-white/5 text-white/40 border-white/5 hover:text-white'}`}>
                            <Icon size={10} /> {info.label}
                        </button>
                    )
                })}
            </div>

            {/* Timeline by Month */}
            <div className="space-y-6">
                {Object.entries(grouped).map(([monthKey, monthEvents]) => {
                    const [year, month] = monthKey.split('-')
                    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    const isCurrentMonth = monthKey === `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

                    return (
                        <div key={monthKey}>
                            <h3 className={`text-xs font-bold uppercase tracking-[0.2em] mb-3 ${isCurrentMonth ? 'text-[#F54029]' : 'text-white/20'}`}>
                                {monthName} {isCurrentMonth && <span className="text-[#F54029]/40 ml-2">← Current</span>}
                            </h3>
                            <div className="space-y-2">
                                {monthEvents.map(e => {
                                    const info = EVENT_TYPES[e.type] || EVENT_TYPES.compliance
                                    const Icon = info.icon
                                    const eventDate = new Date(e.date)
                                    const isPast = eventDate < now

                                    return (
                                        <div key={e.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${isPast ? 'bg-white/[0.01] border-white/5 opacity-60' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                                            <div className="w-10 h-10 rounded-lg bg-white/5 flex flex-col items-center justify-center text-white/30 shrink-0">
                                                <span className="text-[9px] uppercase leading-tight">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-sm font-bold font-mono leading-tight">{eventDate.getDate()}</span>
                                            </div>
                                            <span className={`px-2 py-1 text-[9px] font-bold uppercase rounded border shrink-0 flex items-center gap-1 ${info.color}`}>
                                                <Icon size={9} /> {info.label}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white font-medium truncate">{e.title}</p>
                                                {e.description && <p className="text-xs text-white/30 truncate">{e.description}</p>}
                                            </div>
                                            {isPast && e.status !== 'completed' && e.status !== 'past' && (
                                                <span className="text-[10px] text-red-400 font-bold uppercase">Overdue</span>
                                            )}
                                            {(e.status === 'completed' || e.status === 'past') && (
                                                <CheckCircle size={14} className="text-emerald-400/40 shrink-0" />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {!loading && events.length === 0 && (
                <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
                    <Calendar className="mx-auto text-white/10 mb-4" size={40} />
                    <p className="text-white/40">No calendar events found.</p>
                </div>
            )}
        </div>
    )
}
