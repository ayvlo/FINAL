"use client";

import { motion } from "framer-motion";
import { DollarSign, Users, ShoppingCart, AlertTriangle } from "lucide-react";

const useCases = [
  {
    icon: DollarSign,
    title: "Revenue Protection",
    description:
      "Detect payment failures, subscription cancellations, and pricing anomalies. Auto-retry failed charges and alert your team instantly.",
    metrics: ["MRR", "Churn Rate", "Payment Success Rate"],
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Users,
    title: "User Growth Monitoring",
    description:
      "Catch sudden drops in signups, activation, or retention. Identify the exact feature or campaign causing the change.",
    metrics: ["DAU/MAU", "Signup Rate", "Activation Rate"],
    gradient: "from-accent-blue to-blue-600",
  },
  {
    icon: ShoppingCart,
    title: "E-commerce Operations",
    description:
      "Monitor cart abandonment, conversion rates, and inventory issues. Trigger automated discounts or restocking workflows.",
    metrics: ["Conversion Rate", "AOV", "Cart Abandonment"],
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: AlertTriangle,
    title: "System Health",
    description:
      "Track API latency, error rates, and service uptime. Auto-scale infrastructure or roll back deployments when anomalies occur.",
    metrics: ["Latency", "Error Rate", "Uptime"],
    gradient: "from-orange-500 to-red-500",
  },
];

export function UseCases() {
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
            Built for every team.
          </h2>
          <p className="text-body-large text-light-text-secondary max-w-2xl mx-auto">
            From revenue operations to engineering — Ayvlo adapts to your metrics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="card hover-lift group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`p-4 rounded-lg bg-gradient-to-br ${useCase.gradient} flex-shrink-0`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-h4 font-bold text-light-text-primary mb-2">
                      {useCase.title}
                    </h3>
                  </div>
                </div>

                <p className="text-body text-light-text-secondary mb-6">
                  {useCase.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {useCase.metrics.map((metric) => (
                    <span
                      key={metric}
                      className="px-3 py-1 rounded-pill bg-light-bg-secondary text-small text-light-text-primary font-medium"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
