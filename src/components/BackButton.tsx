'use client';

import Link from 'next/link';

export default function BackButton({ color = 'white', label = 'Back to Hub' }: { color?: string, label?: string }) {
    return (
        <Link
            href="/"
            className="fixed top-28 left-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 hover:pl-3 group"
            style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                boxShadow: `0 4px 20px rgba(0,0,0,0.2)`
            }}
        >
            <div className="relative w-6 h-6 flex items-center justify-center">
                <svg
                    width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="transform transition-transform duration-300 group-hover:-translate-x-1"
                >
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                </svg>
            </div>
            <span
                className="font-mono text-sm font-bold tracking-widest uppercase opacity-0 w-0 overflow-hidden group-hover:opacity-100 group-hover:w-auto transition-all duration-300 whitespace-nowrap"
                style={{ color: color }}
            >
                {label}
            </span>
        </Link>
    );
}
