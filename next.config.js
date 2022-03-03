/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transformIgnorePatterns: [
    'node_modules/(?!(@dfinity/principal)/)' 
  ],
}

module.exports = nextConfig
