/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#e77e6c', // Cor salmão/coral das imagens de referência
        'secondary': '#333333',
        'accent': '#f97316',
        'light-bg': '#f8f9fa',
        'dark-text': '#333333',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}