'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check, CheckCheck, Clock, FileText, Gavel, Calendar, MessageSquare } from 'lucide-react'

interface NotificationItem {
    id: string
    type: string
    title: string
    body: string
    link?: string
    read: boolean
    created_at: string
}

const TYPE_ICONS: Record<string, any> = {
    resolution: Gavel,
    meeting: Calendar,
    document: FileText,
    memo: MessageSquare,
    proposal: FileText,
    report: FileText,
    system: Bell
}

const TYPE_COLORS: Record<string, string> = {
    resolution: 'text-purple-400',
    meeting: 'text-red-400',
    document: 'text-emerald-400',
    memo: 'text-amber-400',
    proposal: 'text-cyan-400',
    report: 'text-rose-400',
    system: 'text-white/60'
}

export default function NotificationBell({ userEmail }: { userEmail: string }) {
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const unreadCount = notifications.filter(n => !n.read).length

    useEffect(() => {
        if (!userEmail) return
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000) // Poll every 30s
        return () => clearInterval(interval)
    }, [userEmail])

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    async function fetchNotifications() {
        try {
            const res = await fetch(`/api/nexus/notifications?email=${encodeURIComponent(userEmail)}`)
            if (res.ok) {
                const data = await res.json()
                setNotifications(data.notifications || [])
            }
        } catch (e) { /* silent */ }
    }

    async function markAllRead() {
        try {
            await fetch('/api/nexus/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllRead: true, email: userEmail })
            })
            setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        } catch (e) { /* silent */ }
    }

    async function markRead(id: string) {
        try {
            await fetch('/api/nexus/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
        } catch (e) { /* silent */ }
    }

    function timeAgo(dateStr: string) {
        const diff = Date.now() - new Date(dateStr).getTime()
        const minutes = Math.floor(diff / 60000)
        if (minutes < 1) return 'just now'
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        const days = Math.floor(hours / 24)
        return `${days}d ago`
    }

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative text-white/40 hover:text-white transition-colors"
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#F54029] rounded-full text-[9px] font-bold text-white border-2 border-black px-1">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-10 w-96 max-h-[70vh] bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="flex items-center gap-1 text-[10px] text-[#F54029] hover:text-white uppercase tracking-wider font-bold transition-colors"
                            >
                                <CheckCheck size={12} /> Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="overflow-y-auto max-h-[calc(70vh-60px)] divide-y divide-white/5">
                        {notifications.length === 0 && (
                            <div className="py-12 text-center">
                                <Bell className="mx-auto text-white/10 mb-3" size={32} />
                                <p className="text-xs text-white/30">No notifications yet</p>
                            </div>
                        )}
                        {notifications.map(n => {
                            const Icon = TYPE_ICONS[n.type] || Bell
                            const color = TYPE_COLORS[n.type] || 'text-white/60'
                            return (
                                <div
                                    key={n.id}
                                    onClick={() => { markRead(n.id); if (n.link) window.location.href = n.link }}
                                    className={`flex gap-3 px-5 py-4 cursor-pointer transition-all hover:bg-white/[0.03] ${!n.read ? 'bg-[#F54029]/[0.03]' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.read ? 'bg-[#F54029]/10 border border-[#F54029]/20' : 'bg-white/5 border border-white/5'}`}>
                                        <Icon size={14} className={!n.read ? 'text-[#F54029]' : color} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={`text-xs font-bold truncate ${!n.read ? 'text-white' : 'text-white/60'}`}>{n.title}</p>
                                            {!n.read && <div className="w-2 h-2 rounded-full bg-[#F54029] shrink-0 mt-1" />}
                                        </div>
                                        {n.body && <p className="text-[11px] text-white/30 mt-0.5 line-clamp-2">{n.body}</p>}
                                        <div className="flex items-center gap-1 mt-1.5">
                                            <Clock size={10} className="text-white/20" />
                                            <span className="text-[10px] text-white/20">{timeAgo(n.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
