"use client";

import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  anomaly?: boolean;
}

export function KPICard({ title, value, change, trend, icon: Icon, anomaly }: KPICardProps) {
  const isPositive = trend === "up";

  return (
    <div
      className={`card bg-dark-bg-secondary border ${
        anomaly ? "border-red-500/50 shadow-lg shadow-red-500/10" : "border-border-gray/20"
      } hover:border-accent-taupe/30 transition-all duration-200`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-lg bg-accent-taupe/10">
          <Icon className="w-5 h-5 text-accent-taupe" />
        </div>
        {anomaly && (
          <div className="px-2 py-1 rounded-pill bg-red-500/10 border border-red-500/20">
            <span className="text-small text-red-400 font-semibold">Anomaly</span>
          </div>
        )}
      </div>

      <h3 className="text-caption text-dark-text-secondary mb-2">{title}</h3>
      <p className="text-h2 font-bold text-dark-text-primary mb-3">{value}</p>

      <div className="flex items-center gap-2">
        {isPositive ? (
          <TrendingUp className="w-4 h-4 text-green-500" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500" />
        )}
        <span
          className={`text-body font-medium ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {change}
        </span>
        <span className="text-body text-dark-text-secondary">vs last period</span>
      </div>
    </div>
  );
}
