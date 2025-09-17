import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#8B5CF6', '#EF4444'];

function DonutChart({ data }) {
  const hasData = Array.isArray(data) && data.length > 0 && data.some(d => d.value > 0);
  return (
    <div className="h-64 w-full flex items-center justify-center">
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.5rem',
                padding: '0.5rem'
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              layout="horizontal"
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-gray-400 text-center w-full">No expense data to display</div>
      )}
    </div>
  );
}

export default DonutChart;
