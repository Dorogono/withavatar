/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    screens: {
      sm: "760px",
      lg: "960px",
    },
  },
  content: ["./src/**/*.{vue,js,ts}"],
  plugins: [require("daisyui")],
};
