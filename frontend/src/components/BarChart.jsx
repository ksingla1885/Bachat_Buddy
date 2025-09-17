import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function BarChartComponent({ data }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `₹${value.toLocaleString()}`}
          />
          <Tooltip
            formatter={(value) => `₹${value.toLocaleString()}`}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '0.5rem',
              padding: '0.5rem'
            }}
          />
          <Legend />
          <Bar dataKey="budget" fill="#6366F1" name="Budget" />
          <Bar dataKey="spent" fill="#EF4444" name="Spent" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;
