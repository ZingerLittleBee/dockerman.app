# Landing Site Redesign — Design Spec

_Date: 2026-04-23_
_Branch: `redesign/landing`_
_Source: Claude Design bundle `scKNkovvcN7Io07let-2jQ` (Landing / Pricing / Download / Changelog HTML prototypes + live-dash.js / palette.js / main.js)_

## Goal

Replace the four public marketing routes (`/`, `/pricing`, `/download`, `/changelog`) and the shared app shell with a bold new visual language — terminal/CLI-forward typography, teal→indigo signature accent, and an animated dashboard hero — while preserving the existing Next.js 16 + React 19 + Tailwind v4 + Fumadocs + i18n infrastructure of `apps/landing`.

## Non-goals

- New backend / API work.
- Translating copy into zh/ja/es (English ships first; other locales fall back until translators catch up).
- Touching `docs/*` (Fumadocs) routes, `/about`, `/privacy`, `/terms`, `/dpa` — these inherit the new shell but copy/layout stay as-is.
- Changing the Changelog authoring format. Existing `<ChangelogEntry>` / `<ChangelogImage>` MDX API is preserved; only visual styles change and new `<Callout>` / `<Figure>` MDX components are added for future entries.
- Introducing animation libraries. All motion is `requestAnimationFrame` + `useEffect`. `framer-motion` / `gsap` in the existing `package.json` are left in place but unused by new code.

## Decisions (from brainstorming session)

1. **Implement in-place** in `apps/landing`, on branch `redesign/landing`. Existing stack (Next.js 16.1, React 19, Tailwind v4, `@next/mdx`, Fumadocs, `next-themes`, i18n) already matches the design assistant's recommended target.
2. **No Tweaks panel.** The HTML prototypes ship a developer knob for accent/style/grid — that is a design-time tool and is dropped. Only dark/light toggle remains, wired to the existing `next-themes` provider.
3. **Full-fidelity live hero animation.** CPU/Memory sparklines resample every ~1500ms, container-row sparklines stream, command-palette typewriter loops, pulse-dot blinks. Implemented as client components with `useEffect` timers.
4. **English-first.** Write the new pages in English on all locales; other locales fall back gracefully. Translation deltas ship later as `messages/*.json` diffs.
5. **App-wide shell replacement.** `globals.css` tokens, `<Navbar>`, `<Footer>`, grid background all change once. Pages not in the redesign scope inherit the new shell and will be visually adjusted if anything looks obviously broken.
6. **Changelog:** preserve existing MDX content across all four locales (en/zh/ja/es `page.mdx` in `src/content/changelog/`). Only the `<ChangelogEntry>` / `<ChangelogImage>` / `<Bold>` component renderers change. Register new `<Callout>` / `<Figure>` MDX components for future entries.
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
│   ├── globals.css                        # rewritten: @theme tokens, fonts, grid bg
│   └── [locale]/
│       ├── layout.tsx                     # rewritten: next/font imports, ThemeScript, new shell
│       └── (main)/
│           ├── page.tsx                   # assembles new Landing sections
│           ├── pricing/page.tsx           # assembles new Pricing sections
│           ├── download/page.tsx          # assembles new Download sections
│           └── changelog/page.tsx         # routes to restyled ChangelogPageContent
├── components/
│   ├── shell/                             # NEW
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
│   ├── mdx/                               # EXTENDED
│   │   ├── Callout.tsx                    # NEW — variants: note | tip | warn
│   │   └── Figure.tsx                     # NEW — src + caption
│   └── changelog/                         # RESTYLED
│       ├── ChangelogPageContent.tsx       # layout + TOC/search restyle
│       ├── ChangelogEntry.tsx             # meta header + h2 + body styles
│       ├── ChangelogImage.tsx             # figure-style wrapper
│       └── Bold.tsx                       # typography restyle
├── config/                                # NEW
│   └── pricing.ts                         # countdown deadline, plan prices, trust stats
└── content/changelog/*/page.mdx           # unchanged
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

Fixed-position layer, z-index 0, pointer-events none. Two orthogonal gradients at 56×56px with a radial mask fading toward edges. Implemented as `<GridBackground />` rendered in `[locale]/layout.tsx`.

## Page specs

### Shell

**`<Navbar>`** — sticky top, `backdrop-filter: blur(14px)`, translucent bg via `color-mix`. Layout: brand (26×26 gradient mark + "Dockerman" wordmark) · nav links (Features / Pricing / Download / Docs / Changelog) · right cluster (ThemeSwitch + GitHub icon + primary "Download" CTA). Active route highlighted via `usePathname`.

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
2. **Countdown** (client) — days / hours / minutes / seconds ticking; deadline sourced from `config/pricing.ts` (`NEXT_PUBLIC_EARLY_BIRD_DEADLINE` env override). When deadline is past, component renders nothing (gracefully hides).
3. **Three PlanCards** (equal width):
   - **Free** — $0, local Docker/Podman only
   - **Team** — $19 (was $29), 3 devices, indigo glow highlight, "Most popular" badge
   - **Solo** — $14 (was $19), 1 device
   All three share feature list; Team/Solo adds remote SSH + multi-host + lifetime updates.
4. **TrustBar** — Stripe logo / 30-day refund / user count / GitHub star count. Values hardcoded in `config/pricing.ts` for now.
5. **ComparisonTable** — three row groups: Core / Remote & Multi-host / License & support. ✓/— symbols per column.
6. **PricingFaq** — 8 Q&A using Radix Accordion (already in deps).
7. **CtaFinal**.

### Download (`/download`)

1. **DownloadHero** — kicker ("v5.1.0 · latest stable") + headline. Meta strip: version / release date / install size / platforms (macOS · Windows · Linux). No license claim.
2. **HomebrewBlock** — single "recommended CLI install" card with click-to-copy `brew install --cask dockerman`. Winget and Flatpak cards explicitly dropped per the design chat (not supported upstream).
3. **Three PlatformCards** (equal width):
   - **macOS** — .dmg (Apple Silicon, Intel), min macOS 11
   - **Windows** — .msi, .exe, min Windows 10/11
   - **Linux** — .deb, .rpm, .AppImage
   Each card lists artifact variants with file sizes and a signing footer line.
4. **IntegrityBar** — SHA256SUMS / SBOM / cosign signature links.
5. **ReleasesTable** — last 8 versions with date + changelog-summary link. Data hardcoded for now; future work can derive it from changelog MDX frontmatter.
6. **CtaFinal**.

### Changelog (`/changelog`)

Data flow is unchanged: `lib/changelog.ts` parses `src/content/changelog/{locale}/page.mdx`, `ChangelogPageContent` receives the entries.

**New visual structure:**

- Left sidebar: search input + sticky TOC with scrollspy (active version highlighted).
- Main column: stream of `<ChangelogEntry>` articles.
- Per-entry: meta header (version pill · date · optional tag like "Latest") → `<h2>` title → summary `<p class="lede">` → body (sections render as h3 headings, items as unordered lists with `<Bold>` and description).
- Ability to embed `<Callout variant="note|tip|warn">` and `<Figure src caption>` inline (registered in `mdx-components.tsx`).
- Existing `<ChangelogImage>` renders as a framed figure with caption.
- Preserve code block, blockquote, and inline `<code>` treatments from the design.

Search + TOC are client components; article list is RSC.

## MDX integration

`mdx-components.tsx` adds:

```ts
import { Callout } from "@/components/mdx/Callout";
import { Figure } from "@/components/mdx/Figure";
import { ChangelogEntry } from "@/components/changelog/ChangelogEntry";
import { ChangelogImage } from "@/components/changelog/ChangelogImage";
import { Bold } from "@/components/changelog/Bold";

export function useMDXComponents(components) {
  return { ...components, Callout, Figure, ChangelogEntry, ChangelogImage, Bold };
}
```

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
2. `bun check` — 0 errors (Biome + Ultracite + TS).
3. Manual walk of `bun dev:landing` on affected pages in light and dark themes.
4. 200 responses on all four `[locale]` variants (English renders new content; zh/ja/es fall back without errors).
5. Lighthouse spot-check on Landing: LCP < 2.5s, CLS < 0.1. Hero animations must not push layout.
6. Git status clean before commit; commit message follows conventional style already in the repo.

## Migration & cleanup

- Branch from `main`: `redesign/landing`.
- Each of the 6 PRs (shell / landing / pricing / download / changelog / cleanup) lands sequentially and can be reverted independently.
- The cleanup PR is the last step: delete every deprecated component listed above. TS will flag any lingering import.
- Legacy animation deps (`framer-motion`, `gsap`, `@gsap/react`) are kept in `package.json` in case docs or other routes use them; tree-shaking handles unused code.

## Risks & open questions

| Risk | Mitigation |
|---|---|
| Live-dashboard animations cause jank on low-end devices | Animations gated by `prefers-reduced-motion`; intervals cap at 1500ms; SVG-only (no canvas). |
| next-themes flash-of-wrong-theme | Rely on next-themes built-in suppressHydrationWarning + `<ThemeScript>` inline script in layout head. |
| MDX component registration breaks existing changelog | New components are additive; old components only change their internal styles, not their signatures. |
| Translations drift after English-first ship | Track in follow-up issue; fallback path keeps routes 200. |
| Pricing countdown deadline shown inconsistent across timezones | Render on client only; source from UTC ISO string in `config/pricing.ts`. |
