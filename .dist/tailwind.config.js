/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nalco: {
          red: '#c62828',
          blue: '#004b8d',
          'blue-dark': '#063865',
          beige: '#f8f9f5', // Soft beige
        },
        enterprise: {
          surface: '#ffffff',
          soft: '#f5f8fb',
          line: '#d8e0ea',
          ink: '#1d2939',
          muted: '#667085',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 10px 30px -5px rgba(0, 75, 141, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
        'premium-hover': '0 20px 40px -10px rgba(0, 75, 141, 0.12), 0 8px 12px -4px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
