"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-light-bg-primary to-light-bg-secondary overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent-taupe/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main Headline */}
          <h1 className="text-display font-bold text-light-text-primary mb-6">
            Your Autonomous Intelligence Layer
          </h1>

          {/* Subheadline */}
          <p className="text-body-large text-light-text-secondary max-w-2xl mx-auto mb-12">
            Ayvlo continuously detects anomalies, explains them, and takes action — before
            revenue is lost.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/beta">
              <Button size="lg" className="group">
                Join Beta
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="secondary" size="lg">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Animated Dots (Detect → Explain → Act) */}
          <div className="mt-24 flex justify-center items-center gap-8">
            {["Detect", "Explain", "Act"].map((label, i) => (
              <motion.div
                key={label}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-accent-taupe to-accent-blue flex items-center justify-center mb-2"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(198, 166, 120, 0.5)",
                      "0 0 40px rgba(63, 142, 252, 0.8)",
                      "0 0 20px rgba(198, 166, 120, 0.5)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                >
                  <span className="text-white font-display font-semibold">{i + 1}</span>
                </motion.div>
                <span className="text-caption text-light-text-secondary font-medium">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-light-text-secondary rounded-full p-1">
          <motion.div
            className="w-1 h-2 bg-accent-taupe rounded-full mx-auto"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
