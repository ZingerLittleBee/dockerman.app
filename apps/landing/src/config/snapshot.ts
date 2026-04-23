// Module data for the /snapshot page.
// Mirrors the design at dockerman/project/Snapshot.html — 18 modules, each with
// an icon, label, screenshot path (under /public/screenshots), description, and
// a short italic accent used in the caption strip ("everything, at a glance.").

export interface SnapshotModule {
  key: string
  label: string
  icon: keyof typeof MODULE_ICONS
  src: string | null
  em: string
  desc: string
}

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

export const SNAPSHOT_MODULES: SnapshotModule[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'dash',
    src: '/screenshots/dashboard.png',
    em: 'everything, at a glance.',
    desc: 'A consolidated view of every container, image, volume, and network on the active engine. Live stats tick in-place, and you can deep-link into any object with one click.'
  },
  {
    key: 'terminal',
    label: 'Terminal',
    icon: 'term',
    src: '/screenshots/terminal.png',
    em: 'a real shell, not a toy.',
    desc: 'Full xterm.js shell into any running container. ANSI colors, copy-on-select, paste-safe newlines, and a scrollback that survives container restarts.'
  },
  {
    key: 'processes',
    label: 'Processes',
    icon: 'proc',
    src: '/screenshots/process.png',
    em: 'ps with better manners.',
    desc: 'Per-container <code>ps</code> with CPU and memory columns you can sort, and a kill/signal dropdown that speaks <code>SIGTERM → SIGKILL</code> on a timer.'
  },
  {
    key: 'inspect',
    label: 'Inspect',
    icon: 'inspect',
    src: '/screenshots/inspect.png',
    em: 'the JSON, legible.',
    desc: 'Every key from <code>docker inspect</code>, grouped and searchable. Copy any value as JSON, or open the raw output in a side pane for comparison.'
  },
  {
    key: 'stats',
    label: 'Stats',
    icon: 'stats',
    src: '/screenshots/stats.png',
    em: 'charts that earn their pixels.',
    desc: 'Per-container CPU, memory, network, and block I/O charts. Process-level breakdowns, zoom to any window, export CSV for a post-mortem.'
  },
  {
    key: 'logs',
    label: 'Logs',
    icon: 'logs',
    src: '/screenshots/logs.png',
    em: '50 MB, smooth.',
    desc: 'Virtualized log viewer — 50 MB files scroll smoothly. ANSI-aware, regex search, multi-match highlight, and pause-on-scroll that actually pauses.'
  },
  {
    key: 'ssh',
    label: 'SSH',
    icon: 'ssh',
    src: '/screenshots/ssh.png',
    em: 'remote like it’s local.',
    desc: 'Docker over SSH with automatic socket forwarding, heartbeat reconnect, and backoff. Titlebar status chip tells you exactly what broke.'
  },
  {
    key: 'build',
    label: 'Build history',
    icon: 'build',
    src: '/screenshots/build-history.png',
    em: 'every step, every second.',
    desc: 'Every image build you’ve kicked off, with cache-hit ratios, step timings, and the exact <code>Dockerfile</code> as it existed at build time.'
  },
  {
    key: 'events',
    label: 'Events',
    icon: 'events',
    src: '/screenshots/event.png',
    em: 'the bus, finally readable.',
    desc: 'The Docker event bus, legible. Filter by object, type, or time window; replay the last hour; export as a table when something breaks in production.'
  },
  {
    key: 'file',
    label: 'File browser',
    icon: 'file',
    src: '/screenshots/file.png',
    em: 'rootfs, but clickable.',
    desc: 'Walk a running container’s filesystem. Upload, download, diff against the image, and recursively export a directory as <code>.tar.gz</code>.'
  },
  {
    key: 'filePreview',
    label: 'File preview',
    icon: 'preview',
    src: '/screenshots/file-preview.png',
    em: 'preview without the shell.',
    desc: 'Inline preview for text, JSON, YAML, images, and PDFs. Syntax highlighting up to 10 MB; auto-detects the format when the extension lies.'
  },
  {
    key: 'imageAnalysis',
    label: 'Image analysis',
    icon: 'image',
    src: '/screenshots/image-analysis.png',
    em: 'layers you can actually see.',
    desc: 'Layer explorer — click a layer to see what it added, interactive size distribution, Dockerfile reconstruction, and efficiency score per image.'
  },
  {
    key: 'compose',
    label: 'Compose',
    icon: 'compose',
    src: '/screenshots/container-compose.png',
    em: 'projects, not just containers.',
    desc: 'Compose projects grouped on the container list. Up, down, pull, recreate — the common actions, one click. Quadlet files render inline too.'
  },
  {
    key: 'volumeBrowse',
    label: 'Volume browse',
    icon: 'volume',
    src: '/screenshots/volume-browse.png',
    em: 'what’s in the volume?',
    desc: 'Walk a named volume’s contents without attaching a shell. Mount-graph view shows every container currently using each volume.'
  },
  {
    key: 'storage',
    label: 'Storage',
    icon: 'storage',
    src: '/screenshots/storage.png',
    em: 'prune with receipts.',
    desc: 'Disk usage by layer, volume, and build cache, with a one-click <code>docker system prune</code> that tells you exactly what it’s about to delete.'
  },
  {
    key: 'dockerHub',
    label: 'Docker Hub',
    icon: 'hub',
    src: '/screenshots/dockerhub.png',
    em: 'search without the browser.',
    desc: 'Search the public registry without leaving the app. See downloads, size trend, tags, and a Trivy scan of the latest tag before you pull.'
  },
  {
    key: 'imageSecurity',
    label: 'Image security',
    icon: 'shield',
    src: '/screenshots/image-security.png',
    em: 'CVEs with a fix button.',
    desc: 'Trivy scan inline on every image. CVE ID, severity, package, and the exact fixed-in version — with a one-click upgrade &amp; rebuild action.'
  },
  {
    key: 'kubernetes',
    label: 'Kubernetes',
    icon: 'k8s',
    src: '/screenshots/kubernetes.png',
    em: 'the cluster, one window.',
    desc: 'Clusters, namespaces, pods, deployments, services, ConfigMaps. A ConfigMap diff viewer (side-by-side or unified) that’s actually readable.'
  }
]
