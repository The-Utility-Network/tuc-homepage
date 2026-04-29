'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shield, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/nexus/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to reset password');
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/nexus/login');
                }, 3000);
            }
        } catch (err) {
            setError('Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center">
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
                    Invalid or missing password reset token.
                </div>
                <Link href="/nexus/forgot-password" className="text-[#F54029] hover:text-white transition-colors flex items-center justify-center gap-2">
                    <ArrowLeft size={16} /> Request a new link
                </Link>
            </div>
        );
    }

    if (success) {
        return (
            <div className="text-center">
                <div className="bg-green-500/20 border border-green-500/30 text-green-400 p-4 rounded-lg mb-6">
                    Password successfully reset! Redirecting to login...
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm p-4 rounded-lg">
                    {error}
                </div>
            )}
            
            <div>
                <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={8}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Confirm New Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                    minLength={8}
                />
            </div>

            <button
                type="submit"
                disabled={loading || !password || (password !== confirmPassword)}
                className="w-full py-3 bg-[#F54029] hover:bg-[#F54029]/90 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                {loading ? 'Resetting...' : 'Reset Password'}
                {!loading && <ArrowRight size={20} />}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F54029] to-transparent opacity-50" />
                
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-[#F54029]"><Shield size={32} /></span>
                    </div>
                    <h1 className="text-2xl font-bold text-white font-rajdhani">Create New Password</h1>
                    <p className="text-white/60 mt-2">Please enter and confirm your new strong password.</p>
                </div>

                <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
