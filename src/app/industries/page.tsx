import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { INDUSTRIES } from '@/data/seo';

export const metadata = {
    title: 'Industries Transformed | The Utility Company',
    description: 'See how The Utility Company is revolutionizing Finance, Agriculture, Energy, and Manufacturing with blockchain automation.',
};

export default function IndustriesPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white">
            <Navbar />

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="section-heading">VERTICAL INTEGRATION</span>
                    <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 pb-2">
                        Industries <br /> Reimagined
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        We don't just offer software; we offer structural transformation.
                        Explore how TUC applies neuromimetic business architecture to specific economic sectors.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {INDUSTRIES.map((ind, index) => (
                        <Link
                            key={ind.slug}
                            href={`/industries/${ind.slug}`}
                            className="group glass-panel p-8 rounded-3xl hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-utility-red/30 relative overflow-hidden"
                        >
                            {/* Decorative Number */}
                            <span className="absolute top-4 right-8 text-6xl font-black text-white/5 group-hover:text-utility-red/10 transition-colors">
                                0{index + 1}
                            </span>

                            <h2 className="text-3xl font-bold mb-4 group-hover:text-utility-red transition-colors relative z-10">{ind.title}</h2>
                            <p className="text-gray-400 mb-8 relative z-10 h-14">
                                {ind.description}
                            </p>

                            <div className="relative z-10">
                                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 block">Powered By:</span>
                                <div className="flex flex-wrap gap-2">
                                    {ind.subsidiaries.map(sub => (
                                        <span key={sub} className="px-3 py-1 bg-white/10 rounded-full text-xs text-white">
                                            {sub}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8 flex items-center text-utility-red text-sm font-semibold relative z-10">
                                View Case Study <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
