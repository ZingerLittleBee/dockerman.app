interface Row {
  label: string
  free: boolean
  solo: boolean
  team: boolean
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
        label: 'Containers, images, volumes, networks',
        free: true,
        solo: true,
        team: true
      },
      { label: 'Built-in terminal & logs', free: true, solo: true, team: true },
      { label: 'Compose support', free: true, solo: true, team: true },
      { label: 'Command palette (⌘K)', free: true, solo: true, team: true }
    ]
  },
  {
    title: 'Remote & Multi-host',
    rows: [
      { label: 'Remote SSH hosts', free: false, solo: true, team: true },
      { label: 'Multi-host switching', free: false, solo: false, team: true },
      { label: 'Cloudflared tunnels', free: false, solo: true, team: true },
      { label: 'Kubernetes clusters', free: true, solo: true, team: true }
    ]
  },
  {
    title: 'License & support',
    rows: [
      { label: 'Lifetime updates', free: false, solo: true, team: true },
      { label: '14-day refund', free: false, solo: true, team: true },
      { label: 'Priority email support', free: false, solo: false, team: true }
    ]
  }
]

function Mark({ on }: { on: boolean }) {
  return on ? (
    <span aria-label="included" style={{ color: 'var(--color-dm-accent)' }}>
      ✓
    </span>
  ) : (
    <span aria-label="not included" style={{ color: 'var(--color-dm-ink-4)' }}>
      —
    </span>
  )
}

export function ComparisonTable() {
  return (
    <section className="px-8 py-12">
      <div className="mx-auto max-w-[1240px]">
        <h2 className="mb-6 font-bold text-[28px] text-dm-ink tracking-[-0.02em]">
          Compare plans
        </h2>
        <div className="overflow-hidden rounded-[12px] border border-dm-line">
          <table className="w-full border-collapse text-[14px]">
            <thead className="bg-dm-bg-soft text-[12px] text-dm-ink-3">
              <tr>
                <th className="px-4 py-2 text-left font-normal">Feature</th>
                <th className="px-4 py-2 text-center font-normal">Free</th>
                <th className="px-4 py-2 text-center font-normal">Solo</th>
                <th className="px-4 py-2 text-center font-normal">Team</th>
              </tr>
            </thead>
            <tbody>
              {GROUPS.flatMap((group) => [
                <tr className="bg-dm-bg-elev" key={`${group.title}-h`}>
                  <td
                    className="px-4 py-2 font-[var(--font-dm-mono)] text-[11px] text-dm-ink-3 uppercase tracking-wider"
                    colSpan={4}
                  >
                    {group.title}
                  </td>
                </tr>,
                ...group.rows.map((r) => (
                  <tr className="border-dm-line border-t" key={r.label}>
                    <td className="px-4 py-3 text-dm-ink-2">{r.label}</td>
                    <td className="px-4 py-3 text-center">
                      <Mark on={r.free} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Mark on={r.solo} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Mark on={r.team} />
                    </td>
                  </tr>
                ))
              ])}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
