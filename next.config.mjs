/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  images: { unoptimized: true },
  ...(isGhPages ? { basePath: '/portfolio' } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: isGhPages ? '/portfolio' : '',
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
