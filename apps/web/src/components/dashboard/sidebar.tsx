"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  AlertTriangle,
  Zap,
  Settings,
  BarChart3,
  Bell,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Metrics", href: "/dashboard/metrics", icon: BarChart3 },
  { name: "Anomalies", href: "/dashboard/anomalies", icon: AlertTriangle },
  { name: "Actions", href: "/dashboard/actions", icon: Zap },
  { name: "Alerts", href: "/dashboard/alerts", icon: Bell },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-dark-bg-secondary border-r border-border-gray/20 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border-gray/20">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-taupe to-accent-blue flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">A</span>
          </div>
          <span className="font-display font-semibold text-lg text-dark-text-primary">
            Ayvlo
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-body font-medium transition-all duration-200 ${
                isActive
                  ? "bg-accent-taupe/10 text-accent-taupe"
                  : "text-dark-text-primary/70 hover:bg-dark-bg-primary hover:text-dark-text-primary"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-border-gray/20">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-dark-bg-primary">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-taupe to-accent-blue flex items-center justify-center text-white font-semibold text-sm">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-caption font-semibold text-dark-text-primary truncate">
              John Doe
            </p>
            <p className="text-small text-dark-text-secondary truncate">
              john@company.com
            </p>
          </div>
        </div>
        <button className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-lg text-body font-medium text-dark-text-primary/70 hover:bg-dark-bg-primary hover:text-dark-text-primary transition-all duration-200">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
