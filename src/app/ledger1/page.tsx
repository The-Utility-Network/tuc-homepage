'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import ParallaxHero from '@/components/ParallaxHero';
import Ledger1Neural from '@/components/Ledger1Neural';

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

// Theme Color - Cyber Red
const THEME_COLOR = '#DC2626';

export default function Ledger1Page() {
    return (
        <main className="bg-black text-white min-h-screen relative overflow-hidden font-sans selection:bg-red-500 selection:text-white">
            <Navbar themeColor={THEME_COLOR} />
            <BackButton color={THEME_COLOR} />

            <ParallaxHero
                image="/artifacts/ledgerbg.png"
                title="LEDGER1"
                subtitle="Neuromimetic Business Architecture"
                color={THEME_COLOR}
                medallion="https://engram1.blob.core.windows.net/tuc-homepage/Medallions/Ledger1.png"
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
                            The Cognitive Enterprise
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter">
                            Living <span style={{ color: THEME_COLOR }}>Ontologies</span>
                        </h2>
                        <div className="h-1 w-24 mx-auto" style={{ backgroundColor: THEME_COLOR }} />
                        <p className="text-xl text-gray-300 leading-relaxed font-medium max-w-4xl mx-auto">
                            Ledger1 moves beyond static ERPs to build "Cognitive Enterprises." Our platform digitizes business reality into a "Living Ontology"—objects, actions, and decisions that adapt, learn, and execute at the speed of thought. By mimicking the plasticity of neural networks, we enable businesses to evolve instantaneously.
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
                                title: 'AI-Assisted ERP',
                                desc: 'A universal ERP where "Varuni," your AI operations agent, plans, analyzes, and executes complex tasks via natural language.',
                                icon: '🤖'
                            },
                            {
                                title: 'Neuromimetic',
                                desc: 'Business architecture that acts like a brain—forming new connections instantly without code rewrites.',
                                icon: '🧠'
                            },
                            {
                                title: 'PortalPay',
                                desc: 'Web3-native commerce engine supporting 90+ chains and 6,500+ tokens. Frictionless global payments.',
                                icon: '💳'
                            },
                            {
                                title: 'VoiceHub',
                                desc: 'Enterprise voice AI that handles customer intelligence, autonomous sales, and support at scale.',
                                icon: '🎙️'
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

                    {/* Technology Section */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="glass-panel p-10 md:p-16 rounded-2xl"
                    >
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="order-2 md:order-1 relative h-full min-h-[400px] rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                                <Ledger1Neural />
                            </div>
                            <div className="order-1 md:order-2">
                                <span className="text-sm font-mono tracking-widest uppercase mb-2 block" style={{ color: THEME_COLOR }}>The Approach</span>
                                <h2 className="text-3xl font-bold mb-6">Democratizing Advanced Ontologies</h2>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    We bring "Big Tech" analytical supremacy to Main Street. Our system models your entire business reality, allowing for predictive control and autonomous optimization previously available only to the world's largest corporations.
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <span className="text-xl">⚡</span>
                                        <span className="font-bold text-gray-200">Execute at Speed of Thought</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-xl">🔄</span>
                                        <span className="font-bold text-gray-200">Adaptive Business Logic</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <span className="text-xl">🌐</span>
                                        <span className="font-bold text-gray-200">Unified Digital Twin</span>
                                    </li>
                                </ul>
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
                        <h2 className="text-3xl font-bold mb-6">Upgrade to Intelligence</h2>
                        <a
                            href="https://ledger1.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 rounded-full font-bold text-black transition-transform hover:scale-105 inline-block"
                            style={{ backgroundColor: THEME_COLOR }}
                        >
                            VISIT LEDGER1.AI
                        </a>
                    </motion.section>

                </div>
            </div>
            <Footer />
        </main>
    );
}
