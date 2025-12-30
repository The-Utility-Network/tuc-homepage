'use client'

import { motion } from 'framer-motion'
import { PieChart, Lock, FileText, Globe, Zap, BarChart3, Fingerprint, BookOpen, Scale } from 'lucide-react'


const features = [
    {
        icon: Scale,
        title: "Regulatory Compliance",
        desc: "Automated SEC Rule 506(c) & Reg S enforcement. Built-in accreditation verification and jurisdiction-based investment limits.",
        color: "text-blue-400"
    },
    {
        icon: PieChart,
        title: "Dynamic Cap Table",
        desc: "Real-time visibility into your equity position. Track dilution, vesting schedules, and share classes instantly.",
        color: "text-[#F54029]"
    },
    {
        icon: Lock,
        title: "Bank-Grade Security",
        desc: "Enterprise encryption for all sensitive data. Role-based access control and immutable audit logs.",
        color: "text-emerald-400"
    },
    {
        icon: FileText,
        title: "Smart Contracts",
        desc: "Legal agreements generated and signed on the fly. Digital signatures embedded directly into immutable PDF records.",
        color: "text-purple-400"
    },
    {
        icon: Globe,
        title: "Global Access",
        desc: "Participate from anywhere. Multi-currency support and international compliance checks built-in.",
        color: "text-cyan-400"
    },
    {
        icon: Zap,
        title: "Instant Settlement",
        desc: "Seamless capital calls and distribution management. Automated workflows for fund operations.",
        color: "text-yellow-400"
    }
]

export default function NexusFeatures() {
    return (
        <section className="py-24 bg-[#0A0A0A] relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F54029]/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold font-rajdhani text-white uppercase mb-4">
                        Powering the <span className="text-[#F54029]">Capital Stack</span>
                    </h2>
                    <p className="text-white/40 text-lg">
                        A fully integrated operating system for modern asset management.
                        Replacing spreadsheets with smart, secure, and scalable infrastructure.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/[0.02] border border-white/5 hover:border-[#F54029]/30 rounded-2xl p-8 group transition-colors duration-300 backdrop-blur-sm"
                        >
                            <div className={`p-3 bg-white/5 rounded-xl w-fit mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold font-rajdhani text-white uppercase mb-3 group-hover:text-[#F54029] transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-white/40 leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-white/60">SYSTEM OPERATIONAL • ACCEPTING NEW PARTNERS</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
