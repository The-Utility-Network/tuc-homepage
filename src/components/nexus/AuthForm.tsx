'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function AuthForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
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
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${location.origin}/nexus/auth/callback`,
                        data: {
                            full_name: email.split('@')[0], // Default name
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
                    {isSignUp ? 'ACCESS REQUES' : 'TUC NEXUS'}
                </h2>
                <p className="text-[#F54029]/60 text-sm uppercase tracking-widest">
                    The Utility Company Ecosystem
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
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
