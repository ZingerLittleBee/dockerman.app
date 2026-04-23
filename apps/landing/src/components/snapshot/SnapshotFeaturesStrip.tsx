const FEATURES = [
  {
    num: '01',
    title: 'Real-time monitoring',
    body: 'Every pane subscribes to a libpod or docker.sock event stream — no polling, no stale data. Sparklines tick every 1.5 s.',
    path: 'M3 12l4-4 3 3 5-8 3 6h3'
  },
  {
    num: '02',
    title: 'Container management',
    body: 'Create, inspect, exec, diff, commit, save. Every primitive docker exposes, surfaced with keyboard shortcuts and contextual actions.',
    path: 'M4 8h4l2 3 4-6 2 3h4M4 16h16'
  },
  {
    num: '03',
    title: 'Remote connectivity',
    body: 'Docker over SSH, WSL2, Colima, and Podman sockets. Bookmark hosts, switch from the titlebar — your engine picker remembers per-project.',
    paths: ['circle', 'M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18']
  },
  {
    num: '04',
    title: 'Native performance',
    body: 'Rust + Tauri. 38 MB install, 84 MB idle on an M2 with 20 containers. No Chromium, no Electron overhead, no 400 MB sad tab.',
    path: 'M12 2l9 4v6c0 5-3.5 9.5-9 10-5.5-.5-9-5-9-10V6l9-4z'
  }
] as const

export function SnapshotFeaturesStrip() {
  return (
    <section className="border-dm-line border-t px-8 pt-16 pb-10">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-4 flex items-center gap-[14px] font-[var(--font-dm-mono)] font-semibold text-[11px] text-dm-ink-4 uppercase tracking-[0.1em]">
          What the screenshots miss
          <span aria-hidden="true" className="h-px max-w-[300px] flex-1 bg-dm-line" />
        </div>
        <h2 className="m-0 mb-10 max-w-[22ch] font-bold text-[clamp(28px,3.2vw,40px)] text-dm-ink leading-[1.08] tracking-[-0.028em]">
          The surface is the app.{' '}
          <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
            The substance is underneath.
          </em>
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {FEATURES.map((f) => (
            <article
              className="rounded-[12px] border border-dm-line bg-dm-bg-elev p-5 pt-[22px] transition-all hover:-translate-y-[2px] hover:border-dm-line-strong"
              key={f.num}
            >
              <div
                className="mb-[14px] grid h-10 w-10 place-items-center rounded-[10px] border"
                style={{
                  background: 'color-mix(in srgb, var(--color-dm-accent) 10%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--color-dm-accent) 22%, transparent)',
                  color: 'var(--color-dm-accent)'
                }}
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  {'paths' in f ? (
                    <>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
                    </>
                  ) : (
                    <path d={f.path} />
                  )}
                </svg>
              </div>
              <div className="mb-[6px] font-[var(--font-dm-mono)] font-semibold text-[10.5px] text-dm-ink-4 tracking-[0.08em]">
                {f.num}
              </div>
              <h4 className="m-0 mb-2 font-bold text-[16.5px] text-dm-ink tracking-[-0.015em]">
                {f.title}
              </h4>
              <p className="m-0 text-[13.5px] text-dm-ink-3 leading-[1.55]">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
