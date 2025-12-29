// This file is being replaced by a Client Component structure to support mobile state.
// We will modify this file to simply fetch data and pass it to NexusShell.
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import NexusShell from './NexusShell'
import ThirdWebProviderWrapper from './ThirdWebProvider'

export default async function NexusLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/nexus/login')
    }

    // Fetch profile to get role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name, company_name')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'investor'
    const name = profile?.full_name || user.email
    const company = profile?.company_name || 'TUC Investor'

    return (
        <ThirdWebProviderWrapper>
            <NexusShell
                role={role}
                name={name}
                company={company}
                userEmail={user.email}
            >
                {children}
            </NexusShell>
        </ThirdWebProviderWrapper>
    )
}
