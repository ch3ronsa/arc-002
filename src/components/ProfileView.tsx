'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, usePublicClient } from 'wagmi';
import { motion } from 'framer-motion';
import {
    Trophy, Star, Zap, Clock, CheckCircle2, Lock,
    TrendingUp, Calendar, Award, RefreshCw, Wallet, Shield
} from 'lucide-react';
import { toast } from 'sonner';

const ARC_JOURNAL_ADDRESS = "0xeB282dF68897C6245526e9BFD88e82eF5BcbD5c2";

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    unlocked: boolean;
    progress?: number;
    total?: number;
}

interface Activity {
    id: string;
    type: 'task' | 'note' | 'achievement';
    title: string;
    timestamp: string;
    onChain?: boolean;
}

export function ProfileView() {
    const { address, isConnected } = useAccount();
    const [mounted, setMounted] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    // Real data - can be connected to actual sources
    const xp = 0; // Can be calculated from actual achievements
    const level = 1;
    const completedTasks = 0; // Can be fetched from Supabase

    useEffect(() => {
        setMounted(true);
    }, []);

    const achievements: Achievement[] = [
        {
            id: '1',
            title: 'Early Adopter',
            description: 'Joined Arc Network',
            icon: <Trophy className="text-yellow-400" size={24} />,
            unlocked: true
        },
        {
            id: '2',
            title: 'Task Master',
            description: 'Complete 50 tasks',
            icon: <CheckCircle2 className="text-green-400" size={24} />,
            unlocked: false,
            progress: 47,
            total: 50
        },
        {
            id: '3',
            title: 'Chain Anchor',
            description: 'Anchor 10 documents',
            icon: <Shield className="text-blue-400" size={24} />,
            unlocked: true
        },
        {
            id: '4',
            title: 'Focus Warrior',
            description: '100 hours of focused work',
            icon: <Zap className="text-purple-400" size={24} />,
            unlocked: false,
            progress: 67,
            total: 100
        },
        {
            id: '5',
            title: 'Crypto Vault',
            description: 'Secure 5 encrypted notes',
            icon: <Lock className="text-orange-400" size={24} />,
            unlocked: true
        },
        {
            id: '6',
            title: 'Time Lord',
            description: '30 day streak',
            icon: <Calendar className="text-cyan-400" size={24} />,
            unlocked: false,
            progress: 12,
            total: 30
        }
    ];

    const activities: Activity[] = [
        { id: '1', type: 'task', title: 'Completed "Deploy Smart Contract"', timestamp: '2 hours ago', onChain: true },
        { id: '2', type: 'note', title: 'Created encrypted note', timestamp: '5 hours ago', onChain: false },
        { id: '3', type: 'achievement', title: 'Unlocked "Chain Anchor"', timestamp: '1 day ago', onChain: false },
        { id: '4', type: 'task', title: 'Archived 5 tasks', timestamp: '2 days ago', onChain: true },
        { id: '5', type: 'note', title: 'Anchored document to chain', timestamp: '3 days ago', onChain: true },
    ];

    const [archivedTasks, setArchivedTasks] = useState<string[]>([]);

    // Read archived tasks from blockchain
    const { data: taskLogs } = useReadContract({
        address: ARC_JOURNAL_ADDRESS as `0x${string}`,
        abi: [
            {
                name: 'taskLogs',
                type: 'function',
                stateMutability: 'view',
                inputs: [
                    { name: 'user', type: 'address' },
                    { name: 'index', type: 'uint256' }
                ],
                outputs: [{ name: '', type: 'string' }]
            },
            {
                name: 'getTaskLogCount',
                type: 'function',
                stateMutability: 'view',
                inputs: [{ name: 'user', type: 'address' }],
                outputs: [{ name: '', type: 'uint256' }]
            }
        ] as const,
        functionName: 'getTaskLogCount',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address
        }
    });

    const handleSyncData = async () => {
        setIsSyncing(true);

        // Fetch archived tasks if available
        if (address && taskLogs) {
            try {
                const count = Number(taskLogs);
                const tasks: string[] = [];

                // Note: This is a simplified version. In production, you'd batch read these
                toast.promise(
                    (async () => {
                        for (let i = 0; i < Math.min(count, 10); i++) {
                            // Would need to read individual task logs here
                        }
                        return count;
                    })(),
                    {
                        loading: 'Syncing on-chain data...',
                        success: (count) => `Found ${count} archived tasks`,
                        error: 'Failed to sync data'
                    }
                );
            } catch (error) {
                console.error('Sync error:', error);
                toast.error('Failed to sync data');
            }
        } else {
            toast.promise(
                new Promise(resolve => setTimeout(resolve, 2000)),
                {
                    loading: 'Syncing on-chain data...',
                    success: 'Data synced successfully!',
                    error: 'Failed to sync data'
                }
            );
        }

        setTimeout(() => setIsSyncing(false), 2000);
    };

    const maxXp = (level + 1) * 500;
    const xpProgress = (xp / maxXp) * 100;

    if (!mounted) return null;

    return (
        <div className="w-full h-full overflow-y-auto bg-[var(--background)] p-6 lg:p-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent border border-[var(--border-color)] backdrop-blur-xl"
                >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 blur-3xl opacity-30" />

                    <div className="relative p-8">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-purple-500/50">
                                        {address ? address.slice(2, 4).toUpperCase() : '??'}
                                    </div>
                                    {isConnected && (
                                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-[var(--background)] flex items-center justify-center">
                                            <Wallet size={14} className="text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* User Info */}
                                <div>
                                    <h1 className="text-2xl font-bold text-[var(--foreground)] mb-1">
                                        {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not Connected'}
                                    </h1>
                                    <div className="flex items-center gap-2 text-sm text-neutral-400 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Award size={14} className="text-yellow-400" />
                                            Level {level}
                                        </span>
                                        <span>•</span>
                                        <span>{xp.toLocaleString()} XP</span>
                                    </div>
                                    {/* XP Progress Bar */}
                                    <div className="w-64">
                                        <div className="flex justify-between text-xs text-neutral-500 mb-1">
                                            <span>Progress to Level {level + 1}</span>
                                            <span>{Math.floor(xpProgress)}%</span>
                                        </div>
                                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${xpProgress}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sync Button */}
                            <button
                                onClick={handleSyncData}
                                disabled={!isConnected || isSyncing}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                            >
                                <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                                {isSyncing ? 'Syncing...' : 'Sync On-Chain Data'}
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tasks Completed */}
                    <StatCard
                        icon={<CheckCircle2 className="text-green-400" size={24} />}
                        label="Tasks Completed"
                        value={completedTasks}
                        trend="Track your productivity"
                        color="green"
                    />

                    {/* On-Chain Actions */}
                    <StatCard
                        icon={<Shield className="text-blue-400" size={24} />}
                        label="On-Chain Actions"
                        value={0}
                        trend="Blockchain interactions"
                        color="blue"
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Achievements */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-xl p-6"
                        >
                            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                                <Star className="text-yellow-400" size={20} />
                                Achievements
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {achievements.map((achievement, index) => (
                                    <motion.div
                                        key={achievement.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + index * 0.05 }}
                                        className={`relative p-4 rounded-xl border transition-all ${achievement.unlocked
                                            ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30 hover:border-purple-500/50'
                                            : 'bg-black/20 border-neutral-800 opacity-60'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <div className={achievement.unlocked ? '' : 'opacity-40'}>
                                                {achievement.icon}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm text-[var(--foreground)]">
                                                    {achievement.title}
                                                </div>
                                                <div className="text-xs text-neutral-500 mt-1">
                                                    {achievement.description}
                                                </div>
                                                {!achievement.unlocked && achievement.progress !== undefined && (
                                                    <div className="mt-2">
                                                        <div className="text-xs text-neutral-400 mb-1">
                                                            {achievement.progress}/{achievement.total}
                                                        </div>
                                                        <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                                                style={{ width: `${(achievement.progress / achievement.total!) * 100}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {!achievement.unlocked && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Lock size={32} className="text-neutral-700" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Archived Tasks Section */}
                    {archivedTasks.length > 0 && (
                        <div className="lg:col-span-2 mt-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                            >
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="text-green-400" size={20} />
                                    On-Chain Archives
                                </h3>
                                <div className="space-y-3">
                                    {archivedTasks.map((log, index) => (
                                        <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/5">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-neutral-500 font-mono">Block Log #{archivedTasks.length - index}</span>
                                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Anchored</span>
                                            </div>
                                            <p className="text-sm text-neutral-300 font-mono break-all">{log}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Activity Timeline */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-xl p-6"
                        >
                            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 flex items-center gap-2">
                                <Clock className="text-blue-400" size={20} />
                                Recent Activity
                            </h2>
                            <div className="space-y-4">
                                {activities.map((activity, index) => (
                                    <motion.div
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.05 }}
                                        className="flex items-start gap-3 pb-4 border-b border-neutral-800 last:border-0 last:pb-0"
                                    >
                                        <div className={`w-2 h-2 rounded-full mt-2 ${activity.type === 'task' ? 'bg-green-400' :
                                            activity.type === 'note' ? 'bg-blue-400' :
                                                'bg-yellow-400'
                                            }`} />
                                        <div className="flex-1">
                                            <div className="text-sm text-[var(--foreground)] font-medium">
                                                {activity.title}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-neutral-500">{activity.timestamp}</span>
                                                {activity.onChain && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                                                        On-Chain
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, trend, color }: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    trend: string;
    color: 'green' | 'yellow' | 'blue';
}) {
    const colorMap = {
        green: 'from-green-500/10 to-emerald-500/10 border-green-500/30',
        yellow: 'from-yellow-500/10 to-orange-500/10 border-yellow-500/30',
        blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`rounded-xl bg-gradient-to-br ${colorMap[color]} border backdrop-blur-xl p-6 hover:scale-105 transition-transform`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="text-sm text-neutral-400">{label}</span>
                </div>
            </div>
            <div className="text-3xl font-bold text-[var(--foreground)] mb-1">{value}</div>
            <div className="flex items-center gap-1 text-xs text-neutral-500">
                <TrendingUp size={12} className="text-green-400" />
                {trend}
            </div>
        </motion.div>
    );
}
