'use client';

import { Task } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CalendarViewProps {
    tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 1)); // Dec 2025 for mock data

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const getTasksForDay = (day: number) => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return taskDate.getDate() === day &&
                taskDate.getMonth() === currentDate.getMonth() &&
                taskDate.getFullYear() === currentDate.getFullYear();
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'inprogress': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
            case 'bounty': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            default: return 'bg-white/10 text-neutral-300 border-white/10';
        }
    };

    return (
        <div className="w-full h-full p-8 animate-in fade-in duration-500 flex flex-col">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                        className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                        className="p-2 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-[auto_1fr] gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {/* Weekday Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-4 text-center text-sm font-medium text-neutral-500 bg-[#0a0a12] uppercase tracking-wider">
                        {day}
                    </div>
                ))}

                {/* Days */}
                {paddingDays.map(i => (
                    <div key={`padding-${i}`} className="bg-[#0a0a12]/95 min-h-[120px]" />
                ))}

                {days.map(day => {
                    const dayTasks = getTasksForDay(day);
                    const isToday = day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear();

                    return (
                        <div
                            key={day}
                            className={`bg-[#0a0a12]/80 p-2 min-h-[120px] border-t border-white/5 hover:bg-[#0a0a12]/60 transition-colors relative group ${isToday ? 'bg-purple-500/5' : ''}`}
                        >
                            <span className={`text-sm font-medium block mb-2 ${isToday ? 'text-purple-400' : 'text-neutral-500'}`}>
                                {day}
                            </span>
                            <div className="flex flex-col gap-1">
                                {dayTasks.map(task => (
                                    <div
                                        key={task.id}
                                        className={`text-[10px] px-2 py-1 rounded border truncate cursor-pointer hover:brightness-125 transition-all ${getStatusColor(task.columnId)}`}
                                        title={task.content}
                                    >
                                        {task.content}
                                    </div>
                                ))}
                            </div>
                            {isToday && (
                                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
