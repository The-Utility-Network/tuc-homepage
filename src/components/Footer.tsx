import Link from 'next/link';
import Image from 'next/image';

const navigationLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Subsidiaries', href: '#subsidiaries' },
    { label: 'Services', href: '#services' },
    { label: 'Partners', href: '#partners' },
    { label: 'Philosophy', href: '#philosophy' },
];

const externalLinks = [
    { label: 'Our Model', href: '/our-model' },
    { label: 'The Graine Ledger', href: 'https://thegraineledger.com' },
    { label: 'DigiBazaar', href: 'https://digibazaar.io' },
    { label: 'Osiris Protocol', href: 'https://osiris.theutilitycompany.co' },
];

const socialLinks = [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Blog', href: 'https://medium.com/@theutilityco' },
    { label: 'Podcasts', href: 'https://youtu.be/R4RVVeGFy2U' },
    { label: 'Discord', href: 'https://discord.gg/theutilitycompany' },
];

const teamMembers = [
    'Milan Joshi - Founder',
    'Krishna Patel - Operations',
    'Kerul Patel - Developer',
    'Manoj Mhapankar - Artist',
];

export default function Footer() {
    return (
        <footer className="relative py-16 px-6 border-t border-white/10">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 relative">
                                <Image
                                    src="https://engram1.blob.core.windows.net/tuc-homepage/Medallions/Symbol.png"
                                    alt="The Utility Company Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <span className="text-white font-bold">The Utility Company</span>
                                <p className="text-xs text-gray-500">Industrial Automation as a Service</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            <span className="text-[#F54029] font-semibold">Simple Choices. Complex Outcomes.</span> Empowering communities through automation and innovation.
                        </p>
                        <a
                            href="mailto:info@theutilitycompany.co"
                            className="text-[#F54029] text-sm hover:underline"
                        >
                            info@theutilitycompany.co
                        </a>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-xs font-mono tracking-wider text-gray-500 mb-4">NAVIGATE</h4>
                        <ul className="space-y-2">
                            {navigationLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-400 text-sm hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Ecosystem */}
                    <div>
                        <h4 className="text-xs font-mono tracking-wider text-gray-500 mb-4">ECOSYSTEM</h4>
                        <ul className="space-y-2">
                            {externalLinks.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-gray-400 text-sm hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        {link.label}
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 0 00-2 2v10a2 0 002 2h10a2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <h4 className="text-xs font-mono tracking-wider text-gray-500 mt-6 mb-4">CONNECT</h4>
                        <ul className="space-y-2">
                            {socialLinks.map((link) => (
                                <li key={link.label}>
                                    {link.href.startsWith('/') ? (
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 text-sm hover:text-[#F54029] transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 text-sm hover:text-[#F54029] transition-colors"
                                        >
                                            {link.label}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Team */}
                    <div>
                        <h4 className="text-xs font-mono tracking-wider text-gray-500 mb-4">OUR TEAM</h4>
                        <div className="space-y-4">
                            {[
                                { name: 'Krishna Patel', title: 'Founder & CEO' },
                                { name: 'Eric Turner', title: 'CEO (Ledger1)' },
                                { name: 'Michael Milton', title: 'CMO (Ledger1)' }
                            ].map((member) => (
                                <div key={member.name} className="flex flex-col">
                                    <span className="text-white text-sm font-semibold">{member.name}</span>
                                    <span className="text-gray-500 text-xs">{member.title}</span>
                                </div>
                            ))}
                        </div>
                        <a
                            href="https://theutilitycompany.co/pages/about-us/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-6 text-xs font-mono text-[#F54029] hover:underline"
                        >
                            MEET THE TEAM →
                        </a>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} The Utility Company LLC. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-gray-500 text-xs hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-500 text-xs hover:text-white transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
