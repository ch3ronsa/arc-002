import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { arrayMove } from "@dnd-kit/sortable";

const MOCK_TASKS: Task[] = [
    { id: '1', columnId: 'todo', content: 'Research DAO Governance Models', tags: ['Research'], dueDate: '2025-12-05' },
    { id: '2', columnId: 'bounty', content: 'Implement Smart Contract Escrow', bounty: '1.5 ETH', tags: ['Dev', 'High Priority'], dueDate: '2025-12-10' },
    { id: '3', columnId: 'todo', content: 'Design Profile Page UI', assignee: 'Alex', tags: ['Design'], dueDate: '2025-12-02' },
    { id: '4', columnId: 'review', content: 'Audit Token Vesting Contract', bounty: '2.0 ETH', assignee: '0xSafe', dueDate: '2025-12-15' },
    { id: '5', columnId: 'done', content: 'Initial Project Setup', dueDate: '2025-11-20' },
    { id: '6', columnId: 'inprogress', content: 'Integrate IPFS Storage', tags: ['Dev'], assignee: 'Me', dueDate: '2025-12-08' },
    { id: '7', columnId: 'bounty', content: 'Create Marketing Assets', bounty: '0.2 ETH', dueDate: '2025-12-12' }
];

export function useTaskManager() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        let saved = localStorage.getItem('arcOS-tasks');
        if (!saved) {
            const oldSaved = localStorage.getItem('kanban-tasks') || localStorage.getItem('arc-tasks');
            if (oldSaved) {
                saved = oldSaved;
                localStorage.setItem('arcOS-tasks', oldSaved);
            }
        }
        if (saved) {
            try { setTasks(JSON.parse(saved)); } catch (error) { setTasks(MOCK_TASKS); }
        } else {
            setTasks(MOCK_TASKS);
        }
    }, []);

    useEffect(() => {
        if (isMounted && tasks.length > 0) {
            localStorage.setItem('arcOS-tasks', JSON.stringify(tasks));
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

    // FIX: Index yerine ID kullanarak taşıma işlemi
    const moveTask = (activeId: string, overId: string) => {
        setTasks((items) => {
            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === overId);
            return arrayMove(items, oldIndex, newIndex);
        });
    };

    return { tasks, setTasks, updateTask, deleteTask, createTask, addTasks, addTag, moveTask };
}
