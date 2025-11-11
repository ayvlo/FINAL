import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ayvlo Brand Colors
        accent: {
          taupe: "#C6A678",
          blue: "#3F8EFC",
        },
        // Light Theme
        light: {
          bg: {
            primary: "#F8F8F8",
            secondary: "#F0F0F2",
            card: "#FFFFFF",
          },
          text: {
            primary: "#1E1F23",
            secondary: "#565A66",
          },
        },
        // Dark Theme
        dark: {
          bg: {
            primary: "#0E0E11",
            secondary: "#1E1F23",
            card: "#1E1F23",
          },
          text: {
            primary: "#F8F8F8",
            secondary: "#C6A678",
          },
        },
        // Status Colors
        success: "#4ADE80",
        danger: "#EF4444",
        warning: "#FACC15",
        border: {
          gray: "#565A66",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        display: ["72px", { lineHeight: "1.1", fontWeight: "700" }],
        h1: ["56px", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["40px", { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["28px", { lineHeight: "1.2", fontWeight: "600" }],
        "body-large": ["20px", { lineHeight: "1.5", fontWeight: "400" }],
        body: ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        caption: ["14px", { lineHeight: "1.5", fontWeight: "500" }],
        small: ["12px", { lineHeight: "1.5", fontWeight: "500" }],
      },
      borderRadius: {
        sm: "8px",
        DEFAULT: "12px",
        lg: "16px",
        pill: "24px",
      },
      boxShadow: {
        sm: "0 1px 4px rgba(0, 0, 0, 0.15)",
        DEFAULT: "0 4px 12px rgba(0, 0, 0, 0.25)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.35)",
      },
      spacing: {
        "8": "8px",
        "16": "16px",
        "24": "24px",
        "32": "32px",
        "48": "48px",
        "64": "64px",
        "80": "80px",
        "96": "96px",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-up": "slideUp 0.2s ease-in-out",
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};

export default config;
