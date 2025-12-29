'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Settings, DollarSign, FileText, Check, ChevronRight, ChevronLeft, X } from 'lucide-react'

export default function RoundWizard({ subsidiaryId, subsidiaryName, onClose, onComplete }: any) {
    const supabase = createClient()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState({
        name: '',
        round_type: 'SAFE', // SAFE, Equity, Token
        target_amount: '',
        valuation: '',
        min_investment: '1000',
        max_investment: '',
        share_price: '',
        authorized_shares: '',
        discount: '0',
        interest_rate: '0',
        description: '',
        terms_link: '',
        accredited_only: true
    })

    const handleSubmit = async () => {
        setLoading(true)
        const { error } = await supabase.from('campaigns').insert({
            subsidiary: subsidiaryId,
            name: data.name,
            round_type: data.round_type,
            target_amount: parseFloat(data.target_amount) || 0,
            valuation: parseFloat(data.valuation) || 0,
            min_investment: parseFloat(data.min_investment) || 0,
            // Custom JSONB or extra columns for pro fields if schema allows, otherwise mapping to existing
            share_price: parseFloat(data.share_price) || null,
            authorized_shares: parseInt(data.authorized_shares) || null,
            description: data.description,
            terms_link: data.terms_link,
            status: 'draft'
            // Note: discount/interest would go to jsonb 'terms' column if we had one, or description for now
        })

        setLoading(false)
        if (!error) {
            onComplete()
        } else {
            alert('Error creating round: ' + error.message)
        }
    }

    const StepIndicator = ({ num, label }: any) => (
        <div className={`flex items-center gap-2 ${step === num ? 'text-[#F54029]' : step > num ? 'text-green-500' : 'text-white/20'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border transition-all ${step === num ? 'bg-[#F54029] text-white border-[#F54029]' :
                    step > num ? 'bg-green-500 text-white border-green-500' :
                        'border-current'
                }`}>
                {step > num ? <Check size={16} /> : num}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest hidden md:block">{label}</span>
        </div>
    )

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fadeIn p-4">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h2 className="text-2xl font-bold font-rajdhani text-white uppercase tracking-wider">
                            Initialize New Round
                        </h2>
                        <p className="text-sm text-white/40 mt-1">
                            Creating vehicle for <span className="text-white">{subsidiaryName}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={32} />
                    </button>
                </div>

                {/* Steps Bar */}
                <div className="flex justify-between px-12 py-6 border-b border-white/5 bg-black/40">
                    <StepIndicator num={1} label="Structure" />
                    <div className="flex-1 h-px bg-white/10 mx-4 self-center" />
                    <StepIndicator num={2} label="Economics" />
                    <div className="flex-1 h-px bg-white/10 mx-4 self-center" />
                    <StepIndicator num={3} label="Details" />
                    <div className="flex-1 h-px bg-white/10 mx-4 self-center" />
                    <StepIndicator num={4} label="Review" />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    <div className="max-w-2xl mx-auto space-y-8">

                        {/* STEP 1: STRUCTURE */}
                        {step === 1 && (
                            <div className="animate-fadeIn space-y-8">
                                <div className="space-y-4">
                                    <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Instrument Type</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['SAFE', 'Equity', 'Token'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setData({ ...data, round_type: type })}
                                                className={`py-4 px-6 rounded-xl border text-left transition-all group ${data.round_type === type
                                                        ? 'bg-[#F54029] border-[#F54029] text-white shadow-[0_0_20px_rgba(245,64,41,0.3)]'
                                                        : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                <span className="block font-bold uppercase tracking-wider mb-1">{type}</span>
                                                <span className="text-[10px] opacity-60">
                                                    {type === 'SAFE' ? 'Y-Combinator Standard' : type === 'Equity' ? 'Priced Round' : 'Web3 SAFT/Warrant'}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Round Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Seed Extension, Series A"
                                        className="w-full bg-transparent border-b border-white/20 py-4 text-2xl font-rajdhani font-bold text-white outline-none focus:border-[#F54029] transition-colors placeholder:text-white/10"
                                        value={data.name}
                                        onChange={e => setData({ ...data, name: e.target.value })}
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}

                        {/* STEP 2: ECONOMICS */}
                        {step === 2 && (
                            <div className="animate-fadeIn space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Target Raise ($)</label>
                                        <div className="relative">
                                            <DollarSign size={20} className="absolute left-0 top-4 text-white/20" />
                                            <input
                                                type="number"
                                                className="w-full bg-transparent border-b border-white/20 pl-8 py-3 text-xl font-mono text-white outline-none focus:border-[#F54029]"
                                                value={data.target_amount}
                                                onChange={e => setData({ ...data, target_amount: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-white/40 uppercase tracking-widest font-bold">
                                            {data.round_type === 'SAFE' ? 'Valuation Cap ($)' : 'Pre-Money Valuation ($)'}
                                        </label>
                                        <div className="relative">
                                            <DollarSign size={20} className="absolute left-0 top-4 text-white/20" />
                                            <input
                                                type="number"
                                                className="w-full bg-transparent border-b border-white/20 pl-8 py-3 text-xl font-mono text-white outline-none focus:border-[#F54029]"
                                                value={data.valuation}
                                                onChange={e => setData({ ...data, valuation: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {data.round_type === 'Equity' && (
                                    <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-6">
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-4">Equity Specifics</h4>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs text-white/40 uppercase">Share Price ($)</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#F54029]"
                                                    value={data.share_price}
                                                    onChange={e => setData({ ...data, share_price: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-white/40 uppercase">Auth. Shares</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-[#F54029]"
                                                    value={data.authorized_shares}
                                                    onChange={e => setData({ ...data, authorized_shares: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 3: DETAILS */}
                        {step === 3 && (
                            <div className="animate-fadeIn space-y-8">
                                <div className="space-y-4">
                                    <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Round Description & Lore</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-6 text-white outline-none focus:border-[#F54029] min-h-[150px] leading-relaxed"
                                        placeholder="Describe the opportunity, use cases, and reason for raising..."
                                        value={data.description}
                                        onChange={e => setData({ ...data, description: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Data Room / Terms Link</label>
                                    <div className="flex items-center gap-4">
                                        <FileText className="text-white/40" />
                                        <input
                                            type="text"
                                            placeholder="https://docsend.com/..."
                                            className="flex-1 bg-transparent border-b border-white/20 py-2 text-white outline-none focus:border-[#F54029]"
                                            value={data.terms_link}
                                            onChange={e => setData({ ...data, terms_link: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Min Investment ($)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-transparent border-b border-white/20 py-2 text-white font-mono outline-none focus:border-[#F54029]"
                                            value={data.min_investment}
                                            onChange={e => setData({ ...data, min_investment: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Max Investment ($)</label>
                                        <input
                                            type="number"
                                            placeholder="Unlimited"
                                            className="w-full bg-transparent border-b border-white/20 py-2 text-white font-mono outline-none focus:border-[#F54029]"
                                            value={data.max_investment}
                                            onChange={e => setData({ ...data, max_investment: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 4: REVIEW */}
                        {step === 4 && (
                            <div className="animate-fadeIn space-y-8">
                                <div className="bg-[#F54029]/5 border border-[#F54029]/20 p-8 rounded-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Settings size={100} />
                                    </div>
                                    <h3 className="text-3xl font-bold font-rajdhani text-white mb-2">{data.name}</h3>
                                    <p className="text-[#F54029] font-bold uppercase tracking-wider mb-8">{data.round_type} Offering</p>

                                    <div className="grid grid-cols-2 gap-y-6 gap-x-12 text-sm">
                                        <div>
                                            <p className="text-white/40 uppercase tracking-wider text-xs mb-1">Target</p>
                                            <p className="text-white font-mono text-xl">${parseInt(data.target_amount).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 uppercase tracking-wider text-xs mb-1">Valuation</p>
                                            <p className="text-white font-mono text-xl">${parseInt(data.valuation).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 uppercase tracking-wider text-xs mb-1">Min Ticket</p>
                                            <p className="text-white font-mono">${parseInt(data.min_investment).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/40 uppercase tracking-wider text-xs mb-1">Status</p>
                                            <p className="text-white font-mono flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                                Draft / Hidden
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-white/40 text-sm text-center">
                                    Upon clicking "Launch", the round will be created in <strong>Draft</strong> mode. You can activate it from the dashboard.
                                </p>
                            </div>
                        )}

                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-8 border-t border-white/10 bg-white/[0.02] flex justify-between">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                        className="px-8 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors font-bold uppercase tracking-wider text-xs"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    <button
                        onClick={() => step < 4 ? setStep(step + 1) : handleSubmit()}
                        disabled={loading}
                        className="px-10 py-3 rounded-xl bg-[#F54029] hover:bg-[#C53020] text-white font-bold uppercase tracking-wider text-xs shadow-lg flex items-center gap-2"
                    >
                        {loading ? 'Processing...' : step === 4 ? 'Launch Round' : <>Next <ChevronRight size={14} /></>}
                    </button>
                </div>
            </div>
        </div>
    )
}
