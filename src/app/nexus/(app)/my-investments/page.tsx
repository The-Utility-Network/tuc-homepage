'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import InvestorPortal from '@/components/nexus/fundraising/InvestorPortal'
import { useRouter } from 'next/navigation'

export default function MyInvestmentsPage() {
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        checkAccess()
    }, [])

    async function checkAccess() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            router.push('/nexus/login')
            return
        }

        await supabase.rpc('log_activity', {
            p_user_id: user.id,
            p_activity_type: 'page_view',
            p_action: 'viewed',
            p_resource_type: 'investor_portal',
            p_description: 'Viewed investor portal'
        })

        setLoading(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F54029]"></div>
            </div>
        )
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white font-rajdhani mb-2">My Investments</h1>
                <p className="text-white/60">Track your portfolio and stay updated</p>
            </div>

            <InvestorPortal />
        </div>
    )
}
