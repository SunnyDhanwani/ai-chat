/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "blue-gradient": "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
      },
    },
  },
  plugins: [],
};
