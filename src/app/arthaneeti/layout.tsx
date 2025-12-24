import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Arthaneeti | Democratizing Political Participation | The Utility Company',
    description: 'Arthaneeti redefines the social contract by introducing the Arthanagrik—a blockchain-based digital identity that gamifies citizenship. We build self-sustaining economic models where citizens are rewarded for engaging in governance, proposing policies, and improving their communities through decentralized civic participation.',
    keywords: ['Arthaneeti', 'Digital Democracy', 'Blockchain Voting', 'Civic Engagement', 'Arthanagrik', 'Decentralized Governance', 'Political Participation', 'Smart Contracts', 'Community Development', 'Civic Technology'],
    openGraph: {
        title: 'Arthaneeti | Incentivized Civic Action',
        description: 'Where blockchain meets democracy. The Arthanagrik identity gamifies citizenship, rewarding engagement in governance and community improvement through decentralized economic models.',
        type: 'website',
        locale: 'en_US',
        siteName: 'The Utility Company',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Arthaneeti | Democratizing Political Participation',
        description: 'Blockchain-based digital identity that gamifies citizenship. Earn rewards for civic engagement and community governance.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
