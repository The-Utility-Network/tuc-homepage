'use client';

import { motion } from 'framer-motion';
import { LOCATIONS } from '@/data/seo';
import Link from 'next/link';
import { useState } from 'react';

export default function WorldMap() {
    const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

    return (
        <div className="relative w-full aspect-[2/1] bg-[#050505] rounded-3xl border border-white/5 overflow-hidden">
            {/* Grid Overlay */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '4% 8%'
                }}
            ></div>

            {/* World Map Silhouette (Simplified SVG) */}
            <svg className="absolute inset-0 w-full h-full text-white/5 pointer-events-none" fill="currentColor" viewBox="0 0 100 50" preserveAspectRatio="none">
                {/* Abstract Continent Shapes - simplified for aesthetics */}
                <path d="M10,10 Q20,5 30,15 T40,10 T50,20 T80,15 T90,25" fill="none" stroke="currentColor" strokeWidth="0.2" opacity="0.5" />
                {/* We use dots to represent the world instead of a heavy shape */}
            </svg>

            {/* Decorative 'Scan Lines' */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-utility-red/5 to-transparent h-[10%] w-full animate-scan" style={{ animationDuration: '4s' }} />

            {/* Locations */}
            {LOCATIONS.map((loc) => (
                <div
                    key={loc.slug}
                    className="absolute"
                    style={{
                        left: `${loc.coordinates.x}%`,
                        top: `${loc.coordinates.y}%`
                    }}
                    onMouseEnter={() => setHoveredLocation(loc.slug)}
                    onMouseLeave={() => setHoveredLocation(null)}
                >
                    <Link href={`/locations/${loc.slug}`}>
                        <div className="relative group cursor-pointer">
                            {/* Pulse Effect */}
                            <motion.div
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -inset-2 rounded-full bg-utility-red/30"
                            />

                            {/* Core Dot */}
                            <div className="w-2 h-2 bg-utility-red rounded-full shadow-[0_0_10px_var(--utility-red)] group-hover:scale-150 transition-transform duration-300" />

                            {/* Connector Line (Vertical) */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: hoveredLocation === loc.slug ? 40 : 0 }}
                                className="absolute left-1 bottom-2 w-px bg-utility-red/50 origin-bottom"
                            />

                            {/* Tooltip Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{
                                    opacity: hoveredLocation === loc.slug ? 1 : 0,
                                    y: hoveredLocation === loc.slug ? -80 : 10,
                                    scale: hoveredLocation === loc.slug ? 1 : 0.9
                                }}
                                className="absolute left-1/2 -translate-x-1/2 bottom-4 w-48 pointer-events-none z-20"
                            >
                                <div className="glass-panel p-3 rounded-xl border border-utility-red/30">
                                    <h4 className="text-white font-bold text-sm">{loc.city}</h4>
                                    <span className="text-xs text-utility-red uppercase tracking-wider">{loc.keyFocus}</span>
                                </div>
                            </motion.div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}
