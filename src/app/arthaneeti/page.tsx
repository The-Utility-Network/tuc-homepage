'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import ParallaxHero from '@/components/ParallaxHero';
import ArthaneetiVoting from '@/components/ArthaneetiVoting';
import ArthaneetiContactForm from '@/components/ArthaneetiContactForm';

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

// Theme Color - Civic Blue
const THEME_COLOR = '#3B82F6';

export default function ArthaneetiPage() {
    return (
        <main className="bg-black text-white min-h-screen relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
            <Navbar themeColor={THEME_COLOR} />
            <BackButton color={THEME_COLOR} />

            <ParallaxHero
                image="/artifacts/arbg.png"
                title="ARTHANEETI"
                subtitle="Democratizing Political Participation through Blockchain"
                color={THEME_COLOR}
                medallion="https://engram1.blob.core.windows.net/tuc-homepage/Medallions/ar.png"
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
                            The Arthanagrik Identity
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter">
                            Incentivized <span style={{ color: THEME_COLOR }}>Civic Action</span>
                        </h2>
                        <div className="h-1 w-24 mx-auto" style={{ backgroundColor: THEME_COLOR }} />
                        <p className="text-xl text-gray-300 leading-relaxed font-medium max-w-4xl mx-auto">
                            Arthaneeti redefines the social contract by introducing the "Arthanagrik"—a blockchain-based digital identity that gamifies citizenship. We build self-sustaining economic models where citizens are rewarded for engaging in governance, proposing policies, and improving their communities.
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
                                title: 'The Arthanagrik',
                                desc: 'Your digital citizen pass. It is the gateway to voting, proposals, and earning rewards within the ecosystem.',
                                icon: '🆔'
                            },
                            {
                                title: 'Civic Incentives',
                                desc: 'Earn tangible rewards for surveys, debates, and community drives. Engagement has value.',
                                icon: '🏆'
                            },
                            {
                                title: 'Policy Proposals',
                                desc: 'Directly propose and vote on initiatives. Influence local governance with transparent, on-chain records.',
                                icon: '🗳️'
                            },
                            {
                                title: 'Self-Sustaining Economy',
                                desc: 'Economic models designed to fund public goods and reward participation without external reliance.',
                                icon: '♻️'
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeInUp}
                                className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition-colors text-center"
                            >
                                <div className="text-4xl mb-4 h-12 flex items-center justify-center">{item.icon}</div>
                                <h3 className="text-lg font-bold mb-3" style={{ color: THEME_COLOR }}>{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </motion.section>

                    {/* Governance Process */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="glass-panel p-10 md:p-16 rounded-2xl"
                    >
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="text-sm font-mono tracking-widest uppercase mb-2 block" style={{ color: THEME_COLOR }}>Workflow</span>
                                <h2 className="text-3xl font-bold mb-6">Democracy 2.0</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors">
                                        <div className="text-3xl">💡</div>
                                        <div>
                                            <h4 className="font-bold">Ideation & Debate</h4>
                                            <p className="text-sm text-gray-400 mt-1">Submit proposals for community improvement. Engage in structured, constructive debates driven by reputation scores.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors">
                                        <div className="text-3xl">🗳️</div>
                                        <div>
                                            <h4 className="font-bold">Voting & Consensus</h4>
                                            <p className="text-sm text-gray-400 mt-1">Transparent, immutable voting using your Arthanagrik ID. Results are verifiable and binding on-chain.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors">
                                        <div className="text-3xl">💰</div>
                                        <div>
                                            <h4 className="font-bold">Execution & Reward</h4>
                                            <p className="text-sm text-gray-400 mt-1">Successful proposals trigger smart contract execution. Contributors receive rewards for their civic labor.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative h-full min-h-[400px] rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                                <ArthaneetiVoting />
                            </div>
                        </div>
                    </motion.section>

                    {/* Registration Form */}
                    <section className="py-24 relative">
                        <div className="max-w-4xl mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                BECOME AN <span style={{ color: THEME_COLOR }}>ARTHANAGRIK</span>
                            </h2>
                            <p className="text-gray-400 mb-12">
                                Join the movement to democratize political participation and earn from your civic engagement.
                            </p>
                            <ArthaneetiContactForm themeColor={THEME_COLOR} />
                        </div>
                    </section>

                </div>
            </div>
            <Footer />
        </main>
    );
}
