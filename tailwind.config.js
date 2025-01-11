/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xx: "320px",
        xs: "412px",
        ss: "620px",
        sm: "768px",
        md: "1020px",
        lg: "1400px",
        xl: "1700px",
      },
      colors: {
        "dark-bg": "#0A0A0A", // Dark background
        "primary-blue": "#1E3A8A", // Deep blue
        "secondary-blue": "#3B82F6", // Lighter blue for accents
      },
    },
  },
  plugins: [],
};
