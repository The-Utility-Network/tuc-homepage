'use client';

const pillars = [
    {
        title: 'AUTOMATED INDUSTRY',
        description: 'Developing autonomous systems that increase efficiency and reduce manual labor.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
    },
    {
        title: 'SYMBIOTIC BUSINESS MODELS',
        description: 'Creating frameworks where businesses and communities grow together.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        title: 'EMPOWERMENT & AGENCY',
        description: 'Providing tools for individuals to regain control over their economic future.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
    },
    {
        title: 'MITIGATING DISRUPTION',
        description: 'Ensuring a smooth transition into an automated world through education & access.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
];

export default function Pillars() {
    return (
        <section id="pillars" className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <span className="section-heading">CORE PRINCIPLES</span>
                    <h2 className="section-title mt-4">Four Pillars of Innovation</h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        The foundation upon which we build sustainable, community-driven technology solutions.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {pillars.map((pillar, index) => (
                        <div
                            key={pillar.title}
                            className="group glass-panel p-8 rounded-2xl hover:border-[#F54029]/30 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(245,64,41,0.15)]"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="text-[#F54029] mb-6 group-hover:scale-110 transition-transform duration-300">
                                {pillar.icon}
                            </div>

                            <h3 className="text-sm font-bold text-white mb-3 tracking-wide group-hover:text-[#F54029] transition-colors">
                                {pillar.title}
                            </h3>

                            <p className="text-sm text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                                {pillar.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
