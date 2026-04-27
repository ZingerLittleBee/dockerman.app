import type { Locale } from '@repo/shared/i18n'

export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso)
  const tag =
    locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : locale === 'es' ? 'es-ES' : 'en-US'
  try {
    return new Intl.DateTimeFormat(tag, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    }).format(d)
  } catch {
    return iso
  }
}
