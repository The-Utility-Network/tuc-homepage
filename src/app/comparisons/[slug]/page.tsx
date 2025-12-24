import { notFound } from 'next/navigation';
import { COMPARISONS } from '@/data/seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

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
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white">
            <Navbar />

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <Link href="/comparisons" className="text-sm text-gray-500 hover:text-white transition-colors">
                        ← Back to Comparisons
                    </Link>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Header & Overview */}
                    <div className="lg:col-span-2 text-center mb-8">
                        <span className="section-heading text-utility-red">HEAD-TO-HEAD</span>
                        <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6">
                            TUC <span className="text-gray-600 px-4">VS</span> {comparison.competitor}
                        </h1>
                    </div>

                    {/* Competitor Analysis Card */}
                    <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
                        <h2 className="text-2xl font-bold mb-2 text-gray-400">{comparison.competitor}</h2>
                        <span className="inline-block px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-400 mb-6">
                            {comparison.category} Approach
                        </span>
                        <p className="text-lg text-gray-300 leading-relaxed min-h-[100px]">
                            {comparison.description}
                        </p>
                        <div className="mt-8 border-t border-white/10 pt-6">
                            <h4 className="text-sm font-bold text-gray-500 mb-2">LIMITATIONS</h4>
                            <ul className="list-disc list-inside text-gray-400 space-y-2">
                                <li>Vertical-specific silo</li>
                                <li>Limited RWA integration</li>
                                <li>Traditional operational friction</li>
                            </ul>
                        </div>
                    </div>

                    {/* TUC Advantage Card */}
                    <div className="glass-panel p-8 rounded-3xl border border-utility-red/30 bg-utility-red/[0.02] shadow-[0_0_50px_rgba(245,64,41,0.1)]">
                        <h2 className="text-2xl font-bold mb-2 text-white">The Utility Company</h2>
                        <span className="inline-block px-3 py-1 bg-utility-red/20 rounded-full text-xs text-utility-red mb-6">
                            Neuromimetic Approach
                        </span>
                        <p className="text-lg text-white leading-relaxed min-h-[100px]">
                            {comparison.tucAdvantage}
                        </p>
                        <div className="mt-8 border-t border-utility-red/20 pt-6">
                            <h4 className="text-sm font-bold text-utility-red mb-2">ADVANTAGES</h4>
                            <ul className="list-disc list-inside text-gray-300 space-y-2">
                                <li>Holistic Industrial Automation</li>
                                <li>Deep RWA & Utility Binding</li>
                                <li>Self-Optimizing Architecture</li>
                            </ul>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <div className="w-16 h-16 bg-utility-red rounded-full flex items-center justify-center text-2xl font-bold shadow-[0_0_20px_var(--utility-red)]">
                                ✓
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
