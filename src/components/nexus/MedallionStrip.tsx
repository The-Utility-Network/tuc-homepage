'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Award, Building2 } from 'lucide-react'

// Medallion Interface
interface Medallion {
    id: string
    subsidiaryName: string
    role: string // 'Admin' | 'Investor'
    logoUrl?: string
    shares?: number
}

// Mock logo colors for stubs since we don't have real logos yet
const MOCK_COLORS = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500'
]

export default function MedallionStrip({ userId }: { userId: string }) {
    const [medallions, setMedallions] = useState<Medallion[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        fetchMedallions()
    }, [userId])

    const fetchMedallions = async () => {
        if (!userId) return

        // 1. Get where user is Admin (admin_roles)
        const { data: adminRoles } = await supabase
            .from('admin_roles')
            .select('subsidiary_id, role_type, subsidiaries(name)')
            .eq('user_id', userId)
            .is('revoked_at', null)

        // 2. Get where user is Investor (cap_table)
        const { data: investments } = await supabase
            .from('cap_table')
            .select('subsidiary_id, shares, subsidiaries(name)')
            .eq('user_id', userId)
            .gt('shares', 0)

        // Merge results
        const map = new Map<string, Medallion>()

        // Process Admin Roles
        adminRoles?.forEach((role: any) => {
            const subId = role.subsidiary_id
            if (!subId) return // Super admin might handle differently

            map.set(subId, {
                id: subId,
                subsidiaryName: role.subsidiaries?.name || 'Unknown Entity',
                role: 'Admin'
            })
        })

        // Process Investments
        investments?.forEach((inv: any) => {
            const subId = inv.subsidiary_id
            if (map.has(subId)) {
                // If already admin, keep admin but maybe note they are also investor
                // For this display, Admin privilege usually trumps or we show both? 
                // Let's just append roles nicely in UI or keep distinct?
                // Request says "Every member... should have the medallions of the project's cap tables they are on"
                // So if I am admin I am 'on' it? Or only if I have equity? 
                // "Cap Table can only include Admins that have been added or Investors"
                // Let's assume Medallion = affiliation.
            } else {
                map.set(subId, {
                    id: subId,
                    subsidiaryName: inv.subsidiaries?.name || 'Unknown Entity',
                    role: 'Investor',
                    shares: inv.shares
                })
            }
        })

        setMedallions(Array.from(map.values()))
        setLoading(false)
    }

    if (loading) return null

    if (medallions.length === 0) return null

    return (
        <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-4">
                {medallions.map((medallion, idx) => (
                    <div
                        key={medallion.id}
                        className="group flex flex-col items-center justify-center p-4 min-w-[120px] bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#F54029]/30 transition-all cursor-pointer relative overflow-hidden"
                    >
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${MOCK_COLORS[idx % MOCK_COLORS.length]} opacity-0 group-hover:opacity-10 transition-opacity`} />

                        {/* Medallion Icon */}
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${MOCK_COLORS[idx % MOCK_COLORS.length]} p-0.5 shadow-lg mb-3 ring-2 ring-black/50 group-hover:scale-110 transition-transform duration-300`}>
                            <div className="w-full h-full bg-black/90 rounded-full flex items-center justify-center backdrop-blur-xl">
                                <Building2 size={20} className="text-white" />
                            </div>
                        </div>

                        {/* Text */}
                        <h4 className="text-white font-bold text-xs text-center font-rajdhani truncate w-full mb-1">
                            {medallion.subsidiaryName}
                        </h4>
                        <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/5 group-hover:border-white/20 transition-colors">
                            {medallion.role}
                        </span>

                        {/* Tooltip hint in UI for shares if avail */}
                        {medallion.shares && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Active Equity Holder" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
