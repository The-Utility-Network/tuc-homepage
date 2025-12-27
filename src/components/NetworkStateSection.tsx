'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function NetworkStateSection() {
    return (
        <section className="relative py-32 px-6 overflow-hidden bg-black">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#F54029]/10 rounded-full blur-[120px] opacity-20" />
                <div className="absolute inset-0 bg-[radial-gradient(#F54029_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.05]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Medallion Side */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="flex justify-center lg:justify-start"
                    >
                        <div className="relative w-72 h-72 md:w-96 md:h-96 group">
                            {/* Glow behind medallion */}
                            <div className="absolute inset-0 bg-[#F54029]/30 rounded-full blur-3xl group-hover:bg-[#F54029]/50 transition-colors duration-700" />

                            <Image
                                src="/Medallions/TheUtilityNetwork.png"
                                alt="The Utility Network Medallion"
                                fill
                                className="object-contain relative z-10 drop-shadow-[0_0_30px_rgba(245,64,41,0.3)] group-hover:drop-shadow-[0_0_50px_rgba(245,64,41,0.5)] transition-all duration-700 hover:scale-105"
                            />
                        </div>
                    </motion.div>

                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left space-y-8"
                    >
                        <div>
                            <span className="inline-block px-4 py-1 rounded-full bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] text-xs font-mono tracking-[0.2em] uppercase mb-4">
                                The Grand Architecture
                            </span>
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase leading-[0.9]">
                                Sovereignty <br />
                                <span className="text-[#F54029]">Redefined.</span>
                            </h2>
                        </div>

                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                            The Utility Company and its specialized subsidiaries—from BasaltHQ to Osiris Protocol—are not merely corporate entities. They are the foundational pillars of <strong>The Utility Network</strong>: a decentralized, cloud-first <strong>Network State</strong>.
                        </p>

                        <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-2xl">
                            By integrating digital governance, automated industrial logic, and cryptographic verification, we are building a new form of human organization that transcends geographical borders and legacy institutional decay.
                        </p>

                        <div className="pt-4">
                            <Link
                                href="/network-state"
                                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full transition-all hover:pr-12 active:scale-95"
                            >
                                EXPLORE THE NETWORK STATE
                                <svg
                                    className="absolute right-6 w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
