"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Ayvlo caught a payment failure spike before we even noticed. Recovered $50K in MRR automatically.",
    author: "Sarah Chen",
    role: "CEO, GrowthLabs",
    avatar: "SC",
  },
  {
    quote:
      "The causal explanations are incredible — it's like having a data scientist on call 24/7.",
    author: "Marcus Johnson",
    role: "VP Product, DataFlow",
    avatar: "MJ",
  },
  {
    quote:
      "Cut our time to insight from days to minutes. Ayvlo is the autonomous BI we've been waiting for.",
    author: "Elena Rodriguez",
    role: "Head of Analytics, ScaleUp",
    avatar: "ER",
  },
];

const integrations = ["Stripe", "Slack", "HubSpot", "Notion", "Segment"];

export function Testimonials() {
  return (
    <section className="section-padding bg-light-bg-secondary">
      <div className="container-custom">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-h2 font-bold text-light-text-primary mb-4">
            Trusted by founders and growth teams.
          </h2>
        </motion.div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="card hover-lift"
            >
              <Quote className="w-10 h-10 text-accent-taupe mb-4" />
              <p className="text-body text-light-text-primary mb-6 italic">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-taupe to-accent-blue flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-caption font-semibold text-light-text-primary">
                    {testimonial.author}
                  </p>
                  <p className="text-small text-light-text-secondary">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-caption text-light-text-secondary mb-6 font-medium">
            INTEGRATED WITH
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {integrations.map((integration) => (
              <div
                key={integration}
                className="text-h3 font-display text-light-text-secondary/40 hover:text-light-text-secondary transition-colors duration-200"
              >
                {integration}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
