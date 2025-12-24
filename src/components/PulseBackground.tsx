'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PulseBackground() {
    const [pulses, setPulses] = useState<{ id: number, x: number, y: number, delay: number }[]>([]);

    useEffect(() => {
        setPulses([...Array(6)].map((_, i) => ({
            id: i,
            x: Math.random() * 100, // %
            y: Math.random() * 100, // %
            delay: Math.random() * 5
        })));
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40 bg-white">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="hex-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M20 0 L40 10 L40 30 L20 40 L0 30 L0 10 Z" fill="none" stroke="#e5e5e5" strokeWidth="1" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hex-grid)" />
            </svg>

            {pulses.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: [0, 0.4, 0],
                        scale: [0.5, 1.5, 2],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeOut"
                    }}
                >
                    <div className="w-24 h-24 rounded-full border-2 border-red-500 blur-xl opacity-30" />
                    <div className="absolute inset-0 w-24 h-24 rounded-full bg-red-500 opacity-10 mix-blend-multiply" />
                </motion.div>
            ))}
        </div>
    );
}
