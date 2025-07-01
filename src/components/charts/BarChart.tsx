import React from 'react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: DataPoint[];
  height?: number;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  height = 200, 
  className = '' 
}) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full flex items-end justify-center mb-2" style={{ height: height - 40 }}>
              <div
                className={`w-full rounded-t-md transition-all duration-300 ${
                  item.color || 'bg-blue-500 dark:bg-blue-600'
                }`}
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
                title={`${item.label}: ${item.value}`}
              />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};