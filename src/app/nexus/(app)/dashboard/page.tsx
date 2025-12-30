import { createClient } from '@/lib/supabase-server'
import InvestorDashboard from '@/components/nexus/InvestorDashboard'
import AdminDashboard from '@/components/nexus/AdminDashboard'
import MedallionStrip from '@/components/nexus/MedallionStrip'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null // Should be handled by layout/middleware

    // Fetch Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'investor'

    return (
        <div className="space-y-8">
            {user && <MedallionStrip userId={user.id} />}

            <header>
                <h1 className="text-3xl font-rajdhani font-bold text-white uppercase tracking-wider">
                    {role === 'admin' ? 'Management Console' : 'Investor Dashboard'}
                </h1>
                <p className="text-white/40 text-sm mt-1">
                    {role === 'admin'
                        ? 'Oversee fundraising, investors, and document distribution.'
                        : 'Track your investments, documents, and network status.'}
                </p>
            </header>

            {role === 'admin' ? (
                <AdminDashboard profile={profile} />
            ) : (
                <InvestorDashboard profile={profile} />
            )}
        </div>
    )
}
