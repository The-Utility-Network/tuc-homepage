import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Osiris Protocol | Enterprise Blockchain Solutions | The Utility Company',
    description: 'Osiris Protocol is a premier boutique smart contract development firm. We specialize in complex, scalable blockchain architecture using the Diamond Standard (ERC-2535), providing secure and upgradeable onchain data pipelines for enterprise applications.',
    keywords: ['Osiris Protocol', 'Smart Contracts', 'Blockchain Development', 'ERC-2535', 'Diamond Standard', 'Solidity', 'Web3 Engineering', 'Enterprise Blockchain', 'Onchain Data', 'Decentralized Applications'],
    openGraph: {
        title: 'Osiris Protocol | Gateway to the Blockchain',
        description: 'Architecting the decentralized future with the Diamond Standard (ERC-2535). Scalable, secure, and upgradeable smart contract solutions.',
        type: 'website',
        locale: 'en_US',
        siteName: 'The Utility Company',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Osiris Protocol | Advanced Smart Contract Firm',
        description: 'Specializing in ERC-2535 Diamond Standard for scalable enterprise blockchain solutions.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
