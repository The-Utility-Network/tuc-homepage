import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NM_CITIES } from '@/lib/data/new-mexico-cities';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export const metadata = {
    title: 'New Mexico Industrial Automation & Agentic AI Consulting | The Utility Company',
    description: 'The Utility Company provides enterprise-grade industrial automation, Agentic AI architectures, SCADA integration, and digital twin engineering across New Mexico. Serving the Permian Basin, Albuquerque manufacturing, and Los Alamos R&D hubs.',
    keywords: 'New Mexico Industrial Automation, AI Consulting New Mexico, SCADA integration Albuquerque, Digital Twin Permian Basin, Business Automation NM, Agentic AI Los Alamos, IoT sensing Carlsbad, Energy Grid automation Farmington',
    openGraph: {
        title: 'New Mexico Industrial Automation & AI Consulting | TUC',
        description: 'New Mexico\'s premier engineering firm for industrial automation, Agentic AI, and SCADA integration.',
        url: 'https://theutilitycompany.com/new-mexico',
        images: [{ url: 'https://storage.googleapis.com/tgl_cdn/images/Medallions/Symbol.png' }],
    }
};

export default function NewMexicoHubPage() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#F54029]/30 font-sans">
            <Navbar />
            
            {/* MASSIVE HERO SECTION */}
            <div className="relative pt-32 pb-40 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
                <div className="absolute inset-0 bg-[#F54029]/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/4 pointer-events-none" />
                <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F54029]/10 border border-[#F54029]/20 text-[#F54029] font-mono text-xs mb-8">
                        <span className="w-2 h-2 rounded-full bg-[#F54029] animate-pulse" />
                        NEW MEXICO REGIONAL HEADQUARTERS
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-bold font-rajdhani tracking-tight mb-8 leading-[1.1]">
                        Architecting <span className="text-[#F54029]">New Mexico's</span><br />
                        Autonomous Future
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-white/70 max-w-4xl font-light leading-relaxed mb-12">
                        The Utility Company is the premier industrial automation and Agentic AI engineering firm serving the state of New Mexico. We specialize in transforming legacy heavy-industry, energy extraction, and aerospace manufacturing into highly optimized, autonomous digital ecosystems.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-16">
                        <a href="#contact" className="px-8 py-4 bg-[#F54029] text-white font-rajdhani font-bold text-lg rounded-xl hover:bg-[#F54029]/90 transition-all shadow-[0_0_30px_rgba(245,64,41,0.4)] text-center">
                            Initiate Capability Assessment
                        </a>
                        <a href="#hubs" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-rajdhani text-lg rounded-xl hover:bg-white/10 transition-colors text-center">
                            Explore Regional Hubs
                        </a>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/10 py-8">
                        <div>
                            <div className="text-3xl font-bold font-mono text-white mb-2">24/7</div>
                            <div className="text-xs text-[#F54029] font-bold tracking-widest uppercase">Autonomous Monitoring</div>
                            <p className="text-sm text-white/50 mt-2">Zero-latency edge computing for critical regional infrastructure.</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold font-mono text-white mb-2">-42%</div>
                            <div className="text-xs text-[#F54029] font-bold tracking-widest uppercase">Downtime Reduction</div>
                            <p className="text-sm text-white/50 mt-2">Predictive ML algorithms isolating mechanical failure before it occurs.</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold font-mono text-white mb-2">99.9%</div>
                            <div className="text-xs text-[#F54029] font-bold tracking-widest uppercase">SCADA Reliability</div>
                            <p className="text-sm text-white/50 mt-2">Military-grade telemetry and remote physical process control.</p>
                        </div>
                        <div>
                            <div className="text-3xl font-bold font-mono text-white mb-2">Full</div>
                            <div className="text-xs text-[#F54029] font-bold tracking-widest uppercase">Digital Twin Modeling</div>
                            <p className="text-sm text-white/50 mt-2">Complete 3D spatial mapping of New Mexican industrial assets.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* HIGH FIDELITY INDUSTRY DOMINANCE SECTION */}
            <div className="max-w-7xl mx-auto px-6 py-32 relative z-10 border-b border-white/5">
                <div className="text-center mb-24">
                    <h2 className="text-4xl md:text-6xl font-rajdhani font-bold mb-6">Engineered for New Mexico's Core Industries</h2>
                    <p className="text-xl text-white/50 max-w-4xl mx-auto font-light leading-relaxed">
                        From the vast energy fields of the southeast to the high-tech corridors of the Rio Grande, our automation architectures are bespoke-engineered for New Mexico's unique geographical and economic layout.
                    </p>
                </div>

                <div className="space-y-32">
                    {/* Energy */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(245,64,41,0.15)]">
                            <Image 
                                src="/images/new-mexico/nm_energy_twin.png" 
                                alt="Oil pump jack digital twin in Permian Basin"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-4 left-4 font-mono text-xs text-[#F54029] tracking-widest">PERMIAN BASIN SECTOR</div>
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F54029]/10 text-[#F54029] font-mono text-xs mb-6 border border-[#F54029]/20">
                                OIL, GAS & RESOURCE EXTRACTION
                            </div>
                            <h3 className="text-3xl md:text-5xl font-rajdhani font-bold mb-6 leading-tight">Digital Twins for the Permian Basin</h3>
                            <p className="text-lg text-white/60 leading-relaxed mb-6">
                                Operating extensively in Hobbs, Carlsbad, and Farmington, we deploy hyper-resilient SCADA networks and IoT mesh sensors across massive geographic expanses. 
                            </p>
                            <p className="text-lg text-white/60 leading-relaxed mb-8">
                                We automate pump jacks, monitor pipeline integrity via real-time digital twins, and utilize predictive Agentic AI to completely eliminate catastrophic downtime in remote extraction zones, saving millions in lost yield.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-center text-white/80 font-mono text-sm"><span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F54029] font-bold">1</span> Autonomous Flow & Flare Control</li>
                                <li className="flex gap-4 items-center text-white/80 font-mono text-sm"><span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F54029] font-bold">2</span> Subterranean Mesh Networking</li>
                                <li className="flex gap-4 items-center text-white/80 font-mono text-sm"><span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F54029] font-bold">3</span> Real-Time Rig Telemetry Ingestion</li>
                            </ul>
                        </div>
                    </div>

                    {/* Defense & R&D */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-mono text-xs mb-6 border border-blue-500/20">
                                HIGH PERFORMANCE COMPUTING
                            </div>
                            <h3 className="text-3xl md:text-5xl font-rajdhani font-bold mb-6 leading-tight">Air-Gapped AI for National Labs</h3>
                            <p className="text-lg text-white/60 leading-relaxed mb-6">
                                Servicing the high-security perimeters of Los Alamos, Sandia, and White Sands, our consulting firm brings TS-cleared architectural standards to Agentic AI workflows.
                            </p>
                            <p className="text-lg text-white/60 leading-relaxed mb-8">
                                We build completely isolated, on-premise Large Language Models (LLMs) that interface directly with classified administrative and logistical datasets. Our deployment ensures supernatural cognitive scaling without a single byte of data ever touching the public internet.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-center text-white/80 font-mono text-sm"><span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 font-bold">1</span> Air-Gapped Foundational Models</li>
                                <li className="flex gap-4 items-center text-white/80 font-mono text-sm"><span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 font-bold">2</span> HPC Resource Scheduling Automation</li>
                                <li className="flex gap-4 items-center text-white/80 font-mono text-sm"><span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 font-bold">3</span> Secure Multi-Agent Swarm Logic</li>
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2 relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
                            <Image 
                                src="/images/new-mexico/nm_defense_ai.png" 
                                alt="Air-gapped server room and HPC clusters"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-4 left-4 font-mono text-xs text-blue-400 tracking-widest">LOS ALAMOS / SANDIA SECTOR</div>
                        </div>
                    </div>

                    {/* Manufacturing */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(245,64,41,0.15)]">
                            <Image 
                                src="/images/new-mexico/nm_aerospace_robotics.png" 
                                alt="Robotic assembly on aerospace floor"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                            <div className="absolute bottom-4 left-4 font-mono text-xs text-[#F54029] tracking-widest">ALBUQUERQUE MANUFACTURING HUB</div>
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F54029]/10 text-[#F54029] font-mono text-xs mb-6 border border-[#F54029]/20">
                                AEROSPACE & ADVANCED MANUFACTURING
                            </div>
                            <h3 className="text-3xl md:text-5xl font-rajdhani font-bold mb-6 leading-tight">Robotic Process Synchronization</h3>
                            <p className="text-lg text-white/60 leading-relaxed mb-6">
                                Anchored in Albuquerque's rapidly expanding manufacturing hub, we specialize in kinematic robotic process automation and high-fidelity digital twin facility mapping.
                            </p>
                            <p className="text-lg text-white/60 leading-relaxed mb-8">
                                By rendering exact 1:1 3D replicas of manufacturing floors, our AI agents can run millions of simulated operational shifts to discover supply-chain and physical bottlenecks before altering expensive physical robotic systems on the ground.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-4 items-center text-white/80 font-mono text-sm"><span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F54029] font-bold">1</span> Kinematic Robotic Simulation</li>
                                <li className="flex gap-4 items-center text-white/80 font-mono text-sm"><span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F54029] font-bold">2</span> Vision AI Quality Assurance</li>
                                <li className="flex gap-4 items-center text-white/80 font-mono text-sm"><span className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#F54029] font-bold">3</span> Autonomous AGV Floor Routing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* DEEP DIVE: SCADA & DIGITAL TWINS */}
            <div className="border-b border-white/5 bg-black/60 backdrop-blur-sm py-32">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-mono text-xs mb-8">
                            TECHNICAL METHODOLOGY
                        </div>
                        <h2 className="text-4xl md:text-6xl font-rajdhani font-bold mb-6 leading-tight">
                            We Don't Just Visualize Data.<br />
                            <span className="text-[#F54029]">We Automate Reality.</span>
                        </h2>
                        <p className="text-xl text-white/60 leading-relaxed mb-6">
                            Most "AI consultants" in New Mexico will build you a dashboard. The Utility Company builds <strong>nervous systems for physical facilities.</strong> 
                        </p>
                        <p className="text-xl text-white/60 leading-relaxed mb-8">
                            Our proprietary approach involves tapping directly into your PLCs (Programmable Logic Controllers) and legacy SCADA systems. We stream that raw telemetry into a cloud-hosted <strong>Digital Twin</strong>, where our Agentic AI models actively optimize the environment in real-time, sending autonomous adjustment commands back down to the hardware without human intervention.
                        </p>

                        <div className="space-y-6">
                            <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl flex gap-6 items-start hover:border-[#F54029]/30 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-[#F54029]/20 flex items-center justify-center flex-shrink-0 text-[#F54029] font-bold text-xl">1</div>
                                <div>
                                    <h4 className="font-bold font-rajdhani text-2xl mb-2">Hardware Ingestion Phase</h4>
                                    <p className="text-white/50 leading-relaxed">Retrofitting legacy machines with IoT Edge gateways for microsecond polling and deterministic logging.</p>
                                </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl flex gap-6 items-start hover:border-[#F54029]/30 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-[#F54029]/20 flex items-center justify-center flex-shrink-0 text-[#F54029] font-bold text-xl">2</div>
                                <div>
                                    <h4 className="font-bold font-rajdhani text-2xl mb-2">Digital Twin Mapping</h4>
                                    <p className="text-white/50 leading-relaxed">Constructing a deterministic state-machine replica of the entire New Mexico facility inside the cloud.</p>
                                </div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl flex gap-6 items-start hover:border-[#F54029]/30 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-[#F54029]/20 flex items-center justify-center flex-shrink-0 text-[#F54029] font-bold text-xl">3</div>
                                <div>
                                    <h4 className="font-bold font-rajdhani text-2xl mb-2">Agentic Control Handover</h4>
                                    <p className="text-white/50 leading-relaxed">Permitting our AI swarm to execute autonomous optimization routines and rewrite process parameters on the fly.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[800px] w-full rounded-[3rem] overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl hidden md:block">
                        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-gradient-to-tr from-[#F54029]/30 to-blue-500/10 rounded-full blur-[100px] animate-pulse" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                            <svg className="w-32 h-32 text-[#F54029] mb-8 drop-shadow-[0_0_25px_rgba(245,64,41,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                            </svg>
                            <div className="font-mono text-[#F54029] text-2xl tracking-widest uppercase mb-4 font-bold">System Active</div>
                            <div className="text-white/60 text-lg font-mono">SCADA Telemetry Uplink Established</div>
                            <div className="mt-8 border border-white/10 rounded-xl p-4 bg-black/50 backdrop-blur-md w-full max-w-sm mx-auto text-left">
                                <div className="flex justify-between mb-2">
                                    <span className="text-white/40 font-mono text-sm">Latency</span>
                                    <span className="text-[#F54029] font-mono text-sm font-bold">12ms</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-white/40 font-mono text-sm">Twin Sync</span>
                                    <span className="text-[#F54029] font-mono text-sm font-bold">99.99%</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-white/40 font-mono text-sm">AI Swarm</span>
                                    <span className="text-[#F54029] font-mono text-sm font-bold">Autonomous</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROI & DEPLOYMENT TIMELINE */}
            <div className="py-32 relative z-10 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-rajdhani font-bold mb-4">Enterprise Deployment Timeline</h2>
                        <p className="text-xl text-white/50 max-w-3xl mx-auto">
                            How we rapidly integrate autonomous AI and SCADA solutions into your New Mexico facility without disrupting ongoing operations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-[#F54029]/50 transition-colors">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[100px] transition-colors group-hover:bg-[#F54029]/10" />
                            <div className="text-4xl font-mono text-white/20 font-bold mb-4">W1-2</div>
                            <h4 className="text-2xl font-rajdhani font-bold mb-4">Audit & Ingestion</h4>
                            <p className="text-white/50 leading-relaxed">Complete hardware audit of all legacy systems, sensor mapping, and initial API bridging to establish data flow.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-[#F54029]/50 transition-colors">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[100px] transition-colors group-hover:bg-[#F54029]/10" />
                            <div className="text-4xl font-mono text-white/20 font-bold mb-4">W3-6</div>
                            <h4 className="text-2xl font-rajdhani font-bold mb-4">Digital Twin Build</h4>
                            <p className="text-white/50 leading-relaxed">Constructing the high-fidelity 3D cloud replica. Validating telemetry accuracy against real-world metrics.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-[#F54029]/50 transition-colors">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[100px] transition-colors group-hover:bg-[#F54029]/10" />
                            <div className="text-4xl font-mono text-white/20 font-bold mb-4">W7-10</div>
                            <h4 className="text-2xl font-rajdhani font-bold mb-4">Shadow AI Mode</h4>
                            <p className="text-white/50 leading-relaxed">Agentic AI models run in parallel with human operators, generating predictive insights without execution authority.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:border-[#F54029]/50 transition-colors">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#F54029]/10 rounded-bl-[100px] transition-colors group-hover:bg-[#F54029]/30" />
                            <div className="text-4xl font-mono text-[#F54029] font-bold mb-4">W12+</div>
                            <h4 className="text-2xl font-rajdhani font-bold mb-4 text-[#F54029]">Autonomous Go-Live</h4>
                            <p className="text-white/50 leading-relaxed">Full execution authority granted to AI swarm. System achieves autonomous optimization and self-healing.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW MEXICO CITY HUBS */}
            <div id="hubs" className="max-w-7xl mx-auto px-6 py-32 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-rajdhani font-bold mb-4">New Mexico Service Grid</h2>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto">
                        Explore our specialized consulting capabilities and local deployments across the state's major industrial centers.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {NM_CITIES.map((city) => (
                        <Link 
                            key={city.slug}
                            href={`/new-mexico/${city.slug}`}
                            className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-[#F54029]/30 hover:bg-[#F54029]/5 transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-3xl font-rajdhani font-bold group-hover:text-[#F54029] transition-colors">{city.name}</h3>
                                <svg className="w-6 h-6 text-white/30 group-hover:text-[#F54029] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                            <div className="text-xs font-mono text-[#F54029] mb-4 uppercase tracking-wider bg-[#F54029]/10 w-fit px-3 py-1 rounded-full">{city.industryFocus}</div>
                            <p className="text-white/60 leading-relaxed mt-auto">
                                View capabilities in {city.name} &rarr;
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* CONTACT CAPTURE SECTION */}
            <div id="contact" className="relative z-20 border-t border-white/10 bg-black pt-32 pb-40">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-1/2 bg-[#F54029]/5 blur-[100px] pointer-events-none" />
                
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-7xl font-rajdhani font-bold mb-6">Initiate Deployment</h2>
                        <p className="text-2xl text-white/50 font-light">
                            Contact our New Mexico engineering team to schedule a technical architecture review of your facility.
                        </p>
                    </div>
                    
                    {/* Render existing ContactForm component */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-[0_0_100px_rgba(245,64,41,0.1)]">
                        <ContactForm />
                    </div>
                </div>
            </div>

            {/* Schema.org LocalBusiness Markup for State Hub */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ProfessionalService",
                        "name": "The Utility Company - New Mexico",
                        "image": "https://storage.googleapis.com/tgl_cdn/images/Medallions/Symbol.png",
                        "description": "Enterprise-grade industrial automation, Agentic AI, and SCADA integration consulting firm serving the entire state of New Mexico, including Albuquerque, Santa Fe, Hobbs, and Los Alamos.",
                        "address": {
                            "@type": "PostalAddress",
                            "addressRegion": "NM",
                            "addressCountry": "US"
                        },
                        "areaServed": NM_CITIES.map(c => ({
                            "@type": "City",
                            "name": c.name,
                            "containedInPlace": {
                                "@type": "State",
                                "name": "New Mexico"
                            }
                        })),
                        "url": "https://theutilitycompany.com/new-mexico",
                        "telephone": "+1-800-AUTOMATE",
                        "priceRange": "$$$$"
                    })
                }}
            />

            <Footer />
        </main>
    );
}
