"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function ProductHero() {
  return (
    <section className="section-padding bg-gradient-to-b from-light-bg-primary to-light-bg-secondary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-block px-4 py-2 rounded-pill bg-accent-taupe/10 border border-accent-taupe/20 mb-6">
            <span className="text-caption text-accent-taupe font-semibold">
              AUTONOMOUS BI PLATFORM
            </span>
          </div>

          <h1 className="text-display font-bold text-light-text-primary mb-6">
            Understand every metric.
            <br />
            <span className="text-accent-taupe">Automatically.</span>
          </h1>

          <p className="text-body-large text-light-text-secondary mb-10 max-w-2xl mx-auto">
            Ayvlo detects anomalies, explains root causes with causal AI, and executes
            corrective actions — all without human intervention.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/beta">
              <Button size="lg" className="btn-primary group">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="btn-secondary">
                Watch Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
