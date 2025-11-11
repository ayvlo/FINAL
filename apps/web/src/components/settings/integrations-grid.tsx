"use client";

import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const integrations = [
  {
    name: "Stripe",
    description: "Payment processing and subscription metrics",
    category: "Payments",
    connected: true,
    logo: "💳",
    metrics: ["MRR", "Churn", "Payment Success Rate"],
  },
  {
    name: "Slack",
    description: "Real-time alerts and notifications",
    category: "Communication",
    connected: true,
    logo: "💬",
    metrics: ["Alerts", "Action Confirmations"],
  },
  {
    name: "HubSpot",
    description: "CRM and sales pipeline analytics",
    category: "CRM",
    connected: false,
    logo: "🎯",
    metrics: ["Lead Conversion", "Deal Velocity"],
  },
  {
    name: "Notion",
    description: "Document and knowledge base tracking",
    category: "Productivity",
    connected: true,
    logo: "📝",
    metrics: ["Page Views", "Team Activity"],
  },
  {
    name: "Segment",
    description: "Customer data platform integration",
    category: "Analytics",
    connected: false,
    logo: "📊",
    metrics: ["Event Volume", "User Traits"],
  },
  {
    name: "PostgreSQL",
    description: "Direct database connection for custom metrics",
    category: "Database",
    connected: true,
    logo: "🐘",
    metrics: ["Custom SQL Queries"],
  },
  {
    name: "Google Analytics",
    description: "Website traffic and conversion metrics",
    category: "Analytics",
    connected: false,
    logo: "📈",
    metrics: ["Sessions", "Bounce Rate", "Goals"],
  },
  {
    name: "PagerDuty",
    description: "Incident management and escalation",
    category: "DevOps",
    connected: false,
    logo: "🚨",
    metrics: ["Incidents", "Response Time"],
  },
];

export function IntegrationsGrid() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h3 font-bold text-dark-text-primary mb-2">Integrations</h2>
        <p className="text-body text-dark-text-secondary">
          Connect your data sources and action channels
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className={`card bg-dark-bg-secondary border ${
              integration.connected
                ? "border-accent-taupe/30"
                : "border-border-gray/20"
            } hover:border-accent-taupe/50 transition-all duration-200`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{integration.logo}</div>
                <div>
                  <h3 className="text-h4 font-semibold text-dark-text-primary">
                    {integration.name}
                  </h3>
                  <span className="text-small text-dark-text-secondary">
                    {integration.category}
                  </span>
                </div>
              </div>
              {integration.connected && (
                <div className="p-1 rounded-full bg-green-500/10">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
              )}
            </div>

            <p className="text-body text-dark-text-secondary mb-4">
              {integration.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {integration.metrics.map((metric) => (
                <span
                  key={metric}
                  className="px-2 py-1 rounded-pill bg-accent-taupe/10 text-small text-accent-taupe font-medium"
                >
                  {metric}
                </span>
              ))}
            </div>

            <Button
              className={
                integration.connected
                  ? "btn-secondary w-full"
                  : "btn-primary w-full"
              }
            >
              {integration.connected ? (
                "Configure"
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Connect
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
