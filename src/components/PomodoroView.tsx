'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export function PomodoroView() {
    const [duration, setDuration] = useState(25); // minutes
    const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
    const [isActive, setIsActive] = useState(false);
    const [isDurationPickerOpen, setIsDurationPickerOpen] = useState(false);
    const [focusReason, setFocusReason] = useState('');

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play completion sound
            // Play completion sound - Disabled due to missing assets
            // if (typeof window !== 'undefined') {
            //     const audio = new Audio('/sounds/whoosh.mp3');
            //     audio.play().catch(() => { });
            // }
            // Show notification
            toast.success("Time's up! Great job. 🎉", {
                description: focusReason ? `Completed goal: ${focusReason}` : "Take a break and refresh.",
                duration: 5000,
            });
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, timeLeft, focusReason]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(duration * 60);
    };

    const updateDuration = (newDuration: number) => {
        setDuration(newDuration);
        setTimeLeft(newDuration * 60);
        setIsActive(false);
        setIsDurationPickerOpen(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center h-full p-8 gap-12 relative max-w-6xl mx-auto">

            {/* Left Side: Timer */}
            <div className="flex flex-col items-center">
                <h1 className="text-5xl font-bold mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Focus Mode
                </h1>

                {/* Circular Progress */}
                <div className="relative mb-12">
                    <svg className="w-80 h-80 transform -rotate-90">
                        <circle
                            cx="160"
                            cy="160"
                            r="140"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                            fill="none"
                        />
                        <circle
                            cx="160"
                            cy="160"
                            r="140"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 140}`}
                            strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
                            strokeLinecap="round"
                            className="transition-all duration-1000"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`font-mono text-7xl font-bold ${isActive ? 'text-blue-400' : 'text-neutral-300'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 justify-center relative">
                    <button
                        onClick={resetTimer}
                        className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    >
                        <RotateCcw size={24} className="text-neutral-400" />
                    </button>

                    <button
                        onClick={toggleTimer}
                        className="p-6 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg shadow-purple-500/20"
                    >
                        {isActive ? <Pause size={32} className="text-white" /> : <Play size={32} className="text-white" />}
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setIsDurationPickerOpen(!isDurationPickerOpen)}
                            className="px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 min-w-[140px] justify-between"
                        >
                            <span className="text-neutral-300 font-medium">{duration} minutes</span>
                            <ChevronUp size={16} className={`text-neutral-500 transition-transform ${isDurationPickerOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                            {isDurationPickerOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full mb-2 left-0 w-full bg-[#1a1a1a] border border-white/10 rounded-xl p-2 shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar"
                                >
                                    <div className="flex flex-col gap-1">
                                        {[5, 10, 15, 20, 25, 30, 45, 60, 90].map((mins) => (
                                            <button
                                                key={mins}
                                                onClick={() => updateDuration(mins)}
                                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${duration === mins
                                                    ? 'bg-blue-500/20 text-blue-400'
                                                    : 'hover:bg-white/5 text-neutral-400 hover:text-neutral-200'
                                                    }`}
                                            >
                                                {mins} minutes
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Right Side: Focus Goal */}
            <div className="w-full max-w-md">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-2">Focus Goal</h3>
                    <p className="text-neutral-400 text-sm mb-6">
                        What are you using this time for? Writing down your goal helps you focus.
                    </p>

                    <div className="relative">
                        <textarea
                            value={focusReason}
                            onChange={(e) => setFocusReason(e.target.value)}
                            placeholder="Ex: Learn React hooks, Finish blog post..."
                            className="w-full h-40 bg-black/20 border border-white/10 rounded-xl p-4 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all resize-none"
                        />
                        {focusReason && (
                            <div className="absolute bottom-4 right-4">
                                <span className="text-xs text-green-400 flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Goal Set
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-sm text-neutral-500">
                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">1</div>
                            <span>Set duration</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-neutral-500">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">2</div>
                            <span>Write your goal</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-neutral-500">
                            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">3</div>
                            <span>Start and focus!</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
