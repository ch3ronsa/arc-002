'use client';

import { useState } from 'react';
import { Lock, Unlock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface LockScreenProps {
    onUnlock: (password: string) => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) return;

        setIsLoading(true);
        // Simulate a small delay for better UX or actual verification if needed
        setTimeout(() => {
            onUnlock(password);
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--background)]/80 backdrop-blur-md transition-all duration-500">
            <div className="w-full max-w-md p-8 rounded-2xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6">
                    <Lock size={32} className="text-purple-400" />
                </div>

                <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Encrypted Notes</h2>
                <p className="text-neutral-500 mb-8">Enter your password to decrypt and access your private notes.</p>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password..."
                            className="w-full px-4 py-3 bg-black/20 border border-[var(--border-color)] rounded-xl text-[var(--foreground)] placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!password || isLoading}
                        className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                    >
                        {isLoading ? (
                            <span className="animate-pulse">Unlocking...</span>
                        ) : (
                            <>
                                Unlock Notes <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-6 text-xs text-neutral-500">
                    <span className="text-red-400/80">Warning:</span> If you lose your password, your encrypted notes cannot be recovered.
                </p>
            </div>
        </div>
    );
}
