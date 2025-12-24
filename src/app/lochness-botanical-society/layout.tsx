import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Loch Ness Botanical Society | Automated Abundance | The Utility Company',
    description: 'The Loch Ness Botanical Society pioneers "Automated Abundance" through the world\'s first NFT-mediated aquaponics greenhouse. By merging sustainable agriculture with blockchain technology, we enable community members to own "Grow Spots" (NFTs) that yield real-world produce and profits.',
    keywords: ['Loch Ness Botanical Society', 'Aquaponics', 'NFT Greenhouse', 'Sustainable Agriculture', 'Grow Spot NFT', 'Automated Abundance', 'Urban Farming', 'Blockchain Agriculture', 'Satellite Project', 'Green Tech'],
    openGraph: {
        title: 'The Loch Ness Botanical Society | NFT-Mediated Greenhouse',
        description: 'Cultivating the future with automated abundance. Own a piece of a high-tech aquaponics facility through our unique Grow Spot NFTs.',
        type: 'website',
        locale: 'en_US',
        siteName: 'The Utility Company',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Loch Ness Botanical Society | Automated Abundance',
        description: 'World\'s first NFT-mediated crypto greenhouse. Sustainable aquaponics meets decentralized ownership.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
