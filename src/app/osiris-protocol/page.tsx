'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import ParallaxHero from '@/components/ParallaxHero';
import OsirisContactForm from '@/components/OsirisContactForm';

// Dynamically import the 3D Diamond visualization (client-side only)
const DiamondMini = dynamic(() => import('@/components/DiamondMini'), { ssr: false });

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

// Theme Color - Purple from medallion
const OSIRIS_PURPLE = '#A855F7';

// Data
const stats = [
    { value: '20+', label: 'Clients' },
    { value: '18+', label: 'Projects' },
    { value: '15k+', label: 'Tokens' },
    { value: '37+', label: 'Contracts' },
];

const diamondFeatures = [
    {
        title: 'Modular Facets',
        desc: 'Each business function lives in its own facet—upgradeable independently without touching core logic.',
    },
    {
        title: 'Infinite Scalability',
        desc: 'No contract size limits. Add unlimited functionality through new facets as your operation grows.',
    },
    {
        title: 'Real-Time Compliance',
        desc: 'Automated reporting facets publish immutable audit trails to L2 chains for regulatory transparency.',
    },
    {
        title: 'Stakeholder-First Automation',
        desc: 'AI-driven processes execute within governance rails, ensuring value flows to stakeholders—not around them.',
    },
];

const services = [
    {
        id: '01',
        name: 'Osiris Awakening Smart Contracts',
        desc: 'ERC-compliant smart contracts built on EVM for interoperability and security. Token creation (ERC-20, ERC-721), secure transactions, and automated governance.',
        image: '/osiris/awakening.png',
    },
    {
        id: '02',
        name: 'Osiris Oracle: Immutable Data Pipelines',
        desc: 'Publishing industrial timeseries datasets on L2 EVM-compatible blockchains. Transforms traditional data architectures into robust, immutable, tamper-proof solutions.',
        image: '/osiris/rising.png',
    },
    {
        id: '03',
        name: 'Osiris Eternal Deployment Services',
        desc: 'Seamless and secure smart contract deployment on Ethereum. Optimized for performance, compliance with ERC standards, and scalability.',
        image: '/osiris/eternal.png',
    },
    {
        id: '04',
        name: 'Osiris ERC Compliance Services',
        desc: 'Comprehensive audits to ensure smart contracts adhere to ERC standards (ERC-20, ERC-721, ERC-1155) for maximum interoperability.',
    },
    {
        id: '05',
        name: 'Osiris EVM Integration Services',
        desc: 'Full integration with the Ethereum Virtual Machine. Performance tuning, scalability solutions, and security enhancements for your dApps.',
    },
];

const projects = [
    {
        name: 'The Satellite Project by TLN',
        desc: 'Cutting-edge hydroponic systems with remote automation to optimize growth and maximize yield.',
        image: '/osiris/project2.png',
    },
    {
        name: 'Degen or Blockhead Radio NFT',
        desc: 'Transforming blockchain education through interactive trivia shows, leveraging NFTs to engage the crypto community.',
        image: '/osiris/project1.jpg',
    },
    {
        name: 'Joey Capitano Music NFTs',
        desc: 'Blending artistry with blockchain, offering exclusive access to music, fashion, and unique digital experiences.',
        image: '/osiris/project3.png',
    },
];

export default function OsirisProtocolPage() {
    return (
        <main className="bg-black text-white min-h-screen relative overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
            <Navbar themeColor={OSIRIS_PURPLE} />
            <BackButton color={OSIRIS_PURPLE} />

            {/* Parallax Hero - Matching app style */}
            <ParallaxHero
                image="/osiris/heroart.png"
                title="OSIRIS PROTOCOL"
                subtitle="Unlock the Mysteries of Blockchain"
                color={OSIRIS_PURPLE}
                medallion="https://engram1.blob.core.windows.net/tuc-homepage/Medallions/OP.png"
                imagePosition="center"
            />

            <div className="relative z-10">
                {/* Animated Background Grid */}
                <div className="fixed inset-0 pointer-events-none opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(${OSIRIS_PURPLE}40 1px, transparent 1px)`,
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
                        <div className="inline-block px-4 py-2 rounded-full border text-sm font-mono tracking-widest uppercase mb-4" style={{ borderColor: OSIRIS_PURPLE, color: OSIRIS_PURPLE }}>
                            World's Most Advanced Boutique Smart Contract Firm
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter">
                            The <span style={{ color: OSIRIS_PURPLE }}>Gateway</span> to Blockchain
                        </h2>
                        <div className="h-1 w-24 mx-auto" style={{ backgroundColor: OSIRIS_PURPLE }} />
                        <p className="text-xl text-gray-300 leading-relaxed font-medium max-w-4xl mx-auto">
                            Empowering startups and enterprises with state-of-the-art onchain data pipelines and enterprise-grade blockchain solutions, fortified by our Osiris Advanced v2 standard.
                        </p>

                        {/* Stats Grid - Glass Panel Style */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                            {stats.map((stat) => (
                                <motion.div
                                    key={stat.label}
                                    variants={fadeInUp}
                                    className="glass-panel p-6 rounded-xl hover:border-purple-500/50 transition-all duration-300"
                                    style={{ borderColor: `${OSIRIS_PURPLE}20` }}
                                >
                                    <div className="text-4xl font-bold" style={{ color: OSIRIS_PURPLE }}>{stat.value}</div>
                                    <div className="text-sm font-mono text-gray-500 uppercase tracking-widest mt-2">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* 2. ERC-2535 Diamond Standard Section */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="glass-panel rounded-2xl overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/10" />
                            <div className="absolute top-0 left-0 w-96 h-96 blur-[120px] opacity-20" style={{ backgroundColor: OSIRIS_PURPLE }} />

                            <div className="p-10 md:p-16 relative z-10">
                                <div className="grid lg:grid-cols-2 gap-12 items-center">
                                    {/* Content */}
                                    <div className="space-y-8">
                                        <div>
                                            <span className="text-sm font-mono tracking-widest uppercase" style={{ color: OSIRIS_PURPLE }}>Core Architecture</span>
                                            <h2 className="text-4xl md:text-5xl font-black mt-4 mb-2">
                                                ERC-2535
                                            </h2>
                                            <h3 className="text-2xl md:text-3xl font-bold text-gray-400">
                                                The Diamond Standard
                                            </h3>
                                        </div>

                                        <p className="text-gray-300 leading-relaxed text-lg">
                                            In a world geared for <span className="text-white font-semibold">AI and tokenization</span>, legacy contract architectures crumble under the weight of evolving requirements. ERC-2535 is our foundation for building <span className="text-white font-semibold">industrial-grade smart contract systems</span> that scale infinitely while remaining upgradeable, auditable, and compliant.
                                        </p>

                                        <p className="text-gray-400 leading-relaxed">
                                            Unlike monolithic contracts that become rigid relics, the Diamond pattern enables <span style={{ color: OSIRIS_PURPLE }}>real-time reporting and compliance</span> through modular facets. Each facet handles a specific domain—from asset tokenization to automated governance—ensuring that automated processes <span className="text-white font-medium">provide value to stakeholders instead of forsaking them</span>.
                                        </p>

                                        <div className="grid sm:grid-cols-2 gap-4 pt-4">
                                            {diamondFeatures.map((feature, i) => (
                                                <div key={feature.title} className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-colors">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${OSIRIS_PURPLE}30`, color: OSIRIS_PURPLE }}>
                                                            {String(i + 1).padStart(2, '0')}
                                                        </div>
                                                        <h4 className="font-bold text-white">{feature.title}</h4>
                                                    </div>
                                                    <p className="text-gray-500 text-sm">{feature.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 3D Diamond Visualization */}
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-80 h-80 rounded-full blur-[80px] opacity-30" style={{ backgroundColor: OSIRIS_PURPLE }} />
                                        </div>
                                        <div className="relative h-[480px] rounded-2xl overflow-hidden border border-white/10 bg-black/80">
                                            <DiamondMini />
                                        </div>
                                        <div className="mt-6 space-y-3">
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                This visualization encapsulates a <span className="text-white font-medium">schematic ontology</span> applicable to any institution, organization, or even individual. Each ring represents a distinct operational domain (facet), and each node represents an actionable method within that domain.
                                            </p>
                                            <p className="text-xs font-mono text-gray-600">
                                                Click any node to simulate method execution. Navigate between facets using the controls.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Industrial Context */}
                                <div className="mt-16 pt-12 border-t border-white/10">
                                    <div className="text-center mb-10">
                                        <h3 className="text-2xl font-bold">Industrial Implementation</h3>
                                        <p className="text-gray-500 mt-2">How we deploy ERC-2535 in real-world enterprise contexts</p>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                                            <div className="text-3xl mb-4">🏭</div>
                                            <h4 className="font-bold mb-2">Manufacturing & Supply Chain</h4>
                                            <p className="text-gray-500 text-sm">Tokenized production tracking with immutable provenance and automated quality compliance reporting.</p>
                                        </div>
                                        <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                                            <div className="text-3xl mb-4">⚡</div>
                                            <h4 className="font-bold mb-2">Energy & Utilities</h4>
                                            <p className="text-gray-500 text-sm">Real-time grid data on L2 chains enabling transparent REC trading and automated regulatory submissions.</p>
                                        </div>
                                        <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                                            <div className="text-3xl mb-4">🏦</div>
                                            <h4 className="font-bold mb-2">Financial Services</h4>
                                            <p className="text-gray-500 text-sm">Modular treasury management with governance-controlled automation and stakeholder-visible audit trails.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* 2. Services Section */}
                    <motion.section
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-16"
                    >
                        <div className="text-center">
                            <span className="text-sm font-mono tracking-widest uppercase" style={{ color: OSIRIS_PURPLE }}>Our Services</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-4">Secure Your Future with Blockchain Expertise</h2>
                        </div>

                        {/* Services with Images - Glass Style Cards */}
                        <div className="grid md:grid-cols-3 gap-8">
                            {services.slice(0, 3).map((service) => (
                                <motion.div
                                    key={service.id}
                                    variants={fadeInUp}
                                    className="group glass-panel rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300"
                                >
                                    {service.image && (
                                        <div className="relative h-48 overflow-hidden">
                                            <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold mb-4"
                                            style={{ backgroundColor: `${OSIRIS_PURPLE}30`, color: OSIRIS_PURPLE }}
                                        >
                                            {service.id}
                                        </div>
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">{service.name}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Additional Services - Glass Style */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {services.slice(3).map((service) => (
                                <motion.div
                                    key={service.id}
                                    variants={fadeInUp}
                                    className="group glass-panel p-8 rounded-2xl hover:border-purple-500/50 transition-all duration-300"
                                >
                                    <div className="flex items-start gap-6">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shrink-0"
                                            style={{ backgroundColor: `${OSIRIS_PURPLE}30`, color: OSIRIS_PURPLE }}
                                        >
                                            {service.id}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">{service.name}</h3>
                                            <p className="text-gray-400 leading-relaxed">{service.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* 3. Why Choose Osiris - Dark Panel Style */}
                    <motion.section
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="glass-panel rounded-2xl overflow-hidden relative"
                    >
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `linear-gradient(${OSIRIS_PURPLE} 1px, transparent 1px), linear-gradient(90deg, ${OSIRIS_PURPLE} 1px, transparent 1px)`,
                            backgroundSize: '20px 20px'
                        }} />
                        <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20" style={{ backgroundColor: OSIRIS_PURPLE }} />
                        <div className="p-10 md:p-16 relative z-10">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <span className="text-sm font-mono tracking-widest uppercase" style={{ color: OSIRIS_PURPLE }}>Rising</span>
                                    <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-6">Why Choose Osiris Protocol?</h2>
                                    <p className="text-gray-300 leading-relaxed mb-8">
                                        The ultimate gateway to seamless onchain integration and bulletproof smart contract security. Osiris Protocol delivers enterprise-grade solutions fortified by our Osiris Advanced v2 standard.
                                    </p>
                                    <ul className="space-y-4 text-gray-400">
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 rounded-full mr-4" style={{ backgroundColor: OSIRIS_PURPLE }} />
                                            State-of-the-art onchain data pipelines
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 rounded-full mr-4" style={{ backgroundColor: OSIRIS_PURPLE }} />
                                            Enterprise-grade blockchain solutions
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 rounded-full mr-4" style={{ backgroundColor: OSIRIS_PURPLE }} />
                                            Osiris Advanced v2 security standard
                                        </li>
                                        <li className="flex items-center">
                                            <span className="w-2 h-2 rounded-full mr-4" style={{ backgroundColor: OSIRIS_PURPLE }} />
                                            Full EVM & ERC compliance
                                        </li>
                                    </ul>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div className="relative">
                                        {/* Animated Rings */}
                                        <div className="absolute inset-0 w-64 h-64 rounded-full border animate-[spin_20s_linear_infinite]" style={{ borderColor: `${OSIRIS_PURPLE}30` }} />
                                        <div className="absolute inset-4 w-56 h-56 rounded-full border animate-[spin_15s_linear_infinite_reverse]" style={{ borderColor: `${OSIRIS_PURPLE}50` }} />
                                        <div className="w-64 h-64 flex items-center justify-center">
                                            <img src="https://engram1.blob.core.windows.net/tuc-homepage/Medallions/OP.png" alt="Osiris Protocol" className="w-40 h-40 object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* 4. Featured Projects - Glass Style */}
                    <motion.section
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <span className="text-sm font-mono tracking-widest uppercase" style={{ color: OSIRIS_PURPLE }}>Our Projects</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-4">Powered by Osiris</h2>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {projects.map((project, i) => (
                                <motion.div
                                    key={project.name}
                                    variants={fadeInUp}
                                    className="group glass-panel rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                        <div
                                            className="absolute bottom-4 left-4 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                                            style={{ backgroundColor: `${OSIRIS_PURPLE}`, color: 'black' }}
                                        >
                                            0{i + 1}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold mb-3 group-hover:text-purple-400 transition-colors">{project.name}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{project.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* 5. Contact Form Section */}
                    <section className="py-24 relative">
                        <div className="max-w-4xl mx-auto px-6 text-center">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                                READY TO <span style={{ color: OSIRIS_PURPLE }}>ASCEND</span>?
                            </h2>
                            <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
                                Whether you're building the next decentralized application or seeking bulletproof smart contract audits, Osiris Protocol is your gateway to blockchain excellence.
                            </p>
                            <OsirisContactForm themeColor={OSIRIS_PURPLE} />
                        </div>
                    </section>

                </div>
            </div>
            <Footer />
        </main>
    );
}
