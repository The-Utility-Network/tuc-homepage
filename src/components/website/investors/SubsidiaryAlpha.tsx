'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ExternalLink, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const subsidiaries = [
    {
        name: "The Grande Narrative",
        sector: "Metaverse & Gaming",
        description: "An immersive MMXRPG engine where worldbuilding meets sovereign ownership.",
        metric: "$5 Trillion",
        metricLabel: "Metaverse Value by 2030",
        citation: "McKinsey & Company",
        cagr: "39%",
        color: "#22c55e",
        image: "/Medallions/TGN.png",
        link: "https://thegrandenarrative.com"
    },
    {
        name: "BasaltHQ",
        sector: "Enterprise AI & Ops",
        description: "Neuromimetic business architecture defining the future of AI-driven operations.",
        metric: "$200 Billion",
        metricLabel: "Generative AI Market '30",
        citation: "Bloomberg Intelligence",
        cagr: "42%",
        color: "#ff6504",
        image: "/Medallions/BasaltM.png",
        link: "/basalthq"
    },
    {
        name: "Osiris Protocol",
        sector: "RWA & Blockchain",
        description: "Institutional-grade on-chain data pipelines and secure asset tokenization.",
        metric: "$16 Trillion",
        metricLabel: "Tokenized Assets by 2030",
        citation: "BCG & ADDX",
        cagr: "50x Growth",
        color: "#A855F7",
        image: "https://engram1.blob.core.windows.net/tuc-homepage/Medallions/OP.png",
        link: "/osiris-protocol"
    },
    {
        name: "Cornucopia Robotics",
        sector: "AgTech & Automation",
        description: "Autonomous food production systems securing the global supply chain.",
        metric: "$49 Billion",
        metricLabel: "Vertical Farming by 2033",
        citation: "Grand View Research",
        cagr: "22.6%",
        color: "#EC4899",
        image: "https://engram1.blob.core.windows.net/tuc-homepage/Medallions/CornucopiaRobotics.png",
        link: "/cornucopia-robotics"
    },
    {
        name: "Requiem Electric",
        sector: "Energy Infrastructure",
        description: "Decentralized EV charging network enabling peer-to-peer energy exchange.",
        metric: "$257 Billion",
        metricLabel: "EV Charging Mkt by 2032",
        citation: "Fortune Business Insights",
        cagr: "35.5%",
        color: "#FFD700",
        image: "https://engram1.blob.core.windows.net/tuc-homepage/Medallions/RE.png",
        link: "/requiem-electric"
    },
    {
        name: "Vulcan Forge",
        sector: "Distributed Mfg",
        description: "Decentralized 3D printing network for on-demand industrial parts.",
        metric: "$37 Billion",
        metricLabel: "3D Printing Mkt by 2025",
        citation: "Deloitte",
        cagr: "23.5%",
        color: "#F97316",
        image: "https://engram1.blob.core.windows.net/tuc-homepage/Medallions/VulcanForge2.png",
        link: "/vulcan-forge"
    },
    {
        name: "Elysium Athletica",
        sector: "Digital Wellness",
        description: "Move-to-earn ecosystem gamifying health outcomes with AR.",
        metric: "$946 Billion",
        metricLabel: "Digital Health Mkt '30",
        citation: "Grand View Research",
        cagr: "22.2%",
        color: "#f54029",
        image: "https://engram1.blob.core.windows.net/tuc-homepage/Medallions/Elysium.png",
        link: "/elysium-athletica"
    },
    {
        name: "The Graine Ledger",
        sector: "Luxury Assets",
        description: "Securitized whiskey cask ownership with proven historical APY.",
        metric: "$1.7 Billion",
        metricLabel: "Whiskey Market Growth",
        citation: "Market Analysis",
        cagr: "12%",
        color: "#F97316",
        image: "https://engram1.blob.core.windows.net/tuc-homepage/Medallions/TGL.png",
        link: "/the-graine-ledger"
    },
    {
        name: "DigiBazaar",
        sector: "Social Commerce",
        description: "The home of the creative revolution and asset discovery.",
        metric: "$2.6 Trillion",
        metricLabel: "Metaverse Commerce",
        citation: "McKinsey",
        cagr: "High",
        color: "#EF4444",
        image: "https://engram1.blob.core.windows.net/tuc-homepage/Medallions/DigiBazaarMedallion.png",
        link: "/digibazaar"
    },
    {
        name: "Arthaneeti",
        sector: "Governance",
        description: "AI-powered platform for meaningful political and social engagement.",
        metric: "Emerging",
        metricLabel: "Social Token Economy",
        citation: "Web3 Analysis",
        cagr: "Variable",
        color: "#3B82F6",
        image: "https://engram1.blob.core.windows.net/tuc-homepage/Medallions/AR.png",
        link: "/arthaneeti"
    },
    {
        name: "Loch Ness Botanical",
        sector: "Sustainable Yield",
        description: "Blockchain-based yield appropriation and aquaponics.",
        metric: "$19 Billion",
        metricLabel: "Hydroponics Mkt",
        citation: "MarketsandMarkets",
        cagr: "11.3%",
        color: "#2ECC71",
        image: "https://engram1.blob.core.windows.net/tuc-homepage/Medallions/TLN.png",
        link: "/lochness-botanical-society"
    }

]

export default function SubsidiaryAlpha() {
    return (
        <section className="py-32 bg-[#030303] relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="mb-16 md:mb-20">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="text-[#F54029] font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 block"
                    >
                        // Portfolio Deal Flow
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-7xl font-bold font-rajdhani text-white uppercase leading-tight"
                    >
                        Sector <span className="text-white/20">Alpha</span>
                    </motion.h2>
                    <p className="text-white/40 mt-4 md:mt-6 max-w-2xl text-base md:text-lg font-light leading-relaxed">
                        Diversified exposure to high-growth industrial verticals.
                        Each subsidiary captures a specific slice of the automation economy.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                    {subsidiaries.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group relative bg-white/[0.02] border border-white/5 hover:border-white/20 rounded-3xl overflow-hidden transition-all duration-500 md:hover:-translate-y-2"
                        >
                            {/* Card Content */}
                            <div className="p-6 md:p-8 h-full flex flex-col">
                                {/* Header: Medallion & Name */}
                                <div className="flex items-start gap-4 mb-5 md:mb-6">
                                    <div className="relative w-12 h-12 md:w-16 md:h-16 shrink-0">
                                        <div className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-50 transition-opacity duration-500" style={{ background: item.color }} />
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={64}
                                            height={64}
                                            className="relative w-full h-full object-contain drop-shadow-2xl brightness-90 group-hover:brightness-110 transition-all duration-500"
                                        />
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-xl md:text-2xl font-bold text-white font-rajdhani leading-none mb-1 group-hover:text-[#F54029] transition-colors truncate">{item.name}</h3>
                                        <span className="text-[10px] md:text-xs font-mono text-white/30 uppercase tracking-wider">{item.sector}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-xs md:text-sm text-gray-500 mb-6 md:mb-8 leading-relaxed font-light min-h-[40px]">
                                    {item.description}
                                </p>

                                {/* Alpha/Metrics Container */}
                                <div className="mt-auto pt-6 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02] -mx-6 md:-mx-8 -mb-6 md:-mb-8 p-6 md:p-8 relative overflow-hidden group-hover:to-white/[0.04] transition-colors">
                                    {/* Decorative Chart Line */}
                                    <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <TrendingUp size={120} style={{ color: item.color }} className="w-full h-full" />
                                    </div>

                                    <div className="relative z-10 grid grid-cols-2 gap-4">
                                        <div className="overflow-hidden">
                                            <p className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-widest mb-1">Target Market</p>
                                            <p className="text-xl md:text-2xl font-bold text-white font-rajdhani truncate">{item.metric}</p>
                                            <p className="text-[9px] md:text-[10px] text-white/20 truncate">{item.metricLabel}</p>
                                        </div>
                                        <div className="text-right overflow-hidden">
                                            <p className="text-[9px] md:text-[10px] text-white/30 uppercase tracking-widest mb-1">Source</p>
                                            <div className="flex items-center justify-end gap-1 overflow-hidden">
                                                <p className="text-[9px] md:text-[10px] text-white/50 truncate">{item.citation}</p>
                                            </div>
                                            <p className="text-base md:text-lg font-bold font-mono mt-1" style={{ color: item.color }}>{item.cagr} <span className="text-[9px] md:text-[10px] text-white/30 font-normal">CAGR</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Link Overlay */}
                            <Link href={item.link} className="absolute inset-0 z-20 focus:outline-none">
                                <span className="sr-only">View {item.name}</span>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Aggregate Stats Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-16 md:mt-24 p-8 md:p-12 rounded-3xl bg-gradient-to-r from-white/[0.05] to-transparent border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
                    <div className="absolute -left-20 -top-20 w-64 md:w-96 h-64 md:h-96 bg-[#F54029]/10 rounded-full blur-[80px] md:blur-[100px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-12 text-center lg:text-left">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold font-rajdhani text-white uppercase mb-2">Total Addressable Market</h3>
                            <p className="text-sm md:text-base text-white/40 max-w-md">
                                Aggregate opportunity across all TUC subsidiary operational verticals.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-10 md:gap-16 lg:gap-24 w-full lg:w-auto">
                            <div className="text-center">
                                <p className="text-4xl md:text-6xl font-bold font-rajdhani text-white mb-1 md:mb-2 tracking-tighter">~$24.8T</p>
                                <p className="text-[10px] md:text-xs font-mono text-[#F54029] uppercase tracking-widest">Combined 2030 TAM</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl md:text-6xl font-bold font-rajdhani text-white mb-1 md:mb-2 tracking-tighter">~28%</p>
                                <p className="text-[10px] md:text-xs font-mono text-green-500 uppercase tracking-widest">Avg Portfolio CAGR</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
