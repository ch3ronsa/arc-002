'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    BookOpen, Wallet, Square, Lock, Trophy, Zap, Shield,
    CheckCircle2, AlertCircle, ChevronRight, Code, FileText,
    Users, Calendar, Tag, Link as LinkIcon, ArrowLeft
} from 'lucide-react';

interface Section {
    id: string;
    title: string;
    icon: React.ReactNode;
}

const sections: Section[] = [
    { id: 'quick-start', title: 'Quick Start Guide', icon: <Zap size={16} /> },
    { id: 'task-system', title: 'Task System', icon: <Square size={16} /> },
    { id: 'profile-stats', title: 'Profile & Stats', icon: <Trophy size={16} /> },
    { id: 'encryption', title: 'Privacy & Encryption', icon: <Lock size={16} /> },
    { id: 'faq', title: 'FAQ & Troubleshooting', icon: <AlertCircle size={16} /> },
];

export function DocumentationView() {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState('quick-start');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100;

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full h-full flex bg-[var(--background)]">
            {/* Sidebar - Table of Contents */}
            <aside className="w-64 border-r border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-xl overflow-y-auto sticky top-0 h-screen hidden lg:block">
                <div className="p-6 space-y-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-sm text-neutral-400 hover:text-[var(--foreground)] transition-colors mb-2"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="text-purple-400" size={20} />
                            <h2 className="font-bold text-[var(--foreground)]">Documentation</h2>
                        </div>
                        <p className="text-xs text-neutral-500">Complete guide to using ArcOS</p>
                    </div>

                    <nav className="space-y-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${activeSection === section.id
                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                    : 'text-neutral-400 hover:bg-white/5 hover:text-neutral-300'
                                    }`}
                            >
                                {section.icon}
                                {section.title}
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-6 lg:p-12 space-y-16">
                    {/* Mobile Back Button */}
                    <div className="lg:hidden mb-8">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-[var(--foreground)] transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    </div>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4 mb-12"
                    >
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            ArcOS Documentation
                        </h1>
                        <p className="text-xl text-neutral-400">
                            Your complete guide to mastering productivity on Arc Network
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-neutral-500">
                            <Shield size={14} />
                            <span>Version 0.4.0</span>
                            <span>•</span>
                            <span>Last Updated: December 3, 2024</span>
                        </div>
                    </motion.div>

                    {/* Quick Start Guide */}
                    <Section id="quick-start" title="Quick Start Guide" icon={<Zap className="text-purple-400" />}>
                        <Step number={1} title="Connect Your Wallet">
                            <p className="text-neutral-300 mb-4">
                                ArcOS runs on Arc Network. You'll need a Web3 wallet to get started.
                            </p>
                            <div className="p-4 rounded-xl bg-black/20 border border-purple-500/20">
                                <ol className="space-y-2 text-sm text-neutral-300">
                                    <li className="flex items-start gap-2">
                                        <ChevronRight size={16} className="text-purple-400 mt-0.5" />
                                        Click the <code className="px-2 py-1 rounded bg-purple-500/10 text-purple-400">Connect Wallet</code> button in the top right
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <ChevronRight size={16} className="text-purple-400 mt-0.5" />
                                        Select your preferred wallet (MetaMask, WalletConnect, etc.)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <ChevronRight size={16} className="text-purple-400 mt-0.5" />
                                        Approve the connection and switch to <strong>Arc Testnet</strong> (Chain ID: 5042002)
                                    </li>
                                </ol>
                            </div>
                            <Alert type="info" className="mt-4">
                                Don't have Arc Network in your wallet? It will automatically prompt you to add it!
                            </Alert>
                        </Step>

                        <Step number={2} title="Create Your First Task">
                            <p className="text-neutral-300 mb-4">
                                Start organizing with the Kanban board.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard
                                    icon={<Square className="text-blue-400" />}
                                    title="Add a Task"
                                    description="Click the + button at the top of any column to create a new task card"
                                />
                                <InfoCard
                                    icon={<FileText className="text-green-400" />}
                                    title="Add Details"
                                    description="Fill in title, description, tags, and due date"
                                />
                            </div>
                        </Step>

                        <Step number={3} title="Organize Your Board">
                            <p className="text-neutral-300 mb-4">
                                Drag tasks between columns to track progress:
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <ColumnBadge color="neutral" label="To Do" />
                                <ColumnBadge color="blue" label="In Progress" />
                                <ColumnBadge color="yellow" label="Review" />
                                <ColumnBadge color="green" label="Done" />
                            </div>
                        </Step>
                    </Section>

                    {/* Task System */}
                    <Section id="task-system" title="Task System" icon={<Square className="text-blue-400" />}>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">Kanban Board</h3>
                                <p className="text-neutral-300 mb-4">
                                    Our visual board helps you track work across different stages.
                                </p>
                                <div className="space-y-4">
                                    <Feature
                                        icon={<Square className="text-purple-400" />}
                                        title="Drag & Drop"
                                        description="Move tasks between columns by dragging and dropping"
                                    />
                                    <Feature
                                        icon={<Tag className="text-yellow-400" />}
                                        title="Tags & Labels"
                                        description="Organize tasks with custom colored tags"
                                    />
                                    <Feature
                                        icon={<Calendar className="text-blue-400" />}
                                        title="Due Dates"
                                        description="Set deadlines and track overdue tasks"
                                    />
                                    <Feature
                                        icon={<Shield className="text-green-400" />}
                                        title="Archive to Chain"
                                        description="Completed tasks can be archived to Arc Network blockchain"
                                    />
                                </div>
                            </div>

                            <Alert type="success">
                                <strong>Pro Tip:</strong> Archive completed tasks to earn XP and create an immutable record on-chain!
                            </Alert>
                        </div>
                    </Section>

                    {/* Profile & Stats */}
                    <Section id="profile-stats" title="Profile & On-Chain Stats" icon={<Trophy className="text-yellow-400" />}>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">Your Profile</h3>
                                <p className="text-neutral-300 mb-4">
                                    Track your productivity and achievements in your personal profile.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoCard
                                    icon={<Zap className="text-purple-400" />}
                                    title="XP & Levels"
                                    description="Earn XP by completing tasks and level up"
                                />
                                <InfoCard
                                    icon={<Trophy className="text-yellow-400" />}
                                    title="Achievements"
                                    description="Unlock badges for milestones"
                                />
                                <InfoCard
                                    icon={<Shield className="text-blue-400" />}
                                    title="On-Chain Stats"
                                    description="View your blockchain activity"
                                />
                                <InfoCard
                                    icon={<FileText className="text-green-400" />}
                                    title="Activity Timeline"
                                    description="See your recent actions"
                                />
                            </div>

                            <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                                <h4 className="font-semibold text-yellow-400 mb-2">Sync On-Chain Data</h4>
                                <p className="text-sm text-neutral-300">
                                    Click the "Sync On-Chain Data" button to refresh your stats from the blockchain.
                                    This fetches your latest task archives, document anchors, and password records.
                                </p>
                            </div>
                        </div>
                    </Section>

                    {/* Privacy & Encryption */}
                    <Section id="encryption" title="Privacy & Encryption" icon={<Lock className="text-orange-400" />}>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">Encrypted Notes</h3>
                                <p className="text-neutral-300 mb-4">
                                    Keep your sensitive information secure with client-side encryption.
                                </p>
                            </div>

                            <Step number={1} title="Set Up Password">
                                <p className="text-neutral-300 mb-3">
                                    First time? Navigate to <strong>Encrypted Notes</strong> in the sidebar:
                                </p>
                                <ol className="space-y-2 text-sm text-neutral-300 ml-4">
                                    <li>• Enter a strong password (min 8 characters)</li>
                                    <li>• Confirm your password</li>
                                    <li>• Click "Set Password" and approve the blockchain transaction</li>
                                    <li>• Your password hash is now stored on-chain</li>
                                </ol>
                                <Alert type="warning" className="mt-4">
                                    <strong>Important:</strong> Your password cannot be recovered. Store it safely!
                                </Alert>
                            </Step>

                            <Step number={2} title="Create Encrypted Notes">
                                <p className="text-neutral-300 mb-3">
                                    After setting up, you can create encrypted notes:
                                </p>
                                <div className="space-y-3">
                                    <Feature
                                        icon={<Lock className="text-purple-400" />}
                                        title="Client-Side Encryption"
                                        description="All encryption happens in your browser using AES-GCM"
                                    />
                                    <Feature
                                        icon={<Shield className="text-blue-400" />}
                                        title="Anchor to Chain"
                                        description="Store document hashes on-chain for proof of existence"
                                    />
                                </div>
                            </Step>

                            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
                                <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                                    <Code size={16} />
                                    How It Works
                                </h4>
                                <ul className="space-y-1 text-sm text-neutral-300">
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400">•</span>
                                        Password hashed with SHA-256 → Stored on Arc Network
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400">•</span>
                                        Content encrypted with AES-GCM → Stored in Supabase
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400">•</span>
                                        Only you can decrypt with your password
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Section>

                    {/* FAQ */}
                    <Section id="faq" title="FAQ & Troubleshooting" icon={<AlertCircle className="text-red-400" />}>
                        <div className="space-y-4">
                            <FaqItem
                                question="Why do I need to connect a wallet?"
                                answer="ArcOS uses blockchain technology to create immutable records of your work. Your wallet authenticates you and allows interaction with Arc Network smart contracts."
                            />
                            <FaqItem
                                question="What is Arc Network?"
                                answer="Arc Network is an EVM-compatible blockchain. We use it to store task archives, password hashes, and document anchors in a secure, decentralized way."
                            />
                            <FaqItem
                                question="Are there any fees?"
                                answer="Arc Testnet transactions are free! When we move to mainnet, minimal gas fees will apply for on-chain actions like archiving tasks or setting passwords."
                            />
                            <FaqItem
                                question="I forgot my encrypted notes password. What do I do?"
                                answer="Unfortunately, passwords cannot be recovered due to the cryptographic design. Always store your password securely. You'll need to set a new password (requires a new blockchain transaction)."
                            />
                            <FaqItem
                                question="My transactions are failing. Help!"
                                answer={
                                    <div className="space-y-2">
                                        <p>Try these steps:</p>
                                        <ol className="list-decimal ml-5 space-y-1">
                                            <li>Check you're on Arc Testnet (Chain ID: 5042002)</li>
                                            <li>Ensure you have enough test USDC for gas</li>
                                            <li>Refresh the page and try again</li>
                                            <li>Check the browser console (F12) for errors</li>
                                        </ol>
                                    </div>
                                }
                            />
                            <FaqItem
                                question="How do I get test USDC for Arc Testnet?"
                                answer="Visit the Arc Network faucet at arcscan.app to get free test tokens."
                            />
                        </div>
                    </Section>
                </div>
            </main>
        </div>
    );
}

function Section({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="scroll-mt-20"
        >
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border-color)]">
                {icon}
                <h2 className="text-3xl font-bold text-[var(--foreground)]">{title}</h2>
            </div>
            <div className="space-y-8">
                {children}
            </div>
        </motion.section>
    );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
    return (
        <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {number}
            </div>
            <div className="flex-1">
                <h4 className="text-lg font-semibold text-[var(--foreground)] mb-3">{title}</h4>
                {children}
            </div>
        </div>
    );
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-4 rounded-xl bg-black/20 border border-neutral-800 hover:border-neutral-700 transition-all">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">{icon}</div>
                <div>
                    <h5 className="font-semibold text-[var(--foreground)] mb-1">{title}</h5>
                    <p className="text-sm text-neutral-400">{description}</p>
                </div>
            </div>
        </div>
    );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-black/20">
            <div className="flex-shrink-0">{icon}</div>
            <div>
                <h5 className="font-medium text-[var(--foreground)] mb-1">{title}</h5>
                <p className="text-sm text-neutral-400">{description}</p>
            </div>
        </div>
    );
}

function ColumnBadge({ color, label }: { color: 'neutral' | 'blue' | 'yellow' | 'green'; label: string }) {
    const colors = {
        neutral: 'bg-neutral-500/20 text-neutral-300',
        blue: 'bg-blue-500/20 text-blue-300',
        yellow: 'bg-yellow-500/20 text-yellow-300',
        green: 'bg-green-500/20 text-green-300'
    };

    return (
        <div className={`px-4 py-2 rounded-lg text-center text-sm font-medium ${colors[color]}`}>
            {label}
        </div>
    );
}

function Alert({ type, children, className = '' }: { type: 'info' | 'success' | 'warning'; children: React.ReactNode; className?: string }) {
    const config = {
        info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-300', icon: AlertCircle },
        success: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-300', icon: CheckCircle2 },
        warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-300', icon: AlertCircle }
    };

    const { bg, border, text, icon: Icon } = config[type];

    return (
        <div className={`p-4 rounded-xl ${bg} border ${border} ${className}`}>
            <div className="flex items-start gap-3">
                <Icon size={18} className={`${text} flex-shrink-0 mt-0.5`} />
                <div className={`text-sm ${text}`}>{children}</div>
            </div>
        </div>
    );
}

function FaqItem({ question, answer }: { question: string; answer: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-neutral-800 rounded-xl overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-all"
            >
                <span className="font-medium text-[var(--foreground)]">{question}</span>
                <ChevronRight size={18} className={`text-neutral-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 pt-0 text-sm text-neutral-300">
                    {answer}
                </div>
            )}
        </div>
    );
}
