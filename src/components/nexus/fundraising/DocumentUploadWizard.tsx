'use client'

import { useState } from 'react'
import { X, Upload, File, Shield, Check, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react'

interface DocumentUploadWizardProps {
    subsidiaryId: string
    currentFolderId?: string
    folders: { id: string, name: string }[]
    onClose: () => void
    onComplete: () => void
}

interface FileMetadata {
    name: string
    description: string
}

export default function DocumentUploadWizard({ subsidiaryId, currentFolderId, folders, onClose, onComplete }: DocumentUploadWizardProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [fileMetadata, setFileMetadata] = useState<Record<number, FileMetadata>>({})
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0, filename: '' })
    const [uploadedStatus, setUploadedStatus] = useState<Record<number, 'pending' | 'uploading' | 'completed' | 'failed'>>({})
    const [uploadErrors, setUploadErrors] = useState<string[]>([])

    const [formData, setFormData] = useState({
        folderId: currentFolderId || (folders.length > 0 ? folders[0].id : ''),
        accessLevel: 'all_investors', // all_investors, accredited_only, tier_1
    })

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files)
            setFiles(prev => {
                const updated = [...prev, ...selectedFiles]
                const updatedMeta = { ...fileMetadata }
                selectedFiles.forEach((f, idx) => {
                    const globalIdx = prev.length + idx
                    const lastDot = f.name.lastIndexOf('.')
                    const cleanName = lastDot > 0 ? f.name.substring(0, lastDot) : f.name
                    updatedMeta[globalIdx] = {
                        name: cleanName,
                        description: ''
                    }
                })
                setFileMetadata(updatedMeta)
                return updated
            })
        }
    }

    const handleSubmit = async () => {
        if (files.length === 0) return

        setLoading(true)
        setUploadErrors([])
        
        // Initialize all statuses to 'pending'
        const initialStatus: Record<number, 'pending' | 'uploading' | 'completed' | 'failed'> = {}
        files.forEach((_, idx) => {
            initialStatus[idx] = 'pending'
        })
        setUploadedStatus(initialStatus)

        let hasError = false
        const errorsList: string[] = []

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const meta = fileMetadata[i] || { name: file.name, description: '' }
                
                setUploadProgress({
                    current: i + 1,
                    total: files.length,
                    filename: meta.name
                })

                setUploadedStatus(prev => ({ ...prev, [i]: 'uploading' }))

                const formDataPayload = new FormData()
                formDataPayload.append('file', file)
                formDataPayload.append('name', meta.name.trim() || file.name)
                formDataPayload.append('description', meta.description)
                formDataPayload.append('folderId', formData.folderId)
                formDataPayload.append('subsidiaryId', subsidiaryId)
                formDataPayload.append('accessLevel', formData.accessLevel)

                const res = await fetch('/api/admin/data-room/upload', {
                    method: 'POST',
                    body: formDataPayload
                })

                if (!res.ok) {
                    hasError = true
                    let errorMessage = `Failed to upload "${meta.name}"`
                    try {
                        const data = await res.json()
                        errorMessage = data.error || errorMessage
                    } catch (e) {
                        if (res.status === 413) {
                            errorMessage = `"${meta.name}" is too large. The server upload limit is 4MB.`;
                        } else {
                            errorMessage = `Upload failed for "${meta.name}" with status ${res.status}: ${res.statusText || 'Unknown Error'}`;
                        }
                    }
                    setUploadedStatus(prev => ({ ...prev, [i]: 'failed' }))
                    errorsList.push(errorMessage)
                } else {
                    setUploadedStatus(prev => ({ ...prev, [i]: 'completed' }))
                }
            }

            if (hasError) {
                setUploadErrors(errorsList)
                setLoading(false)
            } else {
                // Smooth success animation satisfaction delay
                setTimeout(() => {
                    onComplete()
                }, 800)
            }
        } catch (error: any) {
            console.error('Error uploading document:', error)
            setUploadErrors(prev => [...prev, error.message || 'Failed to upload documents. Please try again.'])
            setLoading(false)
        }
    }

    const isUploadingScreen = loading || Object.keys(uploadedStatus).length > 0

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-rajdhani">Upload Documents</h2>
                        <p className="text-white/60 text-sm mt-1">Add files to your data room</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white disabled:opacity-35"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isUploadingScreen ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-6">
                            <div className="relative">
                                {/* Outer pulsing ring */}
                                {loading && (
                                    <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping opacity-75"></div>
                                )}
                                {/* Inner glowing gradient circle */}
                                <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center relative transition-all ${
                                    loading 
                                        ? 'border-blue-500/20 border-t-blue-500 animate-spin' 
                                        : uploadErrors.length > 0
                                        ? 'border-red-500/20 border-red-500 bg-red-500/10'
                                        : 'border-green-500/20 border-green-500 bg-green-500/10'
                                }`}>
                                    {!loading && uploadErrors.length > 0 ? (
                                        <AlertCircle className="text-red-400 animate-bounce" size={36} />
                                    ) : !loading ? (
                                        <Check className="text-green-400 animate-bounce" size={36} />
                                    ) : (
                                        <Upload className="text-blue-400 animate-pulse" size={32} />
                                    )}
                                </div>
                            </div>
                            
                            <div className="text-center space-y-1">
                                <h3 className="text-white text-xl font-bold font-rajdhani">
                                    {loading 
                                        ? `Uploading Documents (${uploadProgress.current}/${uploadProgress.total})` 
                                        : uploadErrors.length > 0
                                        ? 'Upload Completed with Errors'
                                        : 'All Documents Uploaded Successfully!'
                                    }
                                </h3>
                                {loading && (
                                    <p className="text-white/40 text-xs truncate max-w-[320px] mx-auto animate-pulse">
                                        Current: {uploadProgress.filename}
                                    </p>
                                )}
                                {!loading && uploadErrors.length === 0 && (
                                    <p className="text-green-400/80 text-xs font-semibold animate-pulse">
                                        Finishing up your workspace update...
                                    </p>
                                )}
                            </div>

                            {/* Progress Bar */}
                            {loading && (
                                <div className="w-full max-w-md bg-white/5 rounded-full h-2 overflow-hidden border border-white/5 relative">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300 rounded-full"
                                        style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                                    ></div>
                                </div>
                            )}

                            {/* Error Alert Box */}
                            {uploadErrors.length > 0 && (
                                <div className="w-full max-w-md bg-red-500/10 border border-red-500/20 rounded-xl p-4 space-y-2 text-left">
                                    <h4 className="text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                        <AlertCircle size={14} />
                                        Filing Errors
                                    </h4>
                                    <div className="space-y-1 text-xs text-white/70 max-h-[80px] overflow-y-auto pr-1">
                                        {uploadErrors.map((err, i) => (
                                            <p key={i} className="before:content-['•'] before:mr-2 before:text-red-400">
                                                {err}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* File Status List */}
                            <div className="w-full max-w-md space-y-2 max-h-[200px] overflow-y-auto pr-2 mt-2 border-t border-white/5 pt-4">
                                {files.map((file, idx) => {
                                    const meta = fileMetadata[idx] || { name: file.name, description: '' }
                                    const status = uploadedStatus[idx] || 'pending'
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`flex items-center justify-between px-4 py-2.5 rounded-lg border transition-all ${
                                                status === 'uploading' 
                                                    ? 'bg-blue-500/10 border-blue-500/30 font-semibold' 
                                                    : status === 'completed'
                                                    ? 'bg-green-500/10 border-green-500/20'
                                                    : status === 'failed'
                                                    ? 'bg-red-500/10 border-red-500/20'
                                                    : 'bg-white/5 border-white/5 opacity-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <File size={16} className={
                                                    status === 'uploading' ? 'text-blue-400 animate-pulse' :
                                                    status === 'completed' ? 'text-green-400' :
                                                    status === 'failed' ? 'text-red-400' : 'text-white/40'
                                                } />
                                                <span className="text-white text-xs truncate max-w-[240px]" title={meta.name}>
                                                    {meta.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {status === 'pending' && <span className="text-white/30 text-[10px] uppercase font-bold tracking-wider">Pending</span>}
                                                {status === 'uploading' && (
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-blue-400 text-[10px] uppercase font-bold tracking-wider animate-pulse">Uploading</span>
                                                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping"></div>
                                                    </div>
                                                )}
                                                {status === 'completed' && (
                                                    <div className="flex items-center gap-1 text-green-400 text-[10px] uppercase font-bold tracking-wider">
                                                        <span>Done</span>
                                                        <Check size={12} />
                                                    </div>
                                                )}
                                                {status === 'failed' && (
                                                    <div className="flex items-center gap-1 text-red-400 text-[10px] uppercase font-bold tracking-wider">
                                                        <span>Failed</span>
                                                        <AlertCircle size={12} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (
                        <>
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:bg-white/5 transition-colors relative">
                                        {files.length === 0 && (
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileSelect}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                        )}
                                        {files.length > 0 ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 bg-blue-500/20 rounded-full">
                                                    <Upload className="text-blue-400" size={32} />
                                                </div>
                                                <div className="w-full max-h-[220px] overflow-y-auto space-y-2 px-2 z-10 relative">
                                                    {files.map((file, idx) => (
                                                        <div 
                                                            key={idx} 
                                                            className="flex items-center justify-between bg-white/5 px-3 py-2 rounded-lg border border-white/5 text-left"
                                                        >
                                                            <div className="flex items-center gap-2 truncate pr-4">
                                                                <File size={16} className="text-blue-400 flex-shrink-0" />
                                                                <span className="text-white text-sm truncate" title={file.name}>
                                                                    {file.name}
                                                                </span>
                                                                <span className="text-white/40 text-xs flex-shrink-0">
                                                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault()
                                                                    e.stopPropagation()
                                                                    setFiles(prev => prev.filter((_, i) => i !== idx))
                                                                    const newMeta = { ...fileMetadata }
                                                                    delete newMeta[idx]
                                                                    const shiftedMeta: Record<number, FileMetadata> = {}
                                                                    files.filter((_, i) => i !== idx).forEach((_, newIdx) => {
                                                                        const oldIdx = newIdx >= idx ? newIdx + 1 : newIdx
                                                                        shiftedMeta[newIdx] = newMeta[oldIdx] || { name: files[oldIdx].name, description: '' }
                                                                    })
                                                                    setFileMetadata(shiftedMeta)
                                                                }}
                                                                className="text-red-400 hover:text-red-300 text-xs font-medium z-20 relative flex-shrink-0"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="text-xs text-white/40">
                                                    Total: {files.length} {files.length === 1 ? 'file' : 'files'} ({(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB)
                                                </div>
                                                <div className="relative z-10 flex gap-4 text-xs font-semibold">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            setFiles([])
                                                            setFileMetadata({})
                                                        }}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        Clear All
                                                    </button>
                                                    <span className="text-white/10">|</span>
                                                    <label className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                                                        Add More Files
                                                        <input
                                                            type="file"
                                                            multiple
                                                            onChange={handleFileSelect}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="p-4 bg-white/5 rounded-full">
                                                    <Upload className="text-white/40" size={32} />
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold text-lg">Click or Drag to Upload</p>
                                                    <p className="text-white/60">PDF, Excel, PPT, Images up to 50MB</p>
                                                    <p className="text-blue-400 text-xs mt-2 underline">Supports uploading multiple files at once</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    {/* Global Config */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white/5 border border-white/5 p-4 rounded-xl">
                                        <div>
                                            <label className="text-white/80 text-sm font-medium block mb-2">Target Folder</label>
                                            <select
                                                value={formData.folderId}
                                                onChange={e => setFormData({ ...formData, folderId: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                            >
                                                {folders.map(f => (
                                                    <option key={f.id} value={f.id}>{f.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-white/80 text-sm font-medium block mb-2">Access Level</label>
                                            <select
                                                value={formData.accessLevel}
                                                onChange={e => setFormData({ ...formData, accessLevel: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                            >
                                                <option value="all_investors">All Investors (Public to all)</option>
                                                <option value="accredited_only">Accredited Only (Verified status only)</option>
                                                <option value="tier_1">Tier 1 Lead Investors Only</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Files Metadata List */}
                                    <div>
                                        <h3 className="text-white font-bold text-lg font-rajdhani mb-3">Document Configurations</h3>
                                        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                                            {files.map((file, idx) => {
                                                const meta = fileMetadata[idx] || { name: file.name, description: '' }
                                                return (
                                                    <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <File size={20} className="text-blue-400" />
                                                                <div>
                                                                    <p className="text-white text-xs font-mono truncate max-w-[250px]" title={file.name}>
                                                                        {file.name}
                                                                    </p>
                                                                    <p className="text-white/40 text-[10px]">
                                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setFiles(prev => prev.filter((_, i) => i !== idx))
                                                                    const newMeta = { ...fileMetadata }
                                                                    delete newMeta[idx]
                                                                    const shiftedMeta: Record<number, FileMetadata> = {}
                                                                    files.filter((_, i) => i !== idx).forEach((_, newIdx) => {
                                                                        const oldIdx = newIdx >= idx ? newIdx + 1 : newIdx
                                                                        shiftedMeta[newIdx] = newMeta[oldIdx] || { name: files[oldIdx].name, description: '' }
                                                                    })
                                                                    setFileMetadata(shiftedMeta)
                                                                }}
                                                                className="text-red-400/80 hover:text-red-400 text-xs transition-colors"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-white/60 text-xs font-medium block mb-1">Display Name</label>
                                                                <input
                                                                    type="text"
                                                                    value={meta.name}
                                                                    onChange={e => {
                                                                        setFileMetadata({
                                                                            ...fileMetadata,
                                                                            [idx]: { ...meta, name: e.target.value }
                                                                        })
                                                                    }}
                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="text-white/60 text-xs font-medium block mb-1">Description (Optional)</label>
                                                                <input
                                                                    type="text"
                                                                    value={meta.description}
                                                                    onChange={e => {
                                                                        setFileMetadata({
                                                                            ...fileMetadata,
                                                                            [idx]: { ...meta, description: e.target.value }
                                                                        })
                                                                    }}
                                                                    placeholder="Add context..."
                                                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white outline-none focus:border-blue-500 transition-colors"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 p-6 border-t border-white/10">
                    {isUploadingScreen ? (
                        <>
                            {!loading && uploadErrors.length > 0 ? (
                                <div className="flex gap-3 justify-end w-full">
                                    <button
                                        onClick={() => {
                                            setUploadedStatus({})
                                            setUploadErrors([])
                                            setStep(2)
                                        }}
                                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-all"
                                    >
                                        Back to Config
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <div className="text-xs text-white/40 text-center w-full animate-pulse">
                                    Please wait while files are being uploaded to the data room...
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="flex gap-2">
                                {[1, 2].map(s => (
                                    <div
                                        key={s}
                                        className={`w-2 h-2 rounded-full transition-colors ${s === step ? 'bg-blue-500' : 'bg-white/10'}`}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-3">
                                {step > 1 && (
                                    <button
                                        onClick={() => setStep(step - 1)}
                                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-lg transition-all"
                                    >
                                        Back
                                    </button>
                                )}

                                {step < 2 ? (
                                    <button
                                        onClick={() => setStep(step + 1)}
                                        disabled={files.length === 0}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-all flex items-center gap-2"
                                    >
                                        Next
                                        <ArrowRight size={18} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || files.length === 0}
                                        className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-all flex items-center gap-2"
                                    >
                                        Upload Files
                                        <Check size={18} />
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
