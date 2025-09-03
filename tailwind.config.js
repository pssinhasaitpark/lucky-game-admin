/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
          "border-color": "hsl(var(--border))", // or use a fixed color like '#e5e7eb'
        },
      });
    },
  ],
};
