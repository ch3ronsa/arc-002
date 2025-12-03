'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles, Bug, Wrench, Zap, Shield, Palette, ChevronDown,
    GitBranch, Bell, Calendar, Code2, Rocket
} from 'lucide-react';
import { toast } from 'sonner';

type ChangeType = 'feature' | 'improvement' | 'bugfix' | 'onchain' | 'ui';
type VersionType = 'major' | 'minor' | 'patch';

interface Change {
    type: ChangeType;
    description: string;
}

interface Release {
    version: string;
    date: string;
    versionType: VersionType;
    changes: Change[];
    highlights?: string[];
}

const releases: Release[] = [
    {
        version: 'v0.4.0',
        date: 'December 3, 2024',
        versionType: 'minor',
        highlights: ['User Profile System', 'On-Chain Stats', 'Achievement System'],
        changes: [
            { type: 'feature', description: 'Added comprehensive User Profile page with on-chain statistics' },
            { type: 'feature', description: 'Introduced Achievement system with 6 unique badges' },
            { type: 'feature', description: 'Implemented XP and leveling system' },
            { type: 'onchain', description: 'Integrated on-chain data synchronization for user stats' },
            { type: 'ui', description: 'Redesigned profile cards with glassmorphism effects' },
            { type: 'improvement', description: 'Enhanced activity timeline with real-time updates' },
        ]
    },
    {
        version: 'v0.3.2',
        date: 'December 2, 2024',
        versionType: 'patch',
        changes: [
            { type: 'bugfix', description: 'Fixed DashboardLayout import issues across all pages' },
            { type: 'bugfix', description: 'Resolved build errors in /focus route' },
            { type: 'improvement', description: 'Optimized component rendering performance' },
            { type: 'ui', description: 'Fixed responsive layout issues on mobile devices' },
        ]
    },
    {
        version: 'v0.3.0',
        date: 'December 1, 2024',
        versionType: 'minor',
        highlights: ['Encrypted Notes', 'Password Security', 'Document Anchoring'],
        changes: [
            { type: 'feature', description: 'Launched Encrypted Notes with on-chain password verification' },
            { type: 'feature', description: 'Added document anchoring to Arc Network blockchain' },
            { type: 'feature', description: 'Implemented client-side AES-GCM encryption' },
            { type: 'onchain', description: 'Deployed setPasswordHash and anchorDocument smart contract functions' },
            { type: 'onchain', description: 'Added hasPassword view function for password verification' },
            { type: 'ui', description: 'Created SetPasswordScreen with password strength indicators' },
            { type: 'ui', description: 'Designed LockScreen for password entry' },
            { type: 'improvement', description: 'Separated encrypted and regular notes into different routes' },
        ]
    },
    {
        version: 'v0.2.5',
        date: 'November 28, 2024',
        versionType: 'patch',
        changes: [
            { type: 'bugfix', description: 'Fixed Save button not showing success notification' },
            { type: 'bugfix', description: 'Corrected ABI format for Wagmi compatibility' },
            { type: 'improvement', description: 'Enhanced error handling for blockchain transactions' },
            { type: 'improvement', description: 'Added detailed logging for debugging' },
        ]
    },
    {
        version: 'v0.2.0',
        date: 'November 25, 2024',
        versionType: 'minor',
        highlights: ['Kanban Board', 'Notes System', 'Focus Mode'],
        changes: [
            { type: 'feature', description: 'Implemented drag-and-drop Kanban board' },
            { type: 'feature', description: 'Added rich-text notes with Tiptap editor' },
            { type: 'feature', description: 'Created Pomodoro timer for focus sessions' },
            { type: 'onchain', description: 'Integrated task archiving to Arc Network' },
            { type: 'ui', description: 'Designed ArcOS-themed dark interface' },
            { type: 'ui', description: 'Added theme switcher (Nebula, Zen, Party)' },
        ]
    },
    {
        version: 'v0.1.0',
        date: 'November 20, 2024',
        versionType: 'major',
        highlights: ['Initial Release', 'Arc Network Integration'],
        changes: [
            { type: 'feature', description: 'Project initialization with Next.js 14' },
            { type: 'feature', description: 'RainbowKit wallet integration' },
            { type: 'onchain', description: 'Deployed ArcJournal smart contract to Arc Testnet' },
            { type: 'ui', description: 'Created base layout and navigation' },
            { type: 'improvement', description: 'Set up Supabase database for user data' },
        ]
    }
];

const changeTypeConfig = {
    feature: { icon: Sparkles, label: 'New Feature', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    improvement: { icon: Wrench, label: 'Improvement', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    bugfix: { icon: Bug, label: 'Bug Fix', color: 'text-green-400', bg: 'bg-green-500/10' },
    onchain: { icon: Shield, label: 'On-Chain', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    ui: { icon: Palette, label: 'UI/UX', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
};

export function ChangelogView() {
    const [filter, setFilter] = useState<VersionType | 'all'>('all');
    const [showDeveloperLogs, setShowDeveloperLogs] = useState(false);

    const filteredReleases = filter === 'all'
        ? releases
        : releases.filter(r => r.versionType === filter);

    const handleSubscribe = () => {
        toast.success('Subscribed to updates!', {
            description: 'You\'ll be notified about new releases'
        });
    };

    return (
        <div className="w-full h-full overflow-y-auto bg-[var(--background)] p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                            <Rocket size={24} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            Release Notes
                        </h1>
                    </div>
                    <p className="text-neutral-400 text-lg">
                        Stay updated with the latest features, improvements, and on-chain integrations
                    </p>
                </motion.div>

                {/* Actions Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] backdrop-blur-xl"
                >
                    {/* Filters */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-500 mr-2">Filter:</span>
                        {(['all', 'major', 'minor', 'patch'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === type
                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                                    : 'bg-black/20 text-neutral-400 hover:bg-black/30'
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Developer Logs Toggle */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => setShowDeveloperLogs(!showDeveloperLogs)}
                    className="w-full p-4 rounded-xl bg-black/20 border border-neutral-800 hover:border-neutral-700 transition-all flex items-center justify-between group"
                >
                    <div className="flex items-center gap-3">
                        <Code2 size={20} className="text-green-400" />
                        <span className="text-neutral-300 font-medium">Developer Logs</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                            Technical Details
                        </span>
                    </div>
                    <ChevronDown
                        size={20}
                        className={`text-neutral-500 transition-transform ${showDeveloperLogs ? 'rotate-180' : ''}`}
                    />
                </motion.button>

                {showDeveloperLogs && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-6 rounded-xl bg-black/40 border border-green-500/20 font-mono text-xs space-y-2"
                    >
                        <div className="text-green-400">$ git log --oneline --graph</div>
                        <div className="text-neutral-500">* 4490eee (HEAD -&gt; main, origin/main) fix: restore DashboardLayout with proper structure</div>
                        <div className="text-neutral-500">* fba952e feat: restructure encrypted notes with password setup flow</div>
                        <div className="text-neutral-500">* b760cd3 feat: separate encrypted and regular notes pages</div>
                        <div className="text-neutral-500">* d7f29c6 fix: save button notification and anchor to chain transaction</div>
                        <div className="text-neutral-500">* 6749f4d fix: convert ABI to JSON format for Wagmi compatibility</div>
                        <div className="text-green-400 mt-4">$ npm list --depth=0</div>
                        <div className="text-neutral-500">├── next@16.0.4</div>
                        <div className="text-neutral-500">├── wagmi@2.14.3</div>
                        <div className="text-neutral-500">├── @rainbow-me/rainbowkit@2.2.2</div>
                        <div className="text-neutral-500">└── framer-motion@11.16.0</div>
                    </motion.div>
                )}

                {/* Releases Timeline */}
                <div className="space-y-6">
                    {filteredReleases.map((release, index) => (
                        <motion.div
                            key={release.version}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="relative"
                        >
                            {/* Timeline Line */}
                            {index !== filteredReleases.length - 1 && (
                                <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-purple-500/50 to-transparent" />
                            )}

                            <div className="flex gap-6">
                                {/* Version Badge */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/30 relative z-10">
                                        <GitBranch size={20} />
                                    </div>
                                </div>

                                {/* Release Card */}
                                <div className="flex-1 rounded-2xl bg-gradient-to-br from-[var(--card-bg)] to-transparent border border-[var(--border-color)] backdrop-blur-xl p-6 hover:border-purple-500/30 transition-all">
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-2xl font-bold text-[var(--foreground)]">
                                                    {release.version}
                                                </h2>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${release.versionType === 'major' ? 'bg-red-500/20 text-red-400' :
                                                    release.versionType === 'minor' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {release.versionType.toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                                                <Calendar size={14} />
                                                {release.date}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Highlights */}
                                    {release.highlights && (
                                        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Zap size={16} className="text-yellow-400" />
                                                <span className="text-sm font-semibold text-yellow-400">Highlights</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {release.highlights.map((highlight, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium"
                                                    >
                                                        {highlight}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Changes */}
                                    <div className="space-y-3">
                                        {Object.entries(
                                            release.changes.reduce((acc, change) => {
                                                if (!acc[change.type]) acc[change.type] = [];
                                                acc[change.type].push(change);
                                                return acc;
                                            }, {} as Record<ChangeType, Change[]>)
                                        ).map(([type, changes]) => {
                                            const config = changeTypeConfig[type as ChangeType];
                                            const Icon = config.icon;
                                            return (
                                                <div key={type} className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm font-semibold">
                                                        <Icon size={14} className={config.color} />
                                                        <span className={config.color}>{config.label}</span>
                                                    </div>
                                                    <ul className="space-y-1 ml-6">
                                                        {changes.map((change, i) => (
                                                            <li key={i} className="text-sm text-neutral-300 flex items-start gap-2">
                                                                <span className={`w-1.5 h-1.5 rounded-full ${config.bg} mt-2 flex-shrink-0`} />
                                                                {change.description}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-center pt-8 pb-4"
                >
                    <button className="px-6 py-3 rounded-xl bg-black/20 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-300 transition-all">
                        View Previous Releases
                    </button>
                    <p className="text-xs text-neutral-600 mt-4">
                        Built with ❤️ on Arc Network • Last updated: {releases[0].date}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
