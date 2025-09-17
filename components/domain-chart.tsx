'use client';

import { useRef, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

interface DomainChartProps {
  domain: string;
  type: 'URL' | 'EMAIL';
  data: any[];
  color: string;
  total: number;
}

export function DomainChart({ domain, type, data, color, total }: DomainChartProps) {
  const chartRef = useRef<any>(null);
  const [isChartReady, setIsChartReady] = useState(false);

  // Register Chart.js components and zoom plugin only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('chartjs-plugin-zoom').then((zoomPlugin) => {
        ChartJS.register(
          CategoryScale,
          LinearScale,
          BarElement,
          Title,
          Tooltip,
          Legend,
          zoomPlugin.default
        );
        setIsChartReady(true);
      });
    }
  }, []);

  const chartData = {
    labels: data.map(item => item.month), // API에서 이미 "Sep 2025" 형식으로 옴
    datasets: [
      {
        label: 'Breaches',
        data: data.map(item => item.breaches),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
        borderRadius: 0,
      }
    ]
  };

  // 데이터가 24개월 이상이면 최근 24개월만 표시하도록 초기 줌 설정
  const shouldZoom = data.length > 24;
  const zoomStart = shouldZoom ? Math.max(0, data.length - 24) : 0;
  const zoomEnd = data.length - 1;

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Breaches: ${context.parsed.y.toLocaleString()}`;
          }
        }
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.1
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
          onZoomComplete: ({chart}: any) => {
            // Track that zoom has been applied
            (chart as any).isZoomed = true;
          }
        },
        pan: {
          enabled: true,
          mode: 'x',
        },
        limits: {
          x: { min: 0, max: 'original' },
        }
      }
    },
    onClick: (event: any, elements: any, chart: any) => {
      // Check for double click based on timing
      const now = Date.now();
      const timeDiff = chart.lastClick ? now - chart.lastClick : 1000;
      chart.lastClick = now;

      if (timeDiff < 500) { // Double click detected (within 500ms)
        chart.resetZoom();
        chart.isZoomed = false;
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        min: shouldZoom ? zoomStart : undefined,
        max: shouldZoom ? zoomEnd : undefined,
        ticks: {
          autoSkip: false,  // 자동 스킵 비활성화
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: 9
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            if (typeof value === 'number') {
              if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
              if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
              return value.toString();
            }
            return value;
          }
        }
      }
    }
  };


  const maxMonth = data.reduce((max, item) => item.breaches > max.breaches ? item : max, data[0] || { month: '', breaches: 0 });

  if (!isChartReady) {
    return (
      <div className="bg-white p-4  border">
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-base font-semibold truncate" title={domain}>{domain}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium  ${
              type === 'URL'
                ? 'bg-gray-100 text-gray-700'
                : 'bg-gray-200 text-gray-800'
            }`}>
              {type === 'URL' ? 'URL Monitoring' : 'Email Monitoring'}
            </span>
          </div>
          <p className="text-sm text-gray-500">Loading chart...</p>
        </div>
        <div style={{ height: '250px' }} className="flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4  border">
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-semibold truncate" title={domain}>{domain}</h3>
          <span className={`px-2 py-0.5 text-xs font-medium  ${
            type === 'URL'
              ? 'bg-gray-100 text-gray-700'
              : 'bg-gray-200 text-gray-800'
          }`}>
            {type === 'URL' ? 'URL Monitoring' : 'Email Monitoring'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            {shouldZoom ? `Showing last 24 of ${data.length} months` : 'Monthly breach trends'}
          </p>
          <p className="text-xs text-gray-400">Use mouse wheel to zoom • Double-click to reset</p>
        </div>
      </div>

      <div id={`chart-${domain}`} style={{ height: '250px', position: 'relative' }}>
        <Bar ref={chartRef} data={chartData} options={options} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="bg-gray-50 p-1.5  text-center">
          <p className="text-xs text-gray-600">Total</p>
          <p className="text-sm font-semibold text-gray-900">
            {total.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-50 p-1.5  text-center">
          <p className="text-xs text-gray-600">Peak</p>
          <p className="text-sm font-semibold text-gray-900">{maxMonth.month}</p>
        </div>
      </div>
    </div>
  );
}