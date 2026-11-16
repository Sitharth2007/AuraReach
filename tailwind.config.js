/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: '#6B1A2A',
          primary: '#6B1A2A',
          mid: '#8B2535',
          warm: '#B85C6E',
          dark: '#4E111E',
          light: '#F8EFF1',
        },
        ivory: {
          DEFAULT: '#FAF7F2',
          light: '#FFFFFF',
          dark: '#F5EFEB',
        },
        paper: {
          DEFAULT: '#F2EDE6',
          light: '#F7F4EE',
          dark: '#E8E1D7',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#DFCA88',
          dark: '#9E8030',
          tint: '#FBF7EE',
        },
        ink: {
          DEFAULT: '#1C1410',
          soft: '#2D231E',
          light: '#3D312A',
        },
        muted: {
          DEFAULT: '#7A6860',
          light: '#9E8B83',
          dark: '#5C4E47',
        },
        border: {
          DEFAULT: '#E2D9D0',
          light: '#EDE6DF',
          dark: '#D0C4B8',
        },
        status: {
          success: '#2D6A4F',
          'success-bg': '#EBF5F0',
          warning: '#B45309',
          'warning-bg': '#FEF7ED',
          error: '#9E2A2B',
          'error-bg': '#FDF2F2',
          info: '#8B2535',
          'info-bg': '#FDF4F5',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(28, 20, 16, 0.04), 0 1px 2px 0 rgba(28, 20, 16, 0.02)',
        card: '0 2px 8px -2px rgba(28, 20, 16, 0.05), 0 1px 4px -1px rgba(28, 20, 16, 0.03)',
        hover: '0 8px 20px -4px rgba(107, 26, 42, 0.08), 0 4px 10px -2px rgba(28, 20, 16, 0.04)',
        modal: '0 20px 25px -5px rgba(28, 20, 16, 0.1), 0 10px 10px -5px rgba(28, 20, 16, 0.04)',
      }
    },
  },
  plugins: [],
}
