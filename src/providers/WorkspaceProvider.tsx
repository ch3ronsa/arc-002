'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Workspace {
    id: string;
    name: string;
}

interface WorkspaceContextType {
    activeWorkspace: Workspace;
    setActiveWorkspace: (workspace: Workspace) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
    const [activeWorkspace, setActiveWorkspace] = useState<Workspace>({ id: '1', name: 'My Workspace' });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('arc-active-workspace');
        if (saved) {
            try {
                setActiveWorkspace(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load active workspace', e);
            }
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('arc-active-workspace', JSON.stringify(activeWorkspace));
        }
    }, [activeWorkspace, mounted]);

    return (
        <WorkspaceContext.Provider value={{ activeWorkspace, setActiveWorkspace }}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
}
