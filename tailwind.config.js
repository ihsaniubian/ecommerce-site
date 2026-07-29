/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14201E",        // near-black text, warm-dark
        canvas: "#FBFAF7",     // page background, warm white (not cream/tan cliché)
        teal: {
          DEFAULT: "#0B4F4A",
          dark: "#083A36",
          light: "#127A72",
        },
        saffron: {
          DEFAULT: "#E0A526",
          dark: "#B9860F",
          light: "#F2C866",
        },
        brick: "#B84C3E",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        sm: "4px",
      },
    },
  },
  plugins: [],
};
