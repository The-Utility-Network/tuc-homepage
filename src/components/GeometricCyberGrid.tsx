'use client';

import { motion } from 'framer-motion';

export default function GeometricCyberGrid({
    title,
    subtitle,
}: {
    title?: string;
    subtitle?: string;
}) {
    return (
        <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center group">
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(245, 64, 41, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245, 64, 41, 0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            {/* Rotating Cyber Rings */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[80%] h-[80%] border border-utility-red/20 rounded-full border-dashed"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[60%] h-[60%] border-2 border-white/5 rounded-full border-t-utility-red/50 border-r-transparent border-b-white/10 border-l-transparent"
            />
            <motion.div
                animate={{ rotate: 180 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute w-[40%] h-[40%] border border-utility-red/10 rounded-full"
            />

            {/* Central Content */}
            {title && (
                <div className="relative z-10 text-center backdrop-blur-sm bg-black/40 p-8 rounded-full border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                            {title.toUpperCase()}
                        </h2>
                    </motion.div>
                    {subtitle && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mt-2 text-xs font-mono text-utility-red tracking-widest uppercase"
                        >
                            {subtitle}
                        </motion.div>
                    )}
                </div>
            )}

            {/* Scanning Line Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-utility-red/10 to-transparent h-[20%] w-full animate-scan pointer-events-none" />

            {/* Corner Accents */}
            <svg className="absolute top-4 left-4 w-6 h-6 text-utility-red/50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M1 1h6M1 1v6" strokeWidth="2" />
            </svg>
            <svg className="absolute bottom-4 right-4 w-6 h-6 text-utility-red/50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M23 23h-6M23 23v-6" strokeWidth="2" />
            </svg>
        </div>
    );
}
