/** @type {import('next').NextConfig} */
const isGhPages = true
const repoName = 'portfolio'

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  basePath: '/portfolio',
}

export default nextConfig
