'use client'

import { motion } from 'framer-motion'
import { LayoutDashboard, Users, PieChart, FileText, Settings, Bell, Search, PlusCircle } from 'lucide-react'

export default function PortalPreview() {
    return (
        <section className="py-32 bg-black relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#F54029]/20 to-transparent" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-[#F54029] font-mono text-[10px] uppercase tracking-widest mb-4 block"
                    >
                        // The Experience
                    </motion.span>
                    <h2 className="text-4xl md:text-6xl font-bold font-rajdhani text-white uppercase mb-6">
                        The Investor <span className="text-white/20">Portal</span>
                    </h2>
                    <p className="text-white/40 max-w-2xl mx-auto text-lg font-light">
                        A high-fidelity management suite for institutional oversight and real-time portfolio tracking.
                    </p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Shadow/Glow behind the mockup */}
                    <div className="absolute -inset-4 bg-[#F54029]/10 rounded-[40px] blur-3xl opacity-50 pointer-events-none" />

                    {/* The Mockup Shell - Fixed aspect on desktop, auto on mobile */}
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative bg-[#0d0d0d] rounded-2xl border border-white/10 shadow-2xl overflow-hidden min-h-[500px] md:aspect-[16/9]"
                    >
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Left Navigation - Desktop: Sidebar, Mobile: Slim Header or Bottom Tab? Let's do a top sub-nav for mobile */}
                            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-black/40 flex md:flex-col p-4 md:p-6 overflow-x-auto md:overflow-x-visible items-center md:items-stretch gap-4 md:gap-0">
                                <div className="flex items-center gap-3 md:mb-10 px-2 shrink-0">
                                    <div className="w-8 h-8 bg-[#F54029] rounded-lg flex items-center justify-center shrink-0">
                                        <div className="w-4 h-4 rounded-sm border-2 border-white/20" />
                                    </div>
                                    <span className="hidden md:block font-rajdhani font-bold text-white uppercase tracking-widest text-sm">Nexus Console</span>
                                </div>

                                <div className="flex md:flex-col gap-2 flex-grow shrink-0">
                                    {[
                                        { icon: LayoutDashboard, label: "Dashboard", active: true },
                                        { icon: Users, label: "Cap" },
                                        { icon: PieChart, label: "Alloc" },
                                        { icon: FileText, label: "Docs" },
                                        { icon: Settings, label: "Set" }
                                    ].map((item, idx) => (
                                        <div key={idx} className={`flex items-center gap-2 md:gap-4 p-2 md:p-3 rounded-xl transition-colors cursor-not-allowed whitespace-nowrap ${item.active ? 'bg-white/5 text-[#F54029]' : 'text-white/30 hover:bg-white/[0.02]'}`}>
                                            <item.icon size={18} />
                                            <span className="text-[10px] md:text-sm font-medium">{item.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="hidden md:block p-3 bg-white/[0.02] rounded-xl border border-white/5 mt-auto">
                                    <p className="text-[10px] text-white/20 uppercase font-mono mb-2">Network Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs text-white/60">Global Sync Active</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-grow flex flex-col h-full overflow-hidden">
                                {/* Top Bar */}
                                <div className="h-14 md:h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-black/20 shrink-0">
                                    <div className="flex items-center gap-3 md:gap-4 text-white/20 overflow-hidden">
                                        <Search size={16} />
                                        <span className="text-xs md:text-sm truncate">Search assets...</span>
                                    </div>
                                    <div className="flex items-center gap-4 md:gap-6 shrink-0">
                                        <Bell size={16} className="text-white/40" />
                                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                                    </div>
                                </div>

                                {/* Dashboard Content Mockup */}
                                <div className="p-4 md:p-8 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar flex-grow">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold font-rajdhani text-white uppercase">Portfolio Overview</h3>
                                            <p className="text-[10px] text-white/30 font-mono tracking-widest mt-1 uppercase truncate">Vesting: 0x4A...2C90</p>
                                        </div>
                                        <button className="w-fit px-4 py-2 bg-[#F54029] text-white rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 shrink-0">
                                            <PlusCircle size={14} /> Invest More
                                        </button>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                        {[
                                            { label: "Asset Value", value: "$4,290,000", change: "+12.4%", color: "text-green-500" },
                                            { label: "Distributions", value: "$125,400", change: "Next: Aug 12", color: "text-blue-500" },
                                            { label: "Equity", value: "0.84%", change: "Institutional", color: "text-purple-500" }
                                        ].map((stat, i) => (
                                            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-6 hover:bg-white/[0.04] transition-colors">
                                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1 md:mb-2 font-mono">{stat.label}</p>
                                                <p className="text-xl md:text-2xl font-bold text-white font-rajdhani mb-2">{stat.value}</p>
                                                <p className={`text-[10px] font-bold ${stat.color}`}>{stat.change}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Chart Placeholder */}
                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 h-40 md:h-64 relative overflow-hidden group">
                                        <div className="flex items-center justify-between mb-4 md:mb-8">
                                            <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest">Growth Performance</p>
                                            <div className="flex gap-2">
                                                <div className="w-2 h-2 rounded-sm bg-[#F54029]" />
                                                <div className="w-2 h-2 rounded-sm bg-blue-500" />
                                            </div>
                                        </div>
                                        {/* Stylized Chart Line */}
                                        <svg className="absolute bottom-0 left-0 w-full h-24 md:h-32 text-[#F54029]/20" preserveAspectRatio="none">
                                            <path d="M0,128 C100,60 200,100 300,40 C400,0 500,80 600,20 C700,0 800,40 900,10 L900,128 L0,128 Z" fill="currentColor" />
                                            <path d="M0,128 C100,60 200,100 300,40 C400,0 500,80 600,20 C700,0 800,40 900,10" fill="none" stroke="#F54029" strokeWidth="2" />
                                        </svg>
                                    </div>

                                    {/* Recent Documents Table - Mobile: Stacked list */}
                                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-6">
                                        <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest mb-4 md:mb-6 px-2">Compliance Vault</p>
                                        <div className="space-y-3 md:space-y-4">
                                            {[
                                                { name: "Subscription Agreement", date: "2024-12-15", status: "Verified" },
                                                { name: "Quarterly Asset Report", date: "2024-11-20", status: "New" },
                                                { name: "Osiris Token Audit", date: "2024-10-05", status: "Archived" }
                                            ].map((doc, k) => (
                                                <div key={k} className="flex items-center justify-between p-2 md:p-3 rounded-xl hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0 overflow-hidden">
                                                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                                                        <FileText size={16} className="text-[#F54029]/60 shrink-0" />
                                                        <span className="text-xs md:text-sm font-medium text-white/60 truncate">{doc.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4 md:gap-8 shrink-0">
                                                        <span className="hidden sm:block text-[10px] font-mono text-white/20">{doc.date}</span>
                                                        <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${doc.status === 'Verified' ? 'text-green-500' : 'text-blue-500'}`}>{doc.status}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
