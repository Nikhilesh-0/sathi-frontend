/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        saffron: "#E8752A",
        "saffron-light": "#FFF0E6",
        charcoal: "#1C1C1E",
        muted: "#6B7280",
        cream: "#FAFAF7",
        border: "#E5E7EB",
      },
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        devanagari: ["Tiro Devanagari Hindi", "DM Sans", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        md: "0 4px 12px rgba(0,0,0,0.08)",
        lg: "0 8px 24px rgba(0,0,0,0.1)",
        xl: "0 16px 40px rgba(0,0,0,0.12)",
      },
      animation: {
        "bounce": "bounce 1s infinite",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin": "spin 1s linear infinite",
      },
    },
  },
  plugins: [],
};
