import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Vulcan Forge | Tokenized 3D Printing | The Utility Company',
    description: 'Vulcan Forge enables communities to "Own the Means of Production" through tokenized 3D printing infrastructure. We deploy industrial-grade printers like the Creality K2 Plus, allowing NFT holders to earn revenue from print jobs and participate in the decentralized manufacturing revolution.',
    keywords: ['Vulcan Forge', '3D Printing', 'Tokenized Infrastructure', 'Distributed Manufacturing', 'Creality K2 Plus', 'NFT', 'DePIN', 'Maker Economy', 'Own the Means of Production', 'Future Factory'],
    openGraph: {
        title: 'Vulcan Forge | The Future Factory',
        description: 'Decentralized manufacturing is here. Own a share of industrial 3D printing fleets and earn from the production economy.',
        type: 'website',
        locale: 'en_US',
        siteName: 'The Utility Company',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Vulcan Forge | Own the Means of Production',
        description: 'Tokenized 3D printing infrastructure. Distributed manufacturing for the 21st century.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
