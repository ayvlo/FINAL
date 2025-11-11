"use client";

import { motion } from "framer-motion";
import { Activity, Brain, Zap } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Detect",
    description: "Continuously monitors KPIs and automatically filters noise to surface real anomalies.",
    color: "from-accent-blue to-accent-taupe",
  },
  {
    icon: Brain,
    title: "Explain",
    description: "Uses causal inference and LLM summaries to uncover root causes of metric changes.",
    color: "from-accent-taupe to-accent-blue",
  },
  {
    icon: Zap,
    title: "Act",
    description: "Triggers automated recovery workflows and notifies teams instantly via Slack.",
    color: "from-accent-blue to-success",
  },
];

export function Features() {
  return (
    <section id="how-it-works" className="section-padding bg-light-bg-secondary">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group card hover:border-accent-taupe/40 hover-lift cursor-pointer"
            >
              <div className="flex flex-col items-center text-center h-full">
                {/* Icon */}
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}
                >
                  <feature.icon className="w-10 h-10 text-white" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-h3 font-semibold mb-4 text-light-text-primary">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-body text-light-text-secondary flex-grow">
                  {feature.description}
                </p>

                {/* Decorative Bottom Border */}
                <div className="mt-6 w-16 h-1 bg-gradient-to-r from-accent-taupe to-accent-blue rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
