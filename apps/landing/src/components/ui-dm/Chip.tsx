import type { ReactNode } from 'react'

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-dm-line px-2 py-[2px] font-[var(--font-dm-mono)] text-[11px] text-dm-ink-2">
      {children}
    </span>
  )
}
