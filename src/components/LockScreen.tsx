'use client';

import { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useAccount, useReadContract } from 'wagmi';
import { toast } from 'sonner';

const ARC_JOURNAL_ADDRESS = "0xeB282dF68897C6245526e9BFD88e82eF5BcbD5c2";

interface LockScreenProps {
    onUnlock: (password: string) => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
    const { address } = useAccount();
    const [password, setPassword] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);

    // Fetch on-chain password hash
    const { data: onChainHash } = useReadContract({
        address: ARC_JOURNAL_ADDRESS,
        abi: ["function userPasswordHashes(address) view returns (bytes32)"],
        functionName: 'userPasswordHashes',
        args: address ? [address] : undefined,
        chainId: 5042002,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password || !address || !onChainHash) return;

        setIsVerifying(true);

        try {
            // Create SHA-256 hash of entered password
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // Compare with on-chain hash
            if (hashHex.toLowerCase() === (onChainHash as string).toLowerCase()) {
                onUnlock(password);
            } else {
                toast.error('Incorrect password');
                setPassword('');
            }
        } catch (error) {
            console.error('Password verification failed:', error);
            toast.error('Verification failed');
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md p-8 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl shadow-2xl">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Lock className="text-white" size={40} />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-2">
                    Encrypted Notes
                </h2>
                <p className="text-center text-neutral-400 text-sm mb-8">
                    Enter your password to decrypt and access your private notes.
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Enter password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 mb-6 bg-black/20 border border-[var(--border-color)] rounded-xl text-[var(--foreground)] placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50"
                        disabled={isVerifying}
                    />

                    <button
                        type="submit"
                        disabled={!password || isVerifying}
                        className="w-full px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                        {isVerifying ? (
                            'Verifying...'
                        ) : (
                            <>
                                Unlock Notes
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                {/* Warning */}
                <p className="text-xs text-red-400 text-center mt-6">
                    <strong>Warning:</strong> If you lose your password, your encrypted notes cannot be recovered.
                </p>
            </div>
        </div>
    );
}
