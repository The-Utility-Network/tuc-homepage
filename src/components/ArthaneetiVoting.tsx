'use client';

import { motion } from 'framer-motion';

export default function ArthaneetiVoting() {
    const color = '#3B82F6'; // Civic Blue
    const highlight = '#60A5FA';

    return (
        <div className="w-full h-full flex items-center justify-center min-h-[350px] bg-black/20 rounded-xl overflow-hidden relative">
            <svg viewBox="0 0 600 400" className="w-full h-full max-w-[600px]">

                {/* Central DAO Hub */}
                <motion.g transform="translate(300, 200)">
                    <motion.circle
                        r="60"
                        stroke={color}
                        strokeWidth="4"
                        fill="rgba(59, 130, 246, 0.1)"
                        animate={{
                            boxShadow: `0 0 30px ${color}`,
                            strokeWidth: [4, 6, 4]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    {/* Inner pulsing core */}
                    <motion.circle
                        r="40"
                        fill={color}
                        opacity="0.3"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <text x="0" y="5" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">DAO</text>
                </motion.g>

                {/* Incoming Votes (Particles) */}
                {[...Array(6)].map((_, i) => (
                    <motion.circle
                        key={i}
                        r="6"
                        fill={highlight}
                        initial={{ opacity: 0 }}
                        animate={{
                            x: [Math.cos(i) * 200 + 300, 300],
                            y: [Math.sin(i) * 200 + 200, 200],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            delay: i * 0.3,
                            repeat: Infinity,
                            ease: "easeIn"
                        }}
                    />
                ))}

                {/* Execution Output (Law Scroll) */}
                <motion.g transform="translate(300, 320)">
                    <motion.rect
                        x="-40" y="0" width="80" height="10" rx="2" fill={color}
                        initial={{ width: 0, x: 0 }}
                        animate={{ width: 80, x: -40 }}
                        transition={{ duration: 1, delay: 2, repeat: Infinity, repeatDelay: 2 }}
                    />
                    <motion.path
                        d="M -30 20 L 30 20" stroke={color} strokeWidth="2" strokeDasharray="5 5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 2.5, repeat: Infinity, repeatDelay: 2.5 }}
                    />
                    <text x="0" y="40" textAnchor="middle" fill={highlight} fontSize="12">POLICY EXECUTED</text>
                </motion.g>

                {/* Proposal Document (Left) */}
                <motion.g transform="translate(100, 200)">
                    <rect x="-30" y="-40" width="60" height="80" stroke={color} fill="none" rx="5" />
                    <line x1="-20" y1="-20" x2="20" y2="-20" stroke={color} strokeWidth="2" />
                    <line x1="-20" y1="0" x2="10" y2="0" stroke={color} strokeWidth="2" />
                    <line x1="-20" y1="20" x2="0" y2="20" stroke={color} strokeWidth="2" />
                    <text x="0" y="55" textAnchor="middle" fill={color} fontSize="10">PROPOSAL</text>

                    {/* Arrow to DAO */}
                    <motion.path
                        d="M 40 0 L 130 0" stroke={color} strokeWidth="2" markerEnd="url(#arrowhead)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </motion.g>

                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill={color} />
                    </marker>
                </defs>

            </svg>
        </div>
    );
}
