import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        forge: {
          ink: "#121417",
          panel: "#f5f7f8",
          steel: "#69737f",
          mint: "#2fbf9b",
          coral: "#f26a4f",
          amber: "#f0b429",
          blue: "#2f6fed"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(18, 20, 23, 0.12)",
        lift: "0 16px 36px rgba(18, 20, 23, 0.16)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
