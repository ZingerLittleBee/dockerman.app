import type { ChangelogCalloutType } from '@/lib/changelog'

const STYLES: Record<ChangelogCalloutType, { border: string; bg: string; label: string }> = {
  note: { bg: 'bg-dm-bg-soft', border: 'border-dm-line', label: 'Note' },
  tip: { bg: 'bg-dm-accent/5', border: 'border-dm-accent/40', label: 'Tip' },
  warn: { bg: 'bg-dm-warn/10', border: 'border-dm-warn/40', label: 'Warning' }
}

export function ChangelogCallout({ type, body }: { type: ChangelogCalloutType; body: string }) {
  const s = STYLES[type]
  return (
    <div className={`my-4 rounded-[10px] border p-3 text-[13px] ${s.border} ${s.bg}`}>
      <div className="mb-1 font-semibold text-[11px] text-dm-ink-3 uppercase tracking-wider">
        {s.label}
      </div>
      <div className="text-dm-ink-2">{body}</div>
    </div>
  )
}
