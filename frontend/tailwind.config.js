/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        asan: {
          blue: '#003F87',
          lightblue: '#0066CC',
          gold: '#F5A623',
          green: '#27AE60',
          red: '#E74C3C',
          gray: '#F4F6F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
