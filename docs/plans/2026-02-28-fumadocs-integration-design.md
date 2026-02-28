# Fumadocs Documentation System Integration Design

## Overview

Integrate fumadocs into the Dockerman marketing website to provide a product documentation system for users. Documents will live under `/[locale]/docs/...` with full en/zh i18n support. The docs site uses fumadocs' own UI (DocsLayout with sidebar, search, TOC) — completely independent from the marketing pages' layout.

## Requirements

- Product user documentation (usage guides, feature docs, FAQ)
- Bilingual support: English and Chinese (`en`, `zh`)
- URL pattern: `/en/docs/getting-started`, `/zh/docs/getting-started`
- Independent layout from marketing pages (fumadocs UI)
- Built-in search capability
- Tailwind CSS v4 upgrade (required by fumadocs)

## Architecture

### Approach: Nested under `[locale]` route (Option A)

Docs routes are nested inside the existing `[locale]` dynamic segment. The existing middleware handles locale detection and redirection. Fumadocs provides its own DocsLayout with sidebar, search, and table of contents.

```
User visits /en/docs/getting-started
  → middleware recognizes locale (existing logic, unchanged)
  → [locale]/docs/layout.tsx renders fumadocs DocsLayout
  → [locale]/docs/[[...slug]]/page.tsx renders MDX content
```

### Why this approach

- Consistent with existing `[locale]` routing structure
- Reuses existing locale middleware — no middleware changes
- Clean separation: fumadocs layout for docs, existing layout for marketing
- Most natural URL pattern (`/en/docs/...`)

## Dependency Changes

### Upgrade

| Package | From | To | Notes |
|---------|------|----|-------|
| `tailwindcss` | v3.4 | v4 | Required by fumadocs |
| `postcss` | v8.4 | Remove | Tailwind v4 has built-in PostCSS |

### Add

| Package | Purpose |
|---------|---------|
| `fumadocs-core` | Core library (source loader, search, i18n) |
| `fumadocs-ui` | UI components (DocsLayout, DocsPage, etc.) |
| `fumadocs-mdx` | MDX content source with hot reload |
| `@types/mdx` | Already present |

### Remove

| Package | Reason |
|---------|--------|
| `@tailwindcss/forms` | Needs new import method in v4 |

### Keep

| Package | Notes |
|---------|-------|
| `@next/mdx` | Still used for changelog pages |
| `tailwind-merge` | v2 compatible with Tailwind v4 |
| `tailwind-variants` | Compatible with Tailwind v4 |
| `next-themes` | Replaced by fumadocs RootProvider for docs, kept for marketing pages |

## File Structure

```
marseille/
├── source.config.ts                          # NEW: fumadocs MDX config
├── content/
│   └── docs/                                 # NEW: documentation MDX content
│       ├── index.mdx                         # Docs landing page
│       ├── getting-started.mdx               # English content (default)
│       ├── zh/                               # Chinese translations
│       │   ├── index.mdx
│       │   └── getting-started.mdx
│       └── ...
├── src/
│   ├── lib/
│   │   ├── source.ts                         # NEW: fumadocs source loader
│   │   └── layout.shared.tsx                 # NEW: shared layout options
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── docs/
│   │   │   │   ├── layout.tsx                # NEW: fumadocs DocsLayout
│   │   │   │   └── [[...slug]]/
│   │   │   │       └── page.tsx              # NEW: docs page renderer
│   │   │   ├── page.tsx                      # UNCHANGED: homepage
│   │   │   └── ...                           # UNCHANGED: other marketing pages
│   │   ├── api/
│   │   │   └── search/
│   │   │       └── route.ts                  # NEW: docs search API (Orama)
│   │   ├── layout.tsx                        # MODIFY: add RootProvider
│   │   └── globals.css                       # MODIFY: add fumadocs styles
│   └── mdx-components.tsx                    # MODIFY: add fumadocs defaults
├── next.config.mjs                           # MODIFY: fumadocs MDX plugin
├── tsconfig.json                             # MODIFY: add path alias
├── postcss.config.mjs                        # MODIFY: update for v4
└── tailwind.config.ts                        # MIGRATE: to CSS-based config (v4)
```

## Key Integration Points

### 1. next.config.mjs

Replace `@next/mdx` with fumadocs' `createMDX` plugin. The fumadocs MDX plugin handles both fumadocs content and regular MDX files (changelog), so `@next/mdx` can be removed.

```typescript
import { createMDX } from 'fumadocs-mdx/next';

const config = {
  // existing config preserved
};

const withMDX = createMDX();
export default withMDX(config);
```

### 2. source.config.ts

Fumadocs MDX content source configuration:

```typescript
import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig();
```

### 3. lib/source.ts

Source loader with i18n support:

```typescript
import { docs } from 'fumadocs-mdx:collections/server';
import { loader } from 'fumadocs-core/source';
import { i18n } from '@/lib/i18n/fumadocs';

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  i18n,
});
```

### 4. i18n Coordination

Two i18n systems coexist without conflict:

- **Existing i18next/react-i18next**: Handles marketing page translations (JSON-based)
- **Fumadocs i18n**: Handles document content language switching (file-based, `content/docs/zh/`)

A thin adapter in `lib/i18n/fumadocs.ts`:

```typescript
import { defineI18n } from 'fumadocs-core/i18n';

export const i18n = defineI18n({
  languages: ['en', 'zh'],
  defaultLanguage: 'en',
});
```

The existing middleware already handles locale routing. Fumadocs reads the `[locale]` param from the route — no middleware changes needed.

### 5. Root Layout (app/layout.tsx)

Wrap with fumadocs RootProvider alongside existing ThemeProvider:

```typescript
import { RootProvider } from 'fumadocs-ui/provider/next';

// RootProvider wraps ThemeProvider or replaces it
// (fumadocs RootProvider includes theme support)
```

### 6. Docs Layout (app/[locale]/docs/layout.tsx)

```typescript
import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';

export default async function Layout({ children, params }) {
  const { locale } = await params;
  return (
    <DocsLayout tree={source.getPageTree(locale)} nav={{ title: 'Dockerman Docs' }}>
      {children}
    </DocsLayout>
  );
}
```

### 7. Docs Page (app/[locale]/docs/[[...slug]]/page.tsx)

```typescript
import { source } from '@/lib/source';
import { DocsBody, DocsPage, DocsTitle, DocsDescription } from 'fumadocs-ui/layouts/docs/page';
import { getMDXComponents } from '@/mdx-components';
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const { locale, slug } = await params;
  const page = source.getPage(slug, locale);
  if (!page) notFound();
  const MDX = page.data.body;
  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
```

### 8. Search API (app/api/search/route.ts)

```typescript
import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const { GET } = createFromSource(source);
```

### 9. Styles (globals.css)

Tailwind v4 migration + fumadocs styles:

```css
@import 'tailwindcss';
@import 'fumadocs-ui/css/neutral.css';
@import 'fumadocs-ui/css/preset.css';

/* Existing custom styles preserved */
```

### 10. mdx-components.tsx

Merge fumadocs defaults with existing changelog components:

```typescript
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
// Keep existing changelog components for changelog pages

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
  };
}

// Keep existing useMDXComponents for changelog compatibility
export function useMDXComponents(components: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...components,
  };
}
```

## Tailwind CSS v3 → v4 Migration

### Changes Required

1. **globals.css**: `@tailwind base/components/utilities` → `@import 'tailwindcss'`
2. **Config migration**: Move `tailwind.config.ts` customizations to CSS or use `@config` directive
3. **postcss.config.mjs**: Update plugin configuration for v4
4. **`darkMode: 'selector'`**: Default in v4, no extra config needed
5. **`@tailwindcss/forms`**: Import via CSS `@import` in v4
6. **`@apply` directives (6 instances)**: All standard utilities, no changes needed

### Risk Assessment

- 571 className instances — all standard syntax, v4 compatible
- 6 @apply usages — simple utility combinations, safe
- Custom animations/keyframes — theme.extend pattern unchanged
- tailwind-merge v2 / tailwind-variants v0.3 — compatible with v4

## Content Organization

```
content/docs/
├── index.mdx                    # Welcome / Overview
├── getting-started.mdx          # Installation & Quick Start
├── features/
│   ├── containers.mdx           # Container Management
│   ├── images.mdx               # Image Management
│   ├── monitoring.mdx           # Resource Monitoring
│   └── terminal.mdx             # Terminal Access
├── guides/
│   ├── first-container.mdx      # Create Your First Container
│   └── ...
├── zh/                          # Chinese translations
│   ├── index.mdx
│   ├── getting-started.mdx
│   ├── features/
│   │   ├── containers.mdx
│   │   └── ...
│   └── guides/
│       └── ...
└── meta.json                    # Page tree ordering
```

## Testing Strategy

1. Verify existing marketing pages still render correctly after Tailwind v4 upgrade
2. Verify docs pages render with fumadocs layout
3. Verify locale switching works for both marketing and docs pages
4. Verify search functionality
5. Verify dark/light theme works across both marketing and docs
6. Build succeeds without errors
