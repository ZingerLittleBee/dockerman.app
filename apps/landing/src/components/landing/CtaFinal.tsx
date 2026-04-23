import type { Locale } from '@repo/shared/i18n'
import Link from 'next/link'

export function CtaFinal({ locale }: { locale: Locale }) {
  return (
    <section className="px-8">
      <div className="mx-auto my-24 max-w-[1240px]">
        <div
          className="relative overflow-hidden rounded-[24px] border border-dm-line-strong bg-dm-bg-elev px-12 py-20 text-center"
          style={{
            backgroundImage: `radial-gradient(ellipse at top right, color-mix(in srgb, var(--color-dm-accent-2) 15%, transparent), transparent 50%),
              radial-gradient(ellipse at bottom left, color-mix(in srgb, var(--color-dm-accent) 15%, transparent), transparent 50%)`
          }}
        >
          {/* decorative grid overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-50"
            style={{
              backgroundImage: `linear-gradient(var(--color-dm-grid) 1px, transparent 1px),
                linear-gradient(90deg, var(--color-dm-grid) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
          <h2 className="relative m-0 font-bold text-[clamp(36px,5vw,64px)] text-dm-ink leading-[1.02] tracking-[-0.04em]">
            Open the tray.{' '}
            <em
              className="bg-clip-text font-[var(--font-dm-display)] font-normal text-transparent italic"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))'
              }}
            >
              Ship containers.
            </em>
          </h2>
          <p className="relative mx-auto mt-[18px] mb-8 max-w-[56ch] text-[17px] text-dm-ink-3">
            Free and unrestricted for local use. A paid license unlocks remote hosts, team features,
            and priority support.
          </p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <Link
              className="inline-flex items-center gap-[10px] rounded-[10px] border px-5 py-3 pr-[6px] font-semibold text-[14px] text-white no-underline transition-all hover:-translate-y-px"
              href={`/${locale}/download`}
              style={{
                background:
                  'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))',
                borderColor: 'transparent',
                boxShadow:
                  '0 10px 30px -10px color-mix(in srgb, var(--color-dm-accent-2) 60%, transparent)'
              }}
            >
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="14"
                viewBox="0 0 24 24"
                width="14"
              >
                <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 4v-2h14v2H5z" />
              </svg>
              Download Dockerman
              <span
                className="inline-flex items-center rounded-md px-[10px] py-1 font-[var(--font-dm-mono)] text-[11px]"
                style={{
                  background: 'rgb(255 255 255 / 0.18)',
                  opacity: 0.9
                }}
              >
                macOS · Win · Linux
              </span>
            </Link>
            <a
              className="inline-flex items-center gap-2 rounded-[10px] border border-dm-line-strong bg-transparent px-[18px] py-3 font-medium text-[14px] text-dm-ink-2 transition-colors hover:bg-dm-bg-soft hover:text-dm-ink"
              href="https://github.com/ZingerLittleBee/dockerman.app/issues/new"
              rel="noopener noreferrer"
              target="_blank"
            >
              Report an issue on GitHub →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
