export interface SEOLocation {
    city: string;
    slug: string;
    country: string;
    region: string;
    description: string;
    coordinates: { x: number; y: number }; // [Longitude, Latitude] for react-simple-maps
    keyFocus: string; // e.g., "DeFi", "Supply Chain"
    code: string; // IATA-style code (e.g. NYC, LON)
    regulatoryContext: string; // Detailed regulatory analysis
    activeSubsidiaries: string[]; // List of subsidiaries compliant in this region
}

export interface SEOIndustry {
    title: string;
    slug: string;
    description: string;
    subsidiaries: string[]; // Names of TUC subsidiaries
    marketSize?: string;
}

export type ComparisonCategory = 'DePIN' | 'RWA' | 'Enterprise' | 'Concept';

export interface SEOComparison {
    competitor: string;
    slug: string;
    category: ComparisonCategory;
    description: string;
    tucAdvantage: string; // Why TUC is better/different
}

export const LOCATIONS: SEOLocation[] = [
    {
        city: 'New York',
        slug: 'new-york',
        country: 'USA',
        region: 'North America',
        description: 'As the global center of traditional finance (TradFi), New York represents the ultimate bridge for RWA tokenization. TUC empowers Wall Street institutions to migrate complex asset classes onto the blockchain with ensuring compliance and liquidity.',
        coordinates: { x: -74.006, y: 40.7128 },
        keyFocus: 'RWA Tokenization',
        code: 'NYC',
        regulatoryContext: 'Strict SEC oversight requires Regulation D/S compliant issuances. TUC operates here solely through accredited investor channels for Ledger1 and Osiris Protocol, ensuring full KYC/AML adherence while navigating the complex "BitLicense" framework.',
        activeSubsidiaries: ['Ledger1', 'Osiris Protocol', 'Cornucopia Robotics'],
    },
    {
        city: 'London',
        slug: 'london',
        country: 'UK',
        region: 'Europe',
        description: 'London is leading the charge in fintech innovation. TUC\'s presence here focuses on modernizing insurance and banking infrastructure through the Ledger1 ecosystem.',
        coordinates: { x: -0.1276, y: 51.5074 },
        keyFocus: 'Fintech & Insurance',
        code: 'LON',
        regulatoryContext: 'The UK\'s FCA offers a progressive sandbox for fintech. Ledger1 leverages this to pilot automated insurance underwriting. We are fully compliant with the new UK crypto asset promotion rules.',
        activeSubsidiaries: ['Ledger1', 'The Graine Ledger', 'Requiem Electric'],
    },
    {
        city: 'Singapore',
        slug: 'singapore',
        country: 'Singapore',
        region: 'Asia',
        description: 'A global hub for supply chain and logistics. TUC deploys smart contract automation here to streamline global trade routes, enhancing transparency for DigiBazaar and global shipping partners.',
        coordinates: { x: 103.8198, y: 1.3521 },
        keyFocus: 'Supply Chain',
        code: 'SIN',
        regulatoryContext: 'Singapore\'s MAS provides clarity on payment services and utility tokens. This allows DigiBazaar to operate its asset discovery mechanisms with reduced friction, while Vulcan Forge utilizes the free trade zones for distributed manufacturing nodes.',
        activeSubsidiaries: ['DigiBazaar', 'Vulcan Forge', 'Cornucopia Robotics'],
    },
    {
        city: 'Zurich',
        slug: 'zurich',
        country: 'Switzerland',
        region: 'Europe',
        description: 'The heart of Crypto Valley. Zurich is where TUC aligns with deep-tech decentralized governance models, optimizing DAO structures for The Graine Ledger and other cooperatives.',
        coordinates: { x: 8.5417, y: 47.3769 },
        keyFocus: 'Decentralized Governance',
        code: 'ZRH',
        regulatoryContext: 'Switzerland\'s FINMA provides the global gold standard for DAO recognition. The Graine Ledger is domiciled here as a Swiss Association, protecting member rights while allowing for fully decentralized governance of the whiskey distillery operations.',
        activeSubsidiaries: ['The Graine Ledger', 'Arthaneeti', 'The Loch Ness Botanical Society'],
    },
    {
        city: 'Dubai',
        slug: 'dubai',
        country: 'UAE',
        region: 'Middle East',
        description: 'With its ambitious smart city initiatives, Dubai is the perfect testing ground for Requiem Electric\'s distributed energy grids and Vulcan Forge\'s localized manufacturing.',
        coordinates: { x: 55.2708, y: 25.2048 },
        keyFocus: 'Smart Cities & Energy',
        code: 'DXB',
        regulatoryContext: 'VARA (Virtual Assets Regulatory Authority) actively encourages metaverse and energy tokenization. Requiem Electric pilots its P2P energy trading grids here, and Elysium Athletica hosts its AR-enhanced sports events in the permissive special economic zones.',
        activeSubsidiaries: ['Requiem Electric', 'Elysium Athletica', 'Vulcan Forge'],
    },
    {
        city: 'Hong Kong',
        slug: 'hong-kong',
        country: 'China',
        region: 'Asia',
        description: 'A critical gateway for Asian capital markets. TUC facilitates cross-border digital asset settlements and high-frequency trading infrastructure via Osiris Protocol.',
        coordinates: { x: 114.1694, y: 22.3193 },
        keyFocus: 'Digital Assets',
        code: 'HKG',
        regulatoryContext: 'With new SFC licensing for retail crypto trading, Hong Kong is reclaiming its crypto hub status. Osiris Protocol provides the institutional-grade data pipes compliant with these new rigorous exchange standards.',
        activeSubsidiaries: ['Osiris Protocol', 'Ledger1', 'DigiBazaar'],
    },
    {
        city: 'San Francisco',
        slug: 'san-francisco',
        country: 'USA',
        region: 'North America',
        description: 'The epicenter of tech innovation. TUC bridges the gap between Web2 Silicon Valley giants and Web3 infrastructure, focusing on Cornucopia Robotics and AI integration.',
        coordinates: { x: -122.4194, y: 37.7749 },
        keyFocus: 'AI & Robotics',
        code: 'SFO',
        regulatoryContext: 'While US token laws are strict, software and AI innovation is unrestricted. Cornucopia Robotics develops its core AI vision models here, separating the IP development from the tokenized economic layers handled in other jurisdictions.',
        activeSubsidiaries: ['Cornucopia Robotics', 'Osiris Protocol'],
    },
    {
        city: 'Tokyo',
        slug: 'tokyo',
        country: 'Japan',
        region: 'Asia',
        description: 'A powerhouse of robotics and precision manufacturing. Vulcan Forge finds its spiritual home here, automating distributed production lines for the next industrial revolution.',
        coordinates: { x: 139.6917, y: 35.6895 },
        keyFocus: 'Manufacturing & Robotics',
        code: 'TYO',
        regulatoryContext: 'Japan\'s DAO law allows for real-world legal recognition of decentralized groups. Vulcan Forge utilizes this to allow decentralized ownership of 3D printing fleets by DAO members.',
        activeSubsidiaries: ['Vulcan Forge', 'Cornucopia Robotics', 'Requiem Electric'],
    },
    {
        city: 'São Paulo',
        slug: 'sao-paulo',
        country: 'Brazil',
        region: 'South America',
        description: 'Leading agricultural innovation in South America. The Loch Ness Botanical Society leverages this hub to pioneer blockchain-based yield appropriation and sustainable farming.',
        coordinates: { x: -46.6333, y: -23.5505 },
        keyFocus: 'AgriTech',
        code: 'GRU',
        regulatoryContext: 'Brazil\'s Central Bank Digital Currency (Drex) pilot encourages smart contract innovation in agriculture. The Loch Ness Botanical Society uses this framework for fractionalizing harvest yields.',
        activeSubsidiaries: ['The Loch Ness Botanical Society', 'Cornucopia Robotics', 'DigiBazaar'],
    },
    {
        city: 'Lagos',
        slug: 'lagos',
        country: 'Nigeria',
        region: 'Africa',
        description: 'One of the fastest-growing crypto adopters. TUC empowers local communities here through Arthaneeti, fostering economic inclusion and decentralized political engagement.',
        coordinates: { x: 3.3792, y: 6.5244 },
        keyFocus: 'Financial Inclusion',
        code: 'LOS',
        regulatoryContext: 'Nigeria has high grassroots crypto adoption despite banking restrictions. Arthaneeti operates a P2P governance model here that bypasses traditional rails, focusing on community consensus rather than fiat settlement.',
        activeSubsidiaries: ['Arthaneeti', 'DigiBazaar'],
    },
];

export const INDUSTRIES: SEOIndustry[] = [
    {
        title: 'Finance & Banking',
        slug: 'finance',
        description: 'Revolutionizing traditional banking with immutable ledgers, instant settlements, and tokenized real-world assets.',
        subsidiaries: ['Ledger1', 'Osiris Protocol'],
    },
    {
        title: 'Agriculture',
        slug: 'agriculture',
        description: 'Implementing precision automation and yield tokenization to maximize food production efficiency and transparency.',
        subsidiaries: ['Cornucopia Robotics', 'The Loch Ness Botanical Society'],
    },
    {
        title: 'Energy & Utilities',
        slug: 'energy',
        description: 'Decentralizing energy grids to allow peer-to-peer power trading and optimized consumption via smart contracts.',
        subsidiaries: ['Requiem Electric', 'The Utility Company'],
    },
    {
        title: 'Manufacturing',
        slug: 'manufacturing',
        description: 'Distributed 3D printing and on-demand production networks that reduce logistics costs and carbon footprint.',
        subsidiaries: ['Vulcan Forge'],
    },
    {
        title: 'Retail & Commerce',
        slug: 'retail',
        description: 'Creating immersive digital marketplaces and sweepstakes mechanisms that drive user engagement and asset discovery.',
        subsidiaries: ['DigiBazaar'],
    },
    {
        title: 'Sports & Wellness',
        slug: 'sports',
        description: 'Tokenizing athlete performance and creating gamified fitness ecosystems for the digital age.',
        subsidiaries: ['Elysium Athletica'],
    },
    {
        title: 'Politics & Governance',
        slug: 'politics',
        description: 'New models for civic engagement and transparent value distribution in political movements.',
        subsidiaries: ['Arthaneeti'],
    },
    {
        title: 'Food & Beverage',
        slug: 'food-beverage',
        description: 'Farm-to-table tracking and NFT-mediated customization for premium artisanal products.',
        subsidiaries: ['The Graine Ledger'],
    },
];

export const COMPARISONS: SEOComparison[] = [
    {
        competitor: 'Helium',
        slug: 'helium',
        category: 'DePIN',
        description: 'Helium built a decentralized wireless network incentivized by tokens.',
        tucAdvantage: 'While Helium focuses on wireless connectivity, TUC builds a holistic industrial automation layer. We don\'t just connect devices; we automate the entire economic logic between them using Ledger1 and Osiris Protocol.',
    },
    {
        competitor: 'IoTeX',
        slug: 'iotex',
        category: 'DePIN',
        description: 'IoTeX is a blockchain platform optimizing for IoT privacy and scalability.',
        tucAdvantage: 'TUC integrates IoT not just as data points, but as active economic agents (Robot-to-Robot economy). Our "Cornucopia Robotics" and "Requiem Electric" subsidiaries apply this directly to specific verticals like AgTech and Energy, going beyond just the protocol layer.',
    },
    {
        competitor: 'Centrifuge',
        slug: 'centrifuge',
        category: 'RWA',
        description: 'Centrifuge bridges real-world assets like invoices to DeFi liquidity.',
        tucAdvantage: 'Centrifuge is excellent for credit. TUC expands RWA to operational equity and community utilities. Through "The Graine Ledger" and "Loch Ness," we tokenize the actual productive output (whiskey, crops), creating a deeper connection between asset and utility.',
    },
    {
        competitor: 'Securitize',
        slug: 'securitize',
        category: 'RWA',
        description: 'Securitize focuses on the compliant issuance and trading of digital securities.',
        tucAdvantage: 'Securitize is the platform; TUC is the ecosystem. We use compliant standards but wrap them in engaging, consumer-facing brands (like Elysium or DigiBazaar), driving actual user adoption rather than just providing the plumbing.',
    },
    {
        competitor: 'IBM Blockchain',
        slug: 'ibm-blockchain',
        category: 'Enterprise',
        description: 'IBM offers permissioned blockchain solutions for enterprise supply chains.',
        tucAdvantage: 'IBM solutions are often heavy, expensive, and top-down. TUC offers "Industrial Automation as a Service" which is modular, community-driven, and designed to empower smaller stakeholders alongside major enterprises.',
    },
    {
        competitor: 'Traditional ERP (SAP/Oracle)',
        slug: 'traditional-erp',
        category: 'Concept',
        description: 'Legacy ERP systems are centralized, siloed, and often require massive manual maintenance.',
        tucAdvantage: 'Ledger1 is a "Neuromimetic" business architecture. It is self-optimizing and decentralized by default. Unlike static ERPs, our systems learn and adapt, and because they are on-chain, they offer native transparency and instant settlement not possible with legacy databases.',
    },
];
