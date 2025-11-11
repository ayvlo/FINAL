import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { ValueProposition } from "@/components/home/value-proposition";
import { Testimonials } from "@/components/home/testimonials";
import { CTA } from "@/components/home/cta";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <ValueProposition />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
