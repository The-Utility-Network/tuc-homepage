import { notFound } from 'next/navigation';
import { BLOG_POSTS } from '@/data/blog';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return BLOG_POSTS.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        return { title: 'Post Not Found' };
    }

    return {
        title: `${post.title} | TUC Blog`,
        description: post.metaDescription,
    };
}

export default async function BlogPost({ params }: Props) {
    const { slug } = await params;
    const post = BLOG_POSTS.find((p) => p.slug === slug);

    if (!post) {
        notFound();
    }

    const related = BLOG_POSTS.filter(p => post.relatedSlugs.includes(p.slug));

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.metaDescription,
        author: {
            '@type': 'Person',
            name: post.author,
        },
        datePublished: post.date,
        image: `https://theutilitycompany.co${post.coverImage}`,
        publisher: {
            '@type': 'Organization',
            name: 'The Utility Company',
        }
    };

    // Split content into sections for image interleaving
    const sections = post.content.split('\n\n## ').map((s, i) => i === 0 ? s : '## ' + s);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#F54029] selection:text-white font-sans">
            <StructuredData data={jsonLd} />
            <Navbar />

            <div className="relative pt-28 overflow-hidden">
                {/* Hero Cover with side vignette */}
                <div className="relative max-w-4xl mx-auto px-6">
                    <div className="relative rounded-2xl overflow-hidden">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-auto object-cover max-h-[450px]"
                        />
                        {/* Side vignettes */}
                        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
                        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
                        {/* Bottom vignette */}
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
                        {/* Top vignette */}
                        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent" />
                    </div>
                </div>

                <main className="max-w-4xl mx-auto relative z-10 px-6 mt-8">
                    {/* Post Meta */}
                    <div className="mb-8">
                        <Link href="/blog" className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-2 mb-8">
                            ← Back to Blog
                        </Link>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            {post.isHub && (
                                <span className="px-3 py-1 bg-[#F54029] text-black text-[10px] font-mono tracking-wider rounded-full font-bold">
                                    HUB ARTICLE
                                </span>
                            )}
                            <span className="text-xs font-mono text-[#F54029] tracking-widest uppercase">{post.category}</span>
                            <span className="text-xs font-mono text-gray-500">{post.readTime}</span>
                            <span className="text-xs font-mono text-gray-600">{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 pb-8 border-b border-white/10">
                            <div className="w-10 h-10 rounded-full bg-[#F54029]/20 flex items-center justify-center text-[#F54029] font-bold text-sm">
                                {post.author.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-white">{post.author}</span>
                                <p className="text-xs text-gray-500">The Utility Company</p>
                            </div>
                        </div>
                    </div>

                    {/* Article Body */}
                    <article className="prose prose-invert prose-lg max-w-none">
                        {sections.map((section, index) => (
                            <div key={index}>
                                <div
                                    className="blog-content text-gray-300 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: section
                                            .replace(/^## (.+)$/gm, '<h2 class="text-2xl md:text-3xl font-bold text-white mt-16 mb-6">$1</h2>')
                                            .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                                            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#F54029] hover:underline transition-colors">$1</a>')
                                            .replace(/^- \*\*(.+?)\*\*(.*)$/gm, '<div class="flex gap-3 items-start my-3"><span class="w-1.5 h-1.5 bg-[#F54029] rounded-full mt-2.5 flex-shrink-0"></span><span><strong class="text-white">$1</strong>$2</span></div>')
                                            .replace(/^- (.+)$/gm, '<div class="flex gap-3 items-start my-3"><span class="w-1.5 h-1.5 bg-[#F54029] rounded-full mt-2.5 flex-shrink-0"></span><span>$1</span></div>')
                                            .replace(/^(\d+)\. \*\*(.+?)\*\*(.*)$/gm, '<div class="flex gap-3 items-start my-3"><span class="text-[#F54029] font-mono text-sm font-bold min-w-[1.5rem]">$1.</span><span><strong class="text-white">$2</strong>$3</span></div>')
                                            .replace(/\n\n/g, '</p><p class="mb-6">')
                                    }}
                                />

                                {/* Interleave body images */}
                                {index > 0 && index <= post.bodyImages.length && (
                                    <div className="my-12 rounded-xl overflow-hidden border border-white/10">
                                        <img
                                            src={post.bodyImages[index - 1]}
                                            alt={`${post.title} illustration ${index}`}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </article>

                    {/* Related Articles */}
                    {related.length > 0 && (
                        <div className="mt-24 pt-12 pb-24 border-t border-white/10">
                            <h3 className="text-xs font-mono tracking-widest text-gray-500 mb-8">RELATED ARTICLES</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {related.map(rel => (
                                    <Link
                                        key={rel.slug}
                                        href={`/blog/${rel.slug}`}
                                        className="group glass-panel rounded-xl p-6 border border-white/5 hover:border-[#F54029]/30 transition-all duration-300"
                                    >
                                        <span className="text-[10px] font-mono text-[#F54029] tracking-widest uppercase">{rel.category}</span>
                                        <h4 className="text-lg font-bold mt-2 mb-2 group-hover:text-[#F54029] transition-colors leading-snug">
                                            {rel.title}
                                        </h4>
                                        <p className="text-gray-500 text-sm line-clamp-2">{rel.excerpt}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Back to Hub CTA */}
                    {!post.isHub && (
                        <div className="mt-12 mb-24 text-center">
                            <Link
                                href="/blog/what-is-industrial-automation-as-a-service"
                                className="inline-block px-8 py-4 bg-[#F54029]/10 border border-[#F54029]/30 rounded-xl text-[#F54029] font-mono text-sm tracking-wider hover:bg-[#F54029]/20 transition-all"
                            >
                                ← READ THE HUB ARTICLE: I3AS COMPLETE GUIDE
                            </Link>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}
