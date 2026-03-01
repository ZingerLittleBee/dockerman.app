/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/shared'],
  images: {
    qualities: [70, 75, 100]
  },
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
  skipTrailingSlashRedirect: true
}

export default nextConfig
