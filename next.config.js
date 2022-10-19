/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['avisos.jonatas.app', 'avatars.dicebear.com'],
  },
}

module.exports = nextConfig
