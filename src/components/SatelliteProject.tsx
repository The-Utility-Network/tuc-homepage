'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ImageLightbox from './ImageLightbox';

export default function SatelliteProject() {
    // Simplified background - no complex state needed

    return (
        <ImageLightbox src="/artifacts/tspprocess.png" alt="The Satellite Project Process">
            <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl border border-pink-500/30 group bg-[#1a0b2e]">

                {/* ================= BACKGROUND LAYER (Mesh Gradient) ================= */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-[#0f0518]"> {/* Darker base */}

                    {/* Mesh Gradient Blobs */}
                    {/* Top Left - Hot Pink */}
                    <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-pink-600/30 blur-[120px] mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />

                    {/* Top Right - Deep Purple */}
                    <div className="absolute top-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-purple-800/40 blur-[100px] mix-blend-screen" />

                    {/* Center/Mid - Cyan/Teal hint for contrast */}
                    <div className="absolute top-[30%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[80px] mix-blend-overlay" />

                    {/* Bottom - Darker Hues (Overlay to darken) */}
                    <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#0f0518] via-[#0f0518]/80 to-transparent" />

                    {/* Subtle sheen/noise texture */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay" />
                </div>

                {/* ================= DIAGRAM CONTAINER ================= */}
                <div className="relative z-20 w-full opacity-100 pointer-events-none">
                    <div className="relative w-full">
                        {/* Invert + Screen: Transparent BG, White Lines */}
                        <Image
                            src="/artifacts/tspprocess.png"
                            alt="The Satellite Project Process"
                            width={1984}
                            height={2144}
                            className="w-full h-auto contrast-110 saturate-100 brightness-105"
                            priority
                        />
                    </div>
                </div>

                {/* ================= OVERLAY ================= */}
                <div className="absolute inset-0 z-30 pointer-events-none rounded-3xl shadow-[inset_0_0_40px_rgba(46,2,47,0.5)]">
                    <div className="hidden sm:block w-full bg-[#2e022f]/60 backdrop-blur-md py-4 border-t border-pink-500/30 absolute bottom-0 left-0 rounded-b-3xl">
                        <p className="text-center text-xs font-mono text-pink-300 uppercase tracking-[0.2em] drop-shadow-[0_0_5px_#ec4899]">
                            Fig 3.0: High-Density Vertical Farming
                        </p>
                    </div>
                </div>
            </div>
        </ImageLightbox>
    );
}
