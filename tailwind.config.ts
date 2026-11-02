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
        display: [
          "Avenir",
          "Avenir Next",
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ],
        body: [
          "Avenir",
          "Avenir Next",
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ],
        sans: [
          "Avenir",
          "Avenir Next",
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif"
        ],
        inter: ["var(--font-inter)", "sans-serif"],
        accent: ["var(--font-comforter)", "cursive"],
        comforter: ["var(--font-comforter)", "cursive"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace"
        ]
      },
      fontSize: {
        // Tix.africa exact type scale
        micro: ["10px", { lineHeight: "14px", fontWeight: "600" }],
        badge: ["11px", { lineHeight: "16px", fontWeight: "600" }],
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["18px", { lineHeight: "24px" }],
        lead: ["20px", { lineHeight: "30px" }],
        h4: ["24px", { lineHeight: "32px" }],
        h3: ["30px", { lineHeight: "38px" }],
        h2: ["48px", { lineHeight: "62px" }],
        h1: ["60px", { lineHeight: "72px" }],
        // Fluid clamp scale (editorial & large headings)
        "fluid-giant": ["clamp(56px, 15vw, 200px)", { lineHeight: "1" }],
        "fluid-chapter": ["clamp(40px, 7vw, 124px)", { lineHeight: "1.05" }],
        "fluid-h1": ["clamp(30px, 4vw, 60px)", { lineHeight: "1.15" }],
        "fluid-h2": ["clamp(25px, 2.1vw, 48px)", { lineHeight: "1.25" }],
        "fluid-h4": ["clamp(20px, 1.3vw, 38px)", { lineHeight: "1.32" }],
        "fluid-body": ["clamp(14px, 1vw, 20px)", { lineHeight: "1.5" }]
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
