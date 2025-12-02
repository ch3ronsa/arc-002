'use client';

import { useState } from 'react';
import { Lock, Shield, Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { toast } from 'sonner';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ARC_JOURNAL_ADDRESS = "0xeB282dF68897C6245526e9BFD88e82eF5BcbD5c2";
const ARC_JOURNAL_ABI = [
    "function setPasswordHash(bytes32 _passwordHash) external",
    "event PasswordSet(address indexed user, uint256 timestamp)"
];

interface SetPasswordScreenProps {
    onPasswordSet: (password: string) => void;
}

export function SetPasswordScreen({ onPasswordSet }: SetPasswordScreenProps) {
    const { address } = useAccount();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data: hash, writeContractAsync, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const passwordsMatch = password === confirmPassword && password.length > 0;
    const isStrong = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    const canSubmit = passwordsMatch && isStrong;

    const handleSetPassword = async () => {
        console.log('🔍 handleSetPassword called');
        console.log('canSubmit:', canSubmit);
        console.log('address:', address);

        if (!address) {
            toast.error('Please connect your wallet first');
            return;
        }

        if (!canSubmit) {
            toast.error('Please check password requirements');
            return;
        }

        try {
            // Create SHA-256 hash of password
            console.log('📝 Creating password hash...');
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            console.log('✅ Password hash created:', hashHex);

            console.log('📡 Calling writeContractAsync...');
            const promise = writeContractAsync({
                address: ARC_JOURNAL_ADDRESS,
                abi: ARC_JOURNAL_ABI,
                functionName: 'setPasswordHash',
                args: [hashHex],
                chainId: 5042002,
            });

            toast.promise(promise, {
                loading: 'Setting password on-chain...',
                success: () => {
                    console.log('✅ Password set successfully!');
                    onPasswordSet(password);
                    return 'Password set successfully!';
                },
                error: (err) => {
                    console.error('❌ Transaction error:', err);
                    return `Failed to set password: ${err.shortMessage || err.message || 'Unknown error'}`;
                },
            });

            await promise;
        } catch (error: any) {
            console.error("❌ Password setup failed:", error);
            toast.error(error.shortMessage || error.message || 'Transaction failed');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md p-8 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl shadow-2xl">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Shield className="text-white" size={40} />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-2">
                    Set Your Password
                </h2>
                <p className="text-center text-neutral-400 text-sm mb-2">
                    Create a secure password to encrypt your notes. This will be registered on-chain.
                </p>
                {!address && (
                    <p className="text-center text-red-400 text-xs mb-6">
                        ⚠️ Please connect your wallet first
                    </p>
                )}
                {address && (
                    <p className="text-center text-green-400 text-xs mb-6">
                        ✅ Wallet connected: {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                )}

                {/* Password Input */}
                <div className="space-y-4 mb-6">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-black/20 border border-[var(--border-color)] rounded-xl text-[var(--foreground)] placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[var(--foreground)] transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-black/20 border border-[var(--border-color)] rounded-xl text-[var(--foreground)] placeholder:text-neutral-600 focus:outline-none focus:border-purple-500/50 pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-[var(--foreground)] transition-colors"
                        >
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Password Strength Indicators */}
                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                        {isStrong ? (
                            <CheckCircle2 size={16} className="text-green-400" />
                        ) : (
                            <XCircle size={16} className="text-neutral-600" />
                        )}
                        <span className={isStrong ? "text-green-400" : "text-neutral-500"}>
                            At least 8 characters
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        {passwordsMatch ? (
                            <CheckCircle2 size={16} className="text-green-400" />
                        ) : (
                            <XCircle size={16} className="text-neutral-600" />
                        )}
                        <span className={passwordsMatch ? "text-green-400" : "text-neutral-500"}>
                            Passwords match
                        </span>
                    </div>
                </div>

                {/* Warning */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                    <p className="text-xs text-red-400 text-center">
                        <strong>Warning:</strong> If you lose your password, your encrypted notes cannot be recovered.
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSetPassword}
                    disabled={!canSubmit || isPending || isConfirming}
                    className={twMerge(
                        "w-full px-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2",
                        canSubmit && !isPending && !isConfirming
                            ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                            : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    )}
                >
                    {isPending || isConfirming ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Setting password...
                        </>
                    ) : (
                        <>
                            <Lock size={18} />
                            Set Password
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
