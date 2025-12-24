export default function Features() {
    return (
        <section id="features" className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto space-y-24">

                {/* Innovative Symbiosis & Creator Economy Grid */}
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Innovative Symbiosis */}
                    <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F54029]/10 rounded-full blur-3xl group-hover:bg-[#F54029]/20 transition-colors" />
                        <h3 className="section-heading mb-4">CORE FOCUS</h3>
                        <h2 className="text-2xl font-bold text-white mb-4">Innovative Symbiosis</h2>
                        <p className="text-gray-400 leading-relaxed">
                            At The Utility Company, we innovate to create symbiotic business models that not only benefit businesses but also empower communities. We are revolutionizing how people engage with technology for a sustainable, better future.
                        </p>
                    </div>

                    {/* Creator Economy */}
                    <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-colors" />
                        <h3 className="section-heading mb-4 text-blue-400">ECONOMIC MODEL</h3>
                        <h2 className="text-2xl font-bold text-white mb-4">Creator Economy</h2>
                        <p className="text-gray-400 leading-relaxed">
                            The creator economy is about individuals and communities creating value and wealth for themselves. The Utility Company leverages NFTs and automated processes to revolutionize how value is created, tracked, and shared.
                        </p>
                    </div>
                </div>

                {/* Now Minting Section */}
                <div className="glass-panel rounded-3xl p-8 md:p-12 border border-[#F54029]/30 relative overflow-hidden">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F54029]/5 to-transparent" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl">
                            <div className="inline-flex items-center gap-2 mb-4">
                                <span className="animate-pulse w-2 h-2 bg-[#F54029] rounded-full" />
                                <span className="text-xs font-mono text-[#F54029] tracking-widest">LIVE NOW</span>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4">
                                Now Minting on DigiBazaar
                            </h2>
                            <p className="text-gray-300 text-lg mb-2">
                                American Genesis Collection Tier 6 Membership
                            </p>
                            <p className="text-gray-500 mb-8">
                                Purchase a membership today! Each provides ownership benefits of 100 whiskey barrels.
                            </p>
                            <a
                                href="https://digibazaar.io/ethereum/collection/0x495f947276749ce646f68ac8c248420045cb7b5e:opensea-agcfounders"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                            >
                                BUY NOW ON DIGIBAZAAR
                            </a>
                        </div>

                        {/* Visual Decoration */}
                        <div className="relative w-full md:w-1/3 aspect-video md:aspect-square bg-black/50 rounded-xl border border-white/10 flex items-center justify-center overflow-hidden group">
                            <video
                                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                                src="https://raw2.seadn.io/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/96ea6dc4f4e9682e71509920eb2b4c/dc96ea6dc4f4e9682e71509920eb2b4c.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                            />
                            <div className="relative z-10 text-center pointer-events-none">
                                <p className="mt-2 text-xs font-mono text-white tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur-sm">TIER 6 ACCESS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </section >
    );
}
