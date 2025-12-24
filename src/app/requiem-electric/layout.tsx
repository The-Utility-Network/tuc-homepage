import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Requiem Electric | Distributed Energy & Community | The Utility Company',
    description: 'Requiem Electric is charging the future by decentralizing energy infrastructure. We combine advanced EV charging networks with tokenized investment opportunities, allowing communities to own and profit from the renewable energy transition.',
    keywords: ['Requiem Electric', 'EV Charging', 'Distributed Energy', 'Renewable Energy', 'Tokenized Infrastructure', 'Green Energy', 'Electric Vehicles', 'Smart Grid', 'Community Energy', 'Energy Independence'],
    openGraph: {
        title: 'Requiem Electric | Powering the Community',
        description: 'Decentralized EV charging infrastructure owned by the people. Invest in the grid of tomorrow.',
        type: 'website',
        locale: 'en_US',
        siteName: 'The Utility Company',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Requiem Electric | Distributed Energy Network',
        description: 'Building the decentralized charging network of the future.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
