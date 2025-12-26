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
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white font-sans">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <GeometricCyberGrid />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="mb-12">
                        <Link href="/locations" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                            ← Back to Global Network
                        </Link>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-utility-red mb-6">
                                <span className="w-2 h-2 rounded-full bg-utility-red animate-pulse" />
                                ACTIVE HUB: {location.code}
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tight">
                                {location.city}
                            </h1>
                            <p className="text-2xl text-gray-300 leading-relaxed font-light mb-8">
                                {location.description}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                {location.activeSubsidiaries.map((sub, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                        <div className="w-6 h-6 relative">
                                            <img src={getMedallionUrl(sub)} alt={sub} className="w-full h-full object-contain" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-400">{sub}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Minimap / Stats Card */}
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 lg:mt-12">
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Region</div>
                                    <div className="text-xl font-bold">{location.region}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Coordinates</div>
                                    <div className="text-xl font-bold font-mono">{location.coordinates.x.toFixed(2)}, {location.coordinates.y.toFixed(2)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Focus</div>
                                    <div className="text-xl font-bold text-utility-red">{location.keyFocus}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Compliance</div>
                                    <div className="text-xl font-bold text-green-500">100%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="px-6 pb-24 max-w-7xl mx-auto">
                {/* Regulatory Context */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                        <span className="w-12 h-1 bg-utility-red" />
                        Regulatory Landscape
                    </h2>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-gray-200">The Challenge</h3>
                                <p className="text-lg text-gray-400 leading-relaxed border-l-2 border-white/10 pl-6">
                                    {location.regulatoryContext}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500/10 to-transparent p-8 rounded-3xl border border-green-500/20">
                            <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                The Compliance Engine
                            </h3>
                            <p className="text-lg text-gray-300 leading-relaxed">
                                {location.complianceNarrative}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Local Lexicon / Codex Integration */}
                <div className="mb-24">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-8">
                        Regional Terminology
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(() => {
                            const relatedTerms = require('@/data/codex').CODEX.filter((term: any) =>
                                term.relatedLocations.includes(location.slug)
                            );

                            if (relatedTerms.length === 0) return (
                                <p className="text-gray-600 text-sm">No specific regional terms defined yet.</p>
                            );

                            return relatedTerms.map((term: any) => (
                                <Link key={term.slug} href={`/codex/${term.slug}`} className="group block p-6 bg-white/5 border border-white/5 hover:border-utility-red/30 rounded-2xl transition-all hover:bg-white/10">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-mono text-gray-500 uppercase">{term.category}</span>
                                        <span className="text-utility-red opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                                    </div>
                                    <h4 className="font-bold text-lg mb-2 text-gray-200 group-hover:text-white">{term.term}</h4>
                                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{term.definition}</p>
                                </Link>
                            ));
                        })()}
                    </div>
                </div>

                {/* Token Economy */}
                <div className="mb-32">
                    <h2 className="text-3xl font-bold mb-12 flex items-center gap-4">
                        <span className="w-12 h-1 bg-blue-500" />
                        Local Token Economy
                    </h2>

                    <div className="glass-panel p-12 rounded-3xl border border-white/5 bg-[url('/grid-pattern.svg')] bg-fixed relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/80" />
                        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h3 className="text-4xl font-bold mb-6 text-white">What's being traded?</h3>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    {location.localTokenizationEconomy}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-colors">
                                    <div className="text-3xl mb-2">🏙️</div>
                                    <div className="font-bold text-sm">Real Estate</div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-colors">
                                    <div className="text-3xl mb-2">🏭</div>
                                    <div className="font-bold text-sm">Industrial</div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-colors">
                                    <div className="text-3xl mb-2">⚡</div>
                                    <div className="font-bold text-sm">Energy</div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center hover:bg-white/10 transition-colors">
                                    <div className="text-3xl mb-2">🌾</div>
                                    <div className="font-bold text-sm">Commodities</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="flex justify-center">
                    <Link href="/contact" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden">
                        <span className="relative z-10">Launch in {location.city}</span>
                        <svg className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <div className="absolute inset-0 bg-gray-200 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
