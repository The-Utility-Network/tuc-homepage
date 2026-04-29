'use client'

export default function InvestorRegistrationForm() {
    return (
        <div className="p-8 bg-black/40 border border-white/10 rounded-2xl text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold font-rajdhani text-white mb-4 tracking-wide uppercase">Investor Registration</h2>
            <p className="text-white/60 mb-6 text-sm">
                Registration is currently processed via an invite-only flow. If you are a prospective investor, please contact our capital formation team.
            </p>
            <a 
                href="mailto:investors@theutilitycompany.com"
                className="inline-block bg-[#F54029] text-white font-bold py-3 px-6 rounded-xl hover:bg-[#F54029]/80 transition-colors shadow-[0_0_20px_rgba(245,64,41,0.2)]"
            >
                Contact Team
            </a>
        </div>
    )
}
