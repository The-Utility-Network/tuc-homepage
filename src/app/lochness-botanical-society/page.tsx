'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import ParallaxHero from '@/components/ParallaxHero';
import LochNessCycle from '@/components/LochNessCycle';
import SatelliteProject from '@/components/SatelliteProject';
import StakeholderInterestForm from '@/components/StakeholderInterestForm';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

// Theme Color - Botanical Green
const THEME_COLOR = '#2ECC71';

export default function LochNessPage() {
    return (
        <main className="bg-black text-white min-h-screen relative overflow-hidden font-sans selection:bg-green-500 selection:text-white">
            <Navbar themeColor={THEME_COLOR} />
            <BackButton color={THEME_COLOR} />

            <ParallaxHero
                image="/artifacts/tlnbg.png"
                title="THE LOCH NESS BOTANICAL SOCIETY"
                subtitle="The First NFT-Mediated Crypto Greenhouse"
                color={THEME_COLOR}
                medallion="https://engram1.blob.core.windows.net/tuc-homepage/Medallions/TLN.png"
            />

            <div className="relative z-10">
                {/* Background Grid */}
                <div className="fixed inset-0 pointer-events-none opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(${THEME_COLOR}40 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="max-w-7xl mx-auto px-6 py-24 space-y-32 relative">

                    {/* Mission */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="max-w-5xl mx-auto text-center space-y-8"
                    >
                        <div className="inline-block px-4 py-2 rounded-full border text-sm font-mono tracking-widest uppercase mb-4" style={{ borderColor: THEME_COLOR, color: THEME_COLOR }}>
                            Industrial Automation as a Service (I3AS)
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter">
                            Automated <span style={{ color: THEME_COLOR }}>Abundance</span>
                        </h2>
                        <div className="h-1 w-24 mx-auto" style={{ backgroundColor: THEME_COLOR }} />
                        <p className="text-xl text-gray-300 leading-relaxed font-medium max-w-4xl mx-auto">
                            The Loch Ness Botanical Society is revolutionizing food security through "Industrial Automation as a Service." We combine high-tech aquaponics with blockchain governance, allowing anyone to sponsor a "Grow Spot" and claim a share of the harvest—transforming agriculture into a distributed, digital asset.
                        </p>
                    </motion.section>

                    {/* Key Features */}
                    <motion.section
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {[
                            {
                                title: 'The Grow Spot',
                                desc: 'Your NFT represents a dedicated, automated growing position in our facility. You control what grows.',
                                icon: '🌱'
                            },
                            {
                                title: 'Aquaponic Ecosystem',
                                desc: 'A symbiotic environment where fish waste feeds plants, and plants filter water—90% less water usage.',
                                icon: '🐟'
                            },
                            {
                                title: 'Yield Appropriation',
                                desc: 'Automated distribution of physical harvest or revenue share directly to your wallet.',
                                icon: '🧺'
                            },
                            {
                                title: 'Perennial Waters',
                                desc: 'Our flagship collection featuring 4,200 automated plant sites for sustainable, year-round production.',
                                icon: '💧'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-green-500/50 transition-colors text-center"
                            >
                                <div className="text-4xl mb-4 h-12 flex items-center justify-center">{item.icon}</div>
                                <h3 className="text-lg font-bold mb-3" style={{ color: THEME_COLOR }}>{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.section>

                    {/* Technology Section */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="glass-panel p-10 md:p-16 rounded-2xl"
                    >
                        <div className="text-center mb-12">
                            <span className="text-sm font-mono tracking-widest uppercase mb-2 block" style={{ color: THEME_COLOR }}>The Tech</span>
                            <h2 className="text-3xl font-bold mb-6">Sustainable High-Yield Tech</h2>
                            <p className="text-gray-400 mb-8 leading-relaxed max-w-3xl mx-auto">
                                Our facilities utilize advanced hydroponic towers and aquaculture tanks monitored by IoT sensors. This "closed-loop" system eliminates soil degradation and fertilizer runoff while maximizing yield per square foot.
                            </p>
                            <ul className="flex flex-wrap justify-center gap-6 md:gap-12">
                                <li className="flex items-center gap-3">
                                    <span className="text-xl">🌿</span>
                                    <span className="font-bold text-gray-200">Zero Pesticides</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-xl">🔋</span>
                                    <span className="font-bold text-gray-200">Energy-Efficient</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-xl">🔗</span>
                                    <span className="font-bold text-gray-200">Verified Provenance</span>
                                </li>
                            </ul>
                        </div>

                        {/* Full Width Diagram */}
                        <div className="w-full mt-12">
                            <LochNessCycle />
                        </div>
                    </motion.section>

                    {/* THE SATELLITE PROJECT SECTION */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="relative p-10 md:p-16 rounded-3xl overflow-hidden"
                    >
                        {/* Transition Background: Deep Teal -> Synthwave Purple */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#2e022f] to-[#581c87] opacity-80" />
                        <div className="absolute inset-0 bg-[url('/artifacts/grid.png')] opacity-10 bg-repeat mix-blend-overlay" />

                        <div className="relative z-10">
                            <div className="text-center mb-12">
                                {/* TSP Medallion */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-24 h-24 relative animate-pulse-slow">
                                        <Image
                                            src="/Medallions/TSPAum1.png"
                                            alt="TSP Om Medallion"
                                            fill
                                            className="object-contain drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]"
                                        />
                                    </div>
                                </div>

                                <div className="inline-block px-4 py-2 rounded-full border border-pink-500/50 text-sm font-mono tracking-widest uppercase mb-4 text-pink-400 bg-pink-900/20">
                                    Franchise Expansion
                                </div>
                                <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400">
                                    The Satellite Project
                                </h2>

                                {/* Franchise Pilot Update */}
                                <div className="mb-8 max-w-2xl mx-auto bg-pink-900/30 border border-pink-500/30 rounded-xl p-4 backdrop-blur-sm">
                                    <p className="text-pink-200 font-semibold flex items-center justify-center gap-2">
                                        <span className="text-xl">🚀</span>
                                        Our first franchise has just finished its pilot program and is launching soon.
                                    </p>
                                </div>

                                <p className="text-xl text-pink-100/80 leading-relaxed font-medium mb-8 max-w-3xl mx-auto">
                                    Hyper-localized urban farming nodes. The Satellite Project deploys modular, high-density hydroponic units into the heart of Neo-Tokyo's concrete jungle, minimizing food miles to zero.
                                </p>
                                <ul className="flex flex-wrap justify-center gap-8 mb-8">
                                    <li className="flex items-center gap-3">
                                        <span className="text-xl">🏙️</span>
                                        <span className="font-bold text-pink-200">Urban Integration</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-xl">📡</span>
                                        <span className="font-bold text-pink-200">Remote Telemetry</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Full Width Diagram */}
                            <div className="w-full">
                                <SatelliteProject />
                            </div>
                        </div>
                    </motion.section>

                    {/* Stakeholder Interest Form */}
                    <section className="py-24 relative">
                        <div className="max-w-4xl mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                BECOME A <span style={{ color: THEME_COLOR }}>STAKEHOLDER</span>
                            </h2>
                            <p className="text-gray-400 mb-12">
                                Interested in becoming part of the future of sustainable agriculture? Register your interest below.
                            </p>
                            <StakeholderInterestForm themeColor={THEME_COLOR} />
                        </div>
                    </section>

                </div>
            </div>
            <Footer />
        </main>
    );
}
