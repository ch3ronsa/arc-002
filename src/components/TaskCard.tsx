import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, List } from "lucide-react";
import { useState } from "react";

import { Task, TaskId } from "@/types";

const TAG_PRESETS = [
    { name: 'High Priority', color: 'bg-red-500/20 text-red-300 border border-red-500/30' },
    { name: 'Design', color: 'bg-purple-500/20 text-purple-300 border border-purple-500/30' },
    { name: 'Dev', color: 'bg-blue-500/20 text-blue-300 border border-blue-500/30' },
];

interface TaskCardProps {
    task: Task;
    deleteTask: (id: TaskId) => void;
    updateTask: (id: TaskId, updates: Partial<Task>) => void;
    addTag?: (id: TaskId, tag: string) => void;
}

export function TaskCard({ task, deleteTask, updateTask, addTag }: TaskCardProps) {
    const [showTagMenu, setShowTagMenu] = useState(false);
    const [customTag, setCustomTag] = useState("");
    const [showSubtasks, setShowSubtasks] = useState(false);
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 bg-white/10 p-4 h-[120px] min-h-[120px] items-center flex text-left rounded-xl border-2 border-blue-500/50 cursor-grab relative"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`glass-card p-4 min-h-[120px] flex flex-col justify-between rounded-xl cursor-grab relative task group transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:border-blue-500/30 ${task.columnId === 'done' ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100' : ''}`}
        >
            <motion.div
                initial={task.columnId === 'done' ? { scale: 1.05 } : false}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-full h-full flex flex-col"
            >
                <textarea
                    className="w-full resize-none border-none rounded bg-transparent text-neutral-200 focus:outline-none text-sm mb-2 placeholder:text-neutral-600"
                    value={task.content}
                    autoFocus={false}
                    placeholder="Task content"
                    onBlur={() => { }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.shiftKey) {
                            // Allow shift+enter for new line
                        } else if (e.key === "Enter") {
                            // e.preventDefault(); 
                        }
                    }}
                    onChange={(e) => updateTask(task.id, { content: e.target.value })}
                />

                {/* Subtasks Progress Bar */}
                {task.subtasks && task.subtasks.length > 0 && !showSubtasks && (
                    <div className="w-full h-1 bg-white/10 rounded-full mt-2 mb-2 overflow-hidden">
                        <div
                            className="h-full bg-neon-primary transition-all duration-300"
                            style={{ width: `${(task.subtasks.filter(t => t.completed).length / task.subtasks.length) * 100}%` }}
                        />
                    </div>
                )}

                {/* Subtasks List */}
                {showSubtasks && (
                    <div className="mt-2 flex flex-col gap-2 mb-2">
                        {task.subtasks?.map((subtask, index) => (
                            <div key={subtask.id} className="flex items-center gap-2 group/subtask">
                                <button
                                    onClick={() => {
                                        const newSubtasks = [...(task.subtasks || [])];
                                        newSubtasks[index].completed = !newSubtasks[index].completed;
                                        updateTask(task.id, { subtasks: newSubtasks });
                                    }}
                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${subtask.completed ? 'bg-neon-primary border-neon-primary' : 'border-neutral-500 hover:border-neon-primary'}`}
                                >
                                    {subtask.completed && <div className="w-2 h-2 bg-black rounded-sm" />}
                                </button>
                                <input
                                    value={subtask.content}
                                    onChange={(e) => {
                                        const newSubtasks = [...(task.subtasks || [])];
                                        newSubtasks[index].content = e.target.value;
                                        updateTask(task.id, { subtasks: newSubtasks });
                                    }}
                                    className={`bg-transparent text-xs focus:outline-none w-full ${subtask.completed ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}
                                />
                                <button
                                    onClick={() => {
                                        const newSubtasks = task.subtasks?.filter((_, i) => i !== index);
                                        updateTask(task.id, { subtasks: newSubtasks });
                                    }}
                                    className="opacity-0 group-hover/subtask:opacity-100 text-neutral-500 hover:text-red-500"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => {
                                const newSubtask = { id: Math.random().toString(), content: "New subtask", completed: false };
                                updateTask(task.id, { subtasks: [...(task.subtasks || []), newSubtask] });
                            }}
                            className="text-xs text-neutral-500 hover:text-neon-primary flex items-center gap-1 mt-1"
                        >
                            <Plus size={12} /> Add subtask
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mt-auto items-center">
                    {/* Bounty Badge */}
                    {task.bounty && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-medium text-yellow-500">
                            <span>💎</span>
                            <span>{task.bounty}</span>
                        </div>
                    )}

                    {/* Assignee Avatar */}
                    {task.assignee && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[8px] font-bold text-white border border-white/10" title={`Assigned to ${task.assignee}`}>
                            {task.assignee.slice(0, 2).toUpperCase()}
                        </div>
                    )}

                    {/* Claim Button (if bounty exists and no assignee) */}
                    {task.bounty && !task.assignee && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                updateTask(task.id, { assignee: "Me" }); // Placeholder for actual wallet claim
                            }}
                            className="px-2 py-1 rounded-md bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-[10px] font-medium transition-colors"
                        >
                            Assign to Me
                        </button>
                    )}

                    {task.tags?.map((tag) => {
                        const preset = TAG_PRESETS.find(p => p.name === tag) || { color: 'bg-neutral-500/20 text-neutral-400 border border-neutral-500/30' };
                        return (
                            <span key={tag} className={`text-[10px] px-2 py-1 rounded-full font-medium ${preset.color}`}>
                                {tag}
                            </span>
                        );
                    })}

                    {addTag && (
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowTagMenu(!showTagMenu); }}
                                className="p-1 rounded-full hover:bg-white/10 text-neutral-500 hover:text-neutral-300 transition-colors"
                            >
                                <Plus size={14} />
                            </button>

                            {showTagMenu && (
                                <div className="absolute top-full left-0 mt-1 glass-panel shadow-xl rounded-lg p-1 z-50 w-32 flex flex-col gap-1 border border-white/10">
                                    {TAG_PRESETS.map(preset => (
                                        <button
                                            key={preset.name}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addTag(task.id, preset.name);
                                                setShowTagMenu(false);
                                            }}
                                            className={`text-xs text-left px-2 py-1 rounded hover:brightness-125 transition-all ${preset.color}`}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                    <div className="border-t border-white/10 pt-1 mt-1">
                                        <input
                                            type="text"
                                            placeholder="Custom..."
                                            value={customTag}
                                            onClick={(e) => e.stopPropagation()}
                                            onChange={(e) => setCustomTag(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && customTag.trim()) {
                                                    e.stopPropagation();
                                                    addTag(task.id, customTag.trim());
                                                    setCustomTag("");
                                                    setShowTagMenu(false);
                                                }
                                            }}
                                            className="w-full bg-black/20 text-xs text-white px-2 py-1 rounded border border-white/10 focus:outline-none focus:border-neon-primary/50"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={(e) => { e.stopPropagation(); setShowSubtasks(!showSubtasks); }}
                        className={`p-1 rounded-full hover:bg-white/10 transition-colors ${showSubtasks ? 'text-neon-primary' : 'text-neutral-500 hover:text-neutral-300'}`}
                        title="Toggle Checklist"
                    >
                        <div className="flex items-center gap-1">
                            <List size={14} />
                            {task.subtasks && task.subtasks.length > 0 && (
                                <span className="text-[10px] font-mono">
                                    {task.subtasks.filter(t => t.completed).length}/{task.subtasks.length}
                                </span>
                            )}
                        </div>
                    </button>
                </div>

            </motion.div>
            <button
                onClick={() => deleteTask(task.id)}
                className="absolute top-2 right-2 p-1 text-neutral-600 hover:text-red-500 transition-colors"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
