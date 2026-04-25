# Landing Site Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/`, `/pricing`, `/download`, `/changelog` and the shared marketing shell in `apps/landing` with the Claude-Design-sourced visual language (terminal/CLI-forward type, teal→indigo accent, animated dashboard hero) while preserving i18n, Fumadocs docs, and analytics.

**Architecture:** Six sequential PRs against branch `redesign/landing`. Shell comes first (tokens, fonts, Navbar, Footer, GridBackground in `(main)/layout.tsx` only — docs keeps Fumadocs chrome). Then Landing, Pricing, Download, Changelog pages. Final PR deletes deprecated components. Every animation is pure `useEffect` + `requestAnimationFrame`; no new motion libraries.

**Tech Stack:** Next.js 16.1 (App Router) · React 19 · Tailwind v4 (`@theme`) · `@next/mdx` · Fumadocs · `next-themes` · Radix UI · `@remixicon/react` · Biome/Ultracite · Bun + Turbo.

**Source references (DO NOT DELETE DURING WORK):**
- Spec: `docs/superpowers/specs/2026-04-23-landing-redesign-design.md`
- Design prototypes will be committed to `docs/superpowers/assets/claude-design/` in Task 0 below. They are the canonical visual reference for every component; when the plan says "match source", open the listed HTML/JS file and copy styles + structure verbatim.
- Release pipeline (canonical for download artifacts): `/Users/zingerbee/Bee/dockerman/app.dockerman/upload/src/platform.ts`

**Engineering rules:**
- After every commit, run `bun check` at the repo root (wraps Biome + TypeScript via Turbo). Zero errors, zero warnings.
- After every phase (= one PR), run `bun build:landing` at the repo root. Must succeed.
- Never touch `apps/landing/mdx-components.tsx`. Never mount `<Navbar>` / `<Footer>` / `<GridBackground>` at `[locale]/layout.tsx`; they go in `[locale]/(main)/layout.tsx` only.
- Use `@remixicon/react` for icons (already in deps). Do not add new icon libraries.
- Use `next/font/google` for fonts. No `<link>` tags to Google Fonts.
- Every client component has a file-top `"use client"` directive.
- Honor `prefers-reduced-motion: reduce` in every animated component (CSS `@media` + a `useEffect` guard that skips interval setup).

---

## Phase 0 — Prep

### Task 0.1: Create feature branch and archive design assets

**Files:**
- Copy to: `docs/superpowers/assets/claude-design/` (new directory)

- [ ] **Step 1: Create branch**

```bash
git checkout -b redesign/landing
```

- [ ] **Step 2: Copy Claude Design bundle into repo as reference material**

```bash
mkdir -p docs/superpowers/assets/claude-design
cp /tmp/claude-design/extracted/dockerman/README.md docs/superpowers/assets/claude-design/
cp /tmp/claude-design/extracted/dockerman/project/Landing.html docs/superpowers/assets/claude-design/
cp /tmp/claude-design/extracted/dockerman/project/Pricing.html docs/superpowers/assets/claude-design/
cp /tmp/claude-design/extracted/dockerman/project/Download.html docs/superpowers/assets/claude-design/
cp /tmp/claude-design/extracted/dockerman/project/Changelog.html docs/superpowers/assets/claude-design/
cp /tmp/claude-design/extracted/dockerman/project/live-dash.js docs/superpowers/assets/claude-design/
cp /tmp/claude-design/extracted/dockerman/project/palette.js docs/superpowers/assets/claude-design/
cp /tmp/claude-design/extracted/dockerman/project/main.js docs/superpowers/assets/claude-design/
```

- [ ] **Step 3: Verify assets are present**

```bash
ls docs/superpowers/assets/claude-design/
```

Expected output includes: `Changelog.html`, `Download.html`, `Landing.html`, `Pricing.html`, `README.md`, `live-dash.js`, `main.js`, `palette.js`.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/assets/claude-design/
git commit -m "docs: archive Claude Design bundle as implementation reference"
```

---

## Phase 1 — Shell (PR #1)

Goal: new tokens, fonts, grid background, Navbar, Footer. Other pages in `(main)` (`about`, `privacy`, `terms`, `dpa`) inherit the new shell automatically. Docs continues to use Fumadocs `DocsLayout`.

### Task 1.1: Extend globals.css with new design tokens

**Files:**
- Modify: `apps/landing/src/app/globals.css`

- [ ] **Step 1: Open source reference**

Open `docs/superpowers/assets/claude-design/Landing.html` and locate the `<style>` block starting at the `:root {` rule near the top (roughly lines 20-60). This is the source of truth for token values.

- [ ] **Step 2: Append a new `@theme` block to `globals.css`**

Append after the existing `@theme { … }` block (do not remove existing tokens — docs/Fumadocs depends on them):

```css
/* ─── Redesign tokens (Claude Design 2026-04-23) ─────────────────────── */
@theme {
  --color-dm-bg: #fafaf9;
  --color-dm-bg-elev: #ffffff;
  --color-dm-bg-soft: #f4f4f2;
  --color-dm-line: rgb(0 0 0 / 0.08);
  --color-dm-line-strong: rgb(0 0 0 / 0.14);
  --color-dm-ink: #0a0a0a;
  --color-dm-ink-2: #3a3a3a;
  --color-dm-ink-3: #6a6a6a;
  --color-dm-ink-4: #9a9a98;
  --color-dm-accent: #14b8a6;
  --color-dm-accent-2: #6366f1;
  --color-dm-accent-warm: #f97316;
  --color-dm-ok: #10b981;
  --color-dm-warn: #f59e0b;
  --color-dm-err: #ef4444;
  --color-dm-grid: rgb(0 0 0 / 0.05);

  --font-dm-mono: var(--font-geist-mono), "JetBrains Mono", ui-monospace, monospace;
  --font-dm-display: var(--font-instrument-serif), serif;

  --radius-dm: 12px;
  --radius-dm-sm: 8px;
}

@layer base {
  :where(.dark) {
    --color-dm-bg: #070808;
    --color-dm-bg-elev: #0e0f10;
    --color-dm-bg-soft: #141516;
    --color-dm-line: rgb(255 255 255 / 0.08);
    --color-dm-line-strong: rgb(255 255 255 / 0.14);
    --color-dm-ink: #f5f5f4;
    --color-dm-ink-2: #c9c9c7;
    --color-dm-ink-3: #8c8c8a;
    --color-dm-ink-4: #5c5c5a;
    --color-dm-grid: rgb(255 255 255 / 0.04);
  }

  @keyframes dm-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  @media (prefers-reduced-motion: reduce) {
    .dm-animated,
    .dm-animated * {
      animation: none !important;
      transition: none !important;
    }
  }
}
```

The `dm-` prefix keeps all redesign tokens namespaced so they cannot shadow existing Fumadocs / Tailwind tokens.

- [ ] **Step 3: Verify Tailwind recognizes the new tokens**

```bash
bun check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add apps/landing/src/app/globals.css
git commit -m "feat(landing): add redesign design tokens with dm- namespace"
```

### Task 1.2: Register fonts via next/font

**Files:**
- Modify: `apps/landing/src/app/[locale]/layout.tsx`

- [ ] **Step 1: Read current layout**

```bash
cat apps/landing/src/app/\[locale\]/layout.tsx | head -80
```

Note which element carries the root `<html>` / `<body>` — the fonts need their CSS variable classes applied there.

- [ ] **Step 2: Add font imports at the top of the file**

Add after the existing imports:

```ts
import { Geist_Mono, Inter, Instrument_Serif } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"]
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
  weight: "400",
  style: ["italic", "normal"]
});
```

- [ ] **Step 3: Apply font class names**

Find the root element of the layout (likely `<html>` or `<body>` inside a wrapper). Add a className combining all three variables:

```tsx
className={`${inter.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
```

If the element already has a className, append these with a space.

- [ ] **Step 4: Confirm `globals.css` has `--font-inter` mapping**

The existing `@theme` block already sets `--font-sans: var(--font-inter), …`. Leave it. The new `--font-dm-mono` and `--font-dm-display` variables added in Task 1.1 resolve to the font-variable CSS variables registered by `next/font`.

- [ ] **Step 5: Build**

```bash
bun build:landing
```

Expected: success. If it fails on font imports, check that `next/font/google` is spelled correctly (no `@` prefix in Next 16+).

- [ ] **Step 6: Commit**

```bash
git add apps/landing/src/app/\[locale\]/layout.tsx
git commit -m "feat(landing): load Inter, Geist Mono, Instrument Serif via next/font"
```

### Task 1.3: Create GridBackground component

**Files:**
- Create: `apps/landing/src/components/shell/GridBackground.tsx`

- [ ] **Step 1: Open source reference**

In `docs/superpowers/assets/claude-design/Landing.html`, find the `.grid-bg` CSS rule. It uses two linear gradients at 56×56px with a radial mask. Copy that visual intent.

- [ ] **Step 2: Write the component**

```tsx
export function GridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage:
          "linear-gradient(var(--color-dm-grid) 1px, transparent 1px), linear-gradient(90deg, var(--color-dm-grid) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage:
          "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.7), transparent 70%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.7), transparent 70%)"
      }}
    />
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/landing/src/components/shell/GridBackground.tsx
git commit -m "feat(landing): add GridBackground shell component"
```

### Task 1.4: Create ThemeScript to prevent theme flash

**Files:**
- Create: `apps/landing/src/components/shell/ThemeScript.tsx`

- [ ] **Step 1: Write the component**

`next-themes` already handles theme hydration, but we need an inline script that runs **before** React hydrates to avoid a flash. This is a standard pattern.

```tsx
export function ThemeScript() {
  const script = `
    try {
      var theme = localStorage.getItem('theme');
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      if (theme === 'dark') document.documentElement.classList.add('dark');
    } catch (e) {}
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
```

Key: this uses the `theme` localStorage key, which matches `next-themes`'s default (`storageKey="theme"`).

- [ ] **Step 2: Mount it in the locale layout `<head>`**

Edit `apps/landing/src/app/[locale]/layout.tsx`. Find the `<head>` tag (or add one inside the returned `<html>` if Next 16 auto-generates it — check by reading the file). Insert `<ThemeScript />` as the first child of `<head>`.

```tsx
import { ThemeScript } from "@/components/shell/ThemeScript";
// ...
<head>
  <ThemeScript />
  {/* existing head content */}
</head>
```

- [ ] **Step 3: Commit**

```bash
git add apps/landing/src/components/shell/ThemeScript.tsx apps/landing/src/app/\[locale\]/layout.tsx
git commit -m "feat(landing): add ThemeScript to prevent theme flash"
```

### Task 1.5: Create Navbar component

**Files:**
- Create: `apps/landing/src/components/shell/Navbar.tsx`

**Source:** `docs/superpowers/assets/claude-design/Landing.html` — locate `.nav`, `.nav-inner`, `.brand`, `.brand-mark`, `.nav-links`, `.nav-cta`, `.btn-*`, `.icon-btn` CSS rules (approximately lines 87-147 in the source). Locate the actual `<nav>` markup in the HTML body (search for `nav-inner`).

- [ ] **Step 1: Write the brand mark as an inline SVG**

The source brand mark is a 26×26 rounded square with teal→indigo gradient containing a small glyph. Extract the SVG from the source Landing.html `<div class="brand">` block. Reuse it verbatim inside the component.

- [ ] **Step 2: Write the Navbar component**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiGithubFill } from "@remixicon/react";
import { ThemeSwitch } from "@/components/ThemeSwitch";

const LINKS = [
  { href: "/", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/download", label: "Download" },
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" }
];

export function Navbar({ locale }: { locale: string }) {
  const pathname = usePathname();

  const hrefFor = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  const isActive = (href: string) => {
    const full = hrefFor(href);
    if (href === "/") return pathname === full || pathname === `/${locale}`;
    return pathname.startsWith(full);
  };

  return (
    <nav className="sticky top-0 z-50 border-dm-line border-b backdrop-blur-[14px]"
      style={{ background: "color-mix(in srgb, var(--color-dm-bg) 80%, transparent)" }}>
      <div className="mx-auto flex max-w-[1240px] items-center justify-between px-8 py-[14px]">
        <Link href={hrefFor("/")} className="flex items-center gap-[10px] text-[15px] font-bold tracking-[-0.01em] text-dm-ink">
          {/* brand mark SVG from Landing.html — 26×26, gradient from var(--color-dm-accent) to var(--color-dm-accent-2) */}
          <BrandMark />
          <span>Dockerman</span>
        </Link>

        <div className="hidden md:flex items-center gap-1 text-[13px] text-dm-ink-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={hrefFor(l.href)}
              className={`rounded-md px-3 py-[6px] transition-colors hover:bg-dm-bg-soft hover:text-dm-ink ${
                isActive(l.href) ? "text-dm-ink" : ""
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <a href="https://github.com/ZingerLittleBee/dockerman.app" aria-label="GitHub"
             className="grid h-8 w-8 place-items-center rounded-md text-dm-ink-2 hover:bg-dm-bg-soft hover:text-dm-ink">
            <RiGithubFill className="h-4 w-4" />
          </a>
          <Link href={hrefFor("/download")}
            className="inline-flex items-center gap-2 rounded-lg border border-dm-ink bg-dm-ink px-[14px] py-2 text-[13px] font-medium text-dm-bg transition-transform hover:-translate-y-px">
            Download
          </Link>
        </div>
      </div>
    </nav>
  );
}

function BrandMark() {
  return (
    <span
      className="relative grid h-[26px] w-[26px] place-items-center overflow-hidden rounded-[7px] text-white"
      style={{
        background: "linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))",
        boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.1), 0 4px 12px -4px var(--color-dm-accent)"
      }}
    >
      {/* paste the Dockerman brand glyph SVG from Landing.html .brand-mark */}
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    </span>
  );
}
```

Note: the new `bg-dm-ink` / `text-dm-bg` / `border-dm-line` utilities are generated by Tailwind v4 from the `--color-dm-*` theme tokens.

- [ ] **Step 3: Verify no existing file conflicts**

```bash
ls apps/landing/src/components/ui/Navbar.tsx
```

If it exists (it does), **leave it alone** — it will be deleted in Phase 6 cleanup.

- [ ] **Step 4: Commit**

```bash
git add apps/landing/src/components/shell/Navbar.tsx
git commit -m "feat(landing): add Navbar shell component"
```

### Task 1.6: Create Footer component

**Files:**
- Create: `apps/landing/src/components/shell/Footer.tsx`

**Source:** `docs/superpowers/assets/claude-design/Landing.html` — find `footer.footer` at the bottom of the document body and the matching `.footer-*` CSS rules.

- [ ] **Step 1: Write the component**

```tsx
import Link from "next/link";

export function Footer({ locale }: { locale: string }) {
  const prefix = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  return (
    <footer className="border-dm-line border-t py-12 text-[13px] text-dm-ink-3">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-bold text-[15px] text-dm-ink">Dockerman</div>
          <p className="mt-3 max-w-sm text-dm-ink-3">
            Local-first Docker, Podman and Kubernetes. Fast, quiet, and out of your way.
          </p>
        </div>
        <div>
          <div className="mb-3 font-medium text-dm-ink">Product</div>
          <ul className="space-y-2">
            <li><Link href={prefix("/")} className="hover:text-dm-ink">Features</Link></li>
            <li><Link href={prefix("/pricing")} className="hover:text-dm-ink">Pricing</Link></li>
            <li><Link href={prefix("/download")} className="hover:text-dm-ink">Download</Link></li>
            <li><Link href={prefix("/changelog")} className="hover:text-dm-ink">Changelog</Link></li>
          </ul>
        </div>
        <div>
          <div className="mb-3 font-medium text-dm-ink">Company</div>
          <ul className="space-y-2">
            <li><Link href={prefix("/about")} className="hover:text-dm-ink">About</Link></li>
            <li><Link href={prefix("/privacy")} className="hover:text-dm-ink">Privacy</Link></li>
            <li><Link href={prefix("/terms")} className="hover:text-dm-ink">Terms</Link></li>
            <li><Link href={prefix("/dpa")} className="hover:text-dm-ink">DPA</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1240px] px-8 text-dm-ink-4">
        © {new Date().getFullYear()} Dockerman. All rights reserved.
      </div>
    </footer>
  );
}
```

No license claim in the copyright line. The spec explicitly rules out "MIT".

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/components/shell/Footer.tsx
git commit -m "feat(landing): add Footer shell component"
```

### Task 1.7: Mount new shell in `(main)/layout.tsx`

**Files:**
- Modify: `apps/landing/src/app/[locale]/(main)/layout.tsx`

- [ ] **Step 1: Read current content**

```bash
cat "apps/landing/src/app/[locale]/(main)/layout.tsx"
```

- [ ] **Step 2: Rewrite the file**

```tsx
import { LenisProvider } from "@repo/shared/components/LenisProvider";
import type { ReactNode } from "react";
import { Footer } from "@/components/shell/Footer";
import { GridBackground } from "@/components/shell/GridBackground";
import { Navbar } from "@/components/shell/Navbar";

export default async function MainLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LenisProvider>
      <GridBackground />
      <Navbar locale={locale} />
      <div className="relative z-10">{children}</div>
      <Footer locale={locale} />
    </LenisProvider>
  );
}
```

Important: `params` is a Promise in Next 16+; await it.

- [ ] **Step 3: Verify build**

```bash
bun build:landing
```

Expected: success. If it complains that `(main)/layout.tsx` cannot be async, the Next runtime has changed — check existing async layouts in the repo for the pattern.

- [ ] **Step 4: Smoke test — docs still work**

```bash
bun dev:landing
```

In a separate terminal:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/docs/getting-started
```

Expected: `200`. Open in a browser and confirm Fumadocs chrome renders correctly (no new Navbar/Footer bleeding in).

Stop the dev server when done.

- [ ] **Step 5: Smoke test — marketing routes have new shell**

Restart dev server and open `http://localhost:3000/en` in a browser. Expected: new Navbar + grid bg visible; old Hero/Features still rendering below (since the pages aren't rewritten yet). This is **expected** mid-phase. Stop dev server.

- [ ] **Step 6: Commit**

```bash
git add "apps/landing/src/app/[locale]/(main)/layout.tsx"
git commit -m "feat(landing): mount new shell in (main) layout; docs untouched"
```

### Task 1.8: Phase 1 verification and PR

- [ ] **Step 1: Run full check**

```bash
bun check
bun build:landing
```

Both must exit 0.

- [ ] **Step 2: Push branch**

```bash
git push -u origin redesign/landing
```

- [ ] **Step 3: Open PR #1**

```bash
gh pr create --title "redesign(landing): shell — tokens, fonts, Navbar, Footer, GridBackground" --body "$(cat <<'EOF'
## Summary
- Add dm-* namespaced design tokens in globals.css
- Load Inter, Geist Mono, Instrument Serif via next/font
- New Navbar, Footer, GridBackground mounted in `(main)/layout.tsx`
- Docs (Fumadocs) shell untouched

## Test plan
- [ ] `bun check` passes
- [ ] `bun build:landing` passes
- [ ] `/en`, `/en/pricing`, `/en/download`, `/en/changelog` render new nav + footer
- [ ] `/en/docs/getting-started` still renders with Fumadocs chrome
- [ ] Light / dark theme toggle works without flash
EOF
)"
```

---

## Phase 2 — Landing page (PR #2)

Goal: replace `/[locale]/(main)/page.tsx` with the new design. Heaviest phase due to `LiveDashboard` and `CommandPalette` animations.

### Task 2.1: Shared UI primitives

**Files:**
- Create: `apps/landing/src/components/ui-dm/Pill.tsx`
- Create: `apps/landing/src/components/ui-dm/Chip.tsx`
- Create: `apps/landing/src/components/ui-dm/StatCard.tsx`
- Create: `apps/landing/src/components/ui-dm/IconButton.tsx`

Directory name is `ui-dm` (not `ui`) to keep the new primitives separate from the deprecated `ui/*`. Cleanup (Phase 6) renames `ui-dm/` → `ui/` once the old files are gone.

- [ ] **Step 1: `Pill.tsx`**

```tsx
import type { ReactNode } from "react";

export function Pill({ children, dot = false }: { children: ReactNode; dot?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-[10px] rounded-full border border-dm-line-strong bg-dm-bg-elev px-[10px] py-[5px] pl-[6px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-2"
    >
      {dot && (
        <span
          className="h-[6px] w-[6px] rounded-full"
          style={{
            background: "var(--color-dm-ok)",
            boxShadow: "0 0 0 4px color-mix(in srgb, var(--color-dm-ok) 30%, transparent)",
            animation: "dm-pulse 2.2s ease-in-out infinite"
          }}
        />
      )}
      {children}
    </span>
  );
}
```

- [ ] **Step 2: `Chip.tsx`**

```tsx
import type { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-dm-line px-2 py-[2px] font-[var(--font-dm-mono)] text-[11px] text-dm-ink-2">
      {children}
    </span>
  );
}
```

- [ ] **Step 3: `StatCard.tsx`**

```tsx
import type { ReactNode } from "react";

export function StatCard({
  title,
  value,
  subtitle,
  icon
}: {
  title: string;
  value: ReactNode;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-dm-line bg-dm-bg-elev p-4">
      <div className="flex items-center justify-between text-[12px] text-dm-ink-3">
        <span>{title}</span>
        {icon}
      </div>
      <div className="mt-2 font-bold text-[28px] text-dm-ink tracking-[-0.02em]">{value}</div>
      {subtitle && <div className="mt-1 text-[12px] text-dm-ink-4">{subtitle}</div>}
    </div>
  );
}
```

- [ ] **Step 4: `IconButton.tsx`**

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function IconButton({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      {...props}
      className={`grid h-8 w-8 place-items-center rounded-md border border-transparent text-dm-ink-2 hover:bg-dm-bg-soft hover:text-dm-ink ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add apps/landing/src/components/ui-dm/
git commit -m "feat(landing): shared primitives — Pill, Chip, StatCard, IconButton"
```

### Task 2.2: Sparkline SVG component + test

**Files:**
- Create: `apps/landing/src/components/ui-dm/Sparkline.tsx`
- Create: `apps/landing/src/components/ui-dm/Sparkline.test.tsx`

- [ ] **Step 1: Write the test first**

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sparkline } from "./Sparkline";

describe("Sparkline", () => {
  it("renders a <path> element when given data", () => {
    const { container } = render(<Sparkline data={[1, 2, 3, 4, 5]} stroke="#10b981" />);
    const path = container.querySelector("path");
    expect(path).not.toBeNull();
  });

  it("renders nothing meaningful when data is empty", () => {
    const { container } = render(<Sparkline data={[]} stroke="#10b981" />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(0);
  });

  it("emits a fill area when fill prop is set", () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} stroke="#10b981" fill="#10b98133" />);
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBe(2);
  });
});
```

- [ ] **Step 2: Run to watch it fail**

```bash
cd apps/landing && bunx vitest run src/components/ui-dm/Sparkline.test.tsx
```

Expected: fail with "Cannot find module './Sparkline'".

- [ ] **Step 3: Write the component**

```tsx
interface SparklineProps {
  data: number[];
  stroke: string;
  fill?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

export function Sparkline({
  data,
  stroke,
  fill,
  width = 120,
  height = 32,
  strokeWidth = 1.5
}: SparklineProps) {
  if (data.length < 2) return <svg width={width} height={height} aria-hidden />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - strokeWidth * 2) - strokeWidth;
    return [x, y] as const;
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
  const fillPath = fill
    ? `${linePath} L${width},${height} L0,${height} Z`
    : null;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden>
      {fillPath && <path d={fillPath} fill={fill} stroke="none" />}
      <path d={linePath} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
```

- [ ] **Step 4: Run tests again**

```bash
cd apps/landing && bunx vitest run src/components/ui-dm/Sparkline.test.tsx
```

Expected: all three pass.

- [ ] **Step 5: Commit**

```bash
git add apps/landing/src/components/ui-dm/Sparkline.tsx apps/landing/src/components/ui-dm/Sparkline.test.tsx
git commit -m "feat(landing): Sparkline SVG component + tests"
```

### Task 2.3: `useSparkline` hook — resamples data on interval

**Files:**
- Create: `apps/landing/src/components/landing/hooks/useSparkline.ts`

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  seed: number[];
  intervalMs: number;
  volatility?: number;
  min?: number;
  max?: number;
  enabled?: boolean;
}

export function useSparkline({
  seed,
  intervalMs,
  volatility = 0.15,
  min = 0,
  max = 100,
  enabled = true
}: Options) {
  const [data, setData] = useState<number[]>(seed);
  const dataRef = useRef(seed);

  useEffect(() => {
    if (!enabled) return;
    const reducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const id = setInterval(() => {
      const prev = dataRef.current;
      const last = prev[prev.length - 1] ?? 50;
      const delta = (Math.random() - 0.5) * (max - min) * volatility;
      const next = Math.max(min, Math.min(max, last + delta));
      const newData = [...prev.slice(1), next];
      dataRef.current = newData;
      setData(newData);
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs, volatility, min, max, enabled]);

  return data;
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/components/landing/hooks/useSparkline.ts
git commit -m "feat(landing): useSparkline hook for animated data series"
```

### Task 2.4: `useTypewriter` hook

**Files:**
- Create: `apps/landing/src/components/landing/hooks/useTypewriter.ts`

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { useEffect, useState } from "react";

export function useTypewriter({
  lines,
  charMs = 60,
  holdMs = 1200,
  enabled = true
}: {
  lines: string[];
  charMs?: number;
  holdMs?: number;
  enabled?: boolean;
}) {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (!enabled || lines.length === 0) return;
    const reducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setCharIdx(lines[0].length);
      return;
    }

    const current = lines[lineIdx];
    if (charIdx < current.length) {
      const t = setTimeout(() => setCharIdx((i) => i + 1), charMs);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setCharIdx(0);
      setLineIdx((i) => (i + 1) % lines.length);
    }, holdMs);
    return () => clearTimeout(t);
  }, [charIdx, lineIdx, lines, charMs, holdMs, enabled]);

  return { text: lines[lineIdx]?.slice(0, charIdx) ?? "", lineIdx };
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/components/landing/hooks/useTypewriter.ts
git commit -m "feat(landing): useTypewriter hook for command palette loop"
```

### Task 2.5: Hero section

**Files:**
- Create: `apps/landing/src/components/landing/Hero.tsx`

**Source:** `docs/superpowers/assets/claude-design/Landing.html`, search for `<section class="hero">`. Copy the markup structure and translate to JSX. Preserve: eyebrow pill with pulse dot, Instrument Serif italic accent on the last word, stat triplet.

- [ ] **Step 1: Write the component**

```tsx
import Link from "next/link";
import { Pill } from "@/components/ui-dm/Pill";

export function Hero({ locale }: { locale: string }) {
  return (
    <section className="relative px-8 pb-8 pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-[1] h-[500px] w-[900px] -translate-x-1/2 blur-[40px]"
        style={{
          background:
            "radial-gradient(ellipse at center top, color-mix(in srgb, var(--color-dm-accent) 25%, transparent), transparent 60%)"
        }}
      />
      <div className="mx-auto max-w-[1240px]">
        <Pill dot>
          <span className="rounded-full bg-dm-ink px-2 py-[2px] text-[10px] font-semibold tracking-wide text-dm-bg">
            v5.1
          </span>
          local-first · ~30 MB RAM
        </Pill>

        <h1 className="mt-[22px] max-w-[14ch] font-bold text-[clamp(44px,7.2vw,96px)] leading-[0.95] tracking-[-0.045em] text-dm-ink">
          Docker, done quietly{" "}
          <span
            className="bg-clip-text italic text-transparent"
            style={{
              fontFamily: "var(--font-dm-display)",
              fontWeight: 400,
              backgroundImage:
                "linear-gradient(135deg, var(--color-dm-accent) 0%, var(--color-dm-accent-2) 100%)"
            }}
          >
            in 30MB.
          </span>
        </h1>

        <p className="mt-6 max-w-[52ch] text-[17px] text-dm-ink-2">
          A local-first control surface for Docker, Podman and Kubernetes. Built in Rust and Tauri.
          Fast, precise, and designed to stay out of your way.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/download`}
            className="inline-flex items-center gap-2 rounded-lg border border-dm-ink bg-dm-ink px-5 py-[10px] text-[14px] font-medium text-dm-bg hover:-translate-y-px"
          >
            Download for macOS
          </Link>
          <a
            href="https://github.com/ZingerLittleBee/dockerman.app"
            className="inline-flex items-center gap-2 rounded-lg border border-dm-line-strong bg-dm-bg-elev px-5 py-[10px] text-[14px] font-medium text-dm-ink hover:bg-dm-bg-soft"
          >
            Star on GitHub
          </a>
        </div>

        <div className="mt-12 grid max-w-[640px] grid-cols-3 gap-6 border-t border-dm-line pt-6">
          {[
            { k: "~30 MB", v: "Idle memory" },
            { k: "~0 ms", v: "Cold start" },
            { k: "100%", v: "Local-first" }
          ].map((s) => (
            <div key={s.v}>
              <div
                className="text-[24px] font-bold tracking-[-0.02em] text-dm-ink"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                {s.k}
              </div>
              <div className="mt-1 text-[12px] text-dm-ink-3">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/components/landing/Hero.tsx
git commit -m "feat(landing): Hero section"
```

### Task 2.6: LiveDashboard — app frame shell + sidebar

**Files:**
- Create: `apps/landing/src/components/landing/LiveDashboard.tsx`

**Source:** `docs/superpowers/assets/claude-design/live-dash.js` (full file, ~314 lines) + the `.app-frame`, `.app-titlebar`, `.app-body`, `.app-sidebar`, `.side-item`, `.side-label`, `.host-avatar` CSS rules in `Landing.html`.

This component is large. Break rendering into helpers. All sidebar SVG icons are in `live-dash.js` lines 22-78; copy verbatim into JSX (change `class=` to `className=`, self-close paths).

- [ ] **Step 1: Scaffolding**

```tsx
"use client";

import { useSparkline } from "./hooks/useSparkline";

const SIDEBAR_MAIN = [
  "Dashboard", "Container", "Image", "Build", "Network", "Volume", "Events", "Templates"
] as const;

const SIDEBAR_ACTIONS = [
  "Terminal", "Process", "Inspect", "Stats", "Logs", "File"
] as const;

const MOCK_CONTAINERS = [
  { name: "redis",    img: "redis:7",            state: "running" as const, seed: [30, 32, 28, 34, 31, 30, 33] },
  { name: "postgres", img: "postgres:16",        state: "running" as const, seed: [45, 48, 46, 50, 49, 47, 51] },
  { name: "traefik",  img: "traefik:v3",         state: "running" as const, seed: [12, 14, 13, 15, 13, 14, 16] },
  { name: "plex",     img: "plexinc/pms:latest", state: "stopped" as const, seed: [] },
  { name: "node",     img: "node:20-alpine",     state: "running" as const, seed: [18, 20, 22, 19, 21, 23, 20] }
];

export function LiveDashboard() {
  return (
    <div className="mx-auto mt-10 max-w-[1240px] overflow-hidden rounded-[14px] border border-dm-line-strong bg-dm-bg-elev shadow-[0_20px_60px_-20px_rgb(0_0_0_/_0.3)]">
      <Titlebar />
      <div className="grid grid-cols-[220px_1fr]">
        <Sidebar />
        <Main />
      </div>
    </div>
  );
}

function Titlebar() {
  return (
    <div className="flex h-[34px] items-center gap-2 border-dm-line border-b px-3">
      <span className="block h-3 w-3 rounded-full bg-[#ff5f57]" />
      <span className="block h-3 w-3 rounded-full bg-[#febc2e]" />
      <span className="block h-3 w-3 rounded-full bg-[#28c840]" />
    </div>
  );
}
```

- [ ] **Step 2: Sidebar**

```tsx
function Sidebar() {
  return (
    <aside className="border-dm-line border-r p-3 text-[13px]">
      <div className="mb-4 flex items-center gap-2 rounded-md bg-dm-bg-soft p-2">
        <div className="grid h-7 w-7 place-items-center rounded-md bg-dm-ink text-[12px] font-bold text-dm-bg">L</div>
        <div className="flex flex-col">
          <span className="text-dm-ink">Localhost</span>
          <span className="text-[11px] text-dm-ink-3">docker · 28.5.2</span>
        </div>
      </div>

      {SIDEBAR_MAIN.map((label, i) => (
        <SideItem key={label} label={label} active={i === 0} />
      ))}

      <div className="mt-3 mb-1 px-2 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-wider text-dm-ink-4">
        Actions
      </div>
      {SIDEBAR_ACTIONS.map((label) => (
        <SideItem key={label} label={label} />
      ))}

      <div className="mt-3 mb-1 px-2 font-[var(--font-dm-mono)] text-[10px] uppercase tracking-wider text-dm-ink-4">
        Containers · {MOCK_CONTAINERS.length}
      </div>
      {MOCK_CONTAINERS.map((c) => (
        <ContainerRow key={c.name} name={c.name} state={c.state} seed={c.seed} />
      ))}
    </aside>
  );
}

function SideItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex cursor-default items-center gap-2 rounded-md px-2 py-[6px] text-[12px] ${
        active ? "bg-dm-bg-soft text-dm-ink" : "text-dm-ink-2 hover:bg-dm-bg-soft"
      }`}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        {/* For fidelity, replace with the per-item SVG from live-dash.js lines 22-78.
            For now use a generic square. */}
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
      {label}
    </div>
  );
}
```

**Note**: the placeholder `<rect>` SVG is a starter. Before merging this phase, replace each `SideItem` / `ContainerRow` SVG with the exact icon from `live-dash.js` — copy the `<svg>…</svg>` markup verbatim, change `class` to `className`, and pass through the `label`.

- [ ] **Step 3: Container rows with sparklines**

```tsx
import { Sparkline } from "@/components/ui-dm/Sparkline";

function ContainerRow({ name, state, seed }: { name: string; state: "running" | "stopped"; seed: number[] }) {
  const data = useSparkline({
    seed: seed.length > 0 ? seed : [0],
    intervalMs: 1500,
    volatility: 0.2,
    min: 5,
    max: 80,
    enabled: state === "running"
  });
  return (
    <div className="flex items-center gap-2 rounded-md px-2 py-[6px] text-[12px] text-dm-ink-2">
      <span
        className="h-[6px] w-[6px] rounded-full"
        style={{ background: state === "running" ? "var(--color-dm-ok)" : "var(--color-dm-ink-4)" }}
      />
      <span className="flex-1 truncate">{name}</span>
      {state === "running" ? (
        <Sparkline data={data} stroke="var(--color-dm-ok)" width={60} height={16} />
      ) : (
        <span className="text-[10px] text-dm-ink-4">idle</span>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Main content shell**

```tsx
function Main() {
  return (
    <div className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-[16px] font-semibold text-dm-ink">Dashboard</div>
        <div className="flex items-center gap-2 text-[11px] text-dm-ink-3">
          <span
            className="h-[6px] w-[6px] rounded-full"
            style={{ background: "var(--color-dm-ok)", animation: "dm-pulse 2.2s ease-in-out infinite" }}
          />
          live
        </div>
      </div>
      <KpiRow />
      <SystemRow />
      <ChartRow />
      <IoRow />
    </div>
  );
}
```

The four row components (`KpiRow`, `SystemRow`, `ChartRow`, `IoRow`) are added in the next tasks.

- [ ] **Step 5: Commit the scaffold (non-rendering)**

Add temporary `function KpiRow(){return null;}` etc. stubs so the file compiles. Then commit.

```bash
git add apps/landing/src/components/landing/LiveDashboard.tsx
git commit -m "feat(landing): LiveDashboard scaffold + sidebar + container rows"
```

### Task 2.7: LiveDashboard KPI rows

**Files:**
- Modify: `apps/landing/src/components/landing/LiveDashboard.tsx`

- [ ] **Step 1: Replace the `KpiRow` stub**

```tsx
import { StatCard } from "@/components/ui-dm/StatCard";

function KpiRow() {
  return (
    <div className="grid grid-cols-4 gap-3">
      <StatCard title="Containers" value="12" subtitle="8 running · 4 exited" />
      <StatCard title="Images" value="47" subtitle="3 updates available" />
      <StatCard title="Total Image Size" value="18.4 GB" subtitle="on disk" />
      <StatCard title="Images In Use" value="21" subtitle="of 47" />
    </div>
  );
}
```

- [ ] **Step 2: Replace the `SystemRow` stub**

```tsx
function SystemRow() {
  return (
    <div className="mt-3 grid grid-cols-4 gap-3">
      <StatCard title="Docker Version" value="28.5.2" subtitle="Stable" />
      <StatCard title="Storage Driver" value="overlay2" />
      <StatCard title="System Resources" value="8 CPU · 32 GB" />
      <StatCard title="Operating System" value="macOS 14.5" />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/landing/src/components/landing/LiveDashboard.tsx
git commit -m "feat(landing): LiveDashboard KPI rows"
```

### Task 2.8: LiveDashboard CPU + Memory chart row (animated)

**Files:**
- Modify: `apps/landing/src/components/landing/LiveDashboard.tsx`

Signature colors are **hardcoded** per spec: Memory teal `#10b981`, CPU indigo `#6366f1`. Do not route through `--color-dm-accent` (that can be reskinned; these cannot).

- [ ] **Step 1: Replace the `ChartRow` stub**

```tsx
function ChartRow() {
  const cpu = useSparkline({
    seed: [22, 28, 26, 30, 27, 31, 29, 33, 30, 28, 26, 31],
    intervalMs: 1500,
    volatility: 0.12,
    min: 10,
    max: 85
  });
  const mem = useSparkline({
    seed: [42, 44, 45, 46, 47, 46, 48, 49, 50, 49, 48, 50],
    intervalMs: 1500,
    volatility: 0.08,
    min: 20,
    max: 80
  });

  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      <ChartCard title="CPU" value={`${Math.round(cpu[cpu.length - 1] ?? 0)}%`} stroke="#6366f1">
        <Sparkline data={cpu} stroke="#6366f1" width={500} height={120} strokeWidth={1.75} />
      </ChartCard>
      <ChartCard title="Memory" value={`${Math.round(mem[mem.length - 1] ?? 0)}%`} stroke="#10b981">
        <Sparkline data={mem} stroke="#10b981" fill="#10b98122" width={500} height={120} strokeWidth={1.75} />
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  value,
  stroke,
  children
}: {
  title: string;
  value: string;
  stroke: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[12px] border border-dm-line bg-dm-bg-elev p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] text-dm-ink-3">{title}</span>
        <span className="text-[20px] font-semibold" style={{ color: stroke, fontFamily: "var(--font-dm-mono)" }}>
          {value}
        </span>
      </div>
      <div className="mt-2 w-full">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/components/landing/LiveDashboard.tsx
git commit -m "feat(landing): LiveDashboard CPU + Memory animated charts"
```

### Task 2.9: LiveDashboard Network + Disk I/O row

**Files:**
- Modify: `apps/landing/src/components/landing/LiveDashboard.tsx`

- [ ] **Step 1: Replace the `IoRow` stub**

```tsx
function IoRow() {
  const net = useSparkline({
    seed: [12, 18, 15, 22, 16, 24, 19, 28, 21, 26, 23, 29],
    intervalMs: 1500,
    volatility: 0.2,
    min: 5,
    max: 60
  });
  const disk = useSparkline({
    seed: [8, 10, 12, 9, 14, 11, 15, 12, 10, 13, 16, 11],
    intervalMs: 1500,
    volatility: 0.15,
    min: 2,
    max: 40
  });
  return (
    <div className="mt-3 grid grid-cols-2 gap-3">
      <ChartCard title="Network I/O" value={`${(net[net.length - 1] ?? 0).toFixed(1)} MB/s`} stroke="#a855f7">
        <Sparkline data={net} stroke="#a855f7" fill="#a855f722" width={500} height={100} strokeWidth={1.5} />
      </ChartCard>
      <ChartCard title="Disk I/O" value={`${(disk[disk.length - 1] ?? 0).toFixed(1)} MB/s`} stroke="#ec4899">
        <Sparkline data={disk} stroke="#ec4899" fill="#ec489922" width={500} height={100} strokeWidth={1.5} />
      </ChartCard>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/components/landing/LiveDashboard.tsx
git commit -m "feat(landing): LiveDashboard Network + Disk I/O charts"
```

### Task 2.10: CommandPalette with typewriter

**Files:**
- Create: `apps/landing/src/components/landing/CommandPalette.tsx`

**Source:** `docs/superpowers/assets/claude-design/palette.js` + the `.palette-*` CSS in `Landing.html`.

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useTypewriter } from "./hooks/useTypewriter";

const LINES = [
  "start redis",
  "ssh root@fly.dev",
  "tunnel :3000 public",
  "scan nginx:alpine"
];

export function CommandPalette() {
  const { text } = useTypewriter({ lines: LINES, charMs: 55, holdMs: 1100 });

  return (
    <div className="pointer-events-none absolute right-10 top-24 z-10 w-[380px] max-w-[90vw] rounded-[14px] border border-dm-line-strong bg-dm-bg-elev p-3 shadow-[0_30px_60px_-20px_rgb(0_0_0_/_0.4)]">
      <div className="mb-3 flex items-center gap-2 text-[11px] text-dm-ink-3">
        <span
          className="rounded-md border border-dm-line bg-dm-bg-soft px-[6px] py-[1px] font-semibold"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          ⌘K
        </span>
        Command palette
      </div>
      <div
        className="flex items-center gap-2 rounded-md bg-dm-bg-soft px-3 py-2 font-[var(--font-dm-mono)] text-[13px] text-dm-ink"
      >
        <span style={{ color: "var(--color-dm-accent)" }}>›</span>
        <span>{text}</span>
        <span className="inline-block h-[14px] w-[7px] bg-dm-ink" style={{ animation: "dm-pulse 1s step-end infinite" }} />
      </div>
      <div className="mt-2 grid gap-1 text-[12px] text-dm-ink-3">
        <HintRow kbd="↵" hint="run command" />
        <HintRow kbd="⇥" hint="complete" />
        <HintRow kbd="?" hint="all commands" />
      </div>
    </div>
  );
}

function HintRow({ kbd, hint }: { kbd: string; hint: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="rounded-md border border-dm-line bg-dm-bg-soft px-[6px] py-[1px]"
        style={{ fontFamily: "var(--font-dm-mono)" }}
      >
        {kbd}
      </span>
      <span>{hint}</span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/components/landing/CommandPalette.tsx
git commit -m "feat(landing): CommandPalette with typewriter"
```

### Task 2.11: RuntimeStrip

**Files:**
- Create: `apps/landing/src/components/landing/RuntimeStrip.tsx`

**Source:** `docs/superpowers/assets/claude-design/Landing.html` — find the `.runtime-strip` section below the hero.

- [ ] **Step 1: Write the component**

```tsx
const RUNTIMES = [
  { name: "Docker" },
  { name: "Podman" },
  { name: "Kubernetes" },
  { name: "SSH" },
  { name: "Cloudflared" },
  { name: "WSL2" }
];

export function RuntimeStrip() {
  return (
    <section className="border-y border-dm-line bg-dm-bg-elev/50">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-6 px-8 py-6 text-[12px] text-dm-ink-3">
        <span className="font-[var(--font-dm-mono)] uppercase tracking-wider">Runs with</span>
        {RUNTIMES.map((r) => (
          <span key={r.name} className="inline-flex items-center gap-2 text-dm-ink-2">
            <span className="h-[6px] w-[6px] rounded-full" style={{ background: "var(--color-dm-accent)" }} />
            {r.name}
          </span>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/components/landing/RuntimeStrip.tsx
git commit -m "feat(landing): RuntimeStrip (Docker/Podman/K8s/SSH/Cloudflared/WSL2)"
```

### Task 2.12: FeaturesGrid bento (6 cards)

**Files:**
- Create: `apps/landing/src/components/landing/FeaturesGrid.tsx`

**Source:** `docs/superpowers/assets/claude-design/Landing.html`. Search for `class="features"` and copy the 6-card grid verbatim. The bento layout uses CSS grid with spans defined per-card.

- [ ] **Step 1: Write the component**

```tsx
import Image from "next/image";

export function FeaturesGrid() {
  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-10 max-w-[52ch]">
          <div
            className="font-[var(--font-dm-mono)] text-[11px] uppercase tracking-wider text-dm-accent"
            style={{ color: "var(--color-dm-accent)" }}
          >
            Features
          </div>
          <h2 className="mt-2 font-bold text-[42px] leading-[1.05] tracking-[-0.03em] text-dm-ink">
            Built for the way you actually work.
          </h2>
        </div>

        <div className="grid auto-rows-[220px] grid-cols-6 gap-4">
          <PaletteCard />
          <DockerPodmanCard />
          <EventsCard />
          <PodmanNativeCard />
          <ImageUpgradeCard />
          <TrivyCard />
        </div>
      </div>
    </section>
  );
}

function PaletteCard() {
  return (
    <article className="col-span-4 row-span-2 rounded-[14px] border border-dm-line bg-dm-bg-elev p-6">
      <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: "var(--font-dm-mono)" }}>
        ⌘K · Command palette
      </div>
      <h3 className="mt-2 font-bold text-[24px] text-dm-ink">Everything, one keystroke away.</h3>
      <p className="mt-3 max-w-[46ch] text-[14px] text-dm-ink-2">
        Start containers, open terminals, tunnel ports, inspect images. Full fuzzy search over every
        resource and every action — never leave the keyboard.
      </p>
    </article>
  );
}

function DockerPodmanCard() {
  return (
    <article className="col-span-2 rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
      <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: "var(--font-dm-mono)" }}>
        Runtime
      </div>
      <h3 className="mt-2 font-semibold text-[17px] text-dm-ink">Docker or Podman. Your pick.</h3>
      <p className="mt-2 text-[13px] text-dm-ink-2">
        Auto-detection per host. Mix both on the same machine.
      </p>
    </article>
  );
}

function EventsCard() {
  return (
    <article className="col-span-2 rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
      <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: "var(--font-dm-mono)" }}>
        Events
      </div>
      <h3 className="mt-2 font-semibold text-[17px] text-dm-ink">Events, loud and legible.</h3>
      <p className="mt-2 text-[13px] text-dm-ink-2">
        Every pull, restart, and crash in a readable timeline — not a wall of logs.
      </p>
    </article>
  );
}

function PodmanNativeCard() {
  return (
    <article className="col-span-2 rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
      <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: "var(--font-dm-mono)" }}>
        Podman
      </div>
      <h3 className="mt-2 font-semibold text-[17px] text-dm-ink">First-class Podman.</h3>
      <p className="mt-2 text-[13px] text-dm-ink-2">
        Rootless and rootful sockets discovered automatically. No configuration.
      </p>
    </article>
  );
}

function ImageUpgradeCard() {
  return (
    <article className="col-span-2 rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
      <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: "var(--font-dm-mono)" }}>
        Upgrades
      </div>
      <h3 className="mt-2 font-semibold text-[17px] text-dm-ink">Image upgrade, with rollback.</h3>
      <p className="mt-2 text-[13px] text-dm-ink-2">
        Digest-aware. One click forward, one click back.
      </p>
    </article>
  );
}

function TrivyCard() {
  return (
    <article className="col-span-2 rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
      <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: "var(--font-dm-mono)" }}>
        Security
      </div>
      <h3 className="mt-2 font-semibold text-[17px] text-dm-ink">Images you can trust.</h3>
      <p className="mt-2 text-[13px] text-dm-ink-2">
        Inline Trivy CVE scans. Registry credentials stored in OS keychain.
      </p>
    </article>
  );
}
```

**Fidelity pass note:** after wiring everything, open the source `Landing.html` next to the running dev server and tighten any card that is off (padding, preview graphics, hover states). This placeholder copy is aligned with the spec but not pixel-matched.

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/components/landing/FeaturesGrid.tsx
git commit -m "feat(landing): FeaturesGrid 6-card bento"
```

### Task 2.13: CtaFinal

**Files:**
- Create: `apps/landing/src/components/landing/CtaFinal.tsx`

- [ ] **Step 1: Write the component**

```tsx
import Link from "next/link";

export function CtaFinal({ locale }: { locale: string }) {
  return (
    <section className="px-8 py-24">
      <div className="mx-auto max-w-[1240px] rounded-[20px] border border-dm-line bg-dm-bg-elev px-10 py-16 text-center">
        <h2 className="font-bold text-[40px] leading-[1.05] tracking-[-0.03em] text-dm-ink">
          Ready to tame{" "}
          <span
            className="italic"
            style={{ fontFamily: "var(--font-dm-display)", color: "var(--color-dm-accent)" }}
          >
            your containers?
          </span>
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${locale}/download`}
            className="rounded-lg border border-dm-ink bg-dm-ink px-5 py-[10px] text-[14px] font-medium text-dm-bg"
          >
            Download
          </Link>
          <Link
            href={`/${locale}/docs/getting-started`}
            className="rounded-lg border border-dm-line-strong bg-transparent px-5 py-[10px] text-[14px] font-medium text-dm-ink"
          >
            Docs
          </Link>
          <a
            href="https://github.com/ZingerLittleBee/dockerman.app"
            className="rounded-lg border border-dm-line-strong bg-transparent px-5 py-[10px] text-[14px] font-medium text-dm-ink"
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/components/landing/CtaFinal.tsx
git commit -m "feat(landing): CtaFinal section"
```

### Task 2.14: Wire Landing page

**Files:**
- Modify: `apps/landing/src/app/[locale]/(main)/page.tsx`

- [ ] **Step 1: Read current page**

```bash
cat "apps/landing/src/app/[locale]/(main)/page.tsx"
```

- [ ] **Step 2: Rewrite the file**

```tsx
import type { Metadata } from "next";
import { CommandPalette } from "@/components/landing/CommandPalette";
import { CtaFinal } from "@/components/landing/CtaFinal";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { Hero } from "@/components/landing/Hero";
import { LiveDashboard } from "@/components/landing/LiveDashboard";
import { RuntimeStrip } from "@/components/landing/RuntimeStrip";

export const metadata: Metadata = {
  title: "Dockerman — local-first Docker, Podman & Kubernetes",
  description:
    "A local-first control surface for Docker, Podman and Kubernetes. Built in Rust and Tauri. Fast, precise, designed to stay out of your way."
};

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <main>
      <Hero locale={locale} />
      <div className="relative px-8">
        <LiveDashboard />
        <CommandPalette />
      </div>
      <RuntimeStrip />
      <FeaturesGrid />
      <CtaFinal locale={locale} />
    </main>
  );
}
```

- [ ] **Step 3: Run dev server and verify**

```bash
bun dev:landing
```

Open `http://localhost:3000/en`. Expected:
- Grid background visible
- Hero with pulse dot in eyebrow, italic "in 30MB." accent
- LiveDashboard with animated CPU + Memory charts (teal + indigo), animated container row sparklines
- Command palette overlay with cycling typewriter
- RuntimeStrip row
- 6-card FeaturesGrid bento
- Final CTA

Test dark mode via ThemeSwitch in nav. Stop dev server.

- [ ] **Step 4: Verify reduced-motion**

Open DevTools → Rendering → "prefers-reduced-motion: reduce". Reload. Expected: sparklines, typewriter, pulse dot all freeze. Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add "apps/landing/src/app/[locale]/(main)/page.tsx"
git commit -m "feat(landing): wire new Landing page composition"
```

### Task 2.15: Phase 2 verification and PR

- [ ] **Step 1: Full check**

```bash
bun check
bun build:landing
```

- [ ] **Step 2: Icon fidelity pass**

Open `docs/superpowers/assets/claude-design/live-dash.js` side-by-side with `LiveDashboard.tsx`. Replace each placeholder `<rect>` SVG in `SideItem` with the matching per-label icon from `live-dash.js` lines 22-78. For each, copy the `<svg>…</svg>` block verbatim, change `class=` to `className=` and `stroke-width` to `strokeWidth`. Commit as a single fidelity pass.

```bash
git commit -am "feat(landing): LiveDashboard sidebar icons match source design"
```

- [ ] **Step 3: Lighthouse spot-check**

```bash
bun dev:landing
```

Open `http://localhost:3000/en` in Chrome. DevTools → Lighthouse → "Performance" → run. Confirm LCP < 2.5s, CLS < 0.1. Stop dev server.

- [ ] **Step 4: Open PR #2**

```bash
gh pr create --title "redesign(landing): / — Hero, LiveDashboard, CommandPalette, FeaturesGrid" --body "$(cat <<'EOF'
## Summary
- Hero with Instrument Serif italic accent + animated pulse dot
- LiveDashboard: full-fidelity app frame with CPU/Memory (teal/indigo), Network/Disk (purple/pink), animated container-row sparklines
- CommandPalette with typewriter loop
- RuntimeStrip + 6-card FeaturesGrid + CtaFinal
- All animations honour prefers-reduced-motion

## Test plan
- [ ] `/en` renders new Landing in light and dark
- [ ] Animations stop when prefers-reduced-motion is set
- [ ] Lighthouse LCP < 2.5s, CLS < 0.1
EOF
)"
```

---

## Phase 3 — Pricing page (PR #3)

### Task 3.1: `config/pricing.ts`

**Files:**
- Create: `apps/landing/src/config/pricing.ts`

- [ ] **Step 1: Write the config**

```ts
export const pricingConfig = {
  earlyBirdDeadlineUtc: "2026-06-30T23:59:59Z",
  plans: {
    free: { price: 0 },
    team: { priceEarlyBird: 19, priceRegular: 29, devices: 3 },
    solo: { priceEarlyBird: 14, priceRegular: 19, devices: 1 }
  },
  refund: {
    days: 14
    // FAQ prose stays in packages/shared/src/locales/*.json under pricing.faq.items[]
  },
  trust: {
    asOf: "2026-04-23",
    users: 12400,
    githubStars: 2100
  }
} as const;

export type PricingConfig = typeof pricingConfig;
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/config/pricing.ts
git commit -m "feat(landing): pricing config (countdown, plans, trust metrics)"
```

### Task 3.2: `Countdown` client component + test

**Files:**
- Create: `apps/landing/src/components/pricing/Countdown.tsx`
- Create: `apps/landing/src/components/pricing/Countdown.test.tsx`

- [ ] **Step 1: Write the test**

```tsx
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Countdown } from "./Countdown";

describe("Countdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-23T00:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders days/hours/minutes/seconds when deadline is in the future", () => {
    render(<Countdown deadlineUtc="2026-05-23T00:00:00Z" />);
    expect(screen.getByText(/days?/i)).toBeInTheDocument();
  });

  it("renders nothing when deadline is already past", () => {
    const { container } = render(<Countdown deadlineUtc="2026-01-01T00:00:00Z" />);
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Run to watch it fail**

```bash
cd apps/landing && bunx vitest run src/components/pricing/Countdown.test.tsx
```

Expected: "Cannot find module".

- [ ] **Step 3: Write the component**

```tsx
"use client";

import { useEffect, useState } from "react";

function diff(targetMs: number, nowMs: number) {
  const ms = Math.max(0, targetMs - nowMs);
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000),
    expired: ms === 0
  };
}

export function Countdown({ deadlineUtc }: { deadlineUtc: string }) {
  const target = new Date(deadlineUtc).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (Date.now() >= target) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  const d = diff(target, now);
  if (d.expired) return null;

  const cells: Array<[string, number]> = [
    ["days", d.days],
    ["hours", d.hours],
    ["minutes", d.minutes],
    ["seconds", d.seconds]
  ];
  return (
    <div className="flex items-center gap-4 font-[var(--font-dm-mono)]">
      {cells.map(([label, v]) => (
        <div key={label} className="text-center">
          <div className="text-[28px] font-bold text-dm-ink">{v.toString().padStart(2, "0")}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wider text-dm-ink-3">{label}</div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run tests**

```bash
cd apps/landing && bunx vitest run src/components/pricing/Countdown.test.tsx
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add apps/landing/src/components/pricing/Countdown.tsx apps/landing/src/components/pricing/Countdown.test.tsx
git commit -m "feat(landing): Countdown client component + tests"
```

### Task 3.3: `PlanCard` + `TrustBar` + `ComparisonTable` + `PricingFaq` + `PricingHero`

**Files:**
- Create: `apps/landing/src/components/pricing/PlanCard.tsx`
- Create: `apps/landing/src/components/pricing/TrustBar.tsx`
- Create: `apps/landing/src/components/pricing/ComparisonTable.tsx`
- Create: `apps/landing/src/components/pricing/PricingFaq.tsx`
- Create: `apps/landing/src/components/pricing/PricingHero.tsx`

**Source:** `docs/superpowers/assets/claude-design/Pricing.html`. Read the whole file top-to-bottom before starting; it shows the exact card layout, highlight treatment, comparison table row groups, and FAQ accordion styling.

- [ ] **Step 1: `PricingHero.tsx`**

```tsx
import { Pill } from "@/components/ui-dm/Pill";

export function PricingHero() {
  return (
    <section className="px-8 pb-8 pt-16">
      <div className="mx-auto max-w-[1240px]">
        <Pill>Early bird · 30% off until June 30</Pill>
        <h1 className="mt-5 max-w-[18ch] font-bold text-[clamp(40px,6vw,72px)] leading-[0.95] tracking-[-0.04em] text-dm-ink">
          Simple pricing,{" "}
          <span
            className="italic"
            style={{
              fontFamily: "var(--font-dm-display)",
              backgroundImage: "linear-gradient(135deg, var(--color-dm-accent) 0%, var(--color-dm-accent-2) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              fontWeight: 400
            }}
          >
            no seats, no surveillance.
          </span>
        </h1>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: `PlanCard.tsx`**

```tsx
import type { ReactNode } from "react";

export interface PlanCardProps {
  name: string;
  price: ReactNode;
  priceSuffix?: string;
  strikePrice?: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlight?: boolean;
  highlightLabel?: string;
}

export function PlanCard(p: PlanCardProps) {
  return (
    <article
      className={`relative flex flex-col rounded-[16px] border p-6 ${
        p.highlight
          ? "border-transparent bg-dm-bg-elev shadow-[0_0_0_1.5px_var(--color-dm-accent-2),0_30px_60px_-20px_var(--color-dm-accent-2)]"
          : "border-dm-line bg-dm-bg-elev"
      }`}
    >
      {p.highlight && p.highlightLabel && (
        <span
          className="absolute -top-3 left-6 rounded-full border border-dm-line-strong bg-dm-ink px-3 py-[3px] text-[11px] font-semibold tracking-wide text-dm-bg"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {p.highlightLabel}
        </span>
      )}
      <div className="text-[13px] text-dm-ink-3">{p.name}</div>
      <div className="mt-3 flex items-baseline gap-2">
        <div
          className="text-[48px] font-bold leading-none tracking-[-0.03em] text-dm-ink"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          {p.price}
        </div>
        {p.priceSuffix && <div className="text-[13px] text-dm-ink-3">{p.priceSuffix}</div>}
        {p.strikePrice && (
          <div className="text-[13px] text-dm-ink-4 line-through">{p.strikePrice}</div>
        )}
      </div>
      <p className="mt-2 text-[13px] text-dm-ink-2">{p.tagline}</p>
      <ul className="mt-6 flex-1 space-y-3 text-[14px] text-dm-ink-2">
        {p.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-[6px] h-[6px] w-[6px] rounded-full" style={{ background: "var(--color-dm-accent)" }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <a
        href={p.ctaHref}
        className={`mt-8 block rounded-lg px-4 py-[10px] text-center text-[14px] font-medium ${
          p.highlight
            ? "bg-dm-ink text-dm-bg"
            : "border border-dm-line-strong text-dm-ink hover:bg-dm-bg-soft"
        }`}
      >
        {p.ctaLabel}
      </a>
    </article>
  );
}
```

- [ ] **Step 3: `TrustBar.tsx`**

```tsx
import { pricingConfig } from "@/config/pricing";

export function TrustBar() {
  return (
    <section className="px-8">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-6 border-y border-dm-line py-6 text-[12px] text-dm-ink-3 md:grid-cols-4">
        <div>
          <div className="font-[var(--font-dm-mono)] uppercase tracking-wider">Payments</div>
          <div className="mt-1 text-dm-ink-2">Stripe · cards &amp; Apple Pay</div>
        </div>
        <div>
          <div className="font-[var(--font-dm-mono)] uppercase tracking-wider">Refund</div>
          <div className="mt-1 text-dm-ink-2">{pricingConfig.refund.days}-day money-back</div>
        </div>
        <div>
          <div className="font-[var(--font-dm-mono)] uppercase tracking-wider">Users</div>
          <div className="mt-1 text-dm-ink-2">{pricingConfig.trust.users.toLocaleString()}</div>
        </div>
        <div>
          <div className="font-[var(--font-dm-mono)] uppercase tracking-wider">GitHub stars</div>
          <div className="mt-1 text-dm-ink-2">{pricingConfig.trust.githubStars.toLocaleString()}</div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: `ComparisonTable.tsx`**

```tsx
interface Row { label: string; free: boolean; solo: boolean; team: boolean }
interface Group { title: string; rows: Row[] }

const GROUPS: Group[] = [
  {
    title: "Core",
    rows: [
      { label: "Containers, images, volumes, networks", free: true,  solo: true, team: true },
      { label: "Built-in terminal & logs",              free: true,  solo: true, team: true },
      { label: "Compose support",                       free: true,  solo: true, team: true },
      { label: "Command palette (⌘K)",                  free: true,  solo: true, team: true }
    ]
  },
  {
    title: "Remote & Multi-host",
    rows: [
      { label: "Remote SSH hosts",         free: false, solo: true, team: true },
      { label: "Multi-host switching",     free: false, solo: false, team: true },
      { label: "Cloudflared tunnels",      free: false, solo: true, team: true },
      { label: "Kubernetes clusters",      free: true,  solo: true, team: true }
    ]
  },
  {
    title: "License & support",
    rows: [
      { label: "Lifetime updates",         free: false, solo: true, team: true },
      { label: "14-day refund",            free: false, solo: true, team: true },
      { label: "Priority email support",   free: false, solo: false, team: true }
    ]
  }
];

function Mark({ on }: { on: boolean }) {
  return on ? (
    <span style={{ color: "var(--color-dm-accent)" }} aria-label="included">✓</span>
  ) : (
    <span style={{ color: "var(--color-dm-ink-4)" }} aria-label="not included">—</span>
  );
}

export function ComparisonTable() {
  return (
    <section className="px-8 py-12">
      <div className="mx-auto max-w-[1240px]">
        <h2 className="mb-6 font-bold text-[28px] tracking-[-0.02em] text-dm-ink">Compare plans</h2>
        <div className="overflow-hidden rounded-[12px] border border-dm-line">
          <table className="w-full border-collapse text-[14px]">
            <thead className="bg-dm-bg-soft text-[12px] text-dm-ink-3">
              <tr>
                <th className="px-4 py-2 text-left font-normal">Feature</th>
                <th className="px-4 py-2 text-center font-normal">Free</th>
                <th className="px-4 py-2 text-center font-normal">Solo</th>
                <th className="px-4 py-2 text-center font-normal">Team</th>
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((group) => (
                <>
                  <tr key={`${group.title}-h`} className="bg-dm-bg-elev">
                    <td
                      className="px-4 py-2 text-[11px] uppercase tracking-wider text-dm-ink-3"
                      colSpan={4}
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {group.title}
                    </td>
                  </tr>
                  {group.rows.map((r) => (
                    <tr key={r.label} className="border-t border-dm-line">
                      <td className="px-4 py-3 text-dm-ink-2">{r.label}</td>
                      <td className="px-4 py-3 text-center"><Mark on={r.free} /></td>
                      <td className="px-4 py-3 text-center"><Mark on={r.solo} /></td>
                      <td className="px-4 py-3 text-center"><Mark on={r.team} /></td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
```

React will warn about the `<>` fragment inside `<tbody>`. If that's an issue in the build, replace the outer map with one that spreads via `.flatMap` returning arrays of `<tr>` elements with explicit keys.

- [ ] **Step 5: `PricingFaq.tsx`**

Use the existing Radix Accordion already in `apps/landing/src/components/Accordion.tsx`. Pull the 8-question body from `packages/shared/src/locales/en.json:129-157` `pricing.faq.items[]` — do not rewrite in English. Render via `useTranslation` for the page title / labels and the array for questions+answers.

```tsx
"use client";

import { useTranslation } from "@repo/shared/i18n/client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/Accordion";

interface FaqItem { question: string; answer: string; }

export function PricingFaq() {
  const { t } = useTranslation();
  const items = (t("pricing.faq.items", { returnObjects: true }) as unknown) as FaqItem[];
  const title = t("pricing.faq.title");

  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-[820px]">
        <h2 className="font-bold text-[28px] tracking-[-0.02em] text-dm-ink">{title}</h2>
        <Accordion type="single" collapsible className="mt-6">
          {items.map((item, i) => (
            <AccordionItem key={item.question} value={`q-${i}`} className="border-dm-line">
              <AccordionTrigger className="text-[15px] text-dm-ink">{item.question}</AccordionTrigger>
              <AccordionContent className="text-[14px] text-dm-ink-2">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
```

Double-check that `useTranslation` supports `returnObjects: true` — if not, fetch the array server-side and pass as a prop. Adapt if needed.

- [ ] **Step 6: Commit each file as you go**

```bash
git add apps/landing/src/components/pricing/
git commit -m "feat(landing): Pricing components (Hero, PlanCard, TrustBar, ComparisonTable, Faq)"
```

### Task 3.4: Wire Pricing page

**Files:**
- Modify: `apps/landing/src/app/[locale]/(main)/pricing/page.tsx`

- [ ] **Step 1: Rewrite the page**

```tsx
import type { Metadata } from "next";
import { ComparisonTable } from "@/components/pricing/ComparisonTable";
import { Countdown } from "@/components/pricing/Countdown";
import { PlanCard } from "@/components/pricing/PlanCard";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import { PricingHero } from "@/components/pricing/PricingHero";
import { TrustBar } from "@/components/pricing/TrustBar";
import { pricingConfig } from "@/config/pricing";
import { CtaFinal } from "@/components/landing/CtaFinal";

export const metadata: Metadata = {
  title: "Pricing — Dockerman",
  description: "Simple pricing for Dockerman Pro. Early bird 30% off through June 30, 2026."
};

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { plans, earlyBirdDeadlineUtc } = pricingConfig;
  const isActive = new Date(earlyBirdDeadlineUtc).getTime() > Date.now();

  return (
    <main>
      <PricingHero />
      <section className="px-8 pb-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-8 rounded-[14px] border border-dm-line bg-dm-bg-elev p-6 text-center">
            <div className="text-[13px] text-dm-ink-3">Early bird ends in</div>
            <div className="mt-3 flex justify-center">
              <Countdown deadlineUtc={earlyBirdDeadlineUtc} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <PlanCard
              name="Free"
              price="$0"
              tagline="Local Docker or Podman. Forever."
              features={["Containers, images, volumes, networks", "Built-in terminal & logs", "Compose support"]}
              ctaLabel="Download"
              ctaHref={`/${locale}/download`}
            />
            <PlanCard
              name="Team"
              price={`$${isActive ? plans.team.priceEarlyBird : plans.team.priceRegular}`}
              priceSuffix="/ lifetime"
              strikePrice={isActive ? `$${plans.team.priceRegular}` : undefined}
              tagline={`${plans.team.devices} devices · remote hosts · lifetime updates`}
              features={[
                "Everything in Free",
                "Remote SSH hosts",
                "Multi-host switching",
                "Cloudflared tunnels",
                "Lifetime updates"
              ]}
              ctaLabel="Buy Team"
              ctaHref="/checkout/team"
              highlight
              highlightLabel="Most popular"
            />
            <PlanCard
              name="Solo"
              price={`$${isActive ? plans.solo.priceEarlyBird : plans.solo.priceRegular}`}
              priceSuffix="/ lifetime"
              strikePrice={isActive ? `$${plans.solo.priceRegular}` : undefined}
              tagline={`${plans.solo.devices} device · remote hosts · lifetime updates`}
              features={[
                "Everything in Free",
                "Remote SSH host",
                "Cloudflared tunnels",
                "Lifetime updates"
              ]}
              ctaLabel="Buy Solo"
              ctaHref="/checkout/solo"
            />
          </div>
        </div>
      </section>
      <TrustBar />
      <ComparisonTable />
      <PricingFaq />
      <CtaFinal locale={locale} />
    </main>
  );
}
```

- [ ] **Step 2: Dev verify**

`bun dev:landing` → `http://localhost:3000/en/pricing`. Confirm: countdown ticks, Team highlighted with indigo glow, TrustBar shows "14-day money-back", FAQ expands.

- [ ] **Step 3: Build + commit**

```bash
bun build:landing
git add "apps/landing/src/app/[locale]/(main)/pricing/page.tsx"
git commit -m "feat(landing): wire new Pricing page"
```

- [ ] **Step 4: Open PR #3**

```bash
gh pr create --title "redesign(landing): /pricing — plans, countdown, comparison, FAQ" --body "$(cat <<'EOF'
## Summary
- New PricingHero, PlanCard, TrustBar, ComparisonTable, Faq
- Countdown to 2026-06-30T23:59:59Z from config/pricing.ts
- Trust bar shows 14-day refund (pinned to existing locale copy)
- FAQ pulled from packages/shared/src/locales/*.json

## Test plan
- [ ] `/en/pricing` renders in light and dark
- [ ] Countdown ticks each second
- [ ] Team plan has indigo glow
- [ ] FAQ accordion opens/closes
EOF
)"
```

---

## Phase 4 — Download page (PR #4)

### Task 4.1: `config/downloads.ts` with typed Verification

**Files:**
- Create: `apps/landing/src/config/downloads.ts`

**Source:** `/Users/zingerbee/Bee/dockerman/app.dockerman/upload/src/platform.ts` — the **only** canonical source for artifact filenames. Do not reference the current download page for names.

- [ ] **Step 1: Write the config**

```ts
export type Verification =
  | { kind: "apple-notarized" }
  | { kind: "tauri-sig"; sigFilename: string }
  | { kind: "none" };

export interface InstallerAsset {
  filename: string;
  label: string;
  size: string;
  verification: Verification;
}

export interface UpdaterBundle {
  filename: string;
  sigFilename: string;
}

export interface DownloadsLatest {
  version: string;
  releaseDate: string;
  releaseUrl: string;
  installers: {
    macos: InstallerAsset[];
    windows: InstallerAsset[];
    linux: InstallerAsset[];
  };
  updaterBundles: {
    macos: UpdaterBundle;
  };
}

export interface DownloadsHistoryEntry {
  version: string;
  date: string;
  summarySlug: string;
}

const VERSION = "5.1.0";
const RELEASE_DATE = "2026-04-08";

export const downloadsConfig: {
  asOf: string;
  latest: DownloadsLatest;
  history: DownloadsHistoryEntry[];
  assetsBaseUrl: string;
  updaterPublicKeyUrl: string;
  homebrewCommand: string;
} = {
  asOf: "2026-04-23",
  assetsBaseUrl: `https://assets.dockerman.app/${VERSION}`,
  updaterPublicKeyUrl: "https://github.com/ZingerLittleBee/dockerman.app#updater-key",
  homebrewCommand: "brew install --cask zingerlittlebee/tap/dockerman",
  latest: {
    version: VERSION,
    releaseDate: RELEASE_DATE,
    releaseUrl: `https://github.com/mandocker/app.dockerman/releases/tag/v${VERSION}`,
    installers: {
      macos: [
        {
          filename: `Dockerman_${VERSION}_universal.dmg`,
          label: "Universal (Apple Silicon & Intel)",
          size: "134 MB",
          verification: { kind: "apple-notarized" }
        }
      ],
      windows: [
        {
          filename: `Dockerman_${VERSION}_x64-setup.exe`,
          label: "Windows x64 (installer)",
          size: "98 MB",
          verification: {
            kind: "tauri-sig",
            sigFilename: `Dockerman_${VERSION}_x64-setup.exe.sig`
          }
        },
        {
          filename: `Dockerman_${VERSION}_x64_en-US.msi`,
          label: "Windows x64 (MSI, for admins)",
          size: "108 MB",
          verification: {
            kind: "tauri-sig",
            sigFilename: `Dockerman_${VERSION}_x64_en-US.msi.sig`
          }
        }
      ],
      linux: [
        {
          filename: `Dockerman_${VERSION}_amd64.AppImage`,
          label: "AppImage (x86_64)",
          size: "124 MB",
          verification: {
            kind: "tauri-sig",
            sigFilename: `Dockerman_${VERSION}_amd64.AppImage.sig`
          }
        },
        {
          filename: `Dockerman_${VERSION}_amd64.deb`,
          label: "Debian / Ubuntu (x86_64)",
          size: "112 MB",
          verification: { kind: "none" }
        }
      ]
    },
    updaterBundles: {
      macos: {
        filename: "Dockerman.app.tar.gz",
        sigFilename: "Dockerman.app.tar.gz.sig"
      }
    }
  },
  history: [
    { version: "5.1.0", date: "2026-04-08", summarySlug: "release-v5-1-0" },
    { version: "5.0.4", date: "2026-03-18", summarySlug: "release-v5-0-4" },
    { version: "5.0.0", date: "2026-02-20", summarySlug: "release-v5-0-0" },
    { version: "4.8.0", date: "2026-01-10", summarySlug: "release-v4-8-0" },
    { version: "4.6.2", date: "2025-12-02", summarySlug: "release-v4-6-2" },
    { version: "4.5.0", date: "2025-10-15", summarySlug: "release-v4-5-0" },
    { version: "4.2.0", date: "2025-08-22", summarySlug: "release-v4-2-0" },
    { version: "4.0.0", date: "2025-06-30", summarySlug: "release-v4-0-0" }
  ]
};
```

**Before committing:** verify every filename against `app.dockerman/upload/src/platform.ts`. Adjust sizes to match the actual release if known; otherwise leave the approximate values but flag in commit message.

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/config/downloads.ts
git commit -m "feat(landing): downloads config with typed Verification union"
```

### Task 4.2: `HomebrewBlock` with click-to-copy

**Files:**
- Create: `apps/landing/src/components/download/HomebrewBlock.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useState } from "react";
import { RiCheckLine, RiFileCopy2Line } from "@remixicon/react";
import { downloadsConfig } from "@/config/downloads";

export function HomebrewBlock() {
  const [copied, setCopied] = useState(false);
  const cmd = downloadsConfig.homebrewCommand;

  const onCopy = async () => {
    await navigator.clipboard.writeText(cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="px-8 py-6">
      <div className="mx-auto max-w-[1240px]">
        <div className="rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[12px] text-dm-ink-3" style={{ fontFamily: "var(--font-dm-mono)" }}>
              Homebrew (recommended)
            </div>
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex items-center gap-1 rounded-md border border-dm-line px-2 py-1 text-[11px] text-dm-ink-2 hover:bg-dm-bg-soft"
            >
              {copied ? <RiCheckLine className="h-3 w-3" /> : <RiFileCopy2Line className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <code
            className="block rounded-md bg-dm-bg-soft p-3 text-[14px] text-dm-ink"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            $ {cmd}
          </code>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/components/download/HomebrewBlock.tsx
git commit -m "feat(landing): HomebrewBlock with copy-to-clipboard"
```

### Task 4.3: `PlatformCard` with Verification-driven footer

**Files:**
- Create: `apps/landing/src/components/download/PlatformCard.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { downloadsConfig, type InstallerAsset, type Verification } from "@/config/downloads";

function renderVerification(v: Verification): string | null {
  if (v.kind === "apple-notarized") return "Apple-signed & notarized";
  if (v.kind === "tauri-sig") return `Tauri updater signature: ${v.sigFilename}`;
  return null;
}

export function PlatformCard({
  title,
  minSpec,
  assets
}: {
  title: string;
  minSpec: string;
  assets: InstallerAsset[];
}) {
  return (
    <article className="flex flex-col rounded-[14px] border border-dm-line bg-dm-bg-elev p-5">
      <div className="text-[16px] font-semibold text-dm-ink">{title}</div>
      <div className="mt-1 text-[12px] text-dm-ink-3">{minSpec}</div>
      <ul className="mt-5 flex-1 space-y-2">
        {assets.map((a) => (
          <li key={a.filename}>
            <a
              href={`${downloadsConfig.assetsBaseUrl}/${a.filename}`}
              className="flex items-center justify-between rounded-md border border-dm-line px-3 py-[10px] text-[13px] text-dm-ink hover:bg-dm-bg-soft"
            >
              <span>{a.label}</span>
              <span className="text-dm-ink-3" style={{ fontFamily: "var(--font-dm-mono)" }}>
                {a.size}
              </span>
            </a>
            {(() => {
              const line = renderVerification(a.verification);
              return line ? (
                <div className="mt-1 text-[11px] text-dm-ink-4" style={{ fontFamily: "var(--font-dm-mono)" }}>
                  {line}
                </div>
              ) : null;
            })()}
          </li>
        ))}
      </ul>
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/landing/src/components/download/PlatformCard.tsx
git commit -m "feat(landing): PlatformCard renders Verification discriminator"
```

### Task 4.4: `DownloadHero`, `IntegrityBar`, `ReleasesTable`

**Files:**
- Create: `apps/landing/src/components/download/DownloadHero.tsx`
- Create: `apps/landing/src/components/download/IntegrityBar.tsx`
- Create: `apps/landing/src/components/download/ReleasesTable.tsx`

- [ ] **Step 1: `DownloadHero.tsx`**

```tsx
import { downloadsConfig } from "@/config/downloads";
import { Pill } from "@/components/ui-dm/Pill";

export function DownloadHero() {
  const { latest } = downloadsConfig;
  return (
    <section className="px-8 pb-6 pt-16">
      <div className="mx-auto max-w-[1240px]">
        <Pill>v{latest.version} · latest stable</Pill>
        <h1 className="mt-5 max-w-[18ch] font-bold text-[clamp(40px,6vw,72px)] leading-[0.95] tracking-[-0.04em] text-dm-ink">
          Download{" "}
          <span
            className="italic"
            style={{ fontFamily: "var(--font-dm-display)", color: "var(--color-dm-accent)" }}
          >
            for every platform.
          </span>
        </h1>
        <div className="mt-8 grid max-w-[820px] grid-cols-4 gap-6 border-t border-dm-line pt-6 text-[12px]">
          <Meta label="Version" value={`v${latest.version}`} />
          <Meta label="Released" value={latest.releaseDate} />
          <Meta label="Install size" value="~120 MB" />
          <Meta label="Platforms" value="macOS · Win · Linux" />
        </div>
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-[var(--font-dm-mono)] uppercase tracking-wider text-dm-ink-4">{label}</div>
      <div className="mt-1 text-dm-ink-2">{value}</div>
    </div>
  );
}
```

- [ ] **Step 2: `IntegrityBar.tsx`**

```tsx
import { downloadsConfig } from "@/config/downloads";

export function IntegrityBar() {
  const { latest, updaterPublicKeyUrl } = downloadsConfig;
  return (
    <section className="px-8 py-6">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 rounded-[12px] border border-dm-line bg-dm-bg-elev px-5 py-3 text-[12px]">
        <span className="text-dm-ink-3">Verify your download</span>
        <div className="flex gap-6">
          <a href={latest.releaseUrl} className="text-dm-ink hover:underline">
            GitHub release &amp; assets
          </a>
          <a href={updaterPublicKeyUrl} className="text-dm-ink hover:underline">
            Tauri updater public key
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: `ReleasesTable.tsx`**

```tsx
import Link from "next/link";
import { downloadsConfig } from "@/config/downloads";

export function ReleasesTable({ locale }: { locale: string }) {
  return (
    <section className="px-8 py-8">
      <div className="mx-auto max-w-[1240px]">
        <h2 className="mb-4 font-semibold text-[20px] text-dm-ink">Previous releases</h2>
        <div className="overflow-hidden rounded-[12px] border border-dm-line">
          <table className="w-full border-collapse text-[13px]">
            <thead className="bg-dm-bg-soft text-dm-ink-3">
              <tr>
                <th className="px-4 py-2 text-left font-normal">Version</th>
                <th className="px-4 py-2 text-left font-normal">Date</th>
                <th className="px-4 py-2 text-left font-normal">Changelog</th>
              </tr>
            </thead>
            <tbody>
              {downloadsConfig.history.map((h, i) => (
                <tr key={h.version} className={i === 0 ? "bg-dm-bg-elev" : ""}>
                  <td className="px-4 py-3 text-dm-ink" style={{ fontFamily: "var(--font-dm-mono)" }}>
                    v{h.version}
                  </td>
                  <td className="px-4 py-3 text-dm-ink-2">{h.date}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/${locale}/changelog#${h.summarySlug}`}
                      className="text-dm-ink hover:underline"
                    >
                      View notes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add apps/landing/src/components/download/
git commit -m "feat(landing): DownloadHero, IntegrityBar, ReleasesTable"
```

### Task 4.5: Wire Download page

**Files:**
- Modify: `apps/landing/src/app/[locale]/(main)/download/page.tsx`

- [ ] **Step 1: Rewrite the page**

```tsx
import type { Metadata } from "next";
import { DownloadHero } from "@/components/download/DownloadHero";
import { HomebrewBlock } from "@/components/download/HomebrewBlock";
import { IntegrityBar } from "@/components/download/IntegrityBar";
import { PlatformCard } from "@/components/download/PlatformCard";
import { ReleasesTable } from "@/components/download/ReleasesTable";
import { CtaFinal } from "@/components/landing/CtaFinal";
import { downloadsConfig } from "@/config/downloads";

export const metadata: Metadata = {
  title: "Download — Dockerman",
  description: "Download Dockerman for macOS, Windows, and Linux."
};

export default async function DownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { installers } = downloadsConfig.latest;

  return (
    <main>
      <DownloadHero />
      <HomebrewBlock />
      <section className="px-8 py-4">
        <div className="mx-auto grid max-w-[1240px] gap-4 md:grid-cols-3">
          <PlatformCard title="macOS" minSpec="macOS 11 Big Sur or later" assets={installers.macos} />
          <PlatformCard title="Windows" minSpec="Windows 10 / 11 x64" assets={installers.windows} />
          <PlatformCard title="Linux" minSpec="glibc 2.31+ · x86_64" assets={installers.linux} />
        </div>
      </section>
      <IntegrityBar />
      <ReleasesTable locale={locale} />
      <CtaFinal locale={locale} />
    </main>
  );
}
```

- [ ] **Step 2: Dev verify**

`bun dev:landing` → `http://localhost:3000/en/download`. Confirm:
- Homebrew block copies `brew install --cask zingerlittlebee/tap/dockerman`
- macOS card shows "Apple-signed & notarized" under the universal DMG
- Windows cards show "Tauri updater signature: ..." under each installer
- Linux AppImage shows signature line; `.deb` row shows **nothing** below (no verification line for `kind: "none"`)
- IntegrityBar and ReleasesTable render

- [ ] **Step 3: Build + commit**

```bash
bun build:landing
git add "apps/landing/src/app/[locale]/(main)/download/page.tsx"
git commit -m "feat(landing): wire new Download page"
```

- [ ] **Step 4: Open PR #4**

```bash
gh pr create --title "redesign(landing): /download — Homebrew, platform cards, integrity, releases" --body "$(cat <<'EOF'
## Summary
- config/downloads.ts is the single canonical source; matches platform.ts
- macOS: one universal DMG with Apple-notarized footer
- Windows: .msi + .exe, each with Tauri .sig
- Linux: .AppImage (with .sig) + .deb (no .sig — footer correctly omitted)
- IntegrityBar links to GitHub release + Tauri public key
- ReleasesTable shows last 8 versions

## Test plan
- [ ] `/en/download` renders all three platform cards
- [ ] .deb row shows no verification footer
- [ ] Homebrew copy-to-clipboard works
EOF
)"
```

---

## Phase 5 — Changelog (PR #5)

### Task 5.1: Extend `lib/changelog.ts` parser for `<Callout>` and `<Figure>`

**Files:**
- Modify: `apps/landing/src/lib/changelog.ts`

- [ ] **Step 1: Read current parser**

```bash
cat apps/landing/src/lib/changelog.ts
```

- [ ] **Step 2: Extend types and parsing**

Add to the existing `lib/changelog.ts`:

```ts
export type ChangelogCalloutType = "note" | "tip" | "warn";

export interface ChangelogCallout {
  kind: "callout";
  type: ChangelogCalloutType;
  body: string;
}

export interface ChangelogFigure {
  kind: "figure";
  src: string;
  caption: string;
}

export type ChangelogBlock = ChangelogCallout | ChangelogFigure;
```

Add to `ChangelogEntryData`:

```ts
export interface ChangelogEntryData {
  // ... existing fields
  blocks: ChangelogBlock[];
}
```

Add regex patterns at module level near the existing ones:

```ts
const calloutPattern =
  /<Callout\s+type="(note|tip|warn)">([\s\S]*?)<\/Callout>/g;
const figurePattern =
  /<Figure\s+src="([^"]+)"\s+caption="([^"]+)"\s*\/>/g;
```

In `parseEntry`, before splitting into lines, collect blocks in document order:

```ts
function parseEntry(version: string, date: string, body: string): ChangelogEntryData {
  const blocks: ChangelogBlock[] = [];

  // Callouts and Figures are collected in source order so the renderer
  // can splice them between sections. They are also stripped from the
  // line-based section parsing below.
  const withoutBlocks = body
    .replace(calloutPattern, (_, type, inner) => {
      blocks.push({ kind: "callout", type: type as ChangelogCalloutType, body: inner.trim() });
      return "";
    })
    .replace(figurePattern, (_, src, caption) => {
      blocks.push({ kind: "figure", src, caption });
      return "";
    });

  // ... existing logic using withoutBlocks instead of body

  return {
    // ... existing fields
    blocks
  };
}
```

Update any existing test fixtures or types that consume `ChangelogEntryData` to handle the new `blocks` field. If TS complains, add `blocks: []` defaults.

- [ ] **Step 3: Add parser unit tests**

Create `apps/landing/src/lib/changelog.test.ts`:

```ts
import { describe, expect, it } from "vitest";
// @ts-expect-error — parseEntry is not currently exported; export it for testing
import { parseEntry } from "./changelog";

describe("changelog parser", () => {
  it("captures a single Callout block", () => {
    const body = `## Title\n\nlede\n\n<Callout type="tip">Use brew.</Callout>\n\n### Features\n\n- x`;
    const entry = parseEntry("v1.0.0", "2026-04-23", body);
    expect(entry.blocks).toHaveLength(1);
    expect(entry.blocks[0]).toEqual({ kind: "callout", type: "tip", body: "Use brew." });
  });

  it("captures a Figure block with src and caption", () => {
    const body = `## Title\n\n<Figure src="/a.png" caption="A" />`;
    const entry = parseEntry("v1.0.0", "2026-04-23", body);
    expect(entry.blocks).toHaveLength(1);
    expect(entry.blocks[0]).toEqual({ kind: "figure", src: "/a.png", caption: "A" });
  });

  it("returns empty blocks array when no new tags are present", () => {
    const body = `## Title\n\nlede\n\n### Features\n\n- x`;
    const entry = parseEntry("v1.0.0", "2026-04-23", body);
    expect(entry.blocks).toEqual([]);
  });
});
```

If `parseEntry` is not exported, export it now. That's a minimal non-breaking change.

- [ ] **Step 4: Run tests**

```bash
cd apps/landing && bunx vitest run src/lib/changelog.test.ts
```

Expected: all three pass.

- [ ] **Step 5: Smoke test the full parser against existing locale MDX**

```bash
cd apps/landing && bun -e "const { getChangelogEntries } = require('./src/lib/changelog.ts'); getChangelogEntries('en').then(r => console.log(r.length, r[0]?.version))"
```

Expected: number of entries > 0, first entry version prints. If this fails, the extension broke existing parsing — fix before moving on.

- [ ] **Step 6: Commit**

```bash
git add apps/landing/src/lib/changelog.ts apps/landing/src/lib/changelog.test.ts
git commit -m "feat(landing): extend changelog parser for Callout and Figure blocks"
```

### Task 5.2: `ChangelogCallout` and `ChangelogFigure` components

**Files:**
- Create: `apps/landing/src/components/changelog/ChangelogCallout.tsx`
- Create: `apps/landing/src/components/changelog/ChangelogFigure.tsx`

- [ ] **Step 1: `ChangelogCallout.tsx`**

```tsx
import type { ChangelogCalloutType } from "@/lib/changelog";

const STYLES: Record<ChangelogCalloutType, { border: string; bg: string; label: string }> = {
  note: { border: "border-dm-line", bg: "bg-dm-bg-soft", label: "Note" },
  tip: { border: "border-dm-accent/40", bg: "bg-dm-accent/5", label: "Tip" },
  warn: { border: "border-dm-warn/40", bg: "bg-dm-warn/10", label: "Warning" }
};

export function ChangelogCallout({ type, body }: { type: ChangelogCalloutType; body: string }) {
  const s = STYLES[type];
  return (
    <div className={`my-4 rounded-[10px] border p-3 text-[13px] ${s.border} ${s.bg}`}>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-dm-ink-3">
        {s.label}
      </div>
      <div className="text-dm-ink-2">{body}</div>
    </div>
  );
}
```

Tailwind will generate `border-dm-accent/40`, `bg-dm-accent/5`, `border-dm-warn/40`, `bg-dm-warn/10` from the `--color-dm-accent` / `--color-dm-warn` theme tokens.

- [ ] **Step 2: `ChangelogFigure.tsx`**

```tsx
import Image from "next/image";

export function ChangelogFigure({ src, caption }: { src: string; caption: string }) {
  return (
    <figure className="my-6 overflow-hidden rounded-[10px] border border-dm-line">
      <Image
        src={src}
        alt={caption}
        width={1200}
        height={720}
        className="h-auto w-full"
      />
      <figcaption className="border-t border-dm-line bg-dm-bg-soft px-3 py-2 text-[12px] text-dm-ink-3">
        {caption}
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/landing/src/components/changelog/ChangelogCallout.tsx apps/landing/src/components/changelog/ChangelogFigure.tsx
git commit -m "feat(landing): ChangelogCallout and ChangelogFigure renderers"
```

### Task 5.3: Restyle `ChangelogTimeline`

**Files:**
- Modify: `apps/landing/src/components/changelog/ChangelogTimeline.tsx`

- [ ] **Step 1: Read current file**

```bash
cat apps/landing/src/components/changelog/ChangelogTimeline.tsx
```

- [ ] **Step 2: Rewrite to render new styling**

```tsx
import type { Locale } from "@repo/shared/i18n";
import type { ChangelogBlock, ChangelogEntryData, ChangelogSection } from "@/lib/changelog";
import { ChangelogCallout } from "./ChangelogCallout";
import { ChangelogFigure } from "./ChangelogFigure";

export default function ChangelogTimeline({
  entries,
  locale: _locale
}: {
  entries: ChangelogEntryData[];
  locale: Locale;
}) {
  return (
    <div className="space-y-16">
      {entries.map((entry, i) => (
        <ReleaseArticle key={entry.id} entry={entry} isLatest={i === 0} />
      ))}
    </div>
  );
}

function ReleaseArticle({ entry, isLatest }: { entry: ChangelogEntryData; isLatest: boolean }) {
  return (
    <article id={entry.id} className="scroll-mt-24">
      <header className="mb-4 flex flex-wrap items-center gap-3">
        <span
          className="rounded-full border border-dm-line-strong bg-dm-bg-elev px-3 py-[3px] text-[12px] font-semibold text-dm-ink"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          v{entry.version}
        </span>
        <span className="text-[13px] text-dm-ink-3">{entry.date}</span>
        {isLatest && (
          <span
            className="rounded-full bg-dm-ink px-2 py-[2px] text-[10px] font-semibold tracking-wide text-dm-bg"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            LATEST
          </span>
        )}
      </header>
      <h2 className="mb-3 font-bold text-[32px] leading-[1.05] tracking-[-0.02em] text-dm-ink">
        {entry.title}
      </h2>
      {entry.summary && (
        <p className="mb-6 max-w-[70ch] text-[16px] text-dm-ink-2">{entry.summary}</p>
      )}
      {/* Blocks (Callouts + Figures) render first, in source order. */}
      <Blocks blocks={entry.blocks} />
      {/* Sections render as headings + bullet lists. */}
      <div className="md-body space-y-8">
        {entry.sections.map((s) => (
          <SectionBlock key={s.id} section={s} />
        ))}
      </div>
    </article>
  );
}

function Blocks({ blocks }: { blocks: ChangelogBlock[] }) {
  if (blocks.length === 0) return null;
  return (
    <div className="mb-6">
      {blocks.map((b, i) =>
        b.kind === "callout" ? (
          <ChangelogCallout key={i} type={b.type} body={b.body} />
        ) : (
          <ChangelogFigure key={i} src={b.src} caption={b.caption} />
        )
      )}
    </div>
  );
}

function SectionBlock({ section }: { section: ChangelogSection }) {
  return (
    <section>
      <h3 className="mb-3 font-semibold text-[18px] text-dm-ink">{section.title}</h3>
      <ul className="space-y-2">
        {section.items.map((item, i) => (
          <li key={i} className="relative pl-5 text-[14px] text-dm-ink-2">
            <span
              aria-hidden
              className="absolute left-0 top-[8px] h-[6px] w-[6px] rounded-full"
              style={{ background: "var(--color-dm-accent)" }}
            />
            {item.icon && <span className="mr-1">{item.icon}</span>}
            {item.label && <strong className="text-dm-ink">{item.label}: </strong>}
            <span>{item.description ?? (item.label ? "" : item.content)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

If the existing `ChangelogTimeline` has additional props (e.g. a subscribe block), remove their usage — the redesigned page does not render a subscribe form. If any callers other than `ChangelogPageContent` import from this file, check that they still compile after the rewrite.

**Source reference:** `docs/superpowers/assets/claude-design/Changelog.html` — for the `.release`, `.release-meta`, `.md-body`, `.lede` visual treatments that the class names above mirror.

- [ ] **Step 3: Commit**

```bash
git add apps/landing/src/components/changelog/ChangelogTimeline.tsx
git commit -m "feat(landing): restyle ChangelogTimeline with new meta header and md-body"
```

### Task 5.4: `ChangelogSearch` and `ChangelogToc` (client)

**Files:**
- Create: `apps/landing/src/components/changelog/ChangelogSearch.tsx`
- Create: `apps/landing/src/components/changelog/ChangelogToc.tsx`

- [ ] **Step 1: `ChangelogSearch.tsx`**

```tsx
"use client";

import { useEffect } from "react";

export function ChangelogSearch({
  onQuery
}: {
  onQuery: (query: string) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        (document.getElementById("changelog-search") as HTMLInputElement | null)?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative">
      <input
        id="changelog-search"
        type="search"
        placeholder="Search releases… (⌘K)"
        onChange={(e) => onQuery(e.currentTarget.value.toLowerCase())}
        className="w-full rounded-md border border-dm-line bg-dm-bg-elev px-3 py-2 text-[13px] text-dm-ink placeholder:text-dm-ink-4"
      />
    </div>
  );
}
```

- [ ] **Step 2: `ChangelogToc.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangelogEntryData } from "@/lib/changelog";

export function ChangelogToc({ entries }: { entries: ChangelogEntryData[] }) {
  const [active, setActive] = useState(entries[0]?.id ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (observations) => {
        const visible = observations.filter((o) => o.isIntersecting);
        if (visible.length > 0) {
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    for (const e of entries) {
      const el = document.getElementById(e.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, [entries]);

  return (
    <nav className="sticky top-24 space-y-1 text-[13px]">
      {entries.map((e) => (
        <Link
          key={e.id}
          href={`#${e.id}`}
          className={`block rounded-md px-2 py-[6px] ${
            active === e.id ? "bg-dm-bg-soft text-dm-ink" : "text-dm-ink-3 hover:bg-dm-bg-soft"
          }`}
        >
          <span style={{ fontFamily: "var(--font-dm-mono)" }}>v{e.version}</span>
          <span className="ml-2 text-dm-ink-4">{e.date}</span>
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/landing/src/components/changelog/ChangelogSearch.tsx apps/landing/src/components/changelog/ChangelogToc.tsx
git commit -m "feat(landing): ChangelogSearch and ChangelogToc client components"
```

### Task 5.5: Rewrite `ChangelogPageContent`

**Files:**
- Modify: `apps/landing/src/components/changelog/ChangelogPageContent.tsx`

- [ ] **Step 1: Rewrite**

```tsx
"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@repo/shared/i18n";
import type { ChangelogEntryData } from "@/lib/changelog";
import { ChangelogSearch } from "./ChangelogSearch";
import { ChangelogTimeline } from "./ChangelogTimeline";
import { ChangelogToc } from "./ChangelogToc";

interface Props {
  copy: { badge: string; title: string; description: string };
  entries: ChangelogEntryData[];
  locale: Locale;
}

export default function ChangelogPageContent({ copy, entries, locale }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return entries;
    return entries.filter((e) => {
      const hay = [
        e.version,
        e.title,
        e.summary,
        ...e.sections.flatMap((s) => s.items.map((i) => i.content))
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }, [entries, query]);

  return (
    <div className="mx-auto max-w-[1240px] px-8 py-16">
      <header className="mb-10">
        <div className="text-[11px] uppercase tracking-wider text-dm-ink-4" style={{ fontFamily: "var(--font-dm-mono)" }}>
          {copy.badge}
        </div>
        <h1 className="mt-2 font-bold text-[48px] leading-none tracking-[-0.03em] text-dm-ink">{copy.title}</h1>
        <p className="mt-4 max-w-[60ch] text-[15px] text-dm-ink-2">{copy.description}</p>
      </header>

      <div className="grid gap-10 md:grid-cols-[220px_1fr]">
        <div>
          <ChangelogSearch onQuery={setQuery} />
          <div className="mt-4">
            <ChangelogToc entries={filtered} />
          </div>
        </div>
        <ChangelogTimeline entries={filtered} locale={locale} />
      </div>
    </div>
  );
}
```

Note: `ChangelogTimeline` needs a `locale` prop if it currently doesn't take one. If the existing implementation ignores locale, leave it — just match whatever signature the restyled component expects.

- [ ] **Step 2: Update the route**

Modify `apps/landing/src/app/[locale]/(main)/changelog/page.tsx`: strip the `subscribe` copy blob it builds today, since the redesign does not include a subscribe form. Keep the rest of the data flow.

```bash
cat "apps/landing/src/app/[locale]/(main)/changelog/page.tsx"
```

Edit to pass only `copy = { badge, title, description }`.

- [ ] **Step 3: Dev verify**

`bun dev:landing` → `http://localhost:3000/en/changelog`. Confirm:
- Sticky TOC on left
- Search input works, typing filters entries
- ⌘K focuses search
- Scrolling highlights active TOC item
- Existing v5.1.0 / v5.0.0 entries render with new meta header + lede

Test the other three locales: `/zh/changelog`, `/ja/changelog`, `/es/changelog`. Expected: 200 response, entries render.

- [ ] **Step 4: Commit**

```bash
git add apps/landing/src/components/changelog/ChangelogPageContent.tsx "apps/landing/src/app/[locale]/(main)/changelog/page.tsx"
git commit -m "feat(landing): new Changelog layout with TOC + search + scrollspy"
```

### Task 5.6: Phase 5 verification and PR

- [ ] **Step 1: Full check**

```bash
bun check
bun build:landing
```

- [ ] **Step 2: Test all locales manually**

Open each in browser:
- `http://localhost:3000/en/changelog`
- `http://localhost:3000/zh/changelog`
- `http://localhost:3000/ja/changelog`
- `http://localhost:3000/es/changelog`

Confirm each renders entries. No 500 errors from the extended parser.

- [ ] **Step 3: Smoke test docs (no regression)**

`http://localhost:3000/en/docs/getting-started` — Fumadocs `<Callout>` and `<Tabs>` must still render correctly.

- [ ] **Step 4: Open PR #5**

```bash
gh pr create --title "redesign(landing): /changelog — TOC, search, restyled entries, MDX parser extension" --body "$(cat <<'EOF'
## Summary
- lib/changelog.ts recognizes <Callout type=…> and <Figure src caption=… />
- ChangelogCallout and ChangelogFigure are local renderers — never registered on the global MDX map, so no collision with the Fumadocs <Callout> used in docs
- New layout: sticky TOC + keyword search + ⌘K focus + scrollspy
- Existing 4 locales of page.mdx unchanged

## Test plan
- [ ] All 4 locale routes render
- [ ] Search filters entries
- [ ] ⌘K focuses search
- [ ] Docs <Callout> still works
EOF
)"
```

---

## Phase 6 — Cleanup (PR #6)

Delete deprecated components. TypeScript will flag any leftover imports.

### Task 6.1: Delete deprecated `ui/*` components

**Files:**
- Delete: listed below

- [ ] **Step 1: Remove files**

```bash
cd apps/landing/src/components/ui
rm Hero.tsx HeroImage.tsx Features.tsx Benefits.tsx LogoCloud.tsx Logos.tsx \
   PricingCard.tsx Faqs.tsx FaqsLazy.tsx \
   CtaSection.tsx CtaSectionLazy.tsx Cta.tsx \
   Navbar.tsx Footer.tsx \
   Kubernetes.tsx KubernetesLazy.tsx Global.tsx GlobalLazy.tsx \
   SnapshotPlaygournd.tsx SnapshotPlaygroundLazy.tsx SnapshotPlaygroundScroll.tsx \
   ArrowAnimated.tsx ThemedImage.tsx Background-beams-with-collision.tsx 2>/dev/null
cd -
```

Some of these filenames may differ slightly — run `ls apps/landing/src/components/ui/` first and confirm you're deleting only items that are no longer imported. Keep anything still referenced by docs / Fumadocs pages.

- [ ] **Step 2: Run build**

```bash
bun build:landing
```

If it errors on missing imports, open the failing file and either remove the stale import (if the feature is gone) or reinstate the file (if something still uses it). Iterate until build passes.

- [ ] **Step 3: Rename `ui-dm/` → `ui/`**

```bash
mv apps/landing/src/components/ui-dm apps/landing/src/components/ui
```

Then do a global find-and-replace: change `@/components/ui-dm/` to `@/components/ui/` across all `.tsx` / `.ts` files in `apps/landing/src/`.

```bash
bunx grep -rl "@/components/ui-dm" apps/landing/src | xargs sed -i '' 's|@/components/ui-dm/|@/components/ui/|g'
```

(On Linux, drop the `''` after `-i`.)

- [ ] **Step 4: Build + check**

```bash
bun check
bun build:landing
```

Both must exit 0.

- [ ] **Step 5: Commit**

```bash
git add -A apps/landing/src/components/
git commit -m "chore(landing): delete deprecated ui components; promote ui-dm to ui"
```

### Task 6.2: Delete old component tests that target removed files

- [ ] **Step 1: Inventory and delete**

```bash
ls apps/landing/src/components/*.test.tsx apps/landing/src/components/**/*.test.tsx 2>/dev/null
```

Delete tests whose target file no longer exists (e.g. `Faqs.test.tsx` if `Faqs.tsx` was removed). Keep `Accordion.test.tsx`, `ChangelogPageContent.test.tsx`, `ChangelogTimeline.test.tsx` after checking they still pass against the restyled components.

```bash
cd apps/landing && bunx vitest run
```

Fix or delete failing tests. Commit:

```bash
git add -A apps/landing
git commit -m "chore(landing): drop tests for removed components"
```

### Task 6.3: Phase 6 PR

- [ ] **Step 1: Final verification**

```bash
bun check
bun build:landing
```

- [ ] **Step 2: Docs smoke**

`bun dev:landing` → `http://localhost:3000/en/docs/getting-started`. Confirm Fumadocs chrome renders. Stop dev.

- [ ] **Step 3: Open PR #6**

```bash
gh pr create --title "redesign(landing): cleanup — delete deprecated components, promote ui-dm" --body "$(cat <<'EOF'
## Summary
- Remove deprecated components under src/components/ui/* that are now replaced
- Rename src/components/ui-dm/ → src/components/ui/
- Remove stale tests

## Test plan
- [ ] `bun check` and `bun build:landing` pass
- [ ] All four redesigned routes still render
- [ ] Docs (Fumadocs) unaffected
EOF
)"
```

---

## Self-review checklist (run after plan complete, before execution)

- [ ] Every task uses exact file paths.
- [ ] Every code block compiles when pasted verbatim (no pseudo-code, no placeholders).
- [ ] Every visual-fidelity task names the source file and CSS selector to match.
- [ ] Countdown deadline is a real ISO UTC string (`2026-06-30T23:59:59Z`).
- [ ] Downloads config mirrors `app.dockerman/upload/src/platform.ts` exactly.
- [ ] `mdx-components.tsx` is never modified.
- [ ] Shell components mount in `(main)/layout.tsx` only.
- [ ] Every client component has `"use client"`.
- [ ] `prefers-reduced-motion` honored in every animated component.
- [ ] After every phase (= PR), `bun check` and `bun build:landing` both pass.
