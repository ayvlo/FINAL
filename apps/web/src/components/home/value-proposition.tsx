"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const benefits = [
  "Automatic anomaly detection with ML ensemble",
  "Causal explanations powered by AI",
  "Instant recovery workflows",
  "Real-time Slack & email alerts",
];

export function ValueProposition() {
  return (
    <section className="section-padding bg-light-bg-primary">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-h1 font-bold text-light-text-primary mb-6">
              See the full story behind every metric.
            </h2>

            <p className="text-body-large text-light-text-secondary mb-8">
              Ayvlo goes beyond dashboards — automatically finds causes, runs recovery, and
              alerts your team instantly.
            </p>

            <ul className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="mt-1 flex-shrink-0">
                    <Check className="w-6 h-6 text-success" strokeWidth={3} />
                  </div>
                  <span className="text-body text-light-text-primary">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <Link href="/beta">
              <Button size="lg">Get Early Access</Button>
            </Link>
          </motion.div>

          {/* Right: Product Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="card p-8 bg-dark-bg-primary border-2 border-accent-blue/20">
              {/* Simulated Dashboard Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border-gray/20">
                  <h3 className="text-h3 font-semibold text-dark-text-primary">
                    Revenue Analytics
                  </h3>
                  <div className="px-3 py-1 bg-danger/20 text-danger rounded-pill text-caption font-medium">
                    Anomaly Detected
                  </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "MRR", value: "$45.2K", change: "-3.4%" },
                    { label: "Churn Rate", value: "2.8%", change: "+1.2%" },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="p-4 bg-dark-bg-secondary rounded-lg border border-border-gray/20"
                    >
                      <p className="text-caption text-dark-text-secondary mb-1">
                        {metric.label}
                      </p>
                      <p className="text-h3 font-display text-dark-text-primary mb-1">
                        {metric.value}
                      </p>
                      <p className="text-small text-danger">{metric.change}</p>
                    </div>
                  ))}
                </div>

                {/* Explanation Box */}
                <div className="p-4 bg-accent-blue/10 border border-accent-blue/30 rounded-lg">
                  <p className="text-caption font-semibold text-accent-blue mb-2">
                    AI Explanation
                  </p>
                  <p className="text-small text-dark-text-primary">
                    Increased churn likely caused by recent price change. Recommend reviewing
                    cancellation feedback.
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-accent-taupe/20 to-accent-blue/20 rounded-lg blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
