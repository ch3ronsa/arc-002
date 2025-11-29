'use client';

import { Task } from "@/types";
import { Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface ListViewProps {
    tasks: Task[];
}

export function ListView({ tasks }: ListViewProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'inprogress': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            case 'bounty': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'review': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-neutral-400 bg-white/5 border-white/10';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'done': return 'Done';
            case 'inprogress': return 'In Progress';
            case 'bounty': return 'Bounty';
            case 'review': return 'Review';
            case 'todo': return 'To Do';
            case 'bounty': return 'Bounty Board';
            default: return status;
        }
    };

    return (
        <div className="w-full p-8 animate-in fade-in duration-500">
            <div className="rounded-xl border border-white/10 bg-black/20 backdrop-blur-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-neutral-400 uppercase tracking-wider w-1/2">Task</th>
                            <th className="p-4 text-xs font-medium text-neutral-400 uppercase tracking-wider">Status</th>
                            <th className="p-4 text-xs font-medium text-neutral-400 uppercase tracking-wider">Bounty</th>
                            <th className="p-4 text-xs font-medium text-neutral-400 uppercase tracking-wider">Assignee</th>
                            <th className="p-4 text-xs font-medium text-neutral-400 uppercase tracking-wider">Due Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {tasks.map((task) => (
                            <tr key={task.id} className="group hover:bg-white/5 transition-colors">
                                <td className="p-4">
                                    <div className="font-medium text-neutral-200 group-hover:text-white transition-colors">
                                        {task.content}
                                    </div>
                                    {task.tags && task.tags.length > 0 && (
                                        <div className="flex gap-2 mt-1">
                                            {task.tags.map(tag => (
                                                <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400 border border-white/5">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.columnId)}`}>
                                        {getStatusLabel(task.columnId)}
                                    </span>
                                </td>
                                <td className="p-4 font-mono text-sm text-yellow-500">
                                    {task.bounty || '-'}
                                </td>
                                <td className="p-4">
                                    {task.assignee ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                                                {task.assignee.slice(0, 2).toUpperCase()}
                                            </div>
                                            <span className="text-sm text-neutral-300">{task.assignee}</span>
                                        </div>
                                    ) : (
                                        <span className="text-neutral-600 text-sm">-</span>
                                    )}
                                </td>
                                <td className="p-4">
                                    {task.dueDate ? (
                                        <div className="flex items-center gap-2 text-neutral-400 text-sm">
                                            <Clock size={14} />
                                            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                        </div>
                                    ) : (
                                        <span className="text-neutral-600 text-sm">-</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
