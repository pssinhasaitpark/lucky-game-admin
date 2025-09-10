/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enable dark mode via class
  theme: {
    extend: {
      colors: {
        yellow: {
          50: "#fefce8",
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".border-border": {
          "border-color": "hsl(var(--border))",
        },
      });
    },
  ],
};
