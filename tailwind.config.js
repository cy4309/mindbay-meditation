/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class", // 啟用 class 模式
  theme: {
    extend: {
      colors: {
        primary: "#000",
        secondary: "#fff",
        selected: "#d1d5db",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
