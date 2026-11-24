import type { getTranslation } from '@repo/shared/i18n/server'

/** Server-side translator handed to every home section, so the page builds one i18n instance. */
export type HomeT = Awaited<ReturnType<typeof getTranslation>>['t']

/** Reads a translated array (e.g. `home.engines.items`) from the locale file. */
export function list<T = string>(t: HomeT, key: string): T[] {
  return t(key, { returnObjects: true }) as T[]
}

const PALETTE_KEYS = [
  'aria',
  'placeholder',
  'pages',
  'dashboard',
  'fleet',
  'containers',
  'images',
  'networks',
  'volumes',
  'events',
  'cluster',
  'running',
  'actions',
  'stop',
  'restart',
  'navigate',
  'logs',
  'terminal',
  'stats',
  'danger',
  'remove'
] as const

export type PaletteLabels = Record<(typeof PALETTE_KEYS)[number], string>

/** Command palette strings, resolved on the server so the client island ships no locale data. */
export function paletteLabels(t: HomeT): PaletteLabels {
  return Object.fromEntries(
    PALETTE_KEYS.map((key) => [key, t(`home.palette.${key}`)])
  ) as PaletteLabels
}
