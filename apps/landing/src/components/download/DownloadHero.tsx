import { downloadsConfig } from '@/config/downloads'

export function DownloadHero() {
  const { latest } = downloadsConfig
  return (
    <section className="relative px-8 pt-14 pb-10">
      <div
        aria-hidden
        className="-translate-x-1/2 -z-[1] pointer-events-none absolute top-0 left-1/2 h-[420px] w-[900px] blur-[40px]"
        style={{
          background:
            'radial-gradient(ellipse at center top, color-mix(in srgb, var(--color-dm-accent-2) 22%, transparent), transparent 60%)',
        }}
      />
      <div className="mx-auto max-w-[1140px]">
        {/* kicker with ok-dot + NEW tag */}
        <span className="inline-flex items-center gap-[10px] rounded-full border border-dm-line-strong bg-dm-bg-elev py-[5px] pr-[10px] pl-[6px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-2">
          <span
            className="h-[6px] w-[6px] rounded-full"
            style={{
              background: 'var(--color-dm-ok)',
              boxShadow: '0 0 0 4px color-mix(in srgb, var(--color-dm-ok) 30%, transparent)',
              animation: 'dm-pulse 2.2s ease-in-out infinite',
            }}
          />
          <span>
            v{latest.version} · {formatDate(latest.releaseDate)} · latest stable
          </span>
          <span className="rounded-full bg-dm-ink px-2 py-[2px] font-semibold text-[10px] text-dm-bg tracking-[0.04em]">
            NEW
          </span>
        </span>

        <h1 className="mt-[22px] max-w-[16ch] font-bold text-[clamp(44px,6.4vw,80px)] text-dm-ink leading-[0.98] tracking-[-0.04em]">
          Download Dockerman for{' '}
          <em
            className="bg-clip-text font-[var(--font-dm-display)] font-normal text-transparent italic"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--color-dm-accent-2), #8b5cf6)',
              letterSpacing: '-0.02em',
            }}
          >
            every desktop.
          </em>
        </h1>

        <p className="mt-[22px] max-w-[60ch] text-[17px] text-dm-ink-3 leading-[1.5]">
          A single, native 18&nbsp;MB binary. Code-signed, notarized, and reproducible. Browse older
          builds on the{' '}
          <a
            className="border-b"
            href={latest.releaseUrl}
            rel="noopener noreferrer"
            style={{
              color: 'var(--color-dm-accent-2)',
              borderBottomColor: 'color-mix(in srgb, var(--color-dm-accent-2) 40%, transparent)',
            }}
            target="_blank"
          >
            releases page
          </a>{' '}
          or verify checksums with the SHA-256 manifest below.
        </p>

        {/* release meta */}
        <div className="mt-10 grid overflow-hidden rounded-[14px] border border-dm-line bg-dm-bg-elev md:grid-cols-4">
          <ReleaseMetaCell label="version" value={<span className="font-[var(--font-dm-mono)] text-[14px] text-dm-ink-2 font-medium">v{latest.version}</span>} />
          <ReleaseMetaCell label="released" value={formatDate(latest.releaseDate)} />
          <ReleaseMetaCell label="size" value="~18 MB" />
          <ReleaseMetaCell label="platforms" value="macOS · Win · Linux" last />
        </div>
      </div>
    </section>
  )
}

function ReleaseMetaCell({
  label,
  value,
  last,
}: {
  label: string
  value: React.ReactNode
  last?: boolean
}) {
  return (
    <div
      className={`p-[18px_22px] ${last ? '' : 'border-dm-line md:border-r border-b md:border-b-0'}`}
    >
      <div className="font-[var(--font-dm-mono)] text-[11px] text-dm-ink-4 uppercase tracking-[0.05em]">
        {label}
      </div>
      <div className="mt-1 font-semibold text-[16px] text-dm-ink tabular-nums tracking-[-0.01em]">
        {value}
      </div>
    </div>
  )
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`
}
