'use client'

import { Sparkline } from '@/components/ui/Sparkline'
import { StatCard } from '@/components/ui/StatCard'
import { useSparkline } from './hooks/useSparkline'

const SIDEBAR_MAIN = [
  'Dashboard',
  'Container',
  'Image',
  'Build',
  'Network',
  'Volume',
  'Events',
  'Templates',
] as const

const SIDEBAR_ACTIONS = ['Terminal', 'Process', 'Inspect', 'Stats', 'Logs', 'File'] as const

const MOCK_CONTAINERS = [
  { name: 'redis', img: 'redis:7', state: 'running' as const, seed: [30, 32, 28, 34, 31, 30, 33] },
  {
    name: 'postgres',
    img: 'postgres:16',
    state: 'running' as const,
    seed: [45, 48, 46, 50, 49, 47, 51],
  },
  {
    name: 'traefik',
    img: 'traefik:v3',
    state: 'running' as const,
    seed: [12, 14, 13, 15, 13, 14, 16],
  },
  { name: 'plex', img: 'plexinc/pms:latest', state: 'stopped' as const, seed: [] as number[] },
  {
    name: 'node',
    img: 'node:20-alpine',
    state: 'running' as const,
    seed: [18, 20, 22, 19, 21, 23, 20],
  },
]

export function LiveDashboard() {
  return (
    <div className="mx-auto mt-10 max-w-[1240px] overflow-hidden rounded-[14px] border border-dm-line-strong bg-dm-bg-elev shadow-[0_20px_60px_-20px_rgb(0_0_0_/_0.3)]">
      <Titlebar />
      <div className="grid grid-cols-[220px_1fr]">
        <Sidebar />
        <Main />
      </div>
    </div>
  )
}

function Titlebar() {
  return (
    <div className="flex h-[34px] items-center gap-2 border-dm-line border-b px-3">
      <span className="block h-3 w-3 rounded-full bg-[#ff5f57]" />
      <span className="block h-3 w-3 rounded-full bg-[#febc2e]" />
      <span className="block h-3 w-3 rounded-full bg-[#28c840]" />
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="border-dm-line border-r p-3 text-[13px]">
      <div className="mb-4 flex items-center gap-2 rounded-md bg-dm-bg-soft p-2">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-dm-ink font-bold text-[12px] text-dm-bg">
          L
        </div>
        <div className="flex flex-col">
          <span className="text-dm-ink">Localhost</span>
          <span className="text-[11px] text-dm-ink-3">docker · 28.5.2</span>
        </div>
      </div>

      {SIDEBAR_MAIN.map((label, i) => (
        <SideItem active={i === 0} key={label} label={label} />
      ))}

      <div className="mt-3 mb-1 px-2 font-[var(--font-dm-mono)] text-[10px] text-dm-ink-4 uppercase tracking-wider">
        Actions
      </div>
      {SIDEBAR_ACTIONS.map((label) => (
        <SideItem key={label} label={label} />
      ))}

      <div className="mt-3 mb-1 px-2 font-[var(--font-dm-mono)] text-[10px] text-dm-ink-4 uppercase tracking-wider">
        Containers · {MOCK_CONTAINERS.length}
      </div>
      {MOCK_CONTAINERS.map((c) => (
        <ContainerRow img={c.img} key={c.name} name={c.name} seed={c.seed} state={c.state} />
      ))}
    </aside>
  )
}

const SIDE_ICONS: Record<string, React.ReactNode> = {
  Dashboard: (
    <>
      <rect height="7" rx="1" width="7" x="3" y="3" />
      <rect height="7" rx="1" width="7" x="14" y="3" />
      <rect height="7" rx="1" width="7" x="3" y="14" />
      <rect height="7" rx="1" width="7" x="14" y="14" />
    </>
  ),
  Container: (
    <>
      <rect height="13" rx="2" width="18" x="3" y="7" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  Image: (
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  ),
  Build: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M10 13l-2 2 2 2M14 13l2 2-2 2" />
    </>
  ),
  Network: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M3 12h6M15 12h6M12 3v6M12 15v6" />
    </>
  ),
  Volume: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </>
  ),
  Events: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  Templates: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 15h6M9 18h4" />
    </>
  ),
  Terminal: (
    <>
      <rect height="16" rx="2" width="18" x="3" y="4" />
      <path d="M7 9l3 3-3 3M13 15h4" />
    </>
  ),
  Process: (
    <>
      <rect height="16" rx="2" width="18" x="3" y="4" />
      <path d="M7 8h10M7 12h10M7 16h6" />
    </>
  ),
  Inspect: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  Stats: <path d="M3 20V10M9 20V4M15 20v-8M21 20V14" />,
  Logs: <path d="M4 6h16M4 12h16M4 18h10" />,
  File: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </>
  ),
}

function SideItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex cursor-default items-center gap-2 rounded-md px-2 py-[6px] text-[12px] ${
        active ? 'bg-dm-bg-soft text-dm-ink' : 'text-dm-ink-2 hover:bg-dm-bg-soft'
      }`}
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        {SIDE_ICONS[label]}
      </svg>
      {label}
    </div>
  )
}

function ContainerRow({
  name,
  img,
  state,
  seed,
}: {
  name: string
  img?: string
  state: 'running' | 'stopped'
  seed: number[]
}) {
  const data = useSparkline({
    seed: seed.length > 0 ? seed : [0],
    intervalMs: 1500,
    volatility: 0.2,
    min: 5,
    max: 80,
    enabled: state === 'running',
  })
  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-[6px] font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-2">
      <span
        className="h-[6px] w-[6px] rounded-full"
        style={{
          background: state === 'running' ? 'var(--color-dm-ok)' : 'var(--color-dm-ink-4)',
        }}
      />
      <span className="flex flex-1 flex-col overflow-hidden leading-tight">
        <span className="truncate text-dm-ink">{name}</span>
        {img ? <span className="truncate text-[10px] text-dm-ink-4">{img}</span> : null}
      </span>
      {state === 'running' ? (
        <Sparkline data={data} height={16} stroke="var(--color-dm-ok)" width={44} />
      ) : (
        <span className="text-[10px] text-dm-ink-4">idle</span>
      )}
    </div>
  )
}

function Main() {
  return (
    <div className="p-5">
      <div className="mb-[18px] flex items-center justify-between">
        {/* main-title: 18px / 600 per Landing.html :346-348 (adjusted down slightly to 15px in prior iteration — bring back to design) */}
        <div className="font-semibold text-[18px] text-dm-ink tracking-[-0.01em]">Dashboard</div>
        <div className="flex items-center gap-2 font-[var(--font-dm-mono)] text-[11px]">
          <MainChip>
            <svg
              aria-hidden="true"
              className="h-[11px] w-[11px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            auto-refresh · 2s
          </MainChip>
          <MainChip>
            <span
              className="h-[6px] w-[6px] rounded-full"
              style={{
                background: 'var(--color-dm-ok)',
                animation: 'dm-pulse 2.2s ease-in-out infinite',
              }}
            />
            connected
          </MainChip>
        </div>
      </div>
      <KpiRow />
      <SystemRow />
      <ChartRow />
      <IoRow />
    </div>
  )
}

function MainChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-[6px] rounded-md border border-dm-line bg-dm-bg-elev px-2 py-1 text-dm-ink-3">
      {children}
    </span>
  )
}

function KpiRow() {
  return (
    <div className="grid grid-cols-4 gap-3">
      <StatCard subtitle="8 running · 4 exited" title="Containers" value="12" />
      <StatCard subtitle="3 updates available" title="Images" value="47" />
      <StatCard subtitle="on disk" title="Total Image Size" value="18.4 GB" />
      <StatCard subtitle="of 47" title="Images In Use" value="21" />
    </div>
  )
}

function SystemRow() {
  return (
    <div className="mt-3 grid grid-cols-4 gap-3">
      <StatCard subtitle="Stable" title="Docker Version" value="28.5.2" />
      <StatCard title="Storage Driver" value="overlay2" />
      <StatCard title="System Resources" value="8 CPU · 32 GB" />
      <StatCard title="Operating System" value="macOS 14.5" />
    </div>
  )
}

function ChartRow() {
  const cpu = useSparkline({
    seed: [22, 28, 26, 30, 27, 31, 29, 33, 30, 28, 26, 31],
    intervalMs: 1500,
    volatility: 0.12,
    min: 10,
    max: 85,
  })
  const mem = useSparkline({
    seed: [42, 44, 45, 46, 47, 46, 48, 49, 50, 49, 48, 50],
    intervalMs: 1500,
    volatility: 0.08,
    min: 20,
    max: 80,
  })

  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      <ChartCard stroke="#6366f1" title="CPU" value={`${Math.round(cpu[cpu.length - 1] ?? 0)}%`}>
        <Sparkline data={cpu} height={120} stroke="#6366f1" strokeWidth={1.75} width={500} />
      </ChartCard>
      <ChartCard
        stroke="#10b981"
        title="Memory"
        value={`${Math.round(mem[mem.length - 1] ?? 0)}%`}
      >
        <Sparkline
          data={mem}
          fill="#10b98122"
          height={120}
          stroke="#10b981"
          strokeWidth={1.75}
          width={500}
        />
      </ChartCard>
    </div>
  )
}

function ChartCard({
  title,
  value,
  stroke,
  children,
}: {
  title: string
  value: string
  stroke: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-[12px] border border-dm-line bg-dm-bg-elev p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-dm-ink-3">{title}</span>
        <span
          className="font-[var(--font-dm-mono)] font-semibold text-[20px]"
          style={{ color: stroke }}
        >
          {value}
        </span>
      </div>
      <div className="mt-2 w-full">{children}</div>
    </div>
  )
}

function IoRow() {
  const net = useSparkline({
    seed: [12, 18, 15, 22, 16, 24, 19, 28, 21, 26, 23, 29],
    intervalMs: 1500,
    volatility: 0.2,
    min: 5,
    max: 60,
  })
  const disk = useSparkline({
    seed: [8, 10, 12, 9, 14, 11, 15, 12, 10, 13, 16, 11],
    intervalMs: 1500,
    volatility: 0.15,
    min: 2,
    max: 40,
  })
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      <ChartCard
        stroke="#a855f7"
        title="Network I/O"
        value={`${(net[net.length - 1] ?? 0).toFixed(1)} MB/s`}
      >
        <Sparkline
          data={net}
          fill="#a855f722"
          height={100}
          stroke="#a855f7"
          strokeWidth={1.5}
          width={500}
        />
      </ChartCard>
      <ChartCard
        stroke="#ec4899"
        title="Disk I/O"
        value={`${(disk[disk.length - 1] ?? 0).toFixed(1)} MB/s`}
      >
        <Sparkline
          data={disk}
          fill="#ec489922"
          height={100}
          stroke="#ec4899"
          strokeWidth={1.5}
          width={500}
        />
      </ChartCard>
    </div>
  )
}
