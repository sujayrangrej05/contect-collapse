/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        focus: {
          dark: '#121212',
          light: '#ffffff',
          accent: '#FFD700', // High contrast yellow
          secondary: '#3B82F6', // Accessible blue
        }
      }
    },
  },
  plugins: [],
}
