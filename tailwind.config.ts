import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sentinel: {
          ink: "#05070d",
          panel: "#0c1220",
          line: "rgba(148, 163, 184, 0.18)",
          cyan: "#00e5ff",
          blue: "#2667ff",
          green: "#10b981",
          yellow: "#eab308",
          orange: "#f97316",
          red: "#ef4444"
        }
      },
      boxShadow: {
        glow: "0 0 24px rgba(0, 229, 255, 0.28)",
        panel: "0 18px 60px rgba(0, 0, 0, 0.36)"
      },
      fontFamily: {
        display: ["Orbitron", "Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
