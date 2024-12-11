/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        gobold: ['GoBold', 'sans-serif'], // Pour les titres
        gotham: ['Gotham', 'sans-serif'], // Pour les textes
        thirsty: ['Thirsty', 'cursive'], // Pour citations ou mise en valeur
      },
    },
  },
  plugins: [
  ],
}

