"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  {
    category: "Core Features",
    items: [
      { name: "Metrics monitored", starter: "10", growth: "100", scale: "Unlimited" },
      { name: "Detection speed", starter: "24h", growth: "Real-time", scale: "Real-time" },
      { name: "Causal explanations", starter: false, growth: true, scale: true },
      { name: "Custom workflows", starter: false, growth: true, scale: true },
      { name: "API access", starter: false, growth: true, scale: true },
    ],
  },
  {
    category: "Integrations",
    items: [
      { name: "Available integrations", starter: "2", growth: "10", scale: "Unlimited" },
      { name: "Stripe", starter: true, growth: true, scale: true },
      { name: "Slack", starter: true, growth: true, scale: true },
      { name: "HubSpot, Notion, Segment", starter: false, growth: true, scale: true },
      { name: "Custom integrations", starter: false, growth: false, scale: true },
    ],
  },
  {
    category: "Alerts & Notifications",
    items: [
      { name: "Email alerts", starter: true, growth: true, scale: true },
      { name: "Slack notifications", starter: true, growth: true, scale: true },
      { name: "SMS alerts", starter: false, growth: true, scale: true },
      { name: "PagerDuty escalation", starter: false, growth: false, scale: true },
      { name: "Custom webhooks", starter: false, growth: true, scale: true },
    ],
  },
  {
    category: "Data & Retention",
    items: [
      { name: "Data retention", starter: "7 days", growth: "30 days", scale: "90 days" },
      { name: "Historical analysis", starter: false, growth: true, scale: true },
      { name: "Data export", starter: false, growth: true, scale: true },
      { name: "Custom data pipelines", starter: false, growth: false, scale: true },
    ],
  },
  {
    category: "Support & SLA",
    items: [
      { name: "Support channel", starter: "Community", growth: "Priority", scale: "Dedicated" },
      { name: "Response time", starter: "48h", growth: "24h", scale: "4h" },
      { name: "Success manager", starter: false, growth: false, scale: true },
      { name: "Uptime SLA", starter: "99%", growth: "99.5%", scale: "99.9%" },
    ],
  },
  {
    category: "Security & Compliance",
    items: [
      { name: "SSO / SAML", starter: false, growth: false, scale: true },
      { name: "SOC 2 Type II", starter: false, growth: false, scale: true },
      { name: "GDPR compliance", starter: true, growth: true, scale: true },
      { name: "Custom data residency", starter: false, growth: false, scale: true },
      { name: "Audit logs", starter: false, growth: true, scale: true },
    ],
  },
];

export function ComparisonTable() {
  const renderCell = (value: string | boolean) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-accent-taupe mx-auto" />
      ) : (
        <X className="w-5 h-5 text-light-text-secondary/30 mx-auto" />
      );
    }
    return <span className="text-body text-light-text-primary">{value}</span>;
  };

  return (
    <section className="section-padding bg-light-bg-secondary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-h2 font-bold text-light-text-primary mb-4">
            Compare features across plans.
          </h2>
          <p className="text-body-large text-light-text-secondary max-w-2xl mx-auto">
            Every plan includes core anomaly detection. Upgrade for advanced AI and automation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="overflow-x-auto"
        >
          <div className="card p-0 min-w-[768px]">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b border-border-gray/20 bg-light-bg-secondary">
              <div className="text-caption font-semibold text-light-text-secondary">
                Feature
              </div>
              <div className="text-center">
                <div className="text-caption font-semibold text-light-text-primary">Starter</div>
                <div className="text-small text-light-text-secondary">$49/mo</div>
              </div>
              <div className="text-center">
                <div className="text-caption font-semibold text-light-text-primary">Growth</div>
                <div className="text-small text-light-text-secondary">$199/mo</div>
              </div>
              <div className="text-center">
                <div className="text-caption font-semibold text-light-text-primary">Scale</div>
                <div className="text-small text-light-text-secondary">$499/mo</div>
              </div>
            </div>

            {/* Table Body */}
            {features.map((section, sectionIndex) => (
              <div key={section.category}>
                <div className="px-6 py-4 bg-light-bg-primary border-b border-border-gray/20">
                  <h3 className="text-caption font-bold text-light-text-primary">
                    {section.category}
                  </h3>
                </div>
                {section.items.map((item, itemIndex) => (
                  <div
                    key={item.name}
                    className={`grid grid-cols-4 gap-4 p-6 ${
                      itemIndex < section.items.length - 1
                        ? "border-b border-border-gray/10"
                        : ""
                    }`}
                  >
                    <div className="text-body text-light-text-primary">{item.name}</div>
                    <div className="text-center">{renderCell(item.starter)}</div>
                    <div className="text-center">{renderCell(item.growth)}</div>
                    <div className="text-center">{renderCell(item.scale)}</div>
                  </div>
                ))}
                {sectionIndex < features.length - 1 && (
                  <div className="border-b-2 border-border-gray/20"></div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
