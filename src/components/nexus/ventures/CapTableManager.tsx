'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { PieChart, Users, Plus, Trash2, Save, AlertTriangle, Check } from 'lucide-react'
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function CapTableManager({ subsidiaryId, authorizedShares = 10000000, themeColor = '#F54029' }: { subsidiaryId: string, authorizedShares?: number, themeColor?: string }) {
    const supabase = createClient()
    const [shareholders, setShareholders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)

    // New Entry State
    const [newHolder, setNewHolder] = useState({ name: '', role: 'Adjusted Grant', shares: '' })
    const [editGrant, setEditGrant] = useState<{ id: string, name: string, shares: string } | null>(null)

    const COLORS = ['#F54029', '#4B5563', '#7C3AED', '#EAB308', '#D97706', '#9333EA', '#DB2777']

    useEffect(() => {
        fetchCapTable()
    }, [subsidiaryId])

    const fetchCapTable = async () => {
        setLoading(true)

        // 1. Get Campaigns for this sub
        const { data: campaigns } = await supabase
            .from('fundraising_campaigns')
            .select('id')
            .eq('subsidiary_id', subsidiaryId)

        const campaignIds = campaigns?.map(c => c.id) || []

        if (campaignIds.length > 0) {
            // 2. Get Commitments 
            const { data: txs, error: txError } = await supabase
                .from('campaign_commitments')
                .select('*')
                .in('campaign_id', campaignIds)
                .eq('status', 'closed')

            if (txError) {
                console.error("[CapTable Fetch Error]", txError)
            }

            if (txs) {
                const map = new Map<string, number>()
                const roleMap = new Map<string, string>()
                const idMap = new Map<string, string>()
                
                txs.forEach(tx => {
                    const name = tx.notes?.includes('(Genesis)') ? tx.notes.split(' (Genesis)')[0] : ('Network Investor')
                    const shares = Number(tx.number_of_shares || 0)
                    map.set(name, (map.get(name) || 0) + shares)
                    roleMap.set(name, tx.notes?.includes('(Genesis)') ? 'Founder/Early' : 'Investor')
                    if (!idMap.has(name) || tx.notes?.includes('Genesis')) idMap.set(name, tx.id)
                })

                const list = Array.from(map.entries()).map(([name, shares]) => ({
                    id: idMap.get(name),
                    name,
                    shares,
                    role: roleMap.get(name) || 'Shareholder',
                    percentage: (shares / authorizedShares) * 100
                }))

                setShareholders(list)
            }
        } else {
            setShareholders([])
        }
        setLoading(false)
    }



    // State for Invites
    const [invites, setInvites] = useState<any[]>([])
    const [inviteEmail, setInviteEmail] = useState('')

    useEffect(() => {
        fetchCapTable()
        fetchInvites()
    }, [subsidiaryId])

    const fetchInvites = async () => {
        const { data } = await supabase
            .from('cap_table_invites')
            .select('*')
            .eq('subsidiary_id', subsidiaryId)
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

        if (data) setInvites(data)
    }

    const handleAddGrant = async () => {
        if (!newHolder.shares) return

        const isEmail = newHolder.name.includes('@')

        if (isEmail) {
            // Secure Invite Flow via SES API
            try {
                const res = await fetch('/api/ventures/invite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: newHolder.name,
                        subsidiaryId,
                        shares: parseFloat(newHolder.shares),
                        role: newHolder.role || 'Investor'
                    })
                });
                
                const data = await res.json();
                
                if (!res.ok) {
                    throw new Error(data.error || 'Failed to dispatch invite');
                }
                
                alert(`Invite dispatched to ${newHolder.name}`);
                setNewHolder({ name: '', role: 'Adjusted Grant', shares: '' });
                fetchInvites();
            } catch (err: any) {
                alert('Error sending invite: ' + err.message);
            }
        } else {
            // Direct Grant Flow (Existing)
            // Find or Create Genesis Round
            let { data: genesis } = await supabase
                .from('fundraising_campaigns')
                .select('id')
                .eq('subsidiary_id', subsidiaryId)
                .eq('name', 'Genesis Allocation')
                .single()

            if (!genesis) {
                const { data: newGenesis, error } = await supabase.from('fundraising_campaigns').insert({
                    subsidiary_id: subsidiaryId,
                    name: 'Genesis Allocation',
                    status: 'closed', // Hidden from public list
                    visibility: 'private',
                    round_type: 'pre_seed',
                    target_amount: 0,
                    tagline: 'Initial Cap Table Setup'
                }).select().single()
                
                if (error) {
                    alert('Error creating Genesis container: ' + error.message)
                    return
                }
                genesis = newGenesis
            }

            const { data: { user } } = await supabase.auth.getUser()

            const { error } = await supabase.from('campaign_commitments').insert({
                campaign_id: genesis?.id,
                investor_id: user?.id, // Proxy to current admin for manual grants
                commitment_amount: 0, // Grant
                status: 'closed',
                number_of_shares: parseFloat(newHolder.shares),
                notes: `${newHolder.name} (Genesis)`
            })

            if (!error) {
                setNewHolder({ name: '', role: 'Adjusted Grant', shares: '' })
                fetchCapTable()
                console.log(`[NOTIFICATION] Cap table updated: ${newHolder.name} added with ${newHolder.shares} shares`)
            } else {
                alert('Failed to add grant: ' + error.message)
            }
        }
    }

    const handleDeleteGrant = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove ${name} from the cap table?`)) return
        const { error } = await supabase.from('campaign_commitments').delete().eq('id', id)
        if (error) alert('Failed to remove: ' + error.message)
        else fetchCapTable()
    }

    const handleSaveEdit = async () => {
        if (!editGrant) return
        const { error } = await supabase.from('campaign_commitments').update({
            number_of_shares: parseFloat(editGrant.shares),
            notes: `${editGrant.name} (Genesis)`
        }).eq('id', editGrant.id)
        
        if (error) alert('Failed to update: ' + error.message)
        else {
            setEditGrant(null)
            fetchCapTable()
        }
    }

    // Calc stats
    const totalAllocated = shareholders.reduce((acc, curr) => acc + curr.shares, 0)
    const totalUnallocated = Math.max(0, authorizedShares - totalAllocated)

    const chartData = [
        ...shareholders,
        { name: 'Unallocated', shares: totalUnallocated, role: 'Treasury', percentage: (totalUnallocated / authorizedShares) * 100 }
    ]

    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-xl animate-fadeIn">
            <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold font-rajdhani text-white uppercase tracking-wider flex items-center gap-2">
                        <PieChart style={{ color: themeColor }} size={20} /> Cap Table
                    </h3>
                    <p className="text-xs text-white/40 mt-1">
                        Total Shares Authorized: <span className="text-white font-mono">{new Intl.NumberFormat('en-US').format(authorizedShares)}</span>
                    </p>
                </div>
                {!editMode ? (
                    <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-white transition-colors"
                    >
                        Edit / Manual Entry
                    </button>
                ) : (
                    <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                        style={{ backgroundColor: themeColor }}
                    >
                        Done
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left: Visualization */}
                <div className="h-[400px] p-6 relative flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPie>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={2}
                                dataKey="shares"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.name === 'Unallocated' ? '#1a1a1a' : (index === 0 ? themeColor : COLORS[index % COLORS.length])} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(val: any) => new Intl.NumberFormat('en-US').format(val) + ' Shares'}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </RechartsPie>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -translate-y-4">
                        <span className="text-3xl font-bold text-white font-rajdhani">
                            {((totalAllocated / authorizedShares) * 100).toFixed(1)}%
                        </span>
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Allocated</span>
                    </div>
                </div>

                {/* Right: List & Entry */}
                <div className="p-6 overflow-y-auto max-h-[400px] bg-white/[0.01]">
                    {editMode && (
                        <div className="mb-6 space-y-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-4 relative overflow-hidden">
                                <div className="absolute top-0 left-0 bottom-0 w-1 opacity-50" style={{ backgroundColor: themeColor }} />
                                <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: themeColor }}>
                                    <Plus size={14} /> Add Grant / Invite
                                </h4>
                                <p className="text-[10px] text-white/40">Enter name for manual grant, or email to invite external user.</p>
                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <input
                                        type="text"
                                        placeholder="Name or Email (e.g. founder@tuc.co)"
                                        className="col-span-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                                        value={newHolder.name}
                                        onChange={(e) => setNewHolder({ ...newHolder, name: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Shares"
                                        className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white/30"
                                        value={newHolder.shares}
                                        onChange={(e) => setNewHolder({ ...newHolder, shares: e.target.value })}
                                    />
                                    <button
                                        onClick={handleAddGrant}
                                        disabled={!newHolder.shares || !newHolder.name}
                                        className="text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                                        style={{ backgroundColor: themeColor }}
                                    >
                                        {newHolder.name.includes('@') ? 'Send Invite' : 'Add Grant'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {invites.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-[10px] uppercase text-white/40 mb-2 font-bold tracking-widest">Pending Invites</h4>
                            <div className="space-y-2">
                                {invites.map(inv => (
                                    <div key={inv.id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-lg border-dashed">
                                        <div>
                                            <p className="text-sm font-medium text-white">{inv.email}</p>
                                            <p className="text-xs text-white/40">{new Intl.NumberFormat('en-US').format(inv.shares)} Shares • Pending</p>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <table className="w-full text-left text-sm text-white/60">
                        <thead className="text-[10px] uppercase tracking-widest text-white/30 font-medium">
                            <tr>
                                <th className="pb-3 text-left">Shareholder</th>
                                <th className="pb-3 text-right pr-6">Shares</th>
                                <th className="pb-3 text-right pr-2">%</th>
                                {editMode && <th className="pb-3 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {chartData.filter(d => d.name !== 'Unallocated').map((entry, i) => (
                                <tr key={i} className="group hover:bg-white/[0.02] transition-colors relative">
                                    <td className="py-3 items-center gap-2 flex">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: i === 0 ? themeColor : COLORS[i % COLORS.length] }} />
                                        {editGrant?.id === entry.id ? (
                                            <input 
                                                autoFocus
                                                value={editGrant?.name || ''} 
                                                onChange={e => editGrant && setEditGrant({...editGrant, name: e.target.value})}
                                                className="bg-black/60 border rounded px-2 py-1 text-xs text-white max-w-[120px] outline-none"
                                                style={{ borderColor: themeColor }}
                                            />
                                        ) : (
                                            <span className="text-white font-medium">{entry.name}</span>
                                        )}
                                    </td>
                                    <td className="py-3 text-right font-mono text-white/80 pr-6">
                                        {editGrant?.id === entry.id ? (
                                            <input 
                                                type="number"
                                                value={editGrant?.shares || ''} 
                                                onChange={e => editGrant && setEditGrant({...editGrant, shares: e.target.value})}
                                                className="bg-black/60 border rounded px-2 py-1 text-xs text-right text-white max-w-[100px] outline-none"
                                                style={{ borderColor: themeColor }}
                                            />
                                        ) : (
                                            new Intl.NumberFormat('en-US').format(entry.shares)
                                        )}
                                    </td>
                                    <td className="py-3 text-right font-mono pr-2" style={{ color: themeColor }}>
                                        {entry.percentage.toFixed(2)}%
                                    </td>
                                    {editMode && (
                                        <td className="py-3 text-right pl-4">
                                            {editGrant?.id === entry.id ? (
                                                <button onClick={handleSaveEdit} className="transition-colors hover:brightness-125" style={{ color: themeColor }}>
                                                    <Save size={14} />
                                                </button>
                                            ) : (
                                                <div className="flex gap-2 justify-end opacity-50 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditGrant({ id: entry.id, name: entry.name, shares: entry.shares.toString() })} className="text-white/40 hover:text-white transition-colors">
                                                        <Check size={14} className="hidden" /> {/* Placeholder spacing */}
                                                        <span className="text-xs uppercase font-bold tracking-widest" style={{ color: themeColor }}>Edit</span>
                                                    </button>
                                                    <button onClick={() => handleDeleteGrant(entry.id, entry.name)} className="text-white/40 hover:text-red-500 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {/* Unallocated Row */}
                            <tr className="border-t border-white/10 bg-white/[0.01] italic">
                                <td className="py-3 flex items-center gap-2 pl-4">
                                    <div className="w-2 h-2 rounded-full bg-[#333]" />
                                    Unallocated Treasury
                                </td>
                                <td className="py-3 text-right font-mono opacity-50 pr-6">
                                    {new Intl.NumberFormat('en-US').format(totalUnallocated)}
                                </td>
                                <td className="py-3 text-right font-mono opacity-50 pr-2">
                                    {((totalUnallocated / authorizedShares) * 100).toFixed(2)}%
                                </td>
                                {editMode && <td className="py-3"></td>}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
