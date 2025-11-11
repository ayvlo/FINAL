"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "For early-stage startups testing the waters.",
    features: [
      "Up to 10 metrics monitored",
      "24-hour anomaly detection",
      "Email alerts",
      "7-day data retention",
      "Community support",
      "2 integrations (Stripe, Slack)",
    ],
    cta: "Start Free Trial",
    href: "/beta",
    popular: false,
    gradient: "from-accent-blue/5 to-accent-blue/10",
  },
  {
    name: "Growth",
    price: "$199",
    period: "/month",
    description: "For growing teams who need real-time insights.",
    features: [
      "Up to 100 metrics monitored",
      "Real-time anomaly detection",
      "Slack + email + SMS alerts",
      "30-day data retention",
      "Priority support (24h SLA)",
      "10 integrations included",
      "Custom action workflows",
      "Causal explanations with AI",
      "API access",
    ],
    cta: "Start Free Trial",
    href: "/beta",
    popular: true,
    gradient: "from-accent-taupe/10 to-accent-taupe/20",
  },
  {
    name: "Scale",
    price: "$499",
    period: "/month",
    description: "For enterprises with advanced compliance needs.",
    features: [
      "Unlimited metrics",
      "Real-time detection + explanations",
      "Multi-channel alerts",
      "90-day data retention",
      "Dedicated success manager",
      "Unlimited integrations",
      "Advanced workflow automation",
      "Custom ML model tuning",
      "SSO + SAML",
      "GDPR + SOC 2 compliance",
      "SLA uptime guarantee (99.9%)",
      "Dedicated infrastructure",
    ],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
    gradient: "from-purple-500/5 to-purple-500/10",
  },
];

export function PricingTiers() {
  return (
    <section className="section-padding bg-light-bg-primary">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className={`relative card hover-lift ${
                tier.popular ? "border-2 border-accent-taupe shadow-lg scale-105" : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 rounded-pill bg-gradient-to-r from-accent-taupe to-accent-blue text-white text-small font-semibold flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className={`p-8 rounded-lg bg-gradient-to-br ${tier.gradient} mb-6`}>
                <h3 className="text-h3 font-bold text-light-text-primary mb-2">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-h1 font-bold text-light-text-primary">
                    {tier.price}
                  </span>
                  <span className="text-body text-light-text-secondary">{tier.period}</span>
                </div>
                <p className="text-body text-light-text-secondary">{tier.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent-taupe mt-0.5 flex-shrink-0" />
                    <span className="text-body text-light-text-primary">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={tier.href} className="block">
                <Button
                  size="lg"
                  className={
                    tier.popular
                      ? "btn-primary w-full"
                      : "btn-secondary w-full"
                  }
                >
                  {tier.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
