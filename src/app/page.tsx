'use client';

import { useState, useEffect } from 'react';
import KanbanBoard from "@/components/KanbanBoard";
import DashboardLayout from "@/components/DashboardLayout";
import { useWorkspace } from '@/providers/WorkspaceProvider';

export default function Home() {
  const { activeWorkspace } = useWorkspace();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DashboardLayout>
      <KanbanBoard workspaceId={activeWorkspace.id} />
    </DashboardLayout>
  );
}
