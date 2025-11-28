'use client';

import { Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FocusExitButtonProps {
    show: boolean;
    onExit: () => void;
}

export function FocusExitButton({ show, onExit }: FocusExitButtonProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={onExit}
                    className="fixed top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white rounded-full backdrop-blur-md border border-white/10 shadow-lg transition-colors group"
                    title="Exit Focus Mode (F)"
                >
                    <Minimize2 size={20} className="group-hover:scale-110 transition-transform" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
