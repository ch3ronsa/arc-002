'use client';

import { useState } from "react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ListView } from "@/components/ListView";
import { CalendarView } from "@/components/CalendarView";
import { TemplatesView } from "@/components/TemplatesView";
import { EncryptedNotesView } from "@/components/EncryptedNotesView";
import { WorkspaceView } from "@/components/WorkspaceView";
import { PomodoroView } from "@/components/PomodoroView";
import { Toaster, toast } from "sonner";
import { useTaskManager } from "@/hooks/useTaskManager";

export default function Home() {
  const [currentView, setCurrentView] = useState('workspace');
  const [activeWorkspace] = useState({ id: '1', name: 'My Workspace' });
  const { tasks, updateTask, deleteTask, createTask, addTag, moveTask, setTasks, addTasks } = useTaskManager();

  const handleUseTemplate = (templateTasks: Partial<any>[]) => {
    const newTasks = templateTasks.map(t => ({
      content: t.content || 'New Task',
      tags: t.tags || [],
      ...t,
      id: Math.floor(Math.random() * 1000000).toString(),
      dueDate: new Date().toISOString(),
      columnId: t.columnId || 'todo',
    }));
    // @ts-ignore - ID generation is handled above
    addTasks(newTasks);
    setCurrentView('board');
    toast.success("Template applied successfully!");
  };

  const handleCreateWorkspace = (workspaceName: string, templateTasks: Partial<any>[]) => {
    // Create workspace in localStorage
    const workspaces = JSON.parse(localStorage.getItem('arc-workspaces') || '[{"id":"1","name":"My Workspace"}]');
    const newWorkspace = {
      id: Math.random().toString(36).substr(2, 9),
      name: workspaceName
    };
    workspaces.push(newWorkspace);
    localStorage.setItem('arc-workspaces', JSON.stringify(workspaces));

    // Save tasks for this workspace
    const newTasks = templateTasks.map(t => ({
      content: t.content || 'New Task',
      tags: t.tags || [],
      ...t,
      id: Math.floor(Math.random() * 1000000).toString(),
      dueDate: new Date().toISOString(),
      columnId: t.columnId || 'todo',
    }));
    localStorage.setItem(`workspace-${newWorkspace.id}-tasks`, JSON.stringify(newTasks));

    // Reload page to show new workspace
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-[#050508] text-neutral-200">
      <DashboardLayout currentView={currentView} onViewChange={setCurrentView} activeWorkspaceName={activeWorkspace.name}>
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
        {currentView === 'templates' && <TemplatesView onUseTemplate={handleUseTemplate} onCreateWorkspace={handleCreateWorkspace} />}
        {currentView === 'notes' && <EncryptedNotesView />}
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
