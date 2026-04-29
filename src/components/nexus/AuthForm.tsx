'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function AuthForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [linkedinUrl, setLinkedinUrl] = useState('')
    const [accreditationType, setAccreditationType] = useState('')
    const [requestedRole, setRequestedRole] = useState('investor')
    const [positionTitle, setPositionTitle] = useState('')
    
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [isSignUp, setIsSignUp] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    
    const [isInitialized, setIsInitialized] = useState<boolean | null>(null)
    
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetch('/api/nexus/initialize')
            .then(res => res.json())
            .then(data => setIsInitialized(data.initialized))
            .catch(() => setIsInitialized(true)) // default to true if error
    }, [])

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            if (isInitialized === false) {
                // Initialize Nexus (First Admin)
                const res = await fetch('/api/nexus/initialize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, full_name: `${firstName} ${lastName}`.trim(), position_title: positionTitle })
                })
                const data = await res.json()
                if (!res.ok) throw new Error(data.message)
                
                // Sign in immediately
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
                router.push('/nexus/dashboard')
                router.refresh()
                return
            }

            if (isSignUp) {
                if (!accreditationType && requestedRole === 'investor') {
                    throw new Error('Please complete the accreditation questionnaire.')
                }
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/nexus/auth/callback`,
                        data: {
                            full_name: `${firstName} ${lastName}`.trim(),
                            linkedin_url: linkedinUrl,
                            accreditation_type: accreditationType,
                            requested_role: requestedRole,
                            position_title: positionTitle
                        }
                    },
                })
                if (error) throw error

                if (data.session) {
                    router.push('/nexus/dashboard')
                    router.refresh()
                } else {
                    setMessage('Check your email for the confirmation link.')
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/nexus/dashboard')
                router.refresh()
            }
        } catch (error: any) {
            setMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    if (isInitialized === null) {
        return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-[#F54029]" size={32} /></div>
    }

    return (
        <div className="w-full max-w-md p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-white mb-2 tracking-wide font-rajdhani">
                    {isInitialized === false ? 'INITIALIZE NEXUS' : isSignUp ? 'ACCESS REQUEST' : 'TUC NEXUS'}
                </h2>
                <p className="text-[#F54029]/60 text-sm uppercase tracking-widest">
                    {isInitialized === false ? 'System Bootstrap' : 'The Utility Company Ecosystem'}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
                
                {(isSignUp || isInitialized === false) && (
                    <>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-[#F54029]/80 mb-2 uppercase tracking-wider">First Name</label>
                                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029]/50 focus:ring-1 transition-all outline-none" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-[#F54029]/80 mb-2 uppercase tracking-wider">Last Name</label>
                                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029]/50 focus:ring-1 transition-all outline-none" />
                            </div>
                        </div>

                        {isInitialized !== false && (
                            <div>
                                <label className="block text-xs font-medium text-[#F54029]/80 mb-2 uppercase tracking-wider">Role Request</label>
                                <select value={requestedRole} onChange={e => setRequestedRole(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029]/50 transition-all outline-none appearance-none">
                                    <option value="investor">Investor</option>
                                    <option value="employee">Employee</option>
                                    <option value="partner">Partner</option>
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-[#F54029]/80 mb-2 uppercase tracking-wider">Position / Title <span className="text-white/40 lowercase normal-case text-[10px] ml-1">(Optional)</span></label>
                            <input type="text" value={positionTitle} onChange={(e) => setPositionTitle(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029]/50 focus:ring-1 transition-all outline-none" placeholder="e.g. Director of Ops" />
                        </div>

                        {isInitialized !== false && (
                            <div>
                                <label className="block text-xs font-medium text-[#F54029]/80 mb-2 uppercase tracking-wider">LinkedIn Profile URL <span className="text-white/40 lowercase normal-case text-[10px] ml-1">(Optional)</span></label>
                                <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029]/50 focus:ring-1 transition-all outline-none" placeholder="https://linkedin.com/in/..." />
                            </div>
                        )}
                    </>
                )}

                <div>
                    <label className="block text-xs font-medium text-[#F54029]/80 mb-2 uppercase tracking-wider">Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029]/50 focus:ring-1 transition-all outline-none" placeholder="nexus@theutilitycompany.co" />
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#F54029]/80 mb-2 uppercase tracking-wider flex justify-between">
                        <span>Password</span>
                        {!isSignUp && isInitialized !== false && (
                            <a href="/nexus/forgot-password" className="text-white/40 hover:text-[#F54029] normal-case text-[10px] underline">Forgot?</a>
                        )}
                    </label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029]/50 focus:ring-1 transition-all outline-none" placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#F54029] transition-colors">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {isSignUp && requestedRole === 'investor' && isInitialized !== false && (
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg space-y-3">
                        <label className="block text-xs font-medium text-[#F54029] uppercase tracking-wider">Accreditation</label>
                        <select value={accreditationType} onChange={(e) => setAccreditationType(e.target.value)} required
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029]/50 transition-all text-sm appearance-none outline-none">
                            <option value="" disabled>Select your status...</option>
                            <option value="income">Income &gt; $200k (or $300k joint)</option>
                            <option value="net_worth">Net Worth &gt; $1M (excluding primary residence)</option>
                            <option value="entity">Accredited Entity</option>
                            <option value="qualified_purchaser">Qualified Purchaser (&gt; $5M)</option>
                            <option value="none">Not an accredited investor</option>
                        </select>
                    </div>
                )}

                {message && (
                    <div className={`p-4 rounded-lg text-sm ${message.includes('Check') ? 'bg-[#F54029]/20 text-[#F54029]' : 'bg-red-900/20 text-red-400'} border border-white/5`}>
                        {message}
                    </div>
                )}

                <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-[#F54029] to-[#C53020] hover:from-[#ff8062] hover:to-[#F54029] text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading && <Loader2 className="animate-spin" size={18} />}
                    <span className="tracking-widest uppercase text-sm">
                        {isInitialized === false ? 'Initialize Admin' : isSignUp ? 'Request Access' : 'Enter Nexus'}
                    </span>
                </button>

                {isInitialized !== false && (
                    <div className="text-center">
                        <button type="button" onClick={() => setIsSignUp(!isSignUp)}
                            className="text-white/40 text-xs hover:text-[#F54029] transition-colors uppercase tracking-widest">
                            {isSignUp ? 'Already have an account? Login' : 'New User? Request Access'}
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}
