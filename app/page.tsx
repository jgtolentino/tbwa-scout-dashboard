'use client';

import { DashboardShell } from './_components/DashboardShell';
import { ExecutiveOverview } from './_components/ExecutiveOverview';

export default function Home() {
  return (
    <DashboardShell 
      title="Executive Overview" 
      activeTab="executive"
    >
      <ExecutiveOverview />
    </DashboardShell>
  );
}