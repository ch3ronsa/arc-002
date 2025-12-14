import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Task, TaskId } from "@/types";
import { TaskCard } from "./TaskCard";
import { useMemo, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { Plus, Inbox } from "lucide-react";

interface ColumnProps {
    column: {
        id: string;
        title: string;
    };
    tasks: Task[];
    deleteTask: (id: TaskId) => void;
    updateTask: (id: TaskId, updates: Partial<Task>) => void;
    createTask?: (content: string) => void;
    addTag: (id: TaskId, tag: string) => void;
}

export function Column({ column, tasks, deleteTask, updateTask, createTask, addTag }: ColumnProps) {
    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks]);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: true,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="glass-panel w-full md:w-[300px] lg:w-[350px] md:min-w-[280px] md:flex-shrink-0 md:h-full rounded-2xl flex flex-col p-4 transition-colors hover:bg-white/5"
        >
            <div className="flex gap-2 items-center justify-between mb-4 px-2">
                <div className="flex gap-2 items-center font-bold text-neutral-200">
                    <span className={`w-2 h-2 rounded-full ${column.id === 'todo' ? 'bg-blue-500' : column.id === 'inprogress' ? 'bg-purple-500' : 'bg-green-500'} shadow-[0_0_8px_currentColor]`}></span>
                    {column.title}
                    <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs font-medium text-neutral-400 border border-white/5">
                        {tasks.length}
                    </span>
                </div>
            </div>

            {/* Task Container */}
            <div className="flex flex-col gap-3 flex-grow overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                            addTag={addTag}
                        />
                    ))}
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-32 border border-dashed border-white/10 rounded-xl text-neutral-500 bg-white/5">
                        <Inbox size={24} className="mb-2 opacity-50" />
                        <span className="text-sm font-medium">No tasks yet</span>
                    </div>
                )}
            </div>

            {createTask && (
                <div className="mt-4">
                    <input
                        className="w-full p-3 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50 bg-black/20 text-neutral-200 placeholder:text-neutral-600 shadow-inner transition-all text-sm"
                        placeholder="+ Add a task"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                const val = e.currentTarget.value.trim();
                                if (val) {
                                    createTask(val);
                                    e.currentTarget.value = "";
                                }
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}
