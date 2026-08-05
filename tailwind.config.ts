import type { Config } from "tailwindcss";

/**
 * Colours resolve through CSS variables rather than literal hex, so switching
 * `data-theme` on <html> re-themes the whole site without a single `dark:`
 * class in the components.
 *
 * The channel-triplet form — `13 7 20` rather than `#0d0714` — is what makes
 * Tailwind's opacity modifiers keep working: `bg-bg/70` compiles to
 * `rgb(var(--c-bg) / 0.7)`. A var holding a full hex would break every `/xx`
 * on the site.
 *
 * `surface` / `line` / `chip` hold complete rgba values instead, because their
 * alpha differs per theme (white at 2% on dark, white at 75% on light) and so
 * cannot be expressed as one channel triplet plus a fixed modifier.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--c-bg) / <alpha-value>)",
        text: "rgb(var(--c-text) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        // Names kept from the original violet palette; read them as
        // primary / primary-light / primary-accent.
        purple: "rgb(var(--c-primary) / <alpha-value>)",
        "purple-2": "rgb(var(--c-primary-2) / <alpha-value>)",
        magenta: "rgb(var(--c-accent) / <alpha-value>)",
        teal: "rgb(var(--c-teal) / <alpha-value>)",
        lime: "rgb(var(--c-lime) / <alpha-value>)",
        ring: "rgb(var(--c-ring) / <alpha-value>)",

        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        chip: "var(--chip)",
        faint: "var(--faint)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        // Drives the dash pattern around each field loop. Animating
        // stroke-dashoffset (rather than redrawing the path) is what makes the
        // energy appear to travel along the line.
        fieldFlow: {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-240" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease forwards",
        floaty: "floaty 5s ease-in-out infinite",
        marquee: "marquee 42s linear infinite",
        field: "fieldFlow 7s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
