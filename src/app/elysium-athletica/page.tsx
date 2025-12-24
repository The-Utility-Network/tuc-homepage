'use client';

import { motion } from 'framer-motion';
import PulsingBackground from '@/components/PulseBackground';
import ParallaxHero from '@/components/ParallaxHero';
import ElysiumContactForm from '@/components/ElysiumContactForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';

// Variantes for Staggered Animations
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

export default function ElysiumAthleticaPage() {
    return (
        <main className="bg-white text-black min-h-screen relative overflow-hidden font-sans selection:bg-red-500 selection:text-white">
            <Navbar themeColor='#f54029' />
            <BackButton color="#f54029" />

            {/* Background is handled by PulseBackground component for the content area, 
          but we might want a solid white base behind it to be sure. */}

            <ParallaxHero
                image="/artifacts/elysium_bg.png"
                title="ELYSIUM ATHLETICA"
                subtitle="The Future of Sports Operations & AR Experiences"
                color="#f54029"
                medallion="https://engram1.blob.core.windows.net/tuc-homepage/Medallions/Elysium.png"
            />

            <div className="relative z-10">
                <PulsingBackground />

                {/* Content Container */}
                <div className="max-w-7xl mx-auto px-6 py-24 space-y-32 relative">

                    {/* 1. Project Brief & AR Visualization */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="max-w-6xl mx-auto space-y-12"
                    >
                        <div className="text-center max-w-4xl mx-auto space-y-8">
                            <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter text-black">
                                The <span className="text-[#f54029]">Apex</span> of Operations
                            </h2>
                            <div className="h-1 w-24 bg-[#f54029] mx-auto" />
                            <p className="text-xl text-gray-700 leading-relaxed font-medium">
                                Elysium Athletica is the world's first decentralized sports ecosystem, built on the I3AS framework. We are redefining the relationship between fans, franchises, and live events by tokenizing sports operations and experiences.
                            </p>
                        </div>

                        {/* Video Feature */}
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-black">
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-auto"
                            >
                                <source src="/videos/elysium_demo.mp4" type="video/mp4" />
                            </video>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-8">
                                <p className="text-white text-lg font-mono">
                                    <span className="text-[#f54029] font-bold">{'>'}{'>'}  VISUAL FEED:</span> REAL-TIME STADIUM AUGMENTATION
                                </p>
                            </div>
                        </div>
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
                        <motion.div variants={fadeInUp} className="bg-white/80 backdrop-blur-md p-8 rounded-xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                            <h3 className="text-2xl font-bold mb-6 flex items-center">
                                <span className="w-3 h-3 bg-[#f54029] rounded-full mr-3 animate-pulse" />
                                STRATEGIC VECTORS
                            </h3>
                            <ul className="space-y-6 text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-[#f54029] mr-4 font-bold text-lg">01.</span>
                                    <div>
                                        <div className="font-bold text-lg">Immersive AR Interfaces</div>
                                        <p className="text-sm text-gray-600 mt-1">Developing state-of-the-art AR overlays for stadium and broadcast audiences, visualizing real-time probability stats, player trajectory, and biometric fatigue levels.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#f54029] mr-4 font-bold text-lg">02.</span>
                                    <div>
                                        <div className="font-bold text-lg">Tokenized Franchise Operations</div>
                                        <p className="text-sm text-gray-600 mt-1">Fractionalizing ownership of team logistics, merchandise supply chains, and venue management revenue streams, allowing fans to participate in the business of sport.</p>
                                    </div>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-[#f54029] mr-4 font-bold text-lg">03.</span>
                                    <div>
                                        <div className="font-bold text-lg">Predictive Performance Data</div>
                                        <p className="text-sm text-gray-600 mt-1">Securely on-chaining athlete biometrics for predictive analytics, injury prevention modeling, and high-fidelity fantasy league integration.</p>
                                    </div>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Financial Breakdown (Mock) */}
                        <motion.div variants={fadeInUp} className="bg-black text-white p-8 rounded-xl border border-gray-800 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#f54029] blur-[80px] opacity-20" />
                            <h3 className="text-2xl font-bold mb-6 text-white border-b border-gray-700 pb-4">
                                ECOSYSTEM DISTRIBUTION
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-3xl font-bold text-[#f54029]">40%</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">AR Infrastructure</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-[#f54029]">30%</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">Venue Partnerships</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-[#f54029]">15%</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">Model Training (SAM3)</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-[#f54029]">15%</div>
                                    <div className="text-sm text-gray-400 uppercase tracking-widest mt-1">DAO Treasury</div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-gray-500 font-mono">
                                *PROJECTED ALLOCATION. SUBJECT TO DAO VOTE V1.2
                            </div>
                        </motion.div>
                    </motion.section>

                    {/* 3. Technology Core (SAM3 Integration) */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl relative"
                    >
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }} />
                        <div className="p-10 md:p-14 relative z-10">
                            <div className="text-[#f54029] font-bold tracking-widest text-sm mb-2 uppercase">Core Technology</div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Built on SAM3</h2>
                            <p className="text-gray-300 leading-relaxed mb-6 max-w-4xl">
                                Our AR experiences are powered by the <span className="text-white font-bold">Segment Anything Model 3 (SAM3)</span> foundation. This cutting-edge vision model allows for zero-shot generalization to new objects and visual domains, enabling our system to distinctively identify and track thousands of moving elements within a crowded stadium environment in real-time.
                            </p>
                            <ul className="space-y-3 text-gray-400 text-sm mb-10">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f54029] mr-3" /> Real-time semantic segmentation of players & ball trajectory</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f54029] mr-3" /> Occlusion handling in high-density crowds</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-[#f54029] mr-3" /> Instant extraction of biomechanical metadata</li>
                            </ul>
                            {/* SAM3 Diagram */}
                            <div className="border border-white/10 rounded-xl bg-black/40 backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[#f54029]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img src="/artifacts/sam3_diagram.png" alt="SAM3 Architecture" className="w-full h-auto" />
                                <div className="text-[10px] font-mono text-gray-500 p-2 text-right">FIG 1.0 // SAM3 ARCHITECTURE SCHEMATIC</div>
                            </div>
                        </div>
                    </motion.section>

                    {/* 4. SAM3 Live Demo Video */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-800 bg-black"
                    >
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-auto"
                        >
                            <source src="/videos/ar_demo.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute top-6 left-6 text-xs font-mono text-[#f54029] bg-black/80 backdrop-blur px-3 py-1.5 rounded border border-[#f54029]/30">SAM3 // LIVE_INFERENCE</div>
                        <div className="absolute bottom-6 right-6 text-xs font-mono text-gray-400 bg-black/80 backdrop-blur px-3 py-1.5 rounded border border-white/10 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            LATENCY: 12ms
                        </div>
                        <div className="absolute bottom-6 left-6 text-white font-mono text-lg">
                            <span className="text-[#f54029] font-bold">{'>'}{'>'}  </span>SAM3 REAL-TIME OBJECT TRACKING DEMONSTRATION
                        </div>
                    </motion.section>

                    {/* 4. Workflow Timeline */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-neutral-50 p-10 rounded-2xl border border-gray-200"
                    >
                        <h2 className="text-3xl font-bold mb-10 text-center uppercase tracking-widest">
                            The Operational Loop
                        </h2>
                        <div className="grid md:grid-cols-4 gap-4 text-center relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gray-200 -z-10" />

                            {[
                                { step: "01", title: "CAPTURE", text: "Multi-Angle Volumetric Scan" },
                                { step: "02", title: "PROCESS", text: "SAM3 Segmentation & Analysis" },
                                { step: "03", title: "AUGMENT", text: "Real-time AR Overlay Projection" },
                                { step: "04", title: "MONETIZE", text: "Micro-betting & NFT Minting" },
                            ].map((item, i) => (
                                <div key={i} className="relative group">
                                    <div className="w-24 h-24 mx-auto bg-white border-4 border-[#f54029] rounded-full flex items-center justify-center text-xl font-bold text-[#f54029] shadow-lg group-hover:scale-110 transition-transform duration-300 z-10 relative">
                                        {item.step}
                                    </div>
                                    <h4 className="mt-6 text-lg font-bold">{item.title}</h4>
                                    <p className="text-sm text-gray-500">{item.text}</p>
                                </div>
                            ))}
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
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Join The League</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Whether you are an elite athlete, a forward-thinking coach, or an investor looking for the next asset class, Elysium is your arena.
                            </p>
                        </div>
                        <ElysiumContactForm />
                    </motion.section>

                </div>
            </div>
            <Footer />
        </main>
    );
}
