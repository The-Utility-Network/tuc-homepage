import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'The Refrain | Philosophy & Spirituality | The Utility Company',
    description: 'Explore the philosophical bedrock of The Utility Company. The Refrain investigates the clandestine spaces between territory and technology, framing automation as a spiritual and ethical imperative.',
    keywords: ['Philosophy', 'Spirituality', 'The Refrain', 'Technology Ethics', 'Automation Philosophy', 'Clandestine Spaces', 'Utility Company', 'Future of Humanity'],
    openGraph: {
        title: 'The Refrain | A Philosophical Bedrock',
        description: 'Between the territory you exist in and the one you will enter, there is a space. Listen to the philosophy behind the creative revolution.',
        type: 'website',
        locale: 'en_US',
        siteName: 'The Utility Company',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'The Refrain',
        description: 'Philosophy, Spirituality, and Economics. The intellectual engine of The Utility Company.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
