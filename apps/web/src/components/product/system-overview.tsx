"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function SystemOverview() {
  return (
    <section className="section-padding bg-light-bg-secondary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-h2 font-bold text-light-text-primary mb-4">
            How it all works together.
          </h2>
          <p className="text-body-large text-light-text-secondary max-w-2xl mx-auto">
            From data ingestion to automated action — the full autonomous loop.
          </p>
        </motion.div>

        {/* System Flow Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="card p-8 lg:p-12 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              {/* Step 1: Data Sources */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-accent-blue to-accent-blue/70 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h4 className="text-caption font-semibold text-light-text-primary mb-2">
                  Data Sources
                </h4>
                <p className="text-small text-light-text-secondary">
                  Stripe, GA, Postgres, APIs
                </p>
              </div>

              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-6 h-6 text-light-text-secondary/30" />
              </div>

              {/* Step 2: Detection */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-accent-taupe to-accent-taupe/70 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h4 className="text-caption font-semibold text-light-text-primary mb-2">
                  Detection
                </h4>
                <p className="text-small text-light-text-secondary">
                  ML ensemble finds anomalies
                </p>
              </div>

              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-6 h-6 text-light-text-secondary/30" />
              </div>

              {/* Step 3: Explanation */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-purple-500 to-purple-500/70 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h4 className="text-caption font-semibold text-light-text-primary mb-2">
                  Explanation
                </h4>
                <p className="text-small text-light-text-secondary">
                  Causal AI reveals root cause
                </p>
              </div>
            </div>

            <div className="my-8 flex justify-center">
              <ArrowRight className="w-6 h-6 text-light-text-secondary/30 rotate-90 md:hidden" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-start-2 text-center">
                <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-green-500 to-green-500/70 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">4</span>
                </div>
                <h4 className="text-caption font-semibold text-light-text-primary mb-2">
                  Action
                </h4>
                <p className="text-small text-light-text-secondary">
                  Automated workflows execute
                </p>
              </div>

              <div className="hidden md:flex justify-center">
                <ArrowRight className="w-6 h-6 text-light-text-secondary/30" />
              </div>

              {/* Step 5: Verification */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-lg bg-gradient-to-br from-orange-500 to-orange-500/70 flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">5</span>
                </div>
                <h4 className="text-caption font-semibold text-light-text-primary mb-2">
                  Verification
                </h4>
                <p className="text-small text-light-text-secondary">
                  Closed-loop confirmation
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tech Stack Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-caption text-light-text-secondary mb-4 font-medium">
            POWERED BY
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {["FastAPI", "ClickHouse", "Prophet", "DoWhy", "PostgreSQL", "Redpanda"].map(
              (tech) => (
                <span
                  key={tech}
                  className="text-body font-mono text-light-text-secondary/60 hover:text-accent-taupe transition-colors duration-200"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
