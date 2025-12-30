'use client'

import { motion } from 'framer-motion'
import { Globe2, MapPin, Zap } from 'lucide-react'

const hubs = [
    { name: "New Mexico", type: "Nexus HQ / Legal Core", x: "20%", y: "45%" },
    { name: "London", type: "European Settlement Hub", x: "48%", y: "35%" },
    { name: "Singapore", type: "APAC Distribution", x: "78%", y: "55%" },
    { name: "Dubai", type: "VARA Compliance Node", x: "58%", y: "48%" }
]

export default function GlobalImpact() {
    return (
        <section className="py-32 bg-[#020202] relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#F54029]/5 blur-[120px] rounded-full" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-24">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-[#F54029] font-mono text-[10px] uppercase tracking-widest mb-4 block"
                    >
                        // Global Infrastructure
                    </motion.span>
                    <h2 className="text-4xl md:text-5xl font-bold font-rajdhani text-white uppercase mb-6">
                        Distributed <span className="text-white/20">Governance.</span>
                    </h2>
                    <p className="text-white/40 max-w-2xl mx-auto text-lg font-light">
                        Nexus operates as a decentralized network with physical hubs and legal nodes across major financial jurisdictions.
                    </p>
                </div>

                <div className="relative aspect-[16/10] md:aspect-[21/9] w-full max-w-5xl mx-auto border border-white/5 rounded-3xl md:rounded-[40px] bg-black/40 overflow-hidden backdrop-blur-xl">
                    {/* SVG Map Container - Scrollable on very small screens */}
                    <div className="absolute inset-0 min-w-[600px] md:min-w-0">
                        {/* Simplified Map Paths (SVG) */}
                        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 1000 428">
                            <path fill="none" d="M150,150 Q200,100 250,150 T350,150 M450,100 Q500,50 550,100 T650,100 M750,200 Q800,150 850,200 T950,200" stroke="white" />
                            {/* Abstract map shapes */}
                            <circle cx="200" cy="180" r="100" fill="white" opacity="0.1" />
                            <circle cx="500" cy="150" r="120" fill="white" opacity="0.1" />
                            <circle cx="800" cy="220" r="80" fill="white" opacity="0.1" />
                        </svg>

                        {/* Animated Connection Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <motion.path
                                d="M 200 193 L 480 150 L 580 205 L 780 235"
                                fill="none"
                                stroke="#F54029"
                                strokeWidth="1"
                                strokeDasharray="5 5"
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{ duration: 3, ease: "linear" }}
                            />
                        </svg>

                        {/* Nodes */}
                        {hubs.map((hub, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.2 }}
                                style={{ left: hub.x, top: hub.y }}
                                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#F54029] rounded-full blur-md opacity-20 md:opacity-0 group-hover:opacity-50 transition-opacity" />
                                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-black border border-[#F54029] md:border-2 flex items-center justify-center relative z-10 group-hover:scale-125 transition-transform">
                                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-[#F54029]" />
                                    </div>
                                    <div className="absolute top-5 md:top-6 left-1/2 -translate-x-1/2 whitespace-nowrap pt-1.5 md:pt-2 px-2 md:px-3 pb-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg opacity-100 md:opacity-0 group-hover:opacity-100 transform md:translate-y-2 group-hover:translate-y-0 transition-all">
                                        <p className="text-[8px] md:text-[10px] font-bold text-white uppercase font-rajdhani">{hub.name}</p>
                                        <p className="text-[7px] md:text-[8px] text-[#F54029] uppercase font-mono tracking-tighter">{hub.type}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="absolute bottom-4 md:bottom-8 left-4 md:left-unset md:right-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 bg-black/60 md:bg-transparent p-3 md:p-0 rounded-xl backdrop-blur-md md:backdrop-blur-none">
                        <div className="flex items-center gap-2">
                            <Zap size={12} className="text-[#F54029]" />
                            <span className="text-[8px] md:text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Live Sync: 12ms</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe2 size={12} className="text-blue-500" />
                            <span className="text-[8px] md:text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Global Uptime: 99.9%</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
