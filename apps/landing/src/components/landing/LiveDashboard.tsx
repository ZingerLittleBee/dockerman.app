'use client'

import { Sparkline } from '@/components/ui-dm/Sparkline'
import { StatCard } from '@/components/ui-dm/StatCard'
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
        <ContainerRow key={c.name} name={c.name} seed={c.seed} state={c.state} />
      ))}
    </aside>
  )
}

function SideItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex cursor-default items-center gap-2 rounded-md px-2 py-[6px] text-[12px] ${
        active ? 'bg-dm-bg-soft text-dm-ink' : 'text-dm-ink-2 hover:bg-dm-bg-soft'
      }`}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        {/* Placeholder generic square; fidelity pass (Task 2.15) replaces with per-label icons. */}
        <rect height="7" rx="1" width="7" x="3" y="3" />
        <rect height="7" rx="1" width="7" x="14" y="3" />
        <rect height="7" rx="1" width="7" x="3" y="14" />
        <rect height="7" rx="1" width="7" x="14" y="14" />
      </svg>
      {label}
    </div>
  )
}

function ContainerRow({
  name,
  state,
  seed,
}: {
  name: string
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
    <div className="flex items-center gap-2 rounded-md px-2 py-[6px] text-[12px] text-dm-ink-2">
      <span
        className="h-[6px] w-[6px] rounded-full"
        style={{
          background: state === 'running' ? 'var(--color-dm-ok)' : 'var(--color-dm-ink-4)',
        }}
      />
      <span className="flex-1 truncate">{name}</span>
      {state === 'running' ? (
        <Sparkline data={data} height={16} stroke="var(--color-dm-ok)" width={60} />
      ) : (
        <span className="text-[10px] text-dm-ink-4">idle</span>
      )}
    </div>
  )
}

function Main() {
  return (
    <div className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="font-semibold text-[16px] text-dm-ink">Dashboard</div>
        <div className="flex items-center gap-2 text-[11px] text-dm-ink-3">
          <span
            className="h-[6px] w-[6px] rounded-full"
            style={{
              background: 'var(--color-dm-ok)',
              animation: 'dm-pulse 2.2s ease-in-out infinite',
            }}
          />
          live
        </div>
      </div>
      <KpiRow />
      <SystemRow />
      <ChartRow />
      <IoRow />
    </div>
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
  return null
}

function IoRow() {
  return null
}
