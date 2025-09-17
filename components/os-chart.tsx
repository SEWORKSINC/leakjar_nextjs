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

interface OsChartProps {
  data: any[];
  colors: string[];
}

export function OsChart({ data, colors }: OsChartProps) {
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

  if (!isChartReady) {
    return (
      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-gray-400">Loading OS Chart...</div>
      </div>
    );
  }

  const chartData = {
    labels: data.map(item => item.os),
    datasets: [
      {
        data: data.map(item => item.count),
        backgroundColor: colors.slice(0, data.length),
        borderColor: colors.slice(0, data.length),
        borderWidth: 2,
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
            const item = data[context.dataIndex];
            return `${item.os}: ${item.count.toLocaleString()} (${item.percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '250px', position: 'relative' }}>
      <Doughnut ref={chartRef} data={chartData} options={options} />
    </div>
  );
}