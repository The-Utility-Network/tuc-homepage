'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Flag, Rocket, Globe, Shield } from 'lucide-react'

const milestones = [
    {
        year: "2024",
        quarter: "Q3 - Q4",
        title: "Foundation & Alpha",
        description: "Launch of Osiris Protocol (RWA) and BasaltHQ (AI Ops). Initial institutional onboarding and legal wrapper finalization.",
        status: "completed",
        icon: Rocket,
        color: "#F54029"
    },
    {
        year: "2025",
        quarter: "Q1 - Q2",
        title: "Network Expansion",
        description: "Secondary market launch for TUC-linked assets. Expansion into energy (Requiem) and manufacturing (Vulcan Forge) verticals.",
        status: "current",
        icon: Globe,
        color: "#3B82F6"
    },
    {
        year: "2025",
        quarter: "Q3 - Q4",
        title: "Institutional Integration",
        description: "Direct bank-to-ledger settlement APIs. Launch of the Nexus Governance Layer for automated corporate resolution.",
        status: "upcoming",
        icon: Shield,
        color: "#A855F7"
    },
    {
        year: "2026+",
        quarter: "Expansion",
        title: "The Network State",
        description: "Cross-jurisdictional autonomous economic zones. Mass-scale deployment of robotic infrastructure managed by Nexus.",
        status: "upcoming",
        icon: Flag,
        color: "#22c55e"
    }
]

export default function StrategicRoadmap() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-4xl md:text-6xl font-bold font-rajdhani text-white uppercase mb-6">
                        The Master <span className="text-white/20">Roadmap</span>
                    </h2>
                    <p className="text-white/40 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
                        From infrastructure layer to a sovereign digital economy.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Vertical Line - Shifted left on mobile, centered on desktop */}
                    <div className="absolute left-[23px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#F54029] via-blue-500 to-transparent opacity-20" />

                    <div className="space-y-16 md:space-y-24">
                        {milestones.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`relative flex flex-col md:flex-row items-start gap-8 md:gap-12 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Central Icon/Node - Fixed position relative to line */}
                                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 z-20">
                                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full bg-black border-2 flex items-center justify-center ${item.status === 'completed' ? 'border-[#F54029]' : item.status === 'current' ? 'border-blue-500 animate-pulse' : 'border-white/10'}`}>
                                        <item.icon size={20} className={item.status === 'completed' ? 'text-[#F54029]' : item.status === 'current' ? 'text-blue-500' : 'text-white/20'} />
                                    </div>
                                    {item.status === 'completed' && (
                                        <div className="absolute -top-1 -right-1 bg-[#F54029] rounded-full p-0.5">
                                            <CheckCircle2 size={12} className="text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Content Card */}
                                <div className={`w-full md:w-[45%] pl-16 md:pl-0 ${idx % 2 !== 0 ? 'md:text-right' : 'md:text-left'}`}>
                                    <div className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-3xl hover:border-white/20 transition-all duration-500 group relative">
                                        <div className={`flex items-center gap-3 mb-4 ${idx % 2 !== 0 ? 'md:justify-end' : 'justify-start'}`}>
                                            <span className="text-[10px] md:text-xs font-mono tracking-widest text-[#F54029]">{item.year}</span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                            <span className="text-[10px] md:text-xs font-mono tracking-widest text-white/40 uppercase">{item.quarter}</span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold font-rajdhani text-white uppercase mb-4 group-hover:text-[#F54029] transition-colors">{item.title}</h3>
                                        <p className="text-white/40 text-xs md:text-sm leading-relaxed font-light">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Placeholder for empty side on desktop */}
                                <div className="hidden md:block w-[45%]" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
