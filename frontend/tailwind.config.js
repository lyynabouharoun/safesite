
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream:   "#F7F6E5",
        cyan:    "#76D2DB",
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
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      animation: {
        "pulse-dot": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in": "slideIn 0.2s ease-out",
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