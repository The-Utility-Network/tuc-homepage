'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LocationsGrid({ locations }: { locations: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 36;

    const filteredLocations = locations.filter((loc) => 
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        loc.country.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredLocations.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayLocations = filteredLocations.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 px-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-[#F54029] tracking-widest uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#F54029] animate-pulse"></span>
                        {new Intl.NumberFormat('en-US').format(locations.length)} Global Hubs Online
                    </span>
                </div>
                
                <div className="w-full md:w-96 relative">
                    <input 
                        type="text" 
                        placeholder="Search by city or country code..." 
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-sans focus:outline-none focus:border-[#F54029]/50 transition-colors"
                    />
                    <svg className="w-5 h-5 absolute right-4 top-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="text-xs font-mono text-white/40 uppercase mb-4 px-2">
                {searchQuery ? `Found ${filteredLocations.length} results (Page ${currentPage} of ${totalPages || 1})` : `Displaying Hubs (Page ${currentPage} of ${totalPages || 1})`}
            </div>

            {displayLocations.length > 0 ? (
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayLocations.map((loc: any, idx: number) => (
                        <Link
                            key={`${loc.slug}-${idx}`}
                            href={`/locations/${loc.slug}`}
                            className="group bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-[#F54029]/30 transition-all duration-300 hover:-translate-y-1 block hover:shadow-[0_0_20px_rgba(245,64,41,0.1)] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F54029]/5 rounded-full blur-3xl group-hover:bg-[#F54029]/10 transition-colors pointer-events-none" />
                            
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <h2 className="text-xl font-bold group-hover:text-[#F54029] transition-colors">{loc.name}</h2>
                            </div>
                            <div className="flex items-center gap-2 mb-4 relative z-10">
                                <span className="text-[10px] font-mono text-white/40 border border-white/10 px-2 py-0.5 rounded uppercase">
                                    {loc.country}
                                </span>
                                <span className="text-[10px] font-mono text-[#F54029]/80 px-2 py-0.5 bg-[#F54029]/10 rounded uppercase">
                                    ACTIVE
                                </span>
                            </div>
                            <div className="flex items-center text-[#F54029] text-xs font-bold tracking-widest uppercase relative z-10">
                                Explore Hub <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-black/20 rounded-2xl border border-white/5">
                    <p className="text-white/40 font-mono">No hubs found matching "{searchQuery}"</p>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        PREV
                    </button>
                    <span className="text-sm font-mono text-white/40">
                        {currentPage} / {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-bold text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        NEXT
                    </button>
                </div>
            )}
        </div>
    );
}
