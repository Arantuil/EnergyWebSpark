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
      }
    },
  },
  plugins: [],
}