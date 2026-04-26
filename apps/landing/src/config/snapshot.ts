// Structural module data for the /snapshot page.
// Human-readable copy (label, em, desc) lives in
// packages/shared/src/locales/*.json under `snapshot.modules.<key>`.

export const MODULE_ICONS = {
  dash: 'dash',
  term: 'term',
  proc: 'proc',
  inspect: 'inspect',
  stats: 'stats',
  logs: 'logs',
  ssh: 'ssh',
  build: 'build',
  events: 'events',
  file: 'file',
  preview: 'preview',
  image: 'image',
  compose: 'compose',
  volume: 'volume',
  storage: 'storage',
  hub: 'hub',
  shield: 'shield',
  k8s: 'k8s'
} as const

export interface SnapshotModuleStructure {
  key: string
  icon: keyof typeof MODULE_ICONS
  src: string | null
}

export interface SnapshotModule extends SnapshotModuleStructure {
  label: string
  em: string
  desc: string
}

export const SNAPSHOT_MODULE_STRUCTURE: SnapshotModuleStructure[] = [
  { key: 'dashboard', icon: 'dash', src: '/screenshots/dashboard.png' },
  { key: 'terminal', icon: 'term', src: '/screenshots/terminal.png' },
  { key: 'processes', icon: 'proc', src: '/screenshots/process.png' },
  { key: 'inspect', icon: 'inspect', src: '/screenshots/inspect.png' },
  { key: 'stats', icon: 'stats', src: '/screenshots/stats.png' },
  { key: 'statsCompare', icon: 'stats', src: '/screenshots/stats-compare.png' },
  { key: 'logs', icon: 'logs', src: '/screenshots/logs.png' },
  { key: 'ssh', icon: 'ssh', src: '/screenshots/ssh.png' },
  { key: 'build', icon: 'build', src: '/screenshots/build-history.png' },
  { key: 'events', icon: 'events', src: '/screenshots/event.png' },
  { key: 'file', icon: 'file', src: '/screenshots/file.png' },
  { key: 'filePreview', icon: 'preview', src: '/screenshots/file-preview.png' },
  { key: 'imageAnalysis', icon: 'image', src: '/screenshots/image-analysis.png' },
  { key: 'compose', icon: 'compose', src: '/screenshots/container-compose.png' },
  { key: 'volumeBrowse', icon: 'volume', src: '/screenshots/volume-browse.png' },
  { key: 'storage', icon: 'storage', src: '/screenshots/storage.png' },
  { key: 'dockerHub', icon: 'hub', src: '/screenshots/dockerhub.png' },
  { key: 'imageSecurity', icon: 'shield', src: '/screenshots/image-security.png' },
  { key: 'kubernetes', icon: 'k8s', src: '/screenshots/kubernetes.png' }
]

export const SNAPSHOT_MODULE_COUNT = SNAPSHOT_MODULE_STRUCTURE.length

type TFn = (key: string, options?: Record<string, unknown>) => string

export function resolveSnapshotModules(t: TFn): SnapshotModule[] {
  return SNAPSHOT_MODULE_STRUCTURE.map((m) => ({
    ...m,
    label: t(`snapshot.modules.${m.key}.label`),
    em: t(`snapshot.modules.${m.key}.em`),
    desc: t(`snapshot.modules.${m.key}.desc`)
  }))
}
