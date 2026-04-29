'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Users, Briefcase, Calendar, Gavel, BookOpen, Clock, Landmark, Scale, FileText } from 'lucide-react'
import BoardDirectory from '@/components/nexus/governance/BoardDirectory'
import OfficerRegistry from '@/components/nexus/governance/OfficerRegistry'
import MeetingManager from '@/components/nexus/governance/MeetingManager'
import CorporateCalendar from '@/components/nexus/governance/CorporateCalendar'
import dynamic from 'next/dynamic'

const ResolutionCenter = dynamic(() => import('@/components/nexus/governance/ResolutionCenter'), { ssr: false })
const CorporateDocuments = dynamic(() => import('@/components/nexus/governance/CorporateDocuments'), { ssr: false })
const GovernanceMemos = dynamic(() => import('@/components/nexus/governance/GovernanceMemos'), { ssr: false })

import { getCurrentProfile } from '../../actions'

const TABS = [
    { id: 'board', label: 'Board & Officers', icon: Users, description: 'Directors and corporate officers' },
    { id: 'meetings', label: 'Meetings', icon: Calendar, description: 'Schedule and manage board meetings' },
    { id: 'resolutions', label: 'Resolutions', icon: Gavel, description: 'Board and shareholder actions' },
    { id: 'documents', label: 'Corporate Docs', icon: BookOpen, description: 'Upload & view PDF filings' },
    { id: 'memos', label: 'Memos & Reports', icon: FileText, description: 'Departmental communications' },
    { id: 'calendar', label: 'Calendar', icon: Clock, description: 'Deadlines and filing schedule' },
]

export default function GovernancePage() {
    const searchParams = useSearchParams()
    const tabParam = searchParams.get('tab')
    const focusId = searchParams.get('focus') || searchParams.get('sign') || ''

    const [activeTab, setActiveTab] = useState(tabParam && TABS.some(t => t.id === tabParam) ? tabParam : 'board')
    const [role, setRole] = useState('investor')
    const [userEmail, setUserEmail] = useState('')
    const [userName, setUserName] = useState('')
    const [directors, setDirectors] = useState<{ name: string; email: string; title: string }[]>([])
    const [officers, setOfficers] = useState<{ name: string; email: string; title: string }[]>([])

    // Sync tab from URL on navigation
    useEffect(() => {
        if (tabParam && TABS.some(t => t.id === tabParam)) {
            setActiveTab(tabParam)
        }
    }, [tabParam])

    useEffect(() => {
        getCurrentProfile().then(p => {
            if (p?.role) setRole(p.role)
            if (p?.email) setUserEmail(p.email)
            if (p?.full_name) setUserName(p.full_name)
        }).catch(() => { })

        // Fetch directors and officers for notification targeting (keep all roles)
        fetch('/api/nexus/board?type=all').then(r => r.json()).then(d => {
            if (d.directors) setDirectors(d.directors.filter((m: any) => m.email).map((m: any) => ({ name: m.name, email: m.email, title: m.seat_type || m.title || 'Director' })))
            if (d.officers) setOfficers(d.officers.filter((o: any) => o.email).map((o: any) => ({ name: o.name, email: o.email, title: o.title || 'Officer' })))
        }).catch(() => { })
    }, [])

    const isAdmin = ['admin', 'superadmin'].includes(role)

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F54029]/20 to-[#F54029]/5 flex items-center justify-center border border-[#F54029]/20">
                        <Landmark size={20} className="text-[#F54029]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-rajdhani text-white tracking-wide">Governance</h1>
                        <p className="text-xs text-white/40 uppercase tracking-widest">BasaltHQ Inc. • Delaware C-Corp</p>
                    </div>
                </div>
                <p className="text-sm text-white/40 mt-3 max-w-2xl">
                    Corporate governance hub for the board of directors, officer appointments, resolutions, bylaws, and Delaware compliance deadlines.
                </p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {TABS.map(tab => {
                    const Icon = tab.icon
                    const active = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all duration-300 whitespace-nowrap ${active
                                ? 'bg-[#F54029]/10 border-[#F54029]/20 text-[#F54029] shadow-[0_0_20px_rgba(17,157,255,0.05)]'
                                : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white hover:border-white/10'
                                }`}
                        >
                            <Icon size={16} className={active ? 'text-[#F54029]' : ''} />
                            <span className="text-xs font-bold uppercase tracking-wider">{tab.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Fixed Algebra Banner */}
            <div className="p-4 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent border border-amber-500/10 rounded-xl flex items-center gap-4">
                <Scale size={20} className="text-amber-400/40 shrink-0" />
                <div className="flex-1">
                    <p className="text-xs font-bold text-amber-400/60 uppercase tracking-widest">Fixed Algebra Governance Model</p>
                    <p className="text-xs text-white/30 mt-0.5">20-20-20 Founder Equity • Unanimous Consent for Material Actions (§4.4) • Debt Gate &gt;$50K (§8.6A)</p>
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[60vh]">
                {activeTab === 'board' && (
                    <div className="space-y-12">
                        <BoardDirectory isAdmin={isAdmin} />
                        <div className="border-t border-white/5 pt-12">
                            <OfficerRegistry isAdmin={isAdmin} />
                        </div>
                    </div>
                )}
                {activeTab === 'meetings' && <MeetingManager isAdmin={isAdmin} />}
                {activeTab === 'resolutions' && <ResolutionCenter isAdmin={isAdmin} userEmail={userEmail} userName={userName} directors={directors} officers={officers} />}
                {activeTab === 'documents' && <CorporateDocuments isAdmin={isAdmin} userEmail={userEmail} userName={userName} directors={directors} officers={officers} />}
                {activeTab === 'memos' && <GovernanceMemos isAdmin={isAdmin} userEmail={userEmail} userName={userName} directors={directors} officers={officers} />}
                {activeTab === 'calendar' && <CorporateCalendar />}

            </div>
        </div>
    )
}
