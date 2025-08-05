'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Globe, 
  Store, 
  MessageSquare 
} from 'lucide-react';

export type TabKey = 'executive' | 'performance' | 'brand' | 'geographic' | 'sari-sari' | 'ask';

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
}

interface TabNavProps {
  active?: TabKey;
}

export const TabNav: React.FC<TabNavProps> = ({ active }) => {
  const pathname = usePathname();
  
  const tokens = {
    colors: {
      tbwaYellow: '#FFD700',
      tbwaBlack: '#000000',
      tbwaWhite: '#FFFFFF',
      tbwaGray: '#4A4A4A',
    }
  };

  const tabs: Tab[] = [
    { key: 'executive', label: 'Executive Intel', icon: BarChart3, href: '/' },
    { key: 'performance', label: 'Performance Analytics', icon: TrendingUp, href: '/performance' },
    { key: 'brand', label: 'Brand Competitive', icon: Target, href: '/brand' },
    { key: 'geographic', label: 'Geographic Intel', icon: Globe, href: '/geographic' },
    { key: 'sari-sari', label: 'Sari-Sari Expert', icon: Store, href: '/sari-sari' },
    { key: 'ask', label: 'Ask SUQI', icon: MessageSquare, href: '/ask' },
  ];

  // Determine active tab from pathname if not provided
  const activeTab = active || tabs.find(tab => tab.href === pathname)?.key || 'executive';

  return (
    <nav 
      className="px-6 border-b"
      style={{ borderColor: tokens.colors.tbwaGray + '20' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex space-x-1">
          {tabs.map(({ key, label, icon: Icon, href }) => {
            const isActive = key === activeTab;
            
            return (
              <Link
                key={key}
                href={href}
                className={`flex items-center px-4 py-4 text-sm font-bold transition-all uppercase tracking-wide ${
                  isActive ? 'border-b-2' : 'hover:opacity-80'
                }`}
                style={{
                  color: isActive ? tokens.colors.tbwaYellow : tokens.colors.tbwaGray,
                  borderBottomColor: isActive ? tokens.colors.tbwaYellow : 'transparent',
                }}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};