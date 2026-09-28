/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        // ─────────────────────────────
        // Brand / Accent
        // ─────────────────────────────
        primary: {
          DEFAULT: "#3B82F6", // Brighter blue for dark mode visibility
          dark: "#2563EB",
          light: "#60A5FA",
          bright: "#93C5FD",
        },
        "dark-night": "#8B5CF6",

        // ─────────────────────────────
        // Trading / Semantic (High contrast for dark mode)
        // ─────────────────────────────
        success: {
          DEFAULT: "#22C55E", // Vibrant green for wins
          dark: "#16A34A",
          light: "#4ADE80",
        },

        danger: {
          DEFAULT: "#EF4444", // Vibrant red for losses
          dark: "#DC2626",
          light: "#F87171",
        },

        warning: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
        },

        // ─────────────────────────────
        // Dark Theme (Default Trading Mode)
        // ─────────────────────────────
        background: "#0F172A", // Deep slate background (Slate 900)
        surface: "#1E293B", // Card / Modal background (Slate 800)
        "surface-alt": "#334155", // Interactive elements / borders alt (Slate 700)
        elevated: "#1E293B",

        // Text
        "text-primary": "#F8FAFC", // Near white
        "text-secondary": "#CBD5E1", // Light slate
        "text-muted": "#94A3B8", // Muted gray-blue
        "text-disabled": "#475569", // Darker gray
        "text-inverse": "#0F172A",

        // Borders
        border: "#334155", // Subtle dark border
        "border-strong": "#475569",
        divider: "#334155",
      },
    },
  },

  darkMode: "class",

  plugins: [],
};
