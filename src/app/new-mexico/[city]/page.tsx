import React from 'react';
import { notFound } from 'next/navigation';
import { NM_CITIES } from '@/lib/data/new-mexico-cities';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Props {
    params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { city } = await params;
    const location = NM_CITIES.find((loc) => loc.slug === city);
    if (!location) return { title: 'Not Found' };

    return {
        title: `Industrial Automation & AI Consulting in ${location.name}, NM | The Utility Company`,
        description: `Top-rated industrial automation and digital twin consulting serving ${location.name}, New Mexico. Specializing in ${location.industryFocus} using advanced SCADA and Agentic AI architectures.`,
        keywords: `${location.name} Industrial Automation, AI Consulting ${location.name} NM, SCADA integration ${location.name}, Digital Twin ${location.name}, Business Automation New Mexico, ${location.industryFocus}`,
        openGraph: {
            title: `Industrial Automation & AI Consulting in ${location.name}, NM | TUC`,
            description: `Expert digital twin architecture and SCADA integration serving ${location.name}.`,
        }
    };
}

export async function generateStaticParams() {
    return NM_CITIES.map((loc) => ({
        city: loc.slug,
    }));
}

export default async function NewMexicoCityPage({ params }: Props) {
    const { city } = await params;
    const location = NM_CITIES.find((loc) => loc.slug === city);

    if (!location) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#F54029]/30 flex flex-col">
            <Navbar />

            {/* City Hero Section */}
            <div className="relative pt-32 pb-20 border-b border-white/5 overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F54029]/5 blur-[150px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono text-xs backdrop-blur-sm">
                            NEW MEXICO
                        </div>
                        <div className="px-3 py-1 rounded-full bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] font-mono text-xs backdrop-blur-sm">
                            {location.industryFocus.toUpperCase()}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold font-rajdhani tracking-tight mb-6">
                        Industrial Automation & AI Consulting in <span className="text-[#F54029]">{location.name}</span>
                    </h1>

                    <p className="text-xl text-white/70 max-w-3xl font-light leading-relaxed mb-12">
                        {location.description}
                    </p>

                    <div className="flex gap-4">
                        <a href="/contact" className="px-6 py-3 bg-[#F54029] text-white font-rajdhani font-bold rounded-lg hover:bg-[#F54029]/90 transition-colors shadow-[0_0_20px_rgba(245,64,41,0.3)]">
                            Book a Strategy Call
                        </a>
                        <a href="/new-mexico" className="px-6 py-3 bg-white/5 border border-white/10 text-white font-rajdhani rounded-lg hover:bg-white/10 transition-colors">
                            View All NM Hubs
                        </a>
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 flex-grow">
                <div className="grid lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-rajdhani font-bold mb-6">Architecting the Digital Twin of {location.name}</h2>
                        <p className="text-white/60 mb-6 leading-relaxed">
                            The Utility Company partners with enterprise clients in {location.name} to map their physical operations into high-fidelity digital environments. By bridging the gap between legacy hardware and modern AI processing, we enable unprecedented oversight and predictive capabilities.
                        </p>
                        <p className="text-white/60 mb-8 leading-relaxed">
                            Our primary focus for {location.name} is the implementation of robust SCADA integration tailored to <strong>{location.industryFocus}</strong>. We deploy autonomous Agentic AI that doesn't just read data, but actively controls physical processes to optimize yield, reduce downtime, and ensure rigorous safety compliance.
                        </p>
                        
                        <ul className="space-y-4">
                            {[
                                "Predictive Maintenance & IoT Sensor Mesh",
                                "Legacy SCADA Systems Modernization",
                                "Autonomous Process Control (APC)",
                                "Edge Computing for Ultra-Low Latency Responses"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-mono text-white/80">
                                    <svg className="w-5 h-5 text-[#F54029] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-black/40 border border-white/5 p-8 rounded-2xl h-fit">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-3 h-3 rounded-full bg-[#F54029] animate-pulse" />
                            <h3 className="font-mono text-sm tracking-widest text-[#F54029]">LOCAL HUB METRICS</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <div className="text-sm text-white/50 font-mono mb-1">LATITUDE / LONGITUDE</div>
                                <div className="text-lg font-rajdhani">{location.lat.toFixed(4)}° N, {Math.abs(location.lng).toFixed(4)}° W</div>
                            </div>
                            <div className="w-full h-px bg-white/5" />
                            <div>
                                <div className="text-sm text-white/50 font-mono mb-1">PROJECTED ROI TIMELINE</div>
                                <div className="text-lg font-rajdhani">6 - 8 Months</div>
                            </div>
                            <div className="w-full h-px bg-white/5" />
                            <div>
                                <div className="text-sm text-white/50 font-mono mb-1">DEPLOYMENT SPEED</div>
                                <div className="text-lg font-rajdhani">12 - 16 Weeks to Core MVP</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schema.org LocalBusiness Markup for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ProfessionalService",
                        "name": `The Utility Company - ${location.name}`,
                        "image": "https://storage.googleapis.com/tgl_cdn/images/Medallions/Symbol.png",
                        "description": `Industrial Automation, Digital Twin Architecture, and AI Consulting specifically tailored for ${location.industryFocus} in ${location.name}, New Mexico.`,
                        "address": {
                            "@type": "PostalAddress",
                            "addressLocality": location.name,
                            "addressRegion": "NM",
                            "addressCountry": "US"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": location.lat,
                            "longitude": location.lng
                        },
                        "url": `https://theutilitycompany.com/new-mexico/${location.slug}`,
                        "telephone": "+1-800-AUTOMATE",
                        "priceRange": "$$$$"
                    })
                }}
            />

            <Footer />
        </main>
    );
}
