'use client';

import { PomodoroView } from "@/components/PomodoroView";
import DashboardLayout from "@/components/DashboardLayout";

export default function FocusPage() {
    return (
        <DashboardLayout>
            <PomodoroView />
        </DashboardLayout>
    );
}
