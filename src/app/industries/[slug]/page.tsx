import { notFound } from 'next/navigation';
import { INDUSTRIES } from '@/data/seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import IndustryProcessFlow from '@/components/IndustryProcessFlow';
import { getMedallionUrl } from '@/utils/medallions';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return INDUSTRIES.map((ind) => ({
        slug: ind.slug,
    }));
}

export default async function IndustryPage({ params }: Props) {
    const { slug } = await params;
    const industry = INDUSTRIES.find((ind) => ind.slug === slug);

    if (!industry) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white">
            <Navbar />

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <Link href="/industries" className="text-sm text-gray-500 hover:text-white transition-colors">
                        ← Back to Industries
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="lg:w-2/3">
                        <span className="section-heading text-utility-red">INDUSTRY FOCUS</span>
                        <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-8">
                            {industry.title}
                        </h1>

                        <p className="text-2xl text-gray-300 leading-relaxed mb-12">
                            {industry.description}
                        </p>

                        <div className="space-y-12">
                            <section>
                                <h3 className="text-2xl font-bold mb-4">The Challenge</h3>
                                <p className="text-gray-400 text-lg">
                                    Traditional models in {industry.title.toLowerCase()} suffer from data silos,
                                    intermediary friction, and lack of real-time transparency. Legacy ERP systems
                                    simply record what happened yesterday, rather than automating what should happen tomorrow.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-2xl font-bold mb-4">The TUC Solution</h3>
                                <p className="text-gray-400 text-lg mb-8">
                                    By implementing {industry.subsidiaries.join(' ')} ledgers, we create a single, immutable source of truth.
                                    This allows for instant settlement, automated compliance, and the tokenization of
                                    productive assets, turning passive infrastructure into active economic participants.
                                </p>
                                <IndustryProcessFlow />
                            </section>
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="sticky top-32 glass-panel p-6 rounded-2xl border border-white/10">
                            <h3 className="text-lg font-bold mb-6">Key Subsidiaries</h3>
                            <div className="space-y-4">
                                {industry.subsidiaries.map((sub, i) => (
                                    <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-3 rounded-lg transition-colors border border-transparent hover:border-white/5">
                                        <div className="w-10 h-10 relative flex-shrink-0">
                                            <img
                                                src={getMedallionUrl(sub)}
                                                alt={sub}
                                                className="w-full h-full object-contain opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-300 group-hover:text-white">{sub}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10">
                                <h4 className="text-xs font-mono text-gray-500 uppercase mb-2">Impact Metric</h4>
                                <div className="text-3xl font-bold text-utility-red">100%</div>
                                <div className="text-sm text-gray-400">On-Chain Transparency</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
