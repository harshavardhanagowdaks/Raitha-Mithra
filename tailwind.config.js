/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#1c5a2c', // Deep green primary matching Negilu Krishi
          800: '#154823',
          900: '#0f361a',
          dark: '#0a2411',
        },
        earth: {
          100: '#fef3c7',
          500: '#d97706',
          700: '#b45309',
          800: '#92400e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Kannada', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
