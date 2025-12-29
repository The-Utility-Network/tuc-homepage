'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Loader2, Calendar, DollarSign, X } from 'lucide-react'

export default function CampaignForm({ campaign, onSuccess, onCancel }: { campaign?: any, onSuccess: () => void, onCancel: () => void }) {
    const supabase = createClient()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: campaign?.name || '',
        target_amount: campaign?.target_amount || '',
        min_investment: campaign?.min_investment || '',
        status: campaign?.status || 'draft',
        description: campaign?.description || '',
        terms_url: campaign?.terms_url || '',
        start_date: campaign?.start_date || '',
        end_date: campaign?.end_date || ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const payload = {
            ...formData,
            target_amount: parseFloat(formData.target_amount) || 0,
            min_investment: parseFloat(formData.min_investment) || 0
        }

        try {
            if (campaign?.id) {
                const { error } = await supabase
                    .from('campaigns')
                    .update(payload)
                    .eq('id', campaign.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('campaigns')
                    .insert([payload])
                if (error) throw error
            }
            router.refresh()
            onSuccess()
        } catch (error) {
            console.error('Error saving campaign:', error)
            alert('Failed to save campaign')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-rajdhani font-bold text-white">
                    {campaign ? 'Edit Campaign' : 'New Campaign'}
                </h3>
                <button type="button" onClick={onCancel} className="text-white/40 hover:text-white">
                    <X size={20} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-mono tracking-wider text-white/40 mb-2">CAMPAIGN NAME</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none transition-colors"
                        required
                    />
                </div>
                <div>
                    <label className="block text-xs font-mono tracking-wider text-white/40 mb-2">STATUS</label>
                    <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none transition-colors"
                    >
                        <option value="draft">Draft</option>
                        <option value="active">Active (Open for Investment)</option>
                        <option value="closed">Closed / Funded</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-mono tracking-wider text-white/40 mb-2">TARGET AMOUNT ($)</label>
                    <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="number"
                            value={formData.target_amount}
                            onChange={e => setFormData({ ...formData, target_amount: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#F54029] outline-none transition-colors"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-mono tracking-wider text-white/40 mb-2">MIN INVESTMENT ($)</label>
                    <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="number"
                            value={formData.min_investment}
                            onChange={e => setFormData({ ...formData, min_investment: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#F54029] outline-none transition-colors"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-mono tracking-wider text-white/40 mb-2">START DATE</label>
                    <input
                        type="date"
                        value={formData.start_date}
                        onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none transition-colors"
                    />
                </div>

                <div>
                    <label className="block text-xs font-mono tracking-wider text-white/40 mb-2">END DATE</label>
                    <input
                        type="date"
                        value={formData.end_date}
                        onChange={e => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-mono tracking-wider text-white/40 mb-2">TERMS URL / DOC LINK</label>
                    <input
                        type="text"
                        value={formData.terms_url}
                        onChange={e => setFormData({ ...formData, terms_url: e.target.value })}
                        placeholder="https://... (Link to K-1 or Memo)"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none transition-colors"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-mono tracking-wider text-white/40 mb-2">DESCRIPTION / LORE</label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none transition-colors h-32"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-[#F54029] hover:bg-[#C53020] text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" size={16} />}
                    {campaign ? 'Update Campaign' : 'Create Campaign'}
                </button>
            </div>
        </form>
    )
}
