'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navLinks = [
    { label: 'HOME', href: '#hero', color: '#F54029' },
    { label: 'ABOUT', href: '#about', color: '#0ea5e9' },
    { label: 'SUBSIDIARIES', href: '#subsidiaries', color: '#8b5cf6' },
    { label: 'SERVICES', href: '#services', color: '#10b981' },
    { label: 'PARTNERS', href: '#partners', color: '#ef4444' },
    { label: 'PHILOSOPHY', href: '#philosophy', color: '#ec4899' },
    { label: 'INVESTORS', href: '/investors', color: '#f59e0b' },
];

const externalLinks: { label: string; href: string; internal?: boolean }[] = [
    { label: 'OUR MODEL', href: '/our-model', internal: true },
    { label: 'SHOP', href: 'https://shop.theutilitycompany.co' },
    { label: 'PODCASTS', href: '/podcasts', internal: true },
];

interface NavbarProps {
    themeColor?: string;
}

export default function Navbar({ themeColor = '#F54029' }: NavbarProps) {
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [time, setTime] = useState('');
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            if (pathname === '/') {
                const sections = navLinks.filter(link => link.href.startsWith('#'));
                let current = '';
                for (const section of sections) {
                    const el = document.getElementById(section.href.substring(1));
                    if (el) {
                        const rect = el.getBoundingClientRect();
                        if (rect.top <= window.innerHeight / 2.5 && rect.bottom >= window.innerHeight / 2.5) {
                            current = section.href;
                        }
                    }
                }
                if (current) setActiveSection(current);
                if (window.scrollY < 100) setActiveSection('#hero');
            } else {
                setActiveSection(pathname);
            }
        };

        handleScroll();

        const tick = () => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        tick();
        const interval = setInterval(tick, 1000);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, [pathname]);

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled
                    ? 'bg-black/60 backdrop-blur-2xl border-b shadow-[0_4px_30px_rgba(0,0,0,0.1)] py-3'
                    : 'py-5 bg-transparent'
                    }`}
                style={scrolled ? { borderBottomColor: `${themeColor}30`, boxShadow: `0 4px 30px ${themeColor}10` } : { borderBottomColor: 'transparent' }}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo & System Status */}
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            <img 
                                src="https://storage.googleapis.com/tgl_cdn/images/Medallions/TUC.png" 
                                alt="TUC Logo" 
                                className="w-8 h-8 object-contain group-hover:opacity-80 transition-opacity" 
                            />
                            <div className="flex flex-col">
                                <span className="hidden md:block text-xs font-mono tracking-widest opacity-80 transition-colors" style={{ color: themeColor }}>
                                    SYS.ONLINE
                                </span>
                                <span className="text-lg font-bold text-white tracking-widest font-mono group-hover:opacity-80 transition-opacity">
                                    TUC//HOME
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.href;
                                return (
                                <Link
                                    key={link.label}
                                    href={link.href.startsWith('#') && pathname !== '/' ? `/${link.href}` : link.href}
                                    className={`relative px-3 py-2 text-[10px] whitespace-nowrap font-mono tracking-wider transition-all duration-200 rounded-lg hover:bg-white/5 flex flex-col items-center justify-center ${isActive ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {link.label}
                                    <div className="absolute bottom-0 w-full flex justify-center translate-y-1/2">
                                        <span 
                                            className={`rounded-full transition-all duration-300 ${isActive ? 'w-1.5 h-1.5 opacity-100' : 'w-0 h-0 opacity-0'}`}
                                            style={{ backgroundColor: link.color }}
                                        />
                                    </div>
                                </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Time Display */}
                        <div className="hidden md:block text-[10px] whitespace-nowrap font-mono tracking-wider" style={{ color: themeColor }}>
                            {time}
                        </div>

                        {/* External Links */}
                        <div className="hidden xl:flex items-center gap-2">
                            {externalLinks.map((link) => (
                                link.internal ? (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="px-3 py-1.5 text-[10px] whitespace-nowrap font-mono tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 rounded-full transition-all duration-200"
                                        style={{ '--hover-color': themeColor } as React.CSSProperties}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = themeColor}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    >
                                        {link.label}
                                    </Link>
                                ) : (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 text-[10px] whitespace-nowrap font-mono tracking-wider text-gray-500 hover:text-white border border-white/10 hover:border-white/30 rounded-full transition-all duration-200"
                                        style={{ '--hover-color': themeColor } as React.CSSProperties}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = themeColor}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                                    >
                                        {link.label}
                                    </a>
                                )
                            ))}
                        </div>

                        {/* CTA Button */}
                        <Link
                            href="https://portal.theutilitycompany.co"
                            className="text-xs font-mono tracking-wider px-6 py-3 rounded bg-white text-black font-bold hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: themeColor, color: '#000' }}
                        >
                            PORTAL
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-white transition-colors"
                            style={{ color: mobileMenuOpen ? themeColor : 'white' }}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-black/80 backdrop-blur-xl mt-2 mx-4 rounded-2xl p-4 animate-fadeInUp border" style={{ borderColor: `${themeColor}40` }}>
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const isActive = activeSection === link.href;
                                return (
                                <Link
                                    key={link.label}
                                    href={link.href.startsWith('#') && pathname !== '/' ? `/${link.href}` : link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-4 py-3 text-sm font-mono tracking-wider transition-all rounded-lg hover:bg-white/5 flex items-center justify-between ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}
                                >
                                    {link.label}
                                    <span 
                                        className={`rounded-full transition-all duration-300 ${isActive ? 'w-1.5 h-1.5 opacity-100' : 'w-0 h-0 opacity-0'}`}
                                        style={{ backgroundColor: link.color }}
                                    />
                                </Link>
                                );
                            })}
                            <div className="border-t border-white/10 mt-2 pt-2">
                                {externalLinks.map((link) => (
                                    link.internal ? (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="block px-4 py-2 text-xs font-mono tracking-wider text-gray-500 hover:text-white transition-colors"
                                            style={{ color: '#9ca3af' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block px-4 py-2 text-xs font-mono tracking-wider text-gray-500 hover:text-white transition-colors"
                                            style={{ color: '#9ca3af' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
                                            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                                        >
                                            ↗ {link.label}
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* HUD Decorative Lines */}
            <div className="fixed top-20 left-0 right-0 pointer-events-none z-40 opacity-50">
                <div className="absolute h-px bg-gradient-to-r from-transparent via-current to-transparent w-full" style={{ color: themeColor }} />
            </div>
        </>
    );
}
