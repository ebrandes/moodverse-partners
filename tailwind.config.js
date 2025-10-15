/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#111111",
        muted: "#f3f3f3",
        border: "#e5e5e5",
      },
    },
  },
  plugins: [],
};
