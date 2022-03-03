/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")(["@dfinity/principal"]);
module.exports = withTM({
  reactStrictMode: true,
})
