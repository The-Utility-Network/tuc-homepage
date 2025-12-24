'use client';

import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import ImageLightbox from './ImageLightbox';

export default function GraineLedgerProcess() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out the mouse movement for the slosh
    const smoothX = useSpring(mouseX, { stiffness: 50, damping: 15 });
    const smoothY = useSpring(mouseY, { stiffness: 50, damping: 15 });

    // Map mouse position to slosh transformation
    const rotateLiquid = useTransform(smoothX, [-0.5, 0.5], [-5, 5]);
    const displaceLiquid = useTransform(smoothX, [-0.5, 0.5], [-50, 50]);
    const scaleLiquid = useTransform(smoothY, [-0.5, 0.5], [1.05, 0.95]);

    const [bubbles, setBubbles] = useState<Array<{ width: number, height: number, left: string, top: string, duration: number, delay: number }>>([]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalize -1 to 1
        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);

        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    useEffect(() => {
        // Minimalist Flat Bubbles
        setBubbles(Array.from({ length: 25 }).map(() => ({
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 120}%`,
            duration: 4 + Math.random() * 4,
            delay: Math.random() * 5
        })));
    }, []);

    // Chromatic Layers (Back to Front)
    const waves = [
        { color: '#fbbf24', opacity: 1, yOffset: 10, speed: 10 }, // Bright Amber (Top/Back)
        { color: '#f59e0b', opacity: 1, yOffset: 25, speed: 11 },
        { color: '#ea580c', opacity: 1, yOffset: 45, speed: 13 },
        { color: '#c2410c', opacity: 1, yOffset: 65, speed: 9 },
        { color: '#7f1d1d', opacity: 1, yOffset: 90, speed: 10 }, // Deep Red (Bottom/Front)
    ];

    return (
        <ImageLightbox src="/artifacts/tglprocess.png" alt="The Graine Ledger Distillation Process">
            <div
                ref={containerRef}
                className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 group bg-[#fbbf24]"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >

                {/* ================= BACKGROUND LAYER (Interactive Liquid) ================= */}
                <div className="absolute inset-0 z-0 overflow-hidden">

                    {/* Base Background */}
                    <div className="absolute inset-0 bg-[#fbbf24]" />

                    {/* SLOSHING CONTAINER */}
                    <motion.div
                        className="absolute inset-[-20%] origin-bottom"
                        style={{
                            rotate: rotateLiquid,
                            x: displaceLiquid,
                            scaleY: scaleLiquid,
                        }}
                    >
                        {waves.map((wave, i) => (
                            <motion.div
                                key={i}
                                className="absolute bottom-0 left-0 right-0 w-full"
                                style={{ height: `${100 - i * 12}%` }}
                                animate={{
                                    y: [0, wave.yOffset / 4, 0],
                                }}
                                transition={{
                                    duration: wave.speed,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                {/* SVG Wave Shape */}
                                <svg viewBox="0 0 1440 320" className="absolute bottom-[100%] w-full h-[150px]" preserveAspectRatio="none">
                                    <path
                                        fill={wave.color}
                                        d="M0,160L80,186.7C160,213,320,267,480,261.3C640,256,800,192,960,181.3C1120,171,1280,213,1360,234.7L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                                    />
                                </svg>
                                <div className="w-full h-full" style={{ backgroundColor: wave.color }} />
                            </motion.div>
                        ))}
                    </motion.div>


                    {/* Flat Bubbles */}
                    {bubbles.map((b, i) => (
                        <motion.div
                            key={`bubble-${i}`}
                            className="absolute rounded-full bg-white/40 mix-blend-overlay"
                            style={{
                                width: b.width, height: b.height,
                                left: b.left, top: b.top
                            }}
                            animate={{
                                y: [0, -800],
                                opacity: [0, 0.6, 0],
                                x: [0, Math.random() * 20 - 10, 0]
                            }}
                            transition={{ duration: b.duration, repeat: Infinity, ease: "linear", delay: b.delay }}
                        />
                    ))}
                </div>

                {/* ================= DIAGRAM LAYER ================= */}
                <div className="relative z-20 w-full mix-blend-screen opacity-100 pointer-events-none">
                    <div className="relative w-full">
                        <Image
                            src="/artifacts/tglprocess.png"
                            alt="The Graine Ledger Distillation Process"
                            width={1984}
                            height={2144}
                            className="w-full h-auto contrast-110 saturate-100 brightness-105"
                            priority
                        />
                    </div>
                </div>

                {/* ================= BORDER ================= */}
                <div className="absolute inset-0 z-30 pointer-events-none rounded-3xl shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]">
                    <div className="hidden sm:block w-full bg-black/30 backdrop-blur-sm py-4 border-t border-white/10 absolute bottom-0 left-0 rounded-b-3xl">
                        <p className="text-center text-xs font-mono text-white/80 uppercase tracking-[0.2em] pointer-events-none">
                            Fig 1.1: The On-Chain Distillation Cycle
                        </p>
                    </div>
                </div>
            </div>
        </ImageLightbox>
    );
}
