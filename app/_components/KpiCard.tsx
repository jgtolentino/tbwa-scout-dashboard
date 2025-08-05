'use client';

import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  color?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendDirection = 'up',
  color = '#FFD700' // Default to TBWA yellow
}) => {
  const tokens = {
    colors: {
      tbwaYellow: '#FFD700',
      tbwaBlack: '#000000',
      tbwaWhite: '#FFFFFF',
      tbwaGray: '#4A4A4A',
      tbwaLightGray: '#F5F5F5',
      accentEmerald: '#059669',
      accentRed: '#DC2626',
    }
  };

  const getTrendColor = () => {
    if (trendDirection === 'up') return tokens.colors.accentEmerald;
    if (trendDirection === 'down') return tokens.colors.accentRed;
    return tokens.colors.tbwaGray;
  };

  return (
    <div 
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
      style={{ borderTop: `4px solid ${color}` }}
    >
      {/* Background Pattern */}
      <div 
        className="absolute top-0 right-0 w-20 h-20 opacity-5"
        style={{ 
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)` 
        }}
      />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p 
              className="text-sm font-medium mb-2" 
              style={{ color: tokens.colors.tbwaGray }}
            >
              {title}
            </p>
            <p 
              className="text-3xl font-black mb-1" 
              style={{ color: tokens.colors.tbwaBlack }}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <p 
              className="text-sm" 
              style={{ color: tokens.colors.tbwaGray }}
            >
              {subtitle}
            </p>
          </div>
          
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center ml-4"
            style={{ backgroundColor: tokens.colors.tbwaBlack }}
          >
            <Icon 
              className="h-7 w-7" 
              style={{ color: tokens.colors.tbwaYellow }} 
            />
          </div>
        </div>
        
        {trend && (
          <div 
            className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
            style={{ 
              backgroundColor: getTrendColor() + '20',
              color: getTrendColor()
            }}
          >
            {trendDirection === 'up' && '↑'}
            {trendDirection === 'down' && '↓'}
            {trendDirection === 'neutral' && '→'}
            {' '}{trend}
          </div>
        )}
      </div>
    </div>
  );
};