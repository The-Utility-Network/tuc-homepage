'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    PieChart,
    Users,
    Briefcase,
    Menu,
    X,
    ChevronRight,
    Bell,
    MessageSquare,
    ChevronLeft,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react'

interface NexusShellProps {
    children: React.ReactNode
    role: string
    name: string
    company: string
    userEmail: string
}

export default function NexusShell({ children, role, name, company, userEmail }: NexusShellProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [sidebarExpanded, setSidebarExpanded] = useState(true)
    const pathname = usePathname()

    // check if link is active
    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/')

    const NavItem = ({ href, icon: Icon, label }: any) => {
        const active = isActive(href)
        return (
            <Link
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${active
                    ? 'bg-[#F54029]/10 text-[#F54029] border border-[#F54029]/20 shadow-[0_0_20px_rgba(245,64,41,0.1)]'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                    } ${!sidebarExpanded ? 'justify-center px-0' : ''}`}
                title={!sidebarExpanded ? label : undefined}
            >
                {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F54029]" />}
                <Icon size={20} className={`transition-colors duration-300 shrink-0 ${active ? 'text-[#F54029]' : 'group-hover:text-[#F54029] text-white/40'}`} />
                <span className={`font-medium tracking-wide text-sm z-10 whitespace-nowrap transition-all duration-300 ${sidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 w-0 overflow-hidden'}`}>{label}</span>
                {active && sidebarExpanded && (
                    <div className="ml-auto animate-pulse">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F54029] shadow-[0_0_10px_rgba(245,64,41,0.8)]" />
                    </div>
                )}
            </Link>
        )
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className={`p-6 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent flex items-center ${sidebarExpanded ? 'justify-between' : 'justify-center bg-black/50'}`}>
                <Link href="/" className={`block group ${!sidebarExpanded && 'hidden'}`}>
                    <h1 className="text-2xl font-bold font-rajdhani tracking-wider text-white group-hover:text-[#F54029] transition-colors duration-300">
                        TUC <span className="text-[#F54029] group-hover:text-white transition-colors duration-300">NEXUS</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F54029] animate-pulse" />
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                            Secure Connection
                        </p>
                    </div>
                </Link>
                {!sidebarExpanded && (
                    <div className="text-[#F54029] font-bold font-rajdhani text-xl">N</div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar overflow-x-hidden">
                <div className="space-y-2">
                    {sidebarExpanded && (
                        <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2 font-rajdhani font-semibold animate-fadeIn">
                            Main Console
                        </h3>
                    )}
                    <nav className="space-y-1">
                        <NavItem href="/nexus/dashboard" icon={LayoutDashboard} label="Dashboard" />
                        <NavItem href="/nexus/ventures" icon={PieChart} label="Ventures" />
                        <NavItem href="/nexus/messages" icon={MessageSquare} label="Messages" />
                        <NavItem href="/nexus/documents" icon={FileText} label="Data Room" />
                        {role === 'investor' && (
                            <NavItem href="/nexus/portfolio" icon={Briefcase} label="My Portfolio" />
                        )}
                    </nav>
                </div>

                {role === 'admin' && (
                    <div className="space-y-2">
                        {sidebarExpanded && (
                            <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] text-[#F54029]/80 mb-2 font-rajdhani font-semibold animate-fadeIn">
                                Admin Operations
                            </h3>
                        )}
                        <div className="space-y-1">
                            <NavItem href="/nexus/manage/investors" icon={Users} label="Investors" />
                            <NavItem href="/nexus/manage/documents" icon={FileText} label="Doc Center" />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {sidebarExpanded && (
                        <h3 className="px-4 text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2 font-rajdhani font-semibold animate-fadeIn">
                            System & Account
                        </h3>
                    )}
                    <nav className="space-y-1">
                        {role === 'admin' ? (
                            <NavItem href="/nexus/settings" icon={Settings} label="System Config" />
                        ) : (
                            <NavItem href="/nexus/profile" icon={Settings} label="My Profile" />
                        )}
                    </nav>
                </div>
            </div>

            <div className="p-4 border-t border-white/5 bg-white/[0.02] flex flex-col gap-2">
                <button
                    onClick={() => setSidebarExpanded(!sidebarExpanded)}
                    className="w-full flex items-center justify-center p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                >
                    {sidebarExpanded ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
                </button>

                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5 hover:border-[#F54029]/30 transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] ${!sidebarExpanded ? 'justify-center px-2' : ''}`}>
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#F54029] to-[#961b0b] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_15px_rgba(245,64,41,0.3)] ring-2 ring-transparent group-hover:ring-[#F54029]/50 transition-all shrink-0">
                        {name.charAt(0)}
                    </div>
                    {sidebarExpanded && (
                        <div className="flex-1 overflow-hidden animate-fadeIn">
                            <p className="text-sm font-bold font-rajdhani text-white truncate group-hover:text-[#F54029] transition-colors">{name}</p>
                            <p className="text-xs text-white/40 truncate capitalize">{role} Access</p>
                        </div>
                    )}
                    {sidebarExpanded && (
                        <form action="/auth/signout" method="post">
                            <button className="text-white/20 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all" title="Sign Out">
                                <LogOut size={16} />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <div className="flex h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#F54029]/30">
            {/* Desktop Sidebar */}
            <aside className={`${sidebarExpanded ? 'w-72' : 'w-20'} border-r border-white/5 hidden md:flex flex-col bg-black/40 backdrop-blur-3xl relative z-20 shadow-[5px_0_30px_rgba(0,0,0,0.5)] transition-all duration-300`}>
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm animate-fadeIn" onClick={() => setMobileMenuOpen(false)}>
                    <div
                        className="absolute left-0 top-0 bottom-0 w-[80%] max-w-[300px] bg-[#0A0A0A] border-r border-white/10 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute top-4 right-4 text-white/40 hover:text-white"
                        >
                            <X size={24} />
                        </button>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* Main Layout Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden bg-[url('/grid-pattern.png')] bg-repeat relative">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#080808] to-[#120505] opacity-95 -z-10" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F54029]/5 rounded-full blur-[120px] pointer-events-none" />

                {/* Mobile Header */}
                <header className="md:hidden h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/60 backdrop-blur-xl shrink-0 z-40 sticky top-0">
                    <span className="font-rajdhani font-bold text-xl tracking-wider">TUC <span className="text-[#F54029]">NEXUS</span></span>
                    <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-white/80 hover:text-[#F54029] transition-colors">
                        <Menu size={24} />
                    </button>
                </header>

                {/* Desktop Top Bar */}
                <header className="hidden md:flex h-16 border-b border-white/5 items-center justify-between px-8 bg-black/20 backdrop-blur-md shrink-0 z-10">
                    <div className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-widest font-medium">
                        <span className="hover:text-white transition-colors cursor-default">Nexus</span>
                        <ChevronRight size={12} />
                        <span className="text-white">Console</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-white/40 hover:text-white transition-colors">
                            <Bell size={18} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F54029] rounded-full border border-black" />
                        </button>
                        <div className="h-6 w-px bg-white/10" />
                        <div className="px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/20 flex items-center gap-2 group cursor-help transition-colors hover:bg-green-500/10">
                            <div className="relative">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse relative z-10" />
                                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-green-500 animate-ping opacity-50" />
                            </div>
                            <span className="text-[10px] font-bold text-green-400/80 group-hover:text-green-400 uppercase tracking-wider transition-colors">System Online</span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="max-w-[1600px] mx-auto animate-fadeInUp pb-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
