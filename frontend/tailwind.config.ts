import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // CRITICAL: must match data-theme attribute, NOT CSS class
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1A3BDB',
          gray: '#0A0A0A',
          border: '#1a1a1a',
        },
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
      },
      animation: {
        float:        'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 9s ease-in-out infinite',
        shimmer:      'shimmer 4s linear infinite',
        marquee:      'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;