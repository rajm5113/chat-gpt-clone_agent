/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#343541',
          'bg-light': '#444654',
          'bg-lighter': '#565869',
          text: '#ECECF1',
          'text-secondary': '#C5C5D2',
        },
        light: {
          bg: '#FFFFFF',
          'bg-light': '#F7F7F8',
          'bg-lighter': '#ECECF1',
          text: '#343541',
          'text-secondary': '#565869',
        },
      },
    },
  },
  plugins: [],
};
