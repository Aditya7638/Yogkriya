/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep forest green — primary
        forest: {
          50:  '#f0f7f0',
          100: '#d6ebd6',
          200: '#aed5ae',
          300: '#7db87d',
          400: '#529752',
          500: '#3a7a3a',
          600: '#2d612d',
          700: '#254d25',
          800: '#1d3d1d',
          900: '#162f16',
        },
        // Warm saffron — accent
        saffron: {
          50:  '#fff8ed',
          100: '#ffefd0',
          200: '#ffdb99',
          300: '#ffc55c',
          400: '#ffaa1f',
          500: '#f08c00',
          600: '#cc6e00',
          700: '#a34e00',
          800: '#7a3a00',
          900: '#5c2b00',
        },
        // Stone — neutrals
        stone: {
          50: '#fafaf9',
          100: '#f5f5f0',
          200: '#e8e8e0',
          300: '#d4d4c8',
          400: '#a8a89a',
          500: '#787870',
          600: '#5a5a54',
          700: '#42423c',
          800: '#2a2a26',
          900: '#1a1a18',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 2px 8px 0 rgba(0,0,0,0.06), 0 1px 3px 0 rgba(0,0,0,0.04)',
        'card-hover': '0 8px 24px 0 rgba(0,0,0,0.10), 0 2px 8px 0 rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}
