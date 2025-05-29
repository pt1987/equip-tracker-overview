
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ModernBarChartProps {
  data: Array<{
    name: string;
    [key: string]: any;
  }>;
  dataKeys: Array<{
    key: string;
    name: string;
    color?: string;
  }>;
  height?: number;
  stacked?: boolean;
}

const defaultColors = ['#1a4d3a', '#20b2aa', '#7dd3c7', '#ffc107', '#ff8c00', '#dc3545'];

export default function ModernBarChart({ 
  data, 
  dataKeys, 
  height = 300, 
  stacked = false 
}: ModernBarChartProps) {
  return (
    <div className="dashboard-chart-container" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e9ecef' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e9ecef' }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)'
            }}
          />
          <Legend />
          {dataKeys.map((item, index) => (
            <Bar
              key={item.key}
              dataKey={item.key}
              name={item.name}
              fill={item.color || defaultColors[index % defaultColors.length]}
              radius={[2, 2, 0, 0]}
              stackId={stacked ? 'stack' : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
