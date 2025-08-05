'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading = false }) => {
  const tokens = {
    colors: {
      tbwaYellow: '#FFD700',
      tbwaBlack: '#000000',
      tbwaWhite: '#FFFFFF',
      tbwaGray: '#4A4A4A',
    }
  };

  return (
    <header 
      className="relative overflow-hidden"
      style={{ backgroundColor: tokens.colors.tbwaBlack }}
    >
      {/* Gradient background effect */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{ 
          background: `radial-gradient(circle at 25% 25%, ${tokens.colors.tbwaYellow} 0%, transparent 50%)`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Logo placeholder */}
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center font-black text-xl"
              style={{ 
                backgroundColor: tokens.colors.tbwaYellow,
                color: tokens.colors.tbwaBlack
              }}
            >
              S5
            </div>
            
            {/* Title */}
            <div>
              <h1 
                className="text-2xl font-black uppercase tracking-tight"
                style={{ color: tokens.colors.tbwaYellow }}
              >
                Scout v5 Data Intelligence
              </h1>
              <p 
                className="text-sm font-medium"
                style={{ color: tokens.colors.tbwaWhite, opacity: 0.9 }}
              >
                TBWA Enterprise Analytics Platform
              </p>
            </div>
          </div>
          
          {/* Refresh button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 disabled:opacity-50"
            style={{ 
              backgroundColor: tokens.colors.tbwaYellow,
              color: tokens.colors.tbwaBlack
            }}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>
    </header>
  );
};