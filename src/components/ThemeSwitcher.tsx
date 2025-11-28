'use client';

import { useTheme } from "@/providers/ThemeProvider";
import { Palette, Moon, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { id: 'nebula', name: 'Nebula', icon: Sparkles, color: 'text-neon-primary' },
        { id: 'zen', name: 'Zen', icon: Moon, color: 'text-neutral-400' },
        { id: 'party', name: 'Party', icon: Palette, color: 'text-pink-500' },
    ] as const;

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-neutral-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
                title="Change Theme"
            >
                <Palette size={18} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-full mt-2 w-32 glass-panel rounded-xl border border-white/10 overflow-hidden z-50 flex flex-col shadow-xl"
                        >
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setTheme(t.id);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-center gap-2 px-3 py-2 text-sm hover:bg-white/10 transition-colors ${theme === t.id ? 'bg-white/5 text-white' : 'text-neutral-400'}`}
                                >
                                    <t.icon size={14} className={t.color} />
                                    {t.name}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
