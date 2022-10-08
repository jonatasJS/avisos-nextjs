/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avisos.jonatas.app'],
  },
}

module.exports = nextConfig
