'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Globe, BarChart3, ArrowUpRight } from 'lucide-react'

const stats = [
    {
        value: "$16.1T",
        label: "Tokenized RWA Market by 2030",
        source: "BCG Analysis",
        change: "+50x Growth"
    },
    {
        value: "$12T",
        label: "Global Infrastructure Gap",
        source: "G20 Hub",
        change: "High Demand"
    },
    {
        value: "45%",
        label: "Avg. Efficiency Gain",
        source: "Nexus Automation",
        change: "OpEx Reduction"
    }
]

export default function MarketOpportunity() {
    return (
        <section className="py-24 bg-black relative border-b border-white/5">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 mb-20">
                    <div className="lg:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                            <Globe size={14} /> Macro Thesis
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold font-rajdhani text-white uppercase leading-tight mb-6">
                            The Great <span className="text-[#F54029]">Re-Platforming</span>
                        </h2>
                        <p className="text-xl text-white/60 leading-relaxed font-light">
                            We are witnessing the largest capital migration in history.
                            Legacy industrial assets are moving on-chain, unlocking liquidity
                            and ensuring provenance at a global scale.
                        </p>
                    </div>
                    <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.2 }}
                                className={`p-8 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm ${i === 0 ? 'sm:col-span-2 bg-gradient-to-br from-[#F54029]/10 to-transparent border-[#F54029]/20' : ''}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-5xl md:text-6xl font-bold font-rajdhani text-white tracking-tighter">
                                        {stat.value}
                                    </h3>
                                    <ArrowUpRight className={i === 0 ? "text-[#F54029]" : "text-white/20"} size={24} />
                                </div>
                                <p className="text-sm font-bold uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${i === 0 ? 'bg-[#F54029]/20 text-[#F54029]' : 'bg-green-500/10 text-green-400'}`}>
                                        {stat.change}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
