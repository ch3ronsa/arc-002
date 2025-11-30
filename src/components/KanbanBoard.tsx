'use client';

import { useMemo, useState, useEffect } from "react";
import { Column } from "./Column";
import { Task, TaskId } from "@/types";
import { Search, Download, Upload, Maximize2, Minimize2, Plus } from "lucide-react";
import { ConfettiManager } from "./ConfettiManager";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { FocusExitButton } from "./FocusExitButton";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";
import useSound from "use-sound";
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { TaskCard } from "./TaskCard";

import { useAccount, useWriteContract } from "wagmi";
import { toast } from "sonner";

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // BURAYA GERÇEK KONTRAT ADRESİNİ YAZ
const TASK_JOURNAL_ABI = [
    {
        inputs: [{ internalType: "string[]", name: "taskTitles", type: "string[]" }],
        name: "logTasks",
    }
];

const defaultCols = [
    {
        id: "bounty",
        title: "Bounty Board",
    },
    {
        id: "todo",
        title: "To Do",
    },
    {
        id: "inprogress",
        title: "In Progress",
    },
    {
        id: "review",
        title: "Community Review",
    },
    {
        id: "done",
        title: "Done",
    },
];

const defaultTasks: Task[] = [
    {
        id: "1",
        columnId: "todo",
        content: "Research DAO Governance Models",
        tags: ["Research"],
    },
    {
        id: "2",
        columnId: "bounty",
        content: "Implement Smart Contract Escrow",
        bounty: "1.5 ETH",
        tags: ["Dev", "High Priority"],
    },
    {
        id: "3",
        columnId: "todo",
        content: "Design Profile Page UI",
        assignee: "Alex",
        tags: ["Design"],
    },
    {
        id: "4",
        columnId: "review",
        content: "Audit Token Vesting Contract",
        bounty: "2.0 ETH",
        assignee: "0xSafe",
    },
    {
        id: "5",
        columnId: "done",
        content: "Initial Project Setup",
    },
];

interface KanbanBoardProps {
    tasks: Task[];
    updateTask: (id: TaskId, updates: Partial<Task>) => void;
    deleteTask: (id: TaskId) => void;
    createTask: (task: Task) => void;
    addTag: (id: TaskId, tag: string) => void;
    moveTask: (activeId: string, overId: string) => void;
    setTasks: (tasks: Task[]) => void;
}

export function KanbanBoard({ tasks, updateTask, deleteTask, createTask, addTag, moveTask, setTasks }: KanbanBoardProps) {
    const [columns] = useState(defaultCols);
    // const [tasks, setTasks] = useState<Task[]>([]); // Lifted up
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showConfetti, setShowConfetti] = useState(false);
    const [focusMode, setFocusMode] = useState(false);

    const { profile, addHistoryItem } = useProfile();
    const { isConnected, address } = useAccount();
    const { writeContractAsync } = useWriteContract();

    const [playClick] = useSound('/sounds/click.mp3', { volume: 0.5 });
    const [playPop] = useSound('/sounds/pop.mp3', { volume: 0.5 });
    const [playWhoosh] = useSound('/sounds/whoosh.mp3', { volume: 0.5 });

    // Load from local storage on mount - HANDLED IN HOOK NOW
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Save to local storage whenever tasks change - HANDLED IN HOOK NOW

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Focus Mode (F)
            if (e.key.toLowerCase() === 'f' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                setFocusMode(prev => !prev);
            }
            // Quick Add (Cmd+K) - Focuses the first column's input if available
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                const firstInput = document.querySelector('input[placeholder="+ Add a task"]') as HTMLInputElement;
                if (firstInput) firstInput.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "kanban_backup.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast.success("Board data exported!");
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedTasks = JSON.parse(event.target?.result as string);
                    if (Array.isArray(importedTasks)) {
                        setTasks(importedTasks);
                        toast.success("Board data imported!");
                    } else {
                        toast.error("Invalid JSON format");
                    }
                } catch (err) {
                    toast.error("Failed to parse JSON");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // 3px distance before drag starts
            },
        })
    );

    function handleCreateTask(content: string) {
        const newTask: Task = {
            id: generateId(),
            columnId: "todo",
            content,
            dueDate: new Date().toISOString(),
        };
        createTask(newTask);
    }

    // function deleteTask(id: TaskId) ... passed as prop
    // function updateTask(id: TaskId, updates: Partial<Task>) ... passed as prop
    // function addTag(id: TaskId, tag: string) ... passed as prop

    const filteredTasks = useMemo(() => {
        if (!searchQuery) return tasks;
        return tasks.filter(task =>
            task.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [tasks, searchQuery]);

    const progress = useMemo(() => {
        const total = tasks.length;
        const done = tasks.filter(t => t.columnId === 'done').length;
        return total === 0 ? 0 : Math.round((done / total) * 100);
    }, [tasks]);

    function onDragStart(event: DragStartEvent) {
        playClick();
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        // Dropping task over another task
        if (isActiveTask && isOverTask) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                // tasks[activeIndex].columnId = tasks[overIndex].columnId; // Don't mutate directly
                updateTask(activeId as string, { columnId: tasks[overIndex].columnId });
                // Reordering logic is complex with props, for now just update column
            }
            // Reordering within same column requires reordering the array in the hook
            // For MVP, we might skip precise reordering or implement a moveTask function in hook
        }

        const isOverColumn = over.data.current?.type === "Column";

        // Dropping task over a column
        if (isActiveTask && isOverColumn) {
            updateTask(activeId as string, { columnId: overId as string });
        }

        if (overId === 'done') {
            setShowConfetti(true);
            playPop();
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        // Im dropping a Task over another Task
        if (isActiveTask && isOverTask) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                // For cross-column drag over, we update the columnId immediately for visual feedback
                // This might cause jitter if not handled carefully with state, but since we use props...
                // Ideally we use a local optimistic state or just rely on moveTask if it handles column updates?
                // moveTask only reorders. We need to update columnId too.
                // Let's skip complex cross-column reordering in onDragOver for now to be safe, 
                // or just call moveTask if we trust it.
                // Actually, dnd-kit expects us to mutate the items to show the gap.
                // Since we can't easily do that without setTasks, let's rely on onDragEnd for the actual move.
                return;
            }

            moveTask(String(activeId), String(overId));
        }
    }

    function generateId() {
        return Math.floor(Math.random() * 10001).toString();
    }

    async function handleSync() {
        if (!isConnected) return;

        const doneTasks = tasks
            .filter((t) => t.columnId === "done")
            .map((t) => t.content);

        if (doneTasks.length === 0) {
            toast.error("No done tasks to archive!");
            return;
        }

        // Confirmation dialog
        const confirmed = window.confirm("Only tasks in the 'Done' column will be permanently archived to the blockchain. Continue?");
        if (!confirmed) return;

        try {
            const promise = writeContractAsync({
                address: CONTRACT_ADDRESS,
                abi: TASK_JOURNAL_ABI,
                functionName: "logTasks",
                args: [doneTasks],
            });

            toast.promise(promise, {
                loading: 'Archiving to blockchain...',
                success: (data) => {
                    // Save to local history
                    addHistoryItem(doneTasks);
                    playWhoosh();
                    return `Archive Successful! Tx: ${data}`;
                },
                error: 'Archive Failed',
            });
        } catch (error) {
            console.error("Archive failed:", error);
        }
    }

    if (!isMounted) return null; // Prevent hydration mismatch

    return (
        <div className="flex flex-col min-h-screen w-full text-neutral-200 font-sans selection:bg-blue-500/30">
            {/* Top Bar / Dashboard Header */}
            {/* Board Toolbar */}
            {!focusMode && (
                <div className="w-full px-8 py-6 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-white tracking-tight">Task Board</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="text-neutral-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Filter tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/10 text-sm rounded-lg pl-9 pr-4 py-2 w-48 focus:w-64 transition-all duration-300 focus:outline-none focus:border-blue-500/50 focus:bg-black/40 placeholder:text-neutral-600"
                            />
                        </div>

                        {/* New Task Button */}
                        <button
                            onClick={() => {
                                const content = window.prompt("Enter task content:");
                                if (content && content.trim()) {
                                    createTask({
                                        id: Math.random().toString(),
                                        columnId: 'todo',
                                        content: content.trim(),
                                        tags: [],
                                        dueDate: new Date().toISOString(),
                                    });
                                    toast.success("Task added to To Do!");
                                }
                            }}
                            className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 px-4 py-2 rounded-lg font-medium transition-all border border-blue-500/20 hover:border-blue-500/40"
                        >
                            <Plus size={16} />
                            <span>New Task</span>
                        </button>

                        {isConnected && (
                            <button
                                onClick={handleSync}
                                className="flex items-center gap-2 bg-neon-accent/10 hover:bg-neon-accent/20 text-neon-primary hover:text-white px-4 py-2 rounded-lg font-medium transition-all border border-neon-accent/20 hover:border-neon-accent/40"
                            >
                                <span>Archive Completed</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            </button>
                        )}

                        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
                            <button onClick={handleExport} className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-md transition-colors" title="Export Data">
                                <Download size={16} />
                            </button>
                            <button onClick={handleImport} className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-md transition-colors" title="Import Data">
                                <Upload size={16} />
                            </button>
                            <button onClick={() => setFocusMode(!focusMode)} className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded-md transition-colors" title="Focus Mode (F)">
                                {focusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                            </button>
                            <ThemeSwitcher />
                        </div>
                    </div>
                </div>
            )}

            <ConfettiManager isActive={showConfetti} onComplete={() => setShowConfetti(false)} />
            <FocusExitButton show={focusMode} onExit={() => setFocusMode(false)} />

            <main className="flex-1 p-8 overflow-x-auto overflow-y-hidden">
                {/* Progress Section */}
                {!focusMode && (
                    <div className="mb-8 max-w-7xl mx-auto transition-all duration-500">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-1">Task Board</h2>
                                <p className="text-neutral-500 text-sm">Manage your tasks on the Arc Network</p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-neon-primary">{Math.round(progress)}%</span>
                                <span className="text-neutral-500 text-sm ml-2">Complete</span>
                            </div>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden backdrop-blur-sm">
                            <div
                                className="h-full bg-gradient-to-r from-neon-primary via-neon-secondary to-neon-accent shadow-[0_0_10px_rgba(0,243,255,0.5)] transition-all duration-700 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragOver={onDragOver}
                >
                    <div className="flex gap-6 h-[calc(100vh-220px)] max-w-7xl mx-auto pb-4">
                        {columns.map((col) => (
                            <Column
                                key={col.id}
                                column={col}
                                tasks={filteredTasks.filter((task) => task.columnId === col.id)}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                createTask={col.id === "todo" ? handleCreateTask : undefined}
                                addTag={addTag}
                            />
                        ))}
                    </div>

                    {createPortal(
                        <DragOverlay>
                            {activeTask && (
                                <TaskCard
                                    task={activeTask}
                                    deleteTask={deleteTask}
                                    updateTask={updateTask}
                                    addTag={addTag}
                                />
                            )}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
            </main>

            <div className="fixed bottom-4 left-4 z-50">
                <a href="/tutorial" className="text-neutral-600 hover:text-blue-400 text-xs transition-colors flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center">?</span>
                    How to use
                </a>
            </div>

            {/* Auto-save Indicator */}
            <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 text-xs text-neutral-600">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Cloud Synced & Auto-saved</span>
            </div>
        </div>
    );
}
