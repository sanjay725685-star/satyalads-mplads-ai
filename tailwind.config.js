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
        gov: {
          navy: '#0B3D91',
          navyDark: '#002244',
          navyLight: '#003366',
          saffron: '#FF9933',
          green: '#138808',
          ashokaBlue: '#000080',
          gold: '#B8860B',
          bg: '#F5F7FA',
          card: '#FFFFFF',
          border: '#CBD5E1',
          borderLight: '#E2E8F0',
          text: '#1A1A1A',
          textMuted: '#475569',
          danger: '#DC2626',
          warning: '#D97706',
          success: '#15803D',
        }
      },
      fontFamily: {
        sans: ['"Noto Sans"', 'Roboto', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'sweep 4s linear infinite',
      },
      keyframes: {
        sweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
