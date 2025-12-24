'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ImageLightbox from './ImageLightbox';

export default function LochNessCycle() {
    const [fish, setFish] = useState<Array<{ id: number, y: number, duration: number, delay: number, scale: number }>>([]);
    const [particles, setParticles] = useState<Array<{ width: number, height: number, left: string, top: string, duration: number, delay: number }>>([]);

    useEffect(() => {
        // Generate Fish School
        setFish(Array.from({ length: 15 }).map((_, i) => {
            const duration = 15 + Math.random() * 20;
            return {
                id: i,
                y: Math.random() * 80 + 10, // 10% to 90% vertical position
                duration: duration,
                // Negative delay starts the animation mid-way, distributing fish across the screen immediately
                delay: -Math.random() * duration,
                scale: 0.5 + Math.random() * 0.5
            };
        }));

        // Bright Bubbles/Particles
        setParticles(Array.from({ length: 30 }).map(() => ({
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 120}%`,
            duration: 3 + Math.random() * 5,
            delay: Math.random() * 5
        })));
    }, []);

    return (
        <ImageLightbox src="/artifacts/tlnprocess.png" alt="The Loch Ness Botanical Society Process">
            <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-teal-400/30 group bg-[#0d9488]">

                {/* ================= BACKGROUND LAYER (Bright Aquarium) ================= */}
                <div className="absolute inset-0 z-0 overflow-hidden">

                    {/* Bright Gradient: Cyan to Teal */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee] via-[#0d9488] to-[#115e59]" />

                    {/* Animated Light Caustics */}
                    <motion.div
                        className="absolute inset-0 opacity-40 mix-blend-overlay"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 50% -20%, white 0%, transparent 60%)',
                        }}
                        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* CSS Keyframes for Fish */}
                    <style jsx>{`
                    @keyframes swimAcross {
                        from { left: -20%; }
                        to { left: 120%; }
                    }
                `}</style>

                    {/* SWIMMING FISH */}
                    {fish.map((f) => (
                        <motion.div
                            key={`fish-${f.id}`}
                            className="absolute w-12 h-6 opacity-60 mix-blend-multiply text-teal-900"
                            style={{
                                top: `${f.y}%`,
                                scale: f.scale,
                                // Use CSS animation for robust negative delay support
                                animation: `swimAcross ${f.duration}s linear infinite`,
                                animationDelay: `${f.delay}s`
                            }}
                            // Only animate Y with Framer Motion
                            animate={{
                                y: [0, 20, -20, 0]
                            }}
                            transition={{
                                y: { duration: f.duration / 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                        >
                            {/* Simple Fish SVG */}
                            <svg viewBox="0 0 50 25" className="w-full h-full fill-current -scale-x-100">
                                <path d="M45,12.5 Q35,0 20,5 Q5,10 0,12.5 Q5,15 20,20 Q35,25 45,12.5 Z M45,12.5 L50,0 L50,25 L45,12.5" />
                                <circle cx="10" cy="11" r="1.5" fill="white" />
                            </svg>
                        </motion.div>
                    ))}

                    {/* Rising Bubbles */}
                    {particles.map((p, i) => (
                        <motion.div
                            key={`bubble-${i}`}
                            className="absolute rounded-full bg-white/40 blur-[0.5px] mix-blend-overlay"
                            style={{
                                width: p.width, height: p.height,
                                left: p.left, top: p.top,
                            }}
                            animate={{
                                y: [0, -600],
                                opacity: [0, 0.8, 0],
                            }}
                            transition={{ duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay }}
                        />
                    ))}
                </div>

                {/* ================= DIAGRAM CONTAINER ================= */}
                <div className="relative z-20 w-full mix-blend-overlay opacity-100 pointer-events-none">
                    <div className="relative w-full">
                        {/* Invert + Screen: Turns White BG -> Black -> Transparent. Black Lines -> White. */}
                        <Image
                            src="/artifacts/tlnprocess.png"
                            alt="The Loch Ness Botanical Society Process"
                            width={1984}
                            height={2144}
                            className="w-full h-auto contrast-110 saturate-100 brightness-105"
                            priority
                        />
                    </div>
                </div>

                {/* ================= BORDER/CAPTION ================= */}
                <div className="absolute inset-0 z-30 pointer-events-none rounded-3xl shadow-[inset_0_0_20px_rgba(255,255,255,0.3)]">
                    <div className="hidden sm:block w-full bg-white/20 backdrop-blur-md py-4 border-t border-teal-100/30 absolute bottom-0 left-0 rounded-b-3xl">
                        <p className="text-center text-xs font-mono text-teal-900 font-bold uppercase tracking-[0.2em] drop-shadow-sm">
                            Fig 2.0: Automated Hydroponic Cycle
                        </p>
                    </div>
                </div>
            </div>
        </ImageLightbox>
    );
}
