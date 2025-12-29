'use client';

import Link from 'next/link';
import { ArrowRight, Lock, PieChart, ShieldCheck, Globe } from 'lucide-react';

export default function NexusPreview() {
    return (
        <section className="relative py-24 bg-black overflow-hidden border-t border-white/10">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F54029]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Content */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-2 text-[#F54029] font-mono text-xs uppercase tracking-[0.2em]">
                            <div className="w-2 h-2 bg-[#F54029] rounded-full animate-pulse" />
                            Secure Data Room Active
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold font-rajdhani leading-tight text-white">
                            TUC <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F54029] to-orange-600">NEXUS</span> <br />
                            Console Access
                        </h2>

                        <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                            Qualified investors and partners can access real-time financial data, legal frameworks, and equity management tools through our secure proprietary interface.
                        </p>

                        {/* Feature List */}
                        <div className="space-y-4 pt-4">
                            {[
                                { icon: ShieldCheck, text: "Institutional-Grade Security" },
                                { icon: PieChart, text: "Live Cap Table & Equity Management" },
                                { icon: Globe, text: "Global Asset Verification" },
                                { icon: Lock, text: "Encrypted Data Room" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-white/80">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#F54029]">
                                        <item.icon size={20} />
                                    </div>
                                    <span className="font-medium tracking-wide">{item.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/nexus"
                                className="px-8 py-4 bg-[#F54029] hover:bg-[#C53020] text-white font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group"
                            >
                                Launch Nexus Console
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center"
                            >
                                Request Access
                            </Link>
                        </div>
                    </div>

                    {/* Right: Visual */}
                    <div className="relative group perspective-[2000px]">
                        <div className="absolute -inset-2 bg-gradient-to-br from-[#F54029] via-purple-600 to-blue-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse-slow"></div>
                        <div className="relative rounded-2xl bg-[#0A0A0A] border border-white/10 overflow-hidden shadow-2xl transform transition-all duration-700 hover:rotate-y-2 hover:scale-[1.02]">
                            {/* Fake UI Header */}
                            <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                                </div>
                                <div className="ml-4 px-3 py-1 bg-black/50 rounded-md text-[10px] text-white/40 font-mono flex-1 truncate flex items-center gap-2">
                                    <Lock size={10} className="text-[#F54029]" />
                                    theutilitycompany.co/nexus
                                </div>
                            </div>

                            {/* UI Mockup Content */}
                            <div className="p-6 space-y-6 opacity-90 relative overflow-hidden">
                                {/* Scanline effect */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

                                <div className="flex gap-4 mb-8">
                                    <div className="w-1/3 h-24 bg-white/[0.03] rounded-xl border border-white/5 relative overflow-hidden group/card">
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-[#F54029] scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500"></div>
                                    </div>
                                    <div className="w-1/3 h-24 bg-white/[0.03] rounded-xl border border-white/5 relative overflow-hidden group/card">
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-purple-500 scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500 delay-75"></div>
                                    </div>
                                    <div className="w-1/3 h-24 bg-white/[0.03] rounded-xl border border-white/5 relative overflow-hidden group/card">
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500 scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500 delay-150"></div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 w-3/4 bg-gradient-to-r from-white/10 to-transparent rounded animate-pulse"></div>
                                    <div className="h-4 w-1/2 bg-gradient-to-r from-white/5 to-transparent rounded animate-pulse delay-75"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="h-32 bg-white/[0.02] rounded-xl border border-white/5 relative overflow-hidden">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center">
                                                <div className="w-12 h-12 rounded-full border border-[#F54029]/30 border-t-[#F54029] animate-spin"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-32 bg-gradient-to-br from-[#F54029]/10 to-transparent rounded-xl border border-[#F54029]/20 flex items-center justify-center relative overflow-hidden group/pie">
                                        <div className="absolute inset-0 bg-[#F54029]/5 scale-0 group-hover/pie:scale-100 transition-transform rounded-full blur-xl"></div>
                                        <PieChart className="text-[#F54029] relative z-10" size={40} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
