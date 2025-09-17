import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function LineChartComponent({ data }) {
  const hasData = Array.isArray(data) && data.length > 0 && data.some(d => d.income > 0 || d.expense > 0);
  return (
    <div className="h-64 w-full flex items-center justify-center">
      {hasData ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
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
              dataKey="date"
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
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              name="Income"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#EF4444"
              name="Expense"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-gray-400 text-center w-full">No income or expense data to display</div>
      )}
    </div>
  );
}

export default LineChartComponent;
