import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'DigiBazaar | The Creative Revolution | The Utility Company',
    description: 'DigiBazaar is an asset discovery engine and the home of the "Creative Revolution." We democratize digital collecting with our signature "$2 Sweep," allowing users to discover and sweep floor-price assets instantly. Connecting creators and collectors through frictionless, low-barrier commerce.',
    keywords: ['DigiBazaar', 'NFT Marketplace', 'Digital Assets', 'Creative Revolution', 'Crypto Art', 'Asset Discovery', 'Web3 Commerce', 'Low Gas Fees', 'Multi-chain Support', 'Collectibles'],
    openGraph: {
        title: 'DigiBazaar | The Home of the Creative Revolution',
        description: 'Democratizing digital asset collection with the $2 Sweep. Discover, collect, and trade in a frictionless marketplace designed for the creative economy.',
        type: 'website',
        locale: 'en_US',
        siteName: 'The Utility Company',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DigiBazaar | Digital Assets for the Real World',
        description: 'Home of the $2 Sweep. A frictionless marketplace connecting creators and collectors in the digital economy.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
