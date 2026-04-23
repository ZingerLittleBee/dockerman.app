import type { Locale } from '@repo/shared/i18n'
import Link from 'next/link'
import { Pill } from '@/components/ui-dm/Pill'

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section className="relative px-8 pb-8 pt-16">
      <div
        aria-hidden
        className="-translate-x-1/2 -z-[1] pointer-events-none absolute top-0 left-1/2 h-[500px] w-[900px] blur-[40px]"
        style={{
          background:
            'radial-gradient(ellipse at center top, color-mix(in srgb, var(--color-dm-accent) 25%, transparent), transparent 60%)',
        }}
      />
      <div className="mx-auto max-w-[1240px]">
        <Pill dot>
          <span className="rounded-full bg-dm-ink px-2 py-[2px] font-semibold text-[10px] text-dm-bg tracking-wide">
            v5.1
          </span>
          local-first · ~30 MB RAM
        </Pill>

        <h1 className="mt-[22px] max-w-[14ch] font-bold text-[clamp(44px,7.2vw,96px)] text-dm-ink leading-[0.95] tracking-[-0.045em]">
          Docker, done quietly{' '}
          <span
            className="bg-clip-text text-transparent italic"
            style={{
              fontFamily: 'var(--font-dm-display)',
              fontWeight: 400,
              backgroundImage:
                'linear-gradient(135deg, var(--color-dm-accent) 0%, var(--color-dm-accent-2) 100%)',
            }}
          >
            in 30MB.
          </span>
        </h1>

        <p className="mt-6 max-w-[52ch] text-[17px] text-dm-ink-2">
          A local-first control surface for Docker, Podman and Kubernetes. Built in Rust and Tauri.
          Fast, precise, and designed to stay out of your way.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center gap-2 rounded-lg border border-dm-ink bg-dm-ink px-5 py-[10px] font-medium text-[14px] text-dm-bg hover:-translate-y-px"
            href={`/${locale}/download`}
          >
            Download for macOS
          </Link>
          <a
            className="inline-flex items-center gap-2 rounded-lg border border-dm-line-strong bg-dm-bg-elev px-5 py-[10px] font-medium text-[14px] text-dm-ink hover:bg-dm-bg-soft"
            href="https://github.com/ZingerLittleBee/dockerman.app"
          >
            Star on GitHub
          </a>
        </div>

        <div className="mt-12 grid max-w-[640px] grid-cols-3 gap-6 border-dm-line border-t pt-6">
          {[
            { k: '~30 MB', v: 'Idle memory' },
            { k: '~0 ms', v: 'Cold start' },
            { k: '100%', v: 'Local-first' },
          ].map((s) => (
            <div key={s.v}>
              <div className="font-[var(--font-dm-mono)] font-bold text-[24px] text-dm-ink tracking-[-0.02em]">
                {s.k}
              </div>
              <div className="mt-1 text-[12px] text-dm-ink-3">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
