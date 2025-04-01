/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  env: {
    API_URL: process.env.API_URL || "http://localhost:5000/api",
  },
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextConfig;
