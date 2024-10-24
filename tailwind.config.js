/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        netflixRed: "#e50914", // Netflix red color
        "custom-black": "#111", // Custom black color
      },
    },
    container: {
      center: true, // Ensure the container is always centered
      padding: "1rem", // Add default padding
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
