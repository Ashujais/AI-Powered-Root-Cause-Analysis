/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pharma: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36abf6',
          500: '#0c8ee7',
          600: '#0170c6',
          700: '#0259a0',
          800: '#064b83',
          900: '#0b3f6d',
          950: '#072848',
        },
        slate: {
          850: '#172033',
          950: '#0b1120',
        }
      }
    },
  },
  plugins: [],
}
