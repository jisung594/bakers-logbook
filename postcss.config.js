// NOTE: No longer needed with new .postcssrc.json, which is easier for Angular to recognize (keeping for reference)
// module.exports = {
//   plugins: [
//     // Runs the Tailwind plugin and passes the config directly.
//     require('tailwindcss')({
//       // inlined content from the separate config file that was causing build to fail (tailwind.config.js)
//       content: [
//         "./src/**/*.{html,ts}",
//       ],
//       theme: {
//         extend: {},
//       },
//       plugins: [],
//     }),
//     require('autoprefixer'),
//   ],
// };