'use client';

import { useProfile } from "@/hooks/useProfile";
import { ArrowLeft, User, History, Calendar, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { profile, history, saveProfile, isAuthenticated, address } = useProfile();
    const [activeTab, setActiveTab] = useState<'identity' | 'history'>('identity');
    const [formData, setFormData] = useState(profile);

    // Sync form data when profile loads
    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                    <p className="text-neutral-400 mb-6">Please connect your wallet to view this page.</p>
                    <Link href="/" className="text-neon-primary hover:underline">Return Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>

                <div className="flex items-center gap-6 mb-12">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-primary to-neon-secondary flex items-center justify-center text-2xl font-bold shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                        {address?.slice(0, 2)}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold mb-2">{profile.nickname || 'Anonymous User'}</h1>
                        <p className="text-neutral-400 font-mono">{address}</p>
                    </div>
                </div>

                <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                    <div className="flex border-b border-white/10">
                        <button
                            onClick={() => setActiveTab('identity')}
                            className={`flex-1 py-6 text-lg font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'identity' ? 'text-neon-primary border-b-2 border-neon-primary bg-white/5' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <User size={20} /> Identity
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 py-6 text-lg font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'history' ? 'text-neon-primary border-b-2 border-neon-primary bg-white/5' : 'text-neutral-400 hover:text-white'}`}
                        >
                            <History size={20} /> On-Chain History
                        </button>
                    </div>

                    <div className="p-8">
                        {activeTab === 'identity' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-xl mx-auto space-y-6"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm text-neutral-400">Nickname</label>
                                    <input
                                        type="text"
                                        value={formData.nickname}
                                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-neon-primary/50 transition-colors"
                                        placeholder="Enter your nickname"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-neutral-400">Job Title</label>
                                    <input
                                        type="text"
                                        value={formData.jobTitle}
                                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-neon-primary/50 transition-colors"
                                        placeholder="e.g. Web3 Developer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-neutral-400">Age</label>
                                    <input
                                        type="number"
                                        value={formData.age}
                                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-neon-primary/50 transition-colors"
                                        placeholder="Enter your age"
                                    />
                                </div>

                                <div className="pt-6">
                                    <button
                                        onClick={() => saveProfile(formData)}
                                        className="w-full bg-neon-primary hover:bg-neon-secondary text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                {history.length === 0 ? (
                                    <div className="text-center py-20 text-neutral-500">
                                        <History size={64} className="mx-auto mb-6 opacity-20" />
                                        <p className="text-xl">No sync history found.</p>
                                        <p className="text-sm mt-2">Sync your "Done" tasks from the dashboard to see them here.</p>
                                    </div>
                                ) : (
                                    history.sort((a, b) => b.timestamp - a.timestamp).map((item, index) => (
                                        <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3 text-neon-secondary">
                                                    <Calendar size={18} />
                                                    <span className="text-lg font-medium">{item.date}</span>
                                                </div>
                                                <span className="text-sm text-neutral-500 font-mono">
                                                    {new Date(item.timestamp).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className="space-y-3 pl-2 border-l-2 border-white/10">
                                                {item.tasks.map((task, i) => (
                                                    <div key={i} className="flex items-start gap-3 text-neutral-300">
                                                        <CheckCircle2 size={18} className="mt-0.5 text-green-500 shrink-0" />
                                                        <span className="text-lg">{task}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
