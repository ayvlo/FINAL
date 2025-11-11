"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="section-padding bg-gradient-to-r from-accent-blue to-accent-taupe">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-h1 font-bold text-white mb-6">
            Start your autonomous BI journey today.
          </h2>
          <p className="text-body-large text-white/90 mb-10">
            Join hundreds of companies using Ayvlo to detect, explain, and act on business
            anomalies automatically.
          </p>
          <Link href="/beta">
            <Button
              size="lg"
              variant="outline"
              className="bg-white text-light-text-primary hover:bg-white/90 border-none group"
            >
              Join the Beta
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
