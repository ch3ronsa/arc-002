'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'nebula' | 'zen' | 'party';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('nebula');

    useEffect(() => {
        // Remove old theme classes
        document.body.classList.remove('theme-nebula', 'theme-zen', 'theme-party');
        // Add new theme class
        document.body.classList.add(`theme-${theme}`);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
