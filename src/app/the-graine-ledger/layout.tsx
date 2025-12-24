import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Graine Ledger | NFT-Mediated Crypto Distillery | The Utility Company',
    description: 'The Graine Ledger is the world\'s first NFT-mediated crypto distillery. We tokenize ownership of physical whiskey casks, allowing anyone to invest in fine spirits as liquid assets. NFTs serve as digital deeds to real-world casks aging in our bonded warehouse.',
    keywords: ['The Graine Ledger', 'Crypto Distillery', 'Whiskey NFT', 'Asset Backed NFT', 'Cask Ownership', 'Fine Spirits', 'Real World Assets', 'RWA', 'NFT Investing', 'Digital Deeds'],
    openGraph: {
        title: 'The Graine Ledger | Liquid Assets',
        description: 'Own the spirit of innovation. Invest in physical whiskey casks through digital deeds (NFTs) at the world\'s first crypto distillery.',
        type: 'website',
        locale: 'en_US',
        siteName: 'The Utility Company',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Graine Ledger | Crypto Distillery',
        description: 'Tokenizing fine spirits. Own physical whiskey casks through secure NFT deeds.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
