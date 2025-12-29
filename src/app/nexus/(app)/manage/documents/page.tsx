'use client';

import { createClient } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { FileText, Upload, Trash2, Eye, Download, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function DocumentManagerPage() {
    const supabase = createClient();
    const [docs, setDocs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);

    // Upload state
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [docTitle, setDocTitle] = useState('');
    const [docType, setDocType] = useState('report'); // report, contract, tax

    const fetchDocs = async () => {
        const { data } = await supabase
            .from('documents')
            .select('*, profiles(full_name)')
            .order('created_at', { ascending: false });
        setDocs(data || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !docTitle) return;
        setUploading(true);

        try {
            // 1. Upload file to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const filePath = `${docType}s/${Date.now()}.${fileExt}`;

            // Note: This assumes 'nexus-docs' bucket exists and RLS allows upload
            // We might need to handle this in SQL migration if not present
            const { error: uploadError } = await supabase.storage
                .from('nexus-docs')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public or Signed URL
            const { data: { publicUrl } } = supabase.storage
                .from('nexus-docs')
                .getPublicUrl(filePath);

            // 3. Create Record
            const { error: dbError } = await supabase
                .from('documents')
                .insert([{
                    title: docTitle,
                    doc_type: docType,
                    file_url: publicUrl,
                    // If we want to assign to specific user, we'd add user_id here. 
                    // For now, let's treat these as "General Documents" unless expanded.
                    user_id: null
                }]);

            if (dbError) throw dbError;

            setShowUpload(false);
            setFile(null);
            setDocTitle('');
            fetchDocs();
        } catch (error: any) {
            console.error('Upload failed:', error);
            alert(`Upload failed: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-rajdhani font-bold text-white uppercase tracking-wider flex items-center gap-3">
                        <FileText className="text-[#F54029]" size={32} />
                        Document Center
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        Repository for investor reports, legal agreements, and tax documents.
                    </p>
                </div>
                {!showUpload && (
                    <button
                        onClick={() => setShowUpload(true)}
                        className="px-6 py-2.5 bg-[#F54029] hover:bg-[#C53020] text-white font-semibold rounded-lg transition-all flex items-center gap-2 text-sm uppercase tracking-wider"
                    >
                        <Upload size={18} />
                        Upload Document
                    </button>
                )}
            </header>

            {showUpload && (
                <div className="bg-black/40 border border-white/10 p-6 rounded-2xl animate-fadeInUp">
                    <h3 className="text-lg font-bold font-rajdhani text-white mb-4">Upload New Document</h3>
                    <form onSubmit={handleUpload} className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-xs font-mono tracking-wider text-white/40 mb-2">DOCUMENT TITLE</label>
                            <input
                                type="text"
                                value={docTitle}
                                onChange={e => setDocTitle(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono tracking-wider text-white/40 mb-2">TYPE</label>
                            <select
                                value={docType}
                                onChange={e => setDocType(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none"
                            >
                                <option value="report">Investor Report</option>
                                <option value="contract">Legal Contract</option>
                                <option value="tax">Tax Document (K-1)</option>
                                <option value="pitch">Pitch Deck / Memo</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-mono tracking-wider text-white/40 mb-2">FILE</label>
                            <div className="border border-dashed border-white/20 rounded-lg p-8 text-center hover:bg-white/5 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    onChange={e => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    required
                                />
                                <Upload className="mx-auto text-white/40 mb-2" size={24} />
                                <p className="text-sm text-white/60">{file ? file.name : 'Drag & drop or click to select'}</p>
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowUpload(false)}
                                className="px-6 py-2 text-sm text-white/60 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="px-6 py-2 bg-[#F54029] hover:bg-[#C53020] text-white text-sm font-semibold rounded-lg flex items-center gap-2"
                            >
                                {uploading ? 'Uploading...' : 'Publish Document'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="text-white/40 text-center py-12">Loading documents...</div>
                ) : docs.length === 0 ? (
                    <div className="p-12 border border-dashed border-white/10 rounded-2xl text-center bg-white/[0.02]">
                        <p className="text-white/40">No documents uploaded.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {docs.map((doc) => (
                            <div key={doc.id} className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between group hover:border-[#F54029]/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${doc.doc_type === 'tax' ? 'bg-orange-500/10 text-orange-400' :
                                            doc.doc_type === 'contract' ? 'bg-blue-500/10 text-blue-400' :
                                                'bg-white/5 text-white/60'
                                        }`}>
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold font-rajdhani text-white">{doc.title}</h3>
                                        <div className="flex items-center gap-3 text-xs text-white/40 mt-1">
                                            <span className="uppercase tracking-wider">{doc.doc_type}</span>
                                            <span>• {formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}</span>
                                            {doc.user_id && <span className="text-[#F54029]">• Private (Assigned)</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={doc.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                                        title="View"
                                    >
                                        <Eye size={18} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
