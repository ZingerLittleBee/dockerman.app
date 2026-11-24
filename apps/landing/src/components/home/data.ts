import type { Locale } from '@repo/shared/i18n'

export type Platform = 'mac' | 'win' | 'linux'

export const PLATFORM_LABEL: Record<Platform, string> = {
  mac: 'macOS',
  win: 'Windows',
  linux: 'Linux'
}

/** How a logo sits on its light tile: padded, edge-to-edge, or slightly enlarged. */
export type LogoFit = 'pad' | 'full' | 'large'

export interface EngineMeta {
  name: string
  logo: string
  fit: LogoFit
  endpoint: string
  platforms: Platform[]
}

/** Order matches `home.engines.items` in the locale files. */
export const ENGINES: EngineMeta[] = [
  {
    name: 'Docker',
    logo: '/home/engines/docker.svg',
    fit: 'pad',
    endpoint: '/var/run/docker.sock',
    platforms: ['mac', 'win', 'linux']
  },
  {
    name: 'OrbStack',
    logo: '/home/engines/orbstack.png',
    fit: 'full',
    endpoint: '~/.orbstack/run/docker.sock',
    platforms: ['mac']
  },
  {
    name: 'Colima',
    logo: '/home/engines/colima.png',
    fit: 'large',
    endpoint: '~/.colima/default/docker.sock',
    platforms: ['mac']
  },
  {
    name: 'Podman',
    logo: '/home/engines/podman.svg',
    fit: 'pad',
    endpoint: '/run/user/1000/podman/podman.sock',
    platforms: ['mac', 'linux']
  },
  {
    name: 'WSL2',
    logo: '/home/engines/wsl2.svg',
    fit: 'pad',
    endpoint: 'WSL2 · Alpine',
    platforms: ['win']
  },
  {
    name: 'Apple Container',
    logo: '/home/engines/apple.svg',
    fit: 'pad',
    endpoint: 'container CLI',
    platforms: ['mac']
  }
]

export const KUBERNETES_LOGO = '/home/engines/kubernetes.svg'

export type ContainerState = 'running' | 'exited' | 'paused' | 'restarting' | 'created'

export interface ContainerRow {
  id: string
  name: string
  image: string
  ports: string[]
  state: ContainerState
  /** Index into `home.window.ago`. */
  ago: number
}

export const CONTAINER_ROWS: ContainerRow[] = [
  {
    id: 'f2a91c3b7d5e',
    name: '/webshop-frontend-1',
    image: 'nginx:1.27-alpine',
    ports: ['8080->80/tcp', '+1'],
    state: 'running',
    ago: 0
  },
  {
    id: 'a1b2c3d4e5f6',
    name: '/webshop-api-1',
    image: 'ghcr.io/acme/webshop-api:2.14.3',
    ports: ['127.0.0.1:3000->3000/tcp'],
    state: 'running',
    ago: 0
  },
  {
    id: 'b2c3d4e5f6a7',
    name: '/webshop-db-1',
    image: 'postgres:16.4',
    ports: ['5432/tcp'],
    state: 'running',
    ago: 0
  },
  {
    id: 'c3d4e5f6a7b8',
    name: '/redis-cache',
    image: 'redis:7.4',
    ports: ['6379->6379/tcp'],
    state: 'running',
    ago: 1
  },
  {
    id: 'd4e5f6a7b8c9',
    name: '/grafana',
    image: 'grafana/grafana:11.2.0',
    ports: ['3001->3000/tcp'],
    state: 'running',
    ago: 2
  },
  {
    id: 'e5f6a7b8c9d0',
    name: '/batch-report-generator',
    image: 'ghcr.io/acme/report-generator:1.8.0',
    ports: [],
    state: 'exited',
    ago: 3
  },
  {
    id: 'f6a7b8c9d0e1',
    name: '/legacy-worker',
    image: 'acme/worker:0.9.1',
    ports: [],
    state: 'exited',
    ago: 4
  },
  {
    id: 'a7b8c9d0e1f2',
    name: '/traefik',
    image: 'traefik:v3.1',
    ports: ['80->80/tcp', '+1'],
    state: 'paused',
    ago: 5
  },
  {
    id: 'b8c9d0e1f2a3',
    name: '/flaky-sync-service',
    image: 'acme/sync:1.2.0',
    ports: [],
    state: 'restarting',
    ago: 6
  },
  {
    id: 'c9d0e1f2a3b4',
    name: '/staging-db-restore-test',
    image: 'postgres:16.4',
    ports: [],
    state: 'created',
    ago: 7
  }
]

/** Sidebar icon paths, one per entry in `home.window.nav`. */
export const SIDEBAR_ICONS = [
  'M3 3v18h18M7 15l4-4 3 3 5-6',
  'M12 3 4 7.5v9L12 21l8-4.5v-9ZM12 12 4 7.5M12 12l8-4.5M12 12v9',
  'M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6Z',
  'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18ZM12 10a2 2 0 1 0 0 4a2 2 0 1 0 0-4ZM6 12a6 6 0 0 1 6-6',
  'M15 12 6.5 20.5a2.1 2.1 0 0 1-3-3L12 9M17.6 15 22 10.6M20.9 11.7l-8.6-8.6a1 1 0 0 0-1.4 0L9.2 4.8l10 10 1.7-1.7a1 1 0 0 0 0-1.4Z',
  'M9 2h6v6H9ZM2 16h6v6H2ZM16 16h6v6h-6ZM5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8',
  'M22 12H2M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1ZM6 16h.01M10 16h.01',
  'M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3ZM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  'M3 5h18v14H3ZM3 9h18M7 5v4M11 5v4'
]

export const PINNED_CONTAINERS = [
  'webshop-frontend-1',
  'webshop-api-1',
  'webshop-db-1',
  'redis-cache',
  'grafana'
]

export interface StackLogo {
  name: string
  logo: string
  fit: LogoFit
}

/** Images orbiting the final call to action. */
export const STACK_LOGOS: StackLogo[] = [
  { name: 'redis', logo: '/home/stack/redis.svg', fit: 'pad' },
  { name: 'postgres', logo: '/home/stack/postgresql.svg', fit: 'pad' },
  { name: 'nginx', logo: '/home/stack/nginx.svg', fit: 'pad' },
  { name: 'node', logo: '/home/stack/nodedotjs.svg', fit: 'pad' },
  { name: 'mongo', logo: '/home/stack/mongodb.svg', fit: 'pad' },
  { name: 'mysql', logo: '/home/stack/mysql.svg', fit: 'large' },
  { name: 'traefik', logo: '/home/stack/traefikproxy.svg', fit: 'pad' },
  { name: 'minio', logo: '/home/stack/minio.svg', fit: 'pad' },
  { name: 'grafana', logo: '/home/stack/grafana.svg', fit: 'pad' },
  { name: 'rabbitmq', logo: '/home/stack/rabbitmq.svg', fit: 'pad' }
]

export type AppTone = 'nc' | 'jf' | 'gt' | 'n8' | 'uk' | 'vw'

export const ONE_CLICK_APPS: { name: string; logo: string; tone: AppTone }[] = [
  { name: 'nextcloud', logo: '/home/apps/nextcloud.svg', tone: 'nc' },
  { name: 'jellyfin', logo: '/home/apps/jellyfin.svg', tone: 'jf' },
  { name: 'gitea', logo: '/home/apps/gitea.svg', tone: 'gt' },
  { name: 'n8n', logo: '/home/apps/n8n.svg', tone: 'n8' },
  { name: 'uptime-kuma', logo: '/home/apps/uptimekuma.svg', tone: 'uk' },
  { name: 'vaultwarden', logo: '/home/apps/vaultwarden.svg', tone: 'vw' }
]

export interface ShotSet {
  stats: string
  kubernetes: string
  logs: string
  images: string
  palette: string
}

/** Screenshots exist for English and Chinese; other locales use English. */
export function shotsFor(locale: Locale): ShotSet {
  const lang = locale === 'zh' ? 'zh' : 'en'
  return {
    stats: `/home/shots/container-stats-${lang}.webp`,
    kubernetes: `/home/shots/kubernetes-${lang}.webp`,
    logs: `/home/shots/container-logs-${lang}.webp`,
    images: `/home/shots/image-layers-${lang}.webp`,
    palette: `/home/shots/containers-bg-${lang}.webp`
  }
}

/** Screenshot pixel size, used for aspect ratio and next/image intrinsic size. */
export const SHOT_SIZE = { width: 1600, height: 1066 }
