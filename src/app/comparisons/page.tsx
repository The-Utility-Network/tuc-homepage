import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMPARISONS } from '@/data/seo';

export const metadata = {
    title: 'Competitive Analysis | The Utility Company',
    description: 'Compare The Utility Company against leading DePIN projects, RWA platforms, and traditional enterprise solutions.',
};

export default function ComparisonsPage() {
    const categories = Array.from(new Set(COMPARISONS.map(c => c.category)));

    return (
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white">
            <Navbar />

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="section-heading">MARKET POSITION</span>
                    <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 pb-2">
                        TUC vs The World
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Transparency is our core product. See exactly how our architecture
                        differs from legacy systems and contemporary blockchain projects.
                    </p>
                </div>

                <div className="space-y-16">
                    {categories.map((category) => (
                        <section key={category}>
                            <h3 className="text-3xl font-bold mb-8 border-b border-white/10 pb-4 flex items-center gap-4">
                                <span className="text-utility-red">{category}</span> Sector
                            </h3>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {COMPARISONS.filter(c => c.category === category).map((comp) => (
                                    <Link
                                        key={comp.slug}
                                        href={`/comparisons/${comp.slug}`}
                                        className="glass-panel p-6 rounded-2xl hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-utility-red/30 flex flex-col"
                                    >
                                        <div className="mb-4">
                                            <span className="text-xs font-mono text-gray-500 uppercase">VS Competitor</span>
                                            <h4 className="text-2xl font-bold">{comp.competitor}</h4>
                                        </div>

                                        <p className="text-gray-400 text-sm mb-6 flex-grow">
                                            {comp.description}
                                        </p>

                                        <div className="bg-utility-red/10 p-4 rounded-xl border border-utility-red/20">
                                            <span className="text-utility-red text-xs font-bold block mb-1">TUC Advantage</span>
                                            <p className="text-sm text-gray-300 line-clamp-2">
                                                {comp.tucAdvantage}
                                            </p>
                                        </div>

                                        <div className="mt-6 flex items-center justify-center text-sm font-mono text-gray-500">
                                            READ FULL ANALYSIS
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
