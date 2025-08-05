'use client';

import React from 'react';

export const Footer: React.FC = () => {
  const tokens = {
    colors: {
      tbwaYellow: '#FFD700',
      tbwaBlack: '#000000',
      tbwaWhite: '#FFFFFF',
      tbwaGray: '#4A4A4A',
    }
  };

  return (
    <footer 
      className="mt-auto border-t px-6 py-4"
      style={{ 
        borderColor: tokens.colors.tbwaGray + '20',
        backgroundColor: tokens.colors.tbwaWhite 
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between text-sm">
        <p style={{ color: tokens.colors.tbwaGray }}>
          © {new Date().getFullYear()} TBWA. Scout v5 Data Intelligence Platform.
        </p>
        <p style={{ color: tokens.colors.tbwaGray }}>
          Powered by Supabase • Mapbox • Claude AI
        </p>
      </div>
    </footer>
  );
};