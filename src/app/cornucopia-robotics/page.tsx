'use client';

import { motion } from 'framer-motion';
import AgriGridBackground from '@/components/AgriGridBackground';
import ParallaxHero from '@/components/ParallaxHero';
import CornucopiaContactForm from '@/components/CornucopiaContactForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

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
            staggerChildren: 0.2
        }
    }
};

export default function CornucopiaRoboticsPage() {
    return (
        <main className="bg-black text-white min-h-screen relative overflow-hidden font-mono selection:bg-pink-500 selection:text-white">
            <Navbar themeColor='#EC4899' />
            <BackButton color="#EC4899" />

            <ParallaxHero
                image="/artifacts/cornucopia_bg.png"
                title="CORNUCOPIA ROBOTICS"
                subtitle="AUTOMATED PRECISION AGRICULTURE"
                color="#EC4899"
                medallion="https://engram1.blob.core.windows.net/tuc-homepage/Medallions/CornucopiaRobotics.png"
            />

            <div className="relative z-10">
                <AgriGridBackground />

                {/* Content Container */}
                <div className="max-w-7xl mx-auto px-6 py-24 space-y-32 relative">

                    {/* 1. Project Brief */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="max-w-4xl mx-auto text-center space-y-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-white border-b-2 border-[#EC4899] inline-block pb-4">
                            The <span className="text-[#EC4899]">Harvest</span> Algorithm
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed font-light">
                            Cornucopia Robotics applies the I3AS framework to the most critical industry of all: agriculture. We are deploying autonomous swarm intelligence to manage crop lifecycles with sub-millimeter precision. By removing manual labor and optimizing resource inputs via blockchain verification, we are rewriting the equation of food security.
                        </p>
                    </motion.section>

                    {/* 2. Objectives & Financials */}
                    <motion.section
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid lg:grid-cols-2 gap-12"
                    >
                        {/* Objectives */}
                        <motion.div variants={fadeInUp} className="bg-neutral-900/80 backdrop-blur-md p-8 rounded-xl border border-pink-500/30 shadow-2xl relative">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                            </div>
                            {/* Escaped Characters */}
                            <h3 className="text-2xl font-bold mb-6 text-[#EC4899] font-mono">
                                &gt;&gt; SYSTEM OBJECTIVES
                            </h3>
                            <ul className="space-y-6 text-gray-300 font-mono text-sm">
                                <li className="flex items-start group">
                                    <span className="text-[#EC4899] mr-4 pt-1 opacity-50 group-hover:opacity-100 transition-opacity">01</span>
                                    <span><strong>ZERO LABOR:</strong> Fully autonomous planting, treatment, and harvesting via solar-powered drone swarms.</span>
                                </li>
                                <li className="flex items-start group">
                                    <span className="text-[#EC4899] mr-4 pt-1 opacity-50 group-hover:opacity-100 transition-opacity">02</span>
                                    <span><strong>HYPER-LOCALIZATION:</strong> Decentralized vertical farming towers located within urban centers to eliminate logistics costs.</span>
                                </li>
                                <li className="flex items-start group">
                                    <span className="text-[#EC4899] mr-4 pt-1 opacity-50 group-hover:opacity-100 transition-opacity">03</span>
                                    <span><strong>PLOT OWNERSHIP:</strong> NFT-based tokenization of robotically managed plots, enabling remote control and direct harvest benefits.</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Financial Breakdown (Mock) */}
                        <motion.div variants={fadeInUp} className="bg-neutral-900/80 backdrop-blur-md p-8 rounded-xl border border-pink-500/30 shadow-2xl">
                            <h3 className="text-2xl font-bold mb-6 text-[#EC4899] font-mono border-b border-gray-800 pb-4">
                                &gt;&gt; CAPITAL ALLOCATION
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2 font-mono text-xs text-gray-400">
                                        <span>HARDWARE FLEET</span>
                                        <span>45%</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "45%" }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-[#EC4899]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2 font-mono text-xs text-gray-400">
                                        <span>LAND ACQUISITION (SMART LEASES)</span>
                                        <span>25%</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "25%" }}
                                            transition={{ duration: 1, delay: 0.7 }}
                                            className="h-full bg-green-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2 font-mono text-xs text-gray-400">
                                        <span>AI MODEL TRAINING</span>
                                        <span>20%</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "20%" }}
                                            transition={{ duration: 1, delay: 0.9 }}
                                            className="h-full bg-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2 font-mono text-xs text-gray-400">
                                        <span>OPERATIONAL RESERVES</span>
                                        <span>10%</span>
                                    </div>
                                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "10%" }}
                                            transition={{ duration: 1, delay: 1.1 }}
                                            className="h-full bg-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.section>

                    {/* 3. Operational Workflow */}
                    <motion.section
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.h2 variants={fadeInUp} className="text-3xl font-bold text-center mb-16 text-white font-mono">OPERATIONAL MATRIX</motion.h2>
                        <div className="grid md:grid-cols-4 gap-8">
                            {[
                                { title: "SCAN", text: "LIDAR mapping of soil composition.", color: "border-blue-500" },
                                { title: "SEED", text: "Drone deployment of bio-encapsulated seeds.", color: "border-green-500" },
                                { title: "TREAT", text: "Spot-treatment via micro-spraying.", color: "border-yellow-500" },
                                { title: "HARVEST", text: "Automated retrieval and cold-chain sort.", color: "border-[#EC4899]" },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className={`p-6 bg-black border-l-4 ${item.color} border-t border-r border-b border-gray-800 hover:bg-neutral-900 transition-colors duration-300 group`}
                                >
                                    <div className="text-4xl font-bold text-gray-700 group-hover:text-white transition-colors duration-300 font-mono mb-4">0{i + 1}</div>
                                    <h4 className="text-xl font-bold text-white mb-2 font-mono">{item.title}</h4>
                                    <p className="text-gray-400 text-sm font-mono">{item.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* 4. Participants */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-[#EC4899]/10 border border-[#EC4899]/30 p-10 rounded-2xl relative overflow-hidden"
                    >
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6 text-white font-mono uppercase">Network Nodes</h2>
                                <p className="text-gray-300 mb-6">
                                    Each NFT represents a robotically managed plot you control remotely. Excess harvest is sold to cooperative grocery stores, with earnings paid in your choice of <span className="text-[#EC4899]">USDC, BTC, ETH, or SOL</span>.
                                </p>
                                <ul className="space-y-3 font-mono text-sm text-gray-400">
                                    <li className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-2" /> AGRONOMISTS (Yield Optimization)</li>
                                    <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2" /> ROBOTICS ENGINEERS (Fleet Maintenance)</li>
                                    <li className="flex items-center"><span className="w-2 h-2 bg-[#EC4899] rounded-full mr-2" /> LAND PARTNERS (Asset Leasing)</li>
                                </ul>
                            </div>
                            <div className="h-64 bg-black/50 rounded-lg border border-gray-700 flex items-center justify-center p-8">
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-mono text-[#EC4899] mb-2 font-bold animate-pulse">LAUNCHING SOON</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-widest">Network Activation Pending</div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* 5. Contact Section */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="pt-12"
                    >
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold uppercase tracking-tighter mb-4 font-mono text-[#EC4899]">Initiate Uplink</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto font-mono text-xs">
                                SECURED CHANNEL // ENCRYPTION: ACTIVE // DEPLOYMENT READY
                            </p>
                        </div>
                        <CornucopiaContactForm />
                    </motion.section>

                </div>
            </div>
            <Footer />
        </main>
    );
}
