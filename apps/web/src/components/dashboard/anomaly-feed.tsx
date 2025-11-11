"use client";

import { AlertTriangle, TrendingDown, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

const anomalies = [
  {
    id: 1,
    metric: "Monthly Recurring Revenue",
    severity: "critical",
    change: "-8.2%",
    detected: "2 hours ago",
    explanation:
      "Payment failures spiked 45% due to expired cards. Stripe retry logic failed for 127 customers.",
    suggested_action: "Auto-retry failed payments with updated billing reminder",
    trend: "down",
  },
  {
    id: 2,
    metric: "Signup Conversion Rate",
    severity: "warning",
    change: "-12.5%",
    detected: "5 hours ago",
    explanation:
      "Onboarding flow abandonment increased after new feature modal was added on step 2.",
    suggested_action: "A/B test removing modal or delaying to step 4",
    trend: "down",
  },
  {
    id: 3,
    metric: "API Latency (p95)",
    severity: "info",
    change: "+35ms",
    detected: "1 day ago",
    explanation:
      "Database query performance degraded. High join complexity on metrics aggregation endpoint.",
    suggested_action: "Add index on metrics.timestamp and metrics.tenant_id",
    trend: "up",
  },
];

const severityColors = {
  critical: "border-red-500/50 bg-red-500/5",
  warning: "border-orange-500/50 bg-orange-500/5",
  info: "border-blue-500/50 bg-blue-500/5",
};

const severityBadgeColors = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  warning: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export function AnomalyFeed() {
  return (
    <div className="card bg-dark-bg-secondary border-border-gray/20 p-0">
      <div className="p-6 border-b border-border-gray/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-accent-taupe" />
          <h2 className="text-h4 font-bold text-dark-text-primary">Recent Anomalies</h2>
        </div>
        <Link
          href="/dashboard/anomalies"
          className="text-caption text-accent-taupe font-semibold hover:text-accent-taupe/80 transition-colors duration-200 flex items-center gap-1"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="divide-y divide-border-gray/20">
        {anomalies.map((anomaly) => (
          <div
            key={anomaly.id}
            className={`p-6 border-l-4 ${severityColors[anomaly.severity as keyof typeof severityColors]} hover:bg-dark-bg-primary/50 transition-all duration-200`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-body font-semibold text-dark-text-primary">
                    {anomaly.metric}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-pill border text-small font-medium ${
                      severityBadgeColors[anomaly.severity as keyof typeof severityBadgeColors]
                    }`}
                  >
                    {anomaly.severity}
                  </span>
                </div>
                <p className="text-small text-dark-text-secondary">{anomaly.detected}</p>
              </div>
              <div className="flex items-center gap-2">
                {anomaly.trend === "down" ? (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                )}
                <span
                  className={`text-h4 font-bold ${
                    anomaly.trend === "down" ? "text-red-500" : "text-orange-500"
                  }`}
                >
                  {anomaly.change}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-accent-blue/10 border border-accent-blue/20">
                <p className="text-small text-dark-text-secondary mb-1 font-semibold">
                  AI Explanation
                </p>
                <p className="text-body text-dark-text-primary">{anomaly.explanation}</p>
              </div>

              <div className="p-3 rounded-lg bg-accent-taupe/10 border border-accent-taupe/20">
                <p className="text-small text-dark-text-secondary mb-1 font-semibold">
                  Suggested Action
                </p>
                <p className="text-body text-dark-text-primary">{anomaly.suggested_action}</p>
              </div>

              <div className="flex gap-2">
                <button className="btn-primary text-small px-4 py-2">Execute Action</button>
                <button className="btn-secondary text-small px-4 py-2">Dismiss</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
