'use client';

import { motion } from 'framer-motion';

interface ChapterArtProps {
    chapterNumber: number;
    color: string;
}

// Chapter 1: Crisis - Crumbling pillars with particles falling
const CrisisArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="pillar-grad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} stopOpacity="0.2" />
            </linearGradient>
            <filter id="crisis-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Crumbling pillars */}
        {[80, 160, 240, 320].map((x, i) => (
            <motion.g key={`pillar-${i}`}>
                <motion.rect
                    x={x - 15}
                    y={100 + i * 10}
                    width="30"
                    height={180 - i * 10}
                    fill="url(#pillar-grad)"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 0.6 - i * 0.1, y: 0 }}
                    transition={{ delay: i * 0.2, duration: 0.8 }}
                />
                {/* Falling debris */}
                {[...Array(4)].map((_, j) => (
                    <motion.rect
                        key={`debris-${i}-${j}`}
                        x={x - 10 + j * 5}
                        y={90}
                        width={4}
                        height={4}
                        fill={color}
                        initial={{ y: 0, opacity: 0.8 }}
                        animate={{ y: [0, 100, 150], opacity: [0.8, 0.5, 0], rotate: [0, 180, 360] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 + j * 0.3 }}
                    />
                ))}
            </motion.g>
        ))}

        {/* Cracks */}
        <motion.path
            d="M60,150 L100,160 L80,200 L120,180 L100,230"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
        />
        <motion.path
            d="M300,140 L340,155 L320,190 L360,175"
            stroke={color}
            strokeWidth="1.5"
            fill="none"
            opacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.3 }}
        />
    </svg>
);

// Chapter 2: Definition - Network nodes forming a state shape
const DefinitionArt = ({ color }: { color: string }) => {
    const nodes = [
        { x: 200, y: 60, size: 10 }, { x: 120, y: 100, size: 8 }, { x: 280, y: 100, size: 8 },
        { x: 80, y: 160, size: 6 }, { x: 160, y: 150, size: 9 }, { x: 240, y: 150, size: 9 }, { x: 320, y: 160, size: 6 },
        { x: 100, y: 220, size: 7 }, { x: 200, y: 200, size: 12 }, { x: 300, y: 220, size: 7 },
        { x: 150, y: 260, size: 5 }, { x: 250, y: 260, size: 5 }
    ];
    const connections = [
        [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6], [3, 7], [4, 8], [5, 8], [6, 9],
        [7, 10], [8, 10], [8, 11], [9, 11], [1, 8], [2, 8], [4, 5]
    ];

    return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
                <filter id="def-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {connections.map(([from, to], i) => (
                <motion.line
                    key={`conn-${i}`}
                    x1={nodes[from].x} y1={nodes[from].y}
                    x2={nodes[to].x} y2={nodes[to].y}
                    stroke={color}
                    strokeWidth="1.5"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.08 }}
                />
            ))}

            {nodes.map((node, i) => (
                <motion.g key={`node-${i}`}>
                    <motion.circle
                        cx={node.x} cy={node.y}
                        r={node.size * 1.5}
                        fill={color}
                        opacity="0.15"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2 + i * 0.2, repeat: Infinity }}
                    />
                    <motion.circle
                        cx={node.x} cy={node.y}
                        r={node.size}
                        fill={color}
                        filter="url(#def-glow)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                    />
                </motion.g>
            ))}
        </svg>
    );
};

// Chapter 3: Implementation - Gears and cogs turning
const ImplementationArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <filter id="impl-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Large central gear */}
        <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "200px 150px" }}
        >
            <circle cx="200" cy="150" r="50" stroke={color} strokeWidth="3" fill="none" opacity="0.6" />
            {[...Array(12)].map((_, i) => {
                const angle = (i * 30) * Math.PI / 180;
                return (
                    <rect
                        key={`tooth-${i}`}
                        x={195 + Math.cos(angle) * 50}
                        y={145 + Math.sin(angle) * 50}
                        width="10"
                        height="10"
                        fill={color}
                        opacity="0.6"
                        transform={`rotate(${i * 30}, ${200 + Math.cos(angle) * 50}, ${150 + Math.sin(angle) * 50})`}
                    />
                );
            })}
            <circle cx="200" cy="150" r="15" fill={color} opacity="0.4" />
        </motion.g>

        {/* Smaller gears */}
        <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "290px 100px" }}
        >
            <circle cx="290" cy="100" r="30" stroke={color} strokeWidth="2" fill="none" opacity="0.5" />
            {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * Math.PI / 180;
                return (
                    <rect
                        key={`tooth2-${i}`}
                        x={287 + Math.cos(angle) * 30}
                        y={97 + Math.sin(angle) * 30}
                        width="6"
                        height="6"
                        fill={color}
                        opacity="0.5"
                    />
                );
            })}
        </motion.g>

        <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "110px 200px" }}
        >
            <circle cx="110" cy="200" r="35" stroke={color} strokeWidth="2" fill="none" opacity="0.5" />
            {[...Array(10)].map((_, i) => {
                const angle = (i * 36) * Math.PI / 180;
                return (
                    <rect
                        key={`tooth3-${i}`}
                        x={107 + Math.cos(angle) * 35}
                        y={197 + Math.sin(angle) * 35}
                        width="6"
                        height="6"
                        fill={color}
                        opacity="0.5"
                    />
                );
            })}
        </motion.g>
    </svg>
);

// Chapter 4: The Sovereign Stack - Stacked layers with connections
const StackArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="stack-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="50%" stopColor={color} stopOpacity="0.6" />
                <stop offset="100%" stopColor={color} stopOpacity="0.3" />
            </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4, 5].map((layer, i) => (
            <motion.g key={`layer-${i}`}>
                <motion.path
                    d={`M${100 + i * 5},${60 + i * 40} L${200},${40 + i * 40} L${300 - i * 5},${60 + i * 40} L${200},${80 + i * 40} Z`}
                    fill="url(#stack-grad)"
                    stroke={color}
                    strokeWidth="1.5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                />
                <motion.line
                    x1={200} y1={80 + i * 40}
                    x2={200} y2={100 + i * 40}
                    stroke={color}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.15 + 0.3, duration: 0.4 }}
                />
            </motion.g>
        ))}

        {/* Pulsing data points */}
        {[60, 100, 140, 180, 220].map((y, i) => (
            <motion.circle
                key={`pulse-${i}`}
                cx={200}
                cy={y}
                r="3"
                fill={color}
                animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            />
        ))}
    </svg>
);

// Chapter 5: Governance - Hexagonal democracy pattern
const GovernanceArt = ({ color }: { color: string }) => {
    const hexPoints = (cx: number, cy: number, r: number) =>
        [...Array(6)].map((_, i) => {
            const angle = (i * 60 - 30) * Math.PI / 180;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        }).join(' ');

    const hexes = [
        { x: 200, y: 150, r: 45, main: true },
        { x: 200, y: 72, r: 32 }, { x: 200, y: 228, r: 32 },
        { x: 133, y: 111, r: 32 }, { x: 267, y: 111, r: 32 },
        { x: 133, y: 189, r: 32 }, { x: 267, y: 189, r: 32 }
    ];

    return (
        <svg viewBox="0 0 400 300" className="w-full h-full">
            <defs>
                <linearGradient id="gov-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.1" />
                </linearGradient>
            </defs>

            {[[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 3], [1, 4], [2, 5], [2, 6], [3, 5], [4, 6]].map(([from, to], i) => (
                <motion.line
                    key={`link-${i}`}
                    x1={hexes[from].x} y1={hexes[from].y}
                    x2={hexes[to].x} y2={hexes[to].y}
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                />
            ))}

            {hexes.map((hex, i) => (
                <motion.g key={`hex-${i}`}>
                    <motion.polygon
                        points={hexPoints(hex.x, hex.y, hex.r)}
                        stroke={color}
                        strokeWidth={hex.main ? 2.5 : 1.5}
                        fill={hex.main ? "url(#gov-grad)" : "none"}
                        opacity={hex.main ? 1 : 0.6}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: hex.main ? 1 : 0.6 }}
                        transition={{ delay: i * 0.1, type: "spring" }}
                    />
                    {hex.main && (
                        <motion.circle
                            cx={hex.x} cy={hex.y} r="12"
                            fill={color}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    )}
                </motion.g>
            ))}
        </svg>
    );
};

// Chapter 6: Economics - Flowing value streams
const EconomicsArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <linearGradient id="econ-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0" />
                <stop offset="50%" stopColor={color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
        </defs>

        {/* Central hub */}
        <motion.circle
            cx="200" cy="150" r="30"
            fill={color}
            opacity="0.3"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle cx="200" cy="150" r="15" fill={color} opacity="0.6" />

        {/* Flowing streams */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = angle * Math.PI / 180;
            const endX = 200 + Math.cos(rad) * 120;
            const endY = 150 + Math.sin(rad) * 100;

            return (
                <motion.g key={`stream-${i}`}>
                    <motion.path
                        d={`M200,150 Q${200 + Math.cos(rad) * 60},${150 + Math.sin(rad) * 50} ${endX},${endY}`}
                        stroke={color}
                        strokeWidth="2"
                        fill="none"
                        opacity="0.4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: i * 0.15 }}
                    />
                    <motion.circle
                        r="6"
                        fill={color}
                        initial={{ cx: 200, cy: 150 }}
                        animate={{
                            cx: [200, 200 + Math.cos(rad) * 60, endX],
                            cy: [150, 150 + Math.sin(rad) * 50, endY],
                            opacity: [0.8, 0.6, 0]
                        }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                    />
                    <motion.circle
                        cx={endX} cy={endY} r="10"
                        fill={color}
                        opacity="0.3"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + i * 0.1, type: "spring" }}
                    />
                </motion.g>
            );
        })}
    </svg>
);

// Chapter 7: Physical - Archipelago of islands
const PhysicalArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Islands */}
        {[
            { x: 80, y: 100, r: 25 }, { x: 180, y: 80, r: 20 }, { x: 300, y: 90, r: 30 },
            { x: 120, y: 180, r: 22 }, { x: 220, y: 160, r: 35 }, { x: 320, y: 180, r: 18 },
            { x: 160, y: 240, r: 20 }, { x: 280, y: 250, r: 25 }
        ].map((island, i) => (
            <motion.g key={`island-${i}`}>
                <motion.ellipse
                    cx={island.x} cy={island.y}
                    rx={island.r} ry={island.r * 0.6}
                    fill={color}
                    opacity="0.3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.12, type: "spring" }}
                />
                <motion.circle
                    cx={island.x} cy={island.y - 5}
                    r={island.r * 0.4}
                    fill={color}
                    opacity="0.6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.12 + 0.1, type: "spring" }}
                />
            </motion.g>
        ))}

        {/* Connecting lines */}
        {[[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [3, 6], [4, 7], [5, 7], [6, 7]].map(([from, to], i) => {
            const islands = [
                { x: 80, y: 100 }, { x: 180, y: 80 }, { x: 300, y: 90 },
                { x: 120, y: 180 }, { x: 220, y: 160 }, { x: 320, y: 180 },
                { x: 160, y: 240 }, { x: 280, y: 250 }
            ];
            return (
                <motion.line
                    key={`conn-${i}`}
                    x1={islands[from].x} y1={islands[from].y}
                    x2={islands[to].x} y2={islands[to].y}
                    stroke={color}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1 + i * 0.1 }}
                />
            );
        })}
    </svg>
);

// Chapter 8: Legal - Scales of justice with code
const LegalArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Central pillar */}
        <motion.line
            x1="200" y1="60" x2="200" y2="250"
            stroke={color}
            strokeWidth="3"
            opacity="0.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
        />

        {/* Balance beam */}
        <motion.g
            animate={{ rotate: [-2, 2, -2] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "200px 80px" }}
        >
            <motion.line
                x1="100" y1="80" x2="300" y2="80"
                stroke={color}
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2 }}
            />

            {/* Left scale */}
            <motion.line x1="120" y1="80" x2="100" y2="130" stroke={color} strokeWidth="1.5" opacity="0.7" />
            <motion.line x1="120" y1="80" x2="140" y2="130" stroke={color} strokeWidth="1.5" opacity="0.7" />
            <motion.ellipse
                cx="120" cy="140" rx="30" ry="10"
                stroke={color}
                strokeWidth="2"
                fill={color}
                fillOpacity="0.2"
            />
            {/* Code symbols */}
            <motion.text x="110" y="145" fill={color} fontSize="12" opacity="0.8">{'{ }'}</motion.text>

            {/* Right scale */}
            <motion.line x1="280" y1="80" x2="260" y2="130" stroke={color} strokeWidth="1.5" opacity="0.7" />
            <motion.line x1="280" y1="80" x2="300" y2="130" stroke={color} strokeWidth="1.5" opacity="0.7" />
            <motion.ellipse
                cx="280" cy="140" rx="30" ry="10"
                stroke={color}
                strokeWidth="2"
                fill={color}
                fillOpacity="0.2"
            />
            <motion.text x="270" y="145" fill={color} fontSize="12" opacity="0.8">{'< >'}</motion.text>
        </motion.g>

        {/* Base */}
        <motion.path
            d="M160,250 L200,230 L240,250 L200,270 Z"
            stroke={color}
            strokeWidth="2"
            fill={color}
            fillOpacity="0.3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
        />
    </svg>
);

// Chapter 9: Roadmap - Path with milestones
const RoadmapArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        {/* Winding path */}
        <motion.path
            d="M50,250 Q100,200 150,220 T250,180 T350,120 T380,50"
            stroke={color}
            strokeWidth="3"
            fill="none"
            opacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3 }}
        />

        {/* Milestones */}
        {[
            { x: 50, y: 250, label: "I" },
            { x: 150, y: 220, label: "II" },
            { x: 250, y: 180, label: "III" },
            { x: 350, y: 120, label: "IV" }
        ].map((milestone, i) => (
            <motion.g key={`milestone-${i}`}>
                <motion.circle
                    cx={milestone.x} cy={milestone.y}
                    r="20"
                    fill={color}
                    opacity="0.3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.5 + 0.5, type: "spring" }}
                />
                <motion.circle
                    cx={milestone.x} cy={milestone.y}
                    r="12"
                    fill={color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.5 + 0.7, type: "spring" }}
                />
                <motion.text
                    x={milestone.x} y={milestone.y + 4}
                    textAnchor="middle"
                    fill="black"
                    fontSize="10"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.5 + 0.9 }}
                >
                    {milestone.label}
                </motion.text>
            </motion.g>
        ))}

        {/* Traveling point */}
        <motion.circle
            r="6"
            fill={color}
            animate={{
                cx: [50, 150, 250, 350],
                cy: [250, 220, 180, 120]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
    </svg>
);

// Chapter 10: Invitation - Open door with light
const InvitationArt = ({ color }: { color: string }) => (
    <svg viewBox="0 0 400 300" className="w-full h-full">
        <defs>
            <radialGradient id="light-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="50%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
            <filter id="invite-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        {/* Light emanating */}
        <motion.ellipse
            cx="200" cy="150"
            rx="120" ry="100"
            fill="url(#light-grad)"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Door frame */}
        <motion.path
            d="M140,260 L140,80 L260,80 L260,260"
            stroke={color}
            strokeWidth="4"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
        />

        {/* Opening door */}
        <motion.path
            d="M260,260 L260,80 L220,100 L220,240 Z"
            fill={color}
            opacity="0.4"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: [1, 0.3, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "260px 150px" }}
        />

        {/* Light rays */}
        {[...Array(8)].map((_, i) => {
            const angle = (i * 22.5 - 90) * Math.PI / 180;
            return (
                <motion.line
                    key={`ray-${i}`}
                    x1={200 + Math.cos(angle) * 40}
                    y1={150 + Math.sin(angle) * 40}
                    x2={200 + Math.cos(angle) * 100}
                    y2={150 + Math.sin(angle) * 80}
                    stroke={color}
                    strokeWidth="2"
                    opacity="0.3"
                    filter="url(#invite-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                />
            );
        })}

        {/* Central star */}
        <motion.circle
            cx="200" cy="150"
            r="15"
            fill={color}
            filter="url(#invite-glow)"
            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
        />
    </svg>
);

export default function ChapterArt({ chapterNumber, color }: ChapterArtProps) {
    const artComponents = [
        CrisisArt, DefinitionArt, ImplementationArt, StackArt, GovernanceArt,
        EconomicsArt, PhysicalArt, LegalArt, RoadmapArt, InvitationArt
    ];
    const ArtComponent = artComponents[chapterNumber - 1] || CrisisArt;

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
