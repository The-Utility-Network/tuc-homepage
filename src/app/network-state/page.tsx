'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import Image from 'next/image';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.2 } }
};

export default function NetworkStatePage() {
    const THEME_BLUE = '#F54029';

    return (
        <main className="bg-[#050505] text-white min-h-screen relative overflow-hidden selection:bg-[#F54029]">
            <Navbar themeColor={THEME_BLUE} />
            <BackButton color={THEME_BLUE} />

            {/* Hero Section */}
            <section className="relative pt-40 pb-24 px-6">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#F54029]/30 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#F54029]/10 rounded-full blur-[150px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <motion.div variants={fadeInUp} className="flex justify-center mb-12">
                            <div className="relative w-48 h-48 md:w-64 md:h-64">
                                <Image
                                    src="/Medallions/TheUtilityNetwork.png"
                                    alt="The Utility Network"
                                    fill
                                    className="object-contain drop-shadow-[0_0_30px_rgba(245,64,41,0.4)]"
                                />
                            </div>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
                            The Utility <br />
                            <span className="text-[#F54029]">Network State.</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-400 font-medium leading-relaxed mb-12">
                            A highly aligned online community with the capacity for collective action that builds entities in physical space and eventually gains diplomatic recognition from pre-existing states.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Content Core */}
            <section className="relative py-24 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto space-y-32">

                    {/* The Thesis */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight flex items-center gap-4">
                            <span className="w-12 h-[2px] bg-[#F54029]" />
                            The Core Thesis
                        </h2>
                        <div className="grid md:grid-cols-2 gap-12 text-gray-300 text-lg leading-relaxed">
                            <div className="space-y-6">
                                <p>
                                    As legacy institutions undergo a period of "re-centralization and decay," the traditional Westphalian system of nation-states is facing an unprecedented crisis of legitimacy. Geography, once the primary determinant of community and law, is being superseded by alignment.
                                </p>
                                <p>
                                    The Utility Network is the implementation of Balaji Srinivasan's <strong>Network State</strong> framework. We are not just a collection of companies; we are a digital archipelago of aligned individuals who coordinate via the cloud to manifest industrial reality in the physical world.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <p>
                                    Our subsidiaries—BasaltHQ, Osiris Protocol, Requiem Electric, and others—serve as the "functions" of this state. Basin-scale automation, cryptographic verification of identity, and decentralized energy production are the sovereign services we provide to our citizens.
                                </p>
                                <p>
                                    We move from "Cloud First" to "Land Last," building a distributed network of physical presence that operates under a unified digital logic.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Three Pillars */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Cloud Protocol",
                                desc: "Our social and economic coordination happens first in digital space. Zero-knowledge proofs and smart contracts replace traditional bureaucratic paper-shuffling.",
                                icon: "☁️"
                            },
                            {
                                title: "Network Archipelago",
                                desc: "Our physical presence is distributed globally, connected by high-speed transit and local automation nodes, forming a non-contiguous sovereign network.",
                                icon: "🌐"
                            },
                            {
                                title: "Crowdfunded Territory",
                                desc: "As our network grows in economic power, we acquire physical land and infrastructure, establishing autonomous special zones and restorative habitats.",
                                icon: "🏗️"
                            }
                        ].map((pillar, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={fadeInUp}
                                className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-[#F54029]/30 transition-all group"
                            >
                                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{pillar.icon}</div>
                                <h3 className="text-xl font-bold mb-4 uppercase tracking-wide group-hover:text-[#F54029] transition-colors">{pillar.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{pillar.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Extensive Content: Implications */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="bg-[#F54029]/5 rounded-[40px] p-8 md:p-16 border border-[#F54029]/10"
                    >
                        <h2 className="text-4xl font-extrabold mb-12 text-center uppercase tracking-tighter">Implications of the <br /> <span className="text-[#F54029]">Network State</span></h2>

                        <div className="space-y-16">
                            <div className="grid md:grid-cols-3 gap-12">
                                <div className="space-y-4">
                                    <h4 className="text-[#F54029] font-mono text-sm uppercase font-bold">01. Dynamic Law</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Law becomes code. Compliance is verified cryptographically in real-time, removing the need for slow, bias-laden judicial systems for commercial logic.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[#F54029] font-mono text-sm uppercase font-bold">02. Exit over Voice</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        Instead of fighting doomed political battles, citizens "exit" to a network that provides better services, more transparency, and direct economic participation.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[#F54029] font-mono text-sm uppercase font-bold">03. Moral Innovation</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        A Network State can experiment with new social configurations—focusing on regenerative agriculture, AI-driven education, or radical longevity—without permission.
                                    </p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <div className="prose prose-invert max-w-none text-gray-400 space-y-6">
                                    <p>
                                        The implication for The Utility Company is profound. Every subsidiary we launch is a piece of the <strong>Sovereign Stack</strong>. Requiem Electric provides the decentralized power; BasaltHQ provides the collective intelligence; DigiBazaar provides the peer-to-peer marketplace.
                                    </p>
                                    <p>
                                        When these pieces are connected via The Utility Network, they cease to be simple SaaS products. They become the <strong>Utility of State</strong>. We are building the infrastructure for a society that is decentralized by design and sovereign by default.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Final CTA */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center py-24"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 uppercase italic">Join the Network State</h2>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <a
                                href="https://discord.gg/scHwVByn9m"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-10 py-5 bg-[#F54029] text-white font-black rounded-full hover:bg-red-700 transition-all hover:scale-105"
                            >
                                CITIZEN REGISTRATION
                            </a>
                            <a
                                href="/network-state/docs"
                                className="px-10 py-5 bg-white/10 text-white font-black rounded-full hover:bg-white/20 transition-all"
                            >
                                READ WHITEPAPER
                            </a>
                        </div>
                    </motion.div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
