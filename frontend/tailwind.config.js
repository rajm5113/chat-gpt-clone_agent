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
        // Exact ChatGPT colors
        'gpt-dark-bg': '#343541',
        'gpt-dark-sidebar': '#202123',
        'gpt-dark-message': '#444654',
        'gpt-dark-text': '#ECECF1',
        'gpt-dark-text-secondary': '#C5C5D2',
        'gpt-dark-border': '#565869',
        'gpt-light-bg': '#FFFFFF',
        'gpt-light-message': '#F7F7F8',
        'gpt-light-text': '#343541',
        'gpt-light-text-secondary': '#6E6E80',
        'gpt-light-border': '#E5E5E5',
      },
    },
  },
  plugins: [],
};
