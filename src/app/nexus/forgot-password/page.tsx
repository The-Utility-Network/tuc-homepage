'use client';

import { useState } from 'react';
import { Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/nexus/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Something went wrong');
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError('Failed to request password reset');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F54029] to-transparent opacity-50" />
                
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-[#F54029]"><Shield size={32} /></span>
                    </div>
                    <h1 className="text-2xl font-bold text-white font-rajdhani">Reset Password</h1>
                    <p className="text-white/60 mt-2">Enter your email and we'll send you a reset link.</p>
                </div>

                {success ? (
                    <div className="text-center">
                        <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-lg mb-6">
                            Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                        </div>
                        <Link href="/nexus/login" className="text-[#F54029] hover:text-white transition-colors flex items-center justify-center gap-2">
                            <ArrowLeft size={16} /> Return to login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm p-4 rounded-lg">
                                {error}
                            </div>
                        )}
                        
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none transition-colors"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email}
                            className="w-full py-3 bg-[#F54029] hover:bg-[#F54029]/90 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                        
                        <div className="text-center mt-6">
                            <Link href="/nexus/login" className="text-sm text-white/60 hover:text-white transition-colors">
                                Remember your password? Log in
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
