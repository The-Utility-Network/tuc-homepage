'use client'

import { createClient } from '@/lib/supabase'
import { useState, useEffect } from 'react'
import { Folder, FileText, Download, Search, ChevronRight, LayoutGrid, List, Shield, Info, FolderOpen, File, PieChart } from 'lucide-react'

export default function DocumentsPage() {
    const supabase = createClient()
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedFolder, setSelectedFolder] = useState<string | null>(null)

    // Dynamic Data
    const [subsidiaries, setSubsidiaries] = useState<any[]>([])
    const [documents, setDocuments] = useState<any[]>([])
    const [recentDocs, setRecentDocs] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    // Fetch Subsidiaries Metadata
    useEffect(() => {
        const fetchSubs = async () => {
            const { data } = await supabase.from('subsidiaries').select('*').order('name')
            if (data) {
                // Sort so 'network' is first if exists, then alphabetical
                const sorted = data.sort((a, b) => {
                    if (a.id === 'network') return -1
                    if (b.id === 'network') return 1
                    return a.name.localeCompare(b.name)
                })
                setSubsidiaries(sorted)
            }
        }
        fetchSubs()
    }, [])

    // Fetch Recent Stats
    useEffect(() => {
        const fetchRecent = async () => {
            const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false }).limit(5)
            setRecentDocs(data || [])
        }
        fetchRecent()
    }, [])

    // Fetch documents when folder selected
    useEffect(() => {
        if (!selectedFolder) {
            setDocuments([])
            return
        }

        const fetchDocs = async () => {
            setLoading(true)
            const { data } = await supabase
                .from('documents')
                .select('*')
                .eq('subsidiary', selectedFolder)
                .order('created_at', { ascending: false })

            setDocuments(data || [])
            setLoading(false)
        }
        fetchDocs()
    }, [selectedFolder])

    const currentSubsidiary = subsidiaries.find(s => s.id === selectedFolder)

    return (
        <div className="space-y-8 animate-fadeIn h-full flex flex-col pb-20">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-white/5 pb-8 shrink-0">
                <div>
                    <h1 className="text-4xl font-rajdhani font-bold text-white uppercase tracking-wider flex items-center gap-4">
                        <FolderOpen className="text-[#F54029]" size={40} />
                        Global Data Room
                    </h1>
                    <p className="text-white/40 text-sm mt-2 max-w-xl leading-relaxed">
                        Secure repository for due diligence materials, organized by subsidiary entity.
                        All access is logged and watermarked.
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-black/40 border border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#F54029] text-white' : 'text-white/40 hover:text-white'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#F54029] text-white' : 'text-white/40 hover:text-white'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Breadcrumb if deeper */}
            {selectedFolder && (
                <div className="flex items-center gap-2 text-sm text-white/40 shrink-0">
                    <button onClick={() => setSelectedFolder(null)} className="hover:text-white transition-colors">Root</button>
                    <ChevronRight size={14} />
                    <span
                        className="font-bold"
                        style={{ color: currentSubsidiary?.hex_color }}
                    >{currentSubsidiary?.name}</span>
                </div>
            )}

            {/* Main Content Area */}
            {selectedFolder ? (
                // Folder Content View 
                <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-8 animate-fadeInUp">
                    <div className="flex items-center gap-4 mb-8">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center border transition-all"
                            style={{
                                backgroundColor: `${currentSubsidiary?.hex_color}10`,
                                borderColor: `${currentSubsidiary?.hex_color}30`,
                                boxShadow: `0 0 30px ${currentSubsidiary?.hex_color}10`
                            }}
                        >
                            <img src={currentSubsidiary?.logo_url} alt={currentSubsidiary?.name} className="w-10 h-10 object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-rajdhani text-white">{currentSubsidiary?.name}</h2>
                            <p className="text-white/40 text-sm">{currentSubsidiary?.description}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {loading && <p className="text-white/40 text-sm animate-pulse">Decrypting file list...</p>}

                        {!loading && documents.length === 0 && (
                            <p className="text-white/40 text-sm italic">No documents available in this secure folder.</p>
                        )}

                        {documents.map(doc => (
                            <div key={doc.id} className="group p-4 bg-white/[0.02] border border-white/5 hover:border-[#F54029]/30 rounded-xl transition-all cursor-pointer hover:bg-white/[0.04]">
                                <div className="flex justify-between items-start mb-4">
                                    <FileText className="text-white/20 group-hover:text-white transition-colors" size={24} />
                                    <a href={doc.file_url} target="_blank" className="text-white/20 hover:text-[#F54029] transition-colors"><Download size={16} /></a>
                                </div>
                                <p className="text-sm font-medium text-white/80 group-hover:text-white truncate">{doc.title}</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-wider mt-1">{doc.doc_type || 'PDF'}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 p-4 rounded-lg bg-[#F54029]/5 border border-[#F54029]/10 flex items-center gap-3">
                        <Info className="text-[#F54029]" size={20} />
                        <p className="text-xs text-[#F54029]/80">
                            All documents are confidental. Unauthorized distribution is strictly prohibited and tracked via watermark.
                        </p>
                    </div>
                </div>
            ) : (
                // Root Grid View
                <div className="flex-1 overflow-y-auto pb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
                        {subsidiaries.map((sub, i) => (
                            <div
                                key={sub.id}
                                onClick={() => setSelectedFolder(sub.id)}
                                className="group relative overflow-hidden bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 transition-all duration-300 cursor-pointer hover:transform hover:-translate-y-1"
                                style={{
                                    animationDelay: `${i * 50}ms`,
                                    borderColor: 'rgba(255,255,255,0.05)',
                                }}
                            >
                                <div
                                    className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-16 -mt-16 transition-colors opacity-50 group-hover:opacity-100"
                                    style={{ background: `radial-gradient(circle at center, ${sub.hex_color}20 0%, transparent 70%)` }}
                                />

                                <div className="flex justify-between items-start mb-6 relative">
                                    <div
                                        className="relative w-16 h-16 rounded-xl bg-white/5 border border-white/5 group-hover:scale-110 transition-transform flex items-center justify-center p-2"
                                        style={{
                                            borderColor: `${sub.hex_color}40`,
                                            boxShadow: `0 0 20px ${sub.hex_color}10`
                                        }}
                                    >
                                        <img src={sub.logo_url} alt={sub.name} className="w-full h-full object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                                    </div>
                                    <div
                                        className="px-2 py-1 rounded text-[10px] font-bold bg-white/5 uppercase tracking-wider border transition-colors"
                                        style={{
                                            color: sub.hex_color,
                                            borderColor: `${sub.hex_color}30`,
                                            backgroundColor: `${sub.hex_color}05`
                                        }}
                                    >
                                        Secure
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold font-rajdhani text-white mb-2 transition-colors">{sub.name}</h3>
                                <p className="text-sm text-white/40 line-clamp-2 mb-6 group-hover:text-white/60 transition-colors">
                                    {sub.description}
                                </p>

                                <div className="flex items-center gap-2 text-xs text-white/30 group-hover:text-white/50 transition-colors pt-4 border-t border-white/5">
                                    <Shield size={12} />
                                    <span>Authorized Access Only</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold font-rajdhani text-white">Recently Updated</h3>
                            <button className="text-xs text-[#F54029] uppercase tracking-wider hover:text-white transition-colors">View Audit Log</button>
                        </div>
                        <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                            {recentDocs.length === 0 && <div className="p-4 text-white/20 text-sm italic">No recent updates.</div>}

                            {recentDocs.map((doc, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-[#F54029] transition-colors">{doc.title}</p>
                                            <p className="text-xs text-white/40">{new Date(doc.created_at).toLocaleDateString()} • {doc.doc_type}</p>
                                        </div>
                                    </div>
                                    <a href={doc.file_url} className="p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                        <Download size={18} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
