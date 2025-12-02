'use client';

import { EncryptedNotesView } from '@/components/EncryptedNotesView';
import DashboardLayout from '@/components/DashboardLayout';

export default function EncryptedNotesPage() {
    return (
        <DashboardLayout>
            <EncryptedNotesView />
        </DashboardLayout>
    );
}
