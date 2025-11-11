import { PricingHero } from "@/components/pricing/pricing-hero";
import { PricingTiers } from "@/components/pricing/pricing-tiers";
import { ComparisonTable } from "@/components/pricing/comparison-table";
import { FAQ } from "@/components/pricing/faq";
import { CTA } from "@/components/home/cta";

export const metadata = {
  title: "Pricing - Ayvlo | Transparent Plans for Every Stage",
  description:
    "Start with a 14-day free trial. Choose from Starter ($49), Growth ($199), or Scale ($499+) plans. All plans include anomaly detection and 24/7 monitoring.",
};

export default function PricingPage() {
  return (
    <main>
      <PricingHero />
      <PricingTiers />
      <ComparisonTable />
      <FAQ />
      <CTA />
    </main>
  );
}
