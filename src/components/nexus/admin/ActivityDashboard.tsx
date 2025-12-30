'use client'

import { useEffect, useState } from 'react'
import { Activity, Users, TrendingUp, FileText, Shield, Eye, Download, DollarSign } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface ActivityEvent {
    id: string
    actorEmail: string
    actorRole: string
    activityType: string
    activityCategory: string
    action: string
    resourceType: string
    resourceName: string
    description: string
    createdAt: string
    status: string
}

interface ActivityStats {
    totalActivities: number
    uniqueUsers: number
    todayActivities: number
    failedActivities: number
}

export default function ActivityDashboard({ subsidiaryId }: { subsidiaryId?: string }) {
    const [activities, setActivities] = useState<ActivityEvent[]>([])
    const [stats, setStats] = useState<ActivityStats | null>(null)
    const [filter, setFilter] = useState<'all' | 'investment' | 'governance' | 'data_room' | 'compliance'>('all')
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchActivities()
        fetchStats()
    }, [subsidiaryId, filter])

    async function fetchActivities() {
        let query = supabase
            .from('activity_log')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100)

        if (subsidiaryId) {
            query = query.eq('subsidiary_id', subsidiaryId)
        }

        if (filter !== 'all') {
            query = query.eq('activity_category', filter)
        }

        const { data } = await query

        if (data) {
            setActivities(data.map(a => ({
                id: a.id,
                actorEmail: a.actor_email || 'System',
                actorRole: a.actor_role,
                activityType: a.activity_type,
                activityCategory: a.activity_category,
                action: a.action,
                resourceType: a.resource_type || '',
                resourceName: a.resource_name || '',
                description: a.description || '',
                createdAt: a.created_at,
                status: a.status,
            })))
        }

        setLoading(false)
    }

    async function fetchStats() {
        let query = supabase
            .from('activity_log')
            .select('*', { count: 'exact', head: true })

        if (subsidiaryId) {
            query = query.eq('subsidiary_id', subsidiaryId)
        }

        const { count: totalCount } = await query

        // Unique users
        const { data: userData } = await supabase
            .from('activity_log')
            .select('user_id')
            .not('user_id', 'is', null)

        const uniqueUsers = new Set(userData?.map(d => d.user_id) || []).size

        // Today's activities
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        let todayQuery = supabase
            .from('activity_log')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today.toISOString())

        if (subsidiaryId) {
            todayQuery = todayQuery.eq('subsidiary_id', subsidiaryId)
        }

        const { count: todayCount } = await todayQuery

        // Failed activities
        let failedQuery = supabase
            .from('activity_log')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'failed')

        if (subsidiaryId) {
            failedQuery = failedQuery.eq('subsidiary_id', subsidiaryId)
        }

        const { count: failedCount } = await failedQuery

        setStats({
            totalActivities: totalCount || 0,
            uniqueUsers,
            todayActivities: todayCount || 0,
            failedActivities: failedCount || 0,
        })
    }

    function getCategoryIcon(category: string) {
        switch (category) {
            case 'investment': return <DollarSign className="text-green-400" size={20} />
            case 'governance': return <Shield className="text-purple-400" size={20} />
            case 'data_room': return <FileText className="text-blue-400" size={20} />
            case 'compliance': return <Activity className="text-orange-400" size={20} />
            default: return <Activity className="text-white/60" size={20} />
        }
    }

    function getStatusColor(status: string) {
        return status === 'success' ? 'text-green-400' : status === 'failed' ? 'text-red-400' : 'text-yellow-400'
    }

    if (loading || !stats) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F54029]"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-black/40 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <Activity className="text-blue-400" size={24} />
                        <p className="text-white/60 text-sm uppercase tracking-wider">Total Activities</p>
                    </div>
                    <p className="text-white text-4xl font-bold font-rajdhani">{stats.totalActivities.toLocaleString()}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-black/40 border border-purple-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <Users className="text-purple-400" size={24} />
                        <p className="text-white/60 text-sm uppercase tracking-wider">Active Users</p>
                    </div>
                    <p className="text-white text-4xl font-bold font-rajdhani">{stats.uniqueUsers}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-black/40 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <TrendingUp className="text-green-400" size={24} />
                        <p className="text-white/60 text-sm uppercase tracking-wider">Today</p>
                    </div>
                    <p className="text-white text-4xl font-bold font-rajdhani">{stats.todayActivities}</p>
                </div>

                <div className="bg-gradient-to-br from-red-500/20 to-black/40 border border-red-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <Activity className="text-red-400" size={24} />
                        <p className="text-white/60 text-sm uppercase tracking-wider">Failed</p>
                    </div>
                    <p className="text-red-400 text-4xl font-bold font-rajdhani">{stats.failedActivities}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                {['all', 'investment', 'governance', 'data_room', 'compliance'].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat as any)}
                        className={`px-6 py-2 rounded-lg font-medium transition-all capitalize ${filter === cat
                                ? 'bg-[#F54029] text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        {cat.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Activity Feed */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 font-rajdhani flex items-center gap-3">
                    <Activity className="text-[#F54029]" size={32} />
                    Activity Stream
                </h2>

                {activities.length === 0 ? (
                    <div className="text-center py-16">
                        <Activity className="mx-auto mb-4 text-white/40" size={64} />
                        <p className="text-white/60 text-lg">No activities yet</p>
                        <p className="text-white/40 text-sm mt-2">Activity will appear here as users interact with the platform</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {activities.map(activity => (
                            <div
                                key={activity.id}
                                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        {getCategoryIcon(activity.activityCategory)}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-white font-bold">{activity.actorEmail}</span>
                                                <span className="px-2 py-1 bg-white/10 rounded text-xs text-white/60">
                                                    {activity.actorRole}
                                                </span>
                                                <span className="text-white/60 text-sm">
                                                    {activity.action} {activity.resourceType && `${activity.resourceType}`}
                                                </span>
                                            </div>
                                            {activity.description && (
                                                <p className="text-white/60 text-sm mb-2">{activity.description}</p>
                                            )}
                                            {activity.resourceName && (
                                                <p className="text-white/40 text-xs">Resource: {activity.resourceName}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-white/60 text-xs mb-1">
                                            {new Date(activity.createdAt).toLocaleString()}
                                        </p>
                                        <span className={`text-xs font-medium ${getStatusColor(activity.status)}`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
