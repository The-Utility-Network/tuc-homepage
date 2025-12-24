'use client';

import { motion } from 'framer-motion';

export default function ComparisonChart({ competitorName }: { competitorName: string }) {
    const metrics = [
        { label: 'Settlement Speed', tuc: 98, comp: 40 },
        { label: 'Decentralization', tuc: 95, comp: 60 },
        { label: 'RWA Integration', tuc: 90, comp: 20 },
        { label: 'Cost Efficiency', tuc: 85, comp: 50 },
    ];

    return (
        <div className="w-full mt-8 bg-black/40 p-6 rounded-2xl border border-white/5">
            <h4 className="text-sm font-bold text-gray-500 uppercase mb-6 text-center">Performance Benchmarks</h4>

            <div className="space-y-6">
                {metrics.map((m) => (
                    <div key={m.label}>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-400">{m.label}</span>
                            <div className="flex gap-4">
                                <span className="text-utility-red font-bold">TUC</span>
                                <span className="text-gray-600">{competitorName}</span>
                            </div>
                        </div>

                        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                            {/* Competitor Bar */}
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${m.comp}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="absolute top-0 left-0 h-full bg-gray-700"
                            />
                            {/* TUC Bar (Overlay) - Wait, overlays imply sharing space. Let's do two bars or stack them? 
                        Stacked bars are harder to read for comparison. 
                        Let's do two separate charts or just TUC superior bar.
                        Actually, overlapping visually works if transparency is used, but side-by-side or just relative length of one bar vs another?
                        Let's keep it simple: Just render TUC bar vs Competitor Bar in same track? No.
                        Let's do two separate tracks stacked close?
                        Let's just show TUC Advantage delta. 
                        Actually, let's keep the single track with TUC as the main filler and comp as a marker?
                        Let's do standard "Dual Bar" config.
                    */}
                        </div>
                        {/* Re-doing visuals for clarity: Two bars stack vertical */}
                        <div className="flex flex-col gap-1 mt-1">
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${m.comp}%` }}
                                    className="h-full bg-gray-600"
                                />
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${m.tuc}%` }}
                                    className="h-full bg-utility-red"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
