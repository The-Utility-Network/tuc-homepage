import { notFound } from 'next/navigation';
import { CODEX } from '@/data/codex';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return CODEX.map((item) => ({
        slug: item.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const term = CODEX.find((t) => t.slug === slug);

    if (!term) {
        return { title: 'Term Not Found' };
    }

    return {
        title: `What is ${term.term}? | The Codex`,
        description: term.definition,
    };
}

export default async function CodexPage({ params }: Props) {
    const { slug } = await params;
    const term = CODEX.find((t) => t.slug === slug);

    if (!term) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'DefinedTerm',
        name: term.term,
        description: term.definition,
        inDefinedTermSet: 'https://theutilitycompany.co/codex'
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white font-sans">
            <StructuredData data={jsonLd} />
            <Navbar />

            <div className="relative pt-32 pb-24 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 p-64 bg-utility-red/5 rounded-full blur-[100px] pointer-events-none" />

                <main className="max-w-4xl mx-auto relative z-10">
                    <div className="mb-12">
                        <Link href="/codex" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                            ← Back to Codex
                        </Link>
                    </div>

                    <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-utility-red mb-8">
                        {term.category.toUpperCase()}
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                        {term.term}
                    </h1>

                    <div className="text-2xl text-white font-light leading-relaxed mb-12 border-l-4 border-utility-red pl-8">
                        {term.definition}
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                        <p>{term.longDescription}</p>
                    </div>

                    <div className="mt-24 grid md:grid-cols-2 gap-8 border-t border-white/10 pt-12">
                        {term.relatedIndustries.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Related Industries</h3>
                                <div className="flex flex-wrap gap-2">
                                    {term.relatedIndustries.map(ind => (
                                        <Link key={ind} href={`/industries/${ind}`} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors">
                                            {ind.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {term.relatedLocations.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Active Hubs</h3>
                                <div className="flex flex-wrap gap-2">
                                    {term.relatedLocations.map(loc => (
                                        <Link key={loc} href={`/locations/${loc}`} className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm transition-colors">
                                            {loc.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Related Concepts Logic */}
                        <div className="md:col-span-2 mt-8">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Related Concepts</h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {CODEX
                                    .filter(t => t.category === term.category && t.slug !== term.slug)
                                    .slice(0, 3)
                                    .map(related => (
                                        <Link key={related.slug} href={`/codex/${related.slug}`} className="block p-4 border border-white/5 hover:border-utility-red/30 rounded-xl bg-white/5 transition-colors group">
                                            <div className="text-utility-red text-xs mb-1 group-hover:text-white transition-colors">See also:</div>
                                            <div className="font-bold">{related.term}</div>
                                            <div className="text-xs text-gray-500 mt-1 line-clamp-2">{related.definition}</div>
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}
