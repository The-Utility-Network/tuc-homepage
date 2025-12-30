'use client'

import { ExternalLink } from 'lucide-react'

const references = [
    {
        title: "Value creation in the metaverse",
        source: "McKinsey & Company",
        year: "2022",
        url: "https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/value-creation-in-the-metaverse",
        id: "mckinsey-metaverse"
    },
    {
        title: "The beginning of the tokenization of all assets",
        source: "BlackRock (Larry Fink)",
        year: "2024",
        url: "https://www.blackrock.com/corporate/investor-relations/larry-fink-chairmans-letter",
        id: "blackrock-tokenization"
    },
    {
        title: "Money, Tokens, and Games",
        source: "Citi GPS",
        year: "2023",
        url: "https://icg.citi.com/icghome/what-we-think/citigps/insights/money-tokens-and-games",
        id: "citi-blockchain"
    },
    {
        title: "Relevance of on-chain asset tokenization in 'crypto winter'",
        source: "Boston Consulting Group (BCG) & ADDX",
        year: "2022",
        url: "https://web-assets.bcg.com/1e/a2/5b5f2b7e42dfad2cb3113a291222/on-chain-asset-tokenization.pdf",
        id: "bcg-rwa"
    },
    {
        title: "Tokenization fueling $400B in Alternative Investments",
        source: "J.P. Morgan Kinexys",
        year: "2024",
        url: "https://www.jpmorgan.com/insights/payments/how-tokenization-can-fuel-opportunity-in-distributing-alternative-investments",
        id: "jpm-tokenization"
    },
    {
        title: "Wealth Report 2024: Rare Whisky Performance",
        source: "Knight Frank",
        year: "2024",
        url: "https://www.knightfrank.com/wealthreport",
        id: "knight-frank-whisky"
    },
    {
        title: "Why Shopping's Set for a Social Revolution",
        source: "Accenture",
        year: "2022",
        url: "https://www.accenture.com/us-en/insights/software-platforms/social-commerce-revolution",
        id: "accenture-social"
    },
    {
        title: "How medtech can capture value from digital health",
        source: "McKinsey & Company",
        year: "2021",
        url: "https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/how-the-medtech-industry-can-capture-value-from-digital-health",
        id: "mckinsey-digital-health"
    },
    {
        title: "Vertical Farming Market Size, Share & Trends Analysis",
        source: "Grand View Research",
        year: "2023",
        url: "https://www.grandviewresearch.com/industry-analysis/vertical-farming-market",
        id: "gvr-agtech"
    },
    {
        title: "Electric Vehicle Charging Station Market Analysis",
        source: "Fortune Business Insights",
        year: "2024",
        url: "https://www.fortunebusinessinsights.com/electric-vehicle-charging-station-market-107080",
        id: "fbi-ev-charging"
    },
    {
        title: "3D Printing Growth Accelerates Again",
        source: "Deloitte Insights",
        year: "2019",
        url: "https://www2.deloitte.com/content/dam/Deloitte/cn/Documents/technology-media-telecommunications/deloitte-cn-tmt-3d-printing-growth-accelerates-again-en-190724.pdf",
        id: "deloitte-3d"
    },
    {
        title: "Generative AI to Become a $1.3 Trillion Market by 2032",
        source: "Bloomberg Intelligence",
        year: "2023",
        url: "https://www.bloomberg.com/company/press/generative-ai-to-become-a-1-3-trillion-market-by-2032-research-finds/",
        id: "bloomberg-ai"
    }
]

export default function InvestorReferences() {
    return (
        <section className="py-20 bg-[#020202] border-t border-white/5">
            <div className="container mx-auto px-4">
                <h4 className="text-xs font-mono text-white/20 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">
                    Research & Citations
                </h4>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                    {references.map((ref, idx) => (
                        <div key={idx} className="group">
                            <a href={ref.url} target="_blank" rel="noopener noreferrer" className="block">
                                <h5 className="text-sm font-bold text-white/60 group-hover:text-white transition-colors flex items-center gap-2">
                                    {ref.source}
                                    <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </h5>
                                <p className="text-xs text-white/30 mt-1 italic font-serif">"{ref.title}"</p>
                                <p className="text-[10px] text-white/20 mt-2 font-mono">{ref.year} • REPORT ID: {ref.id.toUpperCase()}</p>
                            </a>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-[10px] text-white/10 max-w-3xl leading-relaxed">
                    DISCLAIMER: This presentation includes forward-looking statements regarding future market conditions and the potential market size of various industries.
                    These statements are based on findings from third-party research reports as cited above. The Utility Company (Nexus) does not guarantee the accuracy
                    of these projections. Past performance of asset classes is not indicative of future results. Investment in early-stage technology companies involves significant risk.
                </div>
            </div>
        </section>
    )
}
