"use client";

import { motion } from "framer-motion";

export function PricingHero() {
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
              TRANSPARENT PRICING
            </span>
          </div>

          <h1 className="text-display font-bold text-light-text-primary mb-6">
            Plans that scale
            <br />
            <span className="text-accent-taupe">with your growth.</span>
          </h1>

          <p className="text-body-large text-light-text-secondary mb-8">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>

          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-pill bg-green-500/10 border border-green-500/20">
            <span className="text-body text-green-700 font-semibold">
              🎉 Launch Offer: 20% off annual plans
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
