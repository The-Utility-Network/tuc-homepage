'use client'

import { useEffect, useState } from 'react'
import { Target, Calendar, ArrowRight } from 'lucide-react'
import FundingModal from '../../../../components/nexus/fundraising/FundingModal'

interface Campaign {
    id: string
    name: string
    status: string
    target_amount: number
    raised_amount: number
    created_at: string
}

export default function OpenRoundsPage() {
    const [rounds, setRounds] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedRound, setSelectedRound] = useState<Campaign | null>(null)

    useEffect(() => {
        async function load() {
            try {
                // Fetch active campaigns
                const response = await fetch('/api/fundraising/campaigns?status=active')
                if (response.ok) {
                    const { campaigns } = await response.json()
                    setRounds(campaigns || [])
                } else {
                    console.error('Failed to fetch rounds')
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F54029]"></div>
            </div>
        )
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-4xl font-bold text-white font-rajdhani mb-2 tracking-wide uppercase">Open Investment Rounds</h1>
                <p className="text-white/60">Explore and commit to active capital formation campaigns.</p>
            </div>

            {rounds.length === 0 ? (
                <div className="bg-black/40 border border-white/10 rounded-2xl p-16 text-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Target className="text-white/40" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-rajdhani">No Open Rounds</h3>
                    <p className="text-white/40 max-w-md mx-auto">
                        There are currently no active funding rounds available for participation. 
                        You will be notified when a new campaign is launched.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {rounds.map((round, idx) => {
                        const progress = Math.min((round.raised_amount / round.target_amount) * 100, 100)
                        
                        return (
                            <div 
                                key={round.id}
                                className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-[#F54029]/30 transition-all group animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                {/* Header */}
                                <div className="p-8 border-b border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#F54029]/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-[#F54029]/20 transition-colors" />
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest rounded">
                                                Active Round
                                            </span>
                                            <span className="text-white/40 text-xs flex items-center gap-1">
                                                <Calendar size={14} /> 
                                                {new Date(round.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        <h3 className="text-3xl font-bold text-white font-rajdhani mb-2 leading-tight">
                                            {round.name}
                                        </h3>
                                        <p className="text-white/60 text-sm">
                                            Seeking capital via standard SAFE or Equity instruments.
                                        </p>
                                    </div>
                                </div>

                                {/* Financials & Action */}
                                <div className="p-8 bg-black/20">
                                    <div className="flex justify-between items-end mb-3">
                                        <div>
                                            <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">Target Amount</p>
                                            <p className="text-2xl font-bold text-white font-rajdhani">
                                                ${(round.target_amount / 1000000).toFixed(1)}M
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">Raised</p>
                                            <p className="text-[#F54029] font-bold text-lg font-rajdhani">
                                                ${(round.raised_amount / 1000).toFixed(0)}K
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="h-2 bg-black rounded-full overflow-hidden mb-8 border border-white/5">
                                        <div 
                                            className="h-full bg-gradient-to-r from-[#F54029] to-cyan-400 shadow-[0_0_10px_rgba(17,157,255,0.5)] transition-all duration-1000"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    <button
                                        onClick={() => setSelectedRound(round)}
                                        className="w-full bg-[#F54029]/10 hover:bg-[#F54029]/20 border border-[#F54029]/30 text-[#F54029] hover:text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
                                    >
                                        Initiate Commitment 
                                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {selectedRound && (
                <FundingModal 
                    round={selectedRound} 
                    onClose={() => setSelectedRound(null)} 
                    onSuccess={() => {
                        setSelectedRound(null)
                        // Optionally refresh data here
                    }}
                />
            )}
        </div>
    )
}
