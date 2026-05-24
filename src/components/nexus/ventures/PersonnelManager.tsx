'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Landmark, Users, Plus, Trash2, Edit2, Shield, Calendar, Award, Briefcase, X, Check, Activity, FileText, Mail } from 'lucide-react'

interface BoardMember {
    id: string
    name: string
    email?: string
    seat_type: 'founder' | 'at_large' | 'observer' | 'independent'
    seat_class?: string
    title?: string
    committees: string[]
    appointed_by?: string
    term_start?: string
    term_end?: string
    is_active: boolean
    voting_rights: boolean
    equity_percentage?: number
    bio?: string
}

interface CorporateOfficer {
    id: string
    name: string
    email?: string
    title: string
    department?: string
    appointed_by?: string
    appointment_date?: string
    term_end?: string
    is_active: boolean
    responsibilities?: string
}

interface PersonnelManagerProps {
    subsidiaryId: string
    themeColor?: string
}

export default function PersonnelManager({ subsidiaryId, themeColor = '#F54029' }: PersonnelManagerProps) {
    const supabase = createClient()
    const [directors, setDirectors] = useState<BoardMember[]>([])
    const [officers, setOfficers] = useState<CorporateOfficer[]>([])
    const [loading, setLoading] = useState(true)

    // Form Modals State
    const [directorModalOpen, setDirectorModalOpen] = useState(false)
    const [officerModalOpen, setOfficerModalOpen] = useState(false)
    const [editingDirector, setEditingDirector] = useState<BoardMember | null>(null)
    const [editingOfficer, setEditingOfficer] = useState<CorporateOfficer | null>(null)

    // Director Form Fields
    const [directorForm, setDirectorForm] = useState({
        name: '',
        email: '',
        title: 'Director',
        seat_type: 'at_large' as BoardMember['seat_type'],
        equity_percentage: '',
        voting_rights: true,
        committees: [] as string[],
        bio: '',
        term_start: '',
        term_end: '',
        sendInvite: false
    })

    // Officer Form Fields
    const [officerForm, setOfficerForm] = useState({
        name: '',
        email: '',
        title: '',
        department: '',
        appointment_date: new Date().toISOString().split('T')[0],
        responsibilities: '',
        sendInvite: false
    })

    // Committee input tag state
    const [committeeInput, setCommitteeInput] = useState('')

    useEffect(() => {
        fetchPersonnel()
    }, [subsidiaryId])

    async function fetchPersonnel() {
        setLoading(true)
        try {
            // 1. Fetch Board Members
            const { data: boardData, error: boardError } = await supabase
                .from('board_members')
                .select('*')
                .eq('subsidiary_id', subsidiaryId)
                .order('created_at', { ascending: true })

            if (boardError) console.error('Error loading directors:', boardError)
            else setDirectors(boardData || [])

            // 2. Fetch Officers
            const { data: officerData, error: officerError } = await supabase
                .from('officers')
                .select('*')
                .eq('subsidiary_id', subsidiaryId)
                .order('created_at', { ascending: true })

            if (officerError) console.error('Error loading officers:', officerError)
            else setOfficers(officerData || [])

        } catch (error) {
            console.error('Personnel fetch failed:', error)
        } finally {
            setLoading(false)
        }
    }

    // Direct Invite Dispatcher
    async function handleSendInviteDirect(email: string, roleTitle: string) {
        if (!email) return
        try {
            const res = await fetch('/api/ventures/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    subsidiaryId,
                    shares: 0,
                    role: roleTitle
                })
            })
            if (!res.ok) throw new Error(await res.text())
            alert(`Nexus invite successfully dispatched to ${email}`);
        } catch (error: any) {
            console.error('Invite dispatch failed:', error)
            alert('Failed to send invite: ' + error.message)
        }
    }

    // Save Director
    async function handleSaveDirector(e: React.FormEvent) {
        e.preventDefault()
        if (!directorForm.name) return

        const payload = {
            subsidiary_id: subsidiaryId,
            name: directorForm.name,
            email: directorForm.email || null,
            title: directorForm.title || 'Director',
            seat_type: directorForm.seat_type,
            equity_percentage: directorForm.equity_percentage ? parseFloat(directorForm.equity_percentage) : null,
            voting_rights: directorForm.voting_rights,
            committees: directorForm.committees,
            bio: directorForm.bio || null,
            term_start: directorForm.term_start ? new Date(directorForm.term_start).toISOString() : null,
            term_end: directorForm.term_end ? new Date(directorForm.term_end).toISOString() : null,
            is_active: true
        }

        try {
            if (editingDirector) {
                const { error } = await supabase
                    .from('board_members')
                    .update(payload)
                    .eq('id', editingDirector.id)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('board_members')
                    .insert([payload])

                if (error) throw error
            }

            if (directorForm.sendInvite && directorForm.email) {
                await handleSendInviteDirect(directorForm.email, directorForm.title || 'Director')
            }

            setDirectorModalOpen(false)
            setEditingDirector(null)
            resetDirectorForm()
            fetchPersonnel()
        } catch (error: any) {
            console.error('Failed to save director:', error)
            alert(error.message || 'Error saving Board Member')
        }
    }

    // Save Officer
    async function handleSaveOfficer(e: React.FormEvent) {
        e.preventDefault()
        if (!officerForm.name || !officerForm.title) return

        const payload = {
            subsidiary_id: subsidiaryId,
            name: officerForm.name,
            email: officerForm.email || null,
            title: officerForm.title,
            department: officerForm.department || null,
            appointment_date: officerForm.appointment_date ? new Date(officerForm.appointment_date).toISOString() : null,
            responsibilities: officerForm.responsibilities || null,
            is_active: true
        }

        try {
            if (editingOfficer) {
                const { error } = await supabase
                    .from('officers')
                    .update(payload)
                    .eq('id', editingOfficer.id)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('officers')
                    .insert([payload])

                if (error) throw error
            }

            if (officerForm.sendInvite && officerForm.email) {
                await handleSendInviteDirect(officerForm.email, officerForm.title || 'Officer')
            }

            setOfficerModalOpen(false)
            setEditingOfficer(null)
            resetOfficerForm()
            fetchPersonnel()
        } catch (error: any) {
            console.error('Failed to save officer:', error)
            alert(error.message || 'Error appointing Corporate Officer')
        }
    }

    // Delete Board Member
    async function handleDeleteDirector(id: string, name: string) {
        if (!confirm(`Are you sure you want to remove ${name} from the Board of Directors? This action cannot be undone.`)) return
        try {
            const { error } = await supabase
                .from('board_members')
                .delete()
                .eq('id', id)

            if (error) throw error
            fetchPersonnel()
        } catch (error: any) {
            console.error('Delete director failed:', error)
            alert(error.message || 'Failed to remove board member')
        }
    }

    // Delete Officer
    async function handleDeleteOfficer(id: string, name: string) {
        if (!confirm(`Are you sure you want to remove ${name} from their corporate officer seat? This action cannot be undone.`)) return
        try {
            const { error } = await supabase
                .from('officers')
                .delete()
                .eq('id', id)

            if (error) throw error
            fetchPersonnel()
        } catch (error: any) {
            console.error('Delete officer failed:', error)
            alert(error.message || 'Failed to remove corporate officer')
        }
    }

    function resetDirectorForm() {
        setDirectorForm({
            name: '',
            email: '',
            title: 'Director',
            seat_type: 'at_large',
            equity_percentage: '',
            voting_rights: true,
            committees: [],
            bio: '',
            term_start: '',
            term_end: '',
            sendInvite: false
        })
        setCommitteeInput('')
    }

    function resetOfficerForm() {
        setOfficerForm({
            name: '',
            email: '',
            title: '',
            department: '',
            appointment_date: new Date().toISOString().split('T')[0],
            responsibilities: '',
            sendInvite: false
        })
    }

    function openEditDirector(d: BoardMember) {
        setEditingDirector(d)
        setDirectorForm({
            name: d.name,
            email: d.email || '',
            title: d.title || 'Director',
            seat_type: d.seat_type,
            equity_percentage: d.equity_percentage?.toString() || '',
            voting_rights: d.voting_rights,
            committees: d.committees || [],
            bio: d.bio || '',
            term_start: d.term_start ? d.term_start.split('T')[0] : '',
            term_end: d.term_end ? d.term_end.split('T')[0] : '',
            sendInvite: false
        })
        setDirectorModalOpen(true)
    }

    function openEditOfficer(o: CorporateOfficer) {
        setEditingOfficer(o)
        setOfficerForm({
            name: o.name,
            email: o.email || '',
            title: o.title,
            department: o.department || '',
            appointment_date: o.appointment_date ? o.appointment_date.split('T')[0] : '',
            responsibilities: o.responsibilities || '',
            sendInvite: false
        })
        setOfficerModalOpen(true)
    }

    const addCommitteeTag = () => {
        if (!committeeInput.trim()) return
        if (directorForm.committees.includes(committeeInput.trim().toLowerCase())) {
            setCommitteeInput('')
            return
        }
        setDirectorForm({
            ...directorForm,
            committees: [...directorForm.committees, committeeInput.trim().toLowerCase()]
        })
        setCommitteeInput('')
    }

    const removeCommitteeTag = (tag: string) => {
        setDirectorForm({
            ...directorForm,
            committees: directorForm.committees.filter(c => c !== tag)
        })
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: themeColor }} />
                <p className="text-white/40 text-xs uppercase tracking-widest animate-pulse">Retrieving Entity Governance Structure...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
                <div>
                    <h3 className="text-xl font-bold font-rajdhani text-white uppercase tracking-wider flex items-center gap-2">
                        <Landmark style={{ color: themeColor }} size={20} /> Corporate Governance
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                        Configure Board of Directors representation and Corporate Officer mandates for executive oversight.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            resetDirectorForm()
                            setEditingDirector(null)
                            setDirectorModalOpen(true)
                        }}
                        className="px-4 py-2 border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <Plus size={14} /> Add Director
                    </button>
                    <button
                        onClick={() => {
                            resetOfficerForm()
                            setEditingOfficer(null)
                            setOfficerModalOpen(true)
                        }}
                        className="px-4 py-2 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                        style={{ backgroundColor: themeColor }}
                    >
                        <Plus size={14} /> Appoint Officer
                    </button>
                </div>
            </div>

            {/* Split Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Column Left: Board of Directors */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h4 className="text-lg font-bold font-rajdhani text-white uppercase tracking-widest flex items-center gap-2">
                            <Users style={{ color: themeColor }} size={18} /> Board of Directors
                        </h4>
                        <span className="px-2.5 py-0.5 bg-white/5 rounded text-[10px] text-white/40 uppercase tracking-widest font-mono">
                            {directors.length} Director{directors.length !== 1 && 's'}
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
                        {directors.map(dir => (
                            <div 
                                key={dir.id}
                                className="p-5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl space-y-4 transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h5 className="text-base font-bold text-white font-rajdhani">{dir.name}</h5>
                                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold border ${
                                                dir.seat_type === 'founder' 
                                                    ? 'bg-[#F54029]/10 text-[#F54029] border-[#F54029]/20'
                                                    : dir.seat_type === 'independent'
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    : dir.seat_type === 'observer'
                                                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                    : 'bg-white/5 text-white/50 border-white/10'
                                            }`}>
                                                {dir.seat_type}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/40 mt-1">{dir.title || 'Director'}</p>
                                    </div>
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {dir.email && (
                                            <button 
                                                onClick={() => handleSendInviteDirect(dir.email!, dir.title || 'Director')}
                                                className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                                                title="Send Nexus Invite"
                                            >
                                                <Mail size={13} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => openEditDirector(dir)}
                                            className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                                            title="Edit Board Member"
                                        >
                                            <Edit2 size={13} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteDirector(dir.id, dir.name)}
                                            className="p-1.5 hover:bg-red-500/10 rounded text-white/40 hover:text-red-400 transition-colors"
                                            title="Revoke Seat"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>

                                {/* Director Metrics */}
                                <div className="grid grid-cols-3 gap-2 bg-black/20 border border-white/5 p-3 rounded-lg text-center font-mono">
                                    <div>
                                        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">Equity</p>
                                        <p className="text-xs text-white font-semibold">{dir.equity_percentage !== null && dir.equity_percentage !== undefined ? `${dir.equity_percentage}%` : '—'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">Voting</p>
                                        <p className={`text-xs font-semibold ${dir.voting_rights ? 'text-green-400' : 'text-white/40'}`}>
                                            {dir.voting_rights ? 'YES' : 'NO'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-0.5">Appointed</p>
                                        <p className="text-[10px] text-white/60">
                                            {dir.term_start ? new Date(dir.term_start).toLocaleDateString(undefined, { year: '2-digit', month: 'short' }) : '—'}
                                        </p>
                                    </div>
                                </div>

                                {/* Committees */}
                                {dir.committees && dir.committees.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {dir.committees.map((comm, idx) => (
                                            <span 
                                                key={idx} 
                                                className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[10px] text-white/60 font-semibold uppercase tracking-wider"
                                            >
                                                {comm}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Bio */}
                                {dir.bio && (
                                    <p className="text-xs text-white/50 leading-relaxed border-t border-white/5 pt-3 italic">
                                        "{dir.bio}"
                                    </p>
                                )}
                            </div>
                        ))}
                        {directors.length === 0 && (
                            <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                                <Users className="mx-auto mb-3 text-white/20 animate-pulse" size={36} />
                                <p className="text-sm text-white/40">No Board Members Appointed</p>
                                <p className="text-xs text-white/20 mt-1">Assign directors to formulate a governing board.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column Right: Corporate Officers */}
                <div className="bg-black/40 border border-white/10 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <h4 className="text-lg font-bold font-rajdhani text-white uppercase tracking-widest flex items-center gap-2">
                            <Briefcase style={{ color: themeColor }} size={18} /> Corporate Officers
                        </h4>
                        <span className="px-2.5 py-0.5 bg-white/5 rounded text-[10px] text-white/40 uppercase tracking-widest font-mono">
                            {officers.length} Officer{officers.length !== 1 && 's'}
                        </span>
                    </div>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/5">
                        {officers.map(off => (
                            <div 
                                key={off.id}
                                className="p-5 bg-white/[0.01] hover:bg-white/[0.03] border border-white/10 hover:border-white/20 rounded-xl space-y-4 transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h5 className="text-base font-bold text-white font-rajdhani">{off.name}</h5>
                                            {off.department && (
                                                <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] text-white/40 uppercase tracking-widest">
                                                    {off.department}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs font-semibold mt-1" style={{ color: themeColor }}>{off.title}</p>
                                    </div>
                                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {off.email && (
                                            <button 
                                                onClick={() => handleSendInviteDirect(off.email!, off.title || 'Officer')}
                                                className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                                                title="Send Nexus Invite"
                                            >
                                                <Mail size={13} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => openEditOfficer(off)}
                                            className="p-1.5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors"
                                            title="Edit Officer Details"
                                        >
                                            <Edit2 size={13} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteOfficer(off.id, off.name)}
                                            className="p-1.5 hover:bg-red-500/10 rounded text-white/40 hover:text-red-400 transition-colors"
                                            title="Revoke Mandate"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>

                                {/* Appointment details */}
                                <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
                                    <Calendar size={13} />
                                    <span>Appointed on {off.appointment_date ? new Date(off.appointment_date).toLocaleDateString() : '—'}</span>
                                </div>

                                {/* Responsibilities */}
                                {off.responsibilities && (
                                    <div className="bg-black/20 border border-white/5 p-4 rounded-lg space-y-1">
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold font-mono">Mandate & Responsibilities</p>
                                        <p className="text-xs text-white/70 leading-relaxed">
                                            {off.responsibilities}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                        {officers.length === 0 && (
                            <div className="text-center py-16 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                                <Briefcase className="mx-auto mb-3 text-white/20 animate-pulse" size={36} />
                                <p className="text-sm text-white/40">No Officers Commissioned</p>
                                <p className="text-xs text-white/20 mt-1">Appoint operational officers (CEO, CTO, Secretary, etc.) to run the firm.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODAL 1: ADD/EDIT DIRECTOR */}
            {directorModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div>
                                <h4 className="text-xl font-bold text-white font-rajdhani">
                                    {editingDirector ? 'Edit Board Director' : 'Appoint Board Director'}
                                </h4>
                                <p className="text-white/40 text-xs mt-1">Configure seat details and board permissions</p>
                            </div>
                            <button 
                                onClick={() => setDirectorModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveDirector} className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div>
                                <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={directorForm.name}
                                    onChange={e => setDirectorForm({ ...directorForm, name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                    placeholder="e.g. Alice Cooper"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Email</label>
                                    <input
                                        type="email"
                                        value={directorForm.email}
                                        onChange={e => setDirectorForm({ ...directorForm, email: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                        placeholder="alice@firm.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Title</label>
                                    <input
                                        type="text"
                                        value={directorForm.title}
                                        onChange={e => setDirectorForm({ ...directorForm, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                        placeholder="e.g. Director, Chairman"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Seat Type</label>
                                    <select
                                        value={directorForm.seat_type}
                                        onChange={e => setDirectorForm({ ...directorForm, seat_type: e.target.value as any })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                    >
                                        <option value="at_large">At-Large Director</option>
                                        <option value="founder">Founder Director</option>
                                        <option value="independent">Independent Director</option>
                                        <option value="observer">Board Observer</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Equity Percentage (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={directorForm.equity_percentage}
                                        onChange={e => setDirectorForm({ ...directorForm, equity_percentage: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                        placeholder="e.g. 5.0"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="voting_rights"
                                    checked={directorForm.voting_rights}
                                    onChange={e => setDirectorForm({ ...directorForm, voting_rights: e.target.checked })}
                                    className="w-5 h-5 rounded border-white/20 bg-black/40 text-blue-500 outline-none"
                                />
                                <label htmlFor="voting_rights" className="text-white text-sm font-semibold select-none cursor-pointer">
                                    Grant Voting Rights on Resolutions
                                </label>
                            </div>

                            {directorForm.email && (
                                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-xl animate-fadeIn">
                                    <input
                                        type="checkbox"
                                        id="send_invite_dir"
                                        checked={directorForm.sendInvite}
                                        onChange={e => setDirectorForm({ ...directorForm, sendInvite: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/20 bg-black/40 text-blue-500 outline-none"
                                    />
                                    <label htmlFor="send_invite_dir" className="text-white text-sm font-semibold select-none cursor-pointer">
                                        Send email invitation to join Nexus
                                    </label>
                                </div>
                            )}

                            {/* Committees Input */}
                            <div>
                                <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Committees</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={committeeInput}
                                        onChange={e => setCommitteeInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCommitteeTag())}
                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                        placeholder="e.g. strategy, compensation"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCommitteeTag}
                                        className="px-4 py-2 border border-white/10 hover:bg-white/5 text-white text-xs font-bold uppercase rounded-xl transition-all"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {directorForm.committees.map(comm => (
                                        <span 
                                            key={comm} 
                                            className="px-2.5 py-1 bg-white/5 border border-white/5 rounded-lg text-xs text-white flex items-center gap-1.5 uppercase font-semibold tracking-wider"
                                        >
                                            {comm}
                                            <button 
                                                type="button" 
                                                onClick={() => removeCommitteeTag(comm)} 
                                                className="hover:text-red-400 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Term Start</label>
                                    <input
                                        type="date"
                                        value={directorForm.term_start}
                                        onChange={e => setDirectorForm({ ...directorForm, term_start: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Term End</label>
                                    <input
                                        type="date"
                                        value={directorForm.term_end}
                                        onChange={e => setDirectorForm({ ...directorForm, term_end: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Bio / Notes</label>
                                <textarea
                                    value={directorForm.bio}
                                    onChange={e => setDirectorForm({ ...directorForm, bio: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors resize-none"
                                    rows={3}
                                    placeholder="Optional background info..."
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full py-4 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)] mt-6"
                                style={{ backgroundColor: themeColor }}
                            >
                                {editingDirector ? 'Save Changes' : 'Confirm Appointment'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: ADD/EDIT OFFICER */}
            {officerModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div>
                                <h4 className="text-xl font-bold text-white font-rajdhani">
                                    {editingOfficer ? 'Edit Officer Status' : 'Appoint Corporate Officer'}
                                </h4>
                                <p className="text-white/40 text-xs mt-1">Issue official corporate mandates and officer roles</p>
                            </div>
                            <button 
                                onClick={() => setOfficerModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveOfficer} className="flex-1 overflow-y-auto p-6 space-y-4">
                            <div>
                                <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={officerForm.name}
                                    onChange={e => setOfficerForm({ ...officerForm, name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                    placeholder="e.g. John Smith"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Email</label>
                                    <input
                                        type="email"
                                        value={officerForm.email}
                                        onChange={e => setOfficerForm({ ...officerForm, email: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                        placeholder="john@firm.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Officer Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={officerForm.title}
                                        onChange={e => setOfficerForm({ ...officerForm, title: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                        placeholder="e.g. Chief Executive Officer, Secretary"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Department</label>
                                    <input
                                        type="text"
                                        value={officerForm.department}
                                        onChange={e => setOfficerForm({ ...officerForm, department: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                        placeholder="e.g. Executive, Engineering, Corporate"
                                    />
                                </div>
                                <div>
                                    <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Appointment Date</label>
                                    <input
                                        type="date"
                                        value={officerForm.appointment_date}
                                        onChange={e => setOfficerForm({ ...officerForm, appointment_date: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Mandate & Responsibilities</label>
                                <textarea
                                    value={officerForm.responsibilities}
                                    onChange={e => setOfficerForm({ ...officerForm, responsibilities: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors resize-none"
                                    rows={4}
                                    placeholder="Outline corporate officer responsibilities and mandates..."
                                />
                            </div>

                            {officerForm.email && (
                                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-xl animate-fadeIn">
                                    <input
                                        type="checkbox"
                                        id="send_invite_off"
                                        checked={officerForm.sendInvite}
                                        onChange={e => setOfficerForm({ ...officerForm, sendInvite: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/20 bg-black/40 text-blue-500 outline-none"
                                    />
                                    <label htmlFor="send_invite_off" className="text-white text-sm font-semibold select-none cursor-pointer">
                                        Send email invitation to join Nexus
                                    </label>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full py-4 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)] mt-6"
                                style={{ backgroundColor: themeColor }}
                            >
                                {editingOfficer ? 'Save Officer Mandate' : 'Appoint Officer'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
