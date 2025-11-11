import { KPICard } from "@/components/dashboard/kpi-card";
import { AnomalyFeed } from "@/components/dashboard/anomaly-feed";
import { MetricChart } from "@/components/dashboard/metric-chart";
import { DollarSign, Users, TrendingUp, Zap } from "lucide-react";

export const metadata = {
  title: "Dashboard - Ayvlo",
  description: "Monitor your metrics and anomalies in real-time",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-h1 font-bold text-dark-text-primary mb-2">Overview</h1>
        <p className="text-body text-dark-text-secondary">
          Real-time metrics and anomaly detection for your business
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Monthly Recurring Revenue"
          value="$48.5K"
          change="-8.2%"
          trend="down"
          icon={DollarSign}
          anomaly={true}
        />
        <KPICard
          title="Active Users"
          value="2,847"
          change="+12.5%"
          trend="up"
          icon={Users}
        />
        <KPICard
          title="Conversion Rate"
          value="3.24%"
          change="-4.1%"
          trend="down"
          icon={TrendingUp}
        />
        <KPICard
          title="Actions Executed"
          value="127"
          change="+28.7%"
          trend="up"
          icon={Zap}
        />
      </div>

      {/* Chart */}
      <MetricChart />

      {/* Anomaly Feed */}
      <AnomalyFeed />
    </div>
  );
}
