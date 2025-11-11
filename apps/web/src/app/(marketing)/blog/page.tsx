import { BlogHero } from "@/components/blog/blog-hero";
import { ArticleGrid } from "@/components/blog/article-grid";
import { Newsletter } from "@/components/blog/newsletter";

export const metadata = {
  title: "Resources & Blog - Ayvlo | Insights on Autonomous BI",
  description:
    "Guides, case studies, and insights on anomaly detection, causal AI, and automated workflows. Learn how to build autonomous business intelligence.",
};

export default function BlogPage() {
  return (
    <main>
      <BlogHero />
      <ArticleGrid />
      <Newsletter />
    </main>
  );
}
