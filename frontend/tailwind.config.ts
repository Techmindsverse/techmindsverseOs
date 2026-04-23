/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1A3BDB",
          gray: "#0A0A0A",
          border: "#1a1a1a",
        },
      },
    },
  },
  plugins: [],
};