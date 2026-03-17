import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-up":    "fadeUp 0.5s ease both",
        "fade-in":    "fadeIn 0.4s ease both",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};

export default config;