'use client';

import { useState, useEffect } from "react";
import { KanbanBoard } from "@/components/KanbanBoard";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Toaster } from "sonner";
import { useTaskManager } from "@/hooks/useTaskManager";
import { useWorkspace } from "@/providers/WorkspaceProvider";

export default function Home() {
  const { activeWorkspace } = useWorkspace();
  const { tasks, updateTask, deleteTask, createTask, addTag, moveTask, setTasks } = useTaskManager(activeWorkspace.id);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#050508]" />;
  }

  return (
    <main className="min-h-screen bg-[#050508] text-neutral-200">
      <DashboardLayout>
        <KanbanBoard
          tasks={tasks}
          updateTask={updateTask}
          deleteTask={deleteTask}
          createTask={createTask}
          addTag={addTag}
          moveTask={moveTask}
          setTasks={setTasks}
        />
      </DashboardLayout>
      <Toaster />
    </main>
  );
}
