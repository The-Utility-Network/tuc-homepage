// This file is being replaced by a Client Component structure to support mobile state.
// We will modify this file to simply fetch data and pass it to NexusShell.
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import NexusShell from './NexusShell'
import ThirdWebProviderWrapper from './ThirdWebProvider'
import { Clock, ShieldAlert, LogOut } from 'lucide-react'

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

    // Fetch profile to get role and status
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, status, full_name, company_name')
        .eq('id', user.id)
        .single()

    const role = profile?.role || 'investor'
    const name = profile?.full_name || user.email
    const company = profile?.company_name || 'TUC Investor'
    const status = profile?.status || 'pending_approval'

    // Gated state for pending or suspended users
    if (status === 'pending_approval' || status === 'suspended') {
        const isPending = status === 'pending_approval'
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-black relative overflow-hidden font-rajdhani select-none">
                {/* Glowing radial backdrop */}
                <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(${isPending ? '245,158,11,0.06' : '239,68,68,0.06'},50%),transparent_70%)]`} />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10" />

                <div className="relative z-10 w-full max-w-md p-8 bg-[#0A0A0A] border border-white/5 rounded-2xl text-center space-y-6 shadow-2xl backdrop-blur-md">
                    <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center border ${
                        isPending 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                    }`}>
                        {isPending ? (
                            <Clock size={28} />
                        ) : (
                            <ShieldAlert size={28} />
                        )}
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                            {isPending ? 'Registration Pending' : 'Account Suspended'}
                        </h2>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest">
                            {isPending ? 'Awaiting Administrative Review' : 'Access Restricted'}
                        </p>
                    </div>

                    <p className="text-white/60 text-xs leading-relaxed max-w-xs mx-auto">
                        {isPending 
                            ? 'Your Nexus credentials have been registered successfully and are currently awaiting review by the TUC administrative team. You will be notified via email once platform access is granted.' 
                            : 'Your TUC Nexus portal credentials have been suspended by an administrator. Please contact operations if you believe this is an error.'}
                    </p>

                    <hr className="border-white/5 w-12 mx-auto" />

                    <form action="/auth/signout" method="post" className="w-full pt-2">
                        <button type="submit" className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-[#F54029] rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2">
                            <LogOut size={12} /> Sign Out of Account
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <ThirdWebProviderWrapper>
            <NexusShell
                role={role}
                name={name}
                company={company}
                userEmail={user.email || ''}
            >
                {children}
            </NexusShell>
        </ThirdWebProviderWrapper>
    )
}
