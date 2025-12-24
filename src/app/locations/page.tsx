import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WorldMap from '@/components/WorldMap';
import { LOCATIONS } from '@/data/seo';

export const metadata = {
    title: 'Global Locations | The Utility Company',
    description: 'Explore our global network of financial hubs and innovation centers powering the next generation of industrial automation.',
};

export default function LocationsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white">
            <Navbar />

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="section-heading">GLOBAL NETWORK</span>
                    <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 pb-2">
                        Local Impact, <br /> Global Scale
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        From New York's financial districts to Tokyo's robotic assembly lines,
                        TUC is embedding decentralized automation into the world's most critical infrastructure.
                    </p>
                </div>

                {/* Map Section */}
                <div className="mb-24">
                    <WorldMap />
                </div>

                {/* Grid of Locations */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {LOCATIONS.map((loc) => (
                        <Link
                            key={loc.slug}
                            href={`/locations/${loc.slug}`}
                            className="group glass-panel p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 hover:-translate-y-1 block border border-white/5 hover:border-utility-red/30"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold group-hover:text-utility-red transition-colors">{loc.city}</h2>
                                <span className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded">
                                    {loc.country}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                                {loc.description}
                            </p>
                            <div className="flex items-center text-utility-red text-sm font-semibold">
                                Explore Hub <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
