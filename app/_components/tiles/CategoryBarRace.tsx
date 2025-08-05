'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CategoryBarRaceProps {
  data: any;
  loading: boolean;
}

const CategoryBarRace: React.FC<CategoryBarRaceProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse bg-gray-200 h-48 w-full rounded"></div>
      </div>
    );
  }

  if (!data || !data.categories) {
    return (
      <div className="empty-state">
        <p className="empty-state__title">No category data</p>
        <p className="empty-state__description">Category performance unavailable</p>
      </div>
    );
  }

  const chartData = {
    labels: data.categories.map((c: any) => c.category_name),
    datasets: [{
      data: data.categories.map((c: any) => c.revenue),
      backgroundColor: '#97de9b',
      borderRadius: 4,
      barThickness: 30
    }]
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `₱${context.parsed.x.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          callback: function(value: any) {
            return '₱' + (value / 1000) + 'K';
          }
        }
      },
      y: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default CategoryBarRace;