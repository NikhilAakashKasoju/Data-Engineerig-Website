import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0d0714",
        text: "#f4f4f6",
        muted: "#8a8a96",
        purple: "#8b3ffb",
        "purple-2": "#b06bff",
        magenta: "#c94fef",
        teal: "#5eead4",
        lime: "#d4ff5c",
        ring: "#3a3a44",
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
      },
      animation: {
        fadeUp: "fadeUp 0.8s ease forwards",
        floaty: "floaty 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
