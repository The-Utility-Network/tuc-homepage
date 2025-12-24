import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ledger1 | Neuromimetic Business Architecture | The Utility Company',
    description: 'Ledger1 transforms traditional ERP systems into "Living Ontologies." By mimicking human neural pathways, our AI-driven business architecture learns, adapts, and optimizes enterprise operations in real-time, delivering a Cognitive Enterprise that thinks as fast as it acts.',
    keywords: ['Ledger1', 'Cognitive Enterprise', 'AI ERP', 'Business Architecture', 'Neuromimetic Design', 'Living Ontology', 'Enterprise AI', 'Adaptive Systems', 'Corporate Intelligence', 'Smart Operations'],
    openGraph: {
        title: 'Ledger1 | Neuromimetic Business Architecture',
        description: 'The Cognitive Enterprise is here. Reshape your business with AI-driven, living ontologies that adapt and evolve in real-time.',
        type: 'website',
        locale: 'en_US',
        siteName: 'The Utility Company',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ledger1 | AI-Driven Cognitive Enterprise',
        description: 'Transforming static ERPs into living, breathing business intelligence systems.',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return children;
}
