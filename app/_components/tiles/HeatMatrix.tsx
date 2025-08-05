'use client';

import React from 'react';

interface HeatMatrixProps {
  data: any;
  loading: boolean;
}

const HeatMatrix: React.FC<HeatMatrixProps> = ({ data, loading }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="grid grid-cols-24 gap-1">
            {days.map((day, i) => (
              <div key={i} className="col-span-24 flex gap-1">
                {hours.map((hour, j) => (
                  <div key={j} className="w-4 h-4 bg-gray-200 rounded-sm"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.heatmap) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">No activity data</p>
        <p className="empty-state__description">Peak hours data unavailable</p>
      </div>
    );
  }

  // Get max value for scaling
  const maxValue = Math.max(...Object.values(data.heatmap).flat() as number[]);

  const getColor = (value: number) => {
    const intensity = value / maxValue;
    if (intensity > 0.8) return '#8a6bff'; // Lavender - peak
    if (intensity > 0.6) return '#a78bfa';
    if (intensity > 0.4) return '#c4b5fd';
    if (intensity > 0.2) return '#ddd6fe';
    return '#ede9fe'; // Light lavender
  };

  return (
    <div className="space-y-2">
      {/* Hour labels */}
      <div className="flex items-center">
        <div className="w-12"></div>
        <div className="flex-1 grid grid-cols-24 gap-1 text-xs text-gray-500">
          {hours.map(h => (
            <div key={h} className="text-center">
              {h % 3 === 0 ? h : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Heat grid */}
      {days.map((day, dayIdx) => (
        <div key={day} className="flex items-center">
          <div className="w-12 text-xs text-gray-600 font-medium">{day}</div>
          <div className="flex-1 grid grid-cols-24 gap-1">
            {hours.map(hour => {
              const value = data.heatmap?.[dayIdx]?.[hour] || 0;
              return (
                <div
                  key={hour}
                  className="aspect-square rounded-sm transition-all hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: getColor(value) }}
                  title={`${day} ${hour}:00 - ${value} transactions`}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 pt-4">
        <span className="text-xs text-gray-500">Low</span>
        <div className="flex space-x-1">
          {['#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8a6bff'].map((color, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">Peak</span>
      </div>
    </div>
  );
};

export default HeatMatrix;