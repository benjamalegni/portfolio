/** @type {import('next').NextConfig} */
const isGhPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  ...(isGhPages ? { basePath: '/portfolio' } : {}),

  env: {
    NEXT_PUBLIC_BASE_PATH: isGhPages ? '/portfolio' : '',
    NEXT_PUBLIC_PORTFOLIO_WORKER_URL:
      process.env.NEXT_PUBLIC_PORTFOLIO_WORKER_URL ||
      (isGhPages ? 'https://portfolio-worker.lukaportfolio.workers.dev' : ''),
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

export default nextConfig