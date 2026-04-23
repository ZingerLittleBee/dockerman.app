const MODULES: Module[] = [
  {
    num: '01 / containers',
    chip: 'most used',
    title: 'Inspect without the ',
    titleEm: 'noise.',
    body: 'Stats, logs, env, mounts, processes, a real terminal, and a file browser — all available without leaving the row. Commit to a new image or clone the config into a create dialog with a single command.',
    bullets: [
      'ring gauges + sparklines for CPU, memory, net, disk',
      'container backup/restore with volumes and filesystem',
      'docker-run parser — paste a command, get a dialog',
    ],
  },
  {
    num: '02 / compose',
    chip: 'new',
    title: 'Compose projects, ',
    titleEm: 'grouped like they live.',
    body: 'Toggle between flat list and grouped-by-project views. Full lifecycle: up, stop, restart, pull, remove. Every Compose CLI flag exposed, including profiles and dry-run.',
    bullets: [
      'standalone containers collapse into their own section',
      'env-file + file + profile support',
      'project status at a glance',
    ],
  },
  {
    num: '03 / images',
    chip: '1-click',
    title: 'A layer explorer that ',
    titleEm: 'earns its place.',
    body: 'Interactive size distribution, per-layer Dockerfile commands, CVE scanning via Trivy, and push to any registry with credential auto-match. Export analysis to JSON.',
    bullets: [
      'color-coded layer bar with expand/collapse',
      'Docker Hub search + tags + README inline',
      'digest-level upgrade with one-click rollback',
    ],
  },
  {
    num: '04 / system',
    chip: 'deep',
    title: 'Every runtime knob, ',
    titleEm: 'exposed and safe.',
    body: 'WSL2 engine on Windows without Docker Desktop. SSH socket forwarding with heartbeat reconnect. Private registry credentials that match on pull. Global shortcuts even on Wayland.',
    bullets: [
      'tray with live CPU / mem in the menu bar',
      'real-time event notifications for non-zero exits, OOMs',
      'one-click disk prune with an interactive breakdown',
    ],
  },
]

type Module = {
  num: string
  chip: string
  title: string
  titleEm: string
  body: string
  bullets: string[]
}

export function ModulesSection() {
  return (
    <section className="px-8 py-24" id="modules">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-12 flex max-w-[780px] flex-col gap-[14px]">
          <div
            className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
            style={{ color: 'var(--color-dm-accent)' }}
          >
            <span className="text-dm-ink-4">// </span>modules
          </div>
          <h2 className="m-0 font-bold text-[clamp(32px,4.5vw,56px)] text-dm-ink leading-[1.02] tracking-[-0.035em]">
            Built for the things you{' '}
            <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
              actually
            </em>{' '}
            do every day.
          </h2>
          <p className="m-0 max-w-[52ch] text-[17px] text-dm-ink-3 leading-[1.5]">
            Nine years of Docker UIs and most still feel like a port of a web admin panel. Dockerman
            is designed for people who were going to run the{' '}
            <code className="rounded bg-dm-bg-soft px-[6px] py-[1px] font-[var(--font-dm-mono)] text-[14px]">
              docker
            </code>{' '}
            command anyway.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
          {MODULES.map((m) => (
            <article className="border-dm-line border-t pt-10" key={m.num}>
              <div className="flex items-center justify-between pb-[18px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-4">
                <span>{m.num}</span>
                <span
                  className="rounded-full px-2 py-[3px] font-semibold"
                  style={{
                    background: 'color-mix(in srgb, var(--color-dm-accent) 10%, transparent)',
                    color: 'var(--color-dm-accent)',
                  }}
                >
                  {m.chip}
                </span>
              </div>
              <h3 className="mb-[10px] font-semibold text-[24px] text-dm-ink tracking-[-0.02em]">
                {m.title}
                <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
                  {m.titleEm}
                </em>
              </h3>
              <p className="m-0 text-[14.5px] text-dm-ink-3 leading-[1.55]">{m.body}</p>
              <ul className="m-0 mt-[18px] flex list-none flex-col gap-[6px] p-0">
                {m.bullets.map((b) => (
                  <li
                    className="flex items-center gap-[10px] font-[var(--font-dm-mono)] text-[13px] text-dm-ink-2"
                    key={b}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-px w-[6px]"
                      style={{ background: 'var(--color-dm-accent)' }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
