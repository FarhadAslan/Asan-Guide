/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        asan: {
          blue:      '#003F87',   // ASAN əsas mavi
          lightblue: '#0055B3',   // hover mavi
          sky:       '#E8F0FB',   // açıq mavi fon
          gold:      '#F5A623',   // ASAN qızılı
          green:     '#27AE60',
          red:       '#E74C3C',
          gray:      '#F4F6F9',
          dark:      '#1A2B4A',   // header yazı
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px 0 rgba(0,63,135,0.08)',
        'card-hover': '0 6px 24px 0 rgba(0,63,135,0.14)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
