/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        primary: "#FF8C00",
        ink: "#09111f",
        panel: "#101c2e",
      },
      boxShadow: {
        panel: "0 18px 48px rgba(2, 8, 23, 0.22)",
      },
    },
  },
  plugins: [],
};
