import { SNAPSHOT_MODULES } from '@/config/snapshot'

export function SnapshotHero() {
  const count = SNAPSHOT_MODULES.length
  return (
    <section className="relative px-8 pt-14 pb-8">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-[1] h-[420px] w-[900px] -translate-x-1/2 blur-[40px]"
        style={{
          background:
            'radial-gradient(ellipse at center top, color-mix(in srgb, var(--color-dm-accent-2) 22%, transparent), transparent 60%)'
        }}
      />
      <div className="mx-auto max-w-[1320px]">
        <span className="inline-flex items-center gap-[10px] rounded-full border border-dm-line-strong bg-dm-bg-elev py-[5px] pr-[11px] pl-[11px] font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-2 tracking-[0.02em]">
          <span
            className="bg-clip-text px-[5px] font-bold text-transparent"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))'
            }}
          >
            {count}
          </span>
          <span>modules · one window</span>
        </span>

        <h1 className="mt-[18px] max-w-[16ch] font-bold text-[clamp(44px,6.2vw,84px)] text-dm-ink leading-[0.98] tracking-[-0.04em]">
          Every screen,{' '}
          <em
            className="bg-clip-text font-[var(--font-dm-display)] font-normal text-transparent italic tracking-[-0.02em]"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))',
              // Italic glyphs (e.g. `l`, `y`, `f`) overshoot the tight
              // `leading-[0.98]` line box. Without room, the gradient paint
              // area (background-clip: text) clips their tops/descenders.
              // box-decoration-break: clone makes the padding apply to every
              // line fragment, so wrapping (`every` + `surface.`) paints cleanly.
              paddingInline: '0.18em',
              marginInline: '-0.18em',
              paddingBlock: '0.18em',
              marginBlock: '-0.18em',
              WebkitBoxDecorationBreak: 'clone',
              boxDecorationBreak: 'clone'
            }}
          >
            every surface.
          </em>
        </h1>

        <p className="mt-[22px] max-w-[62ch] text-[17px] text-dm-ink-3 leading-[1.55]">
          A tour of Dockerman’s {count} core modules — dashboard, terminal, logs, images, volumes,
          Kubernetes, and everything in between. Click a module to preview, or press{' '}
          <strong className="text-dm-ink">↑/↓</strong> to walk through them.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-7 rounded-[12px] border border-dm-line bg-dm-bg-elev px-[22px] py-[18px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-3">
          <MetaField label="Modules" value={String(count)} />
          <MetaSep />
          <MetaField label="Build" value="v5.1.0" />
          <MetaSep />
          <MetaField label="Captured at" value="2400 × 1600" />
          <div className="ml-auto flex items-center gap-[10px]">
            <span className="text-[10.5px] text-dm-ink-4 uppercase tracking-[0.08em]">
              Shortcut
            </span>
            <Key>↑</Key>
            <Key>↓</Key>
            <Key>esc</Key>
          </div>
        </div>
      </div>
    </section>
  )
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-[10px]">
      <span className="text-[10.5px] text-dm-ink-4 uppercase tracking-[0.08em]">{label}</span>
      <strong className="font-[var(--font-sans)] font-semibold text-[16px] text-dm-ink tracking-[-0.01em]">
        {value}
      </strong>
    </div>
  )
}

function MetaSep() {
  return <span aria-hidden="true" className="h-[22px] w-px bg-dm-line" />
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-[5px] border border-dm-line bg-dm-bg-soft px-[7px] py-[3px] font-[var(--font-dm-mono)] text-[11px] text-dm-ink-2">
      {children}
    </span>
  )
}
