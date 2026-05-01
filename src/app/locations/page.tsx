import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlobeMap from '@/components/locations/GlobeMap';
import LocationsGrid from '@/components/locations/LocationsGrid';
import LOCATIONS from '@/lib/data/locations.json';

export const metadata = {
    title: 'Global Industrial Automation & Digital Twin Hubs | The Utility Company',
    description: 'Explore our global network of industrial automation centers. The Utility Company is the premier consultancy for digital twins and automated industrial processes worldwide.',
};

export default function LocationsPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#F54029] selection:text-white font-rajdhani relative overflow-hidden">
            <Navbar />

            <main className="relative z-10">
                {/* Hero Section with Interactive Globe Background */}
                <div className="relative h-screen min-h-[800px] flex items-center pt-20 border-b border-white/5">
                    <div className="absolute inset-0 z-0">
                        <GlobeMap activeRegion={null} hoveredCity={null} />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[#050505] z-0 pointer-events-none" />
                    
                    <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center mt-[-10vh] pointer-events-none">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F54029]/10 border border-[#F54029]/20 text-xs font-mono text-[#F54029] mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#F54029] animate-pulse" />
                            GLOBAL CAPABILITY MATRIX
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-wide drop-shadow-2xl">
                            Local Domination, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F54029] to-[#C53020]">
                                Global Automation
                            </span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-2xl mx-auto font-sans font-light backdrop-blur-sm rounded-xl p-4">
                            From New York to Tokyo, The Utility Company architects automated industrial processes, leveraging high-fidelity digital twins and predictive control to dramatically accelerate industrial output.
                        </p>
                    </div>
                </div>

                {/* Grid of Locations */}
                <div className="px-6 py-32 max-w-7xl mx-auto relative z-10 bg-[#050505]">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-wide">
                            Industrial Automation Hubs
                        </h2>
                        <p className="text-white/40 mt-4 max-w-xl mx-auto font-sans">
                            Select a location below to explore how we are deploying bespoke industrial control systems and digital twins to dominate regional markets.
                        </p>
                    </div>

                    <LocationsGrid locations={LOCATIONS} />
                </div>
            </main>

            <Footer />
        </div>
    );
}
