# Monorepo Migration Design

## Overview

Migrate the dockerman single Next.js app into a Turborepo monorepo, splitting into two apps (`landing` and `docs`) with a shared package for genuinely shared code.

## Target Structure

```
tacoma-v2/
├── apps/
│   ├── landing/              # Marketing landing page (Next.js)
│   └── docs/                 # Documentation site (Next.js + Fumadocs)
├── packages/
│   └── shared/               # @repo/shared - only truly shared code
├── turbo.json
├── package.json              # Root workspace config
├── biome.jsonc               # Shared code quality config
└── tsconfig.json             # Root TypeScript config
```

### apps/landing

Contains all marketing pages and their dedicated components:

- Routes: `[locale]/(main)/` — home, about, download, pricing, changelog, privacy, terms, dpa
- API routes: `api/checkout`, `api/changelog`
- Components: Navbar, Footer, Hero, Features, Faqs, PricingCard, Button, Badge, Accordion, etc.
- Libs: `use-scroll.ts`, `siteConfig.ts`
- Content: `content/changelog/`

### apps/docs

Contains the documentation site powered by Fumadocs:

- Routes: `[locale]/docs/[[...slug]]`
- API routes: `api/search`
- Libs: `source.ts`, `layout.shared.tsx`, `i18n/fumadocs.ts`, `i18n/fumadocs-ui.ts`
- Content: `content/docs/` (MDX files)
- Config: `source.config.ts`, `mdx-components.tsx`

### packages/shared (@repo/shared)

Only code that is **actually used by both apps**:

```
packages/shared/src/
├── i18n/
│   ├── index.ts          # Re-exports
│   ├── client.ts         # useLocale, useTranslation hooks
│   ├── server.ts         # Server-side i18n
│   └── settings.ts       # locales, defaultLocale config
├── hooks/
│   ├── usePageEngaged.ts # Page engagement tracking
│   └── useScrollDepth.ts # Scroll depth tracking
├── components/
│   ├── I18nProvider.tsx   # i18next provider wrapper
│   ├── LenisProvider.tsx  # Smooth scroll provider
│   └── AnalyticsTracker.tsx # PostHog analytics tracker
├── locales/
│   ├── en.json           # English translations
│   └── zh.json           # Chinese translations
└── utils.ts              # cx, cn, focusRing utilities
```

## Key Design Decisions

### 1. Tooling: Turborepo + Bun workspaces

- Turborepo for build orchestration and caching
- Bun workspaces for dependency management (already using Bun)
- Minimal configuration overhead

### 2. Shared package: TypeScript source imports

- No build step for `@repo/shared` — apps import TypeScript source directly
- Each app uses `transpilePackages: ["@repo/shared"]` in next.config.mjs
- Exports via `package.json` `exports` field with TypeScript paths

### 3. Only extract genuinely shared code

Principle: **if only one app uses it, it stays in that app**. The shared analysis shows:

| Module | Landing | Docs | Shared? |
|--------|---------|------|---------|
| i18n core (settings, client, server) | Yes | Yes | Yes |
| utils.ts (cx, cn, focusRing) | Yes | Yes | Yes |
| AnalyticsTracker + hooks | Yes | Yes | Yes |
| I18nProvider | Yes | Yes | Yes |
| LenisProvider | Yes | Yes | Yes |
| locales (en.json, zh.json) | Yes | Yes | Yes |
| Navbar, Footer | Yes | No | No |
| Button, Badge, Accordion | Yes | No | No |
| Fumadocs i18n adapters | No | Yes | No |
| source.ts, layout.shared.tsx | No | Yes | No |

### 4. Shared biome.jsonc at root

Both apps inherit the root `biome.jsonc` config.

## Dependency Distribution

| Dependency | Landing | Docs | Shared |
|-----------|---------|------|--------|
| next, react, react-dom | Yes | Yes | peer |
| fumadocs-core/mdx/ui | - | Yes | - |
| gsap, @gsap/react, motion | Yes | - | - |
| lenis | - | - | Yes |
| @radix-ui/* | Yes | - | - |
| i18next, react-i18next | - | - | Yes |
| posthog-js | - | - | Yes |
| tailwindcss, @tailwindcss/* | Yes | Yes | - |
| clsx, tailwind-merge | - | - | Yes |
| @vercel/analytics, speed-insights | Yes | Yes | - |
| cobe | Yes | - | - |
| shiki | - | Yes | - |

## Migration Strategy

1. Create root workspace config (package.json, turbo.json, tsconfig.json)
2. Create `packages/shared` with genuinely shared code
3. Create `apps/landing` — move landing-specific code
4. Create `apps/docs` — move docs-specific code
5. Update all import paths in both apps
6. Configure Turborepo pipelines (dev, build, check)
7. Verify both apps build and run independently
8. Clean up old root-level app files
