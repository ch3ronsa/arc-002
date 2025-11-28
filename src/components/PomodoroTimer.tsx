'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function PomodoroTimer() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Optional: Play sound here
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
            <span className={`font-mono font-bold text-sm ${isActive ? 'text-neon-primary neon-text' : 'text-neutral-400'}`}>
                {formatTime(timeLeft)}
            </span>

            <button
                onClick={toggleTimer}
                className="text-neutral-400 hover:text-white transition-colors p-1"
            >
                {isActive ? <Pause size={14} /> : <Play size={14} />}
            </button>

            <button
                onClick={resetTimer}
                className="text-neutral-400 hover:text-white transition-colors p-1"
            >
                <RotateCcw size={14} />
            </button>
        </div>
    );
}
