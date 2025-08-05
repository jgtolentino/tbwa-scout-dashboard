'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  span?: number; // Grid column span
  className?: string;
  title?: string;
  subtitle?: string;
  borderColor?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  span = 12, 
  className = '',
  title,
  subtitle,
  borderColor = '#FFD700' // Default to TBWA yellow
}) => {
  const tokens = {
    colors: {
      tbwaYellow: '#FFD700',
      tbwaBlack: '#000000',
      tbwaWhite: '#FFFFFF',
      tbwaGray: '#4A4A4A',
      cookieBrown: '#B47921',
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg p-6 shadow-sm border hover:shadow-lg transition-all duration-300 ${className}`}
      style={{ 
        gridColumn: `span ${span}`,
        borderTop: `4px solid ${borderColor}`,
        borderColor: 'rgba(0,0,0,0.1)'
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderTopColor = tokens.colors.cookieBrown;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderTopColor = borderColor;
      }}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-lg font-bold" style={{ color: tokens.colors.tbwaBlack }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm" style={{ color: tokens.colors.tbwaGray }}>
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};