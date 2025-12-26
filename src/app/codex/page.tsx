import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { CODEX } from '@/data/codex';
import { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';
import Web3Wizard from '@/components/Web3Wizard';

export const metadata: Metadata = {
    title: 'The Codex | Knowledge Graph of Industrial Automation',
    description: 'The definitive lexicon for the machine age. Defining the terminology of the Neuromimetic economy, from DePIN and RWA Tokenization to Zero-Knowledge Proofs.',
};

export default function CodexIndex() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white font-sans">
            <StructuredData data={{
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'The TUC Codex',
                description: 'The definitive lexicon for the machine age.',
                publisher: {
                    '@type': 'Organization',
                    name: 'The Utility Company'
                }
            }} />
            <Navbar />

            <main className="pt-32 pb-24 max-w-7xl mx-auto">
                <div className="text-center px-6 mb-16">
                    <span className="section-heading text-utility-red">KNOWLEDGE GRAPH</span>
                    <h1 className="text-5xl md:text-8xl font-bold mt-4 mb-8 leading-tight tracking-tight">
                        THE CODEX
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Decoding the language of the machine economy.
                    </p>
                </div>

                {/* Web3 Education Wizard Banner */}
                <Web3Wizard />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 mt-16">
                    {CODEX.map((term) => (
                        <Link
                            key={term.slug}
                            href={`/codex/${term.slug}`}
                            className="group glass-panel p-8 rounded-2xl border border-white/5 hover:border-utility-red/30 transition-all duration-300 hover:bg-white/5"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest border border-gray-800 px-2 py-1 rounded">
                                    {term.category}
                                </span>
                                <span className="text-utility-red opacity-0 group-hover:opacity-100 transition-opacity">
                                    →
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold mb-4 group-hover:text-utility-red transition-colors">
                                {term.term}
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                {term.definition}
                            </p>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
