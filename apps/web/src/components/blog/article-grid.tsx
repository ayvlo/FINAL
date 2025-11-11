"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

const articles = [
  {
    category: "Case Study",
    title: "How GrowthLabs Recovered $50K MRR with Automated Payment Retries",
    excerpt:
      "Learn how an early-stage SaaS company used Ayvlo's causal AI to identify payment failure patterns and implement automated recovery workflows.",
    author: "Sarah Chen",
    date: "2025-01-15",
    readTime: "8 min",
    href: "/blog/growlabs-case-study",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    category: "Guide",
    title: "The Complete Guide to Anomaly Detection for SaaS Metrics",
    excerpt:
      "Statistical vs. ML-based detection, when to use Prophet vs. IsolationForest, and how to tune sensitivity for your business context.",
    author: "Marcus Johnson",
    date: "2025-01-10",
    readTime: "12 min",
    href: "/blog/anomaly-detection-guide",
    gradient: "from-accent-blue to-blue-600",
  },
  {
    category: "Technical",
    title: "Causal Inference 101: Moving Beyond Correlation in Analytics",
    excerpt:
      "Why traditional BI tools show you 'what changed' but not 'why it changed' — and how causal AI closes that gap.",
    author: "Elena Rodriguez",
    date: "2025-01-05",
    readTime: "10 min",
    href: "/blog/causal-inference-101",
    gradient: "from-accent-taupe to-orange-500",
  },
  {
    category: "Product Update",
    title: "Introducing Action Workflows: From Detection to Resolution in Seconds",
    excerpt:
      "Our new workflow builder lets you chain actions across Slack, Stripe, HubSpot, and custom APIs — no code required.",
    author: "Ayvlo Team",
    date: "2025-01-01",
    readTime: "5 min",
    href: "/blog/action-workflows-launch",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    category: "Best Practices",
    title: "5 Metrics Every B2B SaaS Should Monitor (And How to Set Them Up)",
    excerpt:
      "MRR, churn, activation rate, NPS, and burn multiple — plus pre-configured templates to get started in minutes.",
    author: "Sarah Chen",
    date: "2024-12-20",
    readTime: "7 min",
    href: "/blog/5-metrics-saas",
    gradient: "from-orange-500 to-red-500",
  },
  {
    category: "Customer Story",
    title: "DataFlow Cuts Time-to-Insight from Days to Minutes with Ayvlo",
    excerpt:
      "How a data infrastructure company replaced manual dashboards with autonomous anomaly monitoring.",
    author: "Marcus Johnson",
    date: "2024-12-15",
    readTime: "6 min",
    href: "/blog/dataflow-customer-story",
    gradient: "from-cyan-500 to-blue-500",
  },
];

const categories = ["All", "Case Studies", "Guides", "Technical", "Product Updates"];

export function ArticleGrid() {
  return (
    <section className="section-padding bg-light-bg-primary">
      <div className="container-custom">
        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 mb-12 justify-center"
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-pill text-body font-medium transition-all duration-200 ${
                category === "All"
                  ? "bg-accent-taupe text-white"
                  : "bg-light-bg-secondary text-light-text-secondary hover:bg-light-bg-secondary/80"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Article grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="card hover-lift group"
            >
              {/* Category badge */}
              <div className={`h-2 w-full rounded-t-lg bg-gradient-to-r ${article.gradient} mb-6`}></div>

              <div className="px-6 pb-6">
                <div className="inline-block px-3 py-1 rounded-pill bg-light-bg-secondary text-small text-light-text-secondary font-medium mb-4">
                  {article.category}
                </div>

                <h3 className="text-h4 font-bold text-light-text-primary mb-3 group-hover:text-accent-taupe transition-colors duration-200">
                  {article.title}
                </h3>

                <p className="text-body text-light-text-secondary mb-6 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between text-small text-light-text-secondary mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border-gray/20">
                  <span className="text-caption text-light-text-secondary">{article.author}</span>
                  <Link
                    href={article.href}
                    className="text-caption text-accent-taupe font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
