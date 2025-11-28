'use client';

import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiManagerProps {
    isActive: boolean;
    onComplete: () => void;
}

export function ConfettiManager({ isActive, onComplete }: ConfettiManagerProps) {
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        // Set initial size
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">
            <ReactConfetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={500}
                onConfettiComplete={onComplete}
                colors={['#00f3ff', '#bd00ff', '#0051ff', '#ffffff']}
            />
        </div>
    );
}
