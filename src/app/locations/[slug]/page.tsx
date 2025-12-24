import { notFound } from 'next/navigation';
import { LOCATIONS } from '@/data/seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

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

                    {/* Visualization / Graphic Placeholder */}
                    <div className="relative aspect-square rounded-full bg-gradient-to-br from-gray-900 to-black border border-white/5 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                        <div className="text-center z-10 p-8">
                            <div className="text-9xl font-black text-white/5 select-none">{location.slug.slice(0, 3).toUpperCase()}</div>
                            <div className="mt-4 text-utility-red font-mono text-sm tracking-[0.5em] uppercase">
                                Coordinates: {location.coordinates.x}°N / {location.coordinates.y}°E
                            </div>
                        </div>

                        {/* Animated Rings */}
                        <div className="absolute inset-0 border border-utility-red/20 rounded-full animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-10 border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
