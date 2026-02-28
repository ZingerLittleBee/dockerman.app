# Fumadocs Documentation System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate fumadocs documentation system into the Dockerman website with Tailwind v4 upgrade, supporting en/zh i18n at `/[locale]/docs/...`.

**Architecture:** Docs live under the existing `[locale]` route with fumadocs' own DocsLayout (sidebar, search, TOC). Two i18n systems coexist: i18next for marketing pages, fumadocs i18n for docs content. Tailwind CSS upgraded from v3 to v4 with CSS-first configuration.

**Tech Stack:** Next.js 16, fumadocs-core/ui/mdx, Tailwind CSS v4, Bun

**Design doc:** `docs/plans/2026-02-28-fumadocs-integration-design.md`

---

### Task 1: Upgrade Tailwind CSS v3 to v4

**Files:**
- Modify: `package.json`
- Modify: `postcss.config.mjs`
- Delete: `tailwind.config.ts`
- Modify: `src/app/globals.css`

**Step 1: Install Tailwind v4 and remove v3 packages**

Run:
```bash
bun remove tailwindcss postcss @tailwindcss/forms && bun add tailwindcss@latest @tailwindcss/postcss @tailwindcss/forms
```

**Step 2: Update `postcss.config.mjs`**

Replace entire file with:
```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
export default config
```

**Step 3: Migrate `src/app/globals.css`**

Replace the first 3 lines:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

With:
```css
@import 'tailwindcss';

@custom-variant dark (&:where(.dark, .dark *));

@plugin "@tailwindcss/forms";

@theme {
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-sans-zh: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  --font-handwriting: "NanumPenScript";

  --animate-hide: hide 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-slideDownAndFade: slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-slideLeftAndFade: slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-slideUpAndFade: slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-slideRightAndFade: slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-accordionOpen: accordionOpen 250ms cubic-bezier(0.33, 1, 0.68, 1);
  --animate-accordionClose: accordionClose 200ms cubic-bezier(0.33, 1, 0.68, 1);
  --animate-dialogOverlayShow: dialogOverlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-dialogContentShow: dialogContentShow 150ms cubic-bezier(0.16, 1, 0.3, 1);
  --animate-slide-down-fade: slide-down-fade ease-in-out forwards;
  --animate-slide-up-fade: slide-up-fade ease-in-out forwards;
  --animate-fade-in: fade-in 200ms ease-out;

  @keyframes hide {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes slideDownAndFade {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideLeftAndFade {
    from { opacity: 0; transform: translateX(6px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideUpAndFade {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideRightAndFade {
    from { opacity: 0; transform: translateX(-6px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes accordionOpen {
    from { height: 0px; }
    to { height: var(--radix-accordion-content-height); }
  }
  @keyframes accordionClose {
    from { height: var(--radix-accordion-content-height); }
    to { height: 0px; }
  }
  @keyframes dialogOverlayShow {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes dialogContentShow {
    from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
  @keyframes slide-up-fade {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0px); }
  }
  @keyframes slide-down-fade {
    from { opacity: 0; transform: translateY(-26px); }
    to { opacity: 1; transform: translateY(0px); }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
}
```

Keep all other custom styles (font-face, backdrop-blur, code, view-transitions, etc.) below the `@theme` block unchanged.

**Step 4: Delete `tailwind.config.ts`**

The configuration is now fully in CSS. Remove `tailwind.config.ts`.

**Step 5: Verify the build compiles**

Run: `bun run build`
Expected: Build succeeds. If there are class-related warnings, investigate and fix.

**Step 6: Start dev server and spot-check marketing pages**

Run: `bun run dev`
Check: Visit `/en`, `/en/pricing`, `/en/download`, `/zh` — verify styles look correct (dark mode toggle, fonts, animations).

**Step 7: Commit**

```bash
git add -A && git commit -m "chore: upgrade Tailwind CSS from v3 to v4 with CSS-first configuration"
```

---

### Task 2: Install fumadocs dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install fumadocs packages**

Run:
```bash
bun add fumadocs-core fumadocs-ui fumadocs-mdx
```

**Step 2: Remove @next/mdx and related packages**

fumadocs-mdx handles all MDX processing, so `@next/mdx`, `@mdx-js/loader`, and `@mdx-js/react` can be removed:

Run:
```bash
bun remove @next/mdx @mdx-js/loader @mdx-js/react
```

**Step 3: Commit**

```bash
git add package.json bun.lock && git commit -m "chore: add fumadocs dependencies and remove @next/mdx"
```

---

### Task 3: Configure fumadocs MDX source

**Files:**
- Create: `source.config.ts` (project root)
- Modify: `next.config.mjs`
- Modify: `tsconfig.json`

**Step 1: Create `source.config.ts`**

Create at project root:
```typescript
import { defineDocs, defineConfig } from 'fumadocs-mdx/config'

export const docs = defineDocs({
  dir: 'content/docs'
})

export default defineConfig()
```

**Step 2: Update `next.config.mjs`**

Replace the entire file:
```javascript
import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure image optimization
  images: {
    qualities: [70, 75, 100]
  },
  // PostHog reverse proxy rewrites
  async rewrites() {
    return [
      {
        source: '/ingest/static/:path*',
        destination: 'https://us-assets.i.posthog.com/static/:path*'
      },
      {
        source: '/ingest/:path*',
        destination: 'https://us.i.posthog.com/:path*'
      }
    ]
  },
  // Required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true
}

const withMDX = createMDX()

export default withMDX(nextConfig)
```

Key changes:
- Replace `import createMDX from '@next/mdx'` with `import { createMDX } from 'fumadocs-mdx/next'`
- Remove `pageExtensions` (fumadocs handles MDX routing)
- Keep all other config (images, rewrites, skipTrailingSlashRedirect)

**Step 3: Add path alias to `tsconfig.json`**

Add to `compilerOptions.paths`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "fumadocs-mdx:collections/*": [".source/*"]
    }
  }
}
```

Also add `.source` to the `include` array:
```json
{
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    ".source/**/*.ts"
  ]
}
```

**Step 4: Verify dev server starts**

Run: `bun run dev`
Expected: Server starts without errors. The `.source` directory will be auto-generated.

**Step 5: Commit**

```bash
git add source.config.ts next.config.mjs tsconfig.json && git commit -m "feat: configure fumadocs MDX source and update Next.js config"
```

---

### Task 4: Create fumadocs source loader and i18n adapter

**Files:**
- Create: `src/lib/i18n/fumadocs.ts`
- Create: `src/lib/source.ts`

**Step 1: Create fumadocs i18n config at `src/lib/i18n/fumadocs.ts`**

```typescript
import { defineI18n } from 'fumadocs-core/i18n'

export const i18n = defineI18n({
  languages: ['en', 'zh'],
  defaultLanguage: 'en'
})
```

**Step 2: Create source loader at `src/lib/source.ts`**

```typescript
import { docs } from 'fumadocs-mdx:collections/server'
import { loader } from 'fumadocs-core/source'
import { i18n } from '@/lib/i18n/fumadocs'

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  i18n
})
```

**Step 3: Commit**

```bash
git add src/lib/i18n/fumadocs.ts src/lib/source.ts && git commit -m "feat: add fumadocs source loader with i18n support"
```

---

### Task 5: Add fumadocs styles and RootProvider

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Step 1: Add fumadocs CSS imports to `src/app/globals.css`**

After `@import 'tailwindcss';` add:
```css
@import 'fumadocs-ui/css/neutral.css';
@import 'fumadocs-ui/css/preset.css';
```

Also add fumadocs source scanning:
```css
@source '../node_modules/fumadocs-ui/dist/**/*.js';
```

The top of the file should look like:
```css
@import 'tailwindcss';
@import 'fumadocs-ui/css/neutral.css';
@import 'fumadocs-ui/css/preset.css';

@source '../node_modules/fumadocs-ui/dist/**/*.js';

@custom-variant dark (&:where(.dark, .dark *));
/* ... rest of the file ... */
```

**Step 2: Integrate RootProvider in `src/app/layout.tsx`**

Replace the existing `ThemeProvider` with fumadocs `RootProvider` (which includes theme support):

```typescript
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { RootProvider } from 'fumadocs-ui/provider/next'
import './globals.css'
import { LenisProvider } from '@/components/providers/LenisProvider'
import { siteConfig } from './siteConfig'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  // ... keep existing metadata unchanged ...
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'development' && (
          <Script
            crossOrigin="anonymous"
            src="//unpkg.com/react-grab/dist/index.global.js"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body
        className={`${inter.variable} min-h-screen scroll-auto antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
      >
        <RootProvider>
          <LenisProvider>{children}</LenisProvider>
        </RootProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

Key change: `ThemeProvider` replaced by `RootProvider` (which handles themes internally). Remove the `next-themes` import.

Note: If marketing pages rely on `useTheme()` from `next-themes`, the fumadocs `RootProvider` also uses `next-themes` internally so `useTheme()` will still work.

**Step 3: Verify dev server**

Run: `bun run dev`
Check: Visit `/en` — marketing page should still render correctly with dark mode.

**Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx && git commit -m "feat: integrate fumadocs RootProvider and styles"
```

---

### Task 6: Update mdx-components.tsx

**Files:**
- Modify: `mdx-components.tsx` (project root)

**Step 1: Update `mdx-components.tsx` to include fumadocs defaults**

```typescript
import type { MDXComponents } from 'mdx/types'
import defaultMdxComponents from 'fumadocs-ui/mdx'

// Fumadocs uses getMDXComponents
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components
  }
}

// Next.js MDX integration uses useMDXComponents (for changelog pages)
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components
  }
}
```

Note: The custom changelog MDX components (`H1`, `H2`, `H3`, `P`, `Ul`, `CustomLink`, `ChangelogEntry`, `ChangelogImage`) are no longer globally registered. If changelog pages break, they may need to be refactored to import these components directly in their MDX files or via a separate layout.

**Step 2: Commit**

```bash
git add mdx-components.tsx && git commit -m "feat: update mdx-components with fumadocs defaults"
```

---

### Task 7: Create docs routes

**Files:**
- Create: `src/lib/layout.shared.tsx`
- Create: `src/app/[locale]/docs/layout.tsx`
- Create: `src/app/[locale]/docs/[[...slug]]/page.tsx`

**Step 1: Create `src/lib/layout.shared.tsx`**

```typescript
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'Dockerman Docs'
    }
  }
}
```

**Step 2: Create `src/app/[locale]/docs/layout.tsx`**

```typescript
import { source } from '@/lib/source'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { baseOptions } from '@/lib/layout.shared'
import type { ReactNode } from 'react'

export default async function Layout({
  children,
  params
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <DocsLayout tree={source.getPageTree(locale)} {...baseOptions()}>
      {children}
    </DocsLayout>
  )
}
```

**Step 3: Create `src/app/[locale]/docs/[[...slug]]/page.tsx`**

```typescript
import { source } from '@/lib/source'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle
} from 'fumadocs-ui/layouts/docs/page'
import { notFound } from 'next/navigation'
import { getMDXComponents } from '@/mdx-components'
import type { Metadata } from 'next'
import { createRelativeLink } from 'fumadocs-ui/mdx'

export default async function Page({
  params
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}) {
  const { locale, slug } = await params
  const page = source.getPage(slug, locale)
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page)
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const page = source.getPage(slug, locale)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description
  }
}
```

**Step 4: Commit**

```bash
git add src/lib/layout.shared.tsx src/app/\[locale\]/docs/ && git commit -m "feat: add fumadocs docs routes with i18n support"
```

---

### Task 8: Create search API route

**Files:**
- Create: `src/app/api/search/route.ts`

**Step 1: Create `src/app/api/search/route.ts`**

```typescript
import { source } from '@/lib/source'
import { createFromSource } from 'fumadocs-core/search/server'

export const { GET } = createFromSource(source)
```

**Step 2: Update middleware to allow `/api/search` through**

Check `middleware.ts` — it already skips `/api` routes:
```typescript
if (pathname.startsWith('/api') || ...) {
  return NextResponse.next()
}
```

No changes needed.

**Step 3: Commit**

```bash
git add src/app/api/search/route.ts && git commit -m "feat: add fumadocs search API route"
```

---

### Task 9: Add sample documentation content

**Files:**
- Create: `content/docs/index.mdx`
- Create: `content/docs/getting-started.mdx`
- Create: `content/docs/meta.json`
- Create: `content/docs/zh/index.mdx`
- Create: `content/docs/zh/getting-started.mdx`

**Step 1: Create `content/docs/meta.json`**

This controls the page tree order:
```json
{
  "title": "Dockerman Docs",
  "pages": ["index", "getting-started"]
}
```

**Step 2: Create `content/docs/index.mdx`**

```mdx
---
title: Welcome to Dockerman
description: Modern Docker Management UI built with Tauri and Rust
---

## Overview

Dockerman is a modern, lightweight Docker management interface built with Tauri and Rust, focused on simplicity and performance.

## Features

- Container lifecycle management (create, start, stop, restart, remove)
- Image management with pull, build, and remove operations
- Real-time resource monitoring with CPU, memory, and network stats
- Built-in terminal access to running containers
- Cross-platform support (macOS, Windows, Linux)

## Getting Started

Follow the [Getting Started](/docs/getting-started) guide to install and set up Dockerman.
```

**Step 3: Create `content/docs/getting-started.mdx`**

```mdx
---
title: Getting Started
description: Install and set up Dockerman on your system
---

## Installation

Download Dockerman from the [official website](https://dockerman.app/en/download).

### System Requirements

- macOS 12+ / Windows 10+ / Linux (Ubuntu 20.04+)
- Docker Engine installed and running

### Steps

1. Download the installer for your platform
2. Run the installer
3. Launch Dockerman
4. Dockerman will automatically detect your Docker Engine

## First Steps

After launching Dockerman, you'll see the dashboard with an overview of your Docker environment.
```

**Step 4: Create `content/docs/zh/index.mdx`**

```mdx
---
title: 欢迎使用 Dockerman
description: 基于 Tauri 和 Rust 构建的现代化 Docker 管理界面
---

## 概览

Dockerman 是一个基于 Tauri 和 Rust 构建的现代轻量级 Docker 管理界面，专注于简洁和性能。

## 功能特性

- 容器生命周期管理（创建、启动、停止、重启、删除）
- 镜像管理（拉取、构建、删除）
- 实时资源监控（CPU、内存、网络）
- 内置终端，直接访问运行中的容器
- 跨平台支持（macOS、Windows、Linux）

## 快速开始

请阅读[快速开始](/docs/getting-started)指南来安装和配置 Dockerman。
```

**Step 5: Create `content/docs/zh/getting-started.mdx`**

```mdx
---
title: 快速开始
description: 在您的系统上安装和配置 Dockerman
---

## 安装

从[官方网站](https://dockerman.app/zh/download)下载 Dockerman。

### 系统要求

- macOS 12+ / Windows 10+ / Linux (Ubuntu 20.04+)
- 已安装并运行 Docker Engine

### 安装步骤

1. 下载适用于您平台的安装包
2. 运行安装程序
3. 启动 Dockerman
4. Dockerman 将自动检测您的 Docker Engine

## 初次使用

启动 Dockerman 后，您将看到仪表板，其中展示了 Docker 环境的概览信息。
```

**Step 6: Commit**

```bash
git add content/docs/ && git commit -m "feat: add sample documentation content (en/zh)"
```

---

### Task 10: End-to-end verification

**Step 1: Start dev server**

Run: `bun run dev`

**Step 2: Verify marketing pages**

Visit these URLs and confirm they render correctly:
- `http://localhost:3000/en` — Homepage
- `http://localhost:3000/zh` — Chinese homepage
- `http://localhost:3000/en/pricing` — Pricing page
- `http://localhost:3000/en/changelog` — Changelog (MDX)

Check: Dark mode toggle, fonts, animations, i18n switching all work.

**Step 3: Verify docs pages**

- `http://localhost:3000/en/docs` — Docs landing (English)
- `http://localhost:3000/en/docs/getting-started` — Getting started (English)
- `http://localhost:3000/zh/docs` — Docs landing (Chinese)
- `http://localhost:3000/zh/docs/getting-started` — Getting started (Chinese)

Check: Sidebar navigation, search, TOC, dark mode, content rendering.

**Step 4: Verify search**

- Click the search box in docs layout (or press `Cmd+K`)
- Type "getting started"
- Verify search results appear

**Step 5: Verify build**

Run: `bun run build`
Expected: Build succeeds without errors.

**Step 6: Run code checks**

Run: `bun run check`
Fix any linting/formatting issues found.

**Step 7: Final commit (if any fixes)**

```bash
git add -A && git commit -m "fix: address issues found during verification"
```
