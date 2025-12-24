'use client';

import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Theme
const PURPLE = '#A855F7';
const PINK = '#ff2a6d';

// Base facets (immutable - minimum of 4)
const BASE_FACETS = [
    {
        name: 'Main Contract',
        address: '0x1234...5678',
        reads: ['getOwner', 'getBalance', 'getMetadata'],
        writes: ['initialize', 'setConfig'],
        isBase: true,
    },
    {
        name: 'Treasury Facet',
        address: '0x2345...6789',
        reads: ['getTreasuryBalance', 'getAllocations'],
        writes: ['deposit', 'withdraw', 'allocate'],
        isBase: true,
    },
    {
        name: 'Governance Facet',
        address: '0x3456...789a',
        reads: ['getProposals', 'getVotes', 'getQuorum'],
        writes: ['propose', 'vote', 'execute'],
        isBase: true,
    },
    {
        name: 'Compliance Facet',
        address: '0x4567...89ab',
        reads: ['getAuditLog', 'getReports'],
        writes: ['submitReport', 'attestCompliance'],
        isBase: true,
    },
];

// Dummy outputs for demo
const DUMMY_OUTPUTS: { [key: string]: string } = {
    getOwner: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    getBalance: '1,247,500 USDC',
    getMetadata: '{ "version": "2.1.0", "upgraded": "2024-12-15" }',
    getTreasuryBalance: '45,230,000 USDC',
    getAllocations: '[ Operations: 40%, Reserve: 35%, Growth: 25% ]',
    getProposals: '12 active proposals',
    getVotes: '{ "for": 847, "against": 123, "abstain": 45 }',
    getQuorum: '51% (currently at 67%)',
    getAuditLog: '[ ...last 50 entries ]',
    getReports: 'Q4 2024 Compliance: PASSED',
};

type Facet = {
    name: string;
    address: string;
    reads: string[];
    writes: string[];
    isBase: boolean;
};

function Node({ position, color, onClick, isSelected, size = 0.055 }: {
    position: [number, number, number];
    color: string;
    onClick: () => void;
    isSelected?: boolean;
    size?: number
}) {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ref.current) {
            const scale = isSelected ? 1.4 : 1 + Math.sin(state.clock.elapsedTime * 2 + position[0] * 5) * 0.1;
            ref.current.scale.setScalar(scale);
        }
    });
    return (
        <mesh ref={ref} position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial
                color={color}
                emissive={new THREE.Color(color)}
                emissiveIntensity={isSelected ? 1.2 : 0.5}
                toneMapped={false}
            />
        </mesh>
    );
}

function Ring({
    z, radius, color, reads, writes, facetIndex, currentIndex, onSelect, selectedMethod, isOverview
}: {
    z: number;
    radius: number;
    color: string;
    reads: string[];
    writes: string[];
    facetIndex: number;
    currentIndex: number;
    onSelect: (method: string, type: 'read' | 'write') => void;
    selectedMethod: string | null;
    isOverview: boolean;
}) {
    const isFocused = facetIndex === currentIndex && !isOverview;
    const total = reads.length + writes.length;

    const nodes = useMemo(() => {
        const items: { method: string; type: 'read' | 'write'; pos: [number, number, number] }[] = [];
        const allMethods = [
            ...reads.map(m => ({ method: m, type: 'read' as const })),
            ...writes.map(m => ({ method: m, type: 'write' as const })),
        ];
        allMethods.forEach((m, i) => {
            const angle = (i / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
            items.push({
                ...m,
                pos: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0],
            });
        });
        return items;
    }, [reads, writes, radius, total]);

    return (
        <group position={[0, 0, z]}>
            {/* Ring torus */}
            <mesh>
                <torusGeometry args={[radius, 0.006, 16, 64]} />
                <meshBasicMaterial color={color} opacity={isFocused ? 0.9 : isOverview ? 0.6 : 0.2} transparent />
            </mesh>
            {/* Glow when focused */}
            {isFocused && (
                <mesh>
                    <torusGeometry args={[radius, 0.02, 16, 64]} />
                    <meshBasicMaterial color={color} opacity={0.3} transparent blending={THREE.AdditiveBlending} />
                </mesh>
            )}
            {/* Method nodes */}
            {nodes.map((node, i) => (
                <Node
                    key={`${node.method}-${i}`}
                    position={node.pos}
                    color={node.type === 'read' ? PURPLE : PINK}
                    onClick={() => onSelect(node.method, node.type)}
                    isSelected={selectedMethod === node.method}
                    size={isFocused ? 0.055 : isOverview ? 0.04 : 0.035}
                />
            ))}
        </group>
    );
}

function Spine({ length }: { length: number }) {
    return (
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -length / 2]}>
            <cylinderGeometry args={[0.012, 0.012, length, 12]} />
            <meshBasicMaterial color={PURPLE} opacity={0.25} transparent />
        </mesh>
    );
}

function CameraController({ targetZ, isOverview, facetCount, spineLength }: { targetZ: number; isOverview: boolean; facetCount: number; spineLength: number }) {
    const { camera } = useThree();
    useFrame(() => {
        if (isOverview) {
            // Side view - calculate distance to fit entire structure
            // The structure spans from z=0 to z=-spineLength
            // We need to position camera far enough to see it all
            const structureCenter = -spineLength / 2;
            const structureHeight = 0.65 * 2; // ring diameter
            const structureDepth = spineLength;

            // Calculate required distance to fit structure in view
            // Using basic FOV calculation: distance = size / (2 * tan(fov/2))
            const fov = 42;
            const fovRad = (fov * Math.PI) / 180;
            const requiredDistance = Math.max(structureDepth, structureHeight) / (2 * Math.tan(fovRad / 2));

            // Position camera to the side, looking at center
            const desiredX = requiredDistance * 0.9;
            const desiredY = 0.2;
            const desiredZ = structureCenter;

            camera.position.x += (desiredX - camera.position.x) * 0.08;
            camera.position.y += (desiredY - camera.position.y) * 0.08;
            camera.position.z += (desiredZ - camera.position.z) * 0.08;
            camera.lookAt(0, 0, structureCenter);
        } else {
            // Normal view - perfectly centered tunnel into facets
            const desiredZ = targetZ + 2.5;
            camera.position.z += (desiredZ - camera.position.z) * 0.1;
            camera.position.x += (0 - camera.position.x) * 0.1;
            camera.position.y += (0 - camera.position.y) * 0.1; // Perfectly centered at y=0
            camera.lookAt(0, 0, targetZ);
        }
    });
    return null;
}

export default function DiamondMini() {
    const [facets, setFacets] = useState<Facet[]>([...BASE_FACETS]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selection, setSelection] = useState<{ method: string; type: 'read' | 'write' } | null>(null);
    const [output, setOutput] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [isOverview, setIsOverview] = useState(true);
    const [customFacetCount, setCustomFacetCount] = useState(0);
    const [customMethodCount, setCustomMethodCount] = useState(0);

    const rings = useMemo(() => {
        const spacing = 0.7;
        const radius = 0.65;
        return facets.map((facet, i) => ({
            z: i * -spacing,
            radius,
            color: PURPLE,
            ...facet,
        }));
    }, [facets]);

    const ringZ = rings.map(r => r.z);
    const currentFacet = facets[currentIndex];
    const spineLength = Math.max(2.5, facets.length * 0.7);

    const handleSelect = (method: string, type: 'read' | 'write') => {
        if (isOverview) {
            setIsOverview(false);
            return;
        }
        setSelection({ method, type });
        setOutput(null);
    };

    const runDemo = () => {
        if (!selection) return;
        setBusy(true);
        setOutput(null);
        setTimeout(() => {
            if (selection.type === 'read') {
                setOutput(DUMMY_OUTPUTS[selection.method] || `Result of ${selection.method}()`);
            } else {
                setOutput(`✓ Transaction submitted\nHash: 0x${Math.random().toString(16).slice(2, 10)}...`);
            }
            setBusy(false);
        }, 600);
    };

    const toggleView = () => {
        setIsOverview(!isOverview);
        if (!isOverview) {
            setSelection(null);
            setOutput(null);
        }
    };

    // Facet management
    const addFacet = () => {
        const newCount = customFacetCount + 1;
        setCustomFacetCount(newCount);
        const newFacet: Facet = {
            name: `Custom Facet ${newCount}`,
            address: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
            reads: ['customRead'],
            writes: ['customWrite'],
            isBase: false,
        };
        setFacets([...facets, newFacet]);
    };

    const removeFacet = () => {
        if (facets.length <= 4) return; // Keep minimum 4
        const lastFacet = facets[facets.length - 1];
        if (lastFacet.isBase) return; // Can't remove base facets
        setFacets(facets.slice(0, -1));
        if (currentIndex >= facets.length - 1) {
            setCurrentIndex(facets.length - 2);
        }
    };

    // Method management for current facet
    const addMethod = (type: 'read' | 'write') => {
        if (currentFacet.isBase) return;
        const newCount = customMethodCount + 1;
        setCustomMethodCount(newCount);
        const methodName = type === 'read' ? `customRead_${newCount}` : `customWrite_${newCount}`;
        setFacets(facets.map((f, i) => {
            if (i === currentIndex) {
                return {
                    ...f,
                    reads: type === 'read' ? [...f.reads, methodName] : f.reads,
                    writes: type === 'write' ? [...f.writes, methodName] : f.writes,
                };
            }
            return f;
        }));
    };

    const removeMethod = (type: 'read' | 'write') => {
        if (currentFacet.isBase) return;
        const methods = type === 'read' ? currentFacet.reads : currentFacet.writes;
        if (methods.length <= 1) return; // Keep at least 1
        setFacets(facets.map((f, i) => {
            if (i === currentIndex) {
                return {
                    ...f,
                    reads: type === 'read' ? f.reads.slice(0, -1) : f.reads,
                    writes: type === 'write' ? f.writes.slice(0, -1) : f.writes,
                };
            }
            return f;
        }));
        if (selection && methods.includes(selection.method)) {
            setSelection(null);
            setOutput(null);
        }
    };

    return (
        <div className="w-full h-full relative" style={{ minHeight: 480 }}>
            {/* 3D Canvas */}
            <Canvas
                gl={{ alpha: true }}
                style={{ background: 'transparent' }}
                camera={{ position: [3.5, 0.8, -1], fov: 42 }}
            >
                <fog attach="fog" args={['#0a0a0a', 3, 14]} />
                <ambientLight intensity={0.25} />
                <pointLight position={[2, 2, 3]} intensity={1.2} color={PURPLE} />
                <pointLight position={[-2, -1, 2]} intensity={0.6} color={PINK} />

                <Spine length={spineLength} />
                {rings.map((ring, i) => (
                    <Ring
                        key={`${ring.name}-${i}`}
                        z={ring.z}
                        radius={ring.radius}
                        color={ring.color}
                        reads={ring.reads}
                        writes={ring.writes}
                        facetIndex={i}
                        currentIndex={currentIndex}
                        onSelect={handleSelect}
                        selectedMethod={selection?.method || null}
                        isOverview={isOverview}
                    />
                ))}
                <CameraController targetZ={ringZ[currentIndex] ?? 0} isOverview={isOverview} facetCount={facets.length} spineLength={spineLength} />
            </Canvas>

            {/* Top Toolbar */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                {/* Facet Controls */}
                <div className="flex items-center gap-1 px-2 py-1 rounded border backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.7)', borderColor: `${PURPLE}50` }}>
                    <button
                        onClick={addFacet}
                        className="px-2 py-0.5 rounded text-[10px] font-mono hover:bg-white/10 transition-colors"
                        style={{ color: PURPLE }}
                        title="Add new facet"
                    >
                        + FACET
                    </button>
                    <span className="text-gray-600">|</span>
                    <button
                        onClick={removeFacet}
                        disabled={facets.length <= 4}
                        className="px-2 py-0.5 rounded text-[10px] font-mono hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ color: PINK }}
                        title={facets.length <= 4 ? "Cannot remove base facets" : "Remove last facet"}
                    >
                        − FACET
                    </button>
                </div>

                {/* View Toggle */}
                <button
                    onClick={toggleView}
                    className="px-3 py-1.5 rounded text-xs font-mono tracking-wide uppercase border backdrop-blur-sm transition-all hover:bg-white/10"
                    style={{ background: 'rgba(0,0,0,0.7)', borderColor: PURPLE, color: PURPLE }}
                >
                    {isOverview ? '↓ ENTER' : '↗ OVERVIEW'}
                </button>
            </div>

            {/* Per-Ring Method Toolbar - Only in tunnel view for non-base facets */}
            {!isOverview && !currentFacet.isBase && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded border backdrop-blur-sm" style={{ background: 'rgba(0,0,0,0.8)', borderColor: `${PURPLE}50` }}>
                        <span className="text-[10px] font-mono text-gray-500">METHODS:</span>
                        <button
                            onClick={() => addMethod('read')}
                            className="px-2 py-0.5 rounded text-[10px] font-mono hover:bg-white/10 transition-colors"
                            style={{ color: PURPLE }}
                        >
                            + READ
                        </button>
                        <button
                            onClick={() => removeMethod('read')}
                            disabled={currentFacet.reads.length <= 1}
                            className="px-2 py-0.5 rounded text-[10px] font-mono hover:bg-white/10 transition-colors disabled:opacity-30"
                            style={{ color: PURPLE }}
                        >
                            −
                        </button>
                        <span className="text-gray-700">|</span>
                        <button
                            onClick={() => addMethod('write')}
                            className="px-2 py-0.5 rounded text-[10px] font-mono hover:bg-white/10 transition-colors"
                            style={{ color: PINK }}
                        >
                            + WRITE
                        </button>
                        <button
                            onClick={() => removeMethod('write')}
                            disabled={currentFacet.writes.length <= 1}
                            className="px-2 py-0.5 rounded text-[10px] font-mono hover:bg-white/10 transition-colors disabled:opacity-30"
                            style={{ color: PINK }}
                        >
                            −
                        </button>
                    </div>
                </div>
            )}

            {/* Base Facet Indicator */}
            {!isOverview && currentFacet.isBase && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                    <div className="px-3 py-1.5 rounded border backdrop-blur-sm text-[10px] font-mono" style={{ background: 'rgba(0,0,0,0.8)', borderColor: `${PURPLE}30`, color: 'gray' }}>
                        🔒 BASE FACET (IMMUTABLE)
                    </div>
                </div>
            )}

            {/* Navigation HUD */}
            {!isOverview && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                    <button
                        onClick={() => setCurrentIndex(i => Math.min(rings.length - 1, i + 1))}
                        disabled={currentIndex === rings.length - 1}
                        className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] transition-opacity disabled:opacity-30"
                        style={{ borderBottomColor: PURPLE }}
                        title="Go deeper"
                    />
                    <div
                        className="px-3 py-1.5 rounded text-xs font-mono tracking-wide uppercase text-center min-w-[140px] border backdrop-blur-sm"
                        style={{ background: 'rgba(0,0,0,0.7)', borderColor: PURPLE, color: '#fff', boxShadow: `0 0 12px ${PURPLE}40` }}
                    >
                        {currentFacet.name}
                    </div>
                    <button
                        onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                        disabled={currentIndex === 0}
                        className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] transition-opacity disabled:opacity-30"
                        style={{ borderTopColor: PURPLE }}
                        title="Pull out"
                    />
                </div>
            )}

            {/* Overview Label */}
            {isOverview && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                    <div
                        className="px-4 py-2 rounded-lg text-xs font-mono tracking-wide uppercase text-center border backdrop-blur-sm"
                        style={{ background: 'rgba(0,0,0,0.7)', borderColor: PURPLE, color: '#fff' }}
                    >
                        <span className="text-gray-400">DIAMOND STRUCTURE // </span>
                        <span style={{ color: PURPLE }}>{facets.length} FACETS</span>
                        {facets.length > 4 && <span className="text-gray-500"> ({facets.length - 4} custom)</span>}
                    </div>
                </div>
            )}

            {/* Method Execution Panel */}
            {selection && !isOverview && (
                <div
                    className="absolute bottom-16 left-4 w-52 max-w-[45%] rounded-lg p-3 font-mono text-xs z-20 border backdrop-blur-md"
                    style={{ background: 'rgba(5,10,20,0.9)', borderColor: selection.type === 'read' ? PURPLE : PINK, boxShadow: `0 0 20px ${selection.type === 'read' ? PURPLE : PINK}30` }}
                >
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/10">
                        <span className="text-gray-400 text-[10px]">EXECUTE.METHOD</span>
                        <button onClick={() => { setSelection(null); setOutput(null); }} className="text-pink-500 hover:text-pink-400 text-[10px]">[X]</button>
                    </div>

                    <div className="mb-1">
                        <span className="text-gray-500 text-[10px]">METHOD:</span>
                        <div className="text-white font-semibold text-[11px]">{selection.method}()</div>
                    </div>

                    <div className="mb-2">
                        <span className="text-gray-500 text-[10px]">TYPE:</span>
                        <span style={{ color: selection.type === 'read' ? PURPLE : PINK }} className="font-bold uppercase ml-1 text-[11px]">
                            {selection.type}
                        </span>
                    </div>

                    <button
                        onClick={runDemo}
                        disabled={busy}
                        className="w-full py-1.5 rounded border text-[10px] font-bold tracking-wider transition-colors hover:bg-white/5"
                        style={{ borderColor: selection.type === 'read' ? PURPLE : PINK, color: selection.type === 'read' ? PURPLE : PINK }}
                    >
                        {busy ? 'EXECUTING...' : selection.type === 'read' ? '> RUN_READ' : '> RUN_WRITE'}
                    </button>

                    {output && (
                        <div className="mt-2 p-1.5 rounded bg-black/50 border border-dashed border-white/20 text-green-400 whitespace-pre-wrap break-words text-[10px]">
                            {output}
                        </div>
                    )}
                </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 text-[10px] font-mono z-10" style={{ display: isOverview ? 'block' : selection ? 'none' : 'block' }}>
                <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PURPLE }} />
                    <span className="text-gray-500">Read Methods</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PINK }} />
                    <span className="text-gray-500">Write Methods</span>
                </div>
            </div>
        </div>
    );
}
