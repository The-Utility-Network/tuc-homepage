const osirisServices = [
    { name: 'Smart Contracts', desc: 'ERC standards for interoperability' },
    { name: 'Oracle Pipelines', desc: 'Immutable L2 data solutions' },
    { name: 'Deployment', desc: 'Secure contract deployment' },
    { name: 'ERC Compliance', desc: 'Token standard audits' },
    { name: 'EVM Integration', desc: 'Full dApp compatibility' },
];

const stats = [
    { value: '20+', label: 'Clients' },
    { value: '18+', label: 'Projects' },
    { value: '15k+', label: 'Tokens' },
    { value: '37+', label: 'Contracts' },
];

export default function Osiris() {
    return (
        <section id="osiris" className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div>
                        <span className="section-heading">BLOCKCHAIN SERVICES</span>
                        <h2 className="section-title mt-4 mb-6">Osiris Protocol</h2>

                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Unlock the Mysteries of Blockchain. Empowering startups and enterprises
                            with state-of-the-art onchain data pipelines and enterprise-grade blockchain
                            solutions, fortified by our Osiris Advanced v2 standard.
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4 mb-8">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-2xl font-bold text-[#F54029]">{stat.value}</div>
                                    <div className="text-xs font-mono text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <a
                            href="https://osiris.theutilitycompany.co"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-sm"
                        >
                            EXPLORE OSIRIS
                        </a>
                    </div>

                    {/* Right Content - Services */}
                    <div className="glass-panel rounded-2xl p-8">
                        <h4 className="text-xs font-mono tracking-wider text-gray-500 mb-6">
                            SERVICES
                        </h4>
                        <div className="space-y-4">
                            {osirisServices.map((service, index) => (
                                <div
                                    key={service.name}
                                    className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-[#F54029]/20 flex items-center justify-center text-[#F54029] font-bold text-sm">
                                        0{index + 1}
                                    </div>
                                    <div>
                                        <h5 className="text-white font-semibold text-sm group-hover:text-[#F54029] transition-colors">
                                            {service.name}
                                        </h5>
                                        <p className="text-gray-500 text-xs">{service.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Projects List */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <h4 className="text-xs font-mono tracking-wider text-gray-500 mb-4">
                                FEATURED PROJECTS
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {['The Satellite Project', 'Blockhead Radio NFT', 'Joey Capitano NFTs'].map((project) => (
                                    <span
                                        key={project}
                                        className="px-3 py-1 text-xs font-mono text-gray-400 bg-white/5 rounded-full"
                                    >
                                        {project}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
