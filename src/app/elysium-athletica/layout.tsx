import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Elysium Athletica | Future of Sports Operations | The Utility Company',
    description: 'Elysium Athletica is the world\'s first decentralized sports ecosystem. We redefine the relationship between fans, franchises, and live events by tokenizing sports operations and delivering immersive AR experiences powered by the SAM3 vision model.',
    keywords: ['Elysium Athletica', 'Sports Tech', 'Decentralized Sports', 'Augmented Reality', 'Stadium AR', 'Fan Engagement', 'Tokenized Franchise', 'Sports Operations', 'SAM3 Model', 'Athlete Biometrics'],
    openGraph: {
        title: 'Elysium Athletica | The Apex of Operations',
        description: 'Redefining sports through tokenized operations and immersive AR. Experience the future of live events with real-time biometric tracking and interactive stadium overlays.',
        type: 'website',
        locale: 'en_US',
        siteName: 'The Utility Company',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Elysium Athletica | Decentralized Sports Ecosystem',
        description: 'The future of sports operations and AR experiences. Tokenizing franchises and empowering fans through immersive technology.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
