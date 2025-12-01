'use client';

import { EncryptedNotesView } from "@/components/EncryptedNotesView";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useWorkspace } from "@/providers/WorkspaceProvider";

export default function NotesPage() {
    const { activeWorkspace } = useWorkspace();

    return (
        <DashboardLayout>
            <EncryptedNotesView workspaceId={activeWorkspace.id} />
        </DashboardLayout>
    );
}
