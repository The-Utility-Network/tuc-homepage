'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import ParallaxHero from '@/components/ParallaxHero';

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

// Theme Color - Vulcan Orange
const VULCAN_ORANGE = '#F97316';

// K2 Plus Max Image
const K2_PLUS_IMAGE = 'https://cdn.shopify.com/s/files/1/0893/0603/8637/files/K2_Pro_-_1_049aa680-4690-4a84-a579-312bdf2900a1.png?v=1762929981';

// Stats
const stats = [
    { value: '$1,500', label: 'Token Price' },
    { value: '40%', label: 'Your Revenue Share' },
    { value: '24/7', label: 'Production Capacity' },
    { value: '6,500+', label: 'Supported Tokens' },
];

// How It Works
const howItWorks = [
    {
        step: '01',
        title: 'Mint Your Token',
        desc: 'Purchase a printer token for $1,500 using credit/debit card or any of 6,500+ supported cryptocurrencies on the Vulcan Forge mint portal.',
        icon: '🎟️',
    },
    {
        step: '02',
        title: 'We Deploy Your Printer',
        desc: 'Your Creality K2 Plus Max is deployed in our production farm. You own it—we operate it, maintain it, and keep it running 24/7.',
        icon: '🏭',
    },
    {
        step: '03',
        title: 'Earn 40% Revenue',
        desc: 'As jobs are printed on your machine, you receive 40% of all revenue generated. The remaining 60% covers maintenance, operations, and future upgrades.',
        icon: '💰',
    },
    {
        step: '04',
        title: 'We Handle Everything',
        desc: 'Maintenance, filament, repairs, upgrades—we handle it all from our 60% share. Your printer gets better over time at no extra cost to you.',
        icon: '🔧',
    },
];

// Use Cases
const useCases = [
    {
        title: 'Rapid Prototyping',
        desc: 'Engineers and designers access on-demand prototyping without capital expenditure on equipment.',
        icon: '🎨',
    },
    {
        title: 'Small Batch Manufacturing',
        desc: 'Produce 50-500 units of custom products without traditional manufacturing minimums.',
        icon: '📦',
    },
    {
        title: 'Replacement Parts',
        desc: 'On-demand production of spare parts for legacy equipment across industries.',
        icon: '⚙️',
    },
    {
        title: 'Educational Models',
        desc: 'Universities and schools access high-quality printing for STEM education.',
        icon: '🎓',
    },
];

// Benefits
const benefits = [
    {
        title: 'Passive Income Stream',
        desc: 'Your printer works around the clock, generating revenue while you sleep. Smart contracts ensure transparent, automatic payments.',
    },
    {
        title: 'Zero Operational Burden',
        desc: 'We handle all maintenance, filament, repairs, and upgrades from our share. You just collect your 40% of every job.',
    },
    {
        title: 'Future-Proof Investment',
        desc: 'As technology advances, we upgrade your printer using our operational share. Your asset improves over time at no additional cost.',
    },
    {
        title: 'Liquid Asset',
        desc: 'Trade your printer tokens on secondary markets. Your ownership stake is fully transferable on-chain.',
    },
];

// K2 Plus Max Specs
const printerSpecs = [
    { label: 'Build Volume', value: '350 × 350 × 350 mm' },
    { label: 'Max Speed', value: '600 mm/s' },
    { label: 'AI Cameras', value: 'Dual AI Monitoring' },
    { label: 'Auto Leveling', value: 'Precision Auto-Level' },
    { label: 'Materials', value: 'PLA, PETG, ABS, TPU, ASA' },
    { label: 'Chamber', value: 'Fully Enclosed' },
];

export default function VulcanForgePage() {
    return (
        <main className="bg-black text-white min-h-screen relative overflow-hidden font-sans selection:bg-orange-500 selection:text-white">
            <Navbar themeColor={VULCAN_ORANGE} />
            <BackButton color={VULCAN_ORANGE} />

            {/* Parallax Hero */}
            <ParallaxHero
                image="/artifacts/vulcanbg.png"
                title="VULCAN FORGE"
                subtitle="Tokenized 3D Printing Infrastructure"
                color={VULCAN_ORANGE}
                medallion="https://engram1.blob.core.windows.net/tuc-homepage/Medallions/VulcanForge2.png"
            />

            <div className="relative z-10">
                {/* Animated Background Grid */}
                <div className="fixed inset-0 pointer-events-none opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(${VULCAN_ORANGE}40 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                {/* Content Container */}
                <div className="max-w-7xl mx-auto px-6 py-24 space-y-32 relative">

                    {/* 1. Mission Statement */}
                    <motion.section
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="max-w-5xl mx-auto text-center space-y-8"
                    >
                        <div className="inline-block px-4 py-2 rounded-full border text-sm font-mono tracking-widest uppercase mb-4" style={{ borderColor: VULCAN_ORANGE, color: VULCAN_ORANGE }}>
                            Own the Means of Production
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter">
                            The <span style={{ color: VULCAN_ORANGE }}>Forge</span> of the Future
                        </h2>
                        <div className="h-1 w-24 mx-auto" style={{ backgroundColor: VULCAN_ORANGE }} />
                        <p className="text-xl text-gray-300 leading-relaxed font-medium max-w-4xl mx-auto">
                            Vulcan Forge revolutionizes manufacturing access by tokenizing 3D printing infrastructure. Each printer in our distributed farms is represented by a blockchain token—giving holders true ownership and 40% of all production revenue.
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                            {stats.map((stat) => (
                                <motion.div
                                    key={stat.label}
                                    variants={fadeInUp}
                                    className="glass-panel p-6 rounded-xl hover:border-orange-500/50 transition-all duration-300"
                                    style={{ borderColor: `${VULCAN_ORANGE}20` }}
                                >
                                    <div className="text-4xl font-bold" style={{ color: VULCAN_ORANGE }}>{stat.value}</div>
                                    <div className="text-sm font-mono text-gray-500 uppercase tracking-widest mt-2">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* 2. The Printer - Creality K2 Plus Max */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="glass-panel rounded-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 left-0 w-96 h-96 blur-[120px] opacity-20" style={{ backgroundColor: VULCAN_ORANGE }} />

                        <div className="grid lg:grid-cols-2 gap-0">
                            {/* Printer Image */}
                            <div className="relative bg-gradient-to-br from-gray-900 to-black p-8 flex items-center justify-center min-h-[400px]">
                                <img
                                    src={K2_PLUS_IMAGE}
                                    alt="Creality K2 Plus Max"
                                    className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                                />
                                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-mono bg-black/70 border border-white/20">
                                    CREALITY K2 PLUS MAX
                                </div>
                            </div>

                            {/* Printer Details */}
                            <div className="p-10 md:p-12 relative z-10">
                                <span className="text-sm font-mono tracking-widest uppercase" style={{ color: VULCAN_ORANGE }}>The Machine</span>
                                <h2 className="text-3xl md:text-4xl font-black mt-4 mb-2">
                                    Creality K2 Plus Max
                                </h2>
                                <p className="text-gray-400 mb-6">
                                    Professional-grade CoreXY 3D printer with fully enclosed chamber, dual AI cameras, and 350mm³ build volume. The workhorse of our production fleet.
                                </p>

                                {/* Specs Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {printerSpecs.map((spec) => (
                                        <div key={spec.label} className="p-3 rounded-lg bg-white/5 border border-white/10">
                                            <div className="text-xs text-gray-500 uppercase">{spec.label}</div>
                                            <div className="font-semibold text-white">{spec.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pricing */}
                                <div className="p-6 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/30 mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-gray-400">Token Price</span>
                                        <span className="text-3xl font-black" style={{ color: VULCAN_ORANGE }}>$1,500</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Your Revenue Share</span>
                                        <span className="text-2xl font-bold text-green-400">40%</span>
                                    </div>
                                </div>

                                <a
                                    href="https://vulcan-forge.us"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full py-4 rounded-xl font-bold text-center text-black transition-all duration-300 hover:scale-105 text-lg"
                                    style={{ backgroundColor: VULCAN_ORANGE }}
                                >
                                    MINT YOUR PRINTER TOKEN
                                </a>
                                <p className="text-xs text-gray-500 text-center mt-3">
                                    Pay with credit/debit card or 6,500+ supported cryptocurrencies
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* 3. Revenue Split Explainer */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="text-center mb-12">
                            <span className="text-sm font-mono tracking-widest uppercase" style={{ color: VULCAN_ORANGE }}>The Split</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-4">How Revenue is Shared</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Your Share */}
                            <div className="glass-panel p-8 rounded-2xl text-center">
                                <div className="text-6xl font-black text-green-400 mb-4">40%</div>
                                <h3 className="text-xl font-bold mb-4">Your Share</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Pure passive income. You receive 40% of all revenue generated by your printer, paid out automatically via smart contracts. No work required.
                                </p>
                            </div>

                            {/* Farm Share */}
                            <div className="glass-panel p-8 rounded-2xl text-center">
                                <div className="text-6xl font-black mb-4" style={{ color: VULCAN_ORANGE }}>60%</div>
                                <h3 className="text-xl font-bold mb-4">Farm Operations</h3>
                                <ul className="text-gray-400 text-sm space-y-2 text-left">
                                    <li className="flex items-center gap-2">
                                        <span style={{ color: VULCAN_ORANGE }}>→</span> Filament & materials
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span style={{ color: VULCAN_ORANGE }}>→</span> Maintenance & repairs
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span style={{ color: VULCAN_ORANGE }}>→</span> Facility & utilities
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span style={{ color: VULCAN_ORANGE }}>→</span> Future upgrades
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span style={{ color: VULCAN_ORANGE }}>→</span> 24/7 operations staff
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.section>

                    {/* 4. How It Works */}
                    <motion.section
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <span className="text-sm font-mono tracking-widest uppercase" style={{ color: VULCAN_ORANGE }}>The Process</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-4">How It Works</h2>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {howItWorks.map((item) => (
                                <motion.div
                                    key={item.step}
                                    variants={fadeInUp}
                                    className="glass-panel p-6 rounded-2xl hover:border-orange-500/50 transition-all duration-300 text-center"
                                >
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4"
                                        style={{ backgroundColor: `${VULCAN_ORANGE}30`, color: VULCAN_ORANGE }}
                                    >
                                        {item.step}
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                    <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* 5. Use Cases */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="glass-panel rounded-2xl overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20" style={{ backgroundColor: VULCAN_ORANGE }} />
                        <div className="p-10 md:p-16 relative z-10">
                            <div className="text-center mb-12">
                                <span className="text-sm font-mono tracking-widest uppercase" style={{ color: VULCAN_ORANGE }}>Applications</span>
                                <h2 className="text-3xl md:text-4xl font-bold mt-4">Who Uses Vulcan Forge?</h2>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {useCases.map((item) => (
                                    <div key={item.title} className="p-6 rounded-xl bg-white/5 border border-white/10 text-center hover:border-orange-500/30 transition-colors">
                                        <div className="text-4xl mb-4">{item.icon}</div>
                                        <h3 className="font-bold mb-2">{item.title}</h3>
                                        <p className="text-gray-500 text-sm">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    {/* 6. Benefits for Token Holders */}
                    <motion.section
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <span className="text-sm font-mono tracking-widest uppercase" style={{ color: VULCAN_ORANGE }}>Token Holder Benefits</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-4">Why Own a Printer Token?</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {benefits.map((benefit, i) => (
                                <motion.div
                                    key={benefit.title}
                                    variants={fadeInUp}
                                    className="glass-panel p-8 rounded-2xl hover:border-orange-500/50 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-6">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
                                            style={{ backgroundColor: `${VULCAN_ORANGE}30`, color: VULCAN_ORANGE }}
                                        >
                                            {String(i + 1).padStart(2, '0')}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 hover:text-orange-400 transition-colors">{benefit.title}</h3>
                                            <p className="text-gray-400 leading-relaxed">{benefit.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* 7. Payment Options */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="glass-panel rounded-2xl p-10 md:p-16 text-center"
                    >
                        <span className="text-sm font-mono tracking-widest uppercase" style={{ color: VULCAN_ORANGE }}>Flexible Payment</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Mint With Your Preferred Currency</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
                            Our mint portal at vulcan-forge.us accepts credit cards, debit cards, and over 6,500 supported cryptocurrencies. Buy with what you have—we handle the rest.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <div className="text-2xl mb-2">💳</div>
                                <div className="text-sm text-gray-400">Credit/Debit</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <div className="text-2xl mb-2">⟠</div>
                                <div className="text-sm text-gray-400">Ethereum</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <div className="text-2xl mb-2">₿</div>
                                <div className="text-sm text-gray-400">Bitcoin</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                                <div className="text-2xl mb-2">+6,500</div>
                                <div className="text-sm text-gray-400">More Tokens</div>
                            </div>
                        </div>

                        <a
                            href="https://vulcan-forge.us"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-12 py-5 rounded-full font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl text-lg"
                            style={{ backgroundColor: VULCAN_ORANGE, boxShadow: `0 0 40px ${VULCAN_ORANGE}40` }}
                        >
                            VISIT MINT PORTAL
                        </a>
                    </motion.section>

                    {/* 8. CTA Section */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="text-center py-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">Ready to Forge Your Future?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
                            For just $1,500, own a piece of the manufacturing revolution. Your Creality K2 Plus Max works around the clock—you earn 40% of everything it produces.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="https://vulcan-forge.us"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-10 py-5 rounded-full font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl text-lg"
                                style={{ backgroundColor: VULCAN_ORANGE, boxShadow: `0 0 40px ${VULCAN_ORANGE}40` }}
                            >
                                MINT YOUR TOKEN NOW
                            </a>
                            <a
                                href="https://vulcan-forge.us"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-10 py-5 rounded-full font-bold border-2 transition-all duration-300 hover:bg-white/5 text-lg"
                                style={{ borderColor: VULCAN_ORANGE, color: VULCAN_ORANGE }}
                            >
                                LEARN MORE
                            </a>
                        </div>
                    </motion.section>

                </div>
            </div>
            <Footer />
        </main>
    );
}
