
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ModernDonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  height?: number;
  centerLabel?: string;
  centerValue?: string;
}

const defaultColors = ['#1a4d3a', '#20b2aa', '#7dd3c7', '#ffc107', '#ff8c00', '#dc3545'];

export default function ModernDonutChart({ 
  data, 
  height = 300, 
  centerLabel,
  centerValue 
}: ModernDonutChartProps) {
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || defaultColors[index % defaultColors.length]
  }));

  return (
    <div className="relative w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithColors}
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="70%"
            paddingAngle={3}
            dataKey="value"
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      {(centerLabel || centerValue) && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            {centerValue && (
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {centerValue}
              </div>
            )}
            {centerLabel && (
              <div className="text-sm text-gray-600 uppercase tracking-wide">
                {centerLabel}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
