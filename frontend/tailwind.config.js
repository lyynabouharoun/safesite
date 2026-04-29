/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream:   "#F7F6E5",
        cyan:    "#76D2DB",
        "cyan-light": "#A3E4EB",
        coral:   "#DA4848",
        plum:    "#36064D",
        // Shades
        "plum-800": "#4a0a6b",
        "plum-900": "#1e0330",
        "dark-base": "#0d0d14",
        "dark-surface": "#13131f",
        "dark-card": "#1a1a2e",
        "dark-border": "#2a2a40",
        "dark-muted": "#3a3a55",
        
        // NEW - for success/warning variants
        emerald: {
          400: "#34D399",
          500: "#10B981",
        },
        amber: {
          400: "#FBBF24",
          500: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      animation: {
        "pulse-dot": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in": "slideIn 0.2s ease-out",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(-8px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};