import Link from 'next/link';

const philosophyItems = [
    {
        title: 'Innovation',
        description: 'We push the boundaries of technology to discover new ways to empower individuals and communities.',
        icon: '💡',
    },
    {
        title: 'Empowerment',
        description: 'We believe in providing people with the tools and knowledge needed to be independent and create more than they consume.',
        icon: '🚀',
    },
    {
        title: 'Sustainability',
        description: 'We are committed to building a sustainable future where technology benefits both people and the environment.',
        icon: '🌱',
    },
];

const creativeInfluences = [
    'Noam Chomsky\'s Anarchosyndicalism',
    'Sen & Nussbaum\'s Capability Approach',
    'Whitehead\'s Process Philosophy',
    'Deleuze & Guattari\'s Ontology',
];

export default function Philosophy() {
    return (
        <section id="philosophy" className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="section-heading">OUR PHILOSOPHY</span>
                    <h2 className="section-title mt-4">Creative Utilitarianism</h2>
                    <p className="text-gray-400 mt-4 max-w-3xl mx-auto">
                        Our philosophy emphasizes individual autonomy and collective action to create
                        a more equitable and sustainable world, challenging dominant power structures
                        and promoting sustainable innovation.
                    </p>
                </div>

                {/* Philosophy Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {philosophyItems.map((item) => (
                        <div key={item.title} className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#F54029]/10 border border-[#F54029]/30 mb-6">
                                <span className="text-4xl">{item.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </div>

                {/* Creative Revolution */}
                <div className="glass-panel rounded-2xl p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-xs font-mono tracking-wider text-[#F54029] mb-4">
                                THE CREATIVE REVOLUTION
                            </h3>
                            <p className="text-gray-300 leading-relaxed">
                                Creative Utilitarianism draws from influential philosophers and political
                                theorists who have explored the implications of individual autonomy and
                                collective action for economics, political structures, and society.
                            </p>
                        </div>
                        <div className="space-y-3">
                            {creativeInfluences.map((influence, index) => (
                                <div
                                    key={influence}
                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                                >
                                    <span className="text-[#F54029] font-mono text-sm">0{index + 1}</span>
                                    <span className="text-gray-400 text-sm">{influence}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <Link
                            href="/our-model"
                            className="btn-secondary text-sm"
                        >
                            READ THE CREATIVE REVOLUTION
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
