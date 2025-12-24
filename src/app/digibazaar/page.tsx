'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import ParallaxHero from '@/components/ParallaxHero';
import DigiBazaarSweep from '@/components/DigiBazaarSweep';

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

// Theme Color - Marketplace Red
const THEME_COLOR = '#EF4444';

export default function DigiBazaarPage() {
    return (
        <main className="bg-black text-white min-h-screen relative overflow-hidden font-sans selection:bg-red-500 selection:text-white">
            <Navbar themeColor={THEME_COLOR} />
            <BackButton color={THEME_COLOR} />

            <ParallaxHero
                image="/artifacts/dbbg.png"
                title="DIGIBAZAAR"
                subtitle="The Home of the Creative Revolution"
                color={THEME_COLOR}
                medallion="https://engram1.blob.core.windows.net/tuc-homepage/Medallions/DigiBazaarMedallion.png"
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
                            Digital Assets for the Real World
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter">
                            The <span style={{ color: THEME_COLOR }}>$2 Sweep</span>
                        </h2>
                        <div className="h-1 w-24 mx-auto" style={{ backgroundColor: THEME_COLOR }} />
                        <p className="text-xl text-gray-300 leading-relaxed font-medium max-w-4xl mx-auto">
                            DigiBazaar is more than a marketplace—it's an asset discovery engine. Home to the "Creative Revolution," we democratize collection with our signature "$2 Sweep," allowing users to discover and sweep floor-price assets instantly. We connect creators and collectors through frictionless, low-barrier commerce.
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
                                title: '$2 Sweep',
                                desc: 'Our unique discovery mechanism allows you to "sweep" diverse assets for just $2. Low risk, high discovery.',
                                icon: '🧹'
                            },
                            {
                                title: 'Creative Revolution',
                                desc: 'Empowering artists with tools for visibility and value. We are the launchpad for the next wave of digital creativity.',
                                icon: '🎨'
                            },
                            {
                                title: 'Osiris Powered',
                                desc: 'Native integration with Osiris Protocol ensures enterprise-grade security and seamless cross-chain interoperability.',
                                icon: '⚡'
                            },
                            {
                                title: 'Collection Mints',
                                desc: 'Primary launchpad for exclusive collections. Secure your spot in the ecosystem\'s most sought-after drops.',
                                icon: '🚀'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-red-500/50 transition-colors text-center"
                            >
                                <div className="text-4xl mb-4 h-12 flex items-center justify-center">{item.icon}</div>
                                <h3 className="text-lg font-bold mb-3" style={{ color: THEME_COLOR }}>{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.section>

                    {/* Marketplace Preview */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="glass-panel p-10 md:p-16 rounded-2xl"
                    >
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 relative h-full min-h-[400px] rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                                <DigiBazaarSweep />
                            </div>
                            <div className="order-1 md:order-2">
                                <span className="text-sm font-mono tracking-widest uppercase mb-2 block" style={{ color: THEME_COLOR }}>The Platform</span>
                                <h2 className="text-3xl font-bold mb-6">Frictionless Trading</h2>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    Whether you're a seasoned trader or a first-time collector, DigiBazaar provides the tools you need. From detailed analytics to one-click purchasing, we remove the barriers to entry in the digital asset economy.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-white/5 text-center">
                                        <div className="text-2xl font-bold text-white mb-1">Multi-Chain</div>
                                        <div className="text-xs text-gray-500">Support</div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-white/5 text-center">
                                        <div className="text-2xl font-bold text-white mb-1">Low Fees</div>
                                        <div className="text-xs text-gray-500">Transaction</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* CTA */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center py-16"
                    >
                        <h2 className="text-3xl font-bold mb-6">Find Your Next Gem</h2>
                        <a
                            href="https://digibazaar.io"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 rounded-full font-bold text-black transition-transform hover:scale-105 inline-block"
                            style={{ backgroundColor: THEME_COLOR }}
                        >
                            VISIT DIGIBAZAAR
                        </a>
                    </motion.section>

                </div>
            </div>
            <Footer />
        </main>
    );
}
