/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        canvas: "#0a0b0f",
        surface: "#12141a",
        line: "#1e222d",
        ink: "#e9ebf0",
        muted: "#8b92a1",
        accent: "#4f7cff",
        danger: "#f87171",
        warn: "#fbbf24",
        ok: "#34d399",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(to bottom, rgba(10,11,15,0) 0%, #0a0b0f 100%), radial-gradient(ellipse 80% 50% at 50% -20%, rgba(79,124,255,0.15), transparent)",
      },
    },
  },
  plugins: [],
};
