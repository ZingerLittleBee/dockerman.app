---
name: update-version
description: Update Dockerman version and changelog. Use when releasing a new version with changelog content in markdown format.
---

# Update Version Skill

Updates the Dockerman website with a new version release.

> **Single sources of truth:**
> - **Version** lives in `apps/landing/src/app/siteConfig.ts` `latestVersion`. All components (`Navbar`, `Hero`, `SnapshotHero`) and the `downloads.ts` `VERSION` constant import from it; locale `hero.eyebrow` / `hero.metaVersion` use the `{{version}}` placeholder.
> - **Release date** lives in `apps/landing/src/config/downloads.ts` `RELEASE_DATE` (ISO). It flows to the latest `history[]` entry, the Download page hero, and Hero `metaVersion` via `formatDate(downloadsConfig.latest.releaseDate, locale)` from `@/lib/format` + a `{{date}}` placeholder.
>
> **Do not** reintroduce hardcoded version or date strings in those files.
>
> The historical / per-release locations (changelog MDX entries, README badges, locale tagline highlight phrases, the `release-x-y-z` slug) still need per-release edits, because they describe a specific release rather than "the latest version".

## Input Format

User provides changelog content in markdown format:

```markdown
## vX.Y.Z

### ✨ Features

- 🔔 **Feature Name**: Description of the feature

### 🎨 Improvements

- ⚡ **Improvement Name**: Description
```

## Instructions

### 1. Extract Version Number and Date

Parse `vX.Y.Z` from the first `## vX.Y.Z` heading. Use today's date as the release date.

Prepare the date in these formats — you'll need them in different files:

| Format | Where used | Example (Apr 26, 2026) |
|--------|------------|------------------------|
| ISO `YYYY-MM-DD` | `downloads.ts` `RELEASE_DATE` (single source) | `2026-04-26` |
| en `Mon DD, YYYY` | en changelog, README badge | `Apr 26, 2026` |
| zh `YYYY 年 M 月 D 日` | zh changelog | `2026 年 4 月 26 日` |
| ja `YYYY 年 M 月 D 日` | ja changelog | `2026 年 4 月 26 日` |
| es `D de mes de YYYY` | es changelog | `26 de abril de 2026` |
| URL-encoded en | README release-date badge URL | `Apr%2026%2C%202026` |

> Hero `metaVersion` no longer needs a per-locale date string — it interpolates `{{date}}`, with `formatDate()` deriving the localized date from the ISO `RELEASE_DATE` automatically.

### 2. Update `apps/landing/src/app/siteConfig.ts` (single source of truth for version)

```typescript
latestVersion: 'X.Y.Z',  // no 'v' prefix
```

This automatically propagates to:
- `Navbar.tsx` brand badge (`v{siteConfig.latestVersion}`)
- `Hero.tsx` terminal animation line + `eyebrow` (interpolated via `{{version}}`) + `metaVersion` (interpolated via `{{version}}` and `{{date}}`)
- `SnapshotHero.tsx` `metaBuild` field
- `downloads.ts` `VERSION` constant + latest `history[]` entry

**Never** edit those files for the version literal — they already read `siteConfig.latestVersion` or `{{version}}`.

### 3. Update `apps/landing/src/config/downloads.ts`

Two edits per release:

1. Bump `RELEASE_DATE` to the new ISO date.
2. Prepend a new entry to `history[]` (keep prior entries):

```typescript
history: [
  { version: VERSION, date: RELEASE_DATE, summarySlug: 'release-x-y-z' },
  // ...previous entries (literal versions/dates — these are historical)
]
```

The latest history entry uses the `VERSION` and `RELEASE_DATE` constants directly. Older entries remain literal.

### 4. Update Locale Files in `packages/shared/src/locales/`

Update all four (`en.json`, `zh.json`, `ja.json`, `es.json`). Two keys per file:

- **`hero.eyebrow`** — keep the `v{{version}} — ` prefix; rewrite the highlight phrases for the new release (translated per locale).

  Pattern: `"v{{version}} — <highlight 1>, <highlight 2>, <highlight 3>"`

- **`hero.metaVersion`** — pure template `"v{{version}} · {{date}}"`. **Do not edit per release** — both placeholders are filled at runtime from `siteConfig.latestVersion` and `formatDate(downloadsConfig.latest.releaseDate, locale)`.

The `{{version}}` placeholder is filled with `siteConfig.latestVersion` and `{{date}}` with the localized release date, so don't write either literal here.

### 5. Convert Markdown to MDX and Prepend to All Four Changelog Locales

Per-locale changelog files (translate body for zh/ja/es):

- `apps/landing/src/content/changelog/en/page.mdx`
- `apps/landing/src/content/changelog/zh/page.mdx`
- `apps/landing/src/content/changelog/ja/page.mdx`
- `apps/landing/src/content/changelog/es/page.mdx`

#### Conversion rules

1. Wrap with `<ChangelogEntry version="vX.Y.Z" date="<localized date>">…</ChangelogEntry>`
2. Add a short H2 title summarizing the release
3. Replace `**text:**` patterns with `<Bold>text:</Bold>`
4. Preserve emoji prefixes

#### MDX Template

```mdx
<ChangelogEntry version="vX.Y.Z" date="<localized date>">
## Short Release Title

Brief description of what this release introduces.

### ✨ Features

- <Bold>Feature Name:</Bold> Description of the feature

### 🔧 Improvements

- <Bold>Improvement Name:</Bold> Description

### 🐛 Bug Fixes

- <Bold>Fix Name:</Bold> Description

</ChangelogEntry>
```

The version literal **does** appear in `<ChangelogEntry version="vX.Y.Z">` — that's intentional, because each entry is a historical record of a specific release.

### 6. Update README Files

Update **all four** READMEs: `README.md` (en), `README.zh-CN.md`, `README.ja.md`, `README.es.md`.

Update version + release-date badges:

```markdown
[![Version](https://img.shields.io/badge/version-vX.Y.Z-blue.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/vX.Y.Z)
[![Release Date](https://img.shields.io/badge/release%20date-Mon%20DD%2C%20YYYY-green.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/vX.Y.Z)
```

URL encoding: spaces → `%20`, commas → `%2C`.

### 7. Update README Features Section

Add new features to the Features section in **all four** READMEs:

- One brief line per feature, no detailed sub-items
- Add under the appropriate section (Container Management, Image Management, etc.) or create a new section
- Translate for zh/ja/es

## File References

| File | Per-release? | What changes |
|------|--------------|--------------|
| `apps/landing/src/app/siteConfig.ts` | ✅ | `latestVersion` (single source of truth — propagates to all UI) |
| `apps/landing/src/config/downloads.ts` | ✅ | `RELEASE_DATE` + prepend `history[]` entry (uses `VERSION`/`RELEASE_DATE` consts) |
| `packages/shared/src/locales/{en,zh,ja,es}.json` | ✅ | `hero.eyebrow` only (rewrite tagline highlights). `hero.metaVersion` is a pure template — don't touch. |
| `apps/landing/src/content/changelog/{en,zh,ja,es}/page.mdx` | ✅ | Prepend new `<ChangelogEntry>` (×4 locales, body translated) |
| `README.md` / `README.zh-CN.md` / `README.ja.md` / `README.es.md` | ✅ | Version + release-date badges + Features section |
| `apps/landing/src/components/{shell/Navbar,landing/Hero,snapshot/SnapshotHero}.tsx` | ❌ | Already read `siteConfig.latestVersion` — never touch for a version bump |

## Section Types Supported

- `### ✨ Features` — New functionality
- `### 🔧 Improvements` / `### 🎨 Improvements` — Enhancements (both emojis seen historically)
- `### 🐛 Bug Fixes` — Issue resolutions
- `### ⚡ Performance` — Performance optimizations
- `### 🌐 Internationalization` — i18n updates

## Optional: Changelog Images

```mdx
<ChangelogImage
  src="/screenshots/X.Y.Z/image.png"
  alt="Description"
/>
```

## Verification Checklist

### Single source of truth
- [ ] `siteConfig.ts` `latestVersion` updated (without `v` prefix)
- [ ] No new hardcoded `vX.Y.Z` strings introduced in `Navbar.tsx`, `Hero.tsx`, `SnapshotHero.tsx`, or locale JSON files

### `downloads.ts`
- [ ] `RELEASE_DATE` updated (ISO format)
- [ ] New `history[]` entry prepended (using `VERSION` / `RELEASE_DATE` consts), prior entries kept

### Locale files (×4 — en, zh, ja, es)
- [ ] `hero.eyebrow` highlights rewritten (translated, `v{{version}}` placeholder kept)
- [ ] `hero.metaVersion` left untouched (it's `"v{{version}} · {{date}}"` — both interpolated)

### Changelog MDX (×4 — en, zh, ja, es)
- [ ] New `<ChangelogEntry>` prepended to each locale (body translated)
- [ ] Locale-specific date format used
- [ ] All `<Bold>` and `<ChangelogEntry>` tags closed

### README files (×4 — en, zh-CN, ja, es)
- [ ] Version badge updated
- [ ] Release-date badge updated (URL-encoded date)
- [ ] Features section updated (brief, translated)

### Final scan
- [ ] `grep "v?<previous-version>"` returns only legitimate historical references: changelog entries for that version, "Added in v…" doc lines, `downloads.ts` history array, design specs in `docs/superpowers/`, and `bun.lock` (unrelated packages).
- [ ] `grep "v?<new-version>"` (literal) outside `siteConfig.ts` and the new changelog/README entries should return nothing — if it does, you reintroduced a hardcoded version somewhere.
