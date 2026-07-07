/** @type {import('next').NextConfig} */
const isGhPagesProjectUrl = process.env.GITHUB_PAGES_PROJECT === 'true'

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },

  ...(isGhPagesProjectUrl ? { basePath: '/portfolio' } : {}),

  env: {
    NEXT_PUBLIC_BASE_PATH: isGhPagesProjectUrl ? '/portfolio' : '',
    NEXT_PUBLIC_PORTFOLIO_WORKER_URL:
      process.env.NEXT_PUBLIC_PORTFOLIO_WORKER_URL ||
      'https://portfolio-worker.lukaportfolio.workers.dev',
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig
