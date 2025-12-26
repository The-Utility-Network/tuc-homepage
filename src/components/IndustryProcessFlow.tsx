'use client';

import { motion } from 'framer-motion';

interface Stage {
    icon: string;
    title: string;
    desc: string;
}

interface Props {
    stages?: Stage[];
}

export default function IndustryProcessFlow({ stages }: Props) {
    const defaultStages = [
        { icon: '📝', title: 'Legacy Audit', desc: 'Manual Data Entry' },
        { icon: '⛓️', title: 'Tokenization', desc: 'Asset Digitzation' },
        { icon: '⚡', title: 'Automation', desc: 'Smart Contract Logic' },
        { icon: '🚀', title: 'Settlement', desc: 'Instant Value Transfer' }
    ];

    const activeStages = stages || defaultStages;

    return (
        <div className="w-full py-12">
            <h3 className="text-xl font-bold mb-8 text-center uppercase tracking-widest text-gray-500">The Transformation Process</h3>

            <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 max-w-5xl mx-auto">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-10 hidden md:block" />

                {/* Stages */}
                {activeStages.map((stage, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.15 }}
                        className="flex flex-col items-center bg-black/80 backdrop-blur-md border border-white/10 p-6 rounded-xl w-48 text-center hover:border-utility-red/50 transition-all group relative z-10"
                    >
                        {/* Step Number Badge */}
                        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-gray-500 font-mono group-hover:bg-utility-red group-hover:text-white transition-colors">
                            {i + 1}
                        </div>

                        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{stage.icon}</div>
                        <div className="font-bold text-white mb-2 text-sm">{stage.title}</div>
                        <div className="text-xs text-gray-500 leading-tight">{stage.desc}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
