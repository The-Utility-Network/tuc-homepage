import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import PitchDeckViewerWrapper from '@/components/PitchDeckViewerWrapper';

export const metadata: Metadata = {
    title: 'Cyber-Physical Codex | The Utility Company Pitch Deck',
    description: 'The Cyber-Physical Codex — a comprehensive pitch deck outlining The Utility Company\'s architecture for community-captained automation across all industries. Digital twins, embedded controls, and tokenized agency.',
    openGraph: {
        title: 'Cyber-Physical Codex | The Utility Company',
        description: 'Our architecture for community-captained automation. Digital twins. Embedded controls. Tokenized agency.',
        type: 'website',
    },
};

export default function PitchDeckPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-utility-red selection:text-white font-sans">
            <StructuredData data={{
                '@context': 'https://schema.org',
                '@type': 'PresentationDigitalDocument',
                name: 'Cyber-Physical Codex',
                description: 'The Utility Company pitch deck — architecture for community-captained industrial automation.',
                publisher: {
                    '@type': 'Organization',
                    name: 'The Utility Company',
                    url: 'https://theutilitycompany.co'
                }
            }} />
            <Navbar />

            <main className="pt-24 pb-24">
                {/* PDF Viewer — the component handles both the hero header and the reader */}
                <PitchDeckViewerWrapper />
            </main>

            <Footer />
        </div>
    );
}
