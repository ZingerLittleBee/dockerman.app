# Landing App: Japanese & Spanish i18n Support

## Overview

Extend the existing i18n architecture of the landing app to support Japanese (ja) and Spanish (es), in addition to the current English (en) and Chinese (zh). This covers both UI translations (458 JSON keys) and documentation content (MDX files).

## Approach

**Direct extension of the existing architecture** — no new dependencies, no structural changes. The current i18next + react-i18next setup is mature and proven. We add two new locales by following the exact same patterns used for `zh`.

## Design

### 1. i18n Configuration Layer

#### Locale Settings (`@repo/shared/src/i18n/settings.ts`)

```typescript
export const locales = ['en', 'zh', 'ja', 'es'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const localeConfig: Record<Locale, { flag: string; name: string }> = {
  en: { flag: '🇺🇸', name: 'English' },
  zh: { flag: '🇨🇳', name: '中文' },
  ja: { flag: '🇯🇵', name: '日本語' },
  es: { flag: '🇪🇸', name: 'Español' },
}
```

#### Client Resources (`@repo/shared/src/i18n/client.ts`)

Synchronously import the new JSON files:

```typescript
import en from '../locales/en.json'
import zh from '../locales/zh.json'
import ja from '../locales/ja.json'
import es from '../locales/es.json'

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  ja: { translation: ja },
  es: { translation: es },
}
```

#### Middleware Language Detection (`apps/landing/middleware.ts`)

Extend `getLocaleFromHeaders` to detect Japanese and Spanish:

```typescript
function getLocaleFromHeaders(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language') || ''
  const lang = acceptLanguage.toLowerCase()
  if (lang.includes('zh')) return 'zh'
  if (lang.includes('ja')) return 'ja'
  if (lang.includes('es')) return 'es'
  return defaultLocale
}
```

Detection priority: zh > ja > es > en (default).

#### Root Page Redirect (`apps/landing/src/app/page.tsx`)

Update the redirect logic to recognize `ja` and `es` from cookie or Accept-Language header.

#### Fumadocs i18n (`src/lib/i18n/fumadocs.ts`)

```typescript
export const i18n = defineI18n({
  languages: ['en', 'zh', 'ja', 'es'],
  defaultLanguage: 'en',
  parser: 'dir',
  hideLocale: 'never'
})
```

#### Fumadocs UI Strings (`src/lib/i18n/fumadocs-ui.ts`)

```typescript
ja: {
  displayName: '日本語',
  search: 'ドキュメントを検索',
  searchNoResult: '結果が見つかりません',
  toc: 'ページの内容',
  tocNoHeadings: '見出しがありません',
  lastUpdate: '最終更新',
  chooseLanguage: '言語を選択',
  nextPage: '次のページ',
  previousPage: '前のページ',
  chooseTheme: 'テーマ',
  editOnGithub: 'GitHubで編集'
},
es: {
  displayName: 'Español',
  search: 'Buscar documentación',
  searchNoResult: 'No se encontraron resultados',
  toc: 'Contenido de la página',
  tocNoHeadings: 'Sin encabezados',
  lastUpdate: 'Última actualización',
  chooseLanguage: 'Elegir idioma',
  nextPage: 'Siguiente',
  previousPage: 'Anterior',
  chooseTheme: 'Tema',
  editOnGithub: 'Editar en GitHub'
}
```

### 2. Translation Files

#### UI Translations

New files, AI-translated from `en.json` (not `zh.json`) to avoid second-hand translation drift:

- `@repo/shared/src/locales/ja.json` — 458 keys, natural polite form (です/ます)
- `@repo/shared/src/locales/es.json` — 458 keys, neutral Latin American Spanish

#### Documentation MDX Content

Mirror the full `en/` directory structure:

```
content/docs/
├── en/          (existing)
├── zh/          (existing)
├── ja/          (new — Japanese translations)
│   ├── meta.json
│   ├── index.mdx
│   ├── getting-started.mdx
│   ├── guides/
│   ├── platform/
│   └── reference/
└── es/          (new — Spanish translations)
    ├── meta.json
    ├── index.mdx
    ├── getting-started.mdx
    ├── guides/
    ├── platform/
    └── reference/
```

Each MDX file is translated from its `en/` counterpart. Frontmatter structure and component references are preserved unchanged.

### 3. Language Switcher Redesign

Redesign `LanguageSwitcher.tsx` to display flag emoji + full language name.

**Trigger button:** Shows current language flag + name (e.g., `🇺🇸 English`)

**Dropdown options:**

| Value | Display |
|---|---|
| `en` | 🇺🇸 English |
| `zh` | 🇨🇳 中文 |
| `ja` | 🇯🇵 日本語 |
| `es` | 🇪🇸 Español |

Reads display data from `localeConfig` in settings.ts — no hardcoded values. PostHog `locale_changed` tracking remains unchanged.

### 4. Routing

No new routing logic needed. The existing `[locale]` dynamic segment and middleware handle new locales automatically. New URLs:

- `/ja`, `/ja/pricing`, `/ja/docs/getting-started` ...
- `/es`, `/es/pricing`, `/es/docs/getting-started` ...

### 5. Error Handling

- Unknown locale paths (e.g., `/fr/pricing`) fall back to `en` via middleware
- Missing translation keys fall back to `en` via i18next `fallbackLng`
- `I18nProvider` already sets `document.documentElement.lang` — works automatically for new locales

## Files Changed

| File | Change Type |
|---|---|
| `packages/shared/src/i18n/settings.ts` | Modify — add ja/es, add localeConfig |
| `packages/shared/src/i18n/client.ts` | Modify — import ja/es JSON |
| `packages/shared/src/locales/ja.json` | New — 458 key Japanese translations |
| `packages/shared/src/locales/es.json` | New — 458 key Spanish translations |
| `apps/landing/middleware.ts` | Modify — language detection for ja/es |
| `apps/landing/src/app/page.tsx` | Modify — root redirect supports ja/es |
| `apps/landing/src/lib/i18n/fumadocs.ts` | Modify — languages array add ja/es |
| `apps/landing/src/lib/i18n/fumadocs-ui.ts` | Modify — add ja/es UI translations |
| `apps/landing/src/components/ui/LanguageSwitcher.tsx` | Modify — redesign with localeConfig |
| `apps/landing/content/docs/ja/**` | New — Japanese docs (mirror en/) |
| `apps/landing/content/docs/es/**` | New — Spanish docs (mirror en/) |

## Testing Strategy

- **Build verification:** `next build` to ensure all new pages generate correctly
- **Manual verification:** Visit `/ja` and `/es` paths, confirm translation rendering, language switching, cookie persistence
- **Key consistency check:** Script to verify all 458 keys exist in ja.json and es.json
