import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure image optimization
  images: {
    qualities: [70, 75, 100]
  },
  // PostHog reverse proxy rewrites
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*'
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*'
      }
    ]
  },
  // Required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true
}

const withMDX = createMDX()

export default withMDX(nextConfig)
