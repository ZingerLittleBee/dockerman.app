type RowValue = boolean | string | { text: string; accent?: boolean }
interface Row {
  label: string
  desc?: string
  free: RowValue
  team: RowValue
  solo: RowValue
}
interface Group {
  title: string
  rows: Row[]
}

const GROUPS: Group[] = [
  {
    title: 'Core',
    rows: [
      {
        label: 'Local Docker & Podman',
        desc: 'containers · images · volumes · networks',
        free: true,
        team: true,
        solo: true,
      },
      { label: 'Command palette', desc: '⌘; everywhere', free: true, team: true, solo: true },
      { label: 'Terminal, logs, file browser', free: true, team: true, solo: true },
      {
        label: 'Compose projects',
        desc: 'docker-compose & docker-run parser',
        free: true,
        team: true,
        solo: true,
      },
      { label: 'Trivy CVE scan + image registry', free: true, team: true, solo: true },
    ],
  },
  {
    title: 'Remote & Multi-host',
    rows: [
      {
        label: 'Remote Docker via SSH',
        desc: 'socket forwarding with heartbeat reconnect',
        free: false,
        team: true,
        solo: true,
      },
      { label: 'Multi-host bookmarks & switcher', free: false, team: true, solo: true },
      {
        label: 'Kubernetes clusters',
        desc: 'pods · deployments · configmaps · events',
        free: false,
        team: true,
        solo: true,
      },
      {
        label: 'Cloudflared tunnels',
        desc: 'one-click public URLs',
        free: false,
        team: true,
        solo: true,
      },
    ],
  },
  {
    title: 'License & support',
    rows: [
      { label: 'Devices', free: 'unlimited', team: '3', solo: '1' },
      { label: 'Lifetime updates', free: false, team: true, solo: true },
      {
        label: 'Support',
        free: 'community',
        team: { text: 'priority · 24h', accent: true },
        solo: 'email · 48h',
      },
      { label: 'Commercial use', free: false, team: true, solo: true },
    ],
  },
]

function Cell({ v }: { v: RowValue }) {
  if (typeof v === 'boolean') {
    return v ? (
      <span
        aria-label="included"
        className="inline-grid h-[22px] w-[22px] place-items-center rounded-md"
        style={{
          background: 'color-mix(in srgb, var(--color-dm-ok) 16%, transparent)',
          color: 'var(--color-dm-ok)',
        }}
      >
        <svg fill="none" height="11" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" width="11">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    ) : (
      <span
        aria-label="not included"
        className="inline-grid h-[22px] w-[22px] place-items-center rounded-md bg-dm-bg-soft text-dm-ink-4"
      >
        <svg fill="none" height="11" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="11">
          <line x1="6" x2="18" y1="6" y2="18" />
          <line x1="6" x2="18" y1="18" y2="6" />
        </svg>
      </span>
    )
  }
  if (typeof v === 'string') {
    return <span className="font-[var(--font-dm-mono)] text-[12px] text-dm-ink-2">{v}</span>
  }
  return (
    <span
      className="font-[var(--font-dm-mono)] text-[12px]"
      style={{ color: v.accent ? 'var(--color-dm-accent-2)' : 'var(--color-dm-ink-2)' }}
    >
      {v.text}
    </span>
  )
}

export function ComparisonTable() {
  return (
    <section className="px-8 pt-24 pb-10">
      <div className="mx-auto max-w-[1140px]">
        <div className="mb-9 max-w-[680px]">
          <div
            className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
            style={{ color: 'var(--color-dm-accent-2)' }}
          >
            <span className="text-dm-ink-4">// </span>compare plans
          </div>
          <h2 className="mx-0 mt-[10px] mb-3 font-bold text-[clamp(28px,3.6vw,40px)] text-dm-ink leading-[1.05] tracking-[-0.03em]">
            What you get,{' '}
            <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
              feature by feature.
            </em>
          </h2>
          <p className="m-0 text-[15.5px] text-dm-ink-3 leading-[1.55]">
            Every plan includes the full local experience. Paid tiers add remote hosts and priority
            support.
          </p>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-dm-line bg-dm-bg-elev text-[13.5px]">
          {/* Header row */}
          <div
            className="grid items-center border-dm-line border-b bg-dm-bg-soft px-[22px] py-[14px] font-[var(--font-dm-mono)] font-semibold text-[11.5px] text-dm-ink-3 uppercase tracking-[0.06em]"
            style={{ gridTemplateColumns: '2.2fr 1fr 1fr 1fr' }}
          >
            <div className="text-left">Feature</div>
            <div className="text-center">Free</div>
            <div className="text-center" style={{ color: 'var(--color-dm-accent-2)' }}>
              Team
            </div>
            <div className="text-center">Solo</div>
          </div>

          {GROUPS.map((group) => (
            <div key={group.title}>
              {/* Section label */}
              <div
                className="grid items-center border-dm-line border-b bg-dm-bg px-[22px] py-[14px] font-[var(--font-dm-mono)] font-semibold text-[12px] text-dm-ink-2 uppercase tracking-[0.08em]"
                style={{ gridTemplateColumns: '2.2fr 1fr 1fr 1fr' }}
              >
                <div className="text-left">{group.title}</div>
                <div />
                <div />
                <div />
              </div>
              {group.rows.map((r) => (
                <div
                  className="grid items-center border-dm-line border-b px-[22px] py-[14px] last:border-b-0"
                  key={`${group.title}-${r.label}`}
                  style={{ gridTemplateColumns: '2.2fr 1fr 1fr 1fr' }}
                >
                  <div className="text-left">
                    <div className="font-medium text-[14px] text-dm-ink tracking-[-0.005em]">
                      {r.label}
                    </div>
                    {r.desc ? (
                      <div className="mt-[2px] font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-4">
                        {r.desc}
                      </div>
                    ) : null}
                  </div>
                  <div className="text-center">
                    <Cell v={r.free} />
                  </div>
                  <div className="text-center">
                    <Cell v={r.team} />
                  </div>
                  <div className="text-center">
                    <Cell v={r.solo} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
