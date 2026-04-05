# Dockerman Landing Docs Rewrite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the English documentation at `apps/landing/content/docs/en/` to cover Dockerman v4.8 fully, reorganize the sidebar into parallel Docker and Kubernetes top-level sections, adopt Fumadocs UI components throughout, and create "not yet translated" stubs for `zh`/`ja`/`es` so the language switcher stays aligned.

**Architecture:** A Fumadocs 16 site in `apps/landing/` reading MDX from `content/docs/{locale}/` with `parser: 'dir'` i18n. Component registration is centralized in `apps/landing/mdx-components.tsx`. Every English page written in this plan uses Fumadocs UI components (`Callout`, `Steps`, `Tabs`, `Cards`, `Accordions`, `Files`, `TypeTable`) which are globally registered so per-file imports are not required. Stubs for the three other locales are generated from a single script to keep content identical and auditable.

**Tech Stack:** Next.js 16.1.6 (App Router), React 19.2.4, TypeScript 5.7.3, Fumadocs 16.6.7 (`fumadocs-core`, `fumadocs-mdx`, `fumadocs-ui`), Bun 1.3.4 as package manager, Turborepo as build orchestrator.

**Reference spec:** `docs/superpowers/specs/2026-04-05-dockerman-landing-docs-rewrite-design.md` — every task in this plan traces back to a section there. Sections referenced as §N.

**Working directory:** All file paths in this plan are relative to the repo root `/Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1/`. Build and dev commands run from `apps/landing/` unless noted.

---

## Global conventions for every content task

Before the individual tasks, these rules apply to every MDX file written in Phases 1–6. The implementer should read this section once and keep it in mind throughout.

### Frontmatter rules

```yaml
---
title: <2–30 char sidebar title>
description: <80–140 char description, one sentence, SEO-friendly>
---
```

- Do not write `h1` in the body. Fumadocs renders the title automatically.
- Body begins with a one-sentence lead (or a short lead paragraph of ≤3 sentences).
- Body sections start at `##`.
- `<Step>` headings use `###`.

### Component import rules

All Fumadocs UI components (`Callout`, `Steps`, `Step`, `Tabs`, `Tab`, `Cards`, `Card`, `Accordions`, `Accordion`, `Files`, `File`, `Folder`, `TypeTable`) are registered globally in `apps/landing/mdx-components.tsx` in Task 0.2. **Do not add per-file imports for these components** in the new English docs. The stubs (Phase 0.5) include an explicit `Callout` import as a self-contained template, as specified.

### Screenshot conventions

Never use `<ChangelogImage src="...">` in the new docs in this round. Use inline comments as placeholders:

```mdx
{/* TODO(screenshot): <section>/<slug> - <one-line description> */}
```

Example: `{/* TODO(screenshot): containers/backup-dialog - Backup dialog showing progress */}`

These comments will be harvested into a single list in the final PR description. Do not attempt to create PNG files.

### Version markers

When a section documents a feature added in v4.x.x, add a single sentence as the first line under the heading:

```markdown
## Backup and restore

Added in v4.8.0.

<lead paragraph>
```

No badges, no components. Plain prose only.

### Cross-references

- All in-site links use absolute paths: `/en/docs/docker/containers`, never relative.
- Anchor links use `#section-id` where `section-id` is Fumadocs' auto-slug of the `##` heading (lowercase, spaces to hyphens, no punctuation).
- When a task says "Cross-link to X", write `[X](/en/docs/...)`.

### Voice and tone

- Second person ("you"), never "we" or "the user".
- Imperative voice for instructions ("Click Save").
- No marketing adjectives.
- One-sentence lead paragraph per section that tells the reader what problem that section solves.

### Code fence languages

Use only: `bash`, `shell`, `yaml`, `json`, `dockerfile`, `toml`, `text`. Add `title="filename"` on the fence when showing a named file.

### Per-task verification rhythm

After writing a content MDX file, run:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/docs/<path>
```

Expected output: `200`. If not 200, read the dev server output for MDX compile errors.

The dev server is started once in Task 0.6 and left running in the background for all content tasks.

### Commit rhythm

One commit per task (or per sub-task where noted). Commit messages follow the existing repo style (lowercase scope, imperative):

```
docs(landing): rewrite containers page with backup/restore and clone sections
```

---

## Phase 0 — Foundation and skeleton

Phase 0 creates the file scaffolding, configures component registration, deletes old files, and generates stubs. At the end of Phase 0, the build succeeds and every page listed in the new sidebar returns HTTP 200 (with placeholder body content). Content writing happens in Phases 1–6.

### Task 0.1: Install dependencies and baseline build

**Files:** none modified

**Rationale:** `apps/landing/node_modules/` does not currently contain `fumadocs-ui` (verified before planning). The first step must be a clean install so Fumadocs components resolve during TypeScript compilation.

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1
bun install
```

Expected: completes without errors, `apps/landing/node_modules/fumadocs-ui/` and `apps/landing/node_modules/fumadocs-core/` exist.

- [ ] **Step 2: Baseline build (captures current state before changes)**

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1/apps/landing
bun run build
```

Expected: build succeeds. Note any warnings so they can be distinguished from warnings introduced by later tasks. If the build fails before any edits, stop and investigate — the rest of the plan assumes a clean baseline.

- [ ] **Step 3: Record current page count**

```bash
find content/docs/en -name "*.mdx" | wc -l
find content/docs/zh -name "*.mdx" | wc -l
find content/docs/ja -name "*.mdx" | wc -l
find content/docs/es -name "*.mdx" | wc -l
```

Expected: each locale shows 20 MDX files. If not, stop — the spec's baseline assumptions are wrong.

- [ ] **Step 4: Commit (no changes yet, but record that baseline is verified)**

No commit — Step 4 is a logical checkpoint only. Continue to Task 0.2.

---

### Task 0.2: Register Fumadocs UI components globally

**Files:**
- Modify: `apps/landing/mdx-components.tsx`

**Rationale:** All 32 new English pages will use `Callout`, `Steps`, `Tabs`, `Cards`, `Accordions`, `Files`, and `TypeTable`. Registering them once in `getMDXComponents` eliminates 32× per-file imports. `useMDXComponents` (used by the changelog pages under `src/app/[locale]/(main)/changelog/`) is left untouched to avoid any behavioral change for changelog rendering.

- [ ] **Step 1: Read the current file**

```bash
cat apps/landing/mdx-components.tsx
```

Expected: the existing 19-line file that exports `getMDXComponents` and `useMDXComponents`, both of which spread `defaultMdxComponents`.

- [ ] **Step 2: Replace the file with the extended version**

Write `apps/landing/mdx-components.tsx` with exactly:

```tsx
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { TypeTable } from 'fumadocs-ui/components/type-table'
import type { MDXComponents } from 'mdx/types'

// Fumadocs docs pages use getMDXComponents.
// Globally register the Fumadocs UI components used across the new docs so that
// individual MDX files do not need per-file imports.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Accordion,
    Accordions,
    Callout,
    Card,
    Cards,
    File,
    Files,
    Folder,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    ...components
  }
}

// Next.js MDX integration uses useMDXComponents (for changelog pages).
// Leave it untouched — the changelog pages use their own components from
// src/components/mdx.tsx (ChangelogEntry, ChangelogImage, etc.) via per-file imports.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components
  }
}
```

- [ ] **Step 3: Run type check to catch any import path mistakes**

```bash
cd apps/landing
bunx tsc --noEmit
```

Expected: no errors. If any import from `fumadocs-ui/components/*` fails to resolve, stop and compare against `node_modules/fumadocs-ui/dist/components/` to find the correct path.

- [ ] **Step 4: Build to confirm MDX compilation still works**

```bash
cd apps/landing
bun run build
```

Expected: build succeeds with no new errors. Existing docs pages should still render identically.

- [ ] **Step 5: Commit**

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1
git add apps/landing/mdx-components.tsx
git commit -m "docs(landing): register fumadocs-ui components globally in mdx-components"
```

---

### Task 0.3: Delete obsolete English files

**Files:**
- Delete: `apps/landing/content/docs/en/guides/containers.mdx`
- Delete: `apps/landing/content/docs/en/guides/images.mdx`
- Delete: `apps/landing/content/docs/en/guides/networks.mdx`
- Delete: `apps/landing/content/docs/en/guides/volumes.mdx`
- Delete: `apps/landing/content/docs/en/guides/compose.mdx`
- Delete: `apps/landing/content/docs/en/guides/monitoring.mdx`
- Delete: `apps/landing/content/docs/en/guides/terminal.mdx`
- Delete: `apps/landing/content/docs/en/guides/file-browser.mdx`
- Delete: `apps/landing/content/docs/en/guides/meta.json`
- Delete directory: `apps/landing/content/docs/en/guides/`
- Delete: `apps/landing/content/docs/en/platform/wsl.mdx`

**Rationale:** The new sidebar puts Docker pages under `docker/` and platform pages use `windows.mdx`. The old locations will no longer be referenced by any `meta.json`, so leaving them would create orphan files that show up in Fumadocs' auto-discovery. Delete immediately to keep the tree clean. The `zh`/`ja`/`es` equivalents are **not** deleted in this round (per spec §6.4).

- [ ] **Step 1: Remove the files**

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1/apps/landing
rm -f content/docs/en/guides/containers.mdx \
      content/docs/en/guides/images.mdx \
      content/docs/en/guides/networks.mdx \
      content/docs/en/guides/volumes.mdx \
      content/docs/en/guides/compose.mdx \
      content/docs/en/guides/monitoring.mdx \
      content/docs/en/guides/terminal.mdx \
      content/docs/en/guides/file-browser.mdx \
      content/docs/en/guides/meta.json \
      content/docs/en/platform/wsl.mdx
rmdir content/docs/en/guides
```

- [ ] **Step 2: Confirm the directory is gone**

```bash
ls content/docs/en/guides 2>&1
ls content/docs/en/platform/wsl.mdx 2>&1
```

Expected: both return "No such file or directory".

- [ ] **Step 3: Build to verify nothing depends on the deleted files**

```bash
bun run build
```

Expected: build **will fail** because `content/docs/en/meta.json` still references `"guides"` and `content/docs/en/platform/meta.json` still references `"wsl"`. This is expected and will be fixed in Task 0.4. Record the exact error message.

- [ ] **Step 4: Commit**

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1
git add -A apps/landing/content/docs/en/guides apps/landing/content/docs/en/platform/wsl.mdx
git commit -m "docs(landing): remove old en/guides and en/platform/wsl.mdx"
```

(Note: `git add -A` on a deleted path stages the deletions even if the path no longer exists.)

---

### Task 0.4: Create English skeleton — directories, meta.json, and 32 frontmatter-only MDX files

**Files:**
- Modify: `apps/landing/content/docs/en/meta.json`
- Modify: `apps/landing/content/docs/en/platform/meta.json`
- Create: `apps/landing/content/docs/en/docker/meta.json`
- Create: `apps/landing/content/docs/en/kubernetes/meta.json`
- Create: `apps/landing/content/docs/en/advanced/meta.json`
- Create: 32 MDX files (see Step 4 below)

**Rationale:** Fumadocs needs every file referenced in `meta.json` to exist, otherwise the build fails. This task creates the entire skeleton at once with frontmatter + a placeholder body line per file, so subsequent content tasks only touch the body. The final `title` and `description` for every page are locked in at this stage so cross-linking tasks can reference them safely.

- [ ] **Step 1: Create the three new directories**

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1/apps/landing
mkdir -p content/docs/en/docker content/docs/en/kubernetes content/docs/en/advanced
```

- [ ] **Step 2: Write the root meta.json**

File: `apps/landing/content/docs/en/meta.json`

```json
{
  "title": "Dockerman Docs",
  "pages": [
    "index",
    "getting-started",
    "---",
    "docker",
    "kubernetes",
    "---",
    "advanced",
    "platform",
    "reference"
  ]
}
```

- [ ] **Step 3: Write the five section meta.json files**

File: `apps/landing/content/docs/en/docker/meta.json`

```json
{
  "title": "Docker",
  "pages": [
    "containers",
    "images",
    "networks",
    "volumes",
    "files",
    "compose",
    "stats",
    "events",
    "logs",
    "terminal"
  ],
  "defaultOpen": true
}
```

File: `apps/landing/content/docs/en/kubernetes/meta.json`

```json
{
  "title": "Kubernetes",
  "pages": [
    "overview",
    "cluster",
    "workloads",
    "networking",
    "config-storage",
    "rbac",
    "custom-resources",
    "helm",
    "port-forward",
    "debug",
    "logs-terminal"
  ],
  "defaultOpen": true
}
```

File: `apps/landing/content/docs/en/advanced/meta.json`

```json
{
  "title": "Advanced",
  "pages": [
    "spotlight",
    "remote-hosts"
  ],
  "defaultOpen": false
}
```

File: `apps/landing/content/docs/en/platform/meta.json` (overwrite the existing 2-page version):

```json
{
  "title": "Platform",
  "pages": [
    "windows",
    "macos",
    "linux"
  ],
  "defaultOpen": true
}
```

File: `apps/landing/content/docs/en/reference/meta.json` — **do not modify**, verify with `cat` that current content matches:

```json
{
  "title": "Reference",
  "pages": [
    "keyboard-shortcuts",
    "settings",
    "licensing",
    "troubleshooting"
  ],
  "defaultOpen": true
}
```

If it doesn't match exactly, update it to match.

- [ ] **Step 4: Create all 32 skeleton MDX files**

Each file uses this template (replace `<TITLE>` and `<DESCRIPTION>` per the table below):

```mdx
---
title: <TITLE>
description: <DESCRIPTION>
---

{/* TODO: body content will be written in a later task */}

This page is under construction. Check back soon.
```

The exact `title` and `description` for every file (these values MUST match Phase 1–6 tasks):

| File | title | description |
|---|---|---|
| `en/index.mdx` | Welcome to Dockerman | A fast, cross-platform UI for Docker and Kubernetes built with Tauri and Rust. |
| `en/getting-started.mdx` | Getting Started | Install Dockerman and connect to your first Docker daemon in minutes. |
| `en/docker/containers.mdx` | Containers | Create, inspect, and manage Docker containers; clone, commit, pause, and back up with a click. |
| `en/docker/images.mdx` | Images | Pull, build, push, analyze, and scan Docker images with a built-in Docker Hub browser and Trivy scanner. |
| `en/docker/networks.mdx` | Networks | Create and manage Docker networks, connect containers, and search containers by port. |
| `en/docker/volumes.mdx` | Volumes | Manage Docker volumes — create, inspect, and prune persistent storage used by your containers. |
| `en/docker/files.mdx` | Files | Browse, preview, edit, upload, download, and delete files inside volumes and running containers. |
| `en/docker/compose.mdx` | Compose & Templates | Manage multi-container applications with Docker Compose and bootstrap projects from the template library. |
| `en/docker/stats.mdx` | Stats | Real-time resource dashboards with ring gauges and sparkline charts for every container. |
| `en/docker/events.mdx` | Events | Stream, filter, persist, and export Docker daemon events for auditing and troubleshooting. |
| `en/docker/logs.mdx` | Logs | Stream and search container logs at scale with a virtualized list and power-user keyboard shortcuts. |
| `en/docker/terminal.mdx` | Terminal | Attach an interactive shell to any running container with a built-in xterm.js terminal. |
| `en/kubernetes/overview.mdx` | Overview | Native Kubernetes support in Dockerman — workloads, networking, config, storage, RBAC, CRDs, Helm, and debug. |
| `en/kubernetes/cluster.mdx` | Cluster | Start a local k3d cluster or import an existing kubeconfig to manage any Kubernetes environment. |
| `en/kubernetes/workloads.mdx` | Workloads | Manage Pods, Deployments, StatefulSets, DaemonSets, Jobs, CronJobs, and ReplicaSets in one place. |
| `en/kubernetes/networking.mdx` | Networking | Inspect Services, Ingresses, Endpoints, and NetworkPolicies across every namespace. |
| `en/kubernetes/config-storage.mdx` | Config & Storage | Manage ConfigMaps, Secrets, PersistentVolumeClaims, and StorageClasses without the kubectl juggling. |
| `en/kubernetes/rbac.mdx` | RBAC | Browse ServiceAccounts, Roles, ClusterRoles, and their bindings to understand who can do what. |
| `en/kubernetes/custom-resources.mdx` | Custom Resources | Discover Custom Resource Definitions in your cluster and browse or edit their instances. |
| `en/kubernetes/helm.mdx` | Helm | Add chart repositories and install, upgrade, roll back, and uninstall Helm releases from a GUI. |
| `en/kubernetes/port-forward.mdx` | Port Forward & DNS | Forward local ports to Services or Pods and optionally register automatic DNS entries for them. |
| `en/kubernetes/debug.mdx` | Debug Assistant | Launch an ephemeral debug pod alongside a target pod to diagnose network, DNS, and filesystem issues. |
| `en/kubernetes/logs-terminal.mdx` | Pod Logs & Terminal | Stream Pod logs with searchable history and attach to any container inside a Pod via xterm.js. |
| `en/advanced/spotlight.mdx` | Spotlight | Navigate Dockerman, run actions, and search resources with a single keystroke command palette. |
| `en/advanced/remote-hosts.mdx` | Remote Hosts (SSH) | Manage remote Docker hosts over SSH tunnels and switch between them from the host selector. |
| `en/platform/windows.mdx` | Windows | Run Dockerman on Windows with either Docker Desktop or the built-in WSL2 Docker Engine. |
| `en/platform/macos.mdx` | macOS | Run Dockerman on macOS with Docker Desktop as the default backend. |
| `en/platform/linux.mdx` | Linux | Install Dockerman on Linux distributions and configure the Docker Engine for your setup. |
| `en/reference/keyboard-shortcuts.mdx` | Keyboard Shortcuts | Every keyboard shortcut in Dockerman, grouped by surface — global, lists, logs, terminal, and Kubernetes. |
| `en/reference/settings.mdx` | Settings | Reference for every settings page in Dockerman, from Docker connections to notifications. |
| `en/reference/licensing.mdx` | Licensing | Activate, manage, and reset your Dockerman license across devices. |
| `en/reference/troubleshooting.mdx` | Troubleshooting | Common issues and how to resolve them — connection problems, permissions, performance, and Kubernetes. |

Create each file by running through the table and writing the skeleton template with the correct `title` and `description` filled in. Existing files that appear in the table (`en/index.mdx`, `en/getting-started.mdx`, `en/platform/linux.mdx`, `en/reference/*.mdx`) are overwritten with the skeleton template — their final content comes in Phase 1, 5, and 6.

- [ ] **Step 5: Verify the file count**

```bash
find content/docs/en -name "*.mdx" | wc -l
```

Expected: `32` (exactly).

```bash
find content/docs/en -name "meta.json" | wc -l
```

Expected: `6` (root + 5 sections).

- [ ] **Step 6: Build**

```bash
bun run build
```

Expected: build succeeds. Each page renders with the placeholder body ("This page is under construction. Check back soon.").

- [ ] **Step 7: Commit**

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1
git add apps/landing/content/docs/en/
git commit -m "docs(landing): scaffold en docs skeleton — new structure, 32 pages, 6 meta.json"
```

---

### Task 0.5: Generate zh/ja/es stubs via script

**Files:**
- Create: `apps/landing/scripts/generate-docs-stubs.ts`
- Create: 96 stub MDX files under `content/docs/{zh,ja,es}/` (3 × 32)
- Create: 15 stub `meta.json` files under `content/docs/{zh,ja,es}/{docker,kubernetes,advanced,platform}/` and 3 new root stubs

**Rationale:** Writing 96 stub files and 15 `meta.json` files by hand would be error-prone. A one-off script generates them from a single source of truth (the English structure plus a localization dictionary), commits the generated files, and is then kept in the repo for reproducibility. The script is written in TypeScript and run with `bunx tsx`.

- [ ] **Step 1: Create the script**

File: `apps/landing/scripts/generate-docs-stubs.ts`

```ts
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

// Root of the landing app, resolved from the script location.
const LANDING_ROOT = join(import.meta.dirname, '..')
const DOCS_ROOT = join(LANDING_ROOT, 'content/docs')

type Locale = 'zh' | 'ja' | 'es'
const LOCALES: Locale[] = ['zh', 'ja', 'es']

// English page structure. Each entry is [path-without-.mdx, key-in-dictionary].
const PAGES: Array<{ path: string; key: string }> = [
  { path: 'index', key: 'welcome' },
  { path: 'getting-started', key: 'getting-started' },
  // Docker
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
  // Kubernetes
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
  // Advanced
  { path: 'advanced/spotlight', key: 'spotlight' },
  { path: 'advanced/remote-hosts', key: 'remote-hosts' },
  // Platform
  { path: 'platform/windows', key: 'windows' },
  { path: 'platform/macos', key: 'macos' },
  { path: 'platform/linux', key: 'linux' },
  // Reference
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
    pages: ['index', 'getting-started', '---', 'docker', 'kubernetes', '---', 'advanced', 'platform', 'reference']
  },
  docker: {
    titleKey: 'docker',
    pages: ['containers', 'images', 'networks', 'volumes', 'files', 'compose', 'stats', 'events', 'logs', 'terminal'],
    defaultOpen: true
  },
  kubernetes: {
    titleKey: 'kubernetes',
    pages: ['overview', 'cluster', 'workloads', 'networking', 'config-storage', 'rbac', 'custom-resources', 'helm', 'port-forward', 'debug', 'logs-terminal'],
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

// Localization dictionary — titles, description placeholders, and "not yet translated" sentences.
const DICT: Record<Locale, {
  notYetTranslated: (enPath: string) => string
  titles: Record<string, string>
  descriptions: Record<string, string>
  sectionTitles: Record<string, string>
}> = {
  zh: {
    notYetTranslated: (p) => `此页面尚未翻译。请查看 [英文版本](/en/docs/${p})。`,
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
    notYetTranslated: (p) => `このページはまだ翻訳されていません。[英語版](/en/docs/${p})をご覧ください。`,
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
    notYetTranslated: (p) => `Esta página aún no está traducida. Consulte la [versión en inglés](/en/docs/${p}).`,
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
  const msg = DICT[locale].notYetTranslated(enPath)
  return `import { Callout } from 'fumadocs-ui/components/callout'\n\n<Callout type="info">\n  ${msg}\n</Callout>\n`
}

function stubMdx(locale: Locale, page: { path: string; key: string }): string {
  const title = DICT[locale].titles[page.key]
  const description = DICT[locale].descriptions[page.key]
  if (!title || !description) {
    throw new Error(`Missing dictionary entry for ${locale} / ${page.key}`)
  }
  return `---\ntitle: ${title}\ndescription: ${description}\n---\n\n${stubBody(locale, page.path)}`
}

async function writeLocale(locale: Locale) {
  // Write all MDX stub files.
  for (const page of PAGES) {
    const file = join(DOCS_ROOT, locale, `${page.path}.mdx`)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, stubMdx(locale, page), 'utf8')
  }

  // Write meta.json files (root + 4 sections; reference is left unchanged).
  const root = {
    title: DICT[locale].sectionTitles['docs-root'],
    pages: SECTION_META.root.pages
  }
  await writeFile(join(DOCS_ROOT, locale, 'meta.json'), `${JSON.stringify(root, null, 2)}\n`, 'utf8')

  for (const section of ['docker', 'kubernetes', 'advanced', 'platform'] as const) {
    const def = SECTION_META[section]
    const meta: Record<string, unknown> = {
      title: DICT[locale].sectionTitles[def.titleKey],
      pages: def.pages
    }
    if (def.defaultOpen !== undefined) meta.defaultOpen = def.defaultOpen
    const file = join(DOCS_ROOT, locale, section, 'meta.json')
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, `${JSON.stringify(meta, null, 2)}\n`, 'utf8')
  }
}

for (const locale of LOCALES) {
  await writeLocale(locale)
  console.log(`Generated stubs for ${locale}`)
}
```

- [ ] **Step 2: Run the script**

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1/apps/landing
bunx tsx scripts/generate-docs-stubs.ts
```

Expected output:
```
Generated stubs for zh
Generated stubs for ja
Generated stubs for es
```

- [ ] **Step 3: Verify generated file counts**

```bash
find content/docs/zh -name "*.mdx" -newer content/docs/en/meta.json | wc -l
find content/docs/ja -name "*.mdx" -newer content/docs/en/meta.json | wc -l
find content/docs/es -name "*.mdx" -newer content/docs/en/meta.json | wc -l
```

Expected: each returns `32` (the 32 newly-generated stubs).

```bash
find content/docs/zh -name "meta.json" | wc -l
```

Expected: `6` (root + 4 new sections + 1 existing `reference/meta.json` that was left alone).

- [ ] **Step 4: Spot check one generated stub**

```bash
cat content/docs/zh/docker/containers.mdx
```

Expected output:
```mdx
---
title: 容器
description: 创建、检查和管理 Docker 容器；一键克隆、提交、暂停和备份。
---

import { Callout } from 'fumadocs-ui/components/callout'

<Callout type="info">
  此页面尚未翻译。请查看 [英文版本](/en/docs/docker/containers)。
</Callout>
```

If the stub is missing fields or has wrong content, fix the script and re-run.

- [ ] **Step 5: Build**

```bash
bun run build
```

Expected: build succeeds. The old `zh/guides/`, `ja/guides/`, `es/guides/` directories still exist (intentionally, per spec §6.4) — their pages remain accessible via their old URLs.

- [ ] **Step 6: Commit**

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1
git add apps/landing/scripts/generate-docs-stubs.ts apps/landing/content/docs/zh apps/landing/content/docs/ja apps/landing/content/docs/es
git commit -m "docs(landing): generate zh/ja/es stubs for new docs structure"
```

---

### Task 0.6: Start dev server and smoke check every page

**Files:** none modified (verification only)

**Rationale:** Before any content is written, confirm that all 32 English pages and 96 stubs respond with 200 and the language switcher does not 404 on any of them. Any failure here is a structural error (bad `meta.json`, missing file, dangling reference) and must be fixed before writing content.

- [ ] **Step 1: Start the dev server as a detached background process**

The background process must survive across multiple Bash invocations (the content-writing tasks each run `curl` in a fresh shell). Use `nohup` + `disown` so it detaches from the controlling shell, and write logs to a known file for debugging:

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1/apps/landing
# Kill any prior dev server on port 3000 first, so restart is idempotent.
lsof -ti:3000 | xargs -r kill 2>/dev/null || true
nohup bun run dev > /tmp/landing-dev.log 2>&1 &
disown
```

Wait ~10 seconds for startup (Next.js needs time to compile the first request):

```bash
sleep 10
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/docs
```

Expected: `200`. If you get `000` (connection refused), check `/tmp/landing-dev.log` for startup errors.

- [ ] **Step 2: Smoke check every English page**

```bash
for path in \
  "en/docs" \
  "en/docs/getting-started" \
  "en/docs/docker/containers" \
  "en/docs/docker/images" \
  "en/docs/docker/networks" \
  "en/docs/docker/volumes" \
  "en/docs/docker/files" \
  "en/docs/docker/compose" \
  "en/docs/docker/stats" \
  "en/docs/docker/events" \
  "en/docs/docker/logs" \
  "en/docs/docker/terminal" \
  "en/docs/kubernetes/overview" \
  "en/docs/kubernetes/cluster" \
  "en/docs/kubernetes/workloads" \
  "en/docs/kubernetes/networking" \
  "en/docs/kubernetes/config-storage" \
  "en/docs/kubernetes/rbac" \
  "en/docs/kubernetes/custom-resources" \
  "en/docs/kubernetes/helm" \
  "en/docs/kubernetes/port-forward" \
  "en/docs/kubernetes/debug" \
  "en/docs/kubernetes/logs-terminal" \
  "en/docs/advanced/spotlight" \
  "en/docs/advanced/remote-hosts" \
  "en/docs/platform/windows" \
  "en/docs/platform/macos" \
  "en/docs/platform/linux" \
  "en/docs/reference/keyboard-shortcuts" \
  "en/docs/reference/settings" \
  "en/docs/reference/licensing" \
  "en/docs/reference/troubleshooting"
do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/$path")
  echo "$code $path"
done
```

Expected: every line starts with `200`. Any `404` or `500` is a fatal error.

- [ ] **Step 3: Smoke check one stub per locale**

```bash
for locale in zh ja es; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/$locale/docs/docker/containers")
  echo "$code $locale/docs/docker/containers"
done
```

Expected: all `200`. Visually confirm that `/zh/docs/docker/containers` shows the "此页面尚未翻译" Callout (open in a browser).

- [ ] **Step 4: Leave the dev server running for Phases 1–6**

The dev server stays up for the content writing phases. If it crashes or needs a restart after a config change, re-run Step 1 of this task (the `lsof -ti:3000 | xargs -r kill` line makes the restart idempotent). `tail -f /tmp/landing-dev.log` in a separate terminal is useful for watching compile errors while writing MDX.

- [ ] **Step 5: No commit — this task is verification only.**

---

## Phase 1 — Root pages

### Task 1.1: Write `index.mdx` (Welcome)

**File:** Modify `apps/landing/content/docs/en/index.mdx`

**Frontmatter (already set in Task 0.4; do not change):**

```yaml
title: Welcome to Dockerman
description: A fast, cross-platform UI for Docker and Kubernetes built with Tauri and Rust.
```

**Body structure to write:**

1. **Lead (no heading)** — 2–3 sentences. What Dockerman is, who it's for, and the two pillars it covers (Docker + Kubernetes).

2. **`## What Dockerman covers`** — one short paragraph that expands on the dual Docker + Kubernetes story. End with a sentence pointing at the `<Cards>` below.

3. **`## Start here`** — a `<Cards>` block with four `<Card>` entries:
   - Getting Started → `/en/docs/getting-started` — "Install the app and connect to Docker."
   - Docker → `/en/docs/docker/containers` — "Manage containers, images, networks, volumes, and Compose."
   - Kubernetes → `/en/docs/kubernetes/overview` — "Browse workloads, networking, config, Helm, and debug pods."
   - Advanced → `/en/docs/advanced/spotlight` — "Spotlight command palette and remote hosts."

4. **`## Key capabilities`** — a `<Cards>` block with 6 `<Card>` entries (text-only, no icons):
   - Full Docker lifecycle — "Create, run, inspect, log, and terminal into containers; manage images, networks, volumes, and Compose projects from one place."
   - Native Kubernetes (Phase 1) — "k3d in one click or bring your own kubeconfig; browse workloads, Services, ConfigMaps, RBAC, CRDs, and Helm releases."
   - Backup and restore — "Snapshot a container's config, filesystem, and volumes to a single tar.gz and restore it anywhere (Added in v4.8.0)."
   - Image security — "Scan images with Trivy and browse Docker Hub without leaving the app (Added in v4.6.0)."
   - WSL2 Docker Engine — "Run Docker on Windows without Docker Desktop — Dockerman sets up an Alpine WSL2 distro and installs Docker automatically (Added in v4.3.0)."
   - Remote hosts — "Connect to remote Docker daemons over SSH tunnels and switch between hosts on the fly."

**Components to use:** `Cards`, `Card`.

**Screenshot TODOs to include:** none in this page — the visual focus is on the Cards layout.

**Cross-links required:** the four Card hrefs above.

- [ ] **Step 1: Write the MDX file**

Replace the placeholder body in `apps/landing/content/docs/en/index.mdx` with the structured content described above. Keep the frontmatter block unchanged.

- [ ] **Step 2: Verify it renders**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/docs
```

Expected: `200`. Open in browser and verify all 4 + 6 Cards render as clickable links.

- [ ] **Step 3: Commit**

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1
git add apps/landing/content/docs/en/index.mdx
git commit -m "docs(landing): write en/index welcome page with cards navigation"
```

---

### Task 1.2: Write `getting-started.mdx`

**File:** Modify `apps/landing/content/docs/en/getting-started.mdx`

**Body structure to write:**

1. **Lead** — 2 sentences: what this page covers (install + first connect) and who needs a different path (Windows WSL2 users link to `platform/windows`).

2. **`## Prerequisites`** — `<Callout type="info">` containing: a running Docker daemon is required; Windows users who don't want Docker Desktop can use the built-in WSL2 Docker Engine (link to `/en/docs/platform/windows`).

3. **`## Install`** — `<Tabs items={['macOS', 'Windows', 'Linux']}>`:
   - **macOS tab:** `<Steps>` with 3 `<Step>`s:
     - `### Download the DMG` — "Download from the Download page. Choose Intel, Apple Silicon, or Universal."
     - `### Open and drag to Applications` — standard macOS install; mention Gatekeeper prompt on first launch.
     - `### Launch Dockerman` — "Click the app in Applications or Spotlight-search `Dockerman`."
   - **Windows tab:** `<Steps>` with 3 `<Step>`s:
     - `### Download the MSI` — "Download the MSI installer from the Download page."
     - `### Run the installer` — standard Windows installer flow.
     - `### Launch Dockerman` — "If you don't have Docker Desktop, the app will offer the WSL2 Setup Wizard on first launch (see [Windows platform guide](/en/docs/platform/windows))."
   - **Linux tab:** `<Steps>` with 3 `<Step>`s:
     - `### Install the package` — one short paragraph mentioning .deb, .rpm, and AppImage; point to `platform/linux` for per-distribution details.
     - `### Ensure your user is in the docker group` — `sudo usermod -aG docker $USER` (bash code fence); log out and back in.
     - `### Launch Dockerman` — from the application menu or CLI (`dockerman`).

4. **`## First launch`** — `<Steps>` with 4 `<Step>`s:
   - `### The connect dialog` — "Dockerman tries to connect to the local Docker daemon automatically. A connect dialog shows the progress and any error."
   - `### Pick a Docker source` — "Select local socket, TCP endpoint, or SSH host. Most users accept the auto-detected local socket."
   - `### Data initialization` — "Dockerman loads containers, images, networks, volumes, and Compose projects in parallel. This takes a few seconds."
   - `### The dashboard` — "You land on the dashboard with a snapshot of running and stopped containers and live resource charts."

5. **`## Next steps`** — `<Cards>` block with 4 `<Card>`s:
   - Containers → `/en/docs/docker/containers`
   - Kubernetes → `/en/docs/kubernetes/overview`
   - Platform guides → `/en/docs/platform/windows` (default to Windows since it's the most opinionated)
   - Troubleshooting → `/en/docs/reference/troubleshooting`

6. **`## System requirements`** — a Markdown table (not TypeTable — this is not a config schema):

| Platform | Minimum version | Architecture |
|---|---|---|
| macOS | 11 (Big Sur) | Intel, Apple Silicon, Universal |
| Windows | 10 (1903) / 11 | x86_64 |
| Linux | kernel 5.x | x86_64, aarch64 |

Add a one-line note under the table: "A running Docker daemon (Engine 20.10+) is required; Kubernetes support uses the optional k3d bundle."

**Components to use:** `Callout`, `Tabs`, `Tab`, `Steps`, `Step`, `Cards`, `Card`.

**Screenshot TODOs:**
- `{/* TODO(screenshot): getting-started/connect-dialog - Connect dialog on first launch */}` — place under the "The connect dialog" Step.
- `{/* TODO(screenshot): getting-started/dashboard - Dashboard after first connect */}` — place under the "The dashboard" Step.

**Cross-links required:** `/en/docs/platform/windows`, `/en/docs/platform/linux`, `/en/docs/docker/containers`, `/en/docs/kubernetes/overview`, `/en/docs/reference/troubleshooting`.

- [ ] **Step 1: Write the MDX file**

Replace the placeholder body in `apps/landing/content/docs/en/getting-started.mdx`.

- [ ] **Step 2: Verify it renders**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/docs/getting-started
```

Expected: `200`. Open in browser and verify Tabs switch correctly and Steps render as numbered.

- [ ] **Step 3: Commit**

```bash
git add apps/landing/content/docs/en/getting-started.mdx
git commit -m "docs(landing): write en/getting-started with platform tabs and first-launch steps"
```

---

## Phase 2 — Docker section

All Phase 2 tasks share the same verification template:

1. Write the MDX body (frontmatter was set in Task 0.4).
2. Check HTTP 200: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/docs/docker/<page>`
3. Visually verify components render in the browser.
4. Commit with message `docs(landing): write en/docker/<page>`.

### Task 2.1: Write `docker/containers.mdx` (Containers — the big one)

**File:** `apps/landing/content/docs/en/docker/containers.mdx`

**Body structure:**

1. **Lead** — 2 sentences naming the scope: lifecycle, inspect, clone/commit, and backup/restore.

2. **`## The container list`**
   - One paragraph describing the list view columns (name+ID, image, status, port mappings, created time).
   - Sub-paragraph: search bar filters by name, image, or port.
   - Sub-paragraph: multi-select with Ctrl/Cmd+Click for batch operations.

3. **`## Lifecycle actions`**
   - Intro paragraph.
   - Markdown table of actions:
     | Action | Effect |
     |---|---|
     | Start | Starts a stopped container |
     | Stop | Gracefully stops a running container (SIGTERM, then SIGKILL after timeout) |
     | Restart | Stops and starts the container |
     | Pause | Freezes all processes with `SIGSTOP` |
     | Unpause | Resumes paused processes with `SIGCONT` |
     | Remove | Deletes the container (must be stopped first) |
   - `<Callout type="info">`: "**Pause vs Stop** — Pause freezes the container's processes in memory so they resume instantly on unpause. Stop terminates processes and releases the container's PID namespace."

4. **`## Create a container`**
   - Intro sentence.
   - `<Tabs items={['Form', 'From docker run', 'Clone existing', 'From template']}>`:
     - **Form tab:** `<Steps>` with 5 `<Step>`s:
       - `### Pick a base image` — from local images or pull on demand.
       - `### Set the name and command` — optional name; override entrypoint/command if needed.
       - `### Ports and networks` — port mappings table, network selection.
       - `### Environment variables and volumes` — add key-value env vars and bind/volume mounts.
       - `### Resource limits and restart policy` — CPU/memory caps, restart policy dropdown.
     - **From docker run tab:** one paragraph + one bash code fence with example `docker run -d -p 8080:80 --name web nginx:latest`, then a sentence: "Paste the command; Dockerman parses it into the Form tab for review before creating."
     - **Clone existing tab:** one paragraph explaining that Clone copies an existing container's configuration into a fresh Create dialog (added in v4.6.0). Does not copy volume data.
     - **From template tab:** one paragraph pointing at `/en/docs/docker/compose#templates-library` for the template library.

5. **`## Inspect and update`**
   - One paragraph: the Inspect panel shows the full container JSON (network settings, mounts, env vars, labels).
   - The Update dialog lets you change a limited set of live properties (cpus, memory, restart policy) without recreating the container. For anything else (image, env, ports), stop the container and recreate it.

6. **`## Commit a running container`**
   - `Added in v4.6.0.`
   - One paragraph describing Commit: capture the container's current writable layer as a new image tag.
   - `<Steps>` with 3 `<Step>`s:
     - `### Select the container`
     - `### Fill in the new image name and tag`
     - `### Confirm` — "The new image appears in the Images list."
   - `<Callout type="warn">`: "Commit does not include data from mounted volumes — only the container's own filesystem changes."

7. **`## Clone a container`**
   - `Added in v4.6.0.`
   - One paragraph: Clone copies the configuration (image ref, ports, env, mounts, network) into a new Create dialog where you can modify any field before launching. Use it when you need a second instance with slight changes.
   - One sentence distinguishing Clone from Commit.

8. **`## Backup and restore`**
   - `Added in v4.8.0.`
   - Intro paragraph: a backup captures configuration, the container's filesystem, and its volume data into a single `.tar.gz` that can be restored on the same or a different host.

   - **`### What a backup contains`**
     - One paragraph.
     - `<Files>` block showing the archive layout:
       ```mdx
       <Files>
         <Folder name="backup-<name>-<timestamp>.tar.gz" defaultOpen>
           <File name="manifest.json" />
           <File name="config.json" />
           <File name="filesystem.tar" />
           <Folder name="volumes">
             <File name="<volume-name>.tar" />
           </Folder>
         </Folder>
       </Files>
       ```

   - **`### Create a backup`**
     - `<Steps>` with 4 `<Step>`s:
       - `### Open the backup dialog` — "From the container list, right-click a container and choose Backup."
       - `### Choose what to include` — "Config is always included. Toggle filesystem and volumes."
       - `### Pick an output path` — "Select a destination directory on the local machine."
       - `### Wait for the progress bar` — "Backup streams to disk; cancel at any time."
     - `{/* TODO(screenshot): containers/backup-dialog - Backup dialog with progress */}`

   - **`### Restore from a backup`**
     - `<Steps>` with 4 `<Step>`s:
       - `### Select a .tar.gz file` — "From the Containers page, choose Restore and pick the archive."
       - `### Preview the backup` — "Dockerman reads the manifest and shows the image ref, ports, mounts, and environment."
       - `### Edit name, ports, and image tag` — "Change the container name if it conflicts, remap host ports, and re-tag the image if it's missing locally."
       - `### Confirm restore` — "The new container is created and started."
     - `<Callout type="warn">`: "Name conflicts are detected up front; port conflicts are only caught at start time. Double-check host ports before confirming."

   - **`### Tips`**
     - Bullet list:
       - Backups of large containers scale with volume size; estimate ~1.2× the sum of all volume data.
       - To migrate a container between hosts, create a backup on the source, copy the tar.gz, and restore on the target.
       - Backups do **not** include network definitions; ensure the target host has equivalent networks (or let Dockerman recreate them).

9. **`## Batch operations`**
   - One paragraph on multi-select with Ctrl/Cmd+Click or Shift+Click for a range.
   - List of batch actions: Start, Stop, Restart, Pause, Remove.
   - `<Callout type="warn">`: "Batch Remove is irreversible and does not prompt per-container — only once for the whole selection."

10. **`## Keyboard shortcuts`**
    - One sentence + link to `/en/docs/reference/keyboard-shortcuts#container-actions` for the complete list.
    - Short table with the 4 most common: Start (S), Stop (X), Logs (L), Terminal (T). Include the exact platform-neutral keys — these bind to the list view when a row is focused.

**Components to use:** `Callout`, `Tabs`, `Tab`, `Steps`, `Step`, `Files`, `Folder`, `File`.

**Screenshot TODOs:**
- `{/* TODO(screenshot): containers/list - Container list with multi-select */}` — in section 2.
- `{/* TODO(screenshot): containers/create-form - Create container dialog form tab */}` — in section 4.
- `{/* TODO(screenshot): containers/backup-dialog - Backup dialog with progress */}` — inside `### Create a backup`.
- `{/* TODO(screenshot): containers/restore-preview - Restore preview with editable fields */}` — inside `### Restore from a backup`.

**Cross-links:** `/en/docs/docker/compose#templates-library`, `/en/docs/reference/keyboard-shortcuts#container-actions`.

- [ ] **Step 1: Write the MDX file**
- [ ] **Step 2: Verify HTTP 200**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/docs/docker/containers
```

- [ ] **Step 3: Commit**

```bash
git add apps/landing/content/docs/en/docker/containers.mdx
git commit -m "docs(landing): write en/docker/containers with backup, clone, commit sections"
```

---

### Task 2.2: Write `docker/images.mdx`

**File:** `apps/landing/content/docs/en/docker/images.mdx`

**Body structure:**

1. **Lead** — name the scope: pull, build, push, analyze, scan, and Docker Hub browser.

2. **`## The image list`** — paragraph on list view with Tabs (All / Dangling), size sort, filter.

3. **`## Pull an image`**
   - Intro paragraph.
   - Mention the Combobox search suggestions (Added in v4.7.0) that suggest registry, image, and tag as you type.
   - `<Steps>` with 3 `<Step>`s: `### Open the Pull dialog`, `### Enter the image reference`, `### Watch the streaming progress`.

4. **`## Browse Docker Hub`**
   - `Added in v4.6.0.`
   - Intro paragraph: an in-app Hub browser removes the need to switch to the web UI for common lookups.
   - `<Steps>` with 4 `<Step>`s:
     - `### Open the Hub browser` — "From the Images page, click Browse Docker Hub."
     - `### Search for an image` — "Type a query; results show the official/verified badges."
     - `### Read the README and tags` — "Click an image to see its README rendered inline and the full tag list."
     - `### Pull a specific tag` — "Click Pull next to any tag to start the pull with progress."
   - `{/* TODO(screenshot): images/hub-browser - Docker Hub browser with readme */}`

5. **`## Build from a Dockerfile`**
   - Intro paragraph: Build uses the same Docker daemon as the rest of Dockerman; BuildKit is used automatically if available.
   - `<Steps>` with 4 `<Step>`s:
     - `### Choose a build context` — "Select a local folder containing the Dockerfile."
     - `### Review or edit the Dockerfile` — "The content is shown in a Monaco editor; edits are saved to disk on confirm."
     - `### Set the image name and build args` — "Optional build args and target stage."
     - `### Run the build` — "Logs stream into a virtual terminal; the resulting image appears in the Images list on success."
   - `<Callout type="info">`: "Dockerman honors `.dockerignore` in the selected context directory."

6. **`## Push to a registry`**
   - `Added in v4.6.0.`
   - `<Steps>` with 3 `<Step>`s:
     - `### Tag the image for the target registry` — example: `registry.example.com/team/app:1.2.0`.
     - `### Configure registry credentials` — "Dockerman reads existing Docker auth from `~/.docker/config.json` or lets you add credentials per-push."
     - `### Push with streaming progress`.
   - `<Callout type="info">`: "Supports public registries (Docker Hub, GHCR) and private registries (Harbor, AWS ECR, Nexus, GitLab Container Registry)."

7. **`## Analyze image size`**
   - One paragraph: the Image Size page visualizes the layer tree, highlighting the largest layers and duplicated paths.
   - Short list of what to look for: oversized apt caches, large build artifacts left behind, redundant `COPY` layers.

8. **`## Tag operations`** — one paragraph on tag, untag, and retagging across registries.

9. **`## Scan with Trivy`**
   - `Added in v4.6.0.`
   - Intro paragraph: Trivy scans installed image layers for known vulnerabilities.

   - **`### First-time install`**
     - One sentence + `<Callout type="warn">`: "The first scan downloads the Trivy binary (~50 MB) and its vulnerability database. The download is one-time and cached locally."
     - Point at `/en/docs/reference/settings#trivy-settings` for custom Trivy paths.

   - **`### Run a scan`**
     - `<Steps>` with 3 `<Step>`s:
       - `### Select an image`
       - `### Click Scan with Trivy`
       - `### Wait for the report` — "Typical scans take 30s–3min depending on image size."

   - **`### Read the report`**
     - Paragraph: findings are grouped by severity (Critical, High, Medium, Low, Unknown) and sortable.
     - Click any finding to expand: CVE ID, description, affected versions, and fix versions when available.
     - Export: one sentence — "Export the raw report as JSON for CI integration."
   - `{/* TODO(screenshot): images/trivy-report - Trivy report with expanded finding */}`

10. **`## Cleanup`**
    - Bullet list: clear dangling images (Dangling tab → Select All → Delete), remove old versions via multi-select + Delete, and system-level prune (link to `/en/docs/reference/settings#docker-settings`).

**Components:** `Callout`, `Steps`, `Step`, `Tabs`, `Tab`.

**Screenshot TODOs:**
- `{/* TODO(screenshot): images/hub-browser - Docker Hub browser with readme */}`
- `{/* TODO(screenshot): images/trivy-report - Trivy report with expanded finding */}`

**Cross-links:** `/en/docs/reference/settings#trivy-settings`, `/en/docs/reference/settings#docker-settings`.

- [ ] **Step 1: Write the MDX file**
- [ ] **Step 2: HTTP 200 check for `/en/docs/docker/images`**
- [ ] **Step 3: Commit** — `docs(landing): write en/docker/images with hub browser, build, push, trivy`

---

### Task 2.3: Write `docker/networks.mdx`

**File:** `apps/landing/content/docs/en/docker/networks.mdx`

**Body structure:**

1. **Lead** — scope: list, create, connect/disconnect, and port search.

2. **`## The network list`** — columns: name, driver, scope, attached containers count, subnet. Mention that built-in networks (`bridge`, `host`, `none`) are flagged.

3. **`## Create a network`**
   - `<Steps>` with 3 `<Step>`s:
     - `### Pick a name and driver` — bridge (default), overlay, macvlan, ipvlan, host, null.
     - `### Configure IPAM (optional)` — subnet, gateway, IP range.
     - `### Labels (optional)` — add key-value labels.
   - `<Callout type="info">`: "Overlay networks require Swarm mode on the daemon."

4. **`## Connect and disconnect containers`**
   - One paragraph + a brief 2-step flow: select network → Attach Container dialog → pick container + optional alias.
   - Disconnect: same flow, Detach action.

5. **`## Search by port`**
   - `Added in v4.7.0.`
   - One paragraph + `<Steps>` with 3 `<Step>`s:
     - `### Open the port search dialog`
     - `### Enter the port number and protocol`
     - `### Review matching containers` — "Results show the container, the network it's on, and the exact port mapping."
   - `<Callout type="info">`: "Port search covers both exposed ports and host port mappings."

6. **`## Inspect a network`** — one paragraph: JSON inspect with IPAM, driver options, and connected containers (with IPs and aliases).

7. **`## Delete and prune`**
   - One paragraph on Delete (requires no attached containers) and Prune (removes all networks unused by at least one container).
   - `<Callout type="warn">`: "Built-in networks (`bridge`, `host`, `none`) cannot be deleted. Prune skips them automatically."

**Components:** `Callout`, `Steps`, `Step`.

**Screenshot TODOs:**
- `{/* TODO(screenshot): networks/port-search - Port search dialog with results */}`

**Cross-links:** none beyond standard.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/docker/networks with port search`

---

### Task 2.4: Write `docker/volumes.mdx`

**File:** `apps/landing/content/docs/en/docker/volumes.mdx`

**Body structure:**

1. **Lead** — scope: list, create, inspect, prune. Note that file browsing, preview, edit, and multi-select live on the [Files](/en/docs/docker/files) page.

2. **`## The volume list`** — columns: name, driver, mountpoint, size, created time. Sort and filter.

3. **`## Create a volume`**
   - `<Steps>` with 3 `<Step>`s:
     - `### Pick a name and driver` — local (default), plugin drivers if installed.
     - `### Driver options (optional)` — e.g., NFS mount options for the local driver.
     - `### Labels (optional)`.

4. **`## Browse volume files`**
   - One paragraph pointing at `[Files](/en/docs/docker/files)` for the full file browser documentation (preview, edit, upload, download, delete, multi-select).
   - One sentence: "From the volume list, click Browse to open the volume in the file browser."

5. **`## Inspect a volume`** — JSON inspect with mountpoint, driver options, labels, scope, and the list of containers currently using it.

6. **`## Prune unused volumes`**
   - One paragraph.
   - `<Callout type="warn">`: "Prune removes **all** volumes not currently attached to a container, including named volumes you might want to keep. Use explicit Delete for safety when in doubt."

**Components:** `Callout`, `Steps`, `Step`.

**Screenshot TODOs:** none in this page (file browser screenshots live on the Files page).

**Cross-links:** `/en/docs/docker/files`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/docker/volumes focused on volume lifecycle`

---

### Task 2.5: Write `docker/files.mdx`

**File:** `apps/landing/content/docs/en/docker/files.mdx`

**Body structure:**

1. **Lead** — "The Files browser works the same way whether you're looking inside a volume or inside a running container. This page covers both entry points and every file operation."

2. **`## Entry points`**
   - `<Tabs items={['From a volume', 'From a container']}>`:
     - **From a volume:** "Volumes list → select a volume → click Browse." URL pattern: `/volume/<name>/browse`.
     - **From a container:** "Containers list → select a container → Files tab (or route `/file`)." Notes that the container must be running.

3. **`## Navigation`** — one paragraph: tree on the left, breadcrumb at the top, double-click to descend. Back and Home buttons. Path input for quick jumps.

4. **`## Preview files`**
   - `Added in v4.4.0.`
   - Intro paragraph.
   - Table of supported preview types:

     | Type | Formats |
     |---|---|
     | Text and code | `.txt`, `.log`, `.json`, `.yaml`, `.toml`, `.ini`, `.env`, source code files (syntax-highlighted via Monaco) |
     | Markdown | `.md`, `.mdx` — rendered |
     | Images | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg` |
     | PDF | `.pdf` — rendered inline |
     | Video | `.mp4`, `.webm` — HTML5 playback |
     | Audio | `.mp3`, `.wav`, `.ogg` — HTML5 playback |
   - `<Callout type="info">`: "Files larger than 10 MB are shown as download-only to avoid loading the entire file into memory."

5. **`## Edit files`**
   - `Added in v4.4.0.`
   - One paragraph: text and code files open in a Monaco editor with syntax highlighting and unsaved-change indicators. Click Save to write changes back to the volume or container.
   - `<Callout type="warn">`: "Editing a file in a running container writes to the container's writable layer, not to the image. Restarting the container from the same image discards edits unless you commit the container first (see [Commit](/en/docs/docker/containers#commit-a-running-container))."
   - `{/* TODO(screenshot): files/edit-monaco - File editor with Monaco syntax highlighting */}`

6. **`## Upload and download`**
   - **Upload:** one paragraph — drag-and-drop a file or folder onto the browser, or use the Upload button.
   - **Download:** one paragraph — single files download directly; folders are zipped first.

7. **`## Delete files`**
   - `Added in v4.4.0.`
   - One paragraph.
   - `<Callout type="warn">`: "File deletion is irreversible and bypasses any host recycle bin."

8. **`## Multi-select`**
   - `Added in v4.4.0.`
   - Table:

     | Shortcut | Action |
     |---|---|
     | Ctrl/Cmd + Click | Toggle selection of a single file |
     | Shift + Click | Select a contiguous range |
     | Ctrl/Cmd + A | Select all in the current directory |
     | Esc | Clear selection |
   - Multi-select supports batch download (zipped), batch delete, and drag to upload target.
   - `<Callout type="warn">`: "Batch delete asks for confirmation once for the whole selection. There's no per-file prompt."

**Components:** `Callout`, `Tabs`, `Tab`.

**Screenshot TODOs:**
- `{/* TODO(screenshot): files/edit-monaco - File editor with Monaco syntax highlighting */}`
- `{/* TODO(screenshot): files/preview-image - Image preview with zoom */}`

**Cross-links:** `/en/docs/docker/containers#commit-a-running-container`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/docker/files for volume and container browsers`

---

### Task 2.6: Write `docker/compose.mdx`

**File:** `apps/landing/content/docs/en/docker/compose.mdx`

**Body structure:**

1. **Lead** — "Manage Docker Compose projects and bootstrap new ones from the built-in template library."

2. **`## Compose projects`** — one paragraph: the Compose page shows every project (derived from the `com.docker.compose.project` label) with container count, status, and base path.

3. **`## Start, stop, and remove a project`**
   - `<Steps>` with 4 `<Step>`s:
     - `### Select a project`
     - `### Start` — "Up all services; Dockerman pulls any missing images first."
     - `### Stop` — "Down all services. Containers are stopped but kept."
     - `### Remove` — "Remove containers and networks. Volumes are kept unless you check Include volumes."
   - `<Callout type="warn">`: "Include volumes removes both anonymous and named volumes defined by the Compose file. Named volumes with other consumers are skipped."

4. **`## Pull project images`** — one paragraph: Pull fetches all images referenced by the Compose file without starting any services. Useful before a cold start on a new host.

5. **`## Edit compose.yaml`**
   - One paragraph: edit the Compose file in a Monaco editor with YAML syntax. Dockerman validates the file on save.
   - `<Callout type="info">`: "Dockerman reruns `docker compose config` after each save to verify the file. Invalid YAML blocks the save."

6. **`## View logs across services`** — one paragraph: the project-level Logs view merges logs from every service, color-coded per service, with the same search shortcuts as [container logs](/en/docs/docker/logs).

7. **`## Templates library`**
   - Intro paragraph: ship with a curated set of templates for common stacks.
   - `<Cards>` with 4 `<Card>`s (plain text):
     - Databases — "MySQL, PostgreSQL, MongoDB, Redis, CouchDB."
     - Message queues — "RabbitMQ, NATS, Kafka."
     - Observability — "Prometheus + Grafana, Loki, Tempo."
     - Development — "phpMyAdmin, pgAdmin, Adminer, MinIO."
   - `<Steps>` with 3 `<Step>`s:
     - `### Open the Templates page`
     - `### Pick a template` — "Each template shows its services, required environment variables, and default ports."
     - `### Configure and launch` — "Set env values as prompted, pick a project name, and Start."

8. **`## Create your own template`** — one paragraph: save any existing Compose file as a template. Edit or delete templates from the Templates page.

**Components:** `Callout`, `Steps`, `Step`, `Cards`, `Card`.

**Screenshot TODOs:**
- `{/* TODO(screenshot): compose/project-logs - Multi-service merged log view */}`
- `{/* TODO(screenshot): compose/templates-library - Template library page */}`

**Cross-links:** `/en/docs/docker/logs`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/docker/compose with templates library section`

---

### Task 2.7: Write `docker/stats.mdx`

**File:** `apps/landing/content/docs/en/docker/stats.mdx`

**Body structure:**

1. **Lead** — "The Stats page is Dockerman's real-time resource dashboard. Redesigned in v4.5.0, it combines at-a-glance ring gauges with per-metric sparkline history."

2. **`## Overview dashboard`** — one paragraph: the Stats page has two levels — an Overview showing aggregate CPU and memory across all running containers, and per-container detail panels.

3. **`## Ring gauges`**
   - One paragraph: ring gauges show instantaneous CPU % and memory % per container. The outer ring is the current value; a faded inner arc shows the average over the selected time range.
   - One sentence on how to read the color bands (green < 50%, amber 50–80%, red > 80%).

4. **`## Sparkline charts`**
   - Intro paragraph: four compact time-series charts below each gauge row.
   - Bullet list of the four: CPU %, Memory (MB), Network I/O (bytes/s for rx and tx), Disk I/O (bytes/s for read and write).
   - Hovering shows the exact value at that point.

5. **`## Time range selector`** — one paragraph: selector at the top with 1h, 3h, 6h, 12h, 24h. Applies to both sparklines and the ring gauge average.

6. **`## Network interfaces and disk devices`** — one paragraph: expand a container row to show per-interface and per-device breakdowns. Useful for containers with multiple network attachments or bind mounts.

7. **`## Tips`**
   - Bullet list:
     - Spiky CPU on a 1h window that flattens on 24h usually indicates short-lived batch work — not a leak.
     - Steady memory growth on 24h with no drops is a classic memory leak signal.
     - Disk I/O spikes that line up with log file size jumps often mean unrotated logs — check `[Logs](/en/docs/docker/logs)`.
   - `{/* TODO(screenshot): stats/dashboard - Stats overview with ring gauges and sparklines */}`

**Components:** `Callout` (optional), plain tables.

**Cross-links:** `/en/docs/docker/logs`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/docker/stats reflecting v4.5 redesign`

---

### Task 2.8: Write `docker/events.mdx`

**File:** `apps/landing/content/docs/en/docker/events.mdx`

**Body structure:**

1. **Lead** — "Events mirrors `docker events` in a searchable, filterable, exportable UI."

2. **`## Opening the events stream`** — one paragraph: Events page starts streaming from the current time as soon as it's opened. A pause button halts the stream without losing already-received events.

3. **`## Filter events`**
   - One paragraph.
   - Filter dimensions:
     - Resource type — container, image, network, volume, daemon.
     - Action — create, start, stop, die, destroy, pull, push, connect, disconnect, …
     - Time range — rolling window or custom absolute range.
     - Free text — matches any field.

4. **`## Persist history`** — one paragraph: Events are written to a local JSONL file in Dockerman's app data directory. History persists across app restarts. The retention window is configurable in Settings → Data management.

5. **`## Search and query`** — one paragraph: search by container name, image, or label. Combine with filters for focused queries.

6. **`## Export`** — one paragraph + bullet:
   - JSON — raw event objects, suitable for ingestion into log pipelines.
   - CSV — flattened columns, suitable for spreadsheets.

7. **`## Troubleshooting with events`**
   - Short Accordions for common scenarios:
     - `<Accordions>` with 3 `<Accordion title="...">`:
       - "Why did my container restart?" — explain how to correlate `die` → `start` pairs and inspect the exit code in the event payload.
       - "Why did image pull fail?" — `pull` events include the error message in the payload.
       - "Who disconnected from my network?" — `disconnect` events identify the container that left.

**Components:** `Accordions`, `Accordion`.

**Cross-links:** none beyond standard.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/docker/events`

---

### Task 2.9: Write `docker/logs.mdx`

**File:** `apps/landing/content/docs/en/docker/logs.mdx`

**Body structure:**

1. **Lead** — "Container logs with a virtualized list that scales to millions of lines and keyboard shortcuts for power users."

2. **`## Live log streaming`** — one paragraph: Logs opens streaming from the container's current log tail. A Pause button freezes the view without disconnecting the stream. A Resume button scrolls to the newest line and re-follows.

3. **`## Virtualized list`**
   - One paragraph: lines are rendered on demand so the viewer stays responsive with 1M+ lines.
   - `<Callout type="info">`: "Memory usage stays roughly constant regardless of log length because only visible rows are kept in the DOM."

4. **`## Search`** — one paragraph: open the search box with `/`, type a query (literal by default, toggle regex), and hits are highlighted in place.

5. **`## Power shortcuts`**

   | Shortcut | Action |
   |---|---|
   | `/` | Open search |
   | Enter (in search) | Next match |
   | Shift + Enter (in search) | Previous match |
   | `n` | Next match (outside search box) |
   | `N` (Shift+n) | Previous match |
   | `g` | Jump to the beginning of the log |
   | `G` (Shift+g) | Jump to the latest line |
   | `P` | Previous match (alternative to Shift+Enter) |
   | Esc | Close search / clear highlights |

6. **`## Timestamp formats`** — one paragraph: toggle between relative (`2m ago`), absolute UTC, and absolute local time in the view options.

7. **`## Export logs`** — one paragraph + bullet:
   - JSON — includes timestamps and stream (stdout/stderr) per line.
   - Plain text — what you see in the viewer.

**Components:** `Callout`.

**Cross-links:** `/en/docs/reference/keyboard-shortcuts#log-viewer` (from a closing one-liner).

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/docker/logs`

---

### Task 2.10: Write `docker/terminal.mdx`

**File:** `apps/landing/content/docs/en/docker/terminal.mdx`

**Body structure:**

1. **Lead** — "Attach a fully interactive shell to any running container, powered by xterm.js."

2. **`## Open a terminal`** — one paragraph: from the container list, right-click or click Terminal. A new tab opens with the interactive shell.

3. **`## Choose a shell`**
   - One paragraph + fallback order:
     - By default, Dockerman tries `bash`, then `sh`, then `zsh`.
     - Override the shell for a session via the Settings cog in the terminal tab.
   - `<Callout type="info">`: "Minimal images (like Alpine or distroless) may not ship with bash. Dockerman falls back to sh automatically."

4. **`## Copy, paste, and scroll`**

   | Shortcut | Action |
   |---|---|
   | Ctrl/Cmd + Shift + C | Copy selection |
   | Ctrl/Cmd + Shift + V | Paste |
   | Mouse wheel | Scroll |
   | Ctrl/Cmd + Shift + K | Clear the terminal |

5. **`## Themes and fonts`** — one paragraph: six built-in themes (dark, light, solarized-dark, solarized-light, dracula, nord). Customize the font family and size in `[Settings → Terminal settings](/en/docs/reference/settings#terminal-settings)`.

6. **`## Limitations`**
   - `<Callout type="warn">`:
     - Stopping the container ends the terminal session.
     - Long idle connections may be dropped by Docker; reconnect by reopening the terminal.
     - Some TUI apps (htop, vim) may require `TERM=xterm-256color`; set it before launching them.

**Components:** `Callout`.

**Cross-links:** `/en/docs/reference/settings#terminal-settings`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/docker/terminal`

---

## Phase 3 — Kubernetes section

Same verification rhythm as Phase 2.

### Task 3.1: Write `kubernetes/overview.mdx`

**File:** `apps/landing/content/docs/en/kubernetes/overview.mdx`

**Body structure:**

1. **Lead** — "Dockerman's Phase 1 Kubernetes support is a lightweight, GUI-first way to run and inspect a real Kubernetes cluster without switching tools or learning a new dashboard."

2. **`## Why Kubernetes in Dockerman`** — 2–3 sentences on the positioning: lighter than Docker Desktop's K8s, native Rust/Tauri UI, k3d included, same app as your Docker workflow. One sentence on who it's for: local dev, small clusters, CI sanity checks.

3. **`## What's included`** — `<Cards>` with 8 `<Card>`s (one per sub-section of this docs area):
   - Cluster → `/en/docs/kubernetes/cluster`
   - Workloads → `/en/docs/kubernetes/workloads`
   - Networking → `/en/docs/kubernetes/networking`
   - Config & Storage → `/en/docs/kubernetes/config-storage`
   - RBAC → `/en/docs/kubernetes/rbac`
   - Helm → `/en/docs/kubernetes/helm`
   - Port Forward & DNS → `/en/docs/kubernetes/port-forward`
   - Debug Assistant → `/en/docs/kubernetes/debug`

4. **`## Two ways to start`**
   - `<Tabs items={['k3d (local)', 'Existing cluster']}>`:
     - **k3d tab:** one paragraph — one-click local cluster for development and testing. Points at [Cluster](/en/docs/kubernetes/cluster).
     - **Existing cluster tab:** one paragraph — import any kubeconfig (kind, minikube, EKS, GKE, AKS, on-prem). Points at [Cluster](/en/docs/kubernetes/cluster#import-an-existing-cluster).

5. **`## Namespaces`** — one paragraph: a namespace switcher in the top bar scopes every list in the Kubernetes section. Switching namespaces doesn't disconnect from the cluster.

6. **`## What's not yet supported`**
   - `<Callout type="info">`: "Phase 1 focuses on read/write for the resources listed in What's included. Not yet supported: cluster creation outside k3d (kubeadm, EKS provisioning, etc.), horizontal pod autoscalers, gateway APIs beyond Ingress, and visual editors for CRD instances (YAML editing only). These are on the Phase 2 roadmap."

**Components:** `Cards`, `Card`, `Tabs`, `Tab`, `Callout`.

**Cross-links:** all K8s sub-pages.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check: `/en/docs/kubernetes/overview`
- [ ] **Step 3:** Commit — `docs(landing): write en/kubernetes/overview`

---

### Task 3.2: Write `kubernetes/cluster.mdx`

**File:** `apps/landing/content/docs/en/kubernetes/cluster.mdx`

**Body structure:**

1. **Lead** — "Start a local k3d cluster in one click or import any existing kubeconfig."

2. **`## Start a local cluster with k3d`**
   - Intro paragraph.
   - `<Steps>` with 4 `<Step>`s:
     - `### Open the Kubernetes section` — "If no cluster is configured, you see a Start a Cluster button."
     - `### Click Start a Cluster` — "Dockerman downloads the k3d binary on first use (~15 MB)."
     - `### Wait for the cluster to come up` — "Takes ~10 seconds on a modern machine."
     - `### Start using Kubernetes` — "The namespace switcher populates and workloads become browsable."
   - `<Callout type="warn">`: "The k3d binary is downloaded on first use. Ensure outbound HTTPS is allowed."

3. **`## Import an existing cluster`**
   - `<Steps>` with 3 `<Step>`s:
     - `### Click Import Cluster`
     - `### Select a kubeconfig file` — "Dockerman reads the file; if it contains multiple contexts, pick the one you want to use."
     - `### Verify the connection` — "Dockerman runs a quick API probe (server version + namespace list) before saving the connection."

4. **`## Switch contexts`** — one paragraph: the context dropdown at the top of the Kubernetes section lists every imported cluster plus the k3d cluster. Switching reloads all lists.

5. **`## Delete a cluster`**
   - One paragraph distinguishing two actions:
     - Delete from Dockerman (forgets the connection but leaves the cluster running) — for imported kubeconfigs.
     - Tear down the k3d cluster (destroys the local cluster and all data) — for k3d.
   - `<Callout type="warn">`: "Tearing down a k3d cluster is irreversible. All workloads and PVs created inside it are lost."

6. **`## Cluster version and status`** — one paragraph: the Cluster page shows the server version, node list with status, and the kubelet/kube-proxy versions per node. Useful for spotting version drift.

**Components:** `Steps`, `Step`, `Callout`.

**Cross-links:** none beyond standard.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/kubernetes/cluster`

---

### Task 3.3: Write `kubernetes/workloads.mdx`

**File:** `apps/landing/content/docs/en/kubernetes/workloads.mdx`

**Body structure:**

1. **Lead** — "Pods, Deployments, StatefulSets, DaemonSets, Jobs, CronJobs, and ReplicaSets — every workload resource lives on the Workloads page. Each resource type has its own list, detail view, and YAML editor."

2. **`## Pods`**
   - One paragraph: list with status (Running, Pending, CrashLoopBackOff, …), ready-container count, restarts, age.
   - Click-through actions: view logs (link to `[Pod Logs & Terminal](/en/docs/kubernetes/logs-terminal)`), attach a shell, or launch the [Debug Assistant](/en/docs/kubernetes/debug).

3. **`## Deployments`**
   - One paragraph: list with ready/updated/available replicas.
   - `<Steps>` with 3 `<Step>`s covering the three most common actions:
     - `### Scale` — "Change the replica count inline."
     - `### Rollout` — "Trigger a rollout (set image, update env) and watch the progress in the rollout history."
     - `### Rollback` — "Pick a previous revision from the rollout history."
   - `{/* TODO(screenshot): kubernetes/deployment-rollout - Deployment rollout history */}`

4. **`## StatefulSets`** — one paragraph: ordered pod naming, PVC templates, and the ordered start/stop guarantee. Mention the Delete cascade behavior (PVCs are retained by default).

5. **`## DaemonSets`** — one paragraph: one pod per node (matching a selector); useful for log collectors, monitoring agents, and CNI plugins.

6. **`## Jobs`** — one paragraph: run-to-completion workloads with backoff limit and active deadlines.

7. **`## CronJobs`** — one paragraph: schedule notation (cron expression), suspend/resume, and manual trigger for on-demand runs.

8. **`## ReplicaSets`** — one paragraph. `<Callout type="info">`: "Deployments manage their own ReplicaSets. Edit the Deployment instead of its ReplicaSets directly."

9. **`## Edit workloads with YAML`** — one paragraph: every workload has an Edit YAML button that opens the full resource in Monaco with kubernetes schema support. Dry-run is applied on save so invalid YAML is rejected before it reaches the API server.

**Components:** `Callout`, `Steps`, `Step`.

**Screenshot TODOs:**
- `{/* TODO(screenshot): kubernetes/deployment-rollout - Deployment rollout history */}`

**Cross-links:** `/en/docs/kubernetes/logs-terminal`, `/en/docs/kubernetes/debug`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/kubernetes/workloads`

---

### Task 3.4: Write `kubernetes/networking.mdx`

**File:** `apps/landing/content/docs/en/kubernetes/networking.mdx`

**Body structure:**

1. **Lead** — "Services, Ingresses, Endpoints, and NetworkPolicies — everything that moves traffic between pods."

2. **`## Services`**
   - One paragraph: list shows type (ClusterIP, NodePort, LoadBalancer, ExternalName), ClusterIP, ports, and selector.
   - Short bullet on each type and when you'd see it.
   - Endpoints backing the Service are linked from the detail view.

3. **`## Ingresses`**
   - One paragraph: list shows the host, paths, and backend Services.
   - Detail view: TLS secret name, annotations (especially ingress-controller-specific ones), and the rules tree.

4. **`## Endpoints`** — one paragraph: the raw Endpoint list mirrors what the cluster's kube-proxy uses. Mostly useful for debugging a Service with zero Endpoints.

5. **`## NetworkPolicies`**
   - One paragraph: list with pod selector, ingress/egress rule counts, and policy types.
   - `<Callout type="info">`: "Phase 1 is view-only for NetworkPolicies. Create and edit them via `kubectl apply` or the Edit YAML button on other workloads."

**Components:** `Callout`.

**Cross-links:** none.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/kubernetes/networking`

---

### Task 3.5: Write `kubernetes/config-storage.mdx`

**File:** `apps/landing/content/docs/en/kubernetes/config-storage.mdx`

**Body structure:**

1. **Lead** — "ConfigMaps, Secrets, PersistentVolumeClaims, and StorageClasses — the sources and backing stores for your workloads' data."

2. **`## ConfigMaps`**
   - One paragraph: list and detail view; inline YAML editor.
   - `<Callout type="info">`: "Editing a ConfigMap does not automatically restart pods that mount it. Check the Deployment or StatefulSet to roll the pods."

3. **`## Secrets`**
   - One paragraph: list with type (Opaque, kubernetes.io/tls, kubernetes.io/dockerconfigjson, …) and reveal toggle per key.
   - `<Callout type="warn">`: "Reveal shows secret values in plaintext. Anyone with screen access at that moment can read them. Close the panel after you're done."

4. **`## PersistentVolumeClaims`** — one paragraph: list with phase (Bound, Pending, Lost), bound PV, storage class, and capacity. Detail view shows the access modes and the bound PV if any.

5. **`## StorageClasses`** — one paragraph: list of StorageClasses with provisioner, reclaim policy, volume binding mode, and the cluster's default (marked with a star).

**Components:** `Callout`.

**Cross-links:** none.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/kubernetes/config-storage`

---

### Task 3.6: Write `kubernetes/rbac.mdx`

**File:** `apps/landing/content/docs/en/kubernetes/rbac.mdx`

**Body structure:**

1. **Lead** — "ServiceAccounts, Roles, ClusterRoles, RoleBindings, and ClusterRoleBindings — Dockerman surfaces the full RBAC tree in one place so you can answer 'who can do what' in seconds."

2. **`## ServiceAccounts`** — one paragraph: list of ServiceAccounts in the current namespace. Detail view shows mounted secrets, image pull secrets, and the generated token secrets.

3. **`## Roles and ClusterRoles`** — one paragraph: list; detail view shows the `rules` array decoded into a readable table (apiGroups, resources, verbs, resourceNames).

4. **`## RoleBindings and ClusterRoleBindings`** — one paragraph: list with role reference and subjects (users, groups, ServiceAccounts). Click a subject to pivot to that ServiceAccount.

5. **`## Troubleshooting permissions`** — one paragraph: for "why can this pod not X", combine RBAC + Debug Assistant. Point at `[Debug Assistant](/en/docs/kubernetes/debug)`.

**Components:** (none beyond default).

**Cross-links:** `/en/docs/kubernetes/debug`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/kubernetes/rbac`

---

### Task 3.7: Write `kubernetes/custom-resources.mdx`

**File:** `apps/landing/content/docs/en/kubernetes/custom-resources.mdx`

**Body structure:**

1. **Lead** — `Added in v4.8.0.` + "Dockerman discovers every CustomResourceDefinition installed in your cluster and lets you browse and edit their instances."

2. **`## List CRDs`** — one paragraph: the CRDs tab shows all installed definitions with their group, version, scope (Namespaced or Cluster), and instance count.

3. **`## Browse resource instances`** — one paragraph: click a CRD to see all instances across namespaces (or cluster-wide). Columns come from the CRD's `additionalPrinterColumns`.

4. **`## View and edit YAML`** — one paragraph: open any instance in the Monaco YAML editor. The CRD's OpenAPI schema powers autocomplete and validation.

5. **`## Limitations`**
   - `<Callout type="info">`: "Phase 1 supports YAML-based editing only. Field-level forms driven by the CRD schema are planned for Phase 2. Operators that create auxiliary resources in response to CRD changes still work — Dockerman observes the results but doesn't track cause-and-effect across resources."

**Components:** `Callout`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/kubernetes/custom-resources`

---

### Task 3.8: Write `kubernetes/helm.mdx`

**File:** `apps/landing/content/docs/en/kubernetes/helm.mdx`

**Body structure:**

1. **Lead** — "Add chart repositories and manage Helm releases from a GUI."

2. **`## Repositories`**
   - `<Steps>` with 3 `<Step>`s:
     - `### Add a repository` — name + URL (Bitnami, Jetstack, ingress-nginx, etc.).
     - `### Update repositories` — fetch the latest chart index.
     - `### Remove a repository`.

3. **`## Browse charts`** — one paragraph: search across all added repositories. Click a chart to see its README and available versions.

4. **`## Install a release`**
   - `<Steps>` with 4 `<Step>`s:
     - `### Pick a chart and version`
     - `### Pick a release name and namespace`
     - `### Edit values.yaml` — "Dockerman loads the chart's default values into a Monaco editor. Edit the values you want to override."
     - `### Install` — "Progress is streamed; the release appears in Releases on success."

5. **`## Upgrade and rollback`**
   - `<Steps>` with 3 `<Step>`s:
     - `### Open a release` — "The release detail shows the current revision and history."
     - `### Upgrade` — "Pick a new version or edit values; Helm computes the diff and runs the upgrade."
     - `### Rollback` — "From the history tab, pick a previous revision and Rollback."

6. **`## Uninstall a release`**
   - One paragraph.
   - `<Callout type="warn">`: "Uninstall deletes the Kubernetes resources created by Helm but not PersistentVolumeClaims or CRDs installed by the chart. Check the chart's docs for `--keep-history` or `keepCRDs` behavior before uninstalling production releases."

**Components:** `Steps`, `Step`, `Callout`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/kubernetes/helm`

---

### Task 3.9: Write `kubernetes/port-forward.mdx`

**File:** `apps/landing/content/docs/en/kubernetes/port-forward.mdx`

**Body structure:**

1. **Lead** — "Forward local ports to Services or Pods and optionally register automatic DNS entries — the pair that makes `http://myapp.default/` work on your laptop."

2. **`## Forward a Service or Pod port`**
   - `<Steps>` with 3 `<Step>`s:
     - `### Pick a target` — "Pod or Service; Services are recommended so forwarding survives pod restarts."
     - `### Pick the target and local ports` — "Dockerman suggests the Service's first port and an unused local port."
     - `### Start the forward` — "The connection appears in Active Forwards."

3. **`## Manage active forwards`** — one paragraph: list of active forwards with target, local port, status, and a Stop button. Forwards auto-reconnect after transient network errors.

4. **`## Automatic DNS`**
   - `Added in v4.8.0.`
   - Intro paragraph: Automatic DNS registers a hostname (e.g., `myapp.default.svc.cluster.local` or a custom alias) pointing at `127.0.0.1` for every active port-forward.
   - `<Steps>` with 3 `<Step>`s:
     - `### Enable automatic DNS in Settings` — "Settings → Kubernetes DNS settings → Enable."
     - `### Create a port forward` — "Dockerman adds a DNS entry automatically."
     - `### Open the URL in your browser` — "`http://<alias>:<local-port>/` now resolves."
   - `<Callout type="warn">`: "Automatic DNS modifies `/etc/hosts` on Linux and macOS and requires elevated privileges. On Windows, it uses a local DNS server on 127.0.0.1:53."

5. **`## Manual DNS entries`** — one paragraph: add a hostname → IP mapping manually. Entries are persisted across app restarts.

6. **`## Troubleshooting`**
   - Bullet list:
     - "Port in use" — Dockerman offers the next free port; pick it.
     - "DNS entry not resolving" — check that automatic DNS is enabled and that your browser doesn't have a stale cache (`chrome://net-internals/#dns` → Clear).
     - "Forward keeps dropping" — the underlying Service has no healthy Endpoints; check the backing pods.

**Components:** `Steps`, `Step`, `Callout`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/kubernetes/port-forward with v4.8 automatic DNS`

---

### Task 3.10: Write `kubernetes/debug.mdx`

**File:** `apps/landing/content/docs/en/kubernetes/debug.mdx`

**Body structure:**

1. **Lead** — `Added in v4.8.0.` + "Debug Assistant launches an ephemeral debug pod alongside a target pod and drops you into a shell with debugging tools preinstalled."

2. **`## When to use Debug Assistant`**
   - Bullet list:
     - The target pod uses a minimal image (distroless, scratch) that has no shell.
     - You need tools (tcpdump, dig, curl, netcat) that aren't in the target image.
     - You need to inspect a target pod's mounted volumes or network namespace without touching the pod itself.
     - You're debugging a CrashLoopBackOff where the pod never stays up long enough to `kubectl exec`.

3. **`## Launch a debug pod`**
   - `<Steps>` with 4 `<Step>`s:
     - `### Select the target pod` — "From Pods or Workloads, right-click a pod and choose Debug."
     - `### Configure sharing options` — "Share process namespace (default on), share network namespace (default on), mount the target's volumes (default off)."
     - `### Wait for the debug pod to be Ready`
     - `### Interact via the embedded terminal` — "The debug pod's shell opens in a Dockerman terminal tab."
   - `{/* TODO(screenshot): kubernetes/debug-assistant - Debug pod terminal with target info */}`

4. **`## What's inside the debug pod`** — a short table of the preinstalled tools:

   | Tool | Purpose |
   |---|---|
   | `bash`, `sh` | Shells |
   | `ps`, `top`, `htop` | Process inspection |
   | `netstat`, `ss` | Connection state |
   | `tcpdump` | Packet capture |
   | `curl`, `wget` | HTTP probing |
   | `dig`, `nslookup` | DNS resolution |
   | `nc` (netcat) | Raw TCP/UDP |
   | `vim`, `less` | File inspection |
   | `strace` | Syscall tracing (where the target's kernel allows it) |

5. **`## Common debug workflows`**
   - `<Accordions>` with 3 `<Accordion title="...">`:
     - **"Diagnose a DNS problem"** — 4 short steps: `dig @<cluster-dns>` for the Service, check `/etc/resolv.conf`, verify kube-dns Endpoints on the Networking page, try `getent hosts`.
     - **"Capture traffic between pods"** — 4 short steps: run `tcpdump -i any port 8080 -w /tmp/capture.pcap`, reproduce the problem from the target pod, copy the pcap out via `kubectl cp`, open in Wireshark.
     - **"Inspect a mounted volume"** — 3 short steps: launch debug pod with volume mounts enabled, `cd` to the mount path, inspect contents.

6. **`## Cleanup`** — one paragraph: the debug pod is ephemeral. Closing the terminal tab or exiting the shell terminates it. No manual cleanup is needed.

**Components:** `Steps`, `Step`, `Accordions`, `Accordion`, `Callout`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/kubernetes/debug assistant`

---

### Task 3.11: Write `kubernetes/logs-terminal.mdx`

**File:** `apps/landing/content/docs/en/kubernetes/logs-terminal.mdx`

**Body structure:**

1. **Lead** — "Stream Pod logs and attach to any container inside a Pod via xterm.js."

2. **`## Stream pod logs`** — one paragraph: open Logs from any Pod row or detail view; the log streams live. For multi-container pods, pick the container from the dropdown at the top.

3. **`## Search shortcuts`** — one paragraph: Pod logs share the same keyboard shortcuts as `[container logs](/en/docs/docker/logs#power-shortcuts)` (`/`, `n`/`N`, `g`/`G`, Esc).

4. **`## Multi-container pods`** — one paragraph: the container dropdown includes init containers (marked as such). Switching containers resets the log stream.

5. **`## Pod terminal (exec)`**
   - `<Steps>` with 3 `<Step>`s:
     - `### Open the terminal` — "From a Pod, click Terminal (or press T with the Pod selected)."
     - `### Pick a container` — "Skipped for single-container pods."
     - `### Pick a shell` — "bash → sh → zsh fallback, same as Docker container terminals."

6. **`## Limitations`**
   - Bullet list:
     - Ephemeral: killing the target container ends the session.
     - No persistent history across sessions.
     - Some TUI apps may need `TERM=xterm-256color`.

**Components:** `Steps`, `Step`.

**Cross-links:** `/en/docs/docker/logs#power-shortcuts`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/kubernetes/logs-terminal`

---

## Phase 4 — Advanced section

### Task 4.1: Write `advanced/spotlight.mdx` and `advanced/remote-hosts.mdx`

**Files:**
- Modify: `apps/landing/content/docs/en/advanced/spotlight.mdx`
- Modify: `apps/landing/content/docs/en/advanced/remote-hosts.mdx`

Two small pages, one commit.

#### Spotlight body

1. **Lead** — "Spotlight is Dockerman's command palette. One keystroke opens a searchable, keyboard-driven launcher that can navigate anywhere in the app, run common actions, and look up resources."

2. **`## Open Spotlight`** — Cmd/Ctrl + K by default, or from the tray menu. Spotlight opens as a separate, frameless window that doesn't steal focus from the main app.

3. **`## Navigate to resources`** — start typing a container name, image tag, Compose project, Kubernetes Pod, or Settings page. Results are ranked by usage and recency. Enter navigates to the selected result.

4. **`## Quick actions`** — some results include inline actions:
   - Containers: Start, Stop, Restart, Logs, Terminal, Backup
   - Images: Pull (re-pull), Scan with Trivy, Delete
   - Settings pages: jump directly
   - Templates: Launch

5. **`## Search highlights`** — matching characters are highlighted in the result. Searches are fuzzy; `cntlog` matches "container logs".

6. **`## Customize the shortcut`** — one sentence + link to `/en/docs/reference/settings#shortcut-settings`.

7. **`## Tips`**
   - `<Callout type="info">`: "Spotlight runs in its own Tauri window so it can stay instant. Closing it does not close the main Dockerman window, and vice versa."

#### Remote Hosts body

1. **Lead** — "Dockerman connects to remote Docker daemons by forwarding their Unix socket over SSH. Once a host is configured, every feature (containers, images, logs, terminals) works exactly like on localhost."

2. **`## Add a remote host`**
   - `<Steps>` with 4 `<Step>`s:
     - `### Open Hosts` — "From the tray menu or `/hosts`."
     - `### Click Add Host` — "A dialog asks for connection details."
     - `### Fill in the SSH details` — "Host, port (default 22), user, authentication method."
     - `### Test and save` — "Dockerman opens a test tunnel and runs a Docker ping."

3. **`## Key-based vs password authentication`**
   - `<Tabs items={['SSH key', 'Password']}>`:
     - **SSH key:** paste the private key or point at a file path. `<Callout type="warn">`: "Private keys must be mode 600 on disk; OpenSSH refuses keys with looser permissions."
     - **Password:** stored locally, encrypted at rest. Recommended only for short-lived or shared-laptop scenarios.

4. **`## Switch between hosts`** — one paragraph: the Host Switcher in the top bar lists localhost and every configured remote host. Switching reloads all data for the new host.

5. **`## Auto reconnect`** — one paragraph: Dockerman watches SSH tunnel health and reconnects on transient failures. A banner warns when a host has been offline for > 30 seconds.

6. **`## How the SSH tunnel works`** — one paragraph: Dockerman opens an SSH session and forwards a local unix socket to the remote `/var/run/docker.sock` (or the socket path you configured). All Docker API calls flow through this tunnel, so nothing leaves the SSH channel.

7. **`## Security notes`**
   - `<Callout type="warn">`: "Only configure remote hosts you trust on trusted networks. Private keys and passwords are stored locally in Dockerman's app data directory. Treat that directory as sensitive."

**Components (both pages):** `Callout`, `Steps`, `Step`, `Tabs`, `Tab`.

**Cross-links:** `/en/docs/reference/settings#shortcut-settings`.

- [ ] **Step 1: Write both MDX files**
- [ ] **Step 2: HTTP 200 checks**

```bash
for path in advanced/spotlight advanced/remote-hosts; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/en/docs/$path")
  echo "$code $path"
done
```

- [ ] **Step 3: Commit**

```bash
git add apps/landing/content/docs/en/advanced/
git commit -m "docs(landing): write en/advanced (spotlight + remote hosts)"
```

---

## Phase 5 — Platform section

### Task 5.1: Write `platform/windows.mdx`

**File:** `apps/landing/content/docs/en/platform/windows.mdx`

**Body structure:**

1. **Lead** — "Windows has two supported Docker paths: Docker Desktop, or the built-in WSL2 Docker Engine that Dockerman sets up for you. This page covers both."

2. **`## Quick comparison`** — a short Markdown table:

   | | Docker Desktop | WSL2 Docker Engine (bundled) |
   |---|---|---|
   | Requires a Docker subscription | Yes for most businesses | No |
   | Disk footprint | Large | Small (Alpine WSL distro) |
   | Resource usage | High (VM + services) | Low (no full VM) |
   | Setup effort | Standard installer | Automated by Dockerman |
   | Supported by Dockerman | Full | Full (Added in v4.3.0) |

3. **`## Option A: Docker Desktop`**
   - `<Steps>` with 3 `<Step>`s:
     - `### Install Docker Desktop` — "Download from docker.com and run the installer."
     - `### Ensure it's running` — "The whale icon in the tray should show Running."
     - `### Launch Dockerman` — "Dockerman auto-detects Docker Desktop and connects."

4. **`## Option B: WSL2 Docker Engine (no Desktop)`**
   - `Added in v4.3.0.`
   - Intro paragraph: Dockerman bundles everything you need — no Docker Desktop subscription, no manual WSL tinkering.

   - **`### Prerequisites`**
     - Bullet list:
       - Windows 10 version 2004 or later, or Windows 11.
       - WSL2 installed (`wsl --install` from an elevated PowerShell, reboot if required).
       - Virtualization enabled in BIOS/UEFI.

   - **`### Setup Wizard`**
     - Intro paragraph: the wizard runs automatically on first launch if Docker Desktop is not detected.
     - `<Steps>` with 4 `<Step>`s:
       - `### Choose WSL2 Docker Engine` — "The welcome dialog offers Docker Desktop or WSL2 Docker Engine."
       - `### Import Alpine` — "Dockerman imports a minimal Alpine WSL2 distribution."
       - `### Install Docker inside Alpine` — "Dockerman installs Docker and configures the daemon to start on login."
       - `### Verify` — "A final health check runs `docker version` and connects."
     - `<Callout type="warn">`: "The entire setup takes about 3–5 minutes. Do not close Dockerman while the wizard is running."
     - `{/* TODO(screenshot): windows/setup-wizard - WSL2 Setup Wizard welcome step */}`

   - **`### What the wizard does`**
     - Paragraph: the wizard creates files and services inside the Alpine distro.
     - `<Files>` block:
       ```mdx
       <Files>
         <Folder name="(Alpine WSL2 distro)" defaultOpen>
           <File name="/etc/docker/daemon.json" />
           <Folder name="/etc/init.d">
             <File name="docker" />
           </Folder>
           <Folder name="/var/lib/docker">
             <File name="(Docker data root)" />
           </Folder>
         </Folder>
       </Files>
       ```

   - **`### Edit daemon.json`**
     - Paragraph: Settings → Daemon config panel lets you edit `/etc/docker/daemon.json` in two modes — a form view for common fields (registry mirrors, insecure registries, log driver) and a raw JSON view for everything else.
     - Saving restarts Docker inside the Alpine distro.

   - **`### Recovery from daemon crash`**
     - Paragraph: Dockerman watches the daemon process. If it crashes, Dockerman shows a banner with a Restart button and streams the crash logs for diagnosis.

   - **`### Switch between Docker Desktop and WSL2 Engine`**
     - `<Steps>` with 3 `<Step>`s:
       - `### Open Settings → Docker settings`
       - `### Pick the other backend`
       - `### Reconnect`

5. **`## Resource monitoring for WSL2`** — one paragraph: the WSL2 Engine appears as a normal Docker daemon, so the usual `[Stats](/en/docs/docker/stats)` page monitors it. WSL2's own memory ballooning is visible from Windows Task Manager.

6. **`## Troubleshooting`**
   - `<Accordions>` with 4 `<Accordion title="...">`:
     - **"WSL2 is not installed"** — walk through `wsl --install`, reboot, verify with `wsl --status`.
     - **"Virtualization is disabled"** — how to enable in BIOS (Intel VT-x / AMD-V) and re-check from Task Manager → Performance → CPU.
     - **"The Alpine import failed"** — common causes: not enough disk space in the WSL VHD, stale Docker processes from a previous attempt. Point at App Log for diagnostics.
     - **"Docker daemon won't start after reboot"** — link to the Recovery from daemon crash section and the Edit daemon.json section.

**Components:** `Tabs` (optional at top), `Steps`, `Step`, `Callout`, `Files`, `Folder`, `File`, `Accordions`, `Accordion`.

**Screenshot TODOs:**
- `{/* TODO(screenshot): windows/setup-wizard - WSL2 Setup Wizard welcome step */}`

**Cross-links:** `/en/docs/docker/stats`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/platform/windows with wsl2 setup wizard`

---

### Task 5.2: Write `platform/macos.mdx`

**File:** `apps/landing/content/docs/en/platform/macos.mdx`

**Body structure:**

1. **Lead** — "Dockerman on macOS ships as a signed, notarized DMG with Intel, Apple Silicon, and Universal builds."

2. **`## Install`**
   - `<Steps>` with 3 `<Step>`s:
     - `### Download the DMG` — Intel vs Apple Silicon vs Universal; pick Universal if unsure.
     - `### Open and drag to Applications`
     - `### First launch Gatekeeper prompt` — right-click → Open to bypass if needed.

3. **`## Docker backend`**
   - One paragraph: the supported backend is Docker Desktop. Once Docker Desktop is running, Dockerman auto-connects.
   - `<Callout type="info">`: "Any Docker-compatible backend that exposes a standard Unix socket at `/var/run/docker.sock` or `~/.docker/run/docker.sock` (for example Colima or OrbStack) should also work. Configure the socket path in Settings → Docker settings if auto-detection misses it."

4. **`## Menu bar and tray`** — one paragraph: Dockerman adds a menu bar icon (configurable in Settings → Tray settings) with quick actions and a list of recent containers.

5. **`## Apple Silicon notes`** — one paragraph: on M1/M2/M3, pay attention to image platforms. Many public images default to amd64; Dockerman's image list flags non-native images. Consider pulling the `arm64` variant explicitly or using `--platform=linux/arm64` when running.

6. **`## Troubleshooting`**
   - Bullet list:
     - "Socket not found" — Docker Desktop not running, or you're using a custom socket path (fix in Settings → Docker settings).
     - "Gatekeeper blocks the app" — right-click the app → Open on first launch.
     - "Keychain prompts repeatedly" — Dockerman stores a per-host credential in Keychain; allow Always to stop the prompts.

**Components:** `Steps`, `Step`, `Callout`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/platform/macos`

---

### Task 5.3: Write `platform/linux.mdx`

**File:** `apps/landing/content/docs/en/platform/linux.mdx`

**Body structure:**

1. **Lead** — "Dockerman ships as a `.deb` for Debian/Ubuntu, a `.rpm` for Fedora/RHEL, and an AppImage for every other distribution."

2. **`## Install`**
   - `<Tabs items={['.deb (Debian/Ubuntu)', '.rpm (Fedora/RHEL)', 'AppImage']}>`:
     - **.deb tab:**
       ```bash
       sudo dpkg -i dockerman_*_amd64.deb
       sudo apt-get install -f
       ```
     - **.rpm tab:**
       ```bash
       sudo rpm -i dockerman-*.x86_64.rpm
       # or
       sudo dnf install dockerman-*.x86_64.rpm
       ```
     - **AppImage tab:**
       ```bash
       chmod +x Dockerman-*.AppImage
       ./Dockerman-*.AppImage
       ```
       One sentence: "Integrate into your desktop environment with AppImageLauncher or `--install` if supported."

3. **`## Set up Docker Engine`** — one paragraph pointing at the official Docker Engine install instructions for your distro, plus a sentence saying that Dockerman works with any Engine 20.10+.

4. **`## Permissions`**
   - `<Steps>` with 3 `<Step>`s:
     - `### Add your user to the docker group`
       ```bash
       sudo usermod -aG docker $USER
       ```
     - `### Log out and back in` — "Group changes only apply to new login sessions."
     - `### Verify` — `docker ps` should run without sudo.
   - `<Callout type="warn">`: "Being in the docker group is equivalent to root on the host. Consider rootless Docker if that's a concern."

5. **`## Wayland vs X11`** — one paragraph: Dockerman works on both. On Wayland, global shortcuts use the xdg-desktop-portal Shortcuts API (requires portal 1.17+). On X11, global shortcuts use traditional keygrab.

6. **`## Freedesktop integration`** — one paragraph: a `.desktop` file is installed so Dockerman appears in the application menu. The system tray icon uses the StatusNotifierItem specification (supported by KDE, GNOME with extensions, XFCE, MATE).

7. **`## Troubleshooting`**
   - `<Accordions>` with 3 `<Accordion title="...">`:
     - **"docker: command not found"** — Docker Engine isn't installed; follow the upstream install instructions.
     - **"Permission denied on /var/run/docker.sock"** — user isn't in the docker group (see above), or you haven't logged out and back in since adding yourself.
     - **"Tray icon missing"** — install a StatusNotifierItem extension for your desktop environment (GNOME: AppIndicator and KStatusNotifierItem Support).

**Components:** `Tabs`, `Tab`, `Steps`, `Step`, `Callout`, `Accordions`, `Accordion`.

- [ ] **Step 1:** Write MDX
- [ ] **Step 2:** HTTP 200 check
- [ ] **Step 3:** Commit — `docs(landing): write en/platform/linux`

---

## Phase 6 — Reference section

### Task 6.1: Write `reference/keyboard-shortcuts.mdx` and `reference/settings.mdx`

Two reference pages, one commit.

**Files:**
- Modify: `apps/landing/content/docs/en/reference/keyboard-shortcuts.mdx`
- Modify: `apps/landing/content/docs/en/reference/settings.mdx`

#### Keyboard Shortcuts body

1. **Lead** — one sentence: every keyboard shortcut in Dockerman, grouped by surface. Most are customizable in `[Settings → Shortcut settings](/en/docs/reference/settings#shortcut-settings)`.

2. **`## Global`**

   | Shortcut | Action |
   |---|---|
   | Cmd/Ctrl + K | Open Spotlight |
   | Cmd/Ctrl + , | Open Settings |
   | Cmd/Ctrl + Shift + L | Toggle theme |
   | Cmd/Ctrl + Shift + H | Open Host switcher |

3. **`## Navigation`**

   | Shortcut | Action |
   |---|---|
   | ↑ / ↓ | Move selection in the current list |
   | Enter | Open the selected row |
   | Cmd/Ctrl + Click | Toggle multi-select |
   | Shift + Click | Select a range |

4. **`## Container actions`**

   | Shortcut | Action |
   |---|---|
   | S | Start |
   | X | Stop |
   | R | Restart |
   | P | Pause / Unpause |
   | L | Logs |
   | T | Terminal |
   | I | Inspect |
   | Delete | Remove (after confirmation) |

5. **`## Log viewer`**

   | Shortcut | Action |
   |---|---|
   | / | Open search |
   | n | Next match |
   | N (Shift+n) | Previous match |
   | g | Jump to the start |
   | G (Shift+g) | Jump to the latest line |
   | P | Previous match (alias for Shift+n) |
   | Esc | Close search / clear highlights |

6. **`## Terminal`**

   | Shortcut | Action |
   |---|---|
   | Ctrl/Cmd + Shift + C | Copy selection |
   | Ctrl/Cmd + Shift + V | Paste |
   | Ctrl/Cmd + Shift + K | Clear the terminal |
   | Ctrl + C | Send SIGINT to the process |
   | Ctrl + D | Send EOF |

7. **`## Kubernetes`**

   | Shortcut | Action |
   |---|---|
   | N | Cycle namespace |
   | D | Debug (on a Pod) |
   | Y | Edit YAML |

8. **`## Customize`** — one paragraph + link to `/en/docs/reference/settings#shortcut-settings`.

#### Settings body

1. **Lead** — "Reference for every settings page. Each section links back to the features it controls."

2. **`## Docker settings`** — one paragraph: connection type (local socket, TCP, SSH), socket path, and connection status. Cross-link to `[Remote Hosts](/en/docs/advanced/remote-hosts)` for SSH hosts.

3. **`## Daemon config panel`** — one paragraph: edit `daemon.json` from a form view or a raw JSON view. Registry mirrors are especially useful for WSL2. Cross-link to `[Windows platform](/en/docs/platform/windows#edit-daemonjson)` for the WSL2 use case.

4. **`## Kubernetes DNS settings`** — one paragraph: enable automatic DNS for port forwards. Cross-link to `[Port Forward & DNS](/en/docs/kubernetes/port-forward#automatic-dns)`.

5. **`## Kubernetes port forward settings`** — one paragraph: default local port range, retry behavior, and auto-reconnect.

6. **`## License settings`** — one paragraph: activate, view, reset. Cross-link to `[Licensing](/en/docs/reference/licensing)`.

7. **`## Notification settings`** — one paragraph: toggle categories (container lifecycle events, Trivy scan completion, license status, update available) and delivery (in-app banner, system notification).

8. **`## Privacy settings`** — one paragraph: product analytics and crash reporting toggles. Both are opt-in by default.

9. **`## Shortcut settings`** — one paragraph: every shortcut listed in `[Keyboard Shortcuts](/en/docs/reference/keyboard-shortcuts)` can be customized or unbound.

10. **`## Terminal settings`** — one paragraph: font family, font size, cursor style (block, underline, bar), theme (six built-ins), and default shell preference (applied to new terminals).

11. **`## Tray settings`** — one paragraph: show/hide tray icon, minimize-to-tray on close, quick-action list in the tray menu.

12. **`## Trivy settings`** — one paragraph: Trivy binary path (leave empty for Dockerman-managed), vulnerability database update interval, and severity filters applied by default. Cross-link to `[Scan with Trivy](/en/docs/docker/images#scan-with-trivy)`.

**Components:** plain tables; `Callout` where notes are warnings.

**Cross-links:** every "Cross-link to X" above.

- [ ] **Step 1:** Write both MDX files
- [ ] **Step 2:** HTTP 200 checks for both paths
- [ ] **Step 3:** Commit

```bash
git add apps/landing/content/docs/en/reference/keyboard-shortcuts.mdx apps/landing/content/docs/en/reference/settings.mdx
git commit -m "docs(landing): write en/reference keyboard shortcuts and settings"
```

---

### Task 6.2: Write `reference/licensing.mdx` and `reference/troubleshooting.mdx`

Two reference pages, one commit.

**Files:**
- Modify: `apps/landing/content/docs/en/reference/licensing.mdx`
- Modify: `apps/landing/content/docs/en/reference/troubleshooting.mdx`

#### Licensing body

1. **Lead** — "Activate, manage, and reset your Dockerman license."

2. **`## Overview`** — one paragraph: Dockerman's core is free. Some advanced features may require a license; the app prompts you at the point of use if a license is needed. Do not enumerate which features are gated here — the prompts are the source of truth.

3. **`## Activate`**
   - `<Steps>` with 3 `<Step>`s:
     - `### Open Settings → License` — "Paste your license key."
     - `### Online verification` — "Dockerman contacts the license server to verify the key."
     - `### Confirmation` — "Status turns to Active. The license key and device identifier are stored locally."

4. **`## Manage devices`** — one paragraph: each license is bound to a device identifier. If you lose a machine or need to move your license, use the License Self-Service portal to reset the binding before activating on a new machine.

5. **`## Offline verification`** — one paragraph: after activation, license validity is verified locally using an Ed25519 signature on every launch. No network calls are required for day-to-day use.

6. **`## Troubleshooting`**
   - `<Accordions>` with 3 `<Accordion title="...">`:
     - **"Activation fails with network error"** — check firewall / proxy; link to the License Self-Service portal.
     - **"Device limit reached"** — reset via self-service.
     - **"License shows as invalid after an update"** — try reactivating; if the issue persists, contact support with the App Log.

**Components:** `Steps`, `Step`, `Accordions`, `Accordion`, `Callout`.

#### Troubleshooting body

1. **Lead** — "Common issues and the quickest way to resolve each one."

2. **`## Can't connect to Docker daemon`**
   - Intro paragraph.
   - `<Tabs items={['macOS', 'Windows', 'Linux']}>`:
     - **macOS:** Docker Desktop not running; pick the correct socket path in Settings → Docker settings.
     - **Windows:** choose between Docker Desktop and WSL2 Engine; link to `[Windows platform](/en/docs/platform/windows)`.
     - **Linux:** user not in docker group; link to `[Linux platform](/en/docs/platform/linux#permissions)`.

3. **`## Permission errors on Linux`** — paragraph + link to Linux permissions section.

4. **`## WSL2 Setup Wizard fails`** — paragraph + link to `[Windows platform WSL2 troubleshooting](/en/docs/platform/windows#troubleshooting)`.

5. **`## SSH host connection fails`** — paragraph + link to `[Remote Hosts](/en/docs/advanced/remote-hosts)`. Common causes: wrong port, key file permissions, firewall blocking outbound 22.

6. **`## Performance issues`** — bullet list:
   - High CPU when idle — usually caused by a container streaming large volumes of logs; pause Logs tabs you're not actively watching.
   - Long list load times with 500+ containers — filter by status or Compose project to reduce render work.
   - Sluggish stats — reduce the time range to 1h or 3h.

7. **`## Kubernetes: k3d fails to start`**
   - `<Accordions>` with 3 `<Accordion title="...">`:
     - **"Port 6443 already in use"** — stop the other Kubernetes tool; or configure k3d to use a different port.
     - **"vm.max_map_count too low (Linux)"** — `sudo sysctl -w vm.max_map_count=262144` and persist in `/etc/sysctl.conf`.
     - **"k3d binary download failed"** — check outbound HTTPS; manually place the binary at the path shown in the error.

8. **`## Kubernetes: kubeconfig import fails`**
   - Bullet list:
     - Wrong context name — pick an explicit context when importing.
     - Expired credentials — refresh the token or certificate and re-export the kubeconfig.
     - Proxy / firewall blocking the API server — verify `kubectl get ns` from the command line first.

9. **`## Collecting logs`** — one paragraph: the App Log page is your first stop for diagnostics. Export from App Log → Export when opening an issue.

10. **`## Getting help`** — one paragraph: file issues on the Dockerman GitHub repository. Attach the App Log export and the Dockerman version (visible in Settings → About).

**Components:** `Accordions`, `Accordion`, `Tabs`, `Tab`, `Callout`.

**Cross-links:** multiple, as listed in each section.

- [ ] **Step 1:** Write both MDX files
- [ ] **Step 2:** HTTP 200 checks
- [ ] **Step 3:** Commit

```bash
git add apps/landing/content/docs/en/reference/licensing.mdx apps/landing/content/docs/en/reference/troubleshooting.mdx
git commit -m "docs(landing): write en/reference licensing and troubleshooting"
```

---

## Phase 7 — Final verification

### Task 7.1: Full build, smoke test, and dead-link check

**Files:** none modified.

- [ ] **Step 1: Stop the dev server**

The dev server started in Task 0.6 is detached via `nohup`+`disown`, so `jobs` will not show it. Kill it by port instead:

```bash
lsof -ti:3000 | xargs -r kill 2>/dev/null || true
sleep 1
# Verify it's gone
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/docs || echo "dev server stopped"
```

Expected: `000` (connection refused) or the "dev server stopped" message.

- [ ] **Step 2: Run the full production build**

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/minnetonka-v1/apps/landing
bun run build
```

Expected: build succeeds with no errors. Record any warnings and confirm none are new compared to the Task 0.1 baseline.

- [ ] **Step 3: Start the production server**

```bash
lsof -ti:3000 | xargs -r kill 2>/dev/null || true
nohup bun run start > /tmp/landing-prod.log 2>&1 &
disown
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/docs
```

Expected: `200`. If not, check `/tmp/landing-prod.log`.

- [ ] **Step 4: Smoke test every English page**

Run the same loop as Task 0.6 Step 2 against the production server. Every page must return `200`.

- [ ] **Step 5: Smoke test every stub page across three locales**

```bash
for locale in zh ja es; do
  for path in \
    "" \
    "getting-started" \
    "docker/containers" "docker/images" "docker/networks" "docker/volumes" \
    "docker/files" "docker/compose" "docker/stats" "docker/events" "docker/logs" "docker/terminal" \
    "kubernetes/overview" "kubernetes/cluster" "kubernetes/workloads" "kubernetes/networking" \
    "kubernetes/config-storage" "kubernetes/rbac" "kubernetes/custom-resources" "kubernetes/helm" \
    "kubernetes/port-forward" "kubernetes/debug" "kubernetes/logs-terminal" \
    "advanced/spotlight" "advanced/remote-hosts" \
    "platform/windows" "platform/macos" "platform/linux" \
    "reference/keyboard-shortcuts" "reference/settings" "reference/licensing" "reference/troubleshooting"
  do
    full="/$locale/docs${path:+/$path}"
    code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$full")
    echo "$code $full"
  done
done
```

Expected: every line starts with `200`. Any non-200 is a structural failure — the stub script or a meta.json is wrong.

- [ ] **Step 6: Verify the language switcher**

In a browser, visit `http://localhost:3000/en/docs/kubernetes/debug`. Use the language switcher to cycle through en → zh → ja → es → en. At every stop, the URL must resolve (no 404) and the "not yet translated" Callout appears on the stub locales.

- [ ] **Step 7: Collect the screenshot TODO list**

```bash
grep -rn "TODO(screenshot)" content/docs/en/ > /tmp/screenshot-todos.txt
wc -l /tmp/screenshot-todos.txt
```

Expected: a file with one line per `{/* TODO(screenshot): ... */}` comment. Include this file verbatim in the PR description under a "Screenshot backlog" heading.

- [ ] **Step 8: Spot-check one page per section in a browser**

In a browser, visit and visually verify that the following pages render correctly (all components, no broken elements):

- `/en/docs` — Cards
- `/en/docs/getting-started` — Tabs + Steps
- `/en/docs/docker/containers` — Steps + Files + Callout
- `/en/docs/kubernetes/debug` — Accordions
- `/en/docs/platform/windows` — Tabs + Steps + Files + Accordions
- `/en/docs/reference/troubleshooting` — Accordions + Tabs

- [ ] **Step 9: Kill the production server**

```bash
lsof -ti:3000 | xargs -r kill 2>/dev/null || true
```

- [ ] **Step 10: Final summary commit (optional, only if verification uncovered small fixes)**

If Step 2–8 uncovered small issues that got fixed during verification, commit them:

```bash
git add -u
git commit -m "docs(landing): fix issues found in final verification"
```

If no fixes were needed, skip this commit. The plan is done when `bun run build` is clean, all 128 doc pages (32 en + 96 stubs) return 200, and the screenshot backlog is captured.

---

## Summary of commits produced by this plan

Expected commit count when the plan finishes cleanly: **~35 commits** (one per non-verification task). The commits form a linear narrative from scaffolding → English content → final verification, and any individual commit can be reverted without breaking the rest of the docs (though the early foundation commits should not be reverted in isolation since later ones depend on them).

## Files produced or modified (final tally)

- `apps/landing/mdx-components.tsx` (modified) — Task 0.2
- `apps/landing/scripts/generate-docs-stubs.ts` (created) — Task 0.5
- 32 English MDX files (created or rewritten) under `content/docs/en/`
- 5 English `meta.json` files (written) + 1 verified unchanged (`reference/meta.json`)
- 9 English MDX files deleted + 1 directory (`en/guides/`) removed
- 96 stub MDX files under `content/docs/{zh,ja,es}/` (32 per locale)
- 15 stub `meta.json` files (5 per locale)

Total file changes: ~158 files + 3 new directories + 1 deleted directory.
