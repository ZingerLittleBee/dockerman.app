# Monorepo Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate dockerman from a single Next.js app into a Turborepo monorepo with `apps/landing`, `apps/docs`, and `packages/shared`.

**Architecture:** Turborepo + Bun workspaces. `packages/shared` exposes TypeScript source (no build step) via `exports` field. Each app uses `transpilePackages` in Next.js config. Only genuinely shared code (i18n, analytics, providers, utils) goes into the shared package.

**Tech Stack:** Next.js 16, React 19, Turborepo, Bun workspaces, TypeScript, Tailwind CSS 4, Fumadocs, i18next

---

### Task 1: Root workspace configuration

**Files:**
- Modify: `package.json` (convert to workspace root)
- Create: `turbo.json`
- Modify: `tsconfig.json` (make it a base config)

**Step 1: Convert root package.json to workspace root**

Replace the current `package.json` with:

```json
{
  "name": "dockerman",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "check": "turbo run check",
    "fix": "turbo run fix",
    "dev:landing": "turbo run dev --filter=@repo/landing",
    "dev:docs": "turbo run dev --filter=@repo/docs",
    "build:landing": "turbo run build --filter=@repo/landing",
    "build:docs": "turbo run build --filter=@repo/docs"
  },
  "devDependencies": {
    "@biomejs/biome": "2.3.12",
    "turbo": "^2",
    "typescript": "^5.7.3",
    "ultracite": "7.1.1"
  },
  "packageManager": "bun@1.3.4"
}
```

**Step 2: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "check": {
      "dependsOn": ["^build"]
    },
    "fix": {}
  }
}
```

**Step 3: Simplify root tsconfig.json as a base config**

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "allowUnusedLabels": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "target": "ES2017"
  },
  "exclude": ["node_modules"]
}
```

**Step 4: Commit**

```bash
git add package.json turbo.json tsconfig.json
git commit -m "chore: set up root workspace configuration for monorepo"
```

---

### Task 2: Create packages/shared

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Move: `src/lib/i18n/index.ts` → `packages/shared/src/i18n/index.ts`
- Move: `src/lib/i18n/settings.ts` → `packages/shared/src/i18n/settings.ts`
- Move: `src/lib/i18n/client.ts` → `packages/shared/src/i18n/client.ts`
- Move: `src/lib/i18n/server.ts` → `packages/shared/src/i18n/server.ts`
- Move: `src/lib/utils.ts` → `packages/shared/src/utils.ts`
- Move: `src/hooks/usePageEngaged.ts` → `packages/shared/src/hooks/usePageEngaged.ts`
- Move: `src/hooks/useScrollDepth.ts` → `packages/shared/src/hooks/useScrollDepth.ts`
- Move: `src/components/AnalyticsTracker.tsx` → `packages/shared/src/components/AnalyticsTracker.tsx`
- Move: `src/components/I18nProvider.tsx` → `packages/shared/src/components/I18nProvider.tsx`
- Move: `src/components/providers/LenisProvider.tsx` → `packages/shared/src/components/LenisProvider.tsx`
- Move: `src/locales/en.json` → `packages/shared/src/locales/en.json`
- Move: `src/locales/zh.json` → `packages/shared/src/locales/zh.json`

**Step 1: Create directory structure**

```bash
mkdir -p packages/shared/src/{i18n,hooks,components,locales}
```

**Step 2: Create packages/shared/package.json**

```json
{
  "name": "@repo/shared",
  "private": true,
  "type": "module",
  "exports": {
    "./i18n": "./src/i18n/index.ts",
    "./i18n/client": "./src/i18n/client.ts",
    "./i18n/server": "./src/i18n/server.ts",
    "./i18n/settings": "./src/i18n/settings.ts",
    "./utils": "./src/utils.ts",
    "./components/I18nProvider": "./src/components/I18nProvider.tsx",
    "./components/LenisProvider": "./src/components/LenisProvider.tsx",
    "./components/AnalyticsTracker": "./src/components/AnalyticsTracker.tsx",
    "./hooks/usePageEngaged": "./src/hooks/usePageEngaged.ts",
    "./hooks/useScrollDepth": "./src/hooks/useScrollDepth.ts"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "i18next": "^25.8.0",
    "i18next-resources-to-backend": "^1.2.1",
    "lenis": "^1.3.17",
    "gsap": "^3.14.2",
    "posthog-js": "^1.336.4",
    "react-i18next": "^16.5.4",
    "tailwind-merge": "^2.6.0"
  },
  "peerDependencies": {
    "next": ">=16",
    "react": ">=19",
    "react-dom": ">=19"
  }
}
```

**Step 3: Create packages/shared/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "paths": {
      "@repo/shared/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**Step 4: Move and adapt shared source files**

Copy each file and update internal imports to use relative paths:

**`packages/shared/src/i18n/settings.ts`** — Copy as-is (no `@/` imports).

**`packages/shared/src/i18n/index.ts`** — Copy as-is (re-exports from `./settings`).

**`packages/shared/src/i18n/client.ts`** — Update locale imports:
```typescript
// BEFORE:
import en from '@/locales/en.json'
import zh from '@/locales/zh.json'

// AFTER:
import en from '../locales/en.json'
import zh from '../locales/zh.json'
```

**`packages/shared/src/i18n/server.ts`** — Update dynamic import:
```typescript
// BEFORE:
.use(resourcesToBackend((language: string) => import(`@/locales/${language}.json`)))

// AFTER:
.use(resourcesToBackend((language: string) => import(`../locales/${language}.json`)))
```

**`packages/shared/src/utils.ts`** — Copy as-is (no `@/` imports).

**`packages/shared/src/hooks/usePageEngaged.ts`** — Copy as-is (no `@/` imports).

**`packages/shared/src/hooks/useScrollDepth.ts`** — Copy as-is (no `@/` imports).

**`packages/shared/src/components/AnalyticsTracker.tsx`** — Update imports:
```typescript
// BEFORE:
import { usePageEngaged } from '@/hooks/usePageEngaged'
import { useScrollDepth } from '@/hooks/useScrollDepth'

// AFTER:
import { usePageEngaged } from '../hooks/usePageEngaged'
import { useScrollDepth } from '../hooks/useScrollDepth'
```

**`packages/shared/src/components/I18nProvider.tsx`** — Update imports:
```typescript
// BEFORE:
import type { Locale } from '@/lib/i18n'
import '@/lib/i18n/client'

// AFTER:
import type { Locale } from '../i18n'
import '../i18n/client'
```

**`packages/shared/src/components/LenisProvider.tsx`** — Copy as-is (no `@/` imports).

**`packages/shared/src/locales/en.json`** — Copy as-is.

**`packages/shared/src/locales/zh.json`** — Copy as-is.

**Step 5: Commit**

```bash
git add packages/shared/
git commit -m "feat: create @repo/shared package with i18n, analytics, providers, and utils"
```

---

### Task 3: Create apps/landing

**Files:**
- Create: `apps/landing/package.json`
- Create: `apps/landing/tsconfig.json`
- Create: `apps/landing/next.config.mjs`
- Create: `apps/landing/postcss.config.mjs`
- Move: `middleware.ts` → `apps/landing/middleware.ts`
- Move: `instrumentation-client.ts` → `apps/landing/instrumentation-client.ts`
- Move: `src/app/globals.css` → `apps/landing/src/app/globals.css`
- Move: `src/app/layout.tsx` → `apps/landing/src/app/layout.tsx`
- Move: `src/app/page.tsx` → `apps/landing/src/app/page.tsx`
- Move: `src/app/not-found.tsx` → `apps/landing/src/app/not-found.tsx`
- Move: `src/app/siteConfig.ts` → `apps/landing/src/app/siteConfig.ts`
- Move: `src/app/favicon.ico` → `apps/landing/src/app/favicon.ico`
- Move: `src/app/opengraph-image.png` → `apps/landing/src/app/opengraph-image.png`
- Move: `src/app/[locale]/layout.tsx` → `apps/landing/src/app/[locale]/layout.tsx`
- Move: `src/app/[locale]/(main)/` → `apps/landing/src/app/[locale]/(main)/` (entire directory)
- Move: `src/app/api/checkout/` → `apps/landing/src/app/api/checkout/`
- Move: `src/app/api/changelog/` → `apps/landing/src/app/api/changelog/`
- Move: `src/components/ui/` → `apps/landing/src/components/ui/` (all landing UI components)
- Move: `src/components/Button.tsx` → `apps/landing/src/components/Button.tsx`
- Move: `src/components/Badge.tsx` → `apps/landing/src/components/Badge.tsx`
- Move: `src/components/Accordion.tsx` → `apps/landing/src/components/Accordion.tsx`
- Move: `src/components/Arrow.tsx` → `apps/landing/src/components/Arrow.tsx`
- Move: `src/components/Code.tsx` → `apps/landing/src/components/Code.tsx`
- Move: `src/components/CopyToClipboard.tsx` → `apps/landing/src/components/CopyToClipboard.tsx`
- Move: `src/components/Input.tsx` → `apps/landing/src/components/Input.tsx`
- Move: `src/components/Label.tsx` → `apps/landing/src/components/Label.tsx`
- Move: `src/components/RadioGroup.tsx` → `apps/landing/src/components/RadioGroup.tsx`
- Move: `src/components/Switch.tsx` → `apps/landing/src/components/Switch.tsx`
- Move: `src/components/ThemeSwitch.tsx` → `apps/landing/src/components/ThemeSwitch.tsx`
- Move: `src/components/Tooltip.tsx` → `apps/landing/src/components/Tooltip.tsx`
- Move: `src/components/mdx.tsx` → `apps/landing/src/components/mdx.tsx`
- Move: `src/lib/use-scroll.ts` → `apps/landing/src/lib/use-scroll.ts`
- Move: `src/content/changelog/` → `apps/landing/src/content/changelog/`
- Move: `public/` → `apps/landing/public/` (all static assets)
- Copy: `.env.example` → `apps/landing/.env.example`

**Step 1: Create directory structure**

```bash
mkdir -p apps/landing/src/{app/\[locale\]/\(main\),app/api,components/ui,lib,content}
mkdir -p apps/landing/public
```

**Step 2: Create apps/landing/package.json**

```json
{
  "name": "@repo/landing",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3000",
    "build": "next build",
    "start": "next start",
    "check": "ultracite check",
    "fix": "ultracite fix"
  },
  "dependencies": {
    "@gsap/react": "^2.1.2",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.6",
    "@remixicon/react": "^4.6.0",
    "@repo/shared": "workspace:*",
    "@tabler/icons-react": "^3.31.0",
    "@tailwindcss/forms": "^0.5.11",
    "@tailwindcss/postcss": "^4.2.1",
    "@vercel/analytics": "^1.4.1",
    "@vercel/speed-insights": "^1.1.0",
    "cobe": "^0.6.3",
    "gsap": "^3.14.2",
    "motion": "^12.0.11",
    "next": "16.1.6",
    "next-themes": "^0.4.4",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-wrap-balancer": "^1.1.1",
    "react-zoom-pan-pinch": "^3.7.0",
    "tailwind-variants": "^0.3.0",
    "tailwindcss": "^4.2.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "19.2.10",
    "@types/react-dom": "19.2.3",
    "react-grab": "^0.0.98",
    "typescript": "^5.7.3"
  }
}
```

**Step 3: Create apps/landing/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

**Step 4: Create apps/landing/next.config.mjs**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/shared'],
  images: {
    qualities: [70, 75, 100]
  },
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
  skipTrailingSlashRedirect: true
}

export default nextConfig
```

**Step 5: Create apps/landing/postcss.config.mjs**

```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
export default config
```

**Step 6: Move source files**

Use `git mv` for all file moves to preserve git history:

```bash
# App core files
git mv middleware.ts apps/landing/middleware.ts
git mv instrumentation-client.ts apps/landing/instrumentation-client.ts

# src/app/ files
git mv src/app/globals.css apps/landing/src/app/globals.css
git mv src/app/layout.tsx apps/landing/src/app/layout.tsx
git mv src/app/page.tsx apps/landing/src/app/page.tsx
git mv src/app/not-found.tsx apps/landing/src/app/not-found.tsx
git mv src/app/siteConfig.ts apps/landing/src/app/siteConfig.ts
git mv src/app/favicon.ico apps/landing/src/app/favicon.ico
git mv src/app/opengraph-image.png apps/landing/src/app/opengraph-image.png

# [locale] layouts and pages
git mv src/app/[locale]/layout.tsx apps/landing/src/app/[locale]/layout.tsx
git mv src/app/[locale]/(main) apps/landing/src/app/[locale]/(main)

# API routes
git mv src/app/api/checkout apps/landing/src/app/api/checkout
git mv src/app/api/changelog apps/landing/src/app/api/changelog

# Components (landing-specific)
git mv src/components/ui apps/landing/src/components/ui
git mv src/components/Button.tsx apps/landing/src/components/Button.tsx
git mv src/components/Badge.tsx apps/landing/src/components/Badge.tsx
git mv src/components/Accordion.tsx apps/landing/src/components/Accordion.tsx
git mv src/components/Arrow.tsx apps/landing/src/components/Arrow.tsx
git mv src/components/Code.tsx apps/landing/src/components/Code.tsx
git mv src/components/CopyToClipboard.tsx apps/landing/src/components/CopyToClipboard.tsx
git mv src/components/Input.tsx apps/landing/src/components/Input.tsx
git mv src/components/Label.tsx apps/landing/src/components/Label.tsx
git mv src/components/RadioGroup.tsx apps/landing/src/components/RadioGroup.tsx
git mv src/components/Switch.tsx apps/landing/src/components/Switch.tsx
git mv src/components/ThemeSwitch.tsx apps/landing/src/components/ThemeSwitch.tsx
git mv src/components/Tooltip.tsx apps/landing/src/components/Tooltip.tsx
git mv src/components/mdx.tsx apps/landing/src/components/mdx.tsx

# Lib files (landing-specific)
git mv src/lib/use-scroll.ts apps/landing/src/lib/use-scroll.ts

# Content
git mv src/content apps/landing/src/content

# Public assets
git mv public apps/landing/public
```

**Step 7: Update imports in landing app files**

All files that previously imported from `@/lib/i18n`, `@/components/I18nProvider`, `@/components/AnalyticsTracker`, `@/components/providers/LenisProvider`, `@/hooks/*`, `@/lib/utils`, or `@/locales/*` must be updated to import from `@repo/shared/*`.

Key files to update:

**`apps/landing/middleware.ts`:**
```typescript
// BEFORE:
import { cookieName, defaultLocale, type Locale, locales } from '@/lib/i18n'

// AFTER:
import { cookieName, defaultLocale, type Locale, locales } from '@repo/shared/i18n'
```

**`apps/landing/src/app/layout.tsx`:**
```typescript
// BEFORE:
import { LenisProvider } from '@/components/providers/LenisProvider'

// AFTER:
import { LenisProvider } from '@repo/shared/components/LenisProvider'
```

**`apps/landing/src/app/page.tsx`:**
```typescript
// BEFORE:
import { cookieName, defaultLocale, type Locale, locales } from '@/lib/i18n'

// AFTER:
import { cookieName, defaultLocale, type Locale, locales } from '@repo/shared/i18n'
```

**`apps/landing/src/app/[locale]/layout.tsx`:**
- Remove `RootProvider` from `fumadocs-ui/provider/next` (landing doesn't need fumadocs)
- Remove `provider` from `@/lib/i18n/fumadocs-ui`
- Add `ThemeProvider` from `next-themes` for dark mode support
- Update imports:

```typescript
// BEFORE:
import { RootProvider } from 'fumadocs-ui/provider/next'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { I18nProvider } from '@/components/I18nProvider'
import { type Locale, locales } from '@/lib/i18n'
import { provider } from '@/lib/i18n/fumadocs-ui'

// AFTER:
import { ThemeProvider } from 'next-themes'
import { AnalyticsTracker } from '@repo/shared/components/AnalyticsTracker'
import { I18nProvider } from '@repo/shared/components/I18nProvider'
import { type Locale, locales } from '@repo/shared/i18n'
```

And the component body:
```tsx
// BEFORE:
<RootProvider i18n={provider(locale)}>
  <I18nProvider locale={locale}>
    <AnalyticsTracker />
    {children}
  </I18nProvider>
</RootProvider>

// AFTER:
<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
  <I18nProvider locale={locale}>
    <AnalyticsTracker />
    {children}
  </I18nProvider>
</ThemeProvider>
```

**`apps/landing/src/app/globals.css`:**
Remove fumadocs-specific CSS imports (lines 2-5):
```css
/* REMOVE these lines: */
@import "fumadocs-ui/css/neutral.css";
@import "fumadocs-ui/css/preset.css";
@source "../node_modules/fumadocs-ui/dist/**/*.js";
```

**All component files using `@/lib/utils`** — update to:
```typescript
import { cx, cn } from '@repo/shared/utils'
```

**All component files using `useLocale`/`useTranslation`** — update to:
```typescript
import { useLocale, useTranslation } from '@repo/shared/i18n/client'
```

**Step 8: Verify no remaining `@/lib/i18n`, `@/components/I18nProvider`, `@/components/AnalyticsTracker`, `@/components/providers/LenisProvider`, `@/hooks/`, `@/lib/utils`, or `@/locales/` imports exist in apps/landing/**

Run:
```bash
grep -r "@/lib/i18n\|@/components/I18nProvider\|@/components/AnalyticsTracker\|@/components/providers/LenisProvider\|@/hooks/\|@/lib/utils\|@/locales/" apps/landing/src/
```
This should return no results.

**Step 9: Commit**

```bash
git add apps/landing/
git commit -m "feat: create apps/landing with marketing pages and updated imports"
```

---

### Task 4: Create apps/docs

**Files:**
- Create: `apps/docs/package.json`
- Create: `apps/docs/tsconfig.json`
- Create: `apps/docs/next.config.mjs`
- Create: `apps/docs/postcss.config.mjs`
- Create: `apps/docs/middleware.ts` (simplified version for docs)
- Move: `source.config.ts` → `apps/docs/source.config.ts`
- Move: `mdx-components.tsx` → `apps/docs/mdx-components.tsx`
- Create: `apps/docs/instrumentation-client.ts`
- Create: `apps/docs/src/app/globals.css` (docs-specific)
- Create: `apps/docs/src/app/layout.tsx` (docs root layout)
- Create: `apps/docs/src/app/page.tsx` (locale redirect)
- Move: `src/app/[locale]/docs/layout.tsx` → `apps/docs/src/app/[locale]/layout.tsx` (becomes locale layout)
- Move: `src/app/[locale]/docs/[[...slug]]/page.tsx` → `apps/docs/src/app/[locale]/[[...slug]]/page.tsx`
- Move: `src/app/api/search/` → `apps/docs/src/app/api/search/`
- Move: `src/lib/source.ts` → `apps/docs/src/lib/source.ts`
- Move: `src/lib/layout.shared.tsx` → `apps/docs/src/lib/layout.shared.tsx`
- Move: `src/lib/i18n/fumadocs.ts` → `apps/docs/src/lib/i18n/fumadocs.ts`
- Move: `src/lib/i18n/fumadocs-ui.ts` → `apps/docs/src/lib/i18n/fumadocs-ui.ts`
- Move: `content/docs/` → `apps/docs/content/docs/`

**Step 1: Create directory structure**

```bash
mkdir -p apps/docs/src/{app/\[locale\]/\[\[...slug\]\],app/api/search,lib/i18n}
mkdir -p apps/docs/content
```

**Step 2: Create apps/docs/package.json**

```json
{
  "name": "@repo/docs",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --port 3001",
    "build": "next build",
    "start": "next start",
    "check": "ultracite check",
    "fix": "ultracite fix"
  },
  "dependencies": {
    "@orama/tokenizers": "^3.1.18",
    "@repo/shared": "workspace:*",
    "@tailwindcss/postcss": "^4.2.1",
    "@types/mdx": "^2.0.13",
    "@vercel/analytics": "^1.4.1",
    "@vercel/speed-insights": "^1.1.0",
    "fumadocs-core": "^16.6.7",
    "fumadocs-mdx": "^14.2.8",
    "fumadocs-ui": "^16.6.7",
    "next": "16.1.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "tailwindcss": "^4.2.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "@types/react": "19.2.10",
    "@types/react-dom": "19.2.3",
    "shiki": "^1.26.1",
    "typescript": "^5.7.3"
  }
}
```

**Step 3: Create apps/docs/tsconfig.json**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "fumadocs-mdx:collections/*": ["./.source/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    ".source/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

**Step 4: Create apps/docs/next.config.mjs**

```javascript
import { createMDX } from 'fumadocs-mdx/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/shared'],
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
  skipTrailingSlashRedirect: true
}

const withMDX = createMDX()

export default withMDX(nextConfig)
```

**Step 5: Create apps/docs/postcss.config.mjs**

```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
export default config
```

**Step 6: Create apps/docs/middleware.ts**

Same middleware as landing but without skipping `/images`:

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { cookieName, defaultLocale, type Locale, locales } from '@repo/shared/i18n'

function getLocaleFromHeaders(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language') || ''
  if (acceptLanguage.toLowerCase().includes('zh')) {
    return 'zh'
  }
  return defaultLocale
}

function getLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  if (locales.includes(potentialLocale as Locale)) {
    return potentialLocale as Locale
  }
  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const pathLocale = getLocaleFromPath(pathname)
  if (pathLocale) {
    const response = NextResponse.next()
    response.cookies.set(cookieName, pathLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365
    })
    return response
  }

  const cookieLocale = request.cookies.get(cookieName)?.value as Locale | undefined
  const locale =
    cookieLocale && locales.includes(cookieLocale) ? cookieLocale : getLocaleFromHeaders(request)

  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`

  const response = NextResponse.redirect(url)
  response.cookies.set(cookieName, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365
  })
  return response
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|.*\\..*).*)']
}
```

**Step 7: Create apps/docs/instrumentation-client.ts**

```typescript
import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: '/ingest',
  ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2025-11-30',
  capture_exceptions: true,
  capture_performance: { web_vitals: true },
  debug: process.env.NODE_ENV === 'development'
})
```

**Step 8: Create apps/docs/src/app/globals.css**

Docs-specific globals with fumadocs CSS:

```css
@import "tailwindcss";
@import "fumadocs-ui/css/neutral.css";
@import "fumadocs-ui/css/preset.css";

@source "../node_modules/fumadocs-ui/dist/**/*.js";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-sans-zh:
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei",
    sans-serif;
}

html[lang="en"],
html[lang="en"] body {
  font-family: var(--font-inter), system-ui, sans-serif;
}

html[lang="zh"],
html[lang="zh"] body {
  font-family:
    "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei",
    sans-serif;
}
```

**Step 9: Create apps/docs/src/app/layout.tsx**

```tsx
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  metadataBase: new URL('https://docs.dockerman.app'),
  title: 'Dockerman Docs',
  description: 'Documentation for Dockerman - Modern Docker Management UI'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

**Step 10: Create apps/docs/src/app/page.tsx**

```tsx
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { cookieName, defaultLocale, type Locale, locales } from '@repo/shared/i18n'

export default async function RootPage() {
  const cookieStore = await cookies()
  const headerStore = await headers()

  const cookieLocale = cookieStore.get(cookieName)?.value as Locale | undefined

  if (cookieLocale && locales.includes(cookieLocale)) {
    redirect(`/${cookieLocale}`)
  }

  const acceptLanguage = headerStore.get('accept-language') || ''
  const locale = acceptLanguage.toLowerCase().includes('zh') ? 'zh' : defaultLocale

  redirect(`/${locale}`)
}
```

**Step 11: Move remaining source files**

```bash
# Source config and MDX
git mv source.config.ts apps/docs/source.config.ts
git mv mdx-components.tsx apps/docs/mdx-components.tsx

# Docs route files
git mv src/app/[locale]/docs/layout.tsx apps/docs/src/app/[locale]/layout.tsx
git mv src/app/[locale]/docs/[[...slug]] apps/docs/src/app/[locale]/[[...slug]]

# API search
git mv src/app/api/search apps/docs/src/app/api/search

# Docs lib files
git mv src/lib/source.ts apps/docs/src/lib/source.ts
git mv src/lib/layout.shared.tsx apps/docs/src/lib/layout.shared.tsx
git mv src/lib/i18n/fumadocs.ts apps/docs/src/lib/i18n/fumadocs.ts
git mv src/lib/i18n/fumadocs-ui.ts apps/docs/src/lib/i18n/fumadocs-ui.ts

# Content
git mv content/docs apps/docs/content/docs
```

**Step 12: Create apps/docs/src/app/[locale]/layout.tsx** (docs locale layout — wraps the docs layout)

This is a new file that combines the old `[locale]/layout.tsx` (i18n + analytics) and references the docs layout:

```tsx
import { RootProvider } from 'fumadocs-ui/provider/next'
import { AnalyticsTracker } from '@repo/shared/components/AnalyticsTracker'
import { I18nProvider } from '@repo/shared/components/I18nProvider'
import { type Locale, locales } from '@repo/shared/i18n'
import { provider } from '@/lib/i18n/fumadocs-ui'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale

  const titles: Record<Locale, string> = {
    en: 'Dockerman Docs',
    zh: 'Dockerman 文档'
  }

  const descriptions: Record<Locale, string> = {
    en: 'Documentation for Dockerman - Modern Docker Management UI',
    zh: '基于 Tauri 和 Rust 构建的现代轻量级 Docker 管理界面文档'
  }

  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      locale: locale === 'zh' ? 'zh_CN' : 'en_US'
    }
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale

  return (
    <RootProvider i18n={provider(locale)}>
      <I18nProvider locale={locale}>
        <AnalyticsTracker />
        {children}
      </I18nProvider>
    </RootProvider>
  )
}
```

**BUT WAIT** — We just `git mv`'d the old `src/app/[locale]/docs/layout.tsx` to `apps/docs/src/app/[locale]/layout.tsx`. That old file was the DocsLayout wrapper. We need to reorganize:

The old `src/app/[locale]/docs/layout.tsx` (DocsLayout) should become a docs page layout, and we need a NEW `[locale]/layout.tsx` for i18n/analytics wrapping.

So the correct approach is:

1. The `git mv` above moves old docs layout → `apps/docs/src/app/[locale]/layout.tsx`
2. But we need to **overwrite** it with the new locale layout (shown above)
3. Create a separate `apps/docs/src/app/[locale]/docs-layout.tsx` — actually, we can restructure the docs app routes:

**Better approach**: Use a route group to keep the DocsLayout wrapping:

```
apps/docs/src/app/[locale]/
├── layout.tsx              ← NEW: i18n + analytics + RootProvider
└── [[...slug]]/
    ├── layout.tsx          ← MOVED: old docs/layout.tsx (DocsLayout wrapper)
    └── page.tsx            ← MOVED: old docs/[[...slug]]/page.tsx
```

So actually, we should:
1. Move old `docs/layout.tsx` → `apps/docs/src/app/[locale]/[[...slug]]/layout.tsx` — wait, that doesn't make sense with catch-all routes.

**Simplest approach**: Merge the DocsLayout into the `[locale]/layout.tsx`:

```tsx
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { RootProvider } from 'fumadocs-ui/provider/next'
import type { ReactNode } from 'react'
import { AnalyticsTracker } from '@repo/shared/components/AnalyticsTracker'
import { I18nProvider } from '@repo/shared/components/I18nProvider'
import { type Locale, locales } from '@repo/shared/i18n'
import { provider } from '@/lib/i18n/fumadocs-ui'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale

  const titles: Record<Locale, string> = {
    en: 'Dockerman Docs',
    zh: 'Dockerman 文档'
  }

  return {
    title: titles[locale]
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = rawLocale as Locale

  return (
    <RootProvider i18n={provider(locale)}>
      <I18nProvider locale={locale}>
        <AnalyticsTracker />
        <DocsLayout tree={source.getPageTree(locale)} {...baseOptions(locale)} i18n>
          {children}
        </DocsLayout>
      </I18nProvider>
    </RootProvider>
  )
}
```

This replaces the file that was `git mv`'d in Step 11.

**Step 13: Update imports in docs source files**

**`apps/docs/src/lib/i18n/fumadocs-ui.ts`:**
```typescript
// BEFORE:
import { i18n } from '@/lib/i18n/fumadocs'

// AFTER: (stays the same, @/ now points to apps/docs/src/)
import { i18n } from '@/lib/i18n/fumadocs'
```
No change needed — `@/` resolves within the app.

**`apps/docs/src/app/api/search/route.ts`:**
No import changes needed — `@/lib/source` resolves within the app.

**`apps/docs/src/app/[locale]/[[...slug]]/page.tsx`:**
No import changes needed — `@/lib/source` resolves within the app.

**Step 14: Copy shared public assets to docs**

```bash
mkdir -p apps/docs/public
cp apps/landing/public/logo.svg apps/docs/public/
```

**Step 15: Commit**

```bash
git add apps/docs/
git commit -m "feat: create apps/docs with documentation site and Fumadocs integration"
```

---

### Task 5: Clean up old root-level files

**Files to remove:**
- `src/` directory (now empty or has moved files)
- `content/` directory (if empty)
- `middleware.ts` (moved to apps/landing)
- `instrumentation-client.ts` (moved to apps/landing)
- `source.config.ts` (moved to apps/docs)
- `mdx-components.tsx` (moved to apps/docs)
- `postcss.config.mjs` (each app has its own)
- `next.config.mjs` (each app has its own)
- `.env.example` (copy to apps/ if needed)
- `public/` (moved to apps/landing)

**Step 1: Remove old source directories and files**

```bash
# Remove any remaining files in old locations
rm -rf src/
rm -rf content/
rm -f next.config.mjs postcss.config.mjs
rm -f .env.example
```

Note: Files that were `git mv`'d are already gone from old locations. Only remove leftover directories and files that were copied (not moved).

**Step 2: Update .gitignore**

Add workspace-specific ignores if needed:

```
# Turborepo
.turbo
```

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: clean up old root-level files after monorepo migration"
```

---

### Task 6: Install dependencies and verify builds

**Step 1: Install all workspace dependencies**

```bash
bun install
```

This should resolve all workspace dependencies including `@repo/shared` links.

**Step 2: Verify packages/shared TypeScript**

```bash
cd packages/shared && bunx tsc --noEmit
```

Expected: No TypeScript errors.

**Step 3: Build apps/landing**

```bash
cd apps/landing && bun run build
```

Expected: Next.js build succeeds.

**Step 4: Build apps/docs**

```bash
cd apps/docs && bun run build
```

Expected: Next.js build succeeds with Fumadocs MDX compilation.

**Step 5: Test Turborepo pipeline**

```bash
bun run build
```

Expected: Both apps build successfully via Turborepo.

**Step 6: Test dev servers**

```bash
bun run dev
```

Expected: Landing starts on port 3000, docs on port 3001. Both load correctly.

**Step 7: Fix any remaining import issues**

If builds fail, check error messages for:
- Missing `@repo/shared/*` imports (update the exports field or fix import paths)
- Missing dependencies (add to the correct app's package.json)
- Path alias resolution issues (check tsconfig.json paths)

**Step 8: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build issues after monorepo migration"
```

---

### Task 7: Final verification and commit

**Step 1: Run code quality checks**

```bash
bun run check
```

**Step 2: Verify final structure**

```bash
ls -la apps/landing/src/app/
ls -la apps/docs/src/app/
ls -la packages/shared/src/
```

**Step 3: Create final commit if needed**

```bash
git add -A
git commit -m "chore: finalize monorepo migration"
```

---

## Summary of Import Mapping

For quick reference when updating imports across the codebase:

| Old Import | New Import |
|-----------|-----------|
| `@/lib/i18n` | `@repo/shared/i18n` |
| `@/lib/i18n/client` | `@repo/shared/i18n/client` |
| `@/lib/i18n/server` | `@repo/shared/i18n/server` |
| `@/lib/i18n/settings` | `@repo/shared/i18n/settings` |
| `@/lib/utils` | `@repo/shared/utils` |
| `@/components/I18nProvider` | `@repo/shared/components/I18nProvider` |
| `@/components/providers/LenisProvider` | `@repo/shared/components/LenisProvider` |
| `@/components/AnalyticsTracker` | `@repo/shared/components/AnalyticsTracker` |
| `@/hooks/usePageEngaged` | `@repo/shared/hooks/usePageEngaged` |
| `@/hooks/useScrollDepth` | `@repo/shared/hooks/useScrollDepth` |
| `@/locales/*` | (handled internally by @repo/shared) |

Imports that stay as `@/*` (resolve within each app):
- `@/app/siteConfig` (landing only)
- `@/lib/source` (docs only)
- `@/lib/layout.shared` (docs only)
- `@/lib/i18n/fumadocs` (docs only)
- `@/lib/i18n/fumadocs-ui` (docs only)
- `@/lib/use-scroll` (landing only)
- `@/components/*` (app-specific components)
