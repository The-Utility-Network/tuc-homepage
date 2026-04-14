import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { BLOG_POSTS } from '@/data/blog';
import { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = {
    title: 'Blog | The Utility Company — Industrial Automation Insights',
    description: 'Insights on industrial automation, DePIN infrastructure, RWA tokenization, autonomous manufacturing, and the philosophy of Creative Utilitarianism.',
};

export default function BlogIndex() {
    const hub = BLOG_POSTS.find(p => p.isHub);
    const spokes = BLOG_POSTS.filter(p => !p.isHub);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#F54029] selection:text-white font-sans">
            <StructuredData data={{
                '@context': 'https://schema.org',
                '@type': 'Blog',
                name: 'The Utility Company Blog',
                description: 'Insights on industrial automation, decentralized infrastructure, and Creative Utilitarianism.',
                publisher: {
                    '@type': 'Organization',
                    name: 'The Utility Company'
                }
            }} />
            <Navbar />

            <main className="pt-32 pb-24 max-w-7xl mx-auto">
                <div className="text-center px-6 mb-16">
                    <span className="text-xs font-mono tracking-[0.3em] text-[#F54029] mb-4 block">SYS.JOURNAL</span>
                    <h1 className="text-5xl md:text-8xl font-bold mt-4 mb-8 leading-tight tracking-tight">
                        THE BLOG
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Dispatches from the automation frontier.
                    </p>
                </div>

                {/* Hub Article — Featured */}
                {hub && (
                    <Link
                        href={`/blog/${hub.slug}`}
                        className="group block mx-6 mb-16 rounded-2xl overflow-hidden border border-white/5 hover:border-[#F54029]/30 transition-all duration-500"
                    >
                        <div className="relative aspect-[21/9] overflow-hidden">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{ backgroundImage: `url(${hub.coverImage})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="px-3 py-1 bg-[#F54029] text-black text-[10px] font-mono tracking-wider rounded-full font-bold">
                                        HUB ARTICLE
                                    </span>
                                    <span className="text-xs font-mono text-gray-400">{hub.category}</span>
                                    <span className="text-xs font-mono text-gray-500">{hub.readTime}</span>
                                </div>
                                <h2 className="text-2xl md:text-4xl font-bold mb-4 group-hover:text-[#F54029] transition-colors leading-tight max-w-4xl">
                                    {hub.title}
                                </h2>
                                <p className="text-gray-400 max-w-3xl leading-relaxed hidden md:block">
                                    {hub.excerpt}
                                </p>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Spoke Articles */}
                <div className="grid md:grid-cols-2 gap-6 px-6">
                    {spokes.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-[#F54029]/30 transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="relative aspect-[16/9] overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${post.coverImage})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[10px] font-mono text-[#F54029] tracking-widest uppercase">{post.category}</span>
                                    <span className="text-[10px] font-mono text-gray-600">•</span>
                                    <span className="text-[10px] font-mono text-gray-500">{post.readTime}</span>
                                </div>
                                <h3 className="text-lg font-bold mb-3 group-hover:text-[#F54029] transition-colors leading-snug">
                                    {post.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                                    {post.excerpt}
                                </p>
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-xs font-mono text-gray-500">{post.author}</span>
                                    <span className="text-xs font-mono text-gray-600">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
}
