# Dockerman Documentation Content Design

## Overview

Add comprehensive documentation to the `/docs` route, covering feature guides, platform adaptation, and reference material. All content bilingual (English + Chinese), using the existing Fumadocs infrastructure.

## Directory Structure

```
content/docs/
├── meta.json                       # Top-level navigation
├── index.mdx                       # Welcome (existing)
├── getting-started.mdx             # Getting started (existing)
│
├── guides/                         # Feature guides
│   ├── meta.json
│   ├── containers.mdx              # Container management
│   ├── images.mdx                  # Image management
│   ├── networks.mdx                # Network management
│   ├── volumes.mdx                 # Volume management
│   ├── compose.mdx                 # Docker Compose
│   ├── monitoring.mdx              # Real-time monitoring
│   ├── terminal.mdx                # Built-in terminal
│   └── file-browser.mdx            # File browser
│
├── platform/                       # Platform adaptation
│   ├── meta.json
│   ├── wsl.mdx                     # Windows WSL
│   └── linux.mdx                   # Linux setup
│
├── reference/                      # Reference
│   ├── meta.json
│   ├── keyboard-shortcuts.mdx      # Keyboard shortcuts
│   ├── settings.mdx                # Settings & configuration
│   ├── licensing.mdx               # License management
│   └── troubleshooting.mdx         # Troubleshooting
│
└── zh/                             # Chinese translations (mirror structure)
    ├── index.mdx                   # (existing)
    ├── getting-started.mdx         # (existing)
    ├── guides/
    │   ├── containers.mdx
    │   ├── images.mdx
    │   ├── networks.mdx
    │   ├── volumes.mdx
    │   ├── compose.mdx
    │   ├── monitoring.mdx
    │   ├── terminal.mdx
    │   └── file-browser.mdx
    ├── platform/
    │   ├── wsl.mdx
    │   └── linux.mdx
    └── reference/
        ├── keyboard-shortcuts.mdx
        ├── settings.mdx
        ├── licensing.mdx
        └── troubleshooting.mdx
```

## Navigation (meta.json)

Top-level:
```json
{
  "title": "Dockerman Docs",
  "pages": ["index", "getting-started", "---", "guides", "platform", "reference"]
}
```

Each subdirectory has its own `meta.json` controlling title and page order.

## Content Summary

### Feature Guides (guides/)

| Page | Content |
|------|---------|
| containers | Container list, create/start/stop/restart/remove, logs, resource limits |
| images | Image list, pull/build/remove, tag management |
| networks | Network list, create/delete, connect containers |
| volumes | Volume list, create/delete, mount usage |
| compose | Compose file management, service start/stop, logs |
| monitoring | Real-time CPU/memory/network monitoring, dashboard |
| terminal | Built-in terminal access, shell selection |
| file-browser | Container filesystem browsing, upload/download |

### Platform (platform/)

| Page | Content |
|------|---------|
| wsl | Windows WSL 2 configuration, Docker Desktop integration, common issues |
| linux | Linux distro installation, Docker Engine setup, permissions |

### Reference (reference/)

| Page | Content |
|------|---------|
| keyboard-shortcuts | Global and page-level shortcut list |
| settings | App settings (theme, language, Docker connection, etc.) |
| licensing | License types, activation, management |
| troubleshooting | Common issues and solutions |

## Writing Style

- 50-150 lines per page, practical and concise
- Target audience: users with Docker basics
- Bilingual: English + Chinese (independent translations, not machine-translated style)
- Consistent frontmatter: `title` and `description`
- Match existing index.mdx / getting-started.mdx style

## No Code Changes Required

- Route code (`src/app/[locale]/docs/`) — Fumadocs catch-all handles new pages automatically
- Search API — Fumadocs auto-indexes new MDX content
- Layout — Sidebar auto-generates from meta.json

## Files to Create

- 4 meta.json files (update top-level + 3 new subdirectory meta.json)
- 14 English MDX files (in guides/, platform/, reference/)
- 14 Chinese MDX files (in zh/guides/, zh/platform/, zh/reference/)

Total: 32 new files + 1 updated file
