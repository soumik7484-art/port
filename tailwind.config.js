/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: {} },
  plugins: [],
  // We use CSS custom properties for theming, so Tailwind is minimal
  corePlugins: {
    preflight: true,
  },
}
