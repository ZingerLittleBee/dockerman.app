import type { ReactNode } from 'react'

export function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string
  value: ReactNode
  subtitle?: string
  icon?: ReactNode
}) {
  return (
    <div className="rounded-[12px] border border-dm-line bg-dm-bg-elev p-4">
      <div className="flex items-center justify-between text-[12px] text-dm-ink-3">
        <span>{title}</span>
        {icon}
      </div>
      <div className="mt-2 font-bold text-[28px] text-dm-ink tracking-[-0.02em]">{value}</div>
      {subtitle && <div className="mt-1 text-[12px] text-dm-ink-4">{subtitle}</div>}
    </div>
  )
}
