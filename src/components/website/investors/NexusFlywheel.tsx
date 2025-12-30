'use client'

import { motion } from 'framer-motion'
import { RefreshCcw, ArrowRight, Zap, Target, TrendingUp, ShieldCheck } from 'lucide-react'

export default function NexusFlywheel() {
    const nodes = [
        { icon: Zap, title: "Efficiency", desc: "Nexus Automation", angle: 0 },
        { icon: Target, title: "Compliance", desc: "Regulatory Wrappers", angle: 90 },
        { icon: TrendingUp, title: "Growth", desc: "Capital Reinvestment", angle: 180 },
        { icon: ShieldCheck, title: "Security", desc: "On-Chain Provenance", angle: 270 }
    ];

    return (
        <section className="py-20 md:py-32 bg-[#020202] relative overflow-hidden border-y border-white/5">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-[#F54029]/5 rounded-full blur-[80px] md:blur-[120px] opacity-50" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="px-4 py-1.5 rounded-full border border-[#F54029]/30 bg-[#F54029]/10 text-[#F54029] font-mono text-[10px] uppercase tracking-widest mb-6 inline-block"
                    >
                        Economic Architecture
                    </motion.span>
                    <h2 className="text-4xl md:text-6xl font-bold font-rajdhani text-white uppercase mb-6">
                        The Nexus <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Flywheel</span>
                    </h2>
                    <p className="text-white/40 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                        Our model creates a compounding loop of capital efficiency, regulatory clarity, and technological advancement.
                    </p>
                </div>

                {/* Mobile: Simple Grid | Desktop: Circular Flywheel */}
                <div className="relative max-w-5xl mx-auto min-h-[400px] md:h-[600px] flex items-center justify-center">

                    {/* Desktop-only elements */}
                    <div className="hidden md:block absolute inset-0">
                        {/* Central Hub Rings */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full"
                        >
                            <div className="w-full h-full rounded-full border border-dashed border-white/10 animate-pulse" />
                        </motion.div>

                        {/* Connection Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                            <circle cx="50%" cy="50%" r="220" fill="none" stroke="white" strokeWidth="1" strokeDasharray="5 5" />
                        </svg>

                        {/* Circular Nodes */}
                        {nodes.map((node, idx) => {
                            const radius = 220;
                            const x = Math.cos((node.angle * Math.PI) / 180) * radius;
                            const y = Math.sin((node.angle * Math.PI) / 180) * radius;

                            return (
                                <motion.div
                                    key={`desktop-${idx}`}
                                    initial={{ opacity: 0, x: 0, y: 0 }}
                                    whileInView={{ opacity: 1, x, y }}
                                    transition={{ delay: idx * 0.2, duration: 0.8, type: "spring" }}
                                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-48 text-center group hover:border-[#F54029]/50 transition-colors cursor-default"
                                >
                                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                                        <node.icon className="text-[#F54029]" size={24} />
                                    </div>
                                    <h3 className="text-white font-bold font-rajdhani uppercase tracking-wider mb-1">{node.title}</h3>
                                    <p className="text-[10px] text-white/30 uppercase font-mono">{node.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Mobile-only Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full md:hidden">
                        {nodes.map((node, idx) => (
                            <motion.div
                                key={`mobile-${idx}`}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl flex items-center gap-4"
                            >
                                <div className="w-12 h-12 bg-[#F54029]/10 rounded-xl flex items-center justify-center shrink-0">
                                    <node.icon className="text-[#F54029]" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold font-rajdhani uppercase tracking-wider text-sm">{node.title}</h3>
                                    <p className="text-[10px] text-white/30 uppercase font-mono">{node.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Center Point - Hidden on small mobile, visible on tablet+ and desktop */}
                    <div className="hidden sm:flex relative z-20 w-24 h-24 md:w-32 md:h-32 bg-[#F54029] rounded-full items-center justify-center shadow-[0_0_50px_rgba(245,64,41,0.3)] shrink-0">
                        <RefreshCcw className="text-white animate-spin-slow" size={32} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-16 md:mt-24 max-w-4xl mx-auto">
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
                        <h4 className="text-[#F54029] font-mono text-xs uppercase tracking-widest mb-4">01. Velocity</h4>
                        <p className="text-white/60 leading-relaxed font-light text-sm md:text-base">
                            By automating the legal and financial stack, we reduce the time-to-market for new subsidiaries from years to months. Capital moves with the speed of data.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
                        <h4 className="text-[#F54029] font-mono text-xs uppercase tracking-widest mb-4">02. Compounding</h4>
                        <p className="text-white/60 leading-relaxed font-light text-sm md:text-base">
                            Each successful subsidiary feeds data and revenue back into the Nexus protocol, improving the automation engine for the next project in the pipeline.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
