const RUNTIMES = [
  { name: 'Docker' },
  { name: 'Podman' },
  { name: 'Kubernetes' },
  { name: 'SSH' },
  { name: 'Cloudflared' },
  { name: 'WSL2' },
]

export function RuntimeStrip() {
  return (
    <section className="border-dm-line border-y bg-dm-bg-elev/50">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-8 py-6 text-[12px] text-dm-ink-3">
        <span className="font-[var(--font-dm-mono)] uppercase tracking-wider">Runs with</span>
        {RUNTIMES.map((r) => (
          <span className="inline-flex items-center gap-2 text-dm-ink-2" key={r.name}>
            <span
              className="h-[6px] w-[6px] rounded-full"
              style={{ background: 'var(--color-dm-accent)' }}
            />
            {r.name}
          </span>
        ))}
      </div>
    </section>
  )
}
