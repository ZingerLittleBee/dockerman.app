import { PaletteViz } from './PaletteViz'

export function FeaturesGrid() {
  return (
    <section className="px-8 py-24" id="features">
      <div className="mx-auto max-w-[1240px]">
        <SectionHead />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[minmax(200px,auto)]">
          <PaletteCard />
          <ImageUpgradeCard />
          <PodmanCard />
          <KubernetesCard />
          <EventsCard />
          <CloudflaredCard />
          <LogsCard />
          <SecurityCard />
        </div>
      </div>
    </section>
  )
}

function SectionHead() {
  return (
    <div className="mb-12 flex max-w-[780px] flex-col gap-[14px]">
      <div
        className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
        style={{ color: 'var(--color-dm-accent)' }}
      >
        <span className="text-dm-ink-4">// </span>features
      </div>
      <h2 className="m-0 font-bold text-[clamp(32px,4.5vw,56px)] text-dm-ink leading-[1.02] tracking-[-0.035em]">
        Every object you care about,{' '}
        <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
          one keystroke away.
        </em>
      </h2>
      <p className="m-0 max-w-[52ch] text-[17px] text-dm-ink-3 leading-[1.5]">
        Containers, images, volumes, networks, compose projects, Kubernetes workloads, Cloudflared
        tunnels — all surfaced in a single, low-latency interface.
      </p>
    </div>
  )
}

/* ------------------------------ feature card primitives ------------------------------ */

type CardShape = 'large' | 'med' | 'tall' | 'wide'

const SHAPE_CLASSES: Record<CardShape, string> = {
  large: 'md:col-span-4 md:row-span-2',
  med: 'md:col-span-2 md:row-span-1',
  tall: 'md:col-span-2 md:row-span-2',
  wide: 'md:col-span-2 md:row-span-1',
}

function FeatCard({
  shape,
  icon,
  iconColor = 'accent',
  title,
  children,
  visual,
}: {
  shape: CardShape
  icon: React.ReactNode
  iconColor?: 'accent' | 'accent-2' | 'accent-warm' | 'ok' | 'err'
  title: string
  children: React.ReactNode
  visual?: React.ReactNode
}) {
  const iconBg: Record<string, string> = {
    accent: 'color-mix(in srgb, var(--color-dm-accent) 12%, transparent)',
    'accent-2': 'color-mix(in srgb, var(--color-dm-accent-2) 12%, transparent)',
    'accent-warm': 'color-mix(in srgb, var(--color-dm-accent-warm) 12%, transparent)',
    ok: 'color-mix(in srgb, var(--color-dm-ok) 12%, transparent)',
    err: 'color-mix(in srgb, var(--color-dm-err) 12%, transparent)',
  }
  const iconFg: Record<string, string> = {
    accent: 'var(--color-dm-accent)',
    'accent-2': 'var(--color-dm-accent-2)',
    'accent-warm': 'var(--color-dm-accent-warm)',
    ok: 'var(--color-dm-ok)',
    err: 'var(--color-dm-err)',
  }
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-[14px] border border-dm-line bg-dm-bg-elev p-6 transition-all hover:border-dm-line-strong hover:-translate-y-px ${SHAPE_CLASSES[shape]}`}
    >
      <div
        className="mb-[14px] grid h-8 w-8 place-items-center rounded-[8px]"
        style={{ background: iconBg[iconColor], color: iconFg[iconColor] }}
      >
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-[18px] text-dm-ink tracking-[-0.015em]">{title}</h3>
      <p className="m-0 text-[13.5px] text-dm-ink-3 leading-[1.5]">{children}</p>
      {visual ? (
        <div className="relative mt-auto min-h-[140px] pt-[18px]">{visual}</div>
      ) : null}
    </article>
  )
}

/* ---------- large: command palette ---------- */
function PaletteCard() {
  return (
    <FeatCard
      icon={
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <rect height="16" rx="2" width="18" x="3" y="4" />
          <path d="M7 9l3 3-3 3M13 15h4" />
        </svg>
      }
      shape="large"
      title="Command palette is the app"
      visual={<PaletteViz />}
    >
      ⌘; opens a universal fuzzy finder across every container, image, compose project, network,
      volume, Pod, Service, and recent action. No menus, no tabs, no hunting.
    </FeatCard>
  )
}

/* ---------- med: image upgrades ---------- */
function ImageUpgradeCard() {
  return (
    <FeatCard
      icon={
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M12 4v12M7 9l5-5 5 5M5 20h14" />
        </svg>
      }
      shape="med"
      title="Image upgrade detection"
    >
      Digest-level diffs. One-click upgrade with automatic backup and rollback.
    </FeatCard>
  )
}

/* ---------- med: docker & podman ---------- */
function PodmanCard() {
  return (
    <FeatCard
      icon={
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" />
          <path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" />
        </svg>
      }
      iconColor="accent-warm"
      shape="med"
      title="Docker & Podman, one UI"
    >
      Automatic runtime detection. Rootless sockets discovered on Linux and macOS.
    </FeatCard>
  )
}

/* ---------- tall: k8s ---------- */
function KubernetesCard() {
  return (
    <FeatCard
      icon={
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M12 2l9 5v10l-9 5-9-5V7z" />
          <path d="M12 12l9-5M12 12L3 7M12 12v10" />
        </svg>
      }
      iconColor="accent-2"
      shape="tall"
      title="Kubernetes, side-by-side"
      visual={
        <div className="flex flex-col gap-[6px]">
          <VizBadge state="running">deployment/web · 3/3 ready</VizBadge>
          <VizBadge state="running">service/api · forwarded :8080</VizBadge>
          <VizBadge state="running">pod/worker-7d4f · 2d 14h</VizBadge>
          <VizBadge opacity={0.7} state="paused">
            cronjob/backup · waiting
          </VizBadge>
          <VizBadge opacity={0.5} state="stopped">
            statefulset/db · 1/1
          </VizBadge>
        </div>
      }
    >
      Load kubeconfigs or spin up a local k3d cluster. Browse Deployments, Pods, CRDs, Helm
      releases. Port-forward anything with automatic local DNS.
    </FeatCard>
  )
}

function VizBadge({
  children,
  state,
  opacity = 1,
}: {
  children: React.ReactNode
  state: 'running' | 'paused' | 'stopped'
  opacity?: number
}) {
  const bg: Record<string, string> = {
    running: 'var(--color-dm-ok)',
    paused: 'var(--color-dm-warn)',
    stopped: 'var(--color-dm-ink-4)',
  }
  return (
    <span
      className="inline-flex items-center gap-[6px] rounded-md border border-dm-line bg-dm-bg-soft px-2 py-[3px] font-[var(--font-dm-mono)] text-[10.5px] text-dm-ink-2"
      style={{ opacity }}
    >
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{
          background: bg[state],
          boxShadow:
            state === 'running'
              ? '0 0 8px color-mix(in srgb, var(--color-dm-ok) 60%, transparent)'
              : undefined,
        }}
      />
      {children}
    </span>
  )
}

/* ---------- wide: events ---------- */
function EventsCard() {
  return (
    <FeatCard
      icon={
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M12 9v4M12 17h.01" />
          <path d="M10.3 3.86a2 2 0 0 1 3.4 0l8.94 15A2 2 0 0 1 20.93 22H3.07a2 2 0 0 1-1.71-3.14l8.94-15z" />
        </svg>
      }
      iconColor="err"
      shape="wide"
      title="Events, loud and legible"
    >
      Desktop notifications for non-zero exits, OOM kills, and failing health checks. Every event is
      copyable, filterable, and exportable.
    </FeatCard>
  )
}

/* ---------- wide: cloudflared ---------- */
function CloudflaredCard() {
  return (
    <FeatCard
      icon={
        <svg fill="none" height="16" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="16">
          <path d="M17.5 19a4.5 4.5 0 0 0 0-9 7 7 0 0 0-13.7 2.2A4 4 0 0 0 5 19h12.5z" />
        </svg>
      }
      shape="wide"
      title="One-click public tunnels"
    >
      Expose any container port to the internet via Cloudflared. Tunnels auto-reap when containers
      stop, and persist across crashes.
    </FeatCard>
  )
}

/* ---------- wide: logs ---------- */
function LogsCard() {
  return (
    <FeatCard
      icon={
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      }
      shape="wide"
      title="Logs that don't stall"
    >
      Virtualized viewer with follow/pause, regex highlight, and TXT/JSON export. Keyboard-first —{' '}
      <code className="rounded bg-dm-bg-soft px-[5px] py-[1px] font-[var(--font-dm-mono)] text-[11px]">
        P
      </code>{' '}
      pauses,{' '}
      <code className="rounded bg-dm-bg-soft px-[5px] py-[1px] font-[var(--font-dm-mono)] text-[11px]">
        /
      </code>{' '}
      searches.
    </FeatCard>
  )
}

/* ---------- wide: security ---------- */
function SecurityCard() {
  return (
    <FeatCard
      icon={
        <svg
          fill="none"
          height="16"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="16"
        >
          <path d="M12 2l9 4v6c0 5-3.5 9.5-9 10-5.5-.5-9-5-9-10V6l9-4z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      }
      iconColor="ok"
      shape="wide"
      title="Images you can trust"
    >
      Built-in Trivy CVE scanning with severity filtering and review. Private registry credentials
      auto-match on pull. Push to any registry with streaming progress.
    </FeatCard>
  )
}
