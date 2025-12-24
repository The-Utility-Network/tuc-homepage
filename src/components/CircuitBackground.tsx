'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function CircuitBackground() {
    const [particles, setParticles] = useState<{ id: number, x: number, y: number }[]>([]);

    useEffect(() => {
        setParticles([...Array(5)].map((_, i) => ({
            id: i,
            x: Math.random() * 1000,
            y: Math.random() * 1000
        })));
    }, []);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="circuit-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M10 10 L40 10 L40 40" fill="none" stroke="#FFD700" strokeWidth="1" strokeOpacity="0.5" />
                        <path d="M60 60 L90 60 L90 90" fill="none" stroke="#FFD700" strokeWidth="1" strokeOpacity="0.5" />
                        <circle cx="40" cy="40" r="2" fill="#FFD700" opacity="0.5" />
                        <circle cx="90" cy="90" r="2" fill="#FFD700" opacity="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
            </svg>
            {/* Moving Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_10px_#FFD700]"
                    initial={{ x: p.x, y: p.y }}
                    animate={{
                        x: [Math.random() * 1000, Math.random() * 1000],
                        y: [Math.random() * 1000, Math.random() * 1000],
                    }}
                    transition={{
                        duration: 20 + Math.random() * 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}
