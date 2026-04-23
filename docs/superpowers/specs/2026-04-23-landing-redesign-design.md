# Landing Site Redesign — Design Spec

_Date: 2026-04-23_
_Branch: `redesign/landing`_
_Source: Claude Design bundle `scKNkovvcN7Io07let-2jQ` (Landing / Pricing / Download / Changelog HTML prototypes + live-dash.js / palette.js / main.js)_

## Goal

Replace the four public marketing routes (`/`, `/pricing`, `/download`, `/changelog`) and the shared app shell with a bold new visual language — terminal/CLI-forward typography, teal→indigo signature accent, and an animated dashboard hero — while preserving the existing Next.js 16 + React 19 + Tailwind v4 + Fumadocs + i18n infrastructure of `apps/landing`.

## Non-goals

- New backend / API work.
- Translating copy into zh/ja/es (English ships first; other locales fall back until translators catch up). Copy lives in `packages/shared/src/locales/*.json`.
- **Touching `docs/*` (Fumadocs) routes.** The Fumadocs docs chrome, `mdx-components.tsx`, and its registered components (including `<Callout>` from `fumadocs-ui/components/callout`) are **not modified**. The new marketing shell does **not** wrap docs.
- Touching `/about`, `/privacy`, `/terms`, `/dpa` page content. These routes sit inside `(main)/layout.tsx` so they inherit the new marketing shell automatically; no copy or layout changes.
- Changing the Changelog authoring format. Existing `<ChangelogEntry>` / `<ChangelogImage>` / `<Bold>` tag convention is preserved. Rendering is done by the existing string parser in `lib/changelog.ts`, **not** by MDX compilation — so no new components are registered on the global MDX components map.
- Introducing animation libraries. All motion is `requestAnimationFrame` + `useEffect`. `motion` and `gsap` (already in `apps/landing/package.json`) stay in place but are unused by new code.

## Decisions (from brainstorming session)

1. **Implement in-place** in `apps/landing`, on branch `redesign/landing`. Existing stack (Next.js 16.1, React 19, Tailwind v4, `@next/mdx`, Fumadocs, `next-themes`, i18n) already matches the design assistant's recommended target.
2. **No Tweaks panel.** The HTML prototypes ship a developer knob for accent/style/grid — that is a design-time tool and is dropped. Only dark/light toggle remains, wired to the existing `next-themes` provider.
3. **Full-fidelity live hero animation.** CPU/Memory sparklines resample every ~1500ms, container-row sparklines stream, command-palette typewriter loops, pulse-dot blinks. Implemented as client components with `useEffect` timers.
4. **English-first.** Write the new pages in English on all locales; other locales fall back gracefully. Translation deltas ship later as diffs to `packages/shared/src/locales/{en,zh,ja,es}.json`.
5. **Marketing shell scoped to `(main)/layout.tsx`.** `<Navbar>`, `<Footer>`, `<GridBackground>` mount inside the `(main)` route group so `/about`, `/privacy`, `/terms`, `/dpa`, `/pricing`, `/download`, `/changelog`, `/` all pick them up. Docs (`[locale]/docs/...`) keeps its own `DocsLayout` from `fumadocs-ui` untouched. Site-wide primitives that are safe in docs (`next/font`, `<ThemeScript>`, `@theme` tokens in `globals.css`) still live in `[locale]/layout.tsx` — they only affect typography and CSS variables, and Fumadocs already reads the same dark/light class hook.
6. **Changelog:** preserve existing MDX content across all four locales (en/zh/ja/es `page.mdx` in `src/content/changelog/`). Existing string parser in `lib/changelog.ts` is extended to recognize two **new inline blocks** — `<Callout type="…">…</Callout>` and `<Figure src="…" caption="…" />` — and surface them in the structured entry data. Corresponding React renderers live under `components/changelog/` and are **not** globally registered as MDX components, so they never conflict with the Fumadocs `<Callout>` already used across `content/docs/**`.
7. **Approach A — shell first, pages next.** Ship in this order:
   1. Shell (tokens + Navbar + Footer + GridBackground + fonts)
   2. Landing (heaviest)
   3. Pricing
   4. Download
   5. Changelog
   6. Cleanup (delete deprecated components)
   Each step is a single PR against `redesign/landing`.

## Architecture

### File layout

```
apps/landing/src/
├── app/
│   ├── globals.css                        # rewritten: @theme tokens, grid bg utilities
│   └── [locale]/
│       ├── layout.tsx                     # minor edits: next/font imports, ThemeScript
│       ├── docs/                          # UNCHANGED — keeps its own DocsLayout
│       └── (main)/
│           ├── layout.tsx                 # rewritten: mounts Navbar + Footer + GridBackground
│           ├── page.tsx                   # assembles new Landing sections
│           ├── pricing/page.tsx           # assembles new Pricing sections
│           ├── download/page.tsx          # assembles new Download sections
│           └── changelog/page.tsx         # routes to restyled ChangelogPageContent
├── components/
│   ├── shell/                             # NEW — used only inside (main)/layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── GridBackground.tsx
│   │   └── ThemeScript.tsx
│   ├── landing/                           # NEW
│   │   ├── Hero.tsx
│   │   ├── LiveDashboard.tsx              # "use client"
│   │   ├── CommandPalette.tsx             # "use client"
│   │   ├── FeaturesGrid.tsx
│   │   ├── RuntimeStrip.tsx
│   │   ├── CtaFinal.tsx
│   │   └── hooks/
│   │       ├── useSparkline.ts
│   │       └── useTypewriter.ts
│   ├── pricing/                           # NEW
│   │   ├── PricingHero.tsx
│   │   ├── Countdown.tsx                  # "use client"
│   │   ├── PlanCard.tsx
│   │   ├── TrustBar.tsx
│   │   ├── ComparisonTable.tsx
│   │   └── PricingFaq.tsx
│   ├── download/                          # NEW
│   │   ├── DownloadHero.tsx
│   │   ├── HomebrewBlock.tsx
│   │   ├── PlatformCard.tsx
│   │   ├── IntegrityBar.tsx
│   │   └── ReleasesTable.tsx
│   ├── ui/                                # shared primitives (NEW)
│   │   ├── Pill.tsx
│   │   ├── Chip.tsx
│   │   ├── StatCard.tsx
│   │   ├── IconButton.tsx
│   │   └── Sparkline.tsx                  # SVG, reused by LiveDashboard + container rows
│   └── changelog/                         # RESTYLED + EXTENDED
│       ├── ChangelogPageContent.tsx       # layout with sticky TOC + search
│       ├── ChangelogTimeline.tsx          # stream of entries (existing, restyled)
│       ├── ChangelogToc.tsx               # "use client" — sticky TOC + scrollspy
│       ├── ChangelogSearch.tsx            # "use client" — keyword filter input
│       ├── ChangelogEntry.tsx             # meta header + h2 + body styles
│       ├── ChangelogImage.tsx             # figure-style wrapper
│       ├── ChangelogCallout.tsx           # NEW — variants: note | tip | warn (changelog-only)
│       ├── ChangelogFigure.tsx            # NEW — src + caption (changelog-only)
│       └── Bold.tsx                       # typography restyle
├── config/                                # NEW
│   ├── pricing.ts                         # earlyBirdDeadlineUtc, plan prices, stats + "as of"
│   └── downloads.ts                       # artifact list, versions, "as of" metadata
├── lib/
│   └── changelog.ts                       # extended: recognize <Callout> + <Figure> blocks
└── content/changelog/*/page.mdx           # unchanged content; may use <Callout>/<Figure> going forward
```

### Deprecated components (deleted in cleanup PR)

- `components/ui/Hero.tsx`, `HeroImage.tsx`, `Features.tsx`, `Benefits.tsx`, `LogoCloud.tsx`, `Logos.tsx`
- `components/ui/PricingCard.tsx`, `Faqs.tsx`, `FaqsLazy.tsx`
- `components/ui/CtaSection.tsx`, `CtaSectionLazy.tsx`, `Cta.tsx`
- `components/ui/Navbar.tsx`, `Footer.tsx`
- `components/ui/Kubernetes.tsx`, `KubernetesLazy.tsx`, `Global.tsx`, `GlobalLazy.tsx`
- `components/ui/SnapshotPlayground.tsx` (typo kept as filename), `SnapshotPlaygroundLazy.tsx`, `SnapshotPlaygroundScroll.tsx`
- `components/ui/ArrowAnimated.tsx` (if unreferenced after cleanup)

Each deletion is TS-validated (`bun build:landing` will surface dangling imports).

## Design tokens

Authored once in `globals.css` via Tailwind v4 `@theme`. `html.dark` toggles the dark palette via CSS class (wired through `next-themes`, `attribute="class"`).

```css
@theme {
  --color-bg: #fafaf9;
  --color-bg-elev: #ffffff;
  --color-bg-soft: #f4f4f2;
  --color-line: rgb(0 0 0 / 0.08);
  --color-line-strong: rgb(0 0 0 / 0.14);
  --color-ink: #0a0a0a;
  --color-ink-2: #3a3a3a;
  --color-ink-3: #6a6a6a;
  --color-ink-4: #9a9a98;
  --color-accent: #14b8a6;       /* teal — signature, never overridden by theme */
  --color-accent-2: #6366f1;     /* indigo */
  --color-accent-warm: #f97316;
  --color-ok: #10b981;
  --color-warn: #f59e0b;
  --color-err: #ef4444;
  --color-grid: rgb(0 0 0 / 0.05);
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, monospace;
  --font-display: "Instrument Serif", serif;
  --radius: 12px;
  --radius-sm: 8px;
}

html.dark {
  --color-bg: #070808;
  --color-bg-elev: #0e0f10;
  --color-bg-soft: #141516;
  --color-line: rgb(255 255 255 / 0.08);
  --color-line-strong: rgb(255 255 255 / 0.14);
  --color-ink: #f5f5f4;
  --color-ink-2: #c9c9c7;
  --color-ink-3: #8c8c8a;
  --color-ink-4: #5c5c5a;
  --color-grid: rgb(255 255 255 / 0.04);
}
```

### Typography

Loaded via `next/font/google` in `app/[locale]/layout.tsx`:

- **Inter** (weights 400, 500, 600, 700, 800) — body and UI
- **Geist Mono** (weights 400, 500, 600, 700) — code, eyebrows, data labels
- **Instrument Serif** (italic 400) — accent headline italics

### Background grid

Fixed-position layer, z-index 0, pointer-events none. Two orthogonal gradients at 56×56px with a radial mask fading toward edges. Implemented as `<GridBackground />` rendered in **`[locale]/(main)/layout.tsx`** only — kept out of docs.

## Page specs

### Shell (mounted in `[locale]/(main)/layout.tsx`)

**`<Navbar>`** — sticky top, `backdrop-filter: blur(14px)`, translucent bg via `color-mix`. Layout: brand (26×26 gradient mark + "Dockerman" wordmark) · nav links (Features / Pricing / Download / Docs / Changelog) · right cluster (ThemeSwitch + GitHub icon + primary "Download" CTA). Active route highlighted via `usePathname`. The `Docs` link routes to the existing Fumadocs-owned `/[locale]/docs` tree — following it leaves the marketing shell behind, which is intentional.

**`<Footer>`** — three-column (brand + tagline / product / company) + copyright line. No license claim (user confirmed MIT is not correct).

### Landing (`/`)

1. **Hero** — eyebrow pill (`v5.1 · local-first` + animated pulse dot) → display headline (`clamp(44px, 7.2vw, 96px)`, 0.95 line-height, Instrument Serif italic on "in 30MB.") → subtitle (2 lines max) → CTA pair (primary Download, outline GitHub) → three stat columns (~30MB RAM · ~0ms cold start · 100% local).
2. **LiveDashboard** — macOS-style app frame. Traffic lights + "Dashboard" label (sidebar toggle icon) · left sidebar (Container · Image · Build · Network · Volume · Events · Templates, then Actions section with Terminal / Process / Inspect / Stats / Logs / File, then "Containers · 5" with 5 mock rows) · main region (row 1: 4 KPI cards — Containers / Images / Total Image Size / Images In Use; row 2: 4 system cards — Docker Version / Storage Driver / System Resources / Operating System; row 3: CPU + Memory charts, 1fr 1fr equal width; row 4: Network I/O + Disk I/O). **Signature chart colors** are hard-coded (not theme-dependent): Memory teal `#10b981`, CPU indigo `#6366f1`, Network purple `#a855f7`, Disk pink `#ec4899`. Container-row sparklines are teal when running.
3. **CommandPalette** — absolutely positioned over the dashboard, ⌘K header, typewriter cycles through 4 commands with blinking caret.
4. **RuntimeStrip** — horizontal divider row: Docker · Podman · Kubernetes · SSH · Cloudflared · WSL2 (logo + label).
5. **FeaturesGrid** — 6-card bento (final arrangement from the last iteration in `Landing.html`, which the user reviewed and approved):
   - Large **Command Palette** card — spans 2 cols × 2 rows, top-left
   - **Docker & Podman** — top-right, runtime selector visual
   - **Events, loud and legible** — mid-row, fills the previous layout gap
   - **Podman-native** — medium card
   - **Image Upgrade** — medium card
   - **Images you can trust** — bottom-right wide card (Trivy CVE scan + registry credentials)
6. **CtaFinal** — "Ready to tame your containers?" + Download / Docs / GitHub buttons.

### Pricing (`/pricing`)

1. **PricingHero** — eyebrow ("Early bird · 30% off") + display headline with Instrument Serif italic accent.
2. **Countdown** (client) — days / hours / minutes / seconds ticking toward a **concrete UTC deadline of `2026-06-30T23:59:59Z`** (written literally in `config/pricing.ts` as `earlyBirdDeadlineUtc`). Chosen because (a) the existing copy "Early bird ends April 1" is already expired, (b) ~2 months of runway after the redesign ships, (c) a simple end-of-month boundary. When the deadline is past the component renders nothing and the PlanCards auto-switch to regular prices.
3. **Three PlanCards** (equal width):
   - **Free** — $0, local Docker/Podman only
   - **Team** — $19 (was $29), 3 devices, indigo glow highlight, "Most popular" badge
   - **Solo** — $14 (was $19), 1 device
   All three share feature list; Team/Solo adds remote SSH + multi-host + lifetime updates.
4. **TrustBar** — Stripe badge / **14-day money-back guarantee** (matches the existing FAQ copy in `packages/shared/src/locales/en.json:150` — do **not** change the refund window in this redesign; any policy change is out of scope) / user count / GitHub star count. Every metric is sourced from `config/pricing.ts` with a required `asOf` ISO date written alongside, so stale numbers show up as a line-diff in PRs.
5. **ComparisonTable** — three row groups: Core / Remote & Multi-host / License & support. ✓/— symbols per column.
6. **PricingFaq** — 8 Q&A using Radix Accordion (already in deps). FAQ copy pulled from existing locale files where possible.
7. **CtaFinal**.

**`config/pricing.ts` shape:**

```ts
export const pricingConfig = {
  earlyBirdDeadlineUtc: "2026-06-30T23:59:59Z",
  plans: {
    free:  { price: 0 },
    team:  { priceEarlyBird: 19, priceRegular: 29, devices: 3 },
    solo:  { priceEarlyBird: 14, priceRegular: 19, devices: 1 },
  },
  refund: { days: 14, copyKey: "pricing.faq.refund.answer" },
  trust: {
    asOf: "2026-04-23",
    users: 12400,
    githubStars: 2100,
  },
};
```

### Download (`/download`)

1. **DownloadHero** — kicker ("vX.Y.Z · latest stable" — actual current version pulled from data source) + headline. Meta strip: version / release date / install size / platforms (macOS · Windows · Linux). No license claim.
2. **HomebrewBlock** — single "recommended CLI install" card with click-to-copy the **custom tap** command, matching the current site:
   ```
   brew install --cask zingerlittlebee/tap/dockerman
   ```
   Winget and Flatpak cards are explicitly dropped — neither is supported by the release pipeline.
3. **Three PlatformCards** (equal width), artifacts aligned with what the release pipeline actually produces (`app.dockerman/upload/src/platform.ts`):
   - **macOS** — `.dmg` Apple Silicon (`aarch64`) + `.dmg` Intel (`x64`), min macOS 11
   - **Windows** — `.msi` + `.exe` (NSIS setup), min Windows 10/11
   - **Linux** — `.AppImage` + `.deb` (x86_64). **No `.rpm`.**
   Each card lists the real artifact filenames with file sizes; the per-card signing footer line points to the matching Tauri updater `.sig` file that ships alongside every artifact.
4. **IntegrityBar** — one link to the GitHub release page for the current version (where all assets + per-asset `.sig` signatures are published), and one link to the public updater signing key used by Tauri's updater. **SHA256SUMS, SBOM, and cosign attestations are not produced by the current pipeline** and are therefore not referenced.
5. **ReleasesTable** — last 8 versions with date + a link into `/changelog#release-{slug}`. Data sourced from `config/downloads.ts` with an explicit `asOf` timestamp in the config file; future work may derive it from the GitHub Releases API at build time.
6. **CtaFinal**.

**Data source for download metadata** (`config/downloads.ts`):

```ts
export const downloadsConfig = {
  asOf: "2026-04-23",             // bump whenever this file is updated
  latest: {
    version: "5.1.0",
    releaseDate: "2026-04-08",
    platforms: {
      macos: [
        { arch: "aarch64", filename: "Dockerman_5.1.0_aarch64.dmg", size: "…" },
        { arch: "x64",     filename: "Dockerman_5.1.0_x64.dmg",     size: "…" },
      ],
      windows: [
        { kind: "msi",  filename: "Dockerman_5.1.0_x64_en-US.msi",  size: "…" },
        { kind: "nsis", filename: "Dockerman_5.1.0_x64-setup.exe",  size: "…" },
      ],
      linux: [
        { kind: "appimage", filename: "dockerman_5.1.0_amd64.AppImage", size: "…" },
        { kind: "deb",      filename: "dockerman_5.1.0_amd64.deb",       size: "…" },
      ],
    },
  },
  history: [ /* last 8 versions, version + date + summary slug */ ],
};
```

Implementation detail left to the plan: either check the real filenames in `apps/landing/src/app/[locale]/(main)/download/page.tsx:129+` and mirror them, or read `app.dockerman/upload/src/platform.ts` as the canonical source. The spec fixes the shape; the plan picks the source.

### Changelog (`/changelog`)

Data flow is unchanged: `lib/changelog.ts` parses `src/content/changelog/{locale}/page.mdx`, `ChangelogPageContent` receives the entries.

**New visual structure:**

- Left sidebar: search input + sticky TOC with scrollspy (active version highlighted).
- Main column: stream of `<ChangelogEntry>` articles.
- Per-entry: meta header (version pill · date · optional tag like "Latest") → `<h2>` title → summary `<p class="lede">` → body (sections render as h3 headings, items as unordered lists with `<Bold>` and description).
- Ability to embed `<Callout type="note|tip|warn">` and `<Figure src caption>` inline — recognized by the extended string parser, rendered by `ChangelogCallout` / `ChangelogFigure`. Not added to the global MDX components map.
- Existing `<ChangelogImage>` renders as a framed figure with caption.
- Preserve code block, blockquote, and inline `<code>` treatments from the design.

Search + TOC are client components; article list is RSC.

## MDX integration

**`apps/landing/mdx-components.tsx` is NOT modified.** It remains dedicated to the Fumadocs docs pipeline (Callout from `fumadocs-ui/components/callout`, Tabs, Steps, etc.). All docs routes continue to consume it via `getMDXComponents()`.

Changelog rendering stays on the **string-parser** path in `lib/changelog.ts`:

1. Existing regex patterns for `<ChangelogEntry>`, `<ChangelogImage>`, `<Bold>` are preserved.
2. Two new patterns are added:
   - `<Callout type="note|tip|warn">body</Callout>` — captured per section, attached to the owning `ChangelogItem` (or to the section, inline with items in document order).
   - `<Figure src="..." caption="..." />` — captured the same way `<ChangelogImage>` is today.
3. `ChangelogItem` / `ChangelogSection` types gain `callouts?` and `figures?` arrays (or an ordered `blocks` array carrying tagged entries), rendered by React components in `ChangelogTimeline`.
4. These new blocks never pass through the MDX compiler, so they cannot collide with the Fumadocs `<Callout>` component used in `content/docs/**`.

This decision intentionally trades "real MDX" for parser extension because (a) the current codebase already commits to string-parsing for changelog, (b) moving changelog to real MDX would require a separate migration with its own tests and i18n review, and (c) the Fumadocs Callout naming collision is a real liability if we put our Callout in the global MDX map.

## Animation details

| Effect | Interval | Implementation |
|---|---|---|
| CPU/Memory sparkline resample | 1500 ms | `setInterval` in `LiveDashboard` pushes a new sample, `<Sparkline>` animates path via CSS transition |
| Container row sparklines | 1500 ms (staggered 250 ms per row) | same `<Sparkline>`, different seed |
| Command palette typewriter | 60 ms per char, 1200 ms pause at line end | `useTypewriter` hook advances index via `requestAnimationFrame` |
| Pulse dot (eyebrow + chrome) | 2200 ms CSS keyframes | pure CSS `animation: pulse` |
| Chart breathing (Memory area opacity) | 4000 ms CSS keyframes | pure CSS |

All timers cleared in `useEffect` cleanup. No animations run when `prefers-reduced-motion: reduce` (CSS media query + one `useEffect` guard that skips the interval setup).

## Testing

- Existing unit tests (`Accordion.test.tsx`, `ChangelogPageContent.test.tsx`, `ChangelogTimeline.test.tsx`) are updated to match new component names/selectors; tests that target deleted components are deleted with them.
- New render tests for `<Countdown>` (expired deadline hides component; live deadline ticks), `<Sparkline>` (renders `<path>` given data), `<PlanCard>` (highlighted variant adds expected class).
- Manual QA per PR: `bun dev:landing`, walk every section in both themes, all four locales. Screenshot diffs not in scope.

## Per-PR acceptance checklist

Every merge to `redesign/landing` must pass:

1. `bun build:landing` — 0 errors.
2. `bun check` at the monorepo root (runs `turbo run check` → per-package `ultracite check`, which wraps Biome and TypeScript) — 0 errors.
3. Manual walk of `bun dev:landing` on affected pages in light and dark themes.
4. 200 responses on all four `[locale]` variants (English renders new content; zh/ja/es fall back without errors).
5. Lighthouse spot-check on Landing: LCP < 2.5s, CLS < 0.1. Hero animations must not push layout.
6. **Docs smoke test** — open `/[locale]/docs/getting-started` and at least one page that uses `<Callout>` / `<Tabs>` / `<Steps>` (e.g. `content/docs/en/getting-started.mdx`); confirm the Fumadocs chrome is intact and all MDX components render.
7. Git status clean before commit; commit message follows conventional style already in the repo.

## Migration & cleanup

- Branch from `main`: `redesign/landing`.
- Each of the 6 PRs (shell / landing / pricing / download / changelog / cleanup) lands sequentially and can be reverted independently.
- The cleanup PR is the last step: delete every deprecated component listed above. TS will flag any lingering import.
- Legacy animation deps in `apps/landing/package.json` — `motion`, `gsap`, `@gsap/react` — are kept as-is; new code does not import them, and tree-shaking leaves unused modules out of the bundle. Evaluating their removal is out of scope.

## Risks & open questions

| Risk | Mitigation |
|---|---|
| Live-dashboard animations cause jank on low-end devices | Animations gated by `prefers-reduced-motion`; intervals cap at 1500ms; SVG-only (no canvas). |
| next-themes flash-of-wrong-theme | Rely on next-themes built-in suppressHydrationWarning + `<ThemeScript>` inline script in layout head. |
| **Docs layout bleed** — marketing Navbar/Footer accidentally wraps Fumadocs docs pages | Shell components mount in **`[locale]/(main)/layout.tsx`**, never in `[locale]/layout.tsx`. Docs smoke test in the per-PR checklist catches any regression. |
| **Shared MDX collision** — a new `<Callout>` shadows Fumadocs `Callout` in docs MDX | Changelog Callout/Figure are rendered via the string parser + local React components under `components/changelog/`; `mdx-components.tsx` is untouched. |
| **Download metadata drift** — hardcoded versions, dates, and file sizes go stale | `config/downloads.ts` carries a required `asOf` ISO date. Any stale value shows up as an audit line in PRs. Follow-up ticket: auto-fetch from GitHub Releases API at build time. |
| **Trust metric drift** — user count, GitHub stars, refund policy drift out of sync with reality | `config/pricing.ts` requires `trust.asOf`; refund window is pinned to the existing locale copy (14-day) so a unilateral redesign change can't happen silently. |
| Translations drift after English-first ship | Track in follow-up issue; fallback path keeps routes 200. Translation landing zone is `packages/shared/src/locales/{en,zh,ja,es}.json`. |
| Pricing countdown deadline shown inconsistent across timezones | Render on client only; source from UTC ISO string (`earlyBirdDeadlineUtc: "2026-06-30T23:59:59Z"`) in `config/pricing.ts`. |
| Changelog parser regression when extending for Callout/Figure | Add fixture MDX + unit tests in `lib/changelog.test.ts` (or equivalent) covering all four existing locale files plus a new fixture using `<Callout>` and `<Figure>`. |
