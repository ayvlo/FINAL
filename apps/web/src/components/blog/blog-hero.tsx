"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

export function BlogHero() {
  return (
    <section className="section-padding bg-gradient-to-b from-light-bg-primary to-light-bg-secondary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-block px-4 py-2 rounded-pill bg-accent-taupe/10 border border-accent-taupe/20 mb-6">
            <span className="text-caption text-accent-taupe font-semibold">
              RESOURCES & INSIGHTS
            </span>
          </div>

          <h1 className="text-display font-bold text-light-text-primary mb-6">
            Learn about
            <br />
            <span className="text-accent-taupe">autonomous BI.</span>
          </h1>

          <p className="text-body-large text-light-text-secondary mb-10">
            Guides, case studies, and insights on anomaly detection, causal AI, and automation.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-secondary" />
            <input
              type="text"
              placeholder="Search articles, guides, case studies..."
              className="input w-full pl-12"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
