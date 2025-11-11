"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { date: "Jan 1", value: 45000 },
  { date: "Jan 5", value: 47200 },
  { date: "Jan 10", value: 48500 },
  { date: "Jan 15", value: 49800 },
  { date: "Jan 20", value: 51200 },
  { date: "Jan 25", value: 47000 }, // Anomaly point
  { date: "Jan 30", value: 48500 },
];

export function MetricChart() {
  return (
    <div className="card bg-dark-bg-secondary border-border-gray/20">
      <div className="mb-6">
        <h2 className="text-h4 font-bold text-dark-text-primary mb-2">MRR Trend (30 Days)</h2>
        <p className="text-body text-dark-text-secondary">
          Real-time tracking with anomaly detection
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2B30" />
          <XAxis
            dataKey="date"
            stroke="#C6A678"
            tick={{ fill: "#C6A678" }}
            tickLine={{ stroke: "#C6A678" }}
          />
          <YAxis
            stroke="#C6A678"
            tick={{ fill: "#C6A678" }}
            tickLine={{ stroke: "#C6A678" }}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1E1F23",
              border: "1px solid #C6A678",
              borderRadius: "8px",
              color: "#F8F8F8",
            }}
            labelStyle={{ color: "#C6A678" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3F8EFC"
            strokeWidth={3}
            dot={{ fill: "#3F8EFC", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
