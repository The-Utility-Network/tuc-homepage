'use client';

const products = [
    {
        name: 'Ledger1 ERP',
        desc: 'AI-Assisted Universal ERP',
        detail: 'Industry-specific ERP with AI module builder for tailored enterprise management.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        )
    },
    {
        name: 'Ledger1 CRM',
        desc: 'AI-First Customer Intelligence',
        detail: 'Complete lead generation, sales agents, and social intelligence suite.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        )
    },
    {
        name: 'Voice Hub',
        desc: 'Enterprise Voice AI Platform',
        detail: 'Custom voice agents for meetings, streams, and customer interaction.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
        )
    },
    {
        name: 'PortalPay',
        desc: 'Web3-Native Commerce',
        detail: 'Crypto payments with instant settlement across 90+ chains.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        )
    }
];

export default function Ledger1() {
    return (
        <section id="ledger1" className="relative py-24 px-6 bg-black/50">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            <span className="text-xs font-mono tracking-[0.2em] text-blue-500">
                                NEW EXPANSION
                            </span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ledger1
                            <span className="block text-2xl md:text-3xl text-gray-500 mt-2 font-normal">
                                Enterprise AI & Automation
                            </span>
                        </h2>

                        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                            Our newest subsidiary, Ledger1, brings advanced AI automation to the enterprise.
                            From universal ERPs to voice-enabled customer intelligence, Ledger1 is
                            defining the future of business operations.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <a
                                href="https://ledger1.ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary bg-blue-600 hover:bg-blue-700 border-none"
                            >
                                VISIT LEDGER1.AI
                            </a>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        {products.map((product) => (
                            <div
                                key={product.name}
                                className="glass-panel p-6 rounded-xl border-blue-500/10 hover:border-blue-500/30 transition-colors group"
                            >
                                <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform">
                                    {product.icon}
                                </div>
                                <h3 className="text-white font-bold mb-1">{product.name}</h3>
                                <p className="text-xs font-mono text-blue-400 mb-3">{product.desc}</p>
                                <p className="text-gray-500 text-sm">{product.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
