/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      dropShadow: {
        'slightly-larger': '0 1.5px 2px rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
}

