import { parsePodcastRSS } from '@/utils/rssParser';
import PodcastPlayer from '@/components/PodcastPlayer';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DynamicBackground from '@/components/DynamicBackground';

async function getPodcastEpisodes() {
    try {
        const res = await fetch('https://anchor.fm/s/c454a30c/podcast/rss', { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error('Failed to fetch podcast feed');
        const xml = await res.text();
        return parsePodcastRSS(xml);
    } catch (error) {
        console.error('Error fetching podcast:', error);
        return { episodes: [], image: '', description: '' };
    }
}

export default async function PodcastsPage() {
    const { episodes, image, description } = await getPodcastEpisodes();

    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#F54029] selection:text-white overflow-hidden relative">
            <DynamicBackground />
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{
                        backgroundImage: `url('/artifacts/the_refrain_bg.png')`,
                    }}
                />
                <div className="absolute inset-0 bg-black/80" />
            </div>
            <div className="relative z-10">
                <Navbar themeColor="#F54029" />

                {/* Hero Section */}
                <div className="relative z-10 pt-32 pb-12 px-6">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-mono font-bold tracking-tight mb-6">
                            <span className="text-[#F54029]">THE</span> REFRAIN
                        </h1>
                        <p className="max-w-2xl mx-auto text-gray-400 font-mono text-sm md:text-base mb-12 leading-relaxed">
                            Philosophy, Spirituality, and Economics. Between the territory in which you currently exist and the next territory into which you will enter, there lies a clandestine space.
                        </p>
                    </div>
                </div>

                {/* Custom Player Section */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-24">
                    {episodes.length > 0 ? (
                        <PodcastPlayer episodes={episodes} artwork={image} />
                    ) : (
                        <div className="text-center p-12 border border-white/10 rounded-xl bg-white/5 backdrop-blur">
                            <p className="font-mono text-gray-400">Unable to load episodes at this time.</p>
                        </div>
                    )}

                    <div className="mt-20 max-w-4xl mx-auto p-8 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm">
                        <h3 className="text-xl font-mono font-bold text-[#F54029] mb-4">A PHILOSOPHICAL BEDROCK</h3>
                        <div className="space-y-4 text-gray-400 font-mono text-sm leading-relaxed">
                            <p>
                                <strong className="text-white">The Utility Company</strong> is built on the premise that technology is not neutral—it is a reflection of the philosophies that engineer it.
                                <em className="text-white"> The Refrain</em> serves as our intellectual engine, exploring the deep intersections of philosophy, spirituality, and economics that inform our approach to automation.
                            </p>
                            <p>
                                We believe that true automation requires a profound understanding of the human condition. By venturing into the "clandestine spaces" between established territories of thought, we uncover the ethical frameworks necessary to build autonomous systems that serve human flourishing rather than mere efficiency.
                            </p>
                            <p>
                                This is where ancient wisdom meets autonomous machinery. This is where we decide not just <em>how</em> to build the future, but <em className="text-[#F54029]">why</em>.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10">
                    <Footer />
                </div>
            </div>
        </main>
    );
}
