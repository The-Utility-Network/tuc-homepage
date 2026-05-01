'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import LOCATIONS from '@/lib/data/locations.json';
import { useRouter } from 'next/navigation';

// Dynamic import for react-globe.gl to ensure it only loads on client
const Globe = dynamic(() => import('react-globe.gl'), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-[#050505] text-[#F54029]/50 font-rajdhani text-sm tracking-widest animate-pulse">Initializing Global Matrix...</div>
});

export default function GlobeMap({ activeRegion, hoveredCity }: { activeRegion: string | null, hoveredCity: string | null }) {
    const globeEl = useRef<any>(null);
    const router = useRouter();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter points based on active region
    const gData = useMemo(() => {
        return LOCATIONS.filter((loc: any) => !activeRegion || loc.country === activeRegion)
            .map((loc: any) => ({
                lat: loc.lat,
                lng: loc.lng,
                name: loc.name,
                country: loc.country,
                slug: loc.slug
            }));
    }, [activeRegion]);

    // Handle Resize and Scroll Capturing
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        const stopWheel = (e: WheelEvent) => e.stopPropagation();

        const el = containerRef.current;
        if (el) {
            el.addEventListener('wheel', stopWheel, { capture: true, passive: true });
        }

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => {
            window.removeEventListener('resize', updateDimensions);
            if (el) el.removeEventListener('wheel', stopWheel, { capture: true });
        };
    }, []);

    // Initial globe rotation and styling focus
    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.3; // Majestic slow rotation
            globeEl.current.controls().enableZoom = false;

            // Set initial POV depending on active region
            const focusMap: Record<string, { lat: number, lng: number, altitude: number }> = {
                'Americas': { lat: 35, lng: -95, altitude: 1.5 },
                'Europe': { lat: 48, lng: 10, altitude: 1.5 },
                'Middle East': { lat: 25, lng: 55, altitude: 1.5 },
                'Asia-Pacific': { lat: 15, lng: 110, altitude: 1.5 }
            };

            if (activeRegion && focusMap[activeRegion]) {
                globeEl.current.controls().autoRotate = false;
                globeEl.current.pointOfView(focusMap[activeRegion], 1000);
            } else {
                globeEl.current.controls().autoRotate = true;
                globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 1000);
            }
        }
    }, [activeRegion]);

    // When hovering over a specific city from the cards, rotate to it
    useEffect(() => {
        if (hoveredCity && globeEl.current) {
            const loc = LOCATIONS.find((l: any) => l.slug === hoveredCity);
            if (loc) {
                globeEl.current.controls().autoRotate = false;
                globeEl.current.pointOfView({ lat: loc.lat, lng: loc.lng, altitude: 1.2 }, 800);
            }
        }
    }, [hoveredCity]);

    return (
        <div ref={containerRef} className="w-full h-full absolute inset-0">
            {dimensions.width > 0 && (
                <Globe
                    ref={globeEl}
                    width={dimensions.width}
                    height={dimensions.height}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundColor="rgba(0,0,0,0)"
                    atmosphereColor="#F54029"
                    atmosphereAltitude={0.15}

                    // Points
                    pointsData={gData}
                    pointLat="lat"
                    pointLng="lng"
                    pointColor={(d: any) => d.slug === hoveredCity ? '#ffffff' : 'rgba(245,64,41,0.4)'}
                    pointAltitude={(d: any) => (d.slug === hoveredCity ? 1.0 : 0.08) * 0.1}
                    pointRadius={(d: any) => d.slug === hoveredCity ? 1.0 : 0.08}
                    pointsMerge={false}
                    pointResolution={16}

                    // Interaction
                    onPointClick={(point: any) => router.push(`/locations/${point.slug}`)}
                    pointLabel={(point: any) => `
                        <div class="bg-black/90 backdrop-blur-md border border-[#F54029]/30 rounded-lg px-3 py-2 shadow-[0_0_20px_rgba(245,64,41,0.5)] -mt-16 pointer-events-none">
                            <div class="text-[10px] font-rajdhani font-bold text-[#F54029] tracking-widest">${point.country.toUpperCase()}</div>
                            <div class="text-sm font-bold text-white font-rajdhani tracking-wide">${point.name}</div>
                            <div class="text-[10px] font-mono text-white/50">AGENTIC AI IMPLEMENTATION</div>
                        </div>
                    `}

                    // Rings around active/hovered points only (Major Performance optimization)
                    ringsData={gData.filter((d: any) => hoveredCity === d.slug)}
                    ringColor={() => '#ffffff'}
                    ringMaxRadius={6}
                    ringPropagationSpeed={1.5}
                    ringRepeatPeriod={400}
                />
            )}
        </div>
    );
}
