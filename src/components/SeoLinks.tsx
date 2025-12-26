import Link from 'next/link';
import { LOCATIONS, INDUSTRIES, COMPARISONS } from '@/data/seo';
import { CODEX } from '@/data/codex';

export default function SeoLinks() {
    return (
        <section className="relative py-24 px-6 border-t border-white/10 overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <span className="section-heading">GLOBAL IMPACT</span>
                    <h2 className="section-title mt-4">Expansive Reach</h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        Discover how The Utility Company transforms industries and economies worldwide.
                        Explore our presence by location, industry, or competitive advantage.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {/* Codex Column */}
                    <div className="glass-panel p-8 rounded-2xl flex flex-col h-full group hover:bg-white/5 transition-colors duration-500">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="text-utility-red">The Codex</span>
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </h3>
                        <div className="flex-grow space-y-4 mb-8">
                            <p className="text-gray-400 text-sm">Decoding the language of the machine economy.</p>
                            <div className="flex flex-wrap gap-2">
                                {CODEX.slice(0, 6).map((term) => (
                                    <Link
                                        key={term.slug}
                                        href={`/codex/${term.slug}`}
                                        className="px-3 py-1 rounded-full bg-white/5 hover:bg-utility-red/20 hover:text-utility-red text-xs transition-colors border border-white/5 hover:border-utility-red/30"
                                    >
                                        {term.term}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link
                            href="/codex"
                            className="inline-flex items-center text-sm font-mono text-utility-red hover:tracking-wide transition-all"
                        >
                            BROWSE LEXICON <span className="ml-2">→</span>
                        </Link>
                    </div>

                    {/* Industries Column */}
                    <div className="glass-panel p-8 rounded-2xl flex flex-col h-full group hover:bg-white/5 transition-colors duration-500">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="text-utility-red">Industries</span>
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </h3>
                        <div className="flex-grow space-y-4 mb-8">
                            <p className="text-gray-400 text-sm">Disrupting verticals with decentralized automation.</p>
                            <div className="flex flex-wrap gap-2">
                                {INDUSTRIES.slice(0, 6).map((ind) => (
                                    <Link
                                        key={ind.slug}
                                        href={`/industries/${ind.slug}`}
                                        className="px-3 py-1 rounded-full bg-white/5 hover:bg-utility-red/20 hover:text-utility-red text-xs transition-colors border border-white/5 hover:border-utility-red/30"
                                    >
                                        {ind.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link
                            href="/industries"
                            className="inline-flex items-center text-sm font-mono text-utility-red hover:tracking-wide transition-all"
                        >
                            EXPLORE SECTORS <span className="ml-2">→</span>
                        </Link>
                    </div>

                    {/* Locations Column */}
                    <div className="glass-panel p-8 rounded-2xl flex flex-col h-full group hover:bg-white/5 transition-colors duration-500">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="text-utility-red">Locations</span>
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </h3>
                        <div className="flex-grow space-y-4 mb-8">
                            <p className="text-gray-400 text-sm">Targeting global financial hubs and innovation centers.</p>
                            <div className="flex flex-wrap gap-2">
                                {LOCATIONS.slice(0, 6).map((loc) => (
                                    <Link
                                        key={loc.slug}
                                        href={`/locations/${loc.slug}`}
                                        className="px-3 py-1 rounded-full bg-white/5 hover:bg-utility-red/20 hover:text-utility-red text-xs transition-colors border border-white/5 hover:border-utility-red/30"
                                    >
                                        {loc.city}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link
                            href="/locations"
                            className="inline-flex items-center text-sm font-mono text-utility-red hover:tracking-wide transition-all"
                        >
                            VIEW WORLD MAP <span className="ml-2">→</span>
                        </Link>
                    </div>

                    {/* Comparisons Column */}
                    <div className="glass-panel p-8 rounded-2xl flex flex-col h-full group hover:bg-white/5 transition-colors duration-500">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span className="text-utility-red">Comparisons</span>
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                            </svg>
                        </h3>
                        <div className="flex-grow space-y-4 mb-8">
                            <p className="text-gray-400 text-sm">See how TUC stacks up against the competition.</p>
                            <div className="flex flex-wrap gap-2">
                                {COMPARISONS.slice(0, 6).map((comp) => (
                                    <Link
                                        key={comp.slug}
                                        href={`/comparisons/${comp.slug}`}
                                        className="px-3 py-1 rounded-full bg-white/5 hover:bg-utility-red/20 hover:text-utility-red text-xs transition-colors border border-white/5 hover:border-utility-red/30"
                                    >
                                        vs {comp.competitor}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link
                            href="/comparisons"
                            className="inline-flex items-center text-sm font-mono text-utility-red hover:tracking-wide transition-all"
                        >
                            COMPARE SOLUTIONS <span className="ml-2">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
