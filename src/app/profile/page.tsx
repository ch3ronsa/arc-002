'use client';

import { ProfileView } from '@/components/ProfileView';
import DashboardLayout from '@/components/DashboardLayout';

export default function ProfilePage() {
    return (
        <DashboardLayout>
            <ProfileView />
        </DashboardLayout>
    );
}
