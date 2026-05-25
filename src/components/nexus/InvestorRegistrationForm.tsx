'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Lock, User, Phone, Linkedin, FileText, CheckCircle, Shield, ArrowRight, Mail, Key } from 'lucide-react'

export default function InvestorRegistrationForm() {
    const supabase = createClient()
    const router = useRouter()

    const [session, setSession] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // Form inputs
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [bio, setBio] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [requestedRole, setRequestedRole] = useState('investor')

    useEffect(() => {
        async function checkSession() {
            const { data: { session: currentSession } } = await supabase.auth.getSession()
            setSession(currentSession)
            
            const params = new URLSearchParams(window.location.search)
            const queryEmail = params.get('email')
            const queryRole = params.get('role')

            if (currentSession) {
                // If they are logged in via invite, pre-fill details from metadata
                const meta = currentSession.user?.user_metadata || {}
                setEmail(currentSession.user?.email || '')
                setFullName(meta.full_name || '')
                setRequestedRole(meta.role || 'team')
            } else {
                if (queryEmail) setEmail(queryEmail)
                if (queryRole) setRequestedRole(queryRole)
            }
            setLoading(false)
        }
        checkSession()
    }, [])

    async function handleSetPasswordSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErrorMsg('')
        
        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match')
            return
        }

        if (password.length < 8) {
            setErrorMsg('Password must be at least 8 characters')
            return
        }

        setSubmitting(true)

        try {
            // 1. Update password and metadata
            const { error: authError } = await supabase.auth.updateUser({
                password: password,
                data: {
                    full_name: fullName,
                    phone: phone,
                    linkedin: linkedin,
                    bio: bio,
                    company_name: companyName
                }
            })

            if (authError) throw authError

            const userId = session.user.id
            const userEmail = session.user.email

            // 2. Update profiles table with active and set fields
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    phone: phone,
                    linkedin: linkedin,
                    bio: bio,
                    company_name: companyName,
                    status: 'approved', // Active/Approved since they were invited
                    role: requestedRole
                })
                .eq('id', userId)

            if (profileError) {
                console.warn('Profile update warning:', profileError)
                // If updating fails (e.g. columns don't exist yet), insert a basic profile fallback
                await supabase
                    .from('profiles')
                    .upsert({
                        id: userId,
                        email: userEmail,
                        full_name: fullName,
                        role: requestedRole,
                        company_name: companyName,
                        status: 'approved'
                    })
            }

            // 3. Link governance roles automatically by matching email
            if (userEmail) {
                await supabase
                    .from('board_members')
                    .update({ user_id: userId })
                    .eq('email', userEmail)

                await supabase
                    .from('officers')
                    .update({ user_id: userId })
                    .eq('email', userEmail)
            }

            setSuccess(true)
            setTimeout(() => {
                router.push('/nexus/dashboard')
            }, 3000)

        } catch (err: any) {
            console.error(err)
            setErrorMsg(err.message || 'Failed to complete registration')
        } finally {
            setSubmitting(false)
        }
    }

    async function handleRequestAccessSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErrorMsg('')

        if (password !== confirmPassword) {
            setErrorMsg('Passwords do not match')
            return
        }

        if (password.length < 8) {
            setErrorMsg('Password must be at least 8 characters')
            return
        }

        setSubmitting(true)

        try {
            // Standard email/password signup with approval status metadata
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: requestedRole,
                        requested_role: requestedRole,
                        status: 'pending_approval',
                        phone,
                        linkedin,
                        bio,
                        company_name: companyName
                    }
                }
            })

            if (signUpError) throw signUpError

            setSuccess(true)
        } catch (err: any) {
            console.error(err)
            setErrorMsg(err.message || 'Failed to submit access request')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F54029]" />
                <p className="text-white/40 text-xs uppercase tracking-widest animate-pulse">Initializing Portal Registration...</p>
            </div>
        )
    }

    if (success) {
        return (
            <div className="p-8 bg-black/60 border border-[#F54029]/20 rounded-2xl text-center max-w-lg mx-auto backdrop-blur-md shadow-2xl animate-fadeIn space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                    <CheckCircle size={32} className="text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold font-rajdhani text-white mb-2 tracking-wide uppercase">
                        {session ? 'Registration Complete!' : 'Request Received!'}
                    </h2>
                    <p className="text-white/60 text-sm">
                        {session 
                            ? 'Your credentials have been securely registered. Redirecting to your governance dashboard...'
                            : 'Your application has been received and added to our review queue. You will receive an email once approved.'
                        }
                    </p>
                </div>
                {session && (
                    <div className="text-xs text-white/30 tracking-widest uppercase animate-pulse">
                        Synchronizing directories...
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="w-full max-w-xl mx-auto p-8 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-md shadow-2xl animate-fadeIn space-y-6">
            <div className="text-center space-y-2 border-b border-white/5 pb-6">
                <Shield className="mx-auto text-[#F54029]" size={36} />
                <h2 className="text-2xl font-bold font-rajdhani text-white tracking-wide uppercase">
                    {session ? 'Activate Nexus Access' : 'Request Nexus Credentials'}
                </h2>
                <p className="text-sm text-white/40">
                    {session 
                        ? 'Set your password and fill out details to link your corporate mandates'
                        : 'Registration is gated to accredited investors and ecosystem officers'
                    }
                </p>
            </div>

            {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold">
                    {errorMsg}
                </div>
            )}

            {session ? (
                /* 1. SET PASSWORD / ACTIVATE FLOW */
                <form onSubmit={handleSetPasswordSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Full Name</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-white/40 text-xs font-semibold block mb-2 uppercase tracking-wide">Email Address</label>
                            <input
                                type="email"
                                disabled
                                value={email}
                                className="w-full bg-white/5 border border-white/5 text-white/40 rounded-xl px-4 py-3 text-sm outline-none cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Set Password</label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                placeholder="Min. 8 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                            />
                        </div>
                    </div>

                    <hr className="border-white/5 my-4" />
                    
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-[#F54029] uppercase tracking-wider">Pertinent User Details</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="+1 (555) 019-2834"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">LinkedIn Profile</label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://linkedin.com/in/username"
                                    value={linkedin}
                                    onChange={e => setLinkedin(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Company Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Acme Corp"
                                value={companyName}
                                onChange={e => setCompanyName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Professional Bio</label>
                            <textarea
                                value={bio}
                                required
                                rows={3}
                                onChange={e => setBio(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors resize-none"
                                placeholder="Outline your corporate/investment biography..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-[#F54029] hover:bg-[#F54029]/80 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(245,64,41,0.2)] disabled:opacity-50 mt-6"
                    >
                        {submitting ? 'Updating Account...' : 'Complete Account Registration'} <ArrowRight size={14} />
                    </button>
                </form>
            ) : (
                /* 2. MANUAL ACCESS REQUEST FLOW */
                <form onSubmit={handleRequestAccessSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Full Name</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Bob Vance"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Email Address</label>
                            <input
                                type="email"
                                required
                                placeholder="bob@vance.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Choose Password</label>
                            <input
                                type="password"
                                required
                                minLength={8}
                                placeholder="Min. 8 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Company Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Vance Refrigeration"
                                value={companyName}
                                onChange={e => setCompanyName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Requested Access Tier</label>
                            <select
                                value={requestedRole}
                                onChange={e => setRequestedRole(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="investor">Ecosystem Investor</option>
                                <option value="team">Partner/Team Member</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Phone Number</label>
                            <input
                                type="tel"
                                required
                                placeholder="+1 (555) 012-3456"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">LinkedIn Profile</label>
                            <input
                                type="url"
                                required
                                placeholder="https://linkedin.com/in/username"
                                value={linkedin}
                                onChange={e => setLinkedin(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-white/60 text-xs font-semibold block mb-2 uppercase tracking-wide">Reason for Access / Background</label>
                        <textarea
                            required
                            rows={4}
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#F54029]/30 transition-colors resize-none"
                            placeholder="Provide a brief background and reasons for requesting platform access..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-[#F54029] hover:bg-[#F54029]/80 text-white font-bold rounded-xl uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(245,64,41,0.2)] disabled:opacity-50 mt-6"
                    >
                        {submitting ? 'Submitting Request...' : 'Submit Credentials Request'} <ArrowRight size={14} />
                    </button>
                </form>
            )}
        </div>
    )
}
