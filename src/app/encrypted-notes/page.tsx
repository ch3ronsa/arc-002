'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useReadContract } from 'wagmi';
import { SetPasswordScreen } from '@/components/SetPasswordScreen';
import DashboardLayout from '@/components/DashboardLayout';

const ARC_JOURNAL_ADDRESS = "0xeB282dF68897C6245526e9BFD88e82eF5BcbD5c2";

export default function EncryptedNotesPage() {
    const router = useRouter();
    const { address } = useAccount();

    // Check if user has password set on-chain
    const { data: hasPasswordData, isLoading } = useReadContract({
        address: ARC_JOURNAL_ADDRESS,
        abi: ["function hasPassword(address _user) external view returns (bool)"],
        functionName: 'hasPassword',
        args: address ? [address] : undefined,
        chainId: 5042002,
    });

    const hasPassword = hasPasswordData as boolean;

    // If user has password, redirect to passworded route
    useEffect(() => {
        if (!isLoading && hasPassword) {
            router.push('/encrypted-notes/passworded');
        }
    }, [hasPassword, isLoading, router]);

    // Show SetPasswordScreen
    return (
        <DashboardLayout>
            <SetPasswordScreen
                onPasswordSet={(pwd) => {
                    // After password is set, redirect to passworded notes
                    router.push('/encrypted-notes/passworded');
                }}
            />
        </DashboardLayout>
    );
}
