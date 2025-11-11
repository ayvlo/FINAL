"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="section-padding bg-gradient-to-r from-accent-blue to-accent-taupe">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-h2 font-bold text-white mb-4">
            Stay ahead of the curve.
          </h2>

          <p className="text-body-large text-white/90 mb-8">
            Get the latest insights on anomaly detection, causal AI, and autonomous analytics
            delivered to your inbox every week.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input flex-1 bg-white/90 border-none text-light-text-primary placeholder:text-light-text-secondary"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-white text-light-text-primary hover:bg-white/90 border-none"
            >
              Subscribe
            </Button>
          </form>

          <p className="text-small text-white/70 mt-4">
            Join 2,000+ founders and data leaders. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
