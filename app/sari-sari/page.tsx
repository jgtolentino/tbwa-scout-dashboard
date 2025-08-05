'use client';

import dynamic from 'next/dynamic';
import { DashboardShell } from '../_components/DashboardShell';

// Dynamic import to avoid SSR issues
const SariSariIntelligence = dynamic(
  () => import('@/components/SariSariIntelligence'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-yellow-500"></div>
      </div>
    )
  }
);

export default function SariSariPage() {
  return (
    <DashboardShell 
      title="Sari-Sari Expert Bot" 
      activeTab="sari-sari"
    >
      <SariSariIntelligence />
    </DashboardShell>
  );
}