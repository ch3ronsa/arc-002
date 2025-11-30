'use client';

import { useState, useEffect } from "react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ListView } from "@/components/ListView";
import { CalendarView } from "@/components/CalendarView";
import { EncryptedNotesView } from "@/components/EncryptedNotesView";
import { WorkspaceView } from "@/components/WorkspaceView";
import { PomodoroView } from "@/components/PomodoroView";
import { Toaster } from "sonner";
import { useTaskManager } from "@/hooks/useTaskManager";

export default function Home() {
  const [currentView, setCurrentView] = useState('workspace');
  const [activeWorkspace, setActiveWorkspace] = useState({ id: '1', name: 'My Workspace' });
  const { tasks, updateTask, deleteTask, createTask, addTag, moveTask, setTasks, addTasks } = useTaskManager(activeWorkspace.id);
  const [mounted, setMounted] = useState(false);

  // Load active workspace from localStorage
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

  // Save active workspace to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('arc-active-workspace', JSON.stringify(activeWorkspace));
    }
  }, [activeWorkspace, mounted]);

  if (!mounted) {
    return <div className="min-h-screen bg-[#050508]" />;
  }

  return (
    <main className="min-h-screen bg-[#050508] text-neutral-200">
      <DashboardLayout
        currentView={currentView}
        onViewChange={setCurrentView}
        activeWorkspaceId={activeWorkspace.id}
        onWorkspaceChange={(id, name) => setActiveWorkspace({ id, name })}
      >
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
        {currentView === 'notes' && <EncryptedNotesView workspaceId={activeWorkspace.id} />}
        {currentView === 'workspace' && <WorkspaceView workspaceName={activeWorkspace.name} onViewChange={setCurrentView} />}
        {currentView === 'pomodoro' && <PomodoroView />}
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
