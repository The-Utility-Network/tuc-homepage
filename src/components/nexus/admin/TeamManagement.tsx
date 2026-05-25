'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Users, Shield, CheckCircle, Clock, XCircle, UserPlus, Link2, Unlink, ChevronDown, AlertTriangle, Mail, Calendar, Plus, Trash2, X } from 'lucide-react'

interface GovernanceRole {
    id: string
    type: 'director' | 'officer'
    title: string
    seat_type?: string
    seat_class?: string
    department?: string
    linked: boolean
}

interface TeamProfile {
    id: string
    email: string
    full_name: string
    role: string
    status: string
    requested_role: string
    governance_roles: GovernanceRole[]
    created_at: string
}

interface UnlinkedRole {
    id: string
    type: 'director' | 'officer'
    name: string
    email: string
    title: string
    seat_type?: string
}

const ROLE_LABELS: Record<string, string> = {
    investor: 'Investor',
    team: 'Team Member',
    director: 'Director',
    officer: 'Officer',
    admin: 'Admin',
    superadmin: 'Superadmin',
    pending: 'Pending'
}

const ROLE_COLORS: Record<string, string> = {
    superadmin: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    admin: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    director: 'text-red-400 bg-red-500/10 border-red-500/20',
    officer: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    team: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    investor: 'text-white/40 bg-white/5 border-white/10',
    pending: 'text-white/20 bg-white/5 border-white/5',
}

const ROLE_PRESETS: Record<string, string[]> = {
    director: ['Founder Director', 'Independent Director', 'Board Observer', 'Chairman of the Board', 'At-Large Director', 'Custom...'],
    officer: ['Chief Executive Officer (CEO)', 'Chief Technology Officer (CTO)', 'Chief Financial Officer (CFO)', 'Corporate Secretary', 'Treasurer', 'Custom...'],
    team: ['Corporate Counsel', 'General Partner', 'Executive Assistant', 'Operations Manager', 'Custom...']
}

export default function TeamManagement({ isAdmin }: { isAdmin: boolean }) {
    const [profiles, setProfiles] = useState<TeamProfile[]>([])
    const [unlinkedRoles, setUnlinkedRoles] = useState<UnlinkedRole[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState<string | null>(null)
    const [approveRole, setApproveRole] = useState<Record<string, string>>({})
    const [approveLinks, setApproveLinks] = useState<Record<string, Set<string>>>({})

    // Invite Modal & Subsidiaries State
    const [inviteModalOpen, setInviteModalOpen] = useState(false)
    const [subsidiaries, setSubsidiaries] = useState<any[]>([])
    const [inviteForm, setInviteForm] = useState({
        name: '',
        email: '',
        role: 'director' as 'director' | 'officer' | 'team',
        title: 'Founder Director',
        subsidiaryId: '',
        seatType: 'at_large',
        department: ''
    })

    const [selectedPreset, setSelectedPreset] = useState<string>('Founder Director')
    const [customTitle, setCustomTitle] = useState<string>('')

    useEffect(() => { 
        fetchTeam() 
        fetchSubsidiaries()
    }, [])

    useEffect(() => {
        const presets = ROLE_PRESETS[inviteForm.role] || []
        if (presets.length > 0) {
            setSelectedPreset(presets[0])
            setInviteForm(prev => ({ ...prev, title: presets[0] }))
        }
    }, [inviteForm.role])

    async function fetchSubsidiaries() {
        const supabase = createClient()
        const { data } = await supabase.from('subsidiaries').select('*').order('name')
        if (data) {
            setSubsidiaries(data)
            if (data.length > 0) {
                setInviteForm(prev => ({ ...prev, subsidiaryId: data[0].id }))
            }
        }
    }

    async function fetchTeam() {
        try {
            const res = await fetch('/api/nexus/team')
            const data = await res.json()
            setProfiles(data.profiles || [])
            setUnlinkedRoles(data.unlinked_roles || [])
        } catch (e) { console.error(e) }
        setLoading(false)
    }

    async function handleInviteSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!inviteForm.name || !inviteForm.email || !inviteForm.subsidiaryId) return

        const supabase = createClient()
        setLoading(true)

        try {
            // 1. If director, insert into board_members
            if (inviteForm.role === 'director') {
                const { error: dbError } = await supabase
                    .from('board_members')
                    .insert([{
                        subsidiary_id: inviteForm.subsidiaryId,
                        name: inviteForm.name,
                        email: inviteForm.email,
                        title: inviteForm.title,
                        seat_type: inviteForm.seatType || 'at_large',
                        is_active: true
                    }])
                if (dbError) throw dbError
            } 
            // 2. If officer, insert into officers
            else if (inviteForm.role === 'officer') {
                const { error: dbError } = await supabase
                    .from('officers')
                    .insert([{
                        subsidiary_id: inviteForm.subsidiaryId,
                        name: inviteForm.name,
                        email: inviteForm.email,
                        title: inviteForm.title,
                        department: inviteForm.department || null,
                        appointment_date: new Date().toISOString(),
                        is_active: true
                    }])
                if (dbError) throw dbError
            }

            // 3. Call invite API
            const res = await fetch('/api/ventures/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: inviteForm.email,
                    subsidiaryId: inviteForm.subsidiaryId,
                    shares: 0,
                    role: inviteForm.title
                })
            })
            
            if (!res.ok) throw new Error(await res.text())

            alert(`Nexus invite successfully dispatched to ${inviteForm.email}`)
            setInviteModalOpen(false)
            setInviteForm(prev => ({
                name: '',
                email: '',
                role: 'director',
                title: 'Founder Director',
                subsidiaryId: subsidiaries[0]?.id || prev.subsidiaryId,
                seatType: 'at_large',
                department: ''
            }))
            setCustomTitle('')
            fetchTeam()
        } catch (error: any) {
            console.error('Invite Error:', error)
            alert('Failed to send invite: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleRemoveMember(profileId: string, name: string) {
        if (!confirm(`Are you sure you want to completely remove ${name}? This will unlink all their governance roles and delete their account. This action is irreversible.`)) return
        try {
            const res = await fetch('/api/nexus/team', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ profile_id: profileId })
            })
            if (!res.ok) throw new Error(await res.text())
            fetchTeam()
        } catch (e: any) {
            console.error(e)
            alert('Failed to remove member: ' + e.message)
        }
    }

    async function handleApprove(profileId: string) {
        const role = approveRole[profileId]
        const links = approveLinks[profileId]
        const linkRoles = links ? Array.from(links).map(key => {
            const [type, id] = key.split('|')
            return { id, type }
        }) : []

        try {
            await fetch('/api/nexus/team', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'approve', profile_id: profileId, role, link_roles: linkRoles })
            })
            fetchTeam()
        } catch (e) { console.error(e) }
    }

    async function handleSuspend(profileId: string) {
        if (!confirm('Suspend this user? They will no longer be able to log in.')) return
        try {
            await fetch('/api/nexus/team', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'suspend', profile_id: profileId })
            })
            fetchTeam()
        } catch (e) { console.error(e) }
    }

    async function handleLink(profileId: string, roleId: string, roleType: string) {
        try {
            await fetch('/api/nexus/team', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'link', profile_id: profileId, role_id: roleId, role_type: roleType })
            })
            fetchTeam()
        } catch (e) { console.error(e) }
    }

    async function handleUnlink(profileId: string, roleId: string, roleType: string) {
        try {
            await fetch('/api/nexus/team', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'unlink', profile_id: profileId, role_id: roleId, role_type: roleType })
            })
            fetchTeam()
        } catch (e) { console.error(e) }
    }

    async function handleRoleChange(profileId: string, newRole: string) {
        try {
            await fetch('/api/nexus/team', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'update_role', profile_id: profileId, role: newRole })
            })
            fetchTeam()
        } catch (e) { console.error(e) }
    }

    function toggleApproveLink(profileId: string, key: string) {
        setApproveLinks(prev => {
            const current = new Set(prev[profileId] || [])
            if (current.has(key)) current.delete(key)
            else current.add(key)
            return { ...prev, [profileId]: current }
        })
    }

    const pending = profiles.filter(p => p.status === 'pending_approval')
    const active = profiles.filter(p => p.status === 'approved' || (!p.status))
    const suspended = profiles.filter(p => p.status === 'suspended')

    if (!isAdmin) return null

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.01] border border-white/5 p-6 rounded-2xl">
                <div>
                    <h2 className="text-2xl font-bold font-rajdhani text-white uppercase tracking-wider flex items-center gap-2">
                        <Users className="text-[#F54029]" size={24} /> Team Management
                    </h2>
                    <p className="text-sm text-white/40 mt-1">
                        Approve registrations, link governance roles, and manage platform access.
                    </p>
                </div>
                <button
                    onClick={() => setInviteModalOpen(true)}
                    className="px-4 py-2.5 bg-[#F54029] text-white hover:bg-[#F54029]/80 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(245,64,41,0.2)]"
                >
                    <UserPlus size={14} /> Invite Member
                </button>
            </div>

            {/* Pending Approvals */}
            {pending.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Clock size={16} className="text-amber-400" />
                        <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest">Pending Approvals ({pending.length})</h3>
                    </div>
                    <div className="space-y-3">
                        {pending.map(p => {
                            const roleKey = approveRole[p.id] || p.requested_role || 'investor'
                            const links = approveLinks[p.id] || new Set()
                            return (
                                <div key={p.id} className="p-5 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                                <UserPlus size={16} className="text-amber-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{p.full_name || p.email.split('@')[0]}</h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Mail size={10} className="text-white/20" />
                                                    <span className="text-xs text-white/40">{p.email}</span>
                                                    <span className="text-[9px] text-white/15">•</span>
                                                    <Calendar size={10} className="text-white/20" />
                                                    <span className="text-xs text-white/30">{new Date(p.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md">
                                            Requested: {ROLE_LABELS[p.requested_role] || p.requested_role}
                                        </span>
                                    </div>

                                    {/* Matched governance roles */}
                                    {p.governance_roles.length > 0 && (
                                        <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                                            <p className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-1">
                                                <CheckCircle size={10} /> Email matches existing governance roles
                                            </p>
                                            <div className="space-y-1.5">
                                                {p.governance_roles.map(gr => {
                                                    const key = `${gr.type}|${gr.id}`
                                                    const isChecked = links.has(key)
                                                    return (
                                                        <label key={gr.id} className="flex items-center gap-3 p-2 bg-white/[0.03] border border-white/5 rounded-lg cursor-pointer hover:border-emerald-500/20 transition-all">
                                                            <input type="checkbox" checked={isChecked} onChange={() => toggleApproveLink(p.id, key)}
                                                                className="accent-emerald-400" />
                                                            <Link2 size={12} className="text-emerald-400" />
                                                            <span className="text-xs text-white/60">{gr.title}</span>
                                                            <span className="text-[9px] text-white/20 capitalize">({gr.type})</span>
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* Assign role */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <label className="text-[9px] text-white/30 uppercase tracking-widest block mb-1">Assign Platform Role</label>
                                            <select value={roleKey} onChange={e => setApproveRole(prev => ({ ...prev, [p.id]: e.target.value }))}
                                                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#F54029]" style={{ colorScheme: 'dark' }}>
                                                <option value="investor" className="bg-[#111] text-white">Investor</option>
                                                <option value="team" className="bg-[#111] text-white">Team Member</option>
                                                <option value="director" className="bg-[#111] text-white">Director</option>
                                                <option value="officer" className="bg-[#111] text-white">Officer</option>
                                                <option value="admin" className="bg-[#111] text-white">Admin</option>
                                            </select>
                                        </div>
                                        <div className="flex gap-2 pt-4">
                                            <button onClick={() => handleApprove(p.id)}
                                                className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 transition-all flex items-center gap-1.5">
                                                <CheckCircle size={12} /> Approve
                                            </button>
                                            <button onClick={() => handleSuspend(p.id)}
                                                className="px-4 py-2 bg-white/5 border border-white/10 text-white/30 rounded-lg text-xs font-bold uppercase tracking-wider hover:text-red-400 hover:border-red-500/20 transition-all">
                                                Deny
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Active Team */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Users size={16} className="text-[#F54029]" />
                    <h3 className="text-sm font-bold text-[#F54029] uppercase tracking-widest">Active Team ({active.length})</h3>
                </div>
                <div className="space-y-2">
                    {active.map(p => {
                        const isExpanded = expandedId === p.id
                        const roleColor = ROLE_COLORS[p.role] || ROLE_COLORS.investor
                        return (
                            <div key={p.id} className={`p-4 bg-white/[0.02] border rounded-xl transition-all ${isExpanded ? 'border-[#F54029]/30 bg-[#F54029]/5' : 'border-white/5 hover:border-white/10'}`}>
                                <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : p.id)}>
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/30">
                                            {(p.full_name || p.email)?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-bold text-white truncate">{p.full_name || p.email.split('@')[0]}</h4>
                                            <p className="text-[10px] text-white/30">{p.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {p.governance_roles.filter(gr => gr.linked).map(gr => (
                                            <span key={gr.id} className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-400/60 bg-cyan-500/5 border border-cyan-500/10 rounded">
                                                {gr.title}
                                            </span>
                                        ))}
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-md ${roleColor}`}>
                                            {ROLE_LABELS[p.role] || p.role}
                                        </span>
                                        <ChevronDown size={14} className={`text-white/20 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-fadeIn" onClick={e => e.stopPropagation()}>
                                        <div className="grid grid-cols-3 gap-3 text-xs">
                                            <div>
                                                <p className="text-white/20 uppercase tracking-widest text-[9px] mb-1">Platform Role</p>
                                                <select value={p.role} onChange={e => handleRoleChange(p.id, e.target.value)}
                                                    className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-[#F54029]" style={{ colorScheme: 'dark' }}>
                                                    <option value="investor" className="bg-[#111]">Investor</option>
                                                    <option value="team" className="bg-[#111]">Team Member</option>
                                                    <option value="director" className="bg-[#111]">Director</option>
                                                    <option value="officer" className="bg-[#111]">Officer</option>
                                                    <option value="admin" className="bg-[#111]">Admin</option>
                                                    <option value="superadmin" className="bg-[#111]">Superadmin</option>
                                                </select>
                                            </div>
                                            <div>
                                                <p className="text-white/20 uppercase tracking-widest text-[9px] mb-1">Registered</p>
                                                <p className="text-white/50 py-2">{new Date(p.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-white/20 uppercase tracking-widest text-[9px] mb-1">Status</p>
                                                <p className="text-emerald-400/60 py-2 flex items-center gap-1"><CheckCircle size={10} /> Active</p>
                                            </div>
                                        </div>

                                        {/* Linked Governance Roles */}
                                        {p.governance_roles.length > 0 && (
                                            <div>
                                                <p className="text-[9px] text-white/20 uppercase tracking-widest mb-2">Governance Roles</p>
                                                <div className="space-y-1.5">
                                                    {p.governance_roles.map(gr => (
                                                        <div key={gr.id} className="flex items-center gap-3 p-2.5 bg-white/[0.02] border border-white/5 rounded-lg">
                                                            <Link2 size={12} className={gr.linked ? 'text-emerald-400' : 'text-white/15'} />
                                                            <span className="text-xs text-white/60 flex-1">{gr.title}</span>
                                                            <span className="text-[9px] text-white/20 capitalize">{gr.type}</span>
                                                            {gr.linked ? (
                                                                <button onClick={() => handleUnlink(p.id, gr.id, gr.type)}
                                                                    className="text-[9px] text-red-400/40 hover:text-red-400 flex items-center gap-1 transition-all">
                                                                    <Unlink size={10} /> Unlink
                                                                </button>
                                                            ) : (
                                                                <button onClick={() => handleLink(p.id, gr.id, gr.type)}
                                                                    className="text-[9px] text-emerald-400/40 hover:text-emerald-400 flex items-center gap-1 transition-all">
                                                                    <Link2 size={10} /> Link
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-2 border-t border-white/5 w-full">
                                            <button onClick={() => handleSuspend(p.id)}
                                                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-400/40 hover:text-red-400 transition-all flex items-center gap-1 hover:bg-white/5 rounded-lg">
                                                <XCircle size={10} /> Suspend
                                            </button>
                                            <button onClick={() => handleRemoveMember(p.id, p.full_name || p.email)}
                                                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500/60 hover:text-red-400 transition-all flex items-center gap-1 hover:bg-red-500/10 rounded-lg ml-auto">
                                                <Trash2 size={10} /> Remove Member
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Unlinked Governance Roles */}
            {unlinkedRoles.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle size={16} className="text-white/20" />
                        <h3 className="text-sm font-bold text-white/30 uppercase tracking-widest">Unlinked Governance Roles ({unlinkedRoles.length})</h3>
                    </div>
                    <p className="text-xs text-white/20 mb-4">These directors and officers have not registered on the platform yet.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {unlinkedRoles.map(r => (
                            <div key={r.id} className="p-4 bg-white/[0.02] border border-dashed border-white/10 rounded-xl flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-xs font-bold text-white/15">
                                    {r.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-sm font-bold text-white/40 truncate">{r.name}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] text-white/20 capitalize">{r.type} — {r.title}</span>
                                        {r.email && (
                                            <span className="text-[10px] text-white/15">{r.email}</span>
                                        )}
                                    </div>
                                </div>
                                <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white/15 bg-white/[0.03] border border-white/5 rounded">
                                    Not Registered
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Suspended Users */}
            {suspended.length > 0 && (
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <XCircle size={16} className="text-red-400/30" />
                        <h3 className="text-sm font-bold text-red-400/30 uppercase tracking-widest">Suspended ({suspended.length})</h3>
                    </div>
                    <div className="space-y-2">
                        {suspended.map(p => (
                            <div key={p.id} className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center justify-between opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xs font-bold text-red-400/30">
                                        {(p.full_name || p.email)?.[0]?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white/40">{p.full_name || p.email.split('@')[0]}</h4>
                                        <p className="text-[10px] text-white/20">{p.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleApprove(p.id)}
                                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400/40 hover:text-emerald-400 border border-white/5 rounded-lg transition-all">
                                    Reinstate
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        {/* MODAL: INVITE MEMBER */}
        {inviteModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn">
                <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-white/10">
                        <div>
                            <h4 className="text-xl font-bold text-white font-rajdhani flex items-center gap-2">
                                <UserPlus className="text-[#F54029]" size={20} /> Invite Team Member
                            </h4>
                            <p className="text-white/40 text-xs mt-1">Configure subsidiary role, presets, and access details</p>
                        </div>
                        <button 
                            onClick={() => setInviteModalOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleInviteSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                        <div>
                            <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Full Name</label>
                            <input
                                type="text"
                                required
                                value={inviteForm.name}
                                onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                placeholder="e.g. Alice Cooper"
                            />
                        </div>

                        <div>
                            <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Email Address</label>
                            <input
                                type="email"
                                required
                                value={inviteForm.email}
                                onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                placeholder="alice@subsidiary.com"
                            />
                        </div>

                        <div>
                            <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Subsidiary Entity</label>
                            <select
                                required
                                value={inviteForm.subsidiaryId}
                                onChange={e => setInviteForm({ ...inviteForm, subsidiaryId: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                style={{ colorScheme: 'dark' }}
                            >
                                {subsidiaries.map(sub => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Role Type</label>
                                <select
                                    value={inviteForm.role}
                                    onChange={e => setInviteForm({ ...inviteForm, role: e.target.value as any })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                    style={{ colorScheme: 'dark' }}
                                >
                                    <option value="director">Board Director</option>
                                    <option value="officer">Corporate Officer</option>
                                    <option value="team">Team Member</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Role Preset</label>
                                <select
                                    value={selectedPreset}
                                    onChange={e => {
                                        const val = e.target.value
                                        setSelectedPreset(val)
                                        if (val === 'Custom...') {
                                            setInviteForm(prev => ({ ...prev, title: customTitle || '' }))
                                        } else {
                                            setInviteForm(prev => ({ ...prev, title: val }))
                                        }
                                    }}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                    style={{ colorScheme: 'dark' }}
                                >
                                    {(ROLE_PRESETS[inviteForm.role] || []).map(preset => (
                                        <option key={preset} value={preset}>
                                            {preset}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {(selectedPreset === 'Custom...' || !selectedPreset) && (
                            <div className="animate-fadeIn">
                                <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Custom Role Title</label>
                                <input
                                    type="text"
                                    required
                                    value={customTitle}
                                    onChange={e => {
                                        const val = e.target.value
                                        setCustomTitle(val)
                                        setInviteForm(prev => ({ ...prev, title: val }))
                                    }}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                    placeholder="e.g. Chairman of Governance Committee, VP of Growth"
                                />
                            </div>
                        )}

                        {inviteForm.role === 'director' && (
                            <div className="grid grid-cols-1 gap-4 p-4 bg-white/5 border border-white/5 rounded-xl animate-fadeIn">
                                <label className="text-white/80 text-xs font-semibold block mb-1 uppercase tracking-wide">Director Seat Type</label>
                                <select
                                    value={inviteForm.seatType}
                                    onChange={e => setInviteForm({ ...inviteForm, seatType: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                    style={{ colorScheme: 'dark' }}
                                >
                                    <option value="founder">Founder Director</option>
                                    <option value="independent">Independent Director</option>
                                    <option value="observer">Board Observer</option>
                                    <option value="at_large">At-Large Director</option>
                                </select>
                            </div>
                        )}

                        {inviteForm.role === 'officer' && (
                            <div className="grid grid-cols-1 gap-4 p-4 bg-white/5 border border-white/5 rounded-xl animate-fadeIn">
                                <div>
                                    <label className="text-white/80 text-xs font-semibold block mb-2 uppercase tracking-wide">Department</label>
                                    <input
                                        type="text"
                                        value={inviteForm.department}
                                        onChange={e => setInviteForm({ ...inviteForm, department: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-white/30 transition-colors"
                                        placeholder="e.g. Executive, Engineering, Corporate"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-[#F54029] hover:bg-[#F54029]/80 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-all shadow-[0_4px_12px_rgba(245,64,41,0.2)] mt-6"
                        >
                            Send Registration Invitation
                        </button>
                    </form>
                </div>
            </div>
        )}
        </div>
    )
}
