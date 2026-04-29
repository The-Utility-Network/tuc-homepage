'use client'

import { useState } from 'react'
import { Landmark, ArrowRight, ArrowDownToLine, CheckCircle, RefreshCcw, DollarSign, Wallet } from 'lucide-react'

export default function AdminTreasuryPage() {
    const [offrampStep, setOfframpStep] = useState(0)
    const [offrampAmount, setOfframpAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleOfframp = () => {
        setLoading(true)
        // Mock Coinbase Offramp network call
        setTimeout(() => {
            setLoading(false)
            setSuccess(true)
            setOfframpStep(2)
        }, 3000)
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-4xl font-bold text-white font-rajdhani mb-2 tracking-wide uppercase flex items-center gap-4">
                    <Landmark className="text-[#F54029]" size={36} /> Treasury Operations
                </h1>
                <p className="text-white/60">Manage corporate fiat and digital assets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-gradient-to-br from-[#F54029]/20 to-black/40 border border-[#F54029]/30 p-8 rounded-2xl shadow-[0_0_30px_rgba(17,157,255,0.1)]">
                    <p className="text-[#F54029] text-xs font-bold uppercase tracking-widest mb-2">Total Treasury Value</p>
                    <h2 className="text-4xl font-bold text-white font-rajdhani">$4,250,500</h2>
                    <p className="text-white/40 text-xs mt-2">Fiat + Crypto Combined</p>
                </div>
                
                <div className="bg-black/40 border border-white/10 p-8 rounded-2xl group hover:border-[#F54029]/30 transition-colors">
                    <p className="text-white/40 group-hover:text-white/80 transition-colors text-xs font-bold uppercase tracking-widest mb-2">Fiat Reserves (Mercury)</p>
                    <h2 className="text-3xl font-bold text-white font-rajdhani">$1,850,500</h2>
                    <p className="text-white/40 text-xs mt-2">Checking & Treasury</p>
                </div>

                <div className="bg-black/40 border border-purple-500/30 p-8 rounded-2xl group shadow-[0_0_20px_rgba(168,85,247,0.05)]">
                    <p className="text-purple-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Wallet size={14} /> Crypto Assets (Coinbase)
                    </p>
                    <h2 className="text-3xl font-bold text-white font-rajdhani">$2,400,000</h2>
                    <p className="text-white/40 text-xs mt-2">USDC, ETH, BTC</p>
                </div>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F54029] to-transparent opacity-50" />
                
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white font-rajdhani tracking-wider">Coinbase Fiat Offramp</h3>
                        <p className="text-white/40 text-sm mt-1">Convert digital assets to USD via Mercury.</p>
                    </div>
                    <div className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        API Connected
                    </div>
                </div>

                <div className="p-8">
                    {offrampStep === 0 && (
                        <div className="max-w-xl">
                            <label className="block text-xs font-bold text-[#F54029] uppercase tracking-widest mb-3 flex items-center gap-2">
                                <DollarSign size={14} /> Amount to Offramp (USDC)
                            </label>
                            <div className="flex gap-4">
                                <input 
                                    type="number"
                                    value={offrampAmount}
                                    onChange={(e) => setOfframpAmount(e.target.value)}
                                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-6 py-4 text-2xl font-rajdhani text-white focus:outline-none focus:border-[#F54029] transition-all"
                                    placeholder="500,000"
                                />
                                <button 
                                    onClick={() => setOfframpStep(1)}
                                    disabled={!offrampAmount || parseFloat(offrampAmount) <= 0}
                                    className="px-8 bg-gradient-to-r from-[#F54029] to-[#C53020] hover:from-[#3db3ff] hover:to-[#F54029] text-white font-bold uppercase tracking-widest rounded-xl disabled:opacity-30 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(17,157,255,0.4)]"
                                >
                                    Proceed <ArrowRight size={18} />
                                </button>
                            </div>
                            <p className="text-white/40 text-xs mt-3 flex justify-between">
                                <span>Max Available: $2,400,000 USDC</span>
                                <span>Fee: 0.00% (Coinbase Prime)</span>
                            </p>
                        </div>
                    )}

                    {offrampStep === 1 && (
                        <div className="max-w-xl animate-in fade-in slide-in-from-right-4">
                            <div className="bg-black/30 border border-white/5 rounded-xl p-6 mb-6">
                                <h4 className="text-white text-lg font-bold mb-4 font-rajdhani">Confirm Offramp Transaction</h4>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                        <span className="text-white/40 text-xs uppercase tracking-widest">Asset</span>
                                        <span className="text-white font-bold">USD Coin (USDC)</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                        <span className="text-white/40 text-xs uppercase tracking-widest">Amount</span>
                                        <span className="text-[#F54029] font-bold">${parseFloat(offrampAmount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                        <span className="text-white/40 text-xs uppercase tracking-widest">Destination</span>
                                        <span className="text-white font-bold">Mercury Bank (*5518)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/40 text-xs uppercase tracking-widest">Estimated Arrival</span>
                                        <span className="text-white font-bold text-sm">Same Day (Wire)</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setOfframpStep(0)}
                                        className="flex-1 bg-black/50 hover:bg-white/5 border border-white/10 text-white/60 font-bold uppercase tracking-widest py-3.5 rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleOfframp}
                                        disabled={loading}
                                        className="flex-[2] bg-white text-black font-bold uppercase tracking-widest py-3.5 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        {loading ? <RefreshCcw className="animate-spin text-black" size={18} /> : (
                                            <><ArrowDownToLine size={18} /> Execute Offramp</>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {offrampStep === 2 && (
                        <div className="text-center py-8 animate-in zoom-in-95 duration-500">
                            <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="text-green-400" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2 font-rajdhani">Transaction Initiated</h3>
                            <p className="text-white/60 text-sm mb-8 leading-relaxed max-w-md mx-auto">
                                ${parseFloat(offrampAmount).toLocaleString()} USDC has been successfully converted. The wire transfer to Mercury is currently pending and should arrive within 24 hours.
                            </p>
                            
                            <button 
                                onClick={() => {
                                    setOfframpStep(0)
                                    setOfframpAmount('')
                                }}
                                className="inline-flex items-center justify-center px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-xs font-bold uppercase tracking-widest transition-all"
                            >
                                Process Another Transaction
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
