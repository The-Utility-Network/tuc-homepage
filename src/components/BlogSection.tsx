import Link from 'next/link';
import { BLOG_POSTS } from '@/data/blog';

export default function BlogSection() {
    const featured = BLOG_POSTS.slice(0, 3);

    return (
        <section id="blog" className="relative py-24 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="section-heading">SYS.JOURNAL</span>
                    <h2 className="section-title mt-4">Latest from the Blog</h2>
                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        Dispatches from the automation frontier — deep dives into the technology,
                        economics, and philosophy driving the future of industry.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {featured.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-[#F54029]/30 transition-all duration-500 hover:-translate-y-1"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${post.coverImage})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                                {post.isHub && (
                                    <div className="absolute top-4 left-4">
                                        <span className="px-2 py-1 bg-[#F54029] text-black text-[9px] font-mono tracking-wider rounded-full font-bold">
                                            HUB
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-[9px] font-mono text-[#F54029] tracking-widest uppercase">{post.category}</span>
                                    <span className="text-[9px] font-mono text-gray-600">•</span>
                                    <span className="text-[9px] font-mono text-gray-500">{post.readTime}</span>
                                </div>
                                <h3 className="text-sm font-bold mb-2 group-hover:text-[#F54029] transition-colors leading-snug line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                                    {post.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/blog"
                        className="btn-secondary text-sm"
                    >
                        VIEW ALL ARTICLES →
                    </Link>
                </div>
            </div>
        </section>
    );
}
