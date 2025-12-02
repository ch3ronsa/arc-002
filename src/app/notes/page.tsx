'use client';

import { NotesView } from '@/components/NotesView';
import DashboardLayout from '@/components/DashboardLayout';

export default function NotesPage() {
    return (
        <DashboardLayout>
            <NotesView />
        </DashboardLayout>
    );
}
