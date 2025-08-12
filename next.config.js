/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['convex'],
  images: {
    domains: ['images.unsplash.com', 'assets.aceternity.com'],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
