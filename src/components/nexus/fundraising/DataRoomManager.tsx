import { useEffect, useState } from 'react'
import { Folder, File, Upload, Eye, Download, Lock, Shield, TrendingUp, Users, Clock, Plus, X, Check, Trash } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import DocumentUploadWizard from './DocumentUploadWizard'

interface DataRoomFolder {
    id: string
    name: string
    description: string
    icon: string
    accessLevel: string
    requiresNda: boolean
    fileCount: number
}

interface DataRoomFile {
    id: string
    name: string
    description: string
    fileSize: number
    fileType: string
    accessLevel: string
    viewCount: number
    downloadCount: number
    lastAccessedAt: string
    uploadedAt: string
}

export default function DataRoomManager({ subsidiaryId, isAdmin = true }: { subsidiaryId: string; isAdmin?: boolean }) {
    const [folders, setFolders] = useState<DataRoomFolder[]>([])
    const [selectedFolder, setSelectedFolder] = useState<DataRoomFolder | null>(null)
    const [files, setFiles] = useState<DataRoomFile[]>([])
    const [analytics, setAnalytics] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [uploadWizardOpen, setUploadWizardOpen] = useState(false)
    const [createFolderOpen, setCreateFolderOpen] = useState(false)
    const [newFolderData, setNewFolderData] = useState({ name: '', description: '', requiresNda: false })
    const supabase = createClient()

    useEffect(() => {
        fetchFolders()
        fetchAnalytics()
    }, [subsidiaryId])

    useEffect(() => {
        if (selectedFolder) {
            fetchFiles(selectedFolder.id)
        }
    }, [selectedFolder])

    async function fetchFolders() {
        try {
            const res = await fetch(`/api/data-room/folders?subsidiaryId=${subsidiaryId}`)
            const data = await res.json()

            if (res.ok && data.folders) {
                setFolders(data.folders)

                if (!selectedFolder && data.folders.length > 0) {
                    setSelectedFolder(data.folders[0])
                } else if (selectedFolder) {
                    const updated = data.folders.find((f: any) => f.id === selectedFolder.id)
                    if (updated) setSelectedFolder(updated)
                }
            } else {
                console.error('Failed to fetch folders:', data.error)
            }
        } catch (error) {
            console.error('Network error fetching folders:', error)
        } finally {
            setLoading(false)
        }
    }

    async function fetchFiles(folderId: string) {
        try {
            const res = await fetch(`/api/data-room/files?folderId=${folderId}`)
            const data = await res.json()

            if (res.ok && data.files) {
                setFiles(data.files)
            } else {
                console.error('Failed to fetch files:', data.error)
            }
        } catch (error) {
            console.error('Network error fetching files:', error)
        }
    }

    async function fetchAnalytics() {
        // Get total views and downloads across all files
        const { data: allFiles } = await supabase
            .from('data_room_files')
            .select('view_count, download_count, last_accessed_at')
            .eq('subsidiary_id', subsidiaryId)

        if (allFiles) {
            const totalViews = allFiles.reduce((sum, f) => sum + (f.view_count || 0), 0)
            const totalDownloads = allFiles.reduce((sum, f) => sum + (f.download_count || 0), 0)

            // Get unique viewers from access log
            const { data: accessLog } = await supabase
                .from('data_room_access_log')
                .select('user_id')
            // Ideally filter where file_id is in allFiles

            // Simplified unique viewer count (just based on logs if we had that query right)
            // For now, assume 0 or placeholder if complex query needed
            const uniqueViewers = 0 // Placeholder until we fix the query complexity

            setAnalytics({
                totalViews,
                totalDownloads,
                uniqueViewers,
                totalFiles: allFiles.length,
            })
        }
    }

    async function handleCreateFolder() {
        if (!newFolderData.name) return

        try {
            const res = await fetch('/api/admin/data-room/folders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subsidiaryId: subsidiaryId,
                    name: newFolderData.name,
                    description: newFolderData.description,
                    requiresNda: newFolderData.requiresNda,
                    accessLevel: 'all_investors'
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create folder')
            }

            setCreateFolderOpen(false)
            setNewFolderData({ name: '', description: '', requiresNda: false })
            fetchFolders()
        } catch (error: any) {
            console.error('Error creating folder:', error)
            alert(error.message || 'Failed to create folder. Please try again.')
        }
    }

    async function handleDeleteFile(fileId: string) {
        if (!confirm('Are you sure you want to delete this file? This action cannot be undone.')) return

        setLoading(true)
        try {
            const res = await fetch('/api/admin/data-room/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileId })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to delete file')
            }

            // Refresh everything after deletion
            if (selectedFolder) fetchFiles(selectedFolder.id)
            fetchFolders() // Updates file counts
            fetchAnalytics() // Updates global counts
        } catch (error: any) {
            console.error('Error deleting file:', error)
            alert(error.message || 'Failed to delete file.')
            setLoading(false)
        }
    }

    function formatFileSize(bytes: number): string {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    function getFileIcon(fileType: string) {
        if (fileType.includes('pdf')) return '📄'
        if (fileType.includes('image')) return '🖼️'
        if (fileType.includes('video')) return '🎥'
        if (fileType.includes('spreadsheet') || fileType.includes('excel')) return '📊'
        if (fileType.includes('presentation') || fileType.includes('powerpoint')) return '📈'
        return '📎'
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F54029]"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 relative">
            {uploadWizardOpen && (
                <DocumentUploadWizard
                    subsidiaryId={subsidiaryId}
                    currentFolderId={selectedFolder?.id}
                    folders={folders.map(f => ({ id: f.id, name: f.name }))}
                    onClose={() => setUploadWizardOpen(false)}
                    onComplete={() => {
                        setUploadWizardOpen(false)
                        fetchFiles(selectedFolder?.id || '')
                        fetchFolders()
                        fetchAnalytics()
                    }}
                />
            )}

            {createFolderOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white font-rajdhani">Create New Folder</h3>
                            <button onClick={() => setCreateFolderOpen(false)} className="text-white/60 hover:text-white"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-white/80 text-sm font-medium block mb-2">Folder Name</label>
                                <input
                                    value={newFolderData.name}
                                    onChange={e => setNewFolderData({ ...newFolderData, name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                    placeholder="e.g. Legal Documents"
                                />
                            </div>
                            <div>
                                <label className="text-white/80 text-sm font-medium block mb-2">Description</label>
                                <textarea
                                    value={newFolderData.description}
                                    onChange={e => setNewFolderData({ ...newFolderData, description: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors resize-none"
                                    rows={3}
                                />
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                <input
                                    type="checkbox"
                                    checked={newFolderData.requiresNda}
                                    onChange={e => setNewFolderData({ ...newFolderData, requiresNda: e.target.checked })}
                                    className="w-5 h-5 rounded border-white/20 bg-black/40 text-blue-500"
                                />
                                <div>
                                    <p className="text-white font-medium text-sm">Require NDA?</p>
                                    <p className="text-white/40 text-xs">Investors must accept NDA terms to open</p>
                                </div>
                            </div>

                            <button
                                onClick={handleCreateFolder}
                                disabled={!newFolderData.name}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                Create Folder
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Overview */}
            {analytics && (
                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-500/20 to-black/40 border border-blue-500/30 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Eye className="text-blue-400" size={24} />
                            <p className="text-white/60 text-sm uppercase tracking-wider">Total Views</p>
                        </div>
                        <p className="text-white text-4xl font-bold font-rajdhani">{analytics.totalViews.toLocaleString()}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-black/40 border border-green-500/30 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Download className="text-green-400" size={24} />
                            <p className="text-white/60 text-sm uppercase tracking-wider">Downloads</p>
                        </div>
                        <p className="text-white text-4xl font-bold font-rajdhani">{analytics.totalDownloads.toLocaleString()}</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500/20 to-black/40 border border-purple-500/30 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <Users className="text-purple-400" size={24} />
                            <p className="text-white/60 text-sm uppercase tracking-wider">Unique Viewers</p>
                        </div>
                        <p className="text-white text-4xl font-bold font-rajdhani">{analytics.uniqueViewers}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500/20 to-black/40 border border-orange-500/30 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <File className="text-orange-400" size={24} />
                            <p className="text-white/60 text-sm uppercase tracking-wider">Total Files</p>
                        </div>
                        <p className="text-white text-4xl font-bold font-rajdhani">{analytics.totalFiles}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-12 gap-8">
                {/* Folder Sidebar */}
                <div className="col-span-3 bg-black/40 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-white font-bold font-rajdhani text-xl">Folders</h3>
                        {isAdmin && (
                            <button
                                onClick={() => setCreateFolderOpen(true)}
                                className="p-2 bg-[#F54029]/20 hover:bg-[#F54029]/30 rounded-lg transition-colors"
                            >
                                <Plus className="text-[#F54029]" size={20} />
                            </button>
                        )}
                    </div>

                    <div className="space-y-2">
                        {folders.map(folder => (
                            <button
                                key={folder.id}
                                onClick={() => setSelectedFolder(folder)}
                                className={`w-full text-left p-4 rounded-lg transition-all ${selectedFolder?.id === folder.id
                                    ? 'bg-[#F54029]/20 border border-[#F54029]/30'
                                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <Folder className={selectedFolder?.id === folder.id ? 'text-[#F54029]' : 'text-white/60'} size={20} />
                                    <span className="text-white font-medium">{folder.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-white/60">{folder.fileCount} files</span>
                                    {folder.requiresNda && <Lock className="text-yellow-400" size={14} />}
                                </div>
                            </button>
                        ))}
                        {folders.length === 0 && (
                            <div className="text-center py-6">
                                <p className="text-white/40 text-sm">No folders yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* File List */}
                <div className="col-span-9 bg-black/40 border border-white/10 rounded-2xl p-8">
                    {selectedFolder ? (
                        <>
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white font-rajdhani flex items-center gap-3">
                                        <Folder className="text-[#F54029]" size={32} />
                                        {selectedFolder.name}
                                    </h2>
                                    <p className="text-white/60 mt-2">{selectedFolder.description}</p>
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={() => setUploadWizardOpen(true)}
                                        className="px-6 py-3 bg-[#F54029] hover:bg-[#F54029]/90 text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <Upload size={20} />
                                        Upload File
                                    </button>
                                )}
                            </div>

                            {selectedFolder.requiresNda && (
                                <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
                                    <Shield className="text-yellow-400 flex-shrink-0 mt-1" size={20} />
                                    <div>
                                        <p className="text-yellow-400 font-bold text-sm">NDA Required</p>
                                        <p className="text-white/60 text-sm mt-1">
                                            Investors must sign an NDA before accessing files in this folder
                                        </p>
                                    </div>
                                </div>
                            )}

                            {files.length === 0 ? (
                                <div className="text-center py-16">
                                    <File className="mx-auto mb-4 text-white/40" size={64} />
                                    <p className="text-white/60 text-lg">No files in this folder yet</p>
                                    <p className="text-white/40 text-sm mt-2">Upload documents to share with investors</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {files.map(file => (
                                        <div
                                            key={file.id}
                                            className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all group cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                    <span className="text-3xl">{getFileIcon(file.fileType)}</span>
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-bold mb-1 group-hover:text-[#F54029] transition-colors">
                                                            {file.name}
                                                        </h4>
                                                        {file.description && (
                                                            <p className="text-white/60 text-sm mb-3">{file.description}</p>
                                                        )}
                                                        <div className="flex items-center gap-6 text-xs text-white/40">
                                                            <span>{formatFileSize(file.fileSize)}</span>
                                                            <span className="flex items-center gap-1">
                                                                <Eye size={12} />
                                                                {file.viewCount} views
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Download size={12} />
                                                                {file.downloadCount} downloads
                                                            </span>
                                                            {file.lastAccessedAt && (
                                                                <span className="flex items-center gap-1">
                                                                    <Clock size={12} />
                                                                    Last viewed {new Date(file.lastAccessedAt).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <a 
                                                        href={`/api/data-room/download?id=${file.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded text-blue-400 transition-colors inline-block"
                                                        title="View / Download"
                                                    >
                                                        <Download size={18} />
                                                    </a>
                                                    {isAdmin && (
                                                        <button 
                                                            onClick={() => handleDeleteFile(file.id)}
                                                            className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400 transition-colors"
                                                            title="Delete File"
                                                        >
                                                            <Trash size={18} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-24">
                            <Folder className="mx-auto mb-4 text-white/40" size={64} />
                            <h3 className="text-2xl font-bold text-white mb-2 font-rajdhani">Data Room</h3>
                            <p className="text-white/60">Select a folder to view documents</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Access Level Legend */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Shield className="text-[#F54029]" size={20} />
                    Access Levels
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-green-400 font-bold text-sm mb-1">All Investors</p>
                        <p className="text-white/60 text-xs">Available to all committed investors</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-yellow-400 font-bold text-sm mb-1">Accredited Only</p>
                        <p className="text-white/60 text-xs">Requires verified accreditation status</p>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-red-400 font-bold text-sm mb-1">Tier 1</p>
                        <p className="text-white/60 text-xs">Lead investors and strategic partners only</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
