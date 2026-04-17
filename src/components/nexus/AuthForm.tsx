'use client'

import { useState } from 'react'
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
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [isSignUp, setIsSignUp] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            if (isSignUp) {
                if (!accreditationType) {
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
                        }
                    },
                })
                if (error) throw error

                if (data.session) {
                    // Email confirmation disabled, logged in immediately
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

    return (
        <div className="w-full max-w-md p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-white mb-2 tracking-wide font-rajdhani">
                    {isSignUp ? 'ACCESS REQUEST' : 'TUC NEXUS'}
                </h2>
                <p className="text-[#F54029]/60 text-sm uppercase tracking-widest">
                    The Utility Company Ecosystem
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
                
                {isSignUp && (
                    <>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-[#F54029]/80 mb-2 uppercase tracking-wider">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required={isSignUp}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#F54029]/50 focus:ring-1 focus:ring-[#F54029]/50 transition-all"
                                    placeholder="Jane"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium text-[#F54029]/80 mb-2 uppercase tracking-wider">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required={isSignUp}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#F54029]/50 focus:ring-1 focus:ring-[#F54029]/50 transition-all"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[#F54029]/80 mb-2 uppercase tracking-wider">
                                LinkedIn Profile URL <span className="text-white/40 lowercase normal-case text-[10px] ml-1">(Optional)</span>
                            </label>
                            <input
                                type="url"
                                value={linkedinUrl}
                                onChange={(e) => setLinkedinUrl(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#F54029]/50 focus:ring-1 focus:ring-[#F54029]/50 transition-all"
                                placeholder="https://linkedin.com/in/janedoe"
                            />
                        </div>
                    </>
                )}

                <div>
                    <label className="block text-xs font-medium text-[#F54029]/80 mb-2 uppercase tracking-wider">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#F54029]/50 focus:ring-1 focus:ring-[#F54029]/50 transition-all"
                        placeholder="investor@example.com"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-[#F54029]/80 mb-2 uppercase tracking-wider">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#F54029]/50 focus:ring-1 focus:ring-[#F54029]/50 transition-all"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#F54029] transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {isSignUp && (
                    <div className="bg-white/5 border border-white/10 p-4 rounded-lg space-y-3">
                        <label className="block text-xs font-medium text-[#F54029] uppercase tracking-wider">
                            Accreditation Questionnaire
                        </label>
                        <p className="text-white/60 text-xs mb-2">
                            To comply with SEC regulations, please indicate your accreditation status to access our private data rooms.
                        </p>
                        <select
                            value={accreditationType}
                            onChange={(e) => setAccreditationType(e.target.value)}
                            required={isSignUp}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F54029]/50 transition-all text-sm appearance-none"
                        >
                            <option value="" disabled>Select your status...</option>
                            <option value="income">Individual Income &gt; $200k (or $300k joint)</option>
                            <option value="net_worth">Net Worth &gt; $1M (excluding primary residence)</option>
                            <option value="entity">Investing on behalf of an Accredited Entity</option>
                            <option value="qualified_purchaser">Qualified Purchaser (&gt; $5M in investments)</option>
                            <option value="none">I am not an accredited investor</option>
                        </select>
                    </div>
                )}

                {message && (
                    <div className={`p-4 rounded-lg text-sm ${message.includes('Check') ? 'bg-[#F54029]/20 text-[#F54029]' : 'bg-red-900/20 text-red-400'} border border-white/5`}>
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#F54029] to-[#C53020] hover:from-[#ff8062] hover:to-[#F54029] text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                    {loading && <Loader2 className="animate-spin" size={18} />}
                    <span className="tracking-widest uppercase text-sm">
                        {isSignUp ? 'Request Access' : 'Enter Nexus'}
                    </span>
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-white/40 text-xs hover:text-[#F54029] transition-colors uppercase tracking-widest"
                    >
                        {isSignUp ? 'Already have an account? Login' : 'New Investor? Request Access'}
                    </button>
                </div>
            </form>
        </div>
    )
}
