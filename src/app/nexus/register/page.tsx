import InvestorRegistrationForm from '@/components/nexus/InvestorRegistrationForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Investor Registration | BasaltHQ',
    description: 'Secure application point for BasaltHQ capital formation.',
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,157,255,0.08),transparent_70%)]" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20" />

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F54029]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />

            <div className="relative z-10 w-full flex flex-col items-center">
                <InvestorRegistrationForm />

                <div className="mt-8 text-center text-white/20 text-xs tracking-widest uppercase">
                    <p>© 2026 BasaltHQ</p>
                    <p className="mt-2">Offerings to Accredited Investors Only</p>
                </div>
            </div>
        </div>
    )
}
