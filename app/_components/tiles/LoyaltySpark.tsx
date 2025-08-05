'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

interface LoyaltySparkProps {
  data: any;
  loading: boolean;
}

const LoyaltySpark: React.FC<LoyaltySparkProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-24 flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 h-16 w-full rounded"></div>
      </div>
    );
  }

  if (!data || !data.loyalty_trend) {
    return (
      <div className="text-center py-4">
        <p className="text-4xl font-black text-gray-900">--</p>
        <p className="text-sm text-gray-500">No data</p>
      </div>
    );
  }

  const chartData = {
    labels: data.loyalty_trend.map((d: any) => d.month),
    datasets: [{
      data: data.loyalty_trend.map((d: any) => d.repeat_rate),
      borderColor: '#4f6ef7',
      borderWidth: 2,
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            return `${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false,
        min: 0,
        max: 100
      }
    }
  };

  const currentRate = data.loyalty_trend[data.loyalty_trend.length - 1]?.repeat_rate || 0;
  const previousRate = data.loyalty_trend[data.loyalty_trend.length - 2]?.repeat_rate || 0;
  const delta = currentRate - previousRate;

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-3xl font-black text-gray-900">{currentRate}%</p>
        <p className="text-sm text-gray-500">Repeat Purchase Rate</p>
        <p className={`text-sm font-bold ${delta > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {delta > 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}% vs last month
        </p>
      </div>
      
      <div className="h-16">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LoyaltySpark;