'use client'

import { motion } from 'framer-motion'
import { Cpu, Network, Zap } from 'lucide-react'

export default function ConvergenceThesis() {
    return (
        <section className="py-24 bg-zinc-900/30 border-y border-white/5 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase mb-4 block">
                        The Investment Thesis
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold font-rajdhani text-white uppercase">
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Convergence</span> Moment
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        {
                            icon: Network,
                            title: "Distributed Ledger",
                            desc: "Blockchain has matured from speculation to settlement layer. Institutions now demand on-chain provenance for real-world assets.",
                            color: "text-blue-400"
                        },
                        {
                            icon: Cpu,
                            title: "Generative Logic",
                            desc: "AI agents are replacing static software. Business logic is becoming autonomous, requiring new governance structures like Nexus.",
                            color: "text-purple-400"
                        },
                        {
                            icon: Zap,
                            title: "Industrial IOT",
                            desc: "Physical infrastructure is coming online. We bridge the 'air gap' between robotic labor and digital capital markets.",
                            color: "text-yellow-400"
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/5 hover:border-white/10 text-center group"
                        >
                            <div className={`mx-auto w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${item.color}`}>
                                <item.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold font-rajdhani text-white uppercase mb-4">{item.title}</h3>
                            <p className="text-white/40 leading-relaxed text-sm">
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-lg md:text-2xl font-light text-white/80 max-w-3xl mx-auto leading-relaxed">
                        "Nexus is not just a platform. It is the operating system for the <span className="text-white font-bold">Post-Labor Economy</span>."
                    </p>
                </div>
            </div>
        </section>
    )
}
