'use client'

import { useState } from 'react'
import { X, Calendar, FileText, Check, ArrowRight, ArrowLeft, Shield, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface ComplianceTaskWizardProps {
    subsidiaryId: string
    onClose: () => void
    onComplete: () => void
}

export default function ComplianceTaskWizard({ subsidiaryId, onClose, onComplete }: ComplianceTaskWizardProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        taskType: 'state_filing', // form_d, state_filing, annual_report, tax_filing, board_meeting, other
        jurisdiction: '',
        dueDate: '',
        priority: 'medium', // critical, high, medium, low
        filingReference: ''
    })

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const { error } = await supabase
                .from('compliance_tasks')
                .insert({
                    subsidiary_id: subsidiaryId,
                    title: formData.title,
                    description: formData.description,
                    task_type: formData.taskType,
                    jurisdiction: formData.jurisdiction,
                    due_date: formData.dueDate,
                    priority: formData.priority,
                    filing_reference: formData.filingReference,
                    status: 'pending'
                })

            if (error) throw error

            onComplete()
        } catch (error) {
            console.error('Error creating compliance task:', error)
            alert('Failed to create task. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-rajdhani">New Compliance Task</h2>
                        <p className="text-white/60 text-sm mt-1">Schedule a filing or regulatory requirement</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <FileText className="text-blue-500" size={24} />
                                    Task Details
                                </h3>
                            </div>

                            <div>
                                <label className="text-white/80 text-sm font-medium block mb-2">Task Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Annual Franchise Tax Report"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Type</label>
                                    <select
                                        value={formData.taskType}
                                        onChange={e => setFormData({ ...formData, taskType: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <option value="form_d">Form D Filing</option>
                                        <option value="state_filing">State Filing</option>
                                        <option value="annual_report">Annual Report</option>
                                        <option value="tax_filing">Tax Filing</option>
                                        <option value="board_meeting">Board Meeting</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-white/80 text-sm font-medium block mb-2">Jurisdiction</label>
                                    <input
                                        type="text"
                                        value={formData.jurisdiction}
                                        onChange={e => setFormData({ ...formData, jurisdiction: e.target.value })}
                                        placeholder="e.g. Delaware, California"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-white/80 text-sm font-medium block mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Calendar className="text-yellow-500" size={24} />
                                    Schedule & Priority
                                </h3>
                            </div>

                            <div>
                                <label className="text-white/80 text-sm font-medium block mb-2">Due Date</label>
                                <input
                                    type="date"
                                    value={formData.dueDate}
                                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-yellow-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="text-white/80 text-sm font-medium block mb-2">Priority Level</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['low', 'medium', 'high', 'critical'].map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setFormData({ ...formData, priority: p })}
                                            className={`p-3 rounded-lg border text-center transition-all capitalize ${formData.priority === p
                                                    ? p === 'critical' ? 'bg-red-500/20 border-red-500 text-white' :
                                                        p === 'high' ? 'bg-orange-500/20 border-orange-500 text-white' :
                                                            p === 'medium' ? 'bg-yellow-500/20 border-yellow-500 text-white' :
                                                                'bg-blue-500/20 border-blue-500 text-white'
                                                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-white/80 text-sm font-medium block mb-2">Filing Reference (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.filingReference}
                                    onChange={e => setFormData({ ...formData, filingReference: e.target.value })}
                                    placeholder="e.g. File Number, Previous Ref"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg flex items-start gap-3 mt-4">
                                <AlertTriangle className="text-yellow-400 mt-1 flex-shrink-0" size={20} />
                                <div className="text-sm">
                                    <p className="text-white font-medium">Compliance Reminder</p>
                                    <p className="text-white/60 mt-1">Failing to meet compliance deadlines can result in penalties or loss of good standing. Ensure the due date is accurate.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-4 p-6 border-t border-white/10">
                    <div className="flex gap-2">
                        {[1, 2].map(s => (
                            <div
                                key={s}
                                className={`w-2 h-2 rounded-full transition-colors ${s === step ? 'bg-blue-500' : 'bg-white/10'
                                    }`}
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
                                disabled={!formData.title}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-all flex items-center gap-2"
                            >
                                Next
                                <ArrowRight size={18} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !formData.dueDate}
                                className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-lg transition-all flex items-center gap-2"
                            >
                                {loading ? 'Saving...' : 'Create Task'}
                                {!loading && <Check size={18} />}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
