import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Root of the landing app, resolved from the script location.
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const LANDING_ROOT = join(SCRIPT_DIR, '..')
const DOCS_ROOT = join(LANDING_ROOT, 'content/docs')

type Locale = 'zh' | 'ja' | 'es'
const LOCALES: Locale[] = ['zh', 'ja', 'es']

// English page structure. Each entry is [path-without-.mdx, key-in-dictionary].
const PAGES: Array<{ path: string; key: string }> = [
  { path: 'index', key: 'welcome' },
  { path: 'getting-started', key: 'getting-started' },
  { path: 'docker/containers', key: 'containers' },
  { path: 'docker/images', key: 'images' },
  { path: 'docker/networks', key: 'networks' },
  { path: 'docker/volumes', key: 'volumes' },
  { path: 'docker/files', key: 'files' },
  { path: 'docker/compose', key: 'compose-templates' },
  { path: 'docker/stats', key: 'stats' },
  { path: 'docker/events', key: 'events' },
  { path: 'docker/logs', key: 'logs' },
  { path: 'docker/terminal', key: 'terminal' },
  { path: 'kubernetes/overview', key: 'overview' },
  { path: 'kubernetes/cluster', key: 'cluster' },
  { path: 'kubernetes/workloads', key: 'workloads' },
  { path: 'kubernetes/networking', key: 'networking' },
  { path: 'kubernetes/config-storage', key: 'config-storage' },
  { path: 'kubernetes/rbac', key: 'rbac' },
  { path: 'kubernetes/custom-resources', key: 'custom-resources' },
  { path: 'kubernetes/helm', key: 'helm' },
  { path: 'kubernetes/port-forward', key: 'port-forward' },
  { path: 'kubernetes/debug', key: 'debug' },
  { path: 'kubernetes/logs-terminal', key: 'pod-logs-terminal' },
  { path: 'advanced/spotlight', key: 'spotlight' },
  { path: 'advanced/remote-hosts', key: 'remote-hosts' },
  { path: 'platform/windows', key: 'windows' },
  { path: 'platform/macos', key: 'macos' },
  { path: 'platform/linux', key: 'linux' },
  { path: 'reference/keyboard-shortcuts', key: 'keyboard-shortcuts' },
  { path: 'reference/settings', key: 'settings' },
  { path: 'reference/licensing', key: 'licensing' },
  { path: 'reference/troubleshooting', key: 'troubleshooting' }
]

// Section meta.json definitions.
// "reference" is intentionally omitted — existing reference/meta.json in each
// locale already matches the new structure, per spec §6.3.
const SECTION_META: Record<
  'root' | 'docker' | 'kubernetes' | 'advanced' | 'platform',
  { titleKey: string; pages: string[]; defaultOpen?: boolean }
> = {
  root: {
    titleKey: 'docs-root',
    pages: [
      'index',
      'getting-started',
      '---',
      'docker',
      'kubernetes',
      '---',
      'advanced',
      'platform',
      'reference'
    ]
  },
  docker: {
    titleKey: 'docker',
    pages: ['containers', 'images', 'networks', 'volumes', 'files', 'compose', 'stats', 'events', 'logs', 'terminal'],
    defaultOpen: true
  },
  kubernetes: {
    titleKey: 'kubernetes',
    pages: [
      'overview',
      'cluster',
      'workloads',
      'networking',
      'config-storage',
      'rbac',
      'custom-resources',
      'helm',
      'port-forward',
      'debug',
      'logs-terminal'
    ],
    defaultOpen: true
  },
  advanced: {
    titleKey: 'advanced',
    pages: ['spotlight', 'remote-hosts'],
    defaultOpen: false
  },
  platform: {
    titleKey: 'platform',
    pages: ['windows', 'macos', 'linux'],
    defaultOpen: true
  }
}

const DICT: Record<
  Locale,
  {
    notYetTranslated: (enPath: string) => string
    titles: Record<string, string>
    descriptions: Record<string, string>
    sectionTitles: Record<string, string>
  }
> = {
  zh: {
    notYetTranslated: (path) => `此页面尚未翻译。请查看 [英文版本](/en/docs/${path})。`,
    titles: {
      welcome: '欢迎',
      'getting-started': '快速开始',
      containers: '容器',
      images: '镜像',
      networks: '网络',
      volumes: '卷',
      files: '文件',
      'compose-templates': 'Compose 与模板',
      stats: '统计',
      events: '事件',
      logs: '日志',
      terminal: '终端',
      overview: '概览',
      cluster: '集群',
      workloads: '工作负载',
      networking: '网络',
      'config-storage': '配置与存储',
      rbac: '权限 (RBAC)',
      'custom-resources': '自定义资源',
      helm: 'Helm',
      'port-forward': '端口转发与 DNS',
      debug: '调试助手',
      'pod-logs-terminal': 'Pod 日志与终端',
      spotlight: 'Spotlight',
      'remote-hosts': '远程主机 (SSH)',
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
      'keyboard-shortcuts': '键盘快捷键',
      settings: '设置',
      licensing: '许可证',
      troubleshooting: '故障排查'
    },
    descriptions: {
      welcome: '欢迎使用 Dockerman — 基于 Tauri 和 Rust 构建的跨平台 Docker 与 Kubernetes UI。',
      'getting-started': '在几分钟内安装 Dockerman 并连接到你的第一个 Docker daemon。',
      containers: '创建、检查和管理 Docker 容器；一键克隆、提交、暂停和备份。',
      images: '拉取、构建、推送、分析和扫描 Docker 镜像，内置 Docker Hub 浏览器与 Trivy 扫描。',
      networks: '创建和管理 Docker 网络，连接容器，并按端口搜索容器。',
      volumes: '管理 Docker 卷 — 创建、检查和清理持久化存储。',
      files: '浏览、预览、编辑、上传、下载和删除卷与运行中容器内的文件。',
      'compose-templates': '通过 Docker Compose 管理多容器应用，并从模板库快速启动项目。',
      stats: '实时资源仪表盘：环形仪表与每个容器的趋势折线图。',
      events: '流式查看、过滤、持久化和导出 Docker daemon 事件。',
      logs: '在大规模下流式查看和搜索容器日志，支持虚拟列表与快捷键。',
      terminal: '使用内置 xterm.js 终端进入任意运行中容器的交互式 shell。',
      overview: 'Dockerman 的原生 Kubernetes 支持 — 工作负载、网络、配置、存储、RBAC、CRD、Helm 与调试。',
      cluster: '启动本地 k3d 集群或导入已有 kubeconfig 来管理任何 Kubernetes 环境。',
      workloads: '一站式管理 Pods、Deployments、StatefulSets、DaemonSets、Jobs、CronJobs 和 ReplicaSets。',
      networking: '跨命名空间检查 Services、Ingresses、Endpoints 和 NetworkPolicies。',
      'config-storage': '管理 ConfigMaps、Secrets、PersistentVolumeClaims 和 StorageClasses，无需频繁切换 kubectl。',
      rbac: '浏览 ServiceAccounts、Roles、ClusterRoles 及其绑定，理解谁可以做什么。',
      'custom-resources': '发现集群中的 CRD 并浏览或编辑其实例。',
      helm: '添加 chart 仓库并从 GUI 安装、升级、回滚和卸载 Helm releases。',
      'port-forward': '将本地端口转发到 Services 或 Pods，并可选地注册自动 DNS 条目。',
      debug: '为目标 Pod 启动临时 debug Pod，用于诊断网络、DNS 和文件系统问题。',
      'pod-logs-terminal': '流式查看 Pod 日志，并通过 xterm.js 连接到 Pod 内任意容器。',
      spotlight: '一键导航 Dockerman、执行操作并搜索资源的命令面板。',
      'remote-hosts': '通过 SSH 隧道管理远程 Docker 主机，并在主机选择器中切换。',
      windows: '在 Windows 上使用 Docker Desktop 或内置 WSL2 Docker Engine 运行 Dockerman。',
      macos: '在 macOS 上运行 Dockerman，默认使用 Docker Desktop 作为后端。',
      linux: '在 Linux 发行版上安装 Dockerman 并为你的环境配置 Docker Engine。',
      'keyboard-shortcuts': 'Dockerman 中所有键盘快捷键的完整参考，按界面分组。',
      settings: 'Dockerman 每个设置页的参考 — 从 Docker 连接到通知。',
      licensing: '在多台设备上激活、管理和重置你的 Dockerman 许可证。',
      troubleshooting: '常见问题与解决方法 — 连接、权限、性能以及 Kubernetes。'
    },
    sectionTitles: {
      'docs-root': 'Dockerman 文档',
      docker: 'Docker',
      kubernetes: 'Kubernetes',
      advanced: '高级',
      platform: '平台'
    }
  },
  ja: {
    notYetTranslated: (path) => `このページはまだ翻訳されていません。[英語版](/en/docs/${path})をご覧ください。`,
    titles: {
      welcome: 'ようこそ',
      'getting-started': 'はじめに',
      containers: 'コンテナ',
      images: 'イメージ',
      networks: 'ネットワーク',
      volumes: 'ボリューム',
      files: 'ファイル',
      'compose-templates': 'Compose とテンプレート',
      stats: '統計',
      events: 'イベント',
      logs: 'ログ',
      terminal: 'ターミナル',
      overview: '概要',
      cluster: 'クラスター',
      workloads: 'ワークロード',
      networking: 'ネットワーキング',
      'config-storage': '設定とストレージ',
      rbac: 'RBAC',
      'custom-resources': 'カスタムリソース',
      helm: 'Helm',
      'port-forward': 'ポート転送と DNS',
      debug: 'デバッグアシスタント',
      'pod-logs-terminal': 'Pod ログとターミナル',
      spotlight: 'Spotlight',
      'remote-hosts': 'リモートホスト (SSH)',
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
      'keyboard-shortcuts': 'キーボードショートカット',
      settings: '設定',
      licensing: 'ライセンス',
      troubleshooting: 'トラブルシューティング'
    },
    descriptions: {
      welcome: 'Dockerman へようこそ — Tauri と Rust で構築されたクロスプラットフォームの Docker と Kubernetes 用 UI。',
      'getting-started': '数分で Dockerman をインストールし、最初の Docker daemon に接続します。',
      containers: 'Docker コンテナの作成、検査、管理 — クローン、コミット、一時停止、バックアップがワンクリックで可能。',
      images: 'Docker イメージのプル、ビルド、プッシュ、分析、スキャン — Docker Hub ブラウザと Trivy スキャナー内蔵。',
      networks: 'Docker ネットワークの作成と管理、コンテナの接続、ポートによるコンテナ検索。',
      volumes: 'Docker ボリュームの管理 — 作成、検査、永続ストレージのクリーンアップ。',
      files: 'ボリュームと実行中のコンテナ内のファイルを参照、プレビュー、編集、アップロード、ダウンロード、削除。',
      'compose-templates': 'Docker Compose でマルチコンテナアプリケーションを管理し、テンプレートライブラリからプロジェクトを起動。',
      stats: 'リングゲージとスパークラインによるリアルタイムリソースダッシュボード。',
      events: 'Docker daemon イベントのストリーミング、フィルタリング、永続化、エクスポート。',
      logs: '仮想リストとパワーユーザー向けショートカットで大規模なコンテナログをストリーミングと検索。',
      terminal: '内蔵 xterm.js ターミナルで実行中の任意のコンテナにインタラクティブシェルで接続。',
      overview: 'Dockerman のネイティブ Kubernetes サポート — ワークロード、ネットワーキング、設定、ストレージ、RBAC、CRD、Helm、デバッグ。',
      cluster: 'ローカル k3d クラスターを起動するか、既存の kubeconfig をインポートして任意の Kubernetes 環境を管理。',
      workloads: 'Pods、Deployments、StatefulSets、DaemonSets、Jobs、CronJobs、ReplicaSets を一箇所で管理。',
      networking: 'すべてのネームスペースで Services、Ingresses、Endpoints、NetworkPolicies を検査。',
      'config-storage': 'kubectl の切り替えなしで ConfigMaps、Secrets、PersistentVolumeClaims、StorageClasses を管理。',
      rbac: 'ServiceAccounts、Roles、ClusterRoles とそのバインディングを参照して、誰が何をできるかを理解。',
      'custom-resources': 'クラスター内の CRD を発見し、そのインスタンスを参照または編集。',
      helm: 'chart リポジトリを追加し、GUI から Helm リリースをインストール、アップグレード、ロールバック、アンインストール。',
      'port-forward': 'ローカルポートを Services または Pods に転送し、オプションで自動 DNS エントリを登録。',
      debug: 'ターゲット Pod の隣に一時的なデバッグ Pod を起動し、ネットワーク、DNS、ファイルシステムの問題を診断。',
      'pod-logs-terminal': 'Pod のログをストリーミングし、xterm.js で Pod 内の任意のコンテナに接続。',
      spotlight: '単一のキーストロークで Dockerman をナビゲートし、アクションを実行し、リソースを検索するコマンドパレット。',
      'remote-hosts': 'SSH トンネル経由でリモート Docker ホストを管理し、ホストセレクターから切り替え。',
      windows: 'Docker Desktop または内蔵 WSL2 Docker Engine を使用して Windows で Dockerman を実行。',
      macos: 'macOS でデフォルトバックエンドとして Docker Desktop を使用して Dockerman を実行。',
      linux: 'Linux ディストリビューションに Dockerman をインストールし、セットアップ用に Docker Engine を構成。',
      'keyboard-shortcuts': 'Dockerman のすべてのキーボードショートカット、サーフェス別にグループ化。',
      settings: 'Dockerman のすべての設定ページのリファレンス — Docker 接続から通知まで。',
      licensing: 'Dockerman ライセンスのアクティベート、管理、デバイス間でのリセット。',
      troubleshooting: '一般的な問題とその解決方法 — 接続、権限、パフォーマンス、Kubernetes。'
    },
    sectionTitles: {
      'docs-root': 'Dockerman ドキュメント',
      docker: 'Docker',
      kubernetes: 'Kubernetes',
      advanced: '高度な機能',
      platform: 'プラットフォーム'
    }
  },
  es: {
    notYetTranslated: (path) => `Esta página aún no está traducida. Consulte la [versión en inglés](/en/docs/${path}).`,
    titles: {
      welcome: 'Bienvenido',
      'getting-started': 'Primeros Pasos',
      containers: 'Contenedores',
      images: 'Imágenes',
      networks: 'Redes',
      volumes: 'Volúmenes',
      files: 'Archivos',
      'compose-templates': 'Compose y Plantillas',
      stats: 'Estadísticas',
      events: 'Eventos',
      logs: 'Registros',
      terminal: 'Terminal',
      overview: 'Resumen',
      cluster: 'Clúster',
      workloads: 'Cargas de trabajo',
      networking: 'Redes',
      'config-storage': 'Configuración y Almacenamiento',
      rbac: 'RBAC',
      'custom-resources': 'Recursos Personalizados',
      helm: 'Helm',
      'port-forward': 'Reenvío de puertos y DNS',
      debug: 'Asistente de Depuración',
      'pod-logs-terminal': 'Registros y Terminal de Pod',
      spotlight: 'Spotlight',
      'remote-hosts': 'Hosts Remotos (SSH)',
      windows: 'Windows',
      macos: 'macOS',
      linux: 'Linux',
      'keyboard-shortcuts': 'Atajos de Teclado',
      settings: 'Configuración',
      licensing: 'Licencias',
      troubleshooting: 'Resolución de Problemas'
    },
    descriptions: {
      welcome: 'Bienvenido a Dockerman — una interfaz multiplataforma para Docker y Kubernetes creada con Tauri y Rust.',
      'getting-started': 'Instala Dockerman y conéctate a tu primer daemon de Docker en minutos.',
      containers: 'Crea, inspecciona y gestiona contenedores Docker; clona, confirma, pausa y respalda con un clic.',
      images: 'Extrae, construye, envía, analiza y escanea imágenes Docker con un navegador de Docker Hub y escáner Trivy integrados.',
      networks: 'Crea y gestiona redes Docker, conecta contenedores y busca contenedores por puerto.',
      volumes: 'Gestiona volúmenes Docker: crea, inspecciona y limpia el almacenamiento persistente.',
      files: 'Navega, previsualiza, edita, sube, descarga y elimina archivos dentro de volúmenes y contenedores en ejecución.',
      'compose-templates': 'Gestiona aplicaciones multi-contenedor con Docker Compose e inicia proyectos desde la biblioteca de plantillas.',
      stats: 'Paneles de recursos en tiempo real con medidores en anillo y gráficos sparkline.',
      events: 'Transmite, filtra, persiste y exporta eventos del daemon de Docker.',
      logs: 'Transmite y busca registros de contenedores a escala con una lista virtualizada y atajos de teclado.',
      terminal: 'Conecta un shell interactivo a cualquier contenedor en ejecución con un terminal xterm.js integrado.',
      overview: 'Soporte nativo de Kubernetes en Dockerman: cargas de trabajo, redes, configuración, almacenamiento, RBAC, CRDs, Helm y depuración.',
      cluster: 'Inicia un clúster local k3d o importa un kubeconfig existente para gestionar cualquier entorno Kubernetes.',
      workloads: 'Gestiona Pods, Deployments, StatefulSets, DaemonSets, Jobs, CronJobs y ReplicaSets en un solo lugar.',
      networking: 'Inspecciona Services, Ingresses, Endpoints y NetworkPolicies en cada namespace.',
      'config-storage': 'Gestiona ConfigMaps, Secrets, PersistentVolumeClaims y StorageClasses sin saltar entre comandos kubectl.',
      rbac: 'Explora ServiceAccounts, Roles, ClusterRoles y sus bindings para entender quién puede hacer qué.',
      'custom-resources': 'Descubre CRDs en tu clúster y explora o edita sus instancias.',
      helm: 'Añade repositorios de charts e instala, actualiza, revierte y desinstala releases de Helm desde una GUI.',
      'port-forward': 'Reenvía puertos locales a Services o Pods y opcionalmente registra entradas DNS automáticas.',
      debug: 'Lanza un pod de depuración efímero junto a un pod objetivo para diagnosticar problemas de red, DNS y sistema de archivos.',
      'pod-logs-terminal': 'Transmite registros de Pods y conéctate a cualquier contenedor dentro de un Pod mediante xterm.js.',
      spotlight: 'Paleta de comandos para navegar Dockerman, ejecutar acciones y buscar recursos con una sola pulsación.',
      'remote-hosts': 'Gestiona hosts Docker remotos mediante túneles SSH y cambia entre ellos desde el selector de hosts.',
      windows: 'Ejecuta Dockerman en Windows con Docker Desktop o el Docker Engine WSL2 integrado.',
      macos: 'Ejecuta Dockerman en macOS con Docker Desktop como backend predeterminado.',
      linux: 'Instala Dockerman en distribuciones Linux y configura el Docker Engine para tu entorno.',
      'keyboard-shortcuts': 'Cada atajo de teclado en Dockerman, agrupado por superficie.',
      settings: 'Referencia de cada página de configuración de Dockerman, desde conexiones Docker hasta notificaciones.',
      licensing: 'Activa, gestiona y restablece tu licencia de Dockerman entre dispositivos.',
      troubleshooting: 'Problemas comunes y cómo resolverlos: conexión, permisos, rendimiento y Kubernetes.'
    },
    sectionTitles: {
      'docs-root': 'Documentación de Dockerman',
      docker: 'Docker',
      kubernetes: 'Kubernetes',
      advanced: 'Avanzado',
      platform: 'Plataforma'
    }
  }
}

function stubBody(locale: Locale, enPath: string): string {
  const message = DICT[locale].notYetTranslated(enPath)

  return `import { Callout } from 'fumadocs-ui/components/callout'\n\n<Callout type="info">\n  ${message}\n</Callout>\n`
}

function stubMdx(locale: Locale, page: { path: string; key: string }): string {
  const title = DICT[locale].titles[page.key]
  const description = DICT[locale].descriptions[page.key]

  if (!title || !description) {
    throw new Error(`Missing dictionary entry for ${locale} / ${page.key}`)
  }

  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\n---\n\n${stubBody(locale, page.path)}`
}

async function writeLocale(locale: Locale) {
  for (const page of PAGES) {
    const file = join(DOCS_ROOT, locale, `${page.path}.mdx`)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, stubMdx(locale, page), 'utf8')
  }

  const root = {
    title: DICT[locale].sectionTitles['docs-root'],
    pages: SECTION_META.root.pages
  }

  await writeFile(join(DOCS_ROOT, locale, 'meta.json'), `${JSON.stringify(root, null, 2)}\n`, 'utf8')

  for (const section of ['docker', 'kubernetes', 'advanced', 'platform'] as const) {
    const definition = SECTION_META[section]
    const meta: Record<string, unknown> = {
      title: DICT[locale].sectionTitles[definition.titleKey],
      pages: definition.pages
    }

    if (definition.defaultOpen !== undefined) {
      meta.defaultOpen = definition.defaultOpen
    }

    const file = join(DOCS_ROOT, locale, section, 'meta.json')
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, `${JSON.stringify(meta, null, 2)}\n`, 'utf8')
  }
}

async function main() {
  for (const locale of LOCALES) {
    await writeLocale(locale)
    console.log(`Generated stubs for ${locale}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
