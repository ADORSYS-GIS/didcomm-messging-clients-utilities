/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  daisyui: {
    themes: ["light", "dark", "autumn"],
  },
  plugins: [
    require('daisyui'),
  ],
} 