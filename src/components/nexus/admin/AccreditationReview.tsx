'use client'

import { useEffect, useState } from 'react'
import { Shield, CheckCircle, XCircle, AlertCircle, Clock, FileText, Download, User, DollarSign, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { ACCREDITATION_BADGES, VERIFICATION_BADGES } from '@/lib/investment-limits'
import { logAdminAction } from '@/lib/admin-auth'

interface AccreditationResponse {
    id: string
    investor_id: string
    investor_type: string
    annual_income?: number
    joint_income?: number
    net_worth?: number
    has_series_7?: boolean
    has_series_65?: boolean
    has_series_82?: boolean
    license_type?: string
    entity_assets?: number
    all_owners_accredited?: boolean
    is_501c3?: boolean
    trust_assets?: number
    trustor_accredited?: boolean
    responses: any
    determination: string
    determination_reasoning?: string
    verified_status: string
    verified_by?: string
    verified_at?: string
    created_at: string
    investor: any
}

interface VerificationDocument {
    id: string
    document_type: string
    file_url: string
    file_name: string
    file_size: number
    uploaded_at: string
}

export default function AccreditationReview() {
    const [accreditations, setAccreditations] = useState<AccreditationResponse[]>([])
    const [filteredAccreditations, setFilteredAccreditations] = useState<AccreditationResponse[]>([])
    const [selectedAccreditation, setSelectedAccreditation] = useState<AccreditationResponse | null>(null)
    const [documents, setDocuments] = useState<VerificationDocument[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        fetchAccreditations()
    }, [])

    useEffect(() => {
        filterAccreditations()
    }, [accreditations, statusFilter, searchTerm])

    async function fetchAccreditations() {
        try {
            const { data, error } = await supabase
                .from('accreditation_responses')
                .select(`
                    *,
                    investor:investor_profiles!accreditation_responses_investor_id_fkey (
                        id,
                        residence_state,
                        residence_country
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error

            setAccreditations(data || [])
        } catch (error) {
            console.error('Error fetching accreditations:', error)
        } finally {
            setLoading(false)
        }
    }

    async function fetchDocuments(accreditationId: string) {
        const { data } = await supabase
            .from('verification_documents')
            .select('*')
            .eq('accreditation_id', accreditationId)
            .order('uploaded_at', { ascending: false })

        setDocuments(data || [])
    }

    function filterAccreditations() {
        let filtered = accreditations

        if (statusFilter !== 'all') {
            filtered = filtered.filter(a => a.verified_status === statusFilter)
        }

        if (searchTerm) {
            filtered = filtered.filter(a =>
                a.investor_id.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        setFilteredAccreditations(filtered)
    }

    async function handleStatusUpdate(accreditationId: string, status: string, notes?: string) {
        setActionLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            // Update accreditation status
            const { error: updateError } = await supabase
                .from('accreditation_responses')
                .update({
                    verified_status: status,
                    verified_by: user.id,
                    verified_at: new Date().toISOString(),
                })
                .eq('id', accreditationId)

            if (updateError) throw updateError

            // If approved, update investor profile
            if (status === 'verified') {
                const accreditation = accreditations.find(a => a.id === accreditationId)
                if (accreditation) {
                    await supabase
                        .from('investor_profiles')
                        .update({
                            accreditation_status: accreditation.determination,
                            accreditation_verified_at: new Date().toISOString(),
                        })
                        .eq('id', accreditation.investor_id)
                }
            }

            // Log the action
            await logAdminAction('update_accreditation_status', 'accreditation', accreditationId, { status, notes })

            // Refresh data
            await fetchAccreditations()
            setSelectedAccreditation(null)
        } catch (error) {
            console.error('Error updating accreditation:', error)
            alert('Failed to update accreditation status')
        } finally {
            setActionLoading(false)
        }
    }

    const statusCounts = {
        all: accreditations.length,
        pending: accreditations.filter(a => a.verified_status === 'pending').length,
        verified: accreditations.filter(a => a.verified_status === 'verified').length,
        rejected: accreditations.filter(a => a.verified_status === 'rejected').length,
        needs_more_info: accreditations.filter(a => a.verified_status === 'needs_more_info').length,
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-white/60">Loading accreditations...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white font-rajdhani">Accreditation Review</h2>
                    <p className="text-white/60 text-sm mt-1">Review and approve investor accreditation requests</p>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Filter by Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                    >
                        <option value="all">All ({statusCounts.all})</option>
                        <option value="pending">Pending ({statusCounts.pending})</option>
                        <option value="verified">Verified ({statusCounts.verified})</option>
                        <option value="rejected">Rejected ({statusCounts.rejected})</option>
                        <option value="needs_more_info">Needs More Info ({statusCounts.needs_more_info})</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Search</label>
                    <input
                        type="text"
                        placeholder="Search by investor ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:border-[#F54029] focus:outline-none"
                    />
                </div>
            </div>

            {/* List View */}
            {!selectedAccreditation && (
                <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
                    {filteredAccreditations.length === 0 ? (
                        <div className="p-12 text-center">
                            <Shield className="mx-auto text-white/20 mb-4" size={48} />
                            <p className="text-white/60">No accreditations found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {filteredAccreditations.map(accreditation => {
                                const badge = ACCREDITATION_BADGES[accreditation.determination as keyof typeof ACCREDITATION_BADGES]
                                const verificationBadge = VERIFICATION_BADGES[accreditation.verified_status as keyof typeof VERIFICATION_BADGES]

                                return (
                                    <div
                                        key={accreditation.id}
                                        onClick={() => {
                                            setSelectedAccreditation(accreditation)
                                            fetchDocuments(accreditation.id)
                                        }}
                                        className="p-6 hover:bg-white/5 cursor-pointer transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <User className="text-white/40" size={20} />
                                                    <span className="text-white font-medium font-mono text-sm">{accreditation.investor_id.slice(0, 8)}...</span>
                                                    <span className="text-white/40 text-xs">{accreditation.investor_type}</span>
                                                </div>

                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${badge.color === 'green' ? 'bg-green-500/20 text-green-400' :
                                                            badge.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                                                                badge.color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                                                                    'bg-gray-500/20 text-gray-400'
                                                        }`}>
                                                        {badge.label}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${verificationBadge.color === 'green' ? 'bg-green-500/20 text-green-400' :
                                                            verificationBadge.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                verificationBadge.color === 'red' ? 'bg-red-500/20 text-red-400' :
                                                                    'bg-orange-500/20 text-orange-400'
                                                        }`}>
                                                        {verificationBadge.label}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                                                    {accreditation.annual_income && (
                                                        <div>
                                                            <span className="text-white/40">Income:</span>
                                                            <span className="text-white ml-2">${(accreditation.annual_income).toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    {accreditation.net_worth && (
                                                        <div>
                                                            <span className="text-white/40">Net Worth:</span>
                                                            <span className="text-white ml-2">${(accreditation.net_worth).toLocaleString()}</span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="text-white/40">Submitted:</span>
                                                        <span className="text-white ml-2">{new Date(accreditation.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <Eye className="text-[#F54029] flex-shrink-0" size={20} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Detail View */}
            {selectedAccreditation && (
                <div className="bg-black/40 border border-white/10 rounded-xl p-8">
                    <button
                        onClick={() => setSelectedAccreditation(null)}
                        className="text-[#F54029] hover:text-white mb-6 text-sm"
                    >
                        ← Back to List
                    </button>

                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-4 font-rajdhani">Accreditation Review</h3>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(ACCREDITATION_BADGES).map(([key, badge]) => {
                                    if (key === selectedAccreditation.determination) {
                                        return (
                                            <span key={key} className={`px-4 py-2 rounded-lg text-sm font-medium ${badge.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                    badge.color === 'blue' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                        badge.color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                                }`}>
                                                {badge.label}
                                            </span>
                                        )
                                    }
                                    return null
                                })}
                                {Object.entries(VERIFICATION_BADGES).map(([key, badge]) => {
                                    if (key === selectedAccreditation.verified_status) {
                                        const Icon = badge.icon === 'CheckCircle' ? CheckCircle : badge.icon === 'Clock' ? Clock : badge.icon === 'XCircle' ? XCircle : AlertCircle
                                        return (
                                            <span key={key} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${badge.color === 'green' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                    badge.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                                        badge.color === 'red' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                            'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                                }`}>
                                                <Icon size={16} />
                                                {badge.label}
                                            </span>
                                        )
                                    }
                                    return null
                                })}
                            </div>
                        </div>

                        {/* Investor Details */}
                        <div className="bg-white/5 rounded-lg p-6">
                            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                <User size={20} className="text-[#F54029]" />
                                Investor Information
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-white/40">Investor ID:</span>
                                    <p className="text-white font-mono mt-1">{selectedAccreditation.investor_id}</p>
                                </div>
                                <div>
                                    <span className="text-white/40">Type:</span>
                                    <p className="text-white capitalize mt-1">{selectedAccreditation.investor_type}</p>
                                </div>
                                <div>
                                    <span className="text-white/40">Submitted:</span>
                                    <p className="text-white mt-1">{new Date(selectedAccreditation.created_at).toLocaleString()}</p>
                                </div>
                                {selectedAccreditation.investor?.residence_state && (
                                    <div>
                                        <span className="text-white/40">Location:</span>
                                        <p className="text-white mt-1">{selectedAccreditation.investor.residence_state}, {selectedAccreditation.investor.residence_country}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Financial Details */}
                        {(selectedAccreditation.annual_income || selectedAccreditation.net_worth) && (
                            <div className="bg-white/5 rounded-lg p-6">
                                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <DollarSign size={20} className="text-[#F54029]" />
                                    Financial Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {selectedAccreditation.annual_income && (
                                        <div>
                                            <span className="text-white/40">Annual Income:</span>
                                            <p className="text-white text-lg font-bold mt-1">${selectedAccreditation.annual_income.toLocaleString()}</p>
                                        </div>
                                    )}
                                    {selectedAccreditation.joint_income && (
                                        <div>
                                            <span className="text-white/40">Joint Income:</span>
                                            <p className="text-white text-lg font-bold mt-1">${selectedAccreditation.joint_income.toLocaleString()}</p>
                                        </div>
                                    )}
                                    {selectedAccreditation.net_worth && (
                                        <div>
                                            <span className="text-white/40">Net Worth:</span>
                                            <p className="text-white text-lg font-bold mt-1">${selectedAccreditation.net_worth.toLocaleString()}</p>
                                        </div>
                                    )}
                                    {selectedAccreditation.entity_assets && (
                                        <div>
                                            <span className="text-white/40">Entity Assets:</span>
                                            <p className="text-white text-lg font-bold mt-1">${selectedAccreditation.entity_assets.toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Determination Reasoning */}
                        {selectedAccreditation.determination_reasoning && (
                            <div className="bg-white/5 rounded-lg p-6">
                                <h4 className="text-white font-bold mb-4">Determination Reasoning</h4>
                                <p className="text-white/80 text-sm leading-relaxed">{selectedAccreditation.determination_reasoning}</p>
                            </div>
                        )}

                        {/* Verification Documents */}
                        {documents.length > 0 && (
                            <div className="bg-white/5 rounded-lg p-6">
                                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-[#F54029]" />
                                    Verification Documents ({documents.length})
                                </h4>
                                <div className="space-y-3">
                                    {documents.map(doc => (
                                        <div key={doc.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="text-white/40" size={20} />
                                                <div>
                                                    <p className="text-white text-sm">{doc.file_name || doc.document_type}</p>
                                                    <p className="text-white/40 text-xs">{(doc.file_size / 1024).toFixed(2)} KB • {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <a
                                                href={doc.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 bg-[#F54029] hover:bg-[#F54029]/90 text-white rounded text-xs transition-colors"
                                            >
                                                <Download size={14} />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Admin Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleStatusUpdate(selectedAccreditation.id, 'verified')}
                                disabled={actionLoading || selectedAccreditation.verified_status === 'verified'}
                                className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={20} />
                                Approve
                            </button>
                            <button
                                onClick={() => {
                                    const notes = prompt('Rejection reason (optional):')
                                    handleStatusUpdate(selectedAccreditation.id, 'rejected', notes || undefined)
                                }}
                                disabled={actionLoading}
                                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <XCircle size={20} />
                                Reject
                            </button>
                            <button
                                onClick={() => {
                                    const notes = prompt('What additional information is needed?')
                                    if (notes) {
                                        handleStatusUpdate(selectedAccreditation.id, 'needs_more_info', notes)
                                    }
                                }}
                                disabled={actionLoading}
                                className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <AlertCircle size={20} />
                                Request Info
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
