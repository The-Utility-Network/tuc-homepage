'use client';

import { motion } from 'framer-motion';

export default function IndustryProcessFlow() {
    return (
        <div className="w-full py-12">
            <h3 className="text-xl font-bold mb-8 text-center uppercase tracking-widest text-gray-500">The Transformation Process</h3>

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -z-10 hidden md:block" />

                {/* Stages */}
                {[
                    { icon: '📝', title: 'Legacy Audit', desc: 'Manual Data Entry' },
                    { icon: '⛓️', title: 'Tokenization', desc: 'Asset Digitzation' },
                    { icon: '⚡', title: 'Automation', desc: 'Smart Contract Logic' },
                    { icon: '🚀', title: 'Settlement', desc: 'Instant Value Transfer' }
                ].map((stage, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="flex flex-col items-center bg-black border border-white/10 p-6 rounded-xl w-48 text-center hover:border-utility-red/50 transition-colors z-10"
                    >
                        <div className="text-4xl mb-4">{stage.icon}</div>
                        <div className="font-bold text-white mb-1">{stage.title}</div>
                        <div className="text-xs text-gray-500">{stage.desc}</div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
