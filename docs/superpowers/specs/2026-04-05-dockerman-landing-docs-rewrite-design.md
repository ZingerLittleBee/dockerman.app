# Dockerman Landing Docs Rewrite — Design Spec

- **Date**: 2026-04-05
- **Scope**: `apps/landing/content/docs/**` + `apps/landing/mdx-components.tsx`
- **Source of truth for product**: `/Users/zingerbee/Documents/app.dockerman` (v4.8.0, v5.0.0 in development)
- **Owner**: @zingerbee

## 1. Background and motivation

`apps/landing` ships a Fumadocs 16.6.7 documentation site covering Dockerman. The current docs (20 MDX per locale × 4 locales = 80 files) only cover the Docker side of the product at a surface level and stop at v4.2 functionality. Since then, several large feature areas have shipped without doc coverage:

- **Kubernetes support (Phase 1 MVP)** — cluster management, workloads, networking, config/storage, RBAC, CRDs, Helm, port-forward, DNS, debug assistant, pod logs/terminal
- **v4.4 file preview / edit / multi-select** in volume and container browsers
- **v4.5 Stats page redesign** — ring gauges + sparklines + time range selector
- **v4.6 image features** — Docker Hub browser, Trivy scanner, image push, commit, clone
- **v4.6–v4.7 container features** — pause/resume, container port search
- **v4.8 headline features** — container backup/restore, K8s DNS settings, K8s Debug Assistant, CRD management

The current docs are also written in plain Markdown and do not use Fumadocs UI components (Callouts, Steps, Tabs, Cards, Accordions, Files, TypeTable). The sidebar groups everything under a flat `guides/` heading, which does not scale to a dual Docker + Kubernetes product.

This spec proposes a **full rewrite of the English documentation**, a new top-level information architecture, adoption of Fumadocs UI components throughout, and a stub strategy for `zh`/`ja`/`es` to keep the sidebar and language switcher aligned while translations are deferred.

## 2. Decisions

| Decision | Value | Rationale |
|---|---|---|
| Scope | Full audit and rewrite of the English docs | Current docs lag the product by ~6 minor versions; incremental patching would leave inconsistent mental models |
| Language strategy | English only in this pass; `zh`/`ja`/`es` get structural stubs | Translation cost ×4 is too high for one iteration; stubs keep the sidebar in sync |
| Top-level structure | Docker and Kubernetes as parallel top-level sections | The product has two equal pillars; hiding K8s under a Docker sub-directory misrepresents scope |
| Style | Use the full Fumadocs UI component set | Callouts, Steps, Tabs, Cards, Accordions, Files, TypeTable all improve scanability; a one-time upgrade is cheaper than organic drift |
| Old locales (zh/ja/es) | "Coming soon" stub pages mirroring the en structure | Prevents 404s on language switch; preserves sidebar symmetry for Fumadocs `parser: 'dir'` |
| Screenshots | Inline `{/* TODO(screenshot): ... */}` comments in round one | Avoids build failures while leaving a tracked backlog for a screenshot pass |
| Backup and restore placement | A section inside `docker/containers.mdx` (not a separate page) | Single source of truth; cross-link from elsewhere if needed |
| Component import | Globally register in `mdx-components.tsx` | Cheaper than 31× per-file imports; mirrors the Fumadocs reference setup |
| Version markers | Plain "Added in v4.x.x" sentence under the `##` heading | Low-noise; no new component required |
| Deletion safety | First round keeps old `zh/ja/es/guides/` in place; a second round deletes them once the new structure is verified | Risk-averse, reversible |

## 3. Information architecture

The English sidebar after the rewrite (32 MDX files):

```
Dockerman Docs                              content/docs/en/meta.json
├── Welcome                                 index.mdx
├── Getting Started                         getting-started.mdx
├── ─── separator ───
├── Docker                                  docker/meta.json   (defaultOpen: true)
│   ├── Containers                          docker/containers.mdx
│   ├── Images                              docker/images.mdx
│   ├── Networks                            docker/networks.mdx
│   ├── Volumes                             docker/volumes.mdx
│   ├── Files                               docker/files.mdx
│   ├── Compose & Templates                 docker/compose.mdx
│   ├── Stats                               docker/stats.mdx
│   ├── Events                              docker/events.mdx
│   ├── Logs                                docker/logs.mdx
│   └── Terminal                            docker/terminal.mdx
├── Kubernetes                              kubernetes/meta.json   (defaultOpen: true)
│   ├── Overview                            kubernetes/overview.mdx
│   ├── Cluster                             kubernetes/cluster.mdx
│   ├── Workloads                           kubernetes/workloads.mdx
│   ├── Networking                          kubernetes/networking.mdx
│   ├── Config & Storage                    kubernetes/config-storage.mdx
│   ├── RBAC                                kubernetes/rbac.mdx
│   ├── Custom Resources                    kubernetes/custom-resources.mdx
│   ├── Helm                                kubernetes/helm.mdx
│   ├── Port Forward & DNS                  kubernetes/port-forward.mdx
│   ├── Debug Assistant                     kubernetes/debug.mdx
│   └── Pod Logs & Terminal                 kubernetes/logs-terminal.mdx
├── ─── separator ───
├── Advanced                                advanced/meta.json   (defaultOpen: false)
│   ├── Spotlight                           advanced/spotlight.mdx
│   └── Remote Hosts (SSH)                  advanced/remote-hosts.mdx
├── Platform                                platform/meta.json   (defaultOpen: true)
│   ├── Windows                             platform/windows.mdx   (WSL2 Setup Wizard inside)
│   ├── macOS                               platform/macos.mdx
│   └── Linux                               platform/linux.mdx
└── Reference                               reference/meta.json   (defaultOpen: true)
    ├── Keyboard Shortcuts                  reference/keyboard-shortcuts.mdx
    ├── Settings                            reference/settings.mdx
    ├── Licensing                           reference/licensing.mdx
    └── Troubleshooting                     reference/troubleshooting.mdx
```

### Root `meta.json`

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

### Section `meta.json` templates

```json
// docker/meta.json
{
  "title": "Docker",
  "pages": [
    "containers", "images", "networks", "volumes", "files",
    "compose", "stats", "events", "logs", "terminal"
  ],
  "defaultOpen": true
}

// kubernetes/meta.json
{
  "title": "Kubernetes",
  "pages": [
    "overview", "cluster", "workloads", "networking",
    "config-storage", "rbac", "custom-resources", "helm",
    "port-forward", "debug", "logs-terminal"
  ],
  "defaultOpen": true
}

// advanced/meta.json
{
  "title": "Advanced",
  "pages": ["spotlight", "remote-hosts"],
  "defaultOpen": false
}

// platform/meta.json
{
  "title": "Platform",
  "pages": ["windows", "macos", "linux"],
  "defaultOpen": true
}

// reference/meta.json (unchanged — matches existing file exactly)
{
  "title": "Reference",
  "pages": ["keyboard-shortcuts", "settings", "licensing", "troubleshooting"],
  "defaultOpen": true
}
```

## 4. Page-by-page outlines

Every page declares `title` (2–30 chars) and `description` (80–140 chars). Lead paragraph ≤ 3 sentences. Sections below list the `##` headings and the Fumadocs UI components that page is expected to use.

### 4.1 Root pages

#### `index.mdx` — Welcome
- **description**: A fast, cross-platform UI for Docker and Kubernetes built with Tauri and Rust.
- Sections: lead → `## What Dockerman covers` → `## Key capabilities` (Cards of 6 highlights)
- Components: `Cards`, `Card`

#### `getting-started.mdx` — Getting Started
- **description**: Install Dockerman and connect to your first Docker daemon in minutes.
- Sections: lead → `## Prerequisites` (Callout) → `## Install` (Tabs: macOS/Windows/Linux, each with Steps) → `## First launch` (Steps: Connect Dialog → Pick Docker source → Data load → Dashboard) → `## Next steps` (Cards) → `## System requirements`
- Components: `Callout`, `Tabs`, `Tab`, `Steps`, `Step`, `Cards`, `Card`

### 4.2 Docker section (10 pages)

#### `docker/containers.mdx` — Containers
- **description**: Create, inspect, and manage Docker containers; clone, commit, pause, and back up with a click.
- Sections:
  - `## The container list` — list fields, search, filter, multi-select (Ctrl/Cmd+Click)
  - `## Lifecycle actions` — start / stop / restart / pause / unpause / remove (Callout: pause vs stop)
  - `## Create a container` — Tabs: Form / From docker run / Clone existing / From template; Form tab uses Steps for field groups
  - `## Inspect and update` — JSON inspect, ContainerUpdateDialog scope
  - `## Commit a running container` (Added in v4.6.0) — Steps
  - `## Clone a container` (Added in v4.6.0)
  - `## Backup and restore` (Added in v4.8.0)
    - `### What a backup contains` — config + filesystem tar.gz + volume tar.gz (Files tree)
    - `### Create a backup` — Steps
    - `### Restore from a backup` — Steps; Callout for name conflicts
    - `### Tips` — size estimates, cross-host migration
  - `## Batch operations`
  - `## Keyboard shortcuts` — link to `reference/keyboard-shortcuts`
- Components: `Callout`, `Steps`, `Step`, `Tabs`, `Tab`, `Files`, `File`, `Folder`

#### `docker/images.mdx` — Images
- **description**: Pull, build, push, analyze, and scan Docker images with a built-in Docker Hub browser and Trivy scanner.
- Sections:
  - `## The image list` — All / Dangling tabs, sort, filter
  - `## Pull an image` — combobox search suggestions (Added in v4.7.0)
  - `## Browse Docker Hub` (Added in v4.6.0) — Steps
  - `## Build from a Dockerfile` — Steps, Callout on BuildKit
  - `## Push to a registry` (Added in v4.6.0) — Steps, Callout on private registry support
  - `## Analyze image size` — `/image/size` layer tree
  - `## Tag operations`
  - `## Scan with Trivy` (Added in v4.6.0) — install / run / read the report, Callout on first-download size
  - `## Cleanup` — dangling and batch delete
- Components: `Callout`, `Steps`, `Tabs`

#### `docker/networks.mdx` — Networks
- **description**: Create and manage Docker networks, connect containers, and search containers by port.
- Sections: `## The network list` → `## Create a network` (Steps, IPAM) → `## Connect and disconnect containers` → `## Search by port` (Added in v4.7.0, Steps) → `## Inspect a network` → `## Delete and prune` (Callout on built-in networks)
- Components: `Callout`, `Steps`

#### `docker/volumes.mdx` — Volumes
- **description**: Manage Docker volumes — create, inspect, and prune persistent storage.
- Sections: `## The volume list` → `## Create a volume` → `## Browse volume files` (brief, link to `docker/files`) → `## Inspect a volume` → `## Prune unused volumes` (Callout)
- Components: `Callout`, `Steps`

#### `docker/files.mdx` — Files
- **description**: Browse, preview, edit, upload, download, and delete files inside volumes and running containers.
- Sections:
  - Lead (covers both volume browser and container file browser)
  - `## Entry points` — Tabs: From a volume / From a container
  - `## Navigation` — tree, breadcrumb
  - `## Preview files` (Added in v4.4.0) — supported formats table (text / code / image / markdown / PDF / video / audio)
  - `## Edit files` (Added in v4.4.0) — Monaco / CodeMirror
  - `## Upload and download`
  - `## Delete files` (Added in v4.4.0)
  - `## Multi-select` (Added in v4.4.0) — Ctrl/Cmd+Click, Shift+Range; Callout on irreversible batch delete
- Components: `Tabs`, `Callout`, `Steps`, `Accordions`, `Accordion`

#### `docker/compose.mdx` — Compose & Templates
- **description**: Manage multi-container applications with Docker Compose and bootstrap projects from the built-in template library.
- Sections: `## Compose projects` → `## Start, stop, and remove a project` (Steps, Callout on volume cleanup) → `## Pull project images` → `## Edit compose.yaml` → `## View logs across services` → `## Templates library` (Steps) → `## Create your own template`
- Components: `Callout`, `Steps`, `Cards`

#### `docker/stats.mdx` — Stats
- **description**: Real-time resource dashboards with ring gauges and sparkline charts.
- Redesigned in v4.5.0.
- Sections: `## Overview dashboard` → `## Ring gauges` → `## Sparkline charts` (CPU / Memory / Network I/O / Disk I/O) → `## Time range selector` → `## Network interfaces and disk devices` → `## Tips`
- Components: `Callout`

#### `docker/events.mdx` — Events
- **description**: Stream, filter, persist, and export Docker daemon events.
- Sections: `## Opening the events stream` → `## Filter events` → `## Persist history` (JSONL) → `## Search and query` → `## Export` (JSON / CSV) → `## Troubleshooting with events`
- Components: `Callout`, `Steps`

#### `docker/logs.mdx` — Logs
- **description**: Stream and search container logs at scale with a virtualized list and power-user shortcuts.
- Sections: `## Live log streaming` → `## Virtualized list` → `## Search` → `## Power shortcuts` (table: P / G / g / /) → `## Timestamp formats` → `## Export logs`
- Components: `Callout`

#### `docker/terminal.mdx` — Terminal
- **description**: Attach an interactive shell to any running container with xterm.js.
- Sections: `## Open a terminal` → `## Choose a shell` (bash / sh / zsh fallback) → `## Copy, paste, and scroll` → `## Themes and fonts` → `## Limitations` (Callout)
- Components: `Callout`

### 4.3 Kubernetes section (11 pages)

#### `kubernetes/overview.mdx` — Overview
- **description**: Native Kubernetes support in Dockerman — Phase 1 MVP covering workloads, networking, config, storage, RBAC, CRDs, Helm, and debug.
- Sections: lead → `## Why Kubernetes in Dockerman` → `## What's included` (Cards: 8 entries) → `## Two ways to start` (Tabs: k3d / Existing cluster) → `## Namespaces` → `## What's not yet supported` (Callout)
- Components: `Cards`, `Tabs`, `Callout`

#### `kubernetes/cluster.mdx` — Cluster
- **description**: Start a local k3d cluster or import an existing kubeconfig.
- Sections: `## Start a local cluster with k3d` (Steps) → `## Import an existing cluster` (Steps) → `## Switch contexts` → `## Delete a cluster` (Callout: data loss) → `## Cluster version and status`
- Components: `Steps`, `Callout`, `Tabs`

#### `kubernetes/workloads.mdx` — Workloads
- **description**: Manage Pods, Deployments, StatefulSets, DaemonSets, Jobs, CronJobs, and ReplicaSets.
- Sections: `## Pods` → `## Deployments` (scale / rollout / rollback) → `## StatefulSets` → `## DaemonSets` → `## Jobs` → `## CronJobs` → `## ReplicaSets` (Callout) → `## Edit workloads with YAML`
- Components: `Callout`, `Steps`

#### `kubernetes/networking.mdx` — Networking
- **description**: Services, Ingresses, Endpoints, and NetworkPolicies.
- Sections: `## Services` → `## Ingresses` → `## Endpoints` → `## NetworkPolicies` (Callout: view-only in Phase 1)
- Components: `Callout`, `Tabs`

#### `kubernetes/config-storage.mdx` — Config & Storage
- **description**: ConfigMaps, Secrets, PersistentVolumeClaims, and StorageClasses.
- Sections: `## ConfigMaps` → `## Secrets` (Callout: plaintext reveal warning) → `## PersistentVolumeClaims` → `## StorageClasses`
- Components: `Callout`, `Tabs`

#### `kubernetes/rbac.mdx` — RBAC
- **description**: ServiceAccounts, Roles, ClusterRoles, RoleBindings, and ClusterRoleBindings.
- Sections: `## ServiceAccounts` → `## Roles and ClusterRoles` → `## RoleBindings and ClusterRoleBindings` → `## Troubleshooting permissions` (link to Debug Assistant)
- Components: `Callout`

#### `kubernetes/custom-resources.mdx` — Custom Resources
- **description**: Browse, view, and edit Custom Resource Definitions and their instances.
- Added in v4.8.0.
- Sections: `## List CRDs` → `## Browse resource instances` → `## View and edit YAML` → `## Limitations` (Callout)
- Components: `Callout`

#### `kubernetes/helm.mdx` — Helm
- **description**: Add chart repositories and manage Helm releases.
- Sections: `## Repositories` (Steps) → `## Browse charts` → `## Install a release` (Steps) → `## Upgrade and rollback` (Steps) → `## Uninstall a release` (Callout)
- Components: `Steps`, `Callout`

#### `kubernetes/port-forward.mdx` — Port Forward & DNS
- **description**: Forward local ports to Services or Pods, with optional automatic DNS registration.
- Sections:
  - Lead — the pairing of port forwarding and DNS
  - `## Forward a Service or Pod port` (Steps)
  - `## Manage active forwards`
  - `## Automatic DNS` (Added in v4.8.0) — Steps, Callout on root privileges
  - `## Manual DNS entries`
  - `## Troubleshooting`
- Components: `Steps`, `Callout`

#### `kubernetes/debug.mdx` — Debug Assistant
- **description**: Launch an ephemeral debug pod alongside a target pod to diagnose network and filesystem issues.
- Added in v4.8.0.
- Sections: `## When to use Debug Assistant` → `## Launch a debug pod` (Steps) → `## What's inside the debug pod` → `## Common debug workflows` (Accordions: DNS / traffic capture / volume inspection) → `## Cleanup`
- Components: `Steps`, `Accordions`, `Accordion`, `Callout`

#### `kubernetes/logs-terminal.mdx` — Pod Logs & Terminal
- **description**: Stream Pod logs and attach to any container with xterm.js.
- Sections: `## Stream pod logs` → `## Search shortcuts` (link to `docker/logs`) → `## Multi-container pods` → `## Pod terminal (exec)` (Steps) → `## Limitations`
- Components: `Steps`, `Callout`

### 4.4 Advanced section (2 pages)

#### `advanced/spotlight.mdx` — Spotlight
- **description**: Navigate Dockerman, run actions, and search resources with a single keystroke.
- Sections: lead → `## Open Spotlight` → `## Navigate to resources` → `## Quick actions` → `## Search highlights` → `## Customize the shortcut` → `## Tips` (Callout: independent window)
- Components: `Callout`

#### `advanced/remote-hosts.mdx` — Remote Hosts (SSH)
- **description**: Manage remote Docker hosts over SSH tunnels and switch between them from the host selector.
- Sections: lead → `## Add a remote host` (Steps) → `## Key-based vs password authentication` (Tabs, Callout on private key permissions) → `## Switch between hosts` → `## Auto reconnect` → `## How the SSH tunnel works` → `## Security notes` (Callout: trusted networks)
- Components: `Steps`, `Tabs`, `Callout`

### 4.5 Platform section (3 pages)

#### `platform/windows.mdx` — Windows
- **description**: Run Dockerman on Windows with either Docker Desktop or the built-in WSL2 Docker Engine.
- Sections:
  - Lead — comparison of the two paths
  - `## Option A: Docker Desktop`
  - `## Option B: WSL2 Docker Engine (no Desktop)` (Added in v4.3.0)
    - `### Prerequisites`
    - `### Setup Wizard` (Steps, Callout: do not interrupt)
    - `### What the wizard does` (Files tree)
    - `### Edit daemon.json`
    - `### Recovery from daemon crash`
    - `### Switch between Docker Desktop and WSL2 Engine` (Steps)
  - `## Resource monitoring for WSL2` (link to `docker/stats`)
  - `## Troubleshooting`
- Components: `Tabs`, `Steps`, `Callout`, `Files`

#### `platform/macos.mdx` — macOS
- **description**: Run Dockerman on macOS with Docker Desktop as the default backend.
- Sections: `## Install` (Intel / Apple Silicon / Universal DMG) → `## Docker backend` (Docker Desktop; Callout: any backend exposing a standard Docker socket should also work) → `## Menu bar and tray` → `## Apple Silicon notes` → `## Troubleshooting`
- Components: `Callout`

#### `platform/linux.mdx` — Linux
- **description**: Install Dockerman on Linux distributions and configure the Docker Engine.
- Sections: `## Install` (Tabs: .deb / .rpm / AppImage) → `## Set up Docker Engine` → `## Permissions` (docker group, rootless) → `## Wayland vs X11` → `## Freedesktop integration` → `## Troubleshooting`
- Components: `Tabs`, `Callout`, `Steps`

### 4.6 Reference section (4 pages)

#### `reference/keyboard-shortcuts.mdx` — Keyboard Shortcuts
- **description**: Every keyboard shortcut in Dockerman, grouped by surface.
- Sections: `## Global` → `## Navigation` → `## Container actions` → `## Log viewer` → `## Terminal` → `## Kubernetes` → `## Customize`
- Components: plain tables

#### `reference/settings.mdx` — Settings
- **description**: Reference for every settings page in Dockerman.
- Sections: `## Docker settings` → `## Daemon config panel` → `## Kubernetes DNS settings` → `## Kubernetes port forward settings` → `## License settings` → `## Notification settings` → `## Privacy settings` → `## Shortcut settings` → `## Terminal settings` → `## Tray settings` → `## Trivy settings`
- Components: `Callout`, `Tabs`

#### `reference/licensing.mdx` — Licensing
- **description**: Activate, manage, and reset your Dockerman license.
- Sections: `## Overview` (intentionally non-specific about gated features) → `## Activate` (Steps) → `## Manage devices` → `## Offline verification` → `## Troubleshooting`
- Components: `Steps`, `Callout`

#### `reference/troubleshooting.mdx` — Troubleshooting
- **description**: Common issues and how to resolve them.
- Sections: `## Can't connect to Docker daemon` (Tabs by platform) → `## Permission errors on Linux` → `## WSL2 Setup Wizard fails` → `## SSH host connection fails` → `## Performance issues` → `## Kubernetes: k3d fails to start` → `## Kubernetes: kubeconfig import fails` → `## Collecting logs` → `## Getting help`
- Components: `Accordions`, `Accordion`, `Callout`, `Tabs`

## 5. Style and component conventions

### 5.1 Frontmatter

```yaml
---
title: Containers                                           # 2–30 characters, shown in the sidebar
description: Create, inspect, and manage Docker containers  # 80–140 characters, SEO + page subtitle
---
```

- Every MDX file declares both `title` and `description`.
- Body content starts at `##`. Do not write `h1` — Fumadocs renders it from `title`.

### 5.2 Component registration

`apps/landing/mdx-components.tsx` is extended so that all Fumadocs UI components used across the docs are globally available. Only `useMDXComponents` (used by the changelog pages) is left untouched, preserving the `src/components/mdx.tsx` behavior for `<ChangelogEntry>` etc.

```tsx
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { Callout } from 'fumadocs-ui/components/callout'
import { Steps, Step } from 'fumadocs-ui/components/steps'
import { Tabs, Tab } from 'fumadocs-ui/components/tabs'
import { Cards, Card } from 'fumadocs-ui/components/card'
import { Accordions, Accordion } from 'fumadocs-ui/components/accordion'
import { Files, File, Folder } from 'fumadocs-ui/components/files'
import { TypeTable } from 'fumadocs-ui/components/type-table'
import type { MDXComponents } from 'mdx/types'

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Callout,
    Steps, Step,
    Tabs, Tab,
    Cards, Card,
    Accordions, Accordion,
    Files, File, Folder,
    TypeTable,
    ...components
  }
}

// useMDXComponents remains unchanged.
```

> During implementation, verify each import path against `node_modules/fumadocs-ui` for the installed version (16.6.7). Adjust if any path differs. Tracked as its own task.

### 5.3 Component semantics

| Component | Use for | Do not use for |
|---|---|---|
| `<Callout type="info">` | Neutral tips, prerequisites, cross-links | Replacing body prose |
| `<Callout type="warn">` | Destructive operations, permission requirements, version limits | Ordinary suggestions |
| `<Callout type="error">` | Known errors and fixes (mainly in troubleshooting) | Success cases |
| `<Steps>` + `<Step>` | Ordered user flows of 3+ steps. Each `<Step>` starts with `###` | Unordered bullet lists |
| `<Tabs items={[...]}>` + `<Tab value="...">` | Platform differences, alternative paths, authentication modes | Chapter-to-chapter navigation |
| `<Cards>` + `<Card>` | Hub pages and overviews | Generic link lists |
| `<Accordions>` + `<Accordion>` | Optional deep-dive content, FAQs, cookbooks | Core steps (they collapse) |
| `<Files>` + `<Folder>` + `<File>` | Directory structure diagrams | Decoration |
| `<TypeTable>` | Configuration field references | Ordinary tables (use Markdown) |

### 5.4 Code fences

Languages used: `bash`, `shell`, `yaml`, `json`, `dockerfile`, `toml`, `text`. Add `title="..."` on the fence line when showing a named file.

### 5.5 Screenshots

Screenshots are deferred to a later pass. In round one, every place that would get a screenshot carries a tracked comment:

```mdx
{/* TODO(screenshot): containers/backup-dialog - Backup dialog with progress */}
```

Target asset location when the screenshot pass lands:

```
public/screenshots/docs/<section>/<page>-<slug>.png
```

Example: `public/screenshots/docs/containers/containers-backup-dialog.png`.

### 5.6 Heading levels

- `h1`: from `title` frontmatter. Never written in MDX.
- `h2` (`##`): section titles.
- `h3` (`###`): subsections and `<Step>` headings.
- `h4` (`####`): only inside cookbook scenarios. `h5` / `h6` are not used.

### 5.7 Cross references

- Internal links use absolute paths: `/en/docs/docker/containers`.
- Anchors use `#section-id` generated from `##` slugs.
- No relative paths.

### 5.8 Version markers

Under a `##` heading or as the first sentence of a section, write one plain line:

```
Added in v4.8.0.
```

No badges, no Callouts, no components. Low-noise by design.

### 5.9 Voice and word choice

- Second person ("you"), never "we" or "the user".
- Imperative voice ("Click Save", "Open the container list").
- No marketing adjectives ("powerful", "revolutionary").
- "See [X]" over "For more information, please refer to X".
- Every section begins with a one-sentence lead telling readers what problem it solves.

## 6. File operations

Paths below are relative to `apps/landing/`.

### 6.1 Global config (1 file)

- Modify `mdx-components.tsx` — extend `getMDXComponents` per §5.2.

### 6.2 English docs

#### New directories (3)

```
content/docs/en/docker/
content/docs/en/kubernetes/
content/docs/en/advanced/
```

#### `meta.json` changes (5 written, 1 left untouched)

- Rewrite `content/docs/en/meta.json`
- Create `content/docs/en/docker/meta.json`
- Create `content/docs/en/kubernetes/meta.json`
- Create `content/docs/en/advanced/meta.json`
- Rewrite `content/docs/en/platform/meta.json`
- Leave `content/docs/en/reference/meta.json` untouched in structure; title text already fits

#### New MDX files (24)

Docker (10):
`docker/containers.mdx`, `docker/images.mdx`, `docker/networks.mdx`, `docker/volumes.mdx`, `docker/files.mdx`, `docker/compose.mdx`, `docker/stats.mdx`, `docker/events.mdx`, `docker/logs.mdx`, `docker/terminal.mdx`

Kubernetes (11):
`kubernetes/overview.mdx`, `kubernetes/cluster.mdx`, `kubernetes/workloads.mdx`, `kubernetes/networking.mdx`, `kubernetes/config-storage.mdx`, `kubernetes/rbac.mdx`, `kubernetes/custom-resources.mdx`, `kubernetes/helm.mdx`, `kubernetes/port-forward.mdx`, `kubernetes/debug.mdx`, `kubernetes/logs-terminal.mdx`

Advanced (2):
`advanced/spotlight.mdx`, `advanced/remote-hosts.mdx`

Platform (1):
`platform/macos.mdx`

Reference (0 new; see rewrites below)

Root (0 new; see rewrites below)

#### Rewritten MDX files (8)

- `content/docs/en/index.mdx`
- `content/docs/en/getting-started.mdx`
- `content/docs/en/platform/windows.mdx` (renamed from `platform/wsl.mdx`)
- `content/docs/en/platform/linux.mdx`
- `content/docs/en/reference/keyboard-shortcuts.mdx`
- `content/docs/en/reference/settings.mdx`
- `content/docs/en/reference/licensing.mdx`
- `content/docs/en/reference/troubleshooting.mdx`

#### Deleted files and directories

```
content/docs/en/guides/                   (entire directory)
├── containers.mdx
├── images.mdx
├── networks.mdx
├── volumes.mdx
├── compose.mdx
├── monitoring.mdx
├── terminal.mdx
├── file-browser.mdx
└── meta.json

content/docs/en/platform/wsl.mdx          (renamed to platform/windows.mdx)
```

### 6.3 zh / ja / es stubs

The first round **adds** stubs and `meta.json` files without deleting old content. A second, separate round deletes the old `guides/` directories in each locale after verification.

#### New stub MDX files (32 × 3 = 96)

One stub per path corresponding to the 32 English MDX files, under `content/docs/zh/`, `content/docs/ja/`, and `content/docs/es/`. Each stub:

```mdx
---
title: <localized title>
description: <localized description placeholder>
---

import { Callout } from 'fumadocs-ui/components/callout'

<Callout type="info">
  <localized "not yet translated" sentence> [English](/en/docs/<same-path>)
</Callout>
```

> Note: `Callout` is globally registered, so the `import` above is optional. For safety in the stub template we still import it explicitly — it makes each stub self-contained and removes any ordering dependency during incremental migration.

#### Localized title/description dictionary (abridged)

| en title | zh | ja | es |
|---|---|---|---|
| Welcome | 欢迎 | ようこそ | Bienvenido |
| Getting Started | 快速开始 | はじめに | Primeros Pasos |
| Docker | Docker | Docker | Docker |
| Containers | 容器 | コンテナ | Contenedores |
| Images | 镜像 | イメージ | Imágenes |
| Networks | 网络 | ネットワーク | Redes |
| Volumes | 卷 | ボリューム | Volúmenes |
| Files | 文件 | ファイル | Archivos |
| Compose & Templates | Compose 与模板 | Compose とテンプレート | Compose y Plantillas |
| Stats | 统计 | 統計 | Estadísticas |
| Events | 事件 | イベント | Eventos |
| Logs | 日志 | ログ | Registros |
| Terminal | 终端 | ターミナル | Terminal |
| Kubernetes | Kubernetes | Kubernetes | Kubernetes |
| Overview | 概览 | 概要 | Resumen |
| Cluster | 集群 | クラスター | Clúster |
| Workloads | 工作负载 | ワークロード | Cargas de trabajo |
| Networking | 网络 | ネットワーキング | Redes |
| Config & Storage | 配置与存储 | 設定とストレージ | Configuración y Almacenamiento |
| RBAC | 权限 (RBAC) | RBAC | RBAC |
| Custom Resources | 自定义资源 | カスタムリソース | Recursos Personalizados |
| Helm | Helm | Helm | Helm |
| Port Forward & DNS | 端口转发与 DNS | ポート転送と DNS | Reenvío de puertos y DNS |
| Debug Assistant | 调试助手 | デバッグアシスタント | Asistente de Depuración |
| Pod Logs & Terminal | Pod 日志与终端 | Pod ログとターミナル | Registros y Terminal de Pod |
| Advanced | 高级 | 高度な機能 | Avanzado |
| Spotlight | Spotlight | Spotlight | Spotlight |
| Remote Hosts (SSH) | 远程主机 (SSH) | リモートホスト (SSH) | Hosts Remotos (SSH) |
| Platform | 平台 | プラットフォーム | Plataforma |
| Windows | Windows | Windows | Windows |
| macOS | macOS | macOS | macOS |
| Linux | Linux | Linux | Linux |
| Reference | 参考 | リファレンス | Referencia |
| Keyboard Shortcuts | 键盘快捷键 | キーボードショートカット | Atajos de Teclado |
| Settings | 设置 | 設定 | Configuración |
| Licensing | 许可证 | ライセンス | Licencias |
| Troubleshooting | 故障排查 | トラブルシューティング | Resolución de Problemas |

#### "Not yet translated" sentences

- **zh**: 此页面尚未翻译。请查看 [英文版本](/en/docs/...)。
- **ja**: このページはまだ翻訳されていません。[英語版](/en/docs/...)をご覧ください。
- **es**: Esta página aún no está traducida. Consulte la [versión en inglés](/en/docs/...).

#### New/updated `meta.json` in stubs (5 × 3 = 15)

Each locale gets the same five `meta.json` files as English that are being written (root, docker, kubernetes, advanced, platform), with titles localized via the dictionary. `reference/meta.json` in each locale is left unchanged (its structure already matches the new English spec). The `pages` arrays are **identical to English** so language switching never misses a page.

### 6.4 Deferred to a second round

- Deleting `content/docs/zh/guides/`, `content/docs/ja/guides/`, `content/docs/es/guides/`
- Deleting `content/docs/zh/platform/wsl.mdx` and equivalents in ja/es
- Replacing `{/* TODO(screenshot): ... */}` comments with `<ChangelogImage>` tags once screenshots exist
- Translating stubs into full zh/ja/es content

### 6.5 File change summary

| Category | Count |
|---|---|
| Global config modifications | 1 |
| English new MDX | 24 |
| English rewritten MDX | 8 |
| English `meta.json` written | 5 |
| English MDX deleted | 9 |
| English directories deleted | 1 |
| zh/ja/es stub MDX added | 96 |
| zh/ja/es `meta.json` written | 15 |
| **Total file changes (round one)** | **158 files + 3 directories created + 1 directory deleted** |

## 7. Acceptance criteria

### 7.1 Structural

- [ ] `content/docs/en/` contains exactly 32 MDX files in the paths listed in §3.
- [ ] The five written English `meta.json` files (root, docker, kubernetes, advanced, platform) match §3 exactly; `reference/meta.json` is unchanged.
- [ ] Old `content/docs/en/guides/` directory removed.
- [ ] Old `content/docs/en/platform/wsl.mdx` removed (replaced by `platform/windows.mdx`).
- [ ] `zh/`, `ja/`, `es/` each contain 32 stub MDX files at the same paths as the English structure and five matching newly-written `meta.json` files. Old `guides/` directories remain untouched in this round.

### 7.2 Build health

- [ ] `bun run build` (or equivalent) in `apps/landing/` completes without errors.
- [ ] Visiting `http://localhost:3000/en/docs` shows the new Welcome page with the new sidebar.
- [ ] `/en/docs/docker/containers`, `/en/docs/kubernetes/overview`, and `/en/docs/advanced/spotlight` all render without 404.
- [ ] `/zh/docs/docker/containers`, `/ja/docs/docker/containers`, `/es/docs/docker/containers` all render the stub page with the "not yet translated" Callout and a working English link.
- [ ] The language switcher round-trips between en → zh → ja → es without 404 on any new page.
- [ ] `<Callout>`, `<Steps>`, `<Tabs>`, `<Cards>`, `<Accordions>`, `<Files>`, `<TypeTable>` render correctly; at least three representative pages are spot-checked.
- [ ] Every screenshot reference appears as a `{/* TODO(screenshot): ... */}` comment — no `<ChangelogImage src=...>` pointing at a missing file exists in docs pages.

### 7.3 Content quality

- [ ] Every MDX has `title` (2–30 chars) and `description` (80–140 chars).
- [ ] No MDX file contains `h1`.
- [ ] Each page's lead is ≤ 3 sentences and names the problem the page solves.
- [ ] Every code fence has a language annotation.
- [ ] No relative in-site links; all internal links use `/en/docs/...`.
- [ ] Features flagged as "Added in v4.x.x" in §4 actually appear with that sentence on the right page.
- [ ] Every `[text](#anchor)` or `[text](/en/docs/...#anchor)` points at a heading that exists.

### 7.4 Regression safety

- [ ] `src/content/changelog/` directory is untouched.
- [ ] `useMDXComponents` in `mdx-components.tsx` is untouched.
- [ ] `src/components/mdx.tsx` is untouched.
- [ ] `next.config.mjs`, `source.config.ts`, `src/lib/source.ts`, `middleware.ts`, and `src/lib/i18n/fumadocs.ts` are all untouched.
- [ ] Existing `/zh/docs/guides/*`, `/ja/docs/guides/*`, `/es/docs/guides/*` URLs still resolve (they are not deleted in round one).

### 7.5 Follow-up deliverables

- [ ] `public/screenshots/docs/` subdirectory tree exists (empty), matching the subpaths used by the TODO comments.
- [ ] The implementation PR description includes the full list of `{/* TODO(screenshot): ... */}` comments so a later screenshot pass can walk through them in order.

## 8. Appendix — Screenshot TODO inventory (to be filled during implementation)

During implementation, every `{/* TODO(screenshot): <path> - <description> */}` comment added to an MDX file should be mirrored in this appendix as a flat list so the screenshot pass has a single checklist. The list will be appended in the implementation PR description, not this spec file.

## 9. Out of scope

- Translation of zh/ja/es content (deferred to a later pass).
- Producing actual screenshots or GIFs.
- Changes to the landing page itself (`src/app/[locale]/(main)/page.tsx`).
- Changes to the changelog (`src/content/changelog/`).
- Changes to `fumadocs-ui` / `fumadocs-core` / `next` versions.
- Product changes in `/Users/zingerbee/Documents/app.dockerman`.
