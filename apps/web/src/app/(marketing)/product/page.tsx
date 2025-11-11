import { ProductHero } from "@/components/product/product-hero";
import { CorePillars } from "@/components/product/core-pillars";
import { SystemOverview } from "@/components/product/system-overview";
import { UseCases } from "@/components/product/use-cases";
import { CTA } from "@/components/home/cta";

export const metadata = {
  title: "Product - Ayvlo | Autonomous Business Intelligence",
  description:
    "Detect anomalies, explain root causes, and execute actions automatically. Ayvlo's three pillars close the loop from detection to resolution.",
};

export default function ProductPage() {
  return (
    <main>
      <ProductHero />
      <CorePillars />
      <SystemOverview />
      <UseCases />
      <CTA />
    </main>
  );
}
