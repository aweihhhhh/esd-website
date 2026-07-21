/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Brand color system - 工业风深蓝主色
      colors: {
        brand: {
          DEFAULT: '#0F3460',
          50:  '#E8EDF5',
          100: '#C5D0E5',
          200: '#9AAFD2',
          300: '#6F8EBF',
          400: '#3F6BA8',
          500: '#0F3460',  // 主色
          600: '#0C2A4D',
          700: '#091F3A',
          800: '#061526',
          900: '#030A13'
        },
        accent: {
          DEFAULT: '#E94560',
          hover: '#FF5C75'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
      },
      maxWidth: {
        '8xl': '88rem'
      }
    }
  },
  plugins: []
}
