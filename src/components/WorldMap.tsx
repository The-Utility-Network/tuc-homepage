'use client';

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { motion } from 'framer-motion';
import { LOCATIONS } from '@/data/seo';
import Link from 'next/link';
import { useState } from 'react';

// Standard 110m resolution world map TopoJSON
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap() {
    const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

    return (
        <div className="relative w-full aspect-video bg-[#050505] rounded-3xl border border-white/5 overflow-hidden">
            {/* Background Grid */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
                    backgroundSize: '4% 8%'
                }}
            />

            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100, center: [0, 15] }}>
                <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="rgba(255, 255, 255, 0.1)"
                                stroke="rgba(255, 255, 255, 0.05)"
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "rgba(255, 255, 255, 0.2)", outline: "none" },
                                    pressed: { outline: "none" },
                                }}
                            />
                        ))
                    }
                </Geographies>

                {LOCATIONS.map((loc) => (
                    <Marker key={loc.slug} coordinates={[loc.coordinates.x, loc.coordinates.y]}>
                        <g
                            onMouseEnter={() => setHoveredLocation(loc.slug)}
                            onMouseLeave={() => setHoveredLocation(null)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Link href={`/locations/${loc.slug}`}>
                                <circle r={4} fill="#F54029" className="animate-pulse" />
                                <circle r={8} fill="transparent" stroke="#F54029" strokeWidth={1} opacity={0.5} />

                                {hoveredLocation === loc.slug && (
                                    <foreignObject x={15} y={-40} width={200} height={100}>
                                        <div className="glass-panel p-2 rounded-lg border border-utility-red/30 bg-black/90 text-xs">
                                            <div className="font-bold text-white">{loc.city}</div>
                                            <div className="text-utility-red">{loc.keyFocus}</div>
                                        </div>
                                    </foreignObject>
                                )}
                            </Link>
                        </g>
                    </Marker>
                ))}
            </ComposableMap>
        </div>
    );
}
