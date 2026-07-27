import { withPostHogConfig } from '@posthog/nextjs-config'
import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/shared'],
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [70, 75, 80, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
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
  skipTrailingSlashRedirect: true,
  experimental: {
    optimizePackageImports: ['@remixicon/react', 'motion']
  }
}

const withMDX = createMDX()
const landingConfig = withMDX(nextConfig)
const hasPostHogSourceMapCredentials = Boolean(
  process.env.POSTHOG_API_KEY && process.env.POSTHOG_PROJECT_ID
)

export default hasPostHogSourceMapCredentials
  ? withPostHogConfig(landingConfig, {
      personalApiKey: process.env.POSTHOG_API_KEY,
      projectId: process.env.POSTHOG_PROJECT_ID,
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      sourcemaps: {
        releaseName: 'dockerman-landing',
        deleteAfterUpload: true
      }
    })
  : landingConfig
