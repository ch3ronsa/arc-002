'use client';

import { ChangelogView } from '@/components/ChangelogView';
import DashboardLayout from '@/components/DashboardLayout';

export default function ChangelogPage() {
    return (
        <DashboardLayout>
            <ChangelogView />
        </DashboardLayout>
    );
}
