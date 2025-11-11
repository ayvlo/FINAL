"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What counts as a 'metric'?",
    answer:
      "A metric is any time-series data point you want to monitor — revenue, signups, churn, API latency, etc. Each unique metric (e.g., 'MRR') counts as one, regardless of how many data points it contains.",
  },
  {
    question: "How does the 14-day free trial work?",
    answer:
      "No credit card required. Sign up, connect your data sources, and start monitoring metrics immediately. You can cancel anytime during the trial with no charges. After 14 days, choose a plan or downgrade to our free tier (1 metric).",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes! Upgrade or downgrade anytime. If you upgrade mid-cycle, we'll prorate the difference. Downgrades take effect at the start of your next billing cycle.",
  },
  {
    question: "What integrations are included?",
    answer:
      "Starter: Stripe + Slack. Growth: adds HubSpot, Notion, Segment, Google Analytics, PostgreSQL, and 5 more. Scale: all integrations plus custom API connectors. See our full integration list in the docs.",
  },
  {
    question: "Do you offer annual discounts?",
    answer:
      "Yes! Pay annually and save 20% (2 months free). Launch offer: additional 10% off annual plans for the first 100 customers.",
  },
  {
    question: "What happens if I exceed my metric limit?",
    answer:
      "We'll email you a warning at 80% and 100% usage. You can upgrade anytime. If you exceed your limit, we'll continue monitoring but may throttle detection frequency until you upgrade.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We're SOC 2 Type II compliant (Scale plan), use AES-256 encryption at rest, TLS 1.3 in transit, and never sell your data. Full security details in our Trust Center.",
  },
  {
    question: "Can I get a custom enterprise plan?",
    answer:
      "Yes! For teams with 500+ metrics or custom compliance needs (HIPAA, FedRAMP), contact our sales team for a tailored quote.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-padding bg-light-bg-primary">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-h2 font-bold text-light-text-primary mb-4">
            Frequently asked questions.
          </h2>
          <p className="text-body-large text-light-text-secondary max-w-2xl mx-auto">
            Everything you need to know about pricing and plans.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
              className="card"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left flex justify-between items-center gap-4 p-6"
              >
                <h3 className="text-h4 font-semibold text-light-text-primary">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-light-text-secondary flex-shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 pb-6"
                >
                  <p className="text-body text-light-text-secondary">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
