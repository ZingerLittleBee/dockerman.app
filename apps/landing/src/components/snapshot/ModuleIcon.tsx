import type { MODULE_ICONS } from '@/config/snapshot'

type IconKey = keyof typeof MODULE_ICONS

const ICONS: Record<IconKey, React.ReactNode> = {
  dash: (
    <>
      <rect height="9" rx="1" width="7" x="3" y="3" />
      <rect height="5" rx="1" width="7" x="14" y="3" />
      <rect height="5" rx="1" width="7" x="3" y="16" />
      <rect height="9" rx="1" width="7" x="14" y="12" />
    </>
  ),
  term: (
    <>
      <rect height="16" rx="2" width="18" x="3" y="4" />
      <path d="M7 10l3 2-3 2M12 16h5" />
    </>
  ),
  proc: (
    <>
      <rect height="18" rx="2" width="18" x="3" y="3" />
      <path d="M3 9h18M9 3v18" />
    </>
  ),
  inspect: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </>
  ),
  stats: (
    <>
      <path d="M3 18L9 10l4 5 8-10" />
      <path d="M14 5h7v7" />
    </>
  ),
  logs: (
    <>
      <path d="M4 4h12l4 4v12H4z" />
      <path d="M16 4v4h4" />
      <path d="M8 12h8M8 16h5" />
    </>
  ),
  ssh: <path d="M5 7l6 5-6 5M13 19h6" />,
  build: (
    <>
      <path d="M14 3l4 4-9 9-4 1 1-4 8-8zM13 7l4 4" />
    </>
  ),
  events: <path d="M3 4h18M3 10h18M3 16h12M3 22h8" />,
  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
    </>
  ),
  preview: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  image: (
    <>
      <path d="M3 12a9 9 0 0 1 18 0M3 12a9 9 0 0 0 18 0M12 3v18" />
    </>
  ),
  compose: (
    <>
      <rect height="7" rx="1" width="7" x="3" y="4" />
      <rect height="7" rx="1" width="7" x="14" y="4" />
      <rect height="7" rx="1" width="7" x="3" y="14" />
      <rect height="7" rx="1" width="7" x="14" y="14" />
    </>
  ),
  volume: (
    <>
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5M3 12c0 1.7 4 3 9 3s9-1.3 9-3" />
    </>
  ),
  storage: (
    <>
      <rect height="6" rx="1" width="18" x="3" y="5" />
      <rect height="6" rx="1" width="18" x="3" y="13" />
      <circle cx="7" cy="8" fill="currentColor" r="0.7" stroke="none" />
      <circle cx="7" cy="16" fill="currentColor" r="0.7" stroke="none" />
    </>
  ),
  hub: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2l9 4v6c0 5-3.5 9.5-9 10-5.5-.5-9-5-9-10V6l9-4z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  k8s: (
    <>
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" />
      <path d="M12 7l5 3v4l-5 3-5-3v-4l5-3z" />
    </>
  )
}

export function ModuleIcon({
  icon,
  className = 'h-[15px] w-[15px]'
}: {
  icon: IconKey
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      {ICONS[icon]}
    </svg>
  )
}
