/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        's': {'max': '550px'},
        'xs': {'max': '500px'},
        '2xs': {'max': '450px'},
        '3xs': {'max': '400px'},
        '4xs': {'max': '350px'},
        '5xs': {'max': '325px'},
        '6xs': {'max': '300px'}
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        }
      },
      animation: {
        pulseSlow: 'pulseSlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}