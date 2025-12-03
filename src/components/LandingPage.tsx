'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Lock, CheckCircle, ArrowRight, Github, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';

export function LandingPage() {
    const { isConnected } = useAccount();

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-hidden">
            {/* Hero Section */}
            <div className="relative">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-grid-pattern opacity-20" />

                {/* Gradient Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl rounded-full" />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-32">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                                <Zap className="text-white" size={20} />
                            </div>
                            <h1 className="text-2xl font-bold">ArcOS</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/docs">
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/20 hover:bg-black/30 text-neutral-300 transition-all">
                                    <BookOpen size={16} />
                                    Docs
                                </button>
                            </Link>
                            <Link href="/myworkspace">
                                <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium transition-all shadow-lg shadow-purple-500/20">
                                    Launch App
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Hero Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-4xl mx-auto space-y-8"
                    >
                        <h1 className="text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
                            Productivity Meets Blockchain
                        </h1>
                        <p className="text-xl lg:text-2xl text-neutral-400 max-w-3xl mx-auto">
                            Manage tasks, protect notes, and track your productivity on Arc Network.
                            Your work, secured on-chain.
                        </p>
                        <div className="flex items-center justify-center gap-4 pt-4">
                            <Link href="/myworkspace">
                                <button className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg transition-all shadow-lg shadow-purple-500/30">
                                    Open Workspace
                                    <ArrowRight size={20} />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4">Built for Web3 Creators</h2>
                    <p className="text-xl text-neutral-400">Decentralized productivity tools for the modern workspace</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Zap className="text-purple-400" size={32} />}
                        title="Kanban Board"
                        description="Drag-and-drop task management with archive to blockchain capability"
                        delay={0.1}
                    />
                    <FeatureCard
                        icon={<Lock className="text-blue-400" size={32} />}
                        title="Encrypted Notes"
                        description="Client-side AES-GCM encryption with on-chain password verification"
                        delay={0.2}
                    />
                    <FeatureCard
                        icon={<Shield className="text-cyan-400" size={32} />}
                        title="On-Chain Archive"
                        description="Permanent task and document records stored on Arc Network"
                        delay={0.3}
                    />
                </div>
            </div>

            {/* How It Works */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-xl text-neutral-400">Get started in three simple steps</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StepCard
                        number="1"
                        title="Connect Wallet"
                        description="Connect your Web3 wallet to Arc Network testnet"
                        delay={0.1}
                    />
                    <StepCard
                        number="2"
                        title="Create & Organize"
                        description="Manage tasks, write notes, and track your productivity"
                        delay={0.2}
                    />
                    <StepCard
                        number="3"
                        title="Archive On-Chain"
                        description="Store immutable records of your work on the blockchain"
                        delay={0.3}
                    />
                </div>
            </div>

            {/* CTA Section */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/20 backdrop-blur-xl p-12 text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl opacity-50" />
                    <div className="relative">
                        <h2 className="text-4xl font-bold mb-4">Ready to Start?</h2>
                        <p className="text-xl text-neutral-400 mb-8">
                            Join the future of decentralized productivity
                        </p>
                        <Link href="/myworkspace">
                            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg transition-all shadow-lg shadow-purple-500/30">
                                Go to Workspace
                            </button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Footer */}
            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-12 border-t border-neutral-800">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-neutral-500">
                        Built with ❤️ on Arc Network
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/changelog">
                            <button className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors">
                                Release Notes
                            </button>
                        </Link>
                        <Link href="/docs">
                            <button className="text-sm text-neutral-400 hover:text-neutral-300 transition-colors">
                                Documentation
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description, delay }: {
    icon: React.ReactNode;
    title: string;
    description: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="p-8 rounded-2xl bg-gradient-to-br from-[var(--card-bg)] to-transparent border border-[var(--border-color)] backdrop-blur-xl hover:border-purple-500/30 transition-all"
        >
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-neutral-400">{description}</p>
        </motion.div>
    );
}

function StepCard({ number, title, description, delay }: {
    number: string;
    title: string;
    description: string;
    delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="text-center"
        >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-purple-500/30">
                {number}
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-neutral-400">{description}</p>
        </motion.div>
    );
}
