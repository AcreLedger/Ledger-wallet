/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'stellar-blue': '#1a1a2e',
        'stellar-purple': '#16213e',
        'accent-green': '#00ff88',
        'accent-orange': '#ff6b35',
      }
    },
  },
  plugins: [],
}
