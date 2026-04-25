import type { ReactNode } from 'react'

export function PolicyHero({
  eyebrow,
  titleLead,
  titleAccent,
  description,
  lastUpdated
}: {
  eyebrow: string
  titleLead: string
  titleAccent: string
  description: string
  lastUpdated: string
}) {
  return (
    <section className="relative px-8 pt-24 pb-12">
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 left-1/2 -z-[1] h-[360px] w-[820px] -translate-x-1/2 blur-[40px]"
        style={{
          background:
            'radial-gradient(ellipse at center top, color-mix(in srgb, var(--color-dm-accent-2) 18%, transparent), transparent 60%)'
        }}
      />
      <div className="mx-auto max-w-[820px]">
        <div
          className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
          style={{ color: 'var(--color-dm-accent)' }}
        >
          <span className="text-dm-ink-4">// </span>
          {eyebrow}
        </div>

        <h1 className="mt-3 font-bold text-[clamp(40px,6vw,68px)] text-dm-ink leading-[1.02] tracking-[-0.035em]">
          {titleLead}{' '}
          <em
            className="bg-clip-text font-[var(--font-dm-display)] font-normal text-transparent italic"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))',
              letterSpacing: '-0.02em'
            }}
          >
            {titleAccent}
          </em>
        </h1>

        <p className="mt-5 max-w-[58ch] text-[16px] text-dm-ink-3 leading-[1.6]">{description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-3 font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-3">
          <span className="rounded border border-dm-line bg-dm-bg-soft px-[7px] py-[3px] text-dm-ink-2">
            updated {lastUpdated}
          </span>
          <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-dm-ink-4" />
          <a className="text-dm-ink-2 hover:text-dm-ink" href="mailto:support@dockerman.app">
            support@dockerman.app
          </a>
        </div>
      </div>
    </section>
  )
}

export function PolicySection({
  index,
  title,
  children
}: {
  index: number
  title: string
  children: ReactNode
}) {
  const idx = String(index).padStart(2, '0')
  return (
    <article className="rounded-[14px] border border-dm-line bg-dm-bg-elev p-7">
      <div className="flex items-center gap-3">
        <span className="rounded-[6px] border border-dm-line bg-dm-bg-soft px-[8px] py-[3px] font-[var(--font-dm-mono)] text-[11px] text-dm-ink-3 tracking-[0.04em]">
          {idx}
        </span>
        <h2 className="font-semibold text-[19px] text-dm-ink tracking-[-0.015em]">{title}</h2>
      </div>
      <div className="mt-4 space-y-4 text-[14.5px] text-dm-ink-2 leading-[1.65]">{children}</div>
    </article>
  )
}

type Tone = 'accent' | 'ok' | 'warn' | 'err'

const TONE_VAR: Record<Tone, string> = {
  accent: 'var(--color-dm-accent)',
  ok: 'var(--color-dm-ok)',
  warn: 'var(--color-dm-warn)',
  err: 'var(--color-dm-err)'
}

export function PolicyList({ items, tone = 'accent' }: { items: string[]; tone?: Tone }) {
  return (
    <ul className="space-y-[10px]">
      {items.map((item) => (
        <li className="flex items-start gap-[10px]" key={item}>
          <span
            aria-hidden
            className="mt-[8px] inline-block h-[6px] w-[6px] flex-shrink-0 rounded-full"
            style={{ background: TONE_VAR[tone] }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function PolicySubheading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-2 font-semibold text-[14px] text-dm-ink tracking-[-0.005em]">{children}</h3>
  )
}

export function PolicyContact({ intro }: { intro: string }) {
  return (
    <div
      className="rounded-[12px] border bg-dm-bg-soft p-5"
      style={{ borderColor: 'var(--color-dm-line-strong)' }}
    >
      <p className="text-[14px] text-dm-ink-2 leading-[1.6]">{intro}</p>
      <a
        className="mt-2 inline-flex items-center gap-2 font-[var(--font-dm-mono)] text-[13px] text-dm-accent hover:opacity-80"
        href="mailto:support@dockerman.app"
      >
        <span aria-hidden className="text-dm-ink-4">
          →
        </span>
        support@dockerman.app
      </a>
    </div>
  )
}

export function PolicyBody({ children }: { children: ReactNode }) {
  return (
    <section className="px-8 pb-20">
      <div className="mx-auto flex max-w-[820px] flex-col gap-5">{children}</div>
    </section>
  )
}
