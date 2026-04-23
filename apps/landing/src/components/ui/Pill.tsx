import type { ReactNode } from 'react'

export function Pill({ children, dot = false }: { children: ReactNode; dot?: boolean }) {
  return (
    <span className="inline-flex items-center gap-[10px] rounded-full border border-dm-line-strong bg-dm-bg-elev px-[10px] py-[5px] pl-[6px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-2">
      {dot && (
        <span
          className="h-[6px] w-[6px] rounded-full"
          style={{
            background: 'var(--color-dm-ok)',
            boxShadow: '0 0 0 4px color-mix(in srgb, var(--color-dm-ok) 30%, transparent)',
            animation: 'dm-pulse 2.2s ease-in-out infinite',
          }}
        />
      )}
      {children}
    </span>
  )
}
