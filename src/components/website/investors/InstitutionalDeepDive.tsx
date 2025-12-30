'use client'

import { motion } from 'framer-motion'
import { Landmark, ShieldCheck, Cpu, Scale, FileCode, Database } from 'lucide-react'

const features = [
    {
        icon: Scale,
        title: "Regulatory Wrapped",
        desc: "Each subsidiary is structured with a compliant SPV framework, ensuring SEC and international regulatory alignment from day zero.",
        tech: "ERC-3643 / T-REX"
    },
    {
        icon: FileCode,
        title: "Smart Legal Contracts",
        desc: "Legal prose and protocol code are hashed and linked. Signatures are recorded on-chain with full ESIGN/UETA compliance.",
        tech: "OpenZeppelin / Ricardian contracts"
    },
    {
        icon: Database,
        title: "RWA Provenance",
        desc: "Real-time state tracking of physical assets via Oracle feeds. Direct linking of robotic yields to tokenized distribution.",
        tech: "Chainlink / Osiris Protocol"
    }
]

export default function InstitutionalDeepDive() {
    return (
        <section className="py-32 bg-zinc-900/40 relative overflow-hidden backdrop-blur-3xl border-y border-white/5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="w-full lg:w-1/2">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-[#F54029] font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase mb-6 block"
                        >
                            // The Institutional Stack
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-5xl font-bold font-rajdhani text-white uppercase mb-6 md:mb-8 leading-tight"
                        >
                            Bank-Grade <span className="text-white/20">Provenance.</span><br className="hidden md:block" />
                            Autonomous <span className="text-white/20">Execution.</span>
                        </motion.h2>
                        <p className="text-white/40 text-base md:text-lg font-light mb-10 md:mb-12 leading-relaxed">
                            Nexus bridges the gap between traditional capital markets and the efficiency of decentralized finance. We provide the safety of the old world with the speed of the new.
                        </p>

                        <div className="space-y-6 md:space-y-8">
                            {features.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex gap-4 md:gap-6 group"
                                >
                                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#F54029]/10 transition-colors">
                                        <item.icon className="text-white/40 group-hover:text-[#F54029] transition-colors" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold text-white uppercase font-rajdhani mb-1 md:mb-2 tracking-wide">{item.title}</h3>
                                        <p className="text-xs md:text-sm text-white/30 font-light mb-2">{item.desc}</p>
                                        <span className="text-[9px] md:text-[10px] font-mono text-[#F54029] uppercase tracking-widest bg-[#F54029]/5 px-2 py-1 rounded inline-block">Tech: {item.tech}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 relative mt-12 lg:mt-0">
                        {/* Abstract Tech Visual */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square w-full max-w-lg mx-auto"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#F54029]/20 to-blue-500/10 rounded-3xl blur-[60px] md:blur-[100px] animate-pulse" />
                            <div className="relative h-full w-full bg-black/40 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-12 overflow-hidden flex flex-col justify-center items-center">
                                {/* Grid Pattern */}
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

                                <div className="relative z-10 w-full flex flex-col justify-center items-center text-center">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border border-white/10 flex items-center justify-center mb-6 md:mb-8 relative">
                                        <div className="absolute inset-0 rounded-full border border-[#F54029]/30 animate-ping" />
                                        <Landmark className="text-[#F54029]" size={48} />
                                    </div>
                                    <h4 className="text-xl md:text-2xl font-bold font-rajdhani text-white uppercase mb-4 tracking-widest">Nexus Protocol v1.0</h4>
                                    <div className="w-full space-y-2 md:space-y-3 max-w-xs">
                                        {[
                                            "SEC REGULATION D COMPLIANT",
                                            "ON-CHAIN ASSET PROVENANCE",
                                            "KYC/AML IDENTITY ORRESTRA",
                                            "AUTOMATED DISTRIBUTION ENGINES"
                                        ].map((stat, i) => (
                                            <div key={i} className="flex items-center justify-between py-1.5 md:py-2 border-b border-white/5 last:border-0">
                                                <span className="text-[8px] md:text-[10px] font-mono text-white/40">{stat}</span>
                                                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500/50 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
