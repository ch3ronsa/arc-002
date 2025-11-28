import { useState, useEffect } from 'react';
import { Task } from '@/types';

const MOCK_TASKS: Task[] = [
    {
        id: '1',
        columnId: 'backlog',
        content: 'Research DAO Governance Models',
        tags: ['Research'],
        dueDate: '2025-12-05',
    },
    {
        id: '2',
        columnId: 'bounty',
        content: 'Implement Smart Contract Escrow',
        bounty: '1.5 ETH',
        tags: ['Dev', 'High Priority'],
        dueDate: '2025-12-10',
    },
    {
        id: '3',
        columnId: 'todo',
        content: 'Design Profile Page UI',
        assignee: 'Alex',
        tags: ['Design'],
        dueDate: '2025-12-02',
    },
    {
        id: '4',
        columnId: 'review',
        content: 'Audit Token Vesting Contract',
        bounty: '2.0 ETH',
        assignee: '0xSafe',
        dueDate: '2025-12-15',
    },
    {
        id: '5',
        columnId: 'done',
        content: 'Initial Project Setup',
        dueDate: '2025-11-20',
    },
    {
        id: '6',
        columnId: 'inprogress',
        content: 'Integrate IPFS Storage',
        tags: ['Dev'],
        assignee: 'Me',
        dueDate: '2025-12-08',
    },
    {
        id: '7',
        columnId: 'bounty',
        content: 'Create Marketing Assets',
        bounty: '0.2 ETH',
        dueDate: '2025-12-12',
    }
];

export function useTaskManager() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const saved = localStorage.getItem('arc-tasks');
        const legacy = localStorage.getItem('kanban-tasks');

        if (saved) {
            try {
                setTasks(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse tasks", e);
                setTasks(MOCK_TASKS);
            }
        } else if (legacy) {
            // Migration from previous version
            try {
                const legacyTasks = JSON.parse(legacy);
                // Ensure legacy tasks have new required fields if necessary, or just use them
                setTasks(legacyTasks);
                // Save to new key immediately to complete migration
                localStorage.setItem('arc-tasks', legacy);
            } catch (e) {
                console.error("Failed to parse legacy tasks", e);
                setTasks(MOCK_TASKS);
            }
        } else {
            setTasks(MOCK_TASKS);
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('arc-tasks', JSON.stringify(tasks));
        }
    }, [tasks, isMounted]);

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const createTask = (task: Task) => {
        setTasks(prev => [...prev, task]);
    };

    const addTasks = (newTasks: Task[]) => {
        setTasks(prev => [...prev, ...newTasks]);
    };

    const addTag = (id: string, tag: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id !== id) return t;
            const tags = t.tags || [];
            if (tags.includes(tag)) return t;
            return { ...t, tags: [...tags, tag] };
        }));
    };

    const moveTask = (activeIndex: number, overIndex: number) => {
        setTasks((items) => {
            const result = [...items];
            const [removed] = result.splice(activeIndex, 1);
            result.splice(overIndex, 0, removed);
            return result;
        });
    };

    return {
        tasks,
        setTasks,
        updateTask,
        deleteTask,
        createTask,
        addTasks,
        addTag,
        moveTask,
        isMounted
    };
}
