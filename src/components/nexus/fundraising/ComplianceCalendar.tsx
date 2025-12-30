import { useEffect, useState } from 'react'
import { Calendar, AlertTriangle, CheckCircle, Clock, FileText, Shield, TrendingUp, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import ComplianceTaskWizard from './ComplianceTaskWizard'

interface ComplianceTask {
    id: string
    taskType: string
    title: string
    description: string
    jurisdiction: string
    dueDate: string
    status: string
    priority: string
    filingReference: string
    assignedTo: string
}

export default function ComplianceCalendar({ subsidiaryId }: { subsidiaryId: string }) {
    const [tasks, setTasks] = useState<ComplianceTask[]>([])
    const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'completed'>('all')
    const [loading, setLoading] = useState(true)
    const [wizardOpen, setWizardOpen] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchTasks()
    }, [subsidiaryId, filter])

    async function fetchTasks() {
        let query = supabase
            .from('compliance_tasks')
            .select('*')
            .eq('subsidiary_id', subsidiaryId)
            .order('due_date')

        if (filter === 'pending') {
            query = query.in('status', ['pending', 'in_progress'])
        } else if (filter === 'overdue') {
            query = query.eq('status', 'overdue')
        } else if (filter === 'completed') {
            query = query.in('status', ['filed', 'completed'])
        }

        const { data } = await query

        if (data) {
            const formatted = data.map(t => ({
                id: t.id,
                taskType: t.task_type,
                title: t.title,
                description: t.description || '',
                jurisdiction: t.jurisdiction || '',
                dueDate: t.due_date,
                status: t.status,
                priority: t.priority,
                filingReference: t.filing_reference || '',
                assignedTo: t.assigned_to || '',
            }))

            // Check for overdue tasks
            const now = new Date()
            formatted.forEach(task => {
                if (new Date(task.dueDate) < now && task.status !== 'completed' && task.status !== 'filed') {
                    task.status = 'overdue'
                }
            })

            setTasks(formatted)
        }

        setLoading(false)
    }

    function getDaysUntil(dateString: string): number {
        const due = new Date(dateString)
        const now = new Date()
        return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }

    function getPriorityColor(priority: string): string {
        switch (priority) {
            case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30'
            case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
            case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
            default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
        }
    }

    function getStatusIcon(status: string) {
        switch (status) {
            case 'completed':
            case 'filed':
                return <CheckCircle className="text-green-400" size={20} />
            case 'overdue':
                return <AlertTriangle className="text-red-400" size={20} />
            case 'in_progress':
                return <Clock className="text-blue-400" size={20} />
            default:
                return <FileText className="text-white/60" size={20} />
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F54029]"></div>
            </div>
        )
    }

    const overdueTasks = tasks.filter(t => t.status === 'overdue')
    const upcomingTasks = tasks.filter(t => {
        const days = getDaysUntil(t.dueDate)
        return days >= 0 && days <= 30 && !['completed', 'filed'].includes(t.status)
    })

    return (
        <div className="space-y-8 relative">
            {wizardOpen && (
                <ComplianceTaskWizard
                    subsidiaryId={subsidiaryId}
                    onClose={() => setWizardOpen(false)}
                    onComplete={() => {
                        setWizardOpen(false)
                        fetchTasks()
                    }}
                />
            )}

            {/* Alert Banner */}
            {overdueTasks.length > 0 && (
                <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="text-red-400 flex-shrink-0" size={32} />
                        <div>
                            <h3 className="text-red-400 font-bold text-xl mb-2">Action Required</h3>
                            <p className="text-white/80 mb-4">
                                You have {overdueTasks.length} overdue compliance task{overdueTasks.length !== 1 && 's'} that require immediate attention.
                            </p>
                            <button className="px-6 py-2 bg-red-500/30 hover:bg-red-500/40 text-red-400 font-bold rounded-lg transition-all">
                                Review Now
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-6">
                <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <FileText className="text-blue-400" size={24} />
                        <p className="text-white/60 text-sm uppercase tracking-wider">Total Tasks</p>
                    </div>
                    <p className="text-white text-4xl font-bold font-rajdhani">{tasks.length}</p>
                </div>

                <div className="bg-gradient-to-br from-red-500/20 to-black/40 border border-red-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="text-red-400" size={24} />
                        <p className="text-white/60 text-sm uppercase tracking-wider">Overdue</p>
                    </div>
                    <p className="text-red-400 text-4xl font-bold font-rajdhani">{overdueTasks.length}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500/20 to-black/40 border border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <Clock className="text-yellow-400" size={24} />
                        <p className="text-white/60 text-sm uppercase tracking-wider">Due Soon</p>
                    </div>
                    <p className="text-yellow-400 text-4xl font-bold font-rajdhani">{upcomingTasks.length}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500/20 to-black/40 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="text-green-400" size={24} />
                        <p className="text-white/60 text-sm uppercase tracking-wider">Completed</p>
                    </div>
                    <p className="text-green-400 text-4xl font-bold font-rajdhani">
                        {tasks.filter(t => ['completed', 'filed'].includes(t.status)).length}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === 'all'
                            ? 'bg-[#F54029] text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        All Tasks
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === 'pending'
                            ? 'bg-[#F54029] text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('overdue')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === 'overdue'
                            ? 'bg-[#F54029] text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        Overdue
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${filter === 'completed'
                            ? 'bg-[#F54029] text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        Completed
                    </button>
                </div>

                <button
                    onClick={() => setWizardOpen(true)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg flex items-center gap-2 transition-all"
                >
                    <Plus size={18} />
                    New Task
                </button>
            </div>

            {/* Task List */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 font-rajdhani flex items-center gap-3">
                    <Calendar className="text-[#F54029]" size={32} />
                    Compliance Tasks
                </h2>

                {tasks.length === 0 ? (
                    <div className="text-center py-16">
                        <CheckCircle className="mx-auto mb-4 text-green-400" size={64} />
                        <p className="text-white/60 text-lg">All caught up!</p>
                        <p className="text-white/40 text-sm mt-2">No {filter !== 'all' ? filter : ''} tasks found</p>
                        <button
                            onClick={() => setWizardOpen(true)}
                            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all"
                        >
                            Schedule a Task
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map(task => {
                            const daysUntil = getDaysUntil(task.dueDate)
                            const isUrgent = daysUntil <= 7 && daysUntil >= 0

                            return (
                                <div
                                    key={task.id}
                                    className={`bg-white/5 hover:bg-white/10 border rounded-lg p-6 transition-all ${task.status === 'overdue'
                                        ? 'border-red-500/30'
                                        : isUrgent
                                            ? 'border-yellow-500/30'
                                            : 'border-white/10'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            {getStatusIcon(task.status)}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-white font-bold text-lg">{task.title}</h3>
                                                    <span className={`px-3 py-1 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                                        {task.priority.toUpperCase()}
                                                    </span>
                                                </div>
                                                {task.description && (
                                                    <p className="text-white/60 text-sm mb-3">{task.description}</p>
                                                )}
                                                <div className="flex items-center gap-6 text-xs text-white/40">
                                                    <span className="flex items-center gap-1">
                                                        <Shield size={12} />
                                                        {task.taskType.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                    {task.jurisdiction && (
                                                        <span>{task.jurisdiction}</span>
                                                    )}
                                                    {task.filingReference && (
                                                        <span>Ref: {task.filingReference}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Due Date</p>
                                            <p className={`font-bold text-lg ${task.status === 'overdue' ? 'text-red-400' :
                                                isUrgent ? 'text-yellow-400' :
                                                    'text-white'
                                                }`}>
                                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                            {task.status !== 'completed' && task.status !== 'filed' && (
                                                <p className="text-white/60 text-xs mt-1">
                                                    {daysUntil < 0
                                                        ? `${Math.abs(daysUntil)} days overdue`
                                                        : `${daysUntil} days remaining`}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-white/10">
                                        {task.status === 'pending' && (
                                            <button className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm font-medium transition-colors">
                                                Start Task
                                            </button>
                                        )}
                                        {task.status === 'in_progress' && (
                                            <button className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium transition-colors">
                                                Mark Complete
                                            </button>
                                        )}
                                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors">
                                            View Details
                                        </button>
                                        {task.status === 'completed' && (
                                            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors">
                                                Download Proof
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Compliance Health */}
            <div className="bg-gradient-to-br from-green-500/10 to-black/40 border border-green-500/20 rounded-2xl p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-2xl mb-2 font-rajdhani">Compliance Health Score</h3>
                        <p className="text-white/60">Based on task completion and filing deadlines</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-bold text-green-400 font-rajdhani">
                                {tasks.length > 0
                                    ? Math.round((tasks.filter(t => ['completed', 'filed'].includes(t.status)).length / tasks.length) * 100)
                                    : 100}
                            </span>
                            <span className="text-white/60 text-2xl">/100</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-green-400">
                            <TrendingUp size={16} />
                            <span className="text-sm font-medium">Excellent</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
