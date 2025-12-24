'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import ParallaxHero from '@/components/ParallaxHero';
import GraineLedgerProcess from '@/components/GraineLedgerProcess';
import GraineLedgerContactForm from '@/components/GraineLedgerContactForm';

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

// Theme Color - Whiskey Orange
const THEME_COLOR = '#F97316';

export default function GraineLedgerPage() {
    return (
        <main className="bg-black text-white min-h-screen relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white">
            <Navbar themeColor={THEME_COLOR} />
            <BackButton color={THEME_COLOR} />

            <ParallaxHero
                image="/artifacts/tglbg.png"
                title="THE GRAINE LEDGER"
                subtitle="The First NFT-Mediated Crypto Distillery"
                color={THEME_COLOR}
                medallion="https://engram1.blob.core.windows.net/tuc-homepage/Medallions/TGL.png"
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
                            Distilling the Future
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter">
                            NFTs as <span style={{ color: THEME_COLOR }}>Deeds</span>
                        </h2>
                        <div className="h-1 w-24 mx-auto" style={{ backgroundColor: THEME_COLOR }} />
                        <p className="text-xl text-gray-300 leading-relaxed font-medium max-w-4xl mx-auto">
                            The Graine Ledger is not just a digital asset—it's a real-world distillery revolution. We use NFTs as secure, immutable deeds to physical casks of fine whiskey. Owners don't just hold a token; they hold creative control over the mashbill, char levels, and aging process, creating a truly bespoke spirit.
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
                                title: 'The American Genesis',
                                desc: 'Our inaugural collection where owners vote on the mashbill and define the char level of their casks.',
                                icon: '🇺🇸'
                            },
                            {
                                title: 'NFT as Deed',
                                desc: 'Your NFT is the legal title to a physical barrel in our bonded warehouse. Sell the token, transfer the barrel.',
                                icon: '📜'
                            },
                            {
                                title: 'Custom Cask Styles',
                                desc: 'Choose from distinct finishing options and wood types to craft a unique flavor profile.',
                                icon: '🪵'
                            },
                            {
                                title: 'Lodge Access',
                                desc: 'Holders gain exclusive access to The Graine Ledger Lodge & Resort for annual tastings and events.',
                                icon: 'retreat'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-orange-500/50 transition-colors text-center"
                            >
                                <div className="text-4xl mb-4 h-12 flex items-center justify-center">
                                    {item.icon === 'retreat' ? '🏰' : item.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-3" style={{ color: THEME_COLOR }}>{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.section>

                    {/* How It Works */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="glass-panel p-10 md:p-16 rounded-2xl"
                    >
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="text-sm font-mono tracking-widest uppercase mb-2 block" style={{ color: THEME_COLOR }}>The Process</span>
                                <h2 className="text-3xl font-bold mb-6">From Blockchain to Bottle</h2>
                                <ul className="space-y-6">
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 text-black" style={{ backgroundColor: THEME_COLOR }}>1</div>
                                        <div>
                                            <h4 className="font-bold mb-1">Mint Your Deed</h4>
                                            <p className="text-gray-400 text-sm">Purchase a Graine Ledger NFT. This is your proof of ownership and ticket to the ecosystem.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 text-black" style={{ backgroundColor: THEME_COLOR }}>2</div>
                                        <div>
                                            <h4 className="font-bold mb-1">Customize Production</h4>
                                            <p className="text-gray-400 text-sm">Use our DApp to vote on grain bills (mashbills) and select aging parameters for your batch.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 text-black" style={{ backgroundColor: THEME_COLOR }}>3</div>
                                        <div>
                                            <h4 className="font-bold mb-1">Track Maturation</h4>
                                            <p className="text-gray-400 text-sm">Watch your investment age. Real-time data tracks temperature, humidity, and years in the cask.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 text-black" style={{ backgroundColor: THEME_COLOR }}>4</div>
                                        <div>
                                            <h4 className="font-bold mb-1">Bottle or Trade</h4>
                                            <p className="text-gray-400 text-sm">When ready, request bottling of your private label whiskey, or sell the NFT to a new investor.</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-8">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold mb-4 text-orange-500">The Digital Distillery</h3>
                                    <p className="text-gray-400 text-sm">
                                        Our on-chain process mirrors the physical art of whiskey making. Every step from the mashbill mixing to the barrel char level is recorded as metadata on your NFT deed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Full Process Visualization Section */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="w-full"
                    >
                        <div className="text-center mb-12">
                            <span className="text-sm font-mono tracking-widest uppercase mb-2 block" style={{ color: THEME_COLOR }}>The Journey</span>
                            <h2 className="text-3xl md:text-5xl font-bold">Liquid Architecture</h2>
                            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">See how your digital choice flows into physical reality.</p>
                        </div>
                        <GraineLedgerProcess />
                    </motion.section>

                    {/* Stakeholder Contact Form */}
                    <section className="py-24 relative">
                        <div className="max-w-4xl mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                OWN A <span style={{ color: THEME_COLOR }}>PIECE OF HISTORY</span>
                            </h2>
                            <p className="text-gray-400 mb-12">
                                Ready to craft your own whiskey legacy? Tell us about your vision.
                            </p>
                            <GraineLedgerContactForm themeColor={THEME_COLOR} />
                        </div>
                    </section>

                </div>
            </div>
            <Footer />
        </main>
    );
}
