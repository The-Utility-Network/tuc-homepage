import { notFound } from 'next/navigation';
import { COMPARISONS } from '@/data/seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import ComparisonChart from '@/components/ComparisonChart';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return COMPARISONS.map((comp) => ({
        slug: comp.slug,
    }));
}

export default async function ComparisonPage({ params }: Props) {
    const { slug } = await params;
    const comparison = COMPARISONS.find((c) => c.slug === slug);

    if (!comparison) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white font-sans">
            <Navbar />

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <Link href="/comparisons" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                        ← Back to Comparisons
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Header & Overview */}
                    <div className="lg:col-span-2 text-center mb-8">
                        <span className="section-heading text-utility-red">HEAD-TO-HEAD</span>
                        <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6 leading-tight">
                            TUC <span className="text-gray-600 px-4 text-4xl align-middle">VS</span> {comparison.competitor}
                        </h1>
                    </div>

                    {/* Competitor Analysis Card */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
                        <h2 className="text-2xl font-bold mb-2 text-gray-400">{comparison.competitor}</h2>
                        <span className="inline-block px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 mb-6 uppercase tracking-wide">
                            {comparison.category} Approach
                        </span>
                        <p className="text-lg text-gray-300 leading-relaxed min-h-[100px]">
                            {comparison.description}
                        </p>
                        <div className="mt-8 border-t border-white/10 pt-6">
                            <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-widest">Structural Flaws</h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-gray-400">
                                    <span className="text-red-500 mt-1">✕</span>
                                    <span>Manual, periodic reporting (Quarterly/Annual)</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-400">
                                    <span className="text-red-500 mt-1">✕</span>
                                    <span>Compliance is post-trade & reactive</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-400">
                                    <span className="text-red-500 mt-1">✕</span>
                                    <span>Assets trapped in siloed databases</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* TUC Advantage Card */}
                    <div className="glass-panel p-8 rounded-3xl border border-utility-red/30 bg-utility-red/[0.02] shadow-[0_0_50px_rgba(245,64,41,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-utility-red/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

                        <h2 className="text-2xl font-bold mb-2 text-white">The Utility Company</h2>
                        <span className="inline-block px-3 py-1 bg-utility-red/20 rounded-full text-xs text-utility-red mb-6 uppercase tracking-wide">
                            Neuromimetic Approach
                        </span>
                        <p className="text-lg text-white leading-relaxed min-h-[100px]">
                            {comparison.tucAdvantage}
                        </p>
                        <section className="mt-8 pt-6 border-t border-utility-red/20 relative z-10">
                            <h4 className="text-sm font-bold text-utility-red mb-4 uppercase tracking-widest">The TUC Standard</h4>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-3 text-gray-200">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span><strong>Real-Time Reporting:</strong> Audit-grade data, block by block.</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-200">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span><strong>Automated Compliance:</strong> Rules enforced by smart contract code.</span>
                                </li>
                                <li className="flex items-start gap-3 text-gray-200">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span><strong>Asset Fluidity:</strong> Tokenized for instant, global liquidity.</span>
                                </li>
                            </ul>
                            <ComparisonChart competitorName={comparison.competitor} />
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
