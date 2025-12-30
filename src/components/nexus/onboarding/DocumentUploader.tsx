'use client'

import { useState, useCallback } from 'react'
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface DocumentFile {
    id: string
    name: string
    size: number
    type: string
    status: 'uploading' | 'success' | 'error'
    url?: string
}

interface DocumentUploaderProps {
    uploadedDocuments: DocumentFile[]
    onDocumentsChange: (documents: DocumentFile[]) => void
    acceptedTypes?: string[]
    maxSizeMB?: number
}

export default function DocumentUploader({
    uploadedDocuments,
    onDocumentsChange,
    acceptedTypes = ['.pdf', '.png', '.jpg', '.jpeg'],
    maxSizeMB = 10
}: DocumentUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const supabase = createClient()

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const uploadFile = async (file: File): Promise<DocumentFile> => {
        const fileId = crypto.randomUUID()
        const fileName = `${fileId}_${file.name}`

        try {
            // Upload to Supabase Storage
            const { data, error } = await supabase.storage
                .from('verification-documents')
                .upload(fileName, file)

            if (error) throw error

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('verification-documents')
                .getPublicUrl(fileName)

            return {
                id: fileId,
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'success',
                url: publicUrl,
            }
        } catch (error) {
            console.error('Upload error:', error)
            return {
                id: fileId,
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'error',
            }
        }
    }

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        await processFiles(files)
    }, [uploadedDocuments])

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : []
        await processFiles(files)
    }

    const processFiles = async (files: File[]) => {
        const maxSize = maxSizeMB * 1024 * 1024

        // Filter and validate files
        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                alert(`${file.name} exceeds maximum size of ${maxSizeMB}MB`)
                return false
            }

            const extension = '.' + file.name.split('.').pop()?.toLowerCase()
            if (!acceptedTypes.includes(extension)) {
                alert(`${file.name} is not an accepted file type. Accepted: ${acceptedTypes.join(', ')}`)
                return false
            }

            return true
        })

        // Add to uploading state
        const uploadingDocs: DocumentFile[] = validFiles.map(file => ({
            id: crypto.randomUUID(),
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'uploading',
        }))

        onDocumentsChange([...uploadedDocuments, ...uploadingDocs])

        // Upload files
        const uploadPromises = validFiles.map(uploadFile)
        const results = await Promise.all(uploadPromises)

        // Update with results
        const updatedDocs = uploadedDocuments.filter(
            doc => !uploadingDocs.find(ud => ud.id === doc.id)
        )
        onDocumentsChange([...updatedDocs, ...results])
    }

    const removeDocument = (id: string) => {
        onDocumentsChange(uploadedDocuments.filter(doc => doc.id !== id))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 transition-all ${isDragging
                        ? 'border-[#F54029] bg-[#F54029]/10'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
            >
                <div className="flex flex-col items-center justify-center text-center">
                    <Upload
                        className={`mb-4 ${isDragging ? 'text-[#F54029]' : 'text-white/40'}`}
                        size={48}
                    />
                    <p className="text-white/80 font-medium mb-2">
                        Drag & drop files here, or click to browse
                    </p>
                    <p className="text-sm text-white/40 mb-4">
                        Accepted: {acceptedTypes.join(', ')} • Max size: {maxSizeMB}MB
                    </p>
                    <label className="px-6 py-3 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded-lg cursor-pointer transition-all inline-block">
                        <input
                            type="file"
                            multiple
                            accept={acceptedTypes.join(',')}
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        Choose Files
                    </label>
                </div>
            </div>

            {/* File List */}
            {uploadedDocuments.length > 0 && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white/80">
                        Uploaded Documents ({uploadedDocuments.length})
                    </h4>
                    {uploadedDocuments.map(doc => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <FileText className="text-white/40 flex-shrink-0" size={24} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-white/90 truncate">{doc.name}</p>
                                    <p className="text-xs text-white/40">{formatFileSize(doc.size)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 flex-shrink-0">
                                {doc.status === 'uploading' && (
                                    <div className="text-blue-400 text-xs">Uploading...</div>
                                )}
                                {doc.status === 'success' && (
                                    <CheckCircle className="text-green-400" size={20} />
                                )}
                                {doc.status === 'error' && (
                                    <AlertCircle className="text-red-400" size={20} />
                                )}
                                <button
                                    onClick={() => removeDocument(doc.id)}
                                    className="p-1 hover:bg-white/10 rounded transition-colors"
                                >
                                    <X className="text-white/40 hover:text-white" size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Accepted Document Types */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white/80 mb-2">Accepted Document Types:</h4>
                <ul className="text-xs text-white/60 space-y-1">
                    <li>• Tax Returns (Form 1040) - PDF</li>
                    <li>• Bank/Brokerage Statements - PDF</li>
                    <li>• CPA Letter of Net Worth - PDF</li>
                    <li>• Professional Licenses (Series 7, 65, 82) - PDF or Image</li>
                    <li>• Entity Formation Documents - PDF</li>
                </ul>
            </div>
        </div>
    )
}
