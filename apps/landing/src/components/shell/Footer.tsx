import type { Locale } from '@repo/shared/i18n'
import Link from 'next/link'

export function Footer({ locale }: { locale: Locale }) {
  const prefix = (href: string) => `/${locale}${href === '/' ? '' : href}`

  return (
    <footer className="border-dm-line border-t py-12 text-[13px] text-dm-ink-3">
      {/* TODO(i18n): labels deferred per Phase 6 of the landing redesign plan. */}
      <div className="mx-auto max-w-[1240px] px-8">
        <div className="flex flex-wrap items-start justify-between gap-10">
          {/* Brand column */}
          <div className="flex max-w-[300px] flex-col gap-[10px]">
            <Link className="flex items-center gap-[10px]" href={prefix('/')}>
              <BrandMark />
              <span className="font-bold text-[15px] text-dm-ink tracking-[-0.01em]">
                Dockerman
              </span>
            </Link>
            <p className="m-0 text-dm-ink-3">
              A modern, lightweight Docker & Kubernetes desktop, built with Rust + Tauri.
            </p>
          </div>

          {/* Product */}
          <FooterCol heading="Product">
            <Link className="hover:text-dm-ink" href={prefix('/download')}>
              Download
            </Link>
            <Link className="hover:text-dm-ink" href={prefix('/#features')}>
              Features
            </Link>
            <Link className="hover:text-dm-ink" href={prefix('/changelog')}>
              Changelog
            </Link>
            <Link className="hover:text-dm-ink" href={prefix('/pricing')}>
              Pricing
            </Link>
          </FooterCol>

          {/* Docs */}
          <FooterCol heading="Docs">
            <Link className="hover:text-dm-ink" href={prefix('/docs/getting-started')}>
              Getting started
            </Link>
            <Link className="hover:text-dm-ink" href={prefix('/docs/kubernetes')}>
              Kubernetes
            </Link>
            <Link className="hover:text-dm-ink" href={prefix('/docs/cli')}>
              CLI reference
            </Link>
            <Link className="hover:text-dm-ink" href={prefix('/docs/faq')}>
              FAQ
            </Link>
          </FooterCol>

          {/* Community */}
          <FooterCol heading="Community">
            <a
              className="hover:text-dm-ink"
              href="https://github.com/ZingerLittleBee/dockerman.app"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </a>
            <a
              className="hover:text-dm-ink"
              href="https://discord.gg/dockerman"
              rel="noopener noreferrer"
              target="_blank"
            >
              Discord
            </a>
            <a
              className="hover:text-dm-ink"
              href="https://twitter.com/dockerman_app"
              rel="noopener noreferrer"
              target="_blank"
            >
              Twitter
            </a>
            <a className="hover:text-dm-ink" href="mailto:hello@dockerman.app">
              Email
            </a>
          </FooterCol>
        </div>

        {/* Foot note: copyright + tagline */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-dm-line border-t pt-5 font-[var(--font-dm-mono)] text-[12px] text-dm-ink-4">
          <span>© {new Date().getFullYear()} Dockerman · MIT licensed</span>
          <span>local-only · no telemetry · made in the terminal</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-[10px]">
      <span className="mb-1 font-semibold text-[12px] text-dm-ink">{heading}</span>
      {children}
    </div>
  )
}

function BrandMark() {
  return (
    <span
      className="relative grid h-[26px] w-[26px] place-items-center overflow-hidden rounded-[7px] text-white"
      style={{
        background:
          'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))',
        boxShadow:
          'inset 0 0 0 1px rgb(255 255 255 / 0.1), 0 4px 12px -4px var(--color-dm-accent)',
      }}
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="currentColor"
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M28,12H20V4h8Zm-6-2h4V6H22Z" />
        <path d="M17,15V9H9V23H23V15Zm-6-4h4v4H11Zm4,10H11V17h4Zm6,0H17V17h4Z" />
        <path d="M26,28H6a2,2,0,0,1-2-2V6A2,2,0,0,1,6,4H16V6H6V26H26V16h2V26A2,2,0,0,1,26,28Z" />
      </svg>
    </span>
  )
}
