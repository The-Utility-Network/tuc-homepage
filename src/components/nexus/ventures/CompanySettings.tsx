'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Save, Building2, MapPin, Hash, Calendar, ShieldAlert, Loader2 } from 'lucide-react'

export default function CompanySettings({ subsidiaryId }: { subsidiaryId: string }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [config, setConfig] = useState({
        name: '',
        ein: '',
        entity_type: 'C-Corp',
        incorporation_state: 'Delaware',
        incorporation_date: '',
        legal_address: '',
        total_authorized_shares: 10000000
    })

    useEffect(() => {
        const fetchConfig = async () => {
            setLoading(true)
            const { data } = await supabase
                .from('subsidiaries')
                .select('*')
                .eq('id', subsidiaryId)
                .single()
            
            if (data) {
                setConfig({
                    name: data.name || '',
                    ein: data.ein || '',
                    entity_type: data.entity_type || 'C-Corp',
                    incorporation_state: data.incorporation_state || 'Delaware',
                    incorporation_date: data.incorporation_date ? new Date(data.incorporation_date).toISOString().split('T')[0] : '',
                    legal_address: data.legal_address || '',
                    total_authorized_shares: data.total_authorized_shares || 10000000
                })
            }
            setLoading(false)
        }
        fetchConfig()
    }, [subsidiaryId])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        
        const { error } = await supabase
            .from('subsidiaries')
            .update({
                ein: config.ein,
                entity_type: config.entity_type,
                incorporation_state: config.incorporation_state,
                incorporation_date: config.incorporation_date || null,
                legal_address: config.legal_address,
                total_authorized_shares: config.total_authorized_shares
            })
            .eq('id', subsidiaryId)

        if (error) {
            alert('Failed to save configuration: ' + error.message)
        } else {
            alert('Configuration saved successfully.')
        }
        setSaving(false)
    }

    if (loading) {
        return <div className="h-48 flex items-center justify-center"><Loader2 className="animate-spin text-white/40" /></div>
    }

    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
            <div className="p-6 border-b border-white/10 bg-white/[0.02]">
                <h3 className="text-xl font-bold font-rajdhani text-white uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="text-[#F54029]" size={20} /> Corporate Configuration
                </h3>
                <p className="text-xs text-white/40 mt-1">Manage legal identifiers and entity structural metadata used for automated document generation.</p>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Left Column: Core Identifiers */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest block mb-2">Legal Entity Type</label>
                            <div className="flex bg-black/40 border border-white/10 rounded-lg overflow-hidden">
                                {['C-Corp', 'LLC', 'S-Corp'].map(type => (
                                    <button
                                        type="button"
                                        key={type}
                                        onClick={() => setConfig({...config, entity_type: type})}
                                        className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                                            config.entity_type === type 
                                            ? 'bg-white/10 text-white shadow-inner' 
                                            : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-white/30 mt-2">Determines whether SAFEs issue "Stock" or "Units".</p>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest block mb-2 flex items-center gap-2">
                                <Hash size={14} /> Employer Identification Number (EIN)
                            </label>
                            <input 
                                type="text"
                                placeholder="XX-XXXXXXX"
                                value={config.ein}
                                onChange={e => setConfig({...config, ein: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none font-mono"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest block mb-2 flex items-center gap-2">
                                <ShieldAlert size={14} /> Authorized Shares / Units
                            </label>
                            <input 
                                type="number"
                                value={config.total_authorized_shares}
                                onChange={e => setConfig({...config, total_authorized_shares: Number(e.target.value)})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none font-mono"
                            />
                            <p className="text-[10px] text-white/30 mt-2">Maximum cap table limit.</p>
                        </div>
                    </div>

                    {/* Right Column: Jurisdiction */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest block mb-2 flex items-center gap-2">
                                <MapPin size={14} /> State of Incorporation
                            </label>
                            <input 
                                type="text"
                                placeholder="e.g. Delaware"
                                value={config.incorporation_state}
                                onChange={e => setConfig({...config, incorporation_state: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest block mb-2 flex items-center gap-2">
                                <Calendar size={14} /> Date of Incorporation
                            </label>
                            <input 
                                type="date"
                                value={config.incorporation_date}
                                onChange={e => setConfig({...config, incorporation_date: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-white/60 uppercase tracking-widest block mb-2 flex items-center gap-2">
                                <Building2 size={14} /> Legal Business Address
                            </label>
                            <textarea 
                                rows={3}
                                placeholder="HQ Address"
                                value={config.legal_address}
                                onChange={e => setConfig({...config, legal_address: e.target.value})}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#F54029] outline-none resize-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-white/10">
                    <button 
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-[#F54029] hover:bg-[#C53020] disabled:opacity-50 text-white font-bold rounded-lg uppercase tracking-wider text-sm transition-colors flex items-center gap-2"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Save Configuration
                    </button>
                </div>
            </form>
        </div>
    )
}
