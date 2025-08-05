'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PersonaMixChartProps {
  data: any;
  loading: boolean;
}

const PersonaMixChart: React.FC<PersonaMixChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-yellow-500"></div>
      </div>
    );
  }

  if (!data || !data.personas) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon">👥</div>
        <p className="empty-state__title">No persona data available</p>
        <p className="empty-state__description">Refresh to load customer personas</p>
      </div>
    );
  }

  // Extract top 3 personas
  const topPersonas = data.personas.slice(0, 3);
  
  const chartData = {
    labels: topPersonas.map((p: any) => p.persona_name),
    datasets: [{
      data: topPersonas.map((p: any) => p.percentage),
      backgroundColor: [
        '#4f6ef7',
        '#8a6bff',
        '#97de9b'
      ],
      borderWidth: 0
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-48">
        <Doughnut data={chartData} options={options} />
      </div>
      
      {/* YoY Delta */}
      <div className="flex justify-around pt-4 border-t">
        {topPersonas.map((persona: any, idx: number) => (
          <div key={idx} className="text-center">
            <p className="text-xs text-gray-500">{persona.persona_name}</p>
            <p className={`text-sm font-bold ${persona.yoy_delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {persona.yoy_delta > 0 ? '+' : ''}{persona.yoy_delta}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonaMixChart;