import { notFound } from 'next/navigation';
import { LOCATIONS } from '@/data/seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import GeometricCyberGrid from '@/components/GeometricCyberGrid';
import { getMedallionUrl } from '@/utils/medallions';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return LOCATIONS.map((loc) => ({
        slug: loc.slug,
    }));
}

export default async function LocationPage({ params }: Props) {
    const { slug } = await params;
    const location = LOCATIONS.find((loc) => loc.slug === slug);

    if (!location) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white">
            <Navbar />

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <Link href="/locations" className="text-sm text-gray-500 hover:text-white transition-colors">
                        ← Back to Global Network
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="section-heading text-utility-red">{location.city.toUpperCase()}</span>
                        <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-8">
                            The Utility Company <br />
                            <span className="text-gray-500">in {location.city}</span>
                        </h1>

                        <div className="glass-panel p-8 rounded-2xl border-l-4 border-utility-red">
                            <h3 className="text-xl font-bold mb-4">Regional Focus: {location.keyFocus}</h3>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                {location.description}
                            </p>
                        </div>

                        <div className="mt-12 space-y-6">
                            <h3 className="text-2xl font-bold">Why {location.city}?</h3>
                            <p className="text-gray-400">
                                {location.city} represents a critical node in the global economy. By deploying
                                Ledger1's neuromimetic architecture here, we are not just upgrading software;
                                we are installing a new operating system for {location.region}'s industrial and financial future.
                            </p>
                        </div>
                    </div>

                    {/* Visualization */}
                    <GeometricCyberGrid
                        title={location.code}
                        subtitle={`${location.coordinates.y.toFixed(2)}°N / ${location.coordinates.x.toFixed(2)}°E`}
                    />
                </div>

                {/* Detailed Metrics Section */}
                <div className="grid md:grid-cols-4 gap-6 mb-16">
                    {[
                        { label: 'Network Nodes', value: '142', trend: '+12%' },
                        { label: 'RWA Volume', value: '$2.4B', trend: '+8%' },
                        { label: 'Active Daos', value: '15', trend: 'STABLE' },
                        { label: 'Compliance Score', value: '99.9%', trend: 'AUDITED' }
                    ].map((stat, i) => (
                        <div key={i} className="glass-panel p-6 rounded-xl border border-white/5 hover:border-utility-red/30 transition-colors">
                            <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">{stat.label}</div>
                            <div className="text-3xl font-bold text-white flex items-end gap-2">
                                {stat.value}
                                <span className={`text-xs mb-1 ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-utility-red'}`}>{stat.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <div className="bg-white/5 p-8 rounded-2xl border border-white/5">
                            <h3 className="text-2xl font-bold mb-6 text-utility-red flex items-center gap-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Regulatory Deep Dive
                            </h3>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {location.regulatoryContext}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-6">Strategic Importance</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {location.city} is not just a location; it is a strategic anchor for the {location.region} region.
                                Our infrastructure here is designed to be resilient, compliant, and scalable, ensuring that local
                                enterprises can transition to Web3 rails without disrupting their existing operational mandates.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider text-gray-500">Ecosystem Footprint</h3>
                            <div className="grid gap-4">
                                {location.activeSubsidiaries.map(sub => (
                                    <div key={sub} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:border-utility-red/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 relative flex-shrink-0">
                                                <img
                                                    src={getMedallionUrl(sub)}
                                                    alt={sub}
                                                    className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(245,64,41,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(245,64,41,0.6)] transition-all"
                                                />
                                            </div>
                                            <span className="font-semibold text-sm">{sub}</span>
                                        </div>
                                        <div className="text-[10px] text-gray-500 px-2 py-0.5 border border-white/10 rounded-full uppercase tracking-wider">ACTIVE</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
