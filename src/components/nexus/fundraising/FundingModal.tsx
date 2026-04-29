'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

interface FundingModalProps {
    round: any
    onClose: () => void
    onSuccess: () => void
}

export default function FundingModal({ round, onClose, onSuccess }: FundingModalProps) {
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCommit = async () => {
        if (!amount || isNaN(Number(amount))) return
        
        setLoading(true)
        try {
            // Mock commitment logic for now, would hit /api/fundraising/commitments
            await new Promise(resolve => setTimeout(resolve, 1000))
            onSuccess()
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                </button>
                
                <div className="mb-6">
                    <h2 className="text-2xl font-bold font-rajdhani text-white mb-2 tracking-wide">Commit to {round?.name}</h2>
                    <p className="text-white/60 text-sm">Enter your commitment amount below to participate in this funding round.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-white/40 font-bold mb-2">Commitment Amount (USD)</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00" 
                                className="w-full bg-black/50 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-[#F54029]/50 transition-colors"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleCommit}
                        disabled={loading || !amount}
                        className="w-full bg-[#F54029] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl hover:bg-[#F54029]/80 transition-all shadow-[0_0_20px_rgba(245,64,41,0.2)] hover:shadow-[0_0_30px_rgba(245,64,41,0.4)]"
                    >
                        {loading ? 'Processing...' : 'Confirm Commitment'}
                    </button>
                </div>
            </div>
        </div>
    )
}
