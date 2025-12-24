export default function About() {
    // TUC + Ledger1 Combined Team
    const leadership = [
        { name: 'Krishna Patel', title: 'Founder & CEO (TUC)', image: '/team/member1.png' },
        { name: 'Eric Turner', title: 'Chief Executive Officer (Ledger1)', image: '/team/member6.png' },
        { name: 'Michael Milton', title: 'Chief Marketing Officer (Ledger1)', image: '/team/member3.png' },
        { name: 'Shahir Monjour', title: 'Senior VP, Engineering (Ledger1)', image: '/team/member4.png' },
        { name: 'John Garcia', title: 'Senior VP, AI Research (Ledger1)', image: '/team/member5.png' },
        { name: 'Milan Joshi', title: 'Founder & CTO (Requiem Electric)', image: '/team/Milan.png' },
        { name: 'Kerul Patel', title: 'CTO (TUC)', image: '/team/Kerul.png' },
    ];

    return (
        <section id="about" className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
                    {/* Left Content */}
                    <div>
                        <span className="section-heading">ABOUT I3AS</span>
                        <h2 className="section-title mt-4 mb-6">Industrial Automation as a Service</h2>

                        <div className="space-y-6 text-gray-300 leading-relaxed">
                            <p>
                                <span className="text-[#F54029] font-semibold">I3AS</span> is the foundation of
                                The Utility Company&apos;s vision. We develop and integrate cutting-edge automated
                                technologies that empower individuals and communities while driving efficiency
                                and sustainability in industries.
                            </p>
                            <p>
                                By fostering symbiotic relationships between businesses and communities, we
                                believe in technology&apos;s potential to create positive societal change through
                                automation and innovation.
                            </p>
                        </div>

                        {/* Mission Statement Card */}
                        <div className="mt-8 p-6 glass-panel rounded-2xl border-l-4 border-[#F54029]">
                            <p className="text-sm text-gray-400 italic">
                                &ldquo;Empowering communities and individuals to drive innovation and success
                                through advanced automation technologies. By empowering communities to create
                                their own wealth and value, we help create more inclusive and sustainable
                                societies that foster prosperity and opportunity for all.&rdquo;
                            </p>
                        </div>
                    </div>

                    {/* Right Content - Values */}
                    <div className="space-y-6">
                        {/* Team Values */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                {
                                    title: 'COLLABORATIVE',
                                    desc: 'Working together to achieve common goals',
                                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                },
                                {
                                    title: 'INNOVATIVE',
                                    desc: 'Seeking creative solutions to problems',
                                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                },
                                {
                                    title: 'RESPONSIBLE',
                                    desc: 'Acting socially and environmentally conscious',
                                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                },
                                {
                                    title: 'DEDICATED',
                                    desc: 'Tirelessly driving positive impact',
                                    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                },
                            ].map((value) => (
                                <div key={value.title} className="card group">
                                    <div className="text-[#F54029] mb-2 group-hover:scale-110 transition-transform">
                                        {value.icon}
                                    </div>
                                    <h4 className="text-xs font-mono tracking-wider text-[#F54029] mb-2">
                                        {value.title}
                                    </h4>
                                    <p className="text-sm text-gray-400">{value.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Investor Metrics */}
                        <div className="glass-panel rounded-2xl p-6">
                            <h4 className="text-xs font-mono tracking-wider text-gray-500 mb-4">
                                INVESTOR METRICS
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Returns', desc: 'Strong ROI through automation' },
                                    { label: 'Growth', desc: 'Fostering stakeholder growth' },
                                    { label: 'Sustainability', desc: 'Long-term success focus' },
                                    { label: 'Impact', desc: 'Invest in positive change' },
                                ].map((metric) => (
                                    <div key={metric.label} className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#F54029] rounded-full mt-2" />
                                        <div>
                                            <span className="text-sm font-semibold text-white">{metric.label}</span>
                                            <p className="text-xs text-gray-500">{metric.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Extended Team Section */}
                <div className="border-t border-white/10 pt-16">
                    <div className="text-center mb-12">
                        <span className="section-heading">OUR PEOPLE</span>
                        <h2 className="section-title mt-4">Leadership Team</h2>
                        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                            A diverse team of innovators, engineers, and visionaries driving The Utility Company and Ledger1 forward.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {leadership.map((member) => (
                            <div key={member.name} className="group text-center">
                                <div className="relative w-full aspect-square rounded-full overflow-hidden mb-4 border border-white/10 group-hover:border-[#F54029] transition-all">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${member.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                                        {/* Hover overlay content if needed */}
                                    </div>
                                </div>
                                <h4 className="text-lg font-bold text-white">{member.name}</h4>
                                <p className="text-xs text-[#F54029] font-mono mt-1 px-4">{member.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
