'use client';

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ForecastWidgetProps {
  data: any;
  loading: boolean;
}

const ForecastWidget: React.FC<ForecastWidgetProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 h-32 w-full rounded"></div>
      </div>
    );
  }

  if (!data || !data.forecast) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">No forecast data</p>
        <p className="empty-state__description">90-day prediction unavailable</p>
      </div>
    );
  }

  const chartData = {
    labels: data.forecast.map((f: any) => f.date),
    datasets: [
      {
        label: 'Forecast',
        data: data.forecast.map((f: any) => f.predicted),
        borderColor: '#ffddb0',
        backgroundColor: 'rgba(255, 221, 176, 0.1)',
        fill: '+1',
        tension: 0.4
      },
      {
        label: 'Upper Confidence',
        data: data.forecast.map((f: any) => f.upper_bound),
        borderColor: 'rgba(255, 221, 176, 0.3)',
        backgroundColor: 'rgba(255, 221, 176, 0.05)',
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      },
      {
        label: 'Lower Confidence',
        data: data.forecast.map((f: any) => f.lower_bound),
        borderColor: 'rgba(255, 221, 176, 0.3)',
        backgroundColor: 'rgba(255, 221, 176, 0.05)',
        borderDash: [5, 5],
        fill: '-1',
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 6
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value: any) {
            return '₱' + (value / 1000000).toFixed(1) + 'M';
          }
        }
      }
    }
  };

  const totalForecast = data.forecast.reduce((sum: number, f: any) => sum + f.predicted, 0);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-3xl font-black text-gray-900">
          ₱{(totalForecast / 1000000).toFixed(1)}M
        </p>
        <p className="text-sm text-gray-500">90-Day Revenue Forecast</p>
      </div>
      
      <div className="h-32">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ForecastWidget;