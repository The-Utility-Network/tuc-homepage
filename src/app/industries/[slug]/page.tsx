import { notFound } from 'next/navigation';
import { INDUSTRIES } from '@/data/seo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import IndustryProcessFlow from '@/components/IndustryProcessFlow';
import { getMedallionUrl } from '@/utils/medallions';
import StructuredData from '@/components/StructuredData';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return INDUSTRIES.map((ind) => ({
        slug: ind.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const industry = INDUSTRIES.find((ind) => ind.slug === slug);

    if (!industry) {
        return { title: 'Industry Not Found' };
    }

    return {
        title: `${industry.title} | Industrial Automation as a Service`,
        description: industry.description,
        openGraph: {
            title: `Transforming ${industry.title} with TUC`,
            description: industry.automationNarrative,
            images: [getMedallionUrl(industry.subsidiaries[0])], // Fallback to first subsidiary logo
        }
    };
}

export default async function IndustryPage({ params }: Props) {
    const { slug } = await params;
    const industry = INDUSTRIES.find((ind) => ind.slug === slug);

    if (!industry) {
        notFound();
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: `Industrial Automation in ${industry.title}`,
        description: industry.description,
        author: {
            '@type': 'Organization',
            name: 'The Utility Company',
            url: 'https://theutilitycompany.co'
        },
        publisher: {
            '@type': 'Organization',
            name: 'The Utility Company',
            logo: {
                '@type': 'ImageObject',
                url: 'https://theutilitycompany.co/logo.png'
            }
        },
        datePublished: '2025-01-01',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://theutilitycompany.co/industries/${industry.slug}`
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white font-sans">
            <StructuredData data={jsonLd} />
            <Navbar />

            <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
                <div className="mb-12">
                    <Link href="/industries" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                        ← Back to Industries
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="grid lg:grid-cols-2 gap-16 mb-24">
                    <div>
                        <span className="section-heading text-utility-red">INDUSTRY FOCUS</span>
                        <h1 className="text-5xl md:text-7xl font-bold mt-4 mb-8 leading-tight">
                            {industry.title}
                        </h1>
                        <p className="text-2xl text-gray-300 leading-relaxed font-light">
                            {industry.description}
                        </p>
                    </div>
                </div>

                {/* The Dual Engine: Automation & Tokenization */}
                <div className="grid md:grid-cols-2 gap-8 mb-32">
                    <div className="glass-panel p-10 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors duration-700" />
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                            <span className="text-blue-500">⚙️</span> The Automation Engine
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed relative z-10">
                            {industry.automationNarrative}
                        </p>
                    </div>

                    <div className="glass-panel p-10 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-32 bg-utility-red/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-utility-red/20 transition-colors duration-700" />
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 relative z-10">
                            <span className="text-utility-red">🪙</span> The Tokenization Engine
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed relative z-10">
                            {industry.tokenizationNarrative}
                        </p>
                    </div>
                </div>

                {/* Dynamic Process Flow */}
                <section className="mb-32">
                    <IndustryProcessFlow stages={industry.processStages} />
                </section>

                {/* Key Terminology / Codex Integration */}
                <div className="mb-32">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-8">
                        Industry Lexicon
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* 
                           We need to import CODEX in this file for this to work.
                           Assuming CODEX is available or passed in. 
                           Since this is a Server Component, we can import directly.
                        */}
                        {(() => {
                            // Dynamic import to avoid circular dependency issues at top level if any
                            // But cleaner is to import at top. We will add import CODEX to top.
                            const relatedTerms = require('@/data/codex').CODEX.filter((term: any) =>
                                term.relatedIndustries.includes(industry.slug)
                            );

                            if (relatedTerms.length === 0) return null;

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

                {/* Compliance & Reporting Grid */}
                <div className="grid lg:grid-cols-3 gap-8 mb-32">
                    {/* Compliance */}
                    <div className="lg:col-span-2 glass-panel p-10 rounded-3xl border border-white/5 bg-white/[0.02]">
                        <h3 className="text-xl font-bold mb-6 text-green-500 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Compliance as Code
                        </h3>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            {industry.complianceNarrative}
                        </p>
                    </div>

                    {/* Subsidiaries Sidebar */}
                    <div className="lg:col-span-1 row-span-2 glass-panel p-8 rounded-3xl border border-white/10">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-6">Powering Ecosystem</h3>
                        <div className="space-y-4">
                            {industry.subsidiaries.map((sub, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-4 rounded-xl transition-all border border-transparent hover:border-white/10">
                                    <div className="w-12 h-12 relative flex-shrink-0">
                                        <img
                                            src={getMedallionUrl(sub)}
                                            alt={sub}
                                            className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                    <span className="font-semibold text-gray-400 group-hover:text-white transition-colors">{sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reporting */}
                    <div className="lg:col-span-2 glass-panel p-10 rounded-3xl border border-white/5 bg-white/[0.02]">
                        <h3 className="text-xl font-bold mb-6 text-purple-500 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Real-Time Intelligence
                        </h3>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            {industry.reportingNarrative}
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center bg-gradient-to-r from-utility-red/10 to-transparent p-12 rounded-3xl border border-utility-red/20">
                    <h2 className="text-3xl font-bold mb-4">Ready to automate?</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                        Join the {industry.subsidiaries.length} specialized networks already transforming the {industry.title} landscape.
                    </p>
                    <Link href="/contact" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors inline-block">
                        Deploy Infrastructure
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
