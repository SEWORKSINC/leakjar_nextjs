'use client';

import { useRef, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

interface BrowserChartProps {
  data: any[];
  colors: string[];
}

export function BrowserChart({ data, colors }: BrowserChartProps) {
  const chartRef = useRef<any>(null);
  const [isChartReady, setIsChartReady] = useState(false);

  // Register Chart.js components only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ChartJS.register(
        ArcElement,
        Tooltip,
        Legend
      );
      setIsChartReady(true);
    }
  }, []);

  const chartData = {
    labels: data.map(item => item.browser),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      }
    ]
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: any, b: any) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (!isChartReady) {
    return (
      <div style={{ height: '250px' }} className="flex items-center justify-center">
        <div className="text-gray-400">Loading chart...</div>
      </div>
    );
  }

  return (
    <div style={{ height: '250px', position: 'relative' }}>
      <Doughnut ref={chartRef} data={chartData} options={options} />
    </div>
  );
}