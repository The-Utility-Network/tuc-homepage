'use client';

import { motion } from 'framer-motion';

interface ChapterArtProps {
    chapterNumber: number;
    color: string;
}

// Chapter 1: Genesis - Big Bang creation spiral with particle explosion
const GenesisArt = ({ color }: { color: string }) => {
    const particles = [...Array(40)].map((_, i) => ({
        angle: (i * 9) * Math.PI / 180,
        distance: 20 + Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3
    }));

    return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
                <radialGradient id="genesis-core" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={color} stopOpacity="1" />
                    <stop offset="30%" stopColor={color} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </radialGradient>
                <filter id="genesis-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <motion.circle
                cx="200" cy="150" r="15"
                fill={color}
                filter="url(#genesis-glow)"
                animate={{ scale: [1, 1.3, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity }}
            />

            {[1, 2, 3, 4].map((ring) => (
                <motion.circle
                    key={`ring-${ring}`}
                    cx="200" cy="150"
                    r={30 + ring * 25}
                    stroke={color}
                    strokeWidth={0.5}
                    fill="none"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.5, 2] }}
                    transition={{ duration: 4, repeat: Infinity, delay: ring * 0.8 }}
                />
            ))}

            {[0, 1, 2].map((arm) => (
                <motion.path
                    key={`arm-${arm}`}
                    d={`M200,150 Q${200 + Math.cos(arm * 120 * Math.PI / 180) * 50},${150 + Math.sin(arm * 120 * Math.PI / 180) * 30} ${200 + Math.cos(arm * 120 * Math.PI / 180 + 0.5) * 100},${150 + Math.sin(arm * 120 * Math.PI / 180 + 0.5) * 70} T ${200 + Math.cos(arm * 120 * Math.PI / 180 + 1) * 130},${150 + Math.sin(arm * 120 * Math.PI / 180 + 1) * 95}`}
                    stroke={color}
                    strokeWidth="2"
                    fill="none"
                    opacity={0.6}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: arm * 0.3 }}
                />
            ))}

            {particles.map((p, i) => (
                <motion.circle
                    key={`particle-${i}`}
                    cx={200 + Math.cos(p.angle) * p.distance}
                    cy={150 + Math.sin(p.angle) * p.distance * 0.7}
                    r={p.size}
                    fill={color}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 0.8, 0],
                        scale: [0, 1, 0.5],
                        cx: [200, 200 + Math.cos(p.angle) * p.distance * 1.5],
                        cy: [150, 150 + Math.sin(p.angle) * p.distance * 1.2]
                    }}
                    transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
                />
            ))}
        </svg>
    );
};

// Chapter 2: Anarchosyndicalism - Dynamic network with pulsing connections
const NetworkArt = ({ color }: { color: string }) => {
    const nodes = [
        { x: 100, y: 60, size: 6 }, { x: 200, y: 40, size: 8 }, { x: 300, y: 60, size: 6 },
        { x: 50, y: 130, size: 5 }, { x: 140, y: 120, size: 7 }, { x: 200, y: 150, size: 12 },
        { x: 260, y: 120, size: 7 }, { x: 350, y: 130, size: 5 },
        { x: 80, y: 200, size: 6 }, { x: 160, y: 220, size: 5 }, { x: 200, y: 250, size: 7 },
        { x: 240, y: 220, size: 5 }, { x: 320, y: 200, size: 6 }
    ];

    const connections = [
        [0, 1], [1, 2], [0, 4], [1, 5], [2, 6], [3, 4], [4, 5], [5, 6], [6, 7],
        [3, 8], [4, 9], [5, 10], [6, 11], [7, 12], [8, 9], [9, 10], [10, 11], [11, 12],
        [0, 5], [2, 5], [5, 8], [5, 12], [4, 10], [6, 10]
    ];

    return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
                <filter id="network-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {connections.map(([from, to], i) => (
                <g key={`conn-${i}`}>
                    <line
                        x1={nodes[from].x} y1={nodes[from].y}
                        x2={nodes[to].x} y2={nodes[to].y}
                        stroke={color}
                        strokeWidth="1"
                        opacity="0.2"
                    />
                    <motion.line
                        x1={nodes[from].x} y1={nodes[from].y}
                        x2={nodes[to].x} y2={nodes[to].y}
                        stroke={color}
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: [0, 1, 0], opacity: [0, 0.8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                    />
                </g>
            ))}

            {nodes.map((node, i) => (
                <g key={`node-${i}`}>
                    <motion.circle
                        cx={node.x} cy={node.y}
                        r={node.size * 2}
                        fill={color}
                        opacity="0.1"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2 + i * 0.1, repeat: Infinity }}
                    />
                    <motion.circle
                        cx={node.x} cy={node.y}
                        r={node.size}
                        fill={color}
                        filter="url(#network-glow)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.08, type: "spring" }}
                    />
                </g>
            ))}

            <motion.circle
                cx={200} cy={150} r="20"
                stroke={color}
                strokeWidth="1"
                fill="none"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
            />
        </svg>
    );
};

// Chapter 3: Capabilities - Flourishing tree with blooming elements
const GrowthArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="trunk-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} stopOpacity="0.4" />
            </linearGradient>
            <filter id="leaf-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {["M200,280 Q180,290 150,285", "M200,280 Q220,290 250,285", "M200,280 Q190,295 170,300", "M200,280 Q210,295 230,300"].map((d, i) => (
            <motion.path key={`root-${i}`} d={d} stroke={color} strokeWidth="2" fill="none" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: i * 0.1 }} />
        ))}

        <motion.path d="M200,280 C195,240 205,200 200,160 C195,130 200,100 200,80" stroke="url(#trunk-grad)" strokeWidth="6" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />

        {[{ d: "M200,160 Q160,130 120,110", delay: 0.5 }, { d: "M200,160 Q240,130 280,110", delay: 0.6 }, { d: "M200,120 Q170,90 130,60", delay: 0.7 }, { d: "M200,120 Q230,90 270,60", delay: 0.8 }, { d: "M200,80 Q180,50 150,30", delay: 0.9 }, { d: "M200,80 Q220,50 250,30", delay: 1.0 }, { d: "M120,110 Q100,100 80,95", delay: 1.1 }, { d: "M280,110 Q300,100 320,95", delay: 1.2 }].map(({ d, delay }, i) => (
            <motion.path key={`branch-${i}`} d={d} stroke={color} strokeWidth={4 - i * 0.3} fill="none" strokeLinecap="round" opacity={0.7} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay }} />
        ))}

        {[{ x: 120, y: 110, size: 12 }, { x: 280, y: 110, size: 12 }, { x: 130, y: 60, size: 10 }, { x: 270, y: 60, size: 10 }, { x: 150, y: 30, size: 8 }, { x: 250, y: 30, size: 8 }, { x: 80, y: 95, size: 6 }, { x: 320, y: 95, size: 6 }, { x: 200, y: 45, size: 14 }].map((leaf, i) => (
            <motion.g key={`leaf-${i}`}>
                <motion.circle cx={leaf.x} cy={leaf.y} r={leaf.size} fill={color} filter="url(#leaf-glow)" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 0.8 }} transition={{ delay: 1.5 + i * 0.15, type: "spring" }} />
                <motion.circle cx={leaf.x} cy={leaf.y} r={leaf.size * 1.5} fill={color} opacity="0.2" animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.1, 0.2] }} transition={{ duration: 2 + i * 0.2, repeat: Infinity, delay: 2 + i * 0.1 }} />
            </motion.g>
        ))}
    </svg>
);

// Chapter 4: Process - Möbius strip representing eternal becoming
const ProcessArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="mobius-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="50%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0.8" />
            </linearGradient>
            <filter id="process-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <motion.path
            d="M80,150 C80,80 160,60 200,80 C240,100 280,100 320,80 C360,60 380,100 380,150 C380,200 340,240 280,220 C220,200 180,200 120,220 C60,240 20,200 20,150 C20,100 40,80 80,80"
            stroke="url(#mobius-grad)"
            strokeWidth="3"
            fill="none"
            filter="url(#process-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
        />

        <motion.circle cx="200" cy="150" r="20" fill={color} opacity="0.2" animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 3, repeat: Infinity }} />
        <motion.circle cx="200" cy="150" r="8" fill={color} opacity="0.6" />

        {[0, 120, 240].map((angle, i) => {
            const rad = angle * Math.PI / 180;
            return (
                <motion.path
                    key={`spiral-${i}`}
                    d={`M${200 + Math.cos(rad) * 40},${150 + Math.sin(rad) * 30} Q${200 + Math.cos(rad + 0.5) * 60},${150 + Math.sin(rad + 0.5) * 45} ${200 + Math.cos(rad + 1) * 80},${150 + Math.sin(rad + 1) * 55}`}
                    stroke={color}
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1 + i * 0.3, duration: 1 }}
                />
            );
        })}

        {[...Array(6)].map((_, i) => (
            <motion.circle
                key={`dot-${i}`}
                r="4"
                fill={color}
                animate={{
                    cx: [80, 200, 320, 200, 80],
                    cy: [150, 80, 150, 220, 150],
                    opacity: [0.8, 0.4, 0.8, 0.4, 0.8]
                }}
                transition={{ duration: 6, repeat: Infinity, delay: i * 1, ease: "linear" }}
            />
        ))}
    </svg>
);

// Chapter 5: Rhizome - Underground network with no center
const RhizomeArt = ({ color }: { color: string }) => {
    const nodes = [
        { x: 50, y: 80 }, { x: 120, y: 50 }, { x: 180, y: 90 },
        { x: 80, y: 150 }, { x: 160, y: 160 }, { x: 240, y: 140 },
        { x: 320, y: 100 }, { x: 350, y: 170 }, { x: 280, y: 200 },
        { x: 200, y: 230 }, { x: 120, y: 220 }, { x: 60, y: 250 },
        { x: 300, y: 260 }, { x: 380, y: 240 }, { x: 30, y: 180 }
    ];

    const connections = [
        [0, 1], [1, 2], [2, 6], [0, 3], [3, 4], [4, 5], [5, 6], [6, 7],
        [3, 10], [4, 9], [5, 8], [7, 8], [8, 9], [9, 10], [10, 11],
        [8, 12], [12, 13], [7, 13], [0, 14], [3, 14], [11, 14], [1, 4], [2, 5], [4, 8], [9, 12], [5, 9]
    ];

    return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
            {[{ x: 100, y: 100, r: 80 }, { x: 280, y: 160, r: 70 }, { x: 180, y: 220, r: 60 }].map((glow, i) => (
                <motion.circle key={`glow-${i}`} cx={glow.x} cy={glow.y} r={glow.r} fill={color} opacity="0.05" animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 4 + i, repeat: Infinity }} />
            ))}

            {connections.map(([from, to], i) => {
                const midX = (nodes[from].x + nodes[to].x) / 2 + (i % 2 === 0 ? 15 : -15);
                const midY = (nodes[from].y + nodes[to].y) / 2 + (i % 3 === 0 ? 10 : -10);
                return (
                    <motion.path key={`path-${i}`} d={`M${nodes[from].x},${nodes[from].y} Q${midX},${midY} ${nodes[to].x},${nodes[to].y}`} stroke={color} strokeWidth="1.5" fill="none" opacity="0.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: i * 0.06 }} />
                );
            })}

            {nodes.map((node, i) => (
                <motion.circle key={`node-${i}`} cx={node.x} cy={node.y} r={4 + (i % 4)} fill={color} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + i * 0.05, type: "spring" }} />
            ))}
        </svg>
    );
};

// Chapter 6: Economics - Balance scales with flowing value
const EconomicsArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <filter id="econ-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <motion.line x1="200" y1="60" x2="200" y2="240" stroke={color} strokeWidth="3" opacity="0.6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />

        <motion.g animate={{ rotate: [-3, 3, -3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} style={{ transformOrigin: "200px 100px" }}>
            <motion.line x1="80" y1="100" x2="320" y2="100" stroke={color} strokeWidth="4" filter="url(#econ-glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />

            <motion.line x1="100" y1="100" x2="80" y2="140" stroke={color} strokeWidth="1.5" opacity="0.7" />
            <motion.line x1="100" y1="100" x2="120" y2="140" stroke={color} strokeWidth="1.5" opacity="0.7" />
            <motion.ellipse cx="100" cy="150" rx="35" ry="12" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" animate={{ cy: [150, 155, 150] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />

            <motion.line x1="300" y1="100" x2="280" y2="140" stroke={color} strokeWidth="1.5" opacity="0.7" />
            <motion.line x1="300" y1="100" x2="320" y2="140" stroke={color} strokeWidth="1.5" opacity="0.7" />
            <motion.ellipse cx="300" cy="150" rx="35" ry="12" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.2" animate={{ cy: [150, 145, 150] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        </motion.g>

        <motion.polygon points="200,100 185,120 215,120" fill={color} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: "spring" }} />

        {[0, 1, 2, 3].map((i) => (
            <motion.circle key={`value-${i}`} r="6" fill={color} opacity="0.7" initial={{ cx: 100, cy: 140 }} animate={{ cx: [100, 150, 200, 250, 300, 250, 200, 150, 100], cy: [140, 80, 60, 80, 140, 80, 60, 80, 140] }} transition={{ duration: 8, repeat: Infinity, delay: i * 2, ease: "easeInOut" }} />
        ))}

        <motion.path d="M160,240 L200,220 L240,240 L200,260 Z" stroke={color} strokeWidth="2" fill={color} fillOpacity="0.3" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: "spring" }} />
    </svg>
);

// Chapter 7: Politics - Democratic hexagonal tessellation
const PoliticsArt = ({ color }: { color: string }) => {
    const hexPoints = (cx: number, cy: number, r: number) => [...Array(6)].map((_, i) => {
        const angle = (i * 60 - 30) * Math.PI / 180;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    }).join(' ');

    const hexes = [
        { x: 200, y: 150, r: 45, main: true },
        { x: 200, y: 72, r: 35 }, { x: 200, y: 228, r: 35 },
        { x: 133, y: 111, r: 35 }, { x: 267, y: 111, r: 35 },
        { x: 133, y: 189, r: 35 }, { x: 267, y: 189, r: 35 },
        { x: 66, y: 150, r: 25 }, { x: 334, y: 150, r: 25 }
    ];

    return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
                <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                </linearGradient>
            </defs>

            {[[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 3], [1, 4], [3, 5], [4, 6], [2, 5], [2, 6], [3, 7], [6, 8]].map(([from, to], i) => (
                <motion.line key={`link-${i}`} x1={hexes[from].x} y1={hexes[from].y} x2={hexes[to].x} y2={hexes[to].y} stroke={color} strokeWidth="1" opacity="0.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 + i * 0.05 }} />
            ))}

            {hexes.map((hex, i) => (
                <motion.g key={`hex-${i}`}>
                    <motion.polygon points={hexPoints(hex.x, hex.y, hex.r)} stroke={color} strokeWidth={hex.main ? 2 : 1} fill={hex.main ? "url(#hex-grad)" : "none"} opacity={hex.main ? 1 : 0.5} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: hex.main ? 1 : 0.5 }} transition={{ delay: i * 0.08, type: "spring" }} />
                    {hex.main && <motion.circle cx={hex.x} cy={hex.y} r="10" fill={color} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />}
                </motion.g>
            ))}
        </svg>
    );
};

// Chapter 8: Religion - Vesica Piscis / Flower of Life pattern
const ReligionArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <radialGradient id="spirit-center" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
            <filter id="spirit-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <circle cx="200" cy="150" r="120" fill="url(#spirit-center)" />

        <motion.circle cx="200" cy="150" r="40" stroke={color} strokeWidth="1.5" fill="none" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.8 }} />

        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = angle * Math.PI / 180;
            return (
                <motion.circle key={`flower-${i}`} cx={200 + Math.cos(rad) * 40} cy={150 + Math.sin(rad) * 40} r="40" stroke={color} strokeWidth="1" fill="none" opacity="0.6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }} />
            );
        })}

        <motion.circle cx="200" cy="150" r="85" stroke={color} strokeWidth="2" fill="none" opacity="0.4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, duration: 1 }} />

        <motion.polygon points="200,110 165,175 235,175" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.15" filter="url(#spirit-glow)" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 0.8, type: "spring" }} />

        <motion.circle cx="200" cy="150" r="8" fill={color} filter="url(#spirit-glow)" animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 3, repeat: Infinity }} />

        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rad = angle * Math.PI / 180;
            return (
                <motion.line key={`ray-${i}`} x1={200 + Math.cos(rad) * 90} y1={150 + Math.sin(rad) * 90} x2={200 + Math.cos(rad) * 110} y2={150 + Math.sin(rad) * 110} stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.5 + i * 0.08, duration: 0.5 }} />
            );
        })}
    </svg>
);

// Chapter 9: Horizon - Vanishing point with converging lines
const HorizonArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <radialGradient id="horizon-center" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="40%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
            <filter id="horizon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <motion.circle cx="200" cy="150" r="60" fill="url(#horizon-center)" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2 }} />

        <motion.circle cx="200" cy="150" r="12" fill={color} filter="url(#horizon-glow)" animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }} transition={{ duration: 2, repeat: Infinity }} />

        {[...Array(16)].map((_, i) => {
            const angle = (i * 22.5) * Math.PI / 180;
            return (
                <motion.line key={`line-${i}`} x1={200 + Math.cos(angle) * 20} y1={150 + Math.sin(angle) * 20} x2={200 + Math.cos(angle) * 180} y2={150 + Math.sin(angle) * 140} stroke={color} strokeWidth="1" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.1, duration: 1 }} />
            );
        })}

        {[...Array(12)].map((_, i) => {
            const angle = (i * 30 + 15) * Math.PI / 180;
            return (
                <motion.circle key={`particle-${i}`} r="3" fill={color} initial={{ cx: 200 + Math.cos(angle) * 160, cy: 150 + Math.sin(angle) * 120, opacity: 0, scale: 0.5 }} animate={{ cx: [200 + Math.cos(angle) * 160, 200 + Math.cos(angle) * 20], cy: [150 + Math.sin(angle) * 120, 150 + Math.sin(angle) * 20], opacity: [0, 0.8, 0], scale: [0.5, 1.5, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.4, ease: "easeIn" }} />
            );
        })}

        {[{ x: 50, y: 40, s: 2 }, { x: 120, y: 60, s: 1.5 }, { x: 80, y: 220, s: 2 }, { x: 350, y: 50, s: 1.5 }, { x: 320, y: 230, s: 2 }, { x: 370, y: 140, s: 1 }, { x: 30, y: 140, s: 1.5 }].map((star, i) => (
            <motion.circle key={`star-${i}`} cx={star.x} cy={star.y} r={star.s} fill={color} opacity="0.4" animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 2 + i * 0.3, repeat: Infinity }} />
        ))}
    </svg>
);

export default function ChapterArt({ chapterNumber, color }: ChapterArtProps) {
    const artComponents = [GenesisArt, NetworkArt, GrowthArt, ProcessArt, RhizomeArt, EconomicsArt, PoliticsArt, ReligionArt, HorizonArt];
    const ArtComponent = artComponents[chapterNumber - 1] || GenesisArt;

    return (
        <motion.div
            className="w-full h-64 md:h-80 flex items-center justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
        >
            <div className="w-full max-w-xl">
                <ArtComponent color={color} />
            </div>
        </motion.div>
    );
}
