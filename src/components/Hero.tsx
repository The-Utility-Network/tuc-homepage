import Link from 'next/link';

export default function Hero() {
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 pt-24">
            <div className="max-w-5xl mx-auto text-center z-10">
                {/* System Label */}
                <div className="inline-flex items-center gap-2 mb-8 opacity-0 animate-fadeInUp">
                    <span className="w-2 h-2 bg-[#F54029] rounded-full animate-pulse" />
                    <span className="text-xs font-mono tracking-[0.3em] text-[#F54029]">
                        INDUSTRIAL AUTOMATION AS A SERVICE
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 opacity-0 animate-fadeInUp stagger-1">
                    <span className="block text-white">SIMPLE CHOICES.</span>
                    <span className="block bg-gradient-to-r from-[#F54029] to-[#ff8062] bg-clip-text text-transparent">
                        COMPLEX OUTCOMES.
                    </span>
                </h1>

                {/* Mission Statement */}
                <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed opacity-0 animate-fadeInUp stagger-2">
                    Empowering communities and individuals to drive innovation and success
                    through advanced automation technologies. Creating inclusive and sustainable
                    societies that foster prosperity for all.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fadeInUp stagger-3">
                    <Link href="#about" className="btn-primary text-sm tracking-wider">
                        DISCOVER I3AS
                    </Link>
                    <Link href="#subsidiaries" className="btn-secondary text-sm tracking-wider">
                        EXPLORE SUBSIDIARIES
                    </Link>
                </div>

                {/* Stats Row */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-0 animate-fadeInUp stagger-4">
                    {[
                        { value: '9', label: 'SUBSIDIARIES' },
                        { value: '15', label: 'PARTNER CATEGORIES' },
                        { value: '25', label: 'SERVICES' },
                        { value: '100+', label: 'CLIENTS' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-xs font-mono tracking-wider text-gray-500">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 animate-fadeInUp stagger-5">
                <Link href="#pillars" className="flex flex-col items-center gap-2 text-gray-500 hover:text-[#F54029] transition-colors">
                    <span className="text-xs font-mono tracking-wider">SCROLL</span>
                    <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </Link>
            </div>
        </section>
    );
}
