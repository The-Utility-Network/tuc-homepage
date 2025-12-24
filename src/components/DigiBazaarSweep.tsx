'use client';

import { motion } from 'framer-motion';

export default function DigiBazaarSweep() {
    const color = '#EF4444'; // Marketplace Red
    const cardColors = ['#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

    return (
        <div className="w-full h-full flex items-center justify-center min-h-[400px] bg-black/20 rounded-xl overflow-hidden relative">
            <svg viewBox="0 0 600 400" className="w-full h-full max-w-[600px]">

                {/* Marketplace Shelf (Left) */}
                <text x="100" y="350" textAnchor="middle" fill="#555" fontSize="12">MARKETPLACE</text>
                <line x1="20" y1="330" x2="180" y2="330" stroke="#333" strokeWidth="4" />

                {/* Wallet/Collection Bin (Right) */}
                <motion.g transform="translate(450, 280)">
                    <path d="M -40 0 L -40 50 L 40 50 L 40 0" fill="none" stroke={color} strokeWidth="4" />
                    <text x="0" y="70" textAnchor="middle" fill={color} fontSize="12" fontWeight="bold">COLLECTION</text>
                    {/* Glow effect */}
                    <motion.rect x="-45" y="-10" width="90" height="70" fill={color} opacity="0.1"
                        animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 0.5, repeat: Infinity }}
                    />
                </motion.g>

                {/* Sweeping Cards */}
                {[0, 1, 2, 3].map((i) => (
                    <motion.g key={i}>
                        <motion.rect
                            width="40" height="60" rx="4"
                            fill={cardColors[i % cardColors.length]}
                            stroke="#fff" strokeWidth="2"
                            initial={{ x: 50 + i * 20, y: 260, rotate: i * 5, opacity: 1, scale: 1 }}
                            animate={{
                                x: [null, 450, 450],
                                y: [null, 200, 300],
                                rotate: [null, 360, 0],
                                scale: [1, 1.2, 0.5],
                                opacity: [1, 1, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                delay: i * 0.5,
                                repeat: Infinity,
                                repeatDelay: 2,
                                times: [0, 0.7, 1],
                                ease: "easeInOut"
                            }}
                        />
                        <motion.text
                            fill="#000" fontSize="20" x={70 + i * 20} y={300} textAnchor="middle" fontWeight="bold"
                            animate={{
                                x: [null, 470, 470],
                                y: [null, 240, 340],
                                opacity: [1, 0]
                            }}
                            transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity, repeatDelay: 2 }}
                        >
                            $2
                        </motion.text>
                    </motion.g>
                ))}

                {/* "The Sweep" Wind Effect */}
                <motion.path
                    d="M 150 200 Q 300 150 450 200"
                    stroke={color} strokeWidth="4" fill="none" opacity="0.5" strokeDasharray="10 10"
                    animate={{ d: ["M 150 200 Q 300 250 450 200", "M 150 200 Q 300 150 450 200"] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                />
                <motion.path
                    d="M 150 220 Q 300 170 450 220"
                    stroke={color} strokeWidth="2" fill="none" opacity="0.3"
                    animate={{ d: ["M 150 220 Q 300 270 450 220", "M 150 220 Q 300 170 450 220"] }}
                    transition={{ duration: 0.5, delay: 0.1, repeat: Infinity }}
                />

                <text x="300" y="100" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold" letterSpacing="0.2em" opacity="0.8">
                    SWEEP THE FLOOR
                </text>

            </svg>
        </div>
    );
}
