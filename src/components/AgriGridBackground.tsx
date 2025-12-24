'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AgriGridBackground() {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(236, 72, 153, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 72, 153, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
            {/* Scanlines */}
            <motion.div
                className="absolute inset-0 w-full h-[5%]"
                style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(236, 72, 153, 0.2), transparent)',
                    boxShadow: '0 0 20px rgba(236, 72, 153, 0.1)'
                }}
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute inset-0 w-full h-[2%]"
                style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(236, 72, 153, 0.3), transparent)'
                }}
                animate={{ top: ['-10%', '110%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2 }}
            />
        </div>
    );
}
