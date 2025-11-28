'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface UserProfile {
    nickname: string;
    jobTitle: string;
    age: string;
}

export interface HistoryItem {
    date: string;
    timestamp: number;
    tasks: string[];
}

export function useProfile() {
    const { address } = useAccount();
    const [profile, setProfile] = useState<UserProfile>({ nickname: '', jobTitle: '', age: '' });
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        if (address) {
            const savedProfile = localStorage.getItem(`profile_${address}`);
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
            } else {
                setProfile({ nickname: '', jobTitle: '', age: '' });
            }

            const savedHistory = localStorage.getItem(`history_${address}`);
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            } else {
                setHistory([]);
            }
        } else {
            setProfile({ nickname: '', jobTitle: '', age: '' });
            setHistory([]);
        }
    }, [address]);

    const saveProfile = (newProfile: UserProfile) => {
        if (!address) return;
        setProfile(newProfile);
        localStorage.setItem(`profile_${address}`, JSON.stringify(newProfile));
    };

    const addHistoryItem = (tasks: string[]) => {
        if (!address) return;
        const newItem: HistoryItem = {
            date: new Date().toLocaleDateString(),
            timestamp: Date.now(),
            tasks
        };
        const newHistory = [...history, newItem];
        setHistory(newHistory);
        localStorage.setItem(`history_${address}`, JSON.stringify(newHistory));
    };

    return {
        profile,
        history,
        saveProfile,
        addHistoryItem,
        isAuthenticated: !!address,
        address
    };
}
