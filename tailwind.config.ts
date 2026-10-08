import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        black: "#080808",
        deep: "#0f0f0f",
        surface: "#161616",
        gold: "#c9a84c",
        "gold-dim": "rgba(201,168,76,0.15)",
        white: "#f5f0e8",
        muted: "rgba(245,240,232,0.45)",
        border: "rgba(255,255,255,0.07)"
      },
      fontFamily: {
        display: ["var(--font-bebas)", "sans-serif"],
        body: ["var(--font-dmsans)", "sans-serif"],
        mono: ["var(--font-dmmono)", "monospace"]
      },
      borderRadius: {
        DEFAULT: "6px",
        pill: "100px",
        micro: "3px"
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "36px",
        page: "40px",
        hero: "72px"
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }
  },
  plugins: []
};

export default config;
