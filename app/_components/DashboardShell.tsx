'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { AskPanel } from './AskPanel';
import { TabNav, TabKey } from './TabNav';
import { Footer } from './Footer';

interface DashboardShellProps {
  title: string;
  children: React.ReactNode;
  activeTab: TabKey;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ 
  title, 
  children, 
  activeTab,
  onRefresh,
  isLoading = false
}) => {
  const [askPanelResult, setAskPanelResult] = useState<any>(null);

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
    // You can add global refresh logic here
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header - shared across all pages */}
      <Header onRefresh={handleRefresh} isLoading={isLoading} />
      
      {/* Ask Panel - unified Scout + SUQI */}
      <AskPanel onResult={setAskPanelResult} />
      
      {/* Tab Navigation */}
      <TabNav active={activeTab} />
      
      {/* Main content area */}
      <main className="flex-1 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Page title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          
          {/* Page-specific content */}
          <section>{children}</section>
        </div>
      </main>
      
      {/* Footer - shared across all pages */}
      <Footer />
    </div>
  );
};