import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { arrayMove } from "@dnd-kit/sortable";
import { supabase } from '@/lib/supabase';
import { useAccount } from 'wagmi';
import { toast } from 'sonner';

export function useTaskManager(workspaceId: string = '1') {
    const [tasks, setTasks] = useState<Task[]>([]);
    const { address } = useAccount();
    const [isLoading, setIsLoading] = useState(false);

    // Fetch tasks from Supabase
    useEffect(() => {
        if (!address) {
            setTasks([]);
            return;
        }

        const fetchTasks = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('tasks')
                .select('*')
                .eq('wallet_address', address)
                .eq('workspace_id', workspaceId);

            if (error) {
                console.error('Error fetching tasks:', error);
                // Don't show toast on initial load if empty, just log
            } else {
                const mappedTasks = data?.map(t => ({
                    id: t.id,
                    columnId: t.column_id,
                    content: t.content,
                    tags: t.tags || [],
                    dueDate: t.due_date,
                    assignee: t.assignee,
                    bounty: t.bounty
                })) || [];
                setTasks(mappedTasks);
            }
            setIsLoading(false);
        };

        fetchTasks();

        const channel = supabase
            .channel('tasks_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'tasks', filter: `wallet_address=eq.${address}` },
                (payload) => {
                    fetchTasks();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [address, workspaceId]);

    const createTask = async (task: Task) => {
        if (!address) {
            toast.error('Please connect your wallet');
            return;
        }

        // Ensure ID is a UUID
        const newTask = { ...task, id: crypto.randomUUID() };

        // Optimistic update
        setTasks(prev => [...prev, newTask]);

        const { error } = await supabase
            .from('tasks')
            .insert({
                id: newTask.id,
                wallet_address: address,
                workspace_id: workspaceId,
                content: newTask.content,
                column_id: newTask.columnId,
                tags: newTask.tags,
                due_date: newTask.dueDate,
                assignee: newTask.assignee,
                bounty: newTask.bounty
            });

        if (error) {
            console.error('Error creating task:', error);
            toast.error('Failed to create task');
            setTasks(prev => prev.filter(t => t.id !== newTask.id));
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        if (!address) return;

        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

        const dbUpdates: any = {};
        if (updates.content) dbUpdates.content = updates.content;
        if (updates.columnId) dbUpdates.column_id = updates.columnId;
        if (updates.tags) dbUpdates.tags = updates.tags;
        if (updates.dueDate) dbUpdates.due_date = updates.dueDate;
        if (updates.assignee) dbUpdates.assignee = updates.assignee;
        if (updates.bounty) dbUpdates.bounty = updates.bounty;

        const { error } = await supabase
            .from('tasks')
            .update(dbUpdates)
            .eq('id', id)
            .eq('wallet_address', address);

        if (error) {
            console.error('Error updating task:', error);
        }
    };

    const deleteTask = async (id: string) => {
        if (!address) return;

        setTasks(prev => prev.filter(t => t.id !== id));

        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', id)
            .eq('wallet_address', address);

        if (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        }
    };

    const addTasks = async (newTasks: Task[]) => {
        if (!address) return;

        // Ensure all have UUIDs
        const tasksWithUUIDs = newTasks.map(t => ({ ...t, id: crypto.randomUUID() }));

        setTasks(prev => [...prev, ...tasksWithUUIDs]);

        const dbTasks = tasksWithUUIDs.map(t => ({
            id: t.id,
            wallet_address: address,
            workspace_id: workspaceId,
            content: t.content,
            column_id: t.columnId,
            tags: t.tags,
            due_date: t.dueDate,
            assignee: t.assignee,
            bounty: t.bounty
        }));

        const { error } = await supabase
            .from('tasks')
            .insert(dbTasks);

        if (error) {
            console.error('Error adding tasks:', error);
            toast.error('Failed to add tasks');
        }
    };

    const addTag = (id: string, tag: string) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            const newTags = [...(task.tags || []), tag];
            updateTask(id, { tags: newTags });
        }
    };

    const moveTask = (activeId: string, overId: string) => {
        setTasks((items) => {
            const oldIndex = items.findIndex((item) => item.id === activeId);
            const newIndex = items.findIndex((item) => item.id === overId);
            return arrayMove(items, oldIndex, newIndex);
        });
    };

    return { tasks, setTasks, updateTask, deleteTask, createTask, addTasks, addTag, moveTask, isLoading };
}
