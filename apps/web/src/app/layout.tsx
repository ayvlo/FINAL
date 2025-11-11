import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ayvlo — Autonomous Business Intelligence",
  description:
    "Ayvlo continuously detects anomalies, explains them, and takes action — before revenue is lost.",
  keywords: ["business intelligence", "anomaly detection", "autonomous AI", "SaaS analytics"],
  authors: [{ name: "Ayvlo Team" }],
  openGraph: {
    title: "Ayvlo — Autonomous Business Intelligence",
    description: "Less noise. More vision. Detect → Explain → Act.",
    url: "https://ayvlo.com",
    siteName: "Ayvlo",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayvlo — Autonomous Business Intelligence",
    description: "Detect → Explain → Act on business anomalies automatically.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
