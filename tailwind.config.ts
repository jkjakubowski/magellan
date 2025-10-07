import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        magellan: {
          smoky: "#070707",
          vandyke: "#2D2327",
          delft: "#454B66",
          glaucous: "#677DB7",
          vista: "#9CA3DB"
        }
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem"
      },
      keyframes: {
        "ink-glow": {
          "0%,100%": { opacity: "0.85", filter: "blur(0px)" },
          "50%": { opacity: "1", filter: "blur(0.4px)" }
        },
        "typing-dots": {
          "0%,60%,100%": { opacity: "0.2", transform: "translateY(0)" },
          "30%": { opacity: "1", transform: "translateY(-3px)" }
        }
      },
      animation: {
        "ink-glow": "ink-glow 2.8s ease-in-out infinite",
        "typing-dots": "typing-dots 1.2s ease-in-out infinite"
      },
      fontFamily: {
        sans: ["var(--font-sans)"]
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
