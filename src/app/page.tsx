'use client';

import { useState } from "react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ListView } from "@/components/ListView";
import { CalendarView } from "@/components/CalendarView";
import { TemplatesView } from "@/components/TemplatesView";
import { Toaster, toast } from "sonner";
import { useTaskManager } from "@/hooks/useTaskManager";

export default function Home() {
  const [currentView, setCurrentView] = useState('board');
  const { tasks, updateTask, deleteTask, createTask, addTag, moveTask, setTasks, addTasks } = useTaskManager();

  const handleUseTemplate = (templateTasks: Partial<any>[]) => {
    const newTasks = templateTasks.map(t => ({
      content: t.content || 'New Task',
      tags: t.tags || [],
      ...t,
      id: Math.floor(Math.random() * 1000000).toString(),
      dueDate: new Date().toISOString(),
      columnId: t.columnId || 'backlog',
    }));
    // @ts-ignore - ID generation is handled above
    addTasks(newTasks);
    setCurrentView('board');
    toast.success("Template applied successfully!");
  };

  return (
    <main className="min-h-screen bg-[#050508] text-neutral-200">
      <DashboardLayout currentView={currentView} onViewChange={setCurrentView}>
        {currentView === 'board' && (
          <KanbanBoard
            tasks={tasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
            createTask={createTask}
            addTag={addTag}
            moveTask={moveTask}
            setTasks={setTasks}
          />
        )}
        {currentView === 'list' && <ListView tasks={tasks} />}
        {currentView === 'calendar' && <CalendarView tasks={tasks} />}
        {currentView === 'templates' && <TemplatesView onUseTemplate={handleUseTemplate} />}
        {currentView === 'timeline' && (
          <div className="flex items-center justify-center h-full text-neutral-500">
            Timeline View Coming Soon
          </div>
        )}
      </DashboardLayout>
      <Toaster />
    </main>
  );
}
