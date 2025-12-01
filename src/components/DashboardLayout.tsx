'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Layout, Lock, FileText, Settings, ChevronRight, ChevronDown, Plus,
    Grid, List, Calendar, Clock, CreditCard, Activity, Search, Bell,
    Menu, Zap, Database, Shield
} from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useProfile } from '@/hooks/useProfile';

interface DashboardLayoutProps {
    children: React.ReactNode;
    currentView: string;
    onViewChange: (view: string) => void;
    activeWorkspaceId: string;
    onWorkspaceChange: (id: string, name: string) => void;
}

export function DashboardLayout({ children, currentView, onViewChange, activeWorkspaceId, onWorkspaceChange }: DashboardLayoutProps) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { profile } = useProfile();
    const { isConnected } = useAccount();

    return (
        <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden font-sans selection:bg-purple-500/30 transition-colors duration-500">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 260 }}
                animate={{ width: isSidebarOpen ? 260 : 72 }}
                className="h-full bg-[var(--card-bg)] border-r border-[var(--border-color)] flex flex-col transition-all duration-300 relative z-20 backdrop-blur-xl"
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-4 border-b border-[var(--border-color)]">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
                            <Zap size={18} className="text-white" />
                        </div>
                        {isSidebarOpen && (
                            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                ArcOS
                            </span>
                        )}
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
                    {/* Workspace - Single Only */}
                    <div className="space-y-1">
                        {isSidebarOpen && <h3 className="text-xs font-semibold text-neutral-500 px-3 mb-2 uppercase tracking-wider">Workspace</h3>}
                        <SidebarItem
                            icon={<Database size={18} />}
                            label="My Workspace"
                            isOpen={isSidebarOpen}
                            active={currentView === 'workspace' || currentView === 'board' || currentView === 'list' || currentView === 'calendar'}
                            onClick={() => onViewChange('board')}
                        />
                    </div>

                    {/* Private Pages */}
                    <div className="space-y-1">
                        {isSidebarOpen && <h3 className="text-xs font-semibold text-neutral-500 px-3 mb-2 uppercase tracking-wider">Private</h3>}
                        <SidebarItem
                            icon={<Lock size={18} />}
                            label="Encrypted Notes"
                            isOpen={isSidebarOpen}
                            onClick={() => onViewChange('notes')}
                            active={currentView === 'notes'}
                        />
                        <SidebarItem
                            icon={<Clock size={18} />}
                            label="Focus Mode"
                            isOpen={isSidebarOpen}
                            onClick={() => onViewChange('pomodoro')}
                            active={currentView === 'pomodoro'}
                        />
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-[var(--border-color)]">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-[var(--foreground)] transition-colors"
                    >
                        {isSidebarOpen ? <ChevronRight size={18} className="rotate-180" /> : <ChevronRight size={18} />}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[url('/grid.svg')] bg-fixed">
                {/* Header */}
                <header className="h-16 border-b border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-md flex items-center justify-between px-6 z-10 transition-colors duration-500">
                    {/* Left: View Switcher */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center bg-[var(--card-bg)] rounded-lg p-1 border border-[var(--border-color)]">
                            <ViewTab icon={<Grid size={14} />} label="Board" active={currentView === 'board'} onClick={() => onViewChange('board')} />
                            <ViewTab icon={<List size={14} />} label="List" active={currentView === 'list'} onClick={() => onViewChange('list')} />
                            <ViewTab icon={<Calendar size={14} />} label="Calendar" active={currentView === 'calendar'} onClick={() => onViewChange('calendar')} />
                            <ViewTab icon={<Clock size={14} />} label="Timeline" active={currentView === 'timeline'} onClick={() => onViewChange('timeline')} />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-4">
                        <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto relative">
                    {/* Ambient Background Glow */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[120px]"></div>
                        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/10 blur-[120px]"></div>
                    </div>

                    <div className="relative z-10 h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, isOpen, active = false, onClick }: { icon: React.ReactNode, label: string, isOpen: boolean, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${active ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'hover:bg-white/5 text-neutral-400 hover:text-white'}`}
        >
            <span className={`${active ? 'text-purple-400' : 'text-neutral-500 group-hover:text-white'}`}>{icon}</span>
            {isOpen && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
        </button>
    );
}

function ViewTab({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${active ? 'bg-white/10 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/5'}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}
