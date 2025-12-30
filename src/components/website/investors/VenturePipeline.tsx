'use client'

import { motion } from 'framer-motion'
import { Calendar, Timer, Lock, ChevronRight } from 'lucide-react'

/*
### Mobile Responsiveness & Grid Systems
- **Nexus Flywheel**: Transitioned from a circular radial layout on desktop to a touch-optimized relative grid on mobile.
- **Institutional Deep Dive**: Refactored the two-column technical deep dive to a vertical stack with responsive SVG visuals.
- **Portal Preview**: Scaled down the dashboard mockup, implementing a horizontal scrolling sidebar for mobile navigation.
- **Sector Alpha**: Optimized the 11-subsidiary industrial grid, adjusting medallion scaling and typography for small screens.
- **Strategic Roadmap**: Re-aligned the vertical timeline to a left-anchored system with compact cards for phone viewports.
- **Global Impact**: Adjusted the map visualization aspect ratio and implemented horizontal scroll for the infrastructure network map.
- **Venture Pipeline**: Refined the upcoming venture cards and stats footer for vertical stacking.

### Visual Verification
![God-Tier Mobile Audit Recording](file:///C:/Users/skyne/.gemini/antigravity/brain/fd10d628-8d38-4c24-ad00-a4db381bf002/investors_god_tier_mobile_audit_1767098282560.webp)
*Recording showing slow scroll verification across desktop and mobile viewports.*

### Automated Tests
- Verified layout integrity using browser subagents across multiple viewports.
- Fixed TypeScript/Linting errors related to Lucide icon props in `VenturePipeline.tsx`.
*/

const pipeline = [
    {
        name: "Project Helios",
        sector: "Fusion Energy",
        stage: "R&D / Legal Wrapping",
        eta: "Q4 2025",
        desc: "Decentralized ownership of modular fusion reactor yields."
    },
    {
        name: "Aether Mesh",
        sector: "DePIN / Connectivity",
        stage: "Seed Pipeline",
        eta: "Q1 2026",
        desc: "Autonomous satellite mesh network for secure data settlement."
    },
    {
        name: "Gaea Protocol",
        sector: "Carbon Credits",
        stage: "Verification Setup",
        eta: "Q2 2026",
        desc: "On-chain verification of direct-air-capture carbon removal."
    }
]

export default function VenturePipeline() {
    return (
        <section className="py-32 bg-black relative">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-12 md:mb-16 gap-6 md:gap-8">
                    <div className="max-w-2xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-[#F54029] font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 block"
                        >
                            // Active Pipeline
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-bold font-rajdhani text-white uppercase leading-tight">
                            Upcoming <span className="text-white/20">Alpha.</span>
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-white/30 font-mono text-[10px] md:text-xs uppercase tracking-widest pb-0 lg:pb-2">
                        <Timer size={14} className="text-[#F54029]" />
                        Total Pipeline Value: $2.4B+
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {pipeline.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group bg-white/[0.01] border border-white/5 p-6 md:p-8 rounded-3xl hover:border-white/20 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity">
                                <Lock className="w-8 h-8 md:w-10 md:h-10 text-white/20" />
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-2 h-2 rounded-full bg-[#F54029] animate-pulse" />
                                <span className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest">Stage: {item.stage}</span>
                            </div>

                            <h3 className="text-xl md:text-2xl font-bold font-rajdhani text-white uppercase mb-4 group-hover:text-[#F54029] transition-colors">{item.name}</h3>
                            <p className="text-xs md:text-sm text-white/30 font-light leading-relaxed mb-8">
                                {item.desc}
                            </p>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] md:text-[10px] text-white/20 uppercase tracking-widest mb-1">Target Launch</p>
                                    <div className="flex items-center gap-2 text-white text-sm md:text-base font-rajdhani">
                                        <Calendar size={12} className="text-[#F54029]" />
                                        {item.eta}
                                    </div>
                                </div>
                                <ChevronRight className="text-white/20 group-hover:text-white transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 md:mt-16 p-6 md:p-8 rounded-2xl bg-[#F54029]/5 border border-[#F54029]/10 text-center">
                    <p className="text-xs md:text-sm text-white/60 font-light italic leading-relaxed">
                        "The Nexus Pipeline is curated through a multi-stage vetting process ensuring long-term yield and regulatory compliance."
                    </p>
                </div>
            </div>
        </section>
    )
}
