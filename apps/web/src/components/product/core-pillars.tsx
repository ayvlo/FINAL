"use client";

import { motion } from "framer-motion";
import { Activity, Brain, Zap, TrendingDown, Search, CheckCircle } from "lucide-react";

const pillars = [
  {
    icon: Activity,
    title: "DETECT",
    headline: "Catch every anomaly. Miss nothing.",
    description:
      "Our ML ensemble (Prophet + IsolationForest + LSTM) monitors every metric 24/7. Statistical, seasonal, and behavioral anomalies surface instantly.",
    features: [
      "Real-time anomaly detection across all metrics",
      "Multi-algorithm ensemble for highest accuracy",
      "Auto-tuned sensitivity per metric context",
      "Zero false positives with adaptive learning",
    ],
    gradient: "from-accent-blue/10 to-accent-blue/5",
    iconColor: "text-accent-blue",
  },
  {
    icon: Brain,
    title: "EXPLAIN",
    headline: "Know the 'why' behind every change.",
    description:
      "Causal AI analyzes thousands of potential drivers and surfaces the true root cause — not just correlations. Get natural language explanations in seconds.",
    features: [
      "Causal inference with DoWhy & EconML",
      "Multi-dimensional driver analysis",
      "Natural language explanations via LLM",
      "Visual causal graphs for transparency",
    ],
    gradient: "from-accent-taupe/10 to-accent-taupe/5",
    iconColor: "text-accent-taupe",
  },
  {
    icon: Zap,
    title: "ACT",
    headline: "Fix issues before they escalate.",
    description:
      "Automated workflows trigger corrective actions via integrations. From Slack alerts to Stripe retries to PagerDuty escalations — all policy-driven.",
    features: [
      "Pre-built workflow templates for common scenarios",
      "Custom action builder with if-then logic",
      "Multi-channel notifications (Slack, email, SMS)",
      "Closed-loop verification and rollback",
    ],
    gradient: "from-purple-500/10 to-purple-500/5",
    iconColor: "text-purple-500",
  },
];

export function CorePillars() {
  return (
    <section className="section-padding bg-light-bg-primary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-h2 font-bold text-light-text-primary mb-4">
            Three pillars. One autonomous loop.
          </h2>
          <p className="text-body-large text-light-text-secondary max-w-2xl mx-auto">
            Ayvlo closes the gap between detection and resolution.
          </p>
        </motion.div>

        <div className="space-y-24">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  isEven ? "" : "lg:grid-flow-dense"
                }`}
              >
                {/* Content */}
                <div className={isEven ? "lg:pr-8" : "lg:pl-8 lg:col-start-2"}>
                  <div className="inline-flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${pillar.gradient}`}>
                      <Icon className={`w-6 h-6 ${pillar.iconColor}`} />
                    </div>
                    <span className={`text-caption font-bold ${pillar.iconColor}`}>
                      {pillar.title}
                    </span>
                  </div>

                  <h3 className="text-h3 font-bold text-light-text-primary mb-4">
                    {pillar.headline}
                  </h3>

                  <p className="text-body text-light-text-secondary mb-6">
                    {pillar.description}
                  </p>

                  <ul className="space-y-3">
                    {pillar.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-accent-taupe mt-0.5 flex-shrink-0" />
                        <span className="text-body text-light-text-primary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Visual mockup */}
                <div className={isEven ? "lg:col-start-2" : "lg:col-start-1"}>
                  <div className={`card p-8 bg-gradient-to-br ${pillar.gradient} border-2`}>
                    <div className="aspect-video bg-white/50 rounded-lg flex items-center justify-center">
                      <Icon className={`w-16 h-16 ${pillar.iconColor} opacity-30`} />
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="h-3 bg-light-text-primary/10 rounded w-3/4"></div>
                      <div className="h-3 bg-light-text-primary/10 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
