'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, Globe, Shield, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function InvestorHero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020202] selection:bg-[#F54029] selection:text-white">
            {/* God-Tier Neural Nexus Animation Background */}
            <div className="absolute inset-0 z-0">
                <svg className="w-full h-full object-cover opacity-60" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <radialGradient id="ring-grad" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#F54029" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#F54029" stopOpacity="0" />
                        </radialGradient>
                        <mask id="grid-mask">
                            <rect width="100%" height="100%" fill="url(#grid-radial)" />
                        </mask>
                        <radialGradient id="grid-radial" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="white" stopOpacity="1" />
                            <stop offset="100%" stopColor="white" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* Deep Grid Layer */}
                    <g mask="url(#grid-mask)">
                        <pattern id="inner-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" strokeOpacity="0.05" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#inner-grid)" />
                    </g>

                    {/* Abstract Neural Connections */}
                    {[...Array(12)].map((_, i) => (
                        <motion.circle
                            key={`node-${i}`}
                            cx={200 + Math.random() * 800}
                            cy={100 + Math.random() * 600}
                            r={1.5}
                            fill="#F54029"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.4, 0] }}
                            transition={{
                                duration: 3 + Math.random() * 4,
                                repeat: Infinity,
                                delay: Math.random() * 5
                            }}
                        />
                    ))}

                    {/* Kinetic Data Beams */}
                    {[
                        "M 200 100 Q 400 400 800 200",
                        "M 1000 600 Q 600 500 200 700",
                        "M -100 400 L 1300 400",
                        "M 400 -100 L 800 900",
                        "M 100 800 Q 500 300 1100 100"
                    ].map((d, i) => (
                        <g key={`beam-${i}`}>
                            <path d={d} stroke="white" strokeWidth="0.5" strokeOpacity="0.03" fill="none" />
                            <motion.path
                                d={d}
                                stroke="#F54029"
                                strokeWidth="1.5"
                                fill="none"
                                initial={{ pathLength: 0, opacity: 0, pathOffset: 0 }}
                                animate={{
                                    pathLength: [0, 0.2, 0],
                                    pathOffset: [0, 1.2],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 3 + Math.random() * 3,
                                    repeat: Infinity,
                                    delay: Math.random() * 4,
                                    ease: "easeInOut"
                                }}
                            />
                        </g>
                    ))}

                    {/* Glowing Core Pulse */}
                    <motion.circle
                        cx="50%"
                        cy="50%"
                        r="200"
                        fill="url(#ring-grad)"
                        initial={{ scale: 0.8, opacity: 0.1 }}
                        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                </svg>
            </div>

            {/* Content Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10 pointer-events-none" />

            <div className="container mx-auto px-6 z-20 relative pt-12 md:pt-0">
                <div className="max-w-6xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl mb-12"
                    >
                        <div className="relative flex items-center justify-center">
                            <span className="absolute w-full h-full rounded-full bg-[#F54029]/40 animate-ping" />
                            <span className="relative w-2 h-2 rounded-full bg-[#F54029]" />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.4em] mb-[-1px]">
                            Live Asset Settlement Node
                        </span>
                    </motion.div>

                    {/* Headline - Responsive Scaling */}
                    <div className="relative mb-12">
                        <motion.h1
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-[12vw] md:text-[8rem] lg:text-[10rem] font-bold font-rajdhani text-white uppercase leading-[0.8] tracking-tighter"
                        >
                            The Nexus <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white/40 to-[#F54029]/50">
                                Investment.
                            </span>
                        </motion.h1>
                    </div>

                    {/* Description - Responsive Padding */}
                    <div className="grid md:grid-cols-2 gap-12 items-end">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-8"
                        >
                            <p className="text-lg md:text-2xl text-white/50 leading-tight max-w-lg font-light">
                                Directly access the compounding cashflow of institutional industrial assets. Transparent. Verifiable. High-Alpha.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <Link href="/nexus/onboarding" className="w-full sm:w-auto px-10 py-5 bg-[#F54029] hover:bg-white hover:text-black text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-full transition-all flex items-center justify-center gap-3 group">
                                    Join The Network
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/our-model" className="w-full sm:w-auto px-10 py-5 border border-white/10 hover:border-white/40 text-white font-bold uppercase tracking-[0.2em] text-[10px] rounded-full transition-all flex items-center justify-center gap-3">
                                    Vision Deck
                                    <ChevronRight size={18} />
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="hidden md:flex flex-col items-end gap-2 border-r border-[#F54029]/20 pr-8"
                        >
                            <span className="text-white/20 font-mono text-[10px] uppercase tracking-widest">Aggregate TAM Potential</span>
                            <span className="text-6xl font-bold font-rajdhani text-white">$24.8T</span>
                            <span className="text-[#F54029] font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
                                <TrendingUp size={12} />
                                +28% Target CAGR
                            </span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Section Blending */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#020202] to-transparent pointer-events-none" />
        </section>
    )
}
