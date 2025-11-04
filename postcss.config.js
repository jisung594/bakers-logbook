// /** @type {import('postcss-load-config').Config} */
// module.exports = {
//   plugins: {
//     // Note: We explicitly use the PostCSS plugin package here
//     '@tailwindcss/postcss': {}, 
//     autoprefixer: {},
//   },
// };

module.exports = {
  plugins: [
    // Runs the Tailwind plugin and passes the config directly.
    require('tailwindcss')({
      // inlined content from the separate config file that was causing build to fail (tailwind.config.js)
      content: [
        "./src/**/*.{html,ts}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }),
    require('autoprefixer'),
  ],
};