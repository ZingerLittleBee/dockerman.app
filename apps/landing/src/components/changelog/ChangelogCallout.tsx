'use client'

import type { Locale } from '@repo/shared/i18n'
import { useTranslation } from '@repo/shared/i18n/client'
import type { ChangelogCalloutType } from '@/lib/changelog'

const STYLES: Record<ChangelogCalloutType, { border: string; bg: string; labelKey: string }> = {
  note: { bg: 'bg-dm-bg-soft', border: 'border-dm-line', labelKey: 'changelog.callout.note' },
  tip: { bg: 'bg-dm-accent/5', border: 'border-dm-accent/40', labelKey: 'changelog.callout.tip' },
  warn: { bg: 'bg-dm-warn/10', border: 'border-dm-warn/40', labelKey: 'changelog.callout.warn' }
}

export function ChangelogCallout({
  type,
  body,
  locale
}: {
  type: ChangelogCalloutType
  body: string
  locale: Locale
}) {
  const { t } = useTranslation(locale)
  const s = STYLES[type]
  return (
    <div className={`my-4 rounded-[10px] border p-3 text-[13px] ${s.border} ${s.bg}`}>
      <div className="mb-1 font-semibold text-[11px] text-dm-ink-3 uppercase tracking-wider">
        {t(s.labelKey)}
      </div>
      <div className="text-dm-ink-2">{body}</div>
    </div>
  )
}
