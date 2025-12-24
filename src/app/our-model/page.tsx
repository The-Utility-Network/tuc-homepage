'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import ChapterArt from './ChapterArt';
import {
    chapter1,
    chapter2,
    chapter3,
    chapter4,
    chapter5,
    chapter6,
    chapter7,
    chapter8,
    chapter9,
    ChapterData,
    ChapterSection
} from './chapters';

// Collect all chapters
const chapters: ChapterData[] = [
    chapter1,
    chapter2,
    chapter3,
    chapter4,
    chapter5,
    chapter6,
    chapter7,
    chapter8,
    chapter9
];

// Default theme color for navbar
const DEFAULT_COLOR = '#10B981';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15 }
    }
};

// Table of Contents Component
function TableOfContents({
    chapters: chapterList,
    activeChapter,
    onChapterClick
}: {
    chapters: ChapterData[],
    activeChapter: string,
    onChapterClick: (id: string) => void
}) {
    return (
        <nav className="space-y-2">
            <div className="text-xs font-mono tracking-widest uppercase mb-4 text-gray-400">
                Chapters
            </div>
            {chapterList.map((chapter) => (
                <button
                    key={chapter.id}
                    onClick={() => onChapterClick(chapter.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 group ${activeChapter === chapter.id
                        ? 'bg-white/10 border-l-2'
                        : 'hover:bg-white/5'
                        }`}
                    style={{
                        borderColor: activeChapter === chapter.id ? chapter.color : 'transparent'
                    }}
                >
                    <div className="flex items-baseline gap-3">
                        <span
                            className={`text-xs font-mono ${activeChapter === chapter.id ? 'opacity-100' : 'opacity-50'
                                }`}
                            style={{ color: chapter.color }}
                        >
                            {chapter.number}
                        </span>
                        <span className={`text-sm font-medium transition-colors ${activeChapter === chapter.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                            }`}>
                            {chapter.title}
                        </span>
                    </div>
                </button>
            ))}
        </nav>
    );
}

// Section Component
function Section({ section, color }: { section: ChapterSection, color: string }) {
    // Process content with proper markdown-like formatting
    const renderContent = (text: string) => {
        // Replace **bold** with styled spans
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const inner = part.slice(2, -2);
                return <strong key={i} style={{ color: 'white' }}>{inner}</strong>;
            }
            return part;
        });
    };

    return (
        <motion.div
            variants={fadeInUp}
            className="mb-16"
        >
            <h3
                className="text-2xl md:text-3xl font-bold mb-6"
                style={{ color }}
            >
                {section.heading}
            </h3>
            <div className="prose prose-invert prose-lg max-w-none">
                {section.content.trim().split('\n\n').map((paragraph, i) => {
                    const trimmedPara = paragraph.trim();

                    // Check if it's a numbered list (starts with "1." or similar)
                    if (/^\d+\./.test(trimmedPara)) {
                        const items = trimmedPara.split('\n').filter(line => line.trim());
                        return (
                            <div key={i} className="mb-6 pl-4 border-l-2" style={{ borderColor: `${color}40` }}>
                                {items.map((item, j) => {
                                    const listMatch = item.match(/^(\d+)\.\s*\*\*([^*]+)\*\*[:\.]?\s*([\s\S]*)$/);
                                    if (listMatch) {
                                        return (
                                            <div key={j} className="mb-4">
                                                <span
                                                    className="font-bold"
                                                    style={{ color }}
                                                >
                                                    {listMatch[1]}. {listMatch[2]}
                                                </span>
                                                {listMatch[3] && (
                                                    <span className="text-gray-300"> {listMatch[3]}</span>
                                                )}
                                            </div>
                                        );
                                    }
                                    return (
                                        <p key={j} className="text-gray-300 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                                            {renderContent(item)}
                                        </p>
                                    );
                                })}
                            </div>
                        );
                    }

                    // Regular paragraph - render with inline bold support
                    return (
                        <p
                            key={i}
                            className="text-gray-300 leading-relaxed mb-6 text-lg"
                            style={{
                                fontFamily: 'Georgia, serif'
                            }}
                        >
                            {renderContent(trimmedPara)}
                        </p>
                    );
                })}
            </div>
        </motion.div>
    );
}

// Chapter Component
function Chapter({ chapter, index }: { chapter: ChapterData, index: number }) {
    const ref = useRef<HTMLElement>(null);

    return (
        <motion.section
            ref={ref}
            id={chapter.id}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="scroll-mt-32 mb-32"
        >
            {/* Chapter Artwork */}
            <ChapterArt chapterNumber={index + 1} color={chapter.color} />

            <motion.div variants={fadeInUp} className="mb-12">
                {/* Chapter Number */}
                <div
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full border mb-6"
                    style={{ borderColor: `${chapter.color}40`, color: chapter.color }}
                >
                    <span className="font-mono text-sm tracking-widest">CHAPTER {chapter.number}</span>
                </div>

                {/* Title */}
                <h2
                    className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4"
                    style={{
                        background: `linear-gradient(135deg, ${chapter.color}, white)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    {chapter.title}
                </h2>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-gray-400 italic font-light">
                    {chapter.subtitle}
                </p>
            </motion.div>

            {/* Sections */}
            {chapter.sections.map((section, i) => (
                <Section key={i} section={section} color={chapter.color} />
            ))}

            {/* Pull Quote */}
            <motion.blockquote
                variants={fadeInUp}
                className="my-16 py-12 px-12 border-l-4 relative bg-white/5 rounded-r-xl"
                style={{ borderColor: chapter.color }}
            >
                <div
                    className="absolute left-4 top-2 text-7xl leading-none font-serif select-none"
                    style={{ color: chapter.color, opacity: 0.3 }}
                >
                    "
                </div>
                <p
                    className="text-2xl md:text-3xl font-light italic leading-relaxed relative z-10 pl-8"
                    style={{ color: chapter.color }}
                >
                    {chapter.pullQuote}
                </p>
            </motion.blockquote>

            {/* Chapter Divider */}
            {index < chapters.length - 1 && (
                <div className="flex items-center justify-center gap-4 py-16">
                    <div className="w-24 h-px" style={{ backgroundColor: `${chapter.color}30` }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chapter.color }} />
                    <div className="w-24 h-px" style={{ backgroundColor: `${chapters[index + 1].color}30` }} />
                </div>
            )}
        </motion.section>
    );
}

export default function OurModelPage() {
    const [activeChapter, setActiveChapter] = useState('genesis');
    const [showToc, setShowToc] = useState(false);
    const [particles, setParticles] = useState<any[]>([]);
    const mainRef = useRef<HTMLDivElement>(null);

    // Generate particles on client side to avoid hydration mismatch
    useEffect(() => {
        const newParticles = [...Array(30)].map((_, i) => ({
            id: i,
            color: chapters[i % 9].color,
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            left: Math.random() * 100,
            top: Math.random() * 100,
            opacity: Math.random() * 0.5 + 0.1,
            duration: 3 + Math.random() * 3,
            delay: Math.random() * 2
        }));
        setParticles(newParticles);
    }, []);

    const { scrollYProgress } = useScroll({
        target: mainRef,
        offset: ["start start", "end end"]
    });

    const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

    // Get current chapter color
    const currentChapter = chapters.find(c => c.id === activeChapter) || chapters[0];
    const currentColor = currentChapter.color;

    // Update active chapter based on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveChapter(entry.target.id);
                    }
                });
            },
            { rootMargin: '-30% 0px -70% 0px' }
        );

        chapters.forEach((chapter) => {
            const element = document.getElementById(chapter.id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToChapter = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setShowToc(false);
        }
    };

    return (
        <main
            ref={mainRef}
            className="bg-black text-white min-h-screen relative font-sans selection:bg-emerald-500 selection:text-white"
        >
            <Navbar themeColor={currentColor} />
            <BackButton color={currentColor} />

            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 h-1 z-50"
                style={{
                    width: progressWidth,
                    backgroundColor: currentColor
                }}
            />

            {/* Mobile TOC Toggle */}
            <button
                onClick={() => setShowToc(!showToc)}
                className="fixed bottom-8 right-8 z-40 lg:hidden w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
                style={{ backgroundColor: currentColor }}
            >
                <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile TOC Drawer */}
            {showToc && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-40 lg:hidden"
                >
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowToc(false)} />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        className="absolute right-0 top-0 h-full w-80 bg-black/95 border-l border-white/10 p-6 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-bold">Contents</h3>
                            <button onClick={() => setShowToc(false)} className="text-gray-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <TableOfContents
                            chapters={chapters}
                            activeChapter={activeChapter}
                            onChapterClick={scrollToChapter}
                        />
                    </motion.div>
                </motion.div>
            )}

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-fixed"
                        style={{
                            backgroundImage: `url('/artifacts/creative_revolution_bg.png')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-black/80" />
                </div>

                {/* Floating Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {particles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            className="absolute rounded-full"
                            style={{
                                backgroundColor: particle.color,
                                width: particle.width,
                                height: particle.height,
                                left: `${particle.left}%`,
                                top: `${particle.top}%`,
                                opacity: particle.opacity
                            }}
                            animate={{
                                y: [0, -30, 0],
                                opacity: [0.1, 0.4, 0.1]
                            }}
                            transition={{
                                duration: particle.duration,
                                repeat: Infinity,
                                delay: particle.delay
                            }}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    >
                        <div
                            className="inline-block px-6 py-3 rounded-full border text-sm font-mono tracking-widest uppercase mb-8"
                            style={{ borderColor: currentColor, color: currentColor }}
                        >
                            A Philosophical Treatise in Nine Parts
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6"
                    >
                        THE CREATIVE
                        <br />
                        <span
                            style={{
                                background: `linear-gradient(135deg, ${chapters[0].color}, ${chapters[4].color}, ${chapters[8].color})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                        >
                            REVOLUTION
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 font-light italic"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        On the Philosophical Foundations of Autonomous Creation,
                        Collective Flourishing, and the Architecture of a New World
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <button
                            onClick={() => scrollToChapter('genesis')}
                            className="px-10 py-5 rounded-full font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                            style={{
                                backgroundColor: currentColor,
                                boxShadow: `0 0 40px ${currentColor}40`
                            }}
                        >
                            BEGIN READING
                        </button>
                        <div className="text-sm text-gray-500 font-mono">
                            {chapters.length} Chapters • Est. 2+ hours
                        </div>
                    </motion.div>

                    {/* Chapter color preview */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="flex items-center justify-center gap-2 mt-12"
                    >
                        {chapters.map((ch) => (
                            <div
                                key={ch.id}
                                className="w-3 h-3 rounded-full transition-all duration-300 hover:scale-150"
                                style={{ backgroundColor: ch.color }}
                                title={ch.title}
                            />
                        ))}
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-2 text-gray-500"
                    >
                        <span className="text-xs font-mono tracking-widest">SCROLL</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.div>
                </motion.div>
            </section>

            {/* Main Content Layout */}
            <div className="relative">
                {/* Background Pattern */}
                <div className="fixed inset-0 pointer-events-none z-0">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-fixed"
                        style={{
                            backgroundImage: `url('/artifacts/creative_revolution_bg.png')`,
                        }}
                    />
                    <div className="absolute inset-0 bg-black/90" />
                </div>

                <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
                    <div className="flex gap-16 items-start">
                        {/* Sticky Sidebar - Desktop */}
                        <aside className="hidden lg:block w-80 shrink-0 sticky top-32">
                            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-4">
                                <TableOfContents
                                    chapters={chapters}
                                    activeChapter={activeChapter}
                                    onChapterClick={scrollToChapter}
                                />

                                {/* Current chapter indicator */}
                                <div className="mt-8 p-4 rounded-xl border" style={{ borderColor: `${currentColor}30` }}>
                                    <div className="text-xs font-mono text-gray-500 mb-2">NOW READING</div>
                                    <div className="font-bold" style={{ color: currentColor }}>
                                        {currentChapter.title}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <article className="flex-1 max-w-3xl">
                            {/* Epigraph */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="mb-24 text-center"
                            >
                                <blockquote
                                    className="text-2xl md:text-3xl font-light italic leading-relaxed text-gray-400 mb-6"
                                    style={{ fontFamily: 'Georgia, serif' }}
                                >
                                    "The only way to make sense out of change is to plunge into it,
                                    move with it, and join the dance."
                                </blockquote>
                                <cite className="text-sm font-mono tracking-widest" style={{ color: DEFAULT_COLOR }}>
                                    — ALAN WATTS
                                </cite>
                            </motion.div>

                            {/* Chapters */}
                            {chapters.map((chapter, index) => (
                                <Chapter key={chapter.id} chapter={chapter} index={index} />
                            ))}

                            {/* Colophon */}
                            <motion.section
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="mt-32 pt-16 border-t border-white/10 text-center"
                            >
                                <div
                                    className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
                                    style={{
                                        background: `linear-gradient(135deg, ${chapters[0].color}20, ${chapters[4].color}20, ${chapters[8].color}20)`
                                    }}
                                >
                                    <svg className="w-10 h-10" style={{ color: DEFAULT_COLOR }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-sm font-mono mb-4">
                                    A philosophical treatise by
                                </p>
                                <h3 className="text-3xl font-bold mb-6">The Utility Company</h3>
                                <p className="text-gray-400 max-w-lg mx-auto leading-relaxed mb-8">
                                    This work is offered freely to all who seek to understand and participate
                                    in the construction of a more equitable, sustainable, and flourishing world.
                                </p>
                                <a
                                    href="/"
                                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border transition-all duration-300 hover:bg-white/5"
                                    style={{ borderColor: DEFAULT_COLOR, color: DEFAULT_COLOR }}
                                >
                                    <span>Return to Home</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </motion.section>
                        </article>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
