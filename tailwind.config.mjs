/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      padding: {
        30: "30px",
      },
      height: {
        90: "90px",
      },
    },
  },
  plugins: [],
};
