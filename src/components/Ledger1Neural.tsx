'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Ledger1Neural() {
    const color = '#DC2626'; // Cyber Red
    const [nodes, setNodes] = useState<{ x: number, y: number }[]>([]);

    useEffect(() => {
        // Generate random nodes largely centered
        const newNodes = Array.from({ length: 12 }).map(() => ({
            x: 100 + Math.random() * 400,
            y: 50 + Math.random() * 300
        }));
        setNodes(newNodes);
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center min-h-[400px] bg-black/20 rounded-xl overflow-hidden relative">
            <svg viewBox="0 0 600 400" className="w-full h-full max-w-[600px]">

                {/* Connections */}
                {nodes.map((node, i) => (
                    nodes.slice(i + 1).map((target, j) => {
                        const dist = Math.hypot(node.x - target.x, node.y - target.y);
                        if (dist > 150) return null; // Only connect close nodes
                        return (
                            <motion.line
                                key={`${i}-${j}`}
                                x1={node.x} y1={node.y}
                                x2={target.x} y2={target.y}
                                stroke={color}
                                strokeWidth="1"
                                opacity="0.2"
                                animate={{ opacity: [0.1, 0.4, 0.1] }}
                                transition={{ duration: 2 + Math.random(), repeat: Infinity }}
                            />
                        );
                    })
                ))}

                {/* Active Data Packets (Synapses) */}
                {nodes.map((node, i) => {
                    const target = nodes[(i + 1) % nodes.length];
                    return (
                        <motion.circle
                            key={`p-${i}`}
                            r="3"
                            fill="#fff"
                        >
                            <animateMotion
                                path={`M ${node.x} ${node.y} L ${target.x} ${target.y}`}
                                dur={`${1 + Math.random() * 2}s`}
                                repeatCount="indefinite"
                            />
                        </motion.circle>
                    )
                })}

                {/* Nodes */}
                {nodes.map((node, i) => (
                    <motion.g key={`n-${i}`} transform={`translate(${node.x}, ${node.y})`}>
                        <motion.circle
                            r="6"
                            fill={color}
                            animate={{ scale: [1, 1.5, 1], fill: [color, '#ff0000', color] }}
                            transition={{ duration: 1.5, delay: Math.random(), repeat: Infinity }}
                        />
                        <motion.circle
                            r="12"
                            stroke={color}
                            strokeWidth="1"
                            fill="none"
                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                            transition={{ duration: 2, delay: Math.random(), repeat: Infinity }}
                        />
                    </motion.g>
                ))}

                {/* Central Brain Text */}
                <text x="300" y="380" textAnchor="middle" fill={color} fontSize="14" fontStyle="italic" opacity="0.8">
                    NEUROMIMETIC ARCHITECTURE
                </text>

            </svg>
        </div>
    );
}
