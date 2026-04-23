# Dockerman Design Language

Living reference for the `dm-*` design system used by the marketing site
(`apps/landing`). Tokens are defined in
[`apps/landing/src/app/globals.css`](apps/landing/src/app/globals.css)
under `@theme`, exposed as CSS custom properties and Tailwind utilities.

> **Rule of thumb:** if you are reaching for a raw hex, `blue-500`,
> `gray-700`, or a generic Tailwind semantic color, stop. Either the token
> exists, or we need to discuss adding it.

---

## 1. Tokens

### 1.1 Surfaces

| Token             | Light     | Dark      | Use                                                        |
| ----------------- | --------- | --------- | ---------------------------------------------------------- |
| `dm-bg`           | `#fafaf9` | `#070808` | Page background                                            |
| `dm-bg-elev`      | `#ffffff` | `#0e0f10` | Elevated surfaces: cards, dialog, viewer chrome            |
| `dm-bg-soft`      | `#f4f4f2` | `#141516` | Recessed surfaces: chips, code/keycap, muted ground        |
| `dm-line`         | `rgb(0 0 0 / 0.08)` | `rgb(255 255 255 / 0.08)` | Default hairlines                     |
| `dm-line-strong`  | `rgb(0 0 0 / 0.14)` | `rgb(255 255 255 / 0.14)` | Emphasised borders, active edges      |
| `dm-grid`         | `rgb(0 0 0 / 0.05)` | `rgb(255 255 255 / 0.04)` | Decorative grid overlays               |

**Layering model:** page `dm-bg` → cards/panels `dm-bg-elev` → inlay chips /
keycaps / code `dm-bg-soft`. Never stack `dm-bg-elev` on `dm-bg-elev` —
step down to `dm-bg-soft` or add a `dm-line` border to separate.

### 1.2 Ink (text)

| Token        | Light     | Dark      | Use                                              |
| ------------ | --------- | --------- | ------------------------------------------------ |
| `dm-ink`     | `#0a0a0a` | `#f5f5f4` | Primary type, headlines, strong emphasis         |
| `dm-ink-2`   | `#3a3a3a` | `#c9c9c7` | Secondary body, supporting heading               |
| `dm-ink-3`   | `#6a6a6a` | `#8c8c8a` | Muted body, captions, long-form prose, mono meta |
| `dm-ink-4`   | `#9a9a98` | `#5c5c5a` | Placeholder, separators, `//` prefix, decoration |

Ink reads as a strict hierarchy. If you're using `dm-ink-4` for anything
a user needs to read, you're using it wrong.

### 1.3 Accents

| Token             | Value      | Role                                                       |
| ----------------- | ---------- | ---------------------------------------------------------- |
| `dm-accent`       | `#14b8a6`  | Primary accent. Teal. `$` prompt, section eyebrows, links. |
| `dm-accent-2`     | `#6366f1`  | Secondary accent. Indigo. Focus rings, `NEW` badges.       |
| `dm-accent-warm`  | `#f97316`  | Warm accent. Orange. Sparingly, for emphasis contrast.     |

**Pair them, don't collide.** The canonical gradient is
`linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))`
— teal → indigo, top-left to bottom-right — used on CTAs, brand marks,
and italic display accents.

### 1.4 Status

| Token     | Value     | Use                              |
| --------- | --------- | -------------------------------- |
| `dm-ok`   | `#10b981` | Running, healthy, success dot    |
| `dm-warn` | `#f59e0b` | Pending, degraded                |
| `dm-err`  | `#ef4444` | Failed, destructive confirmation |

Status tokens carry meaning — don't use `dm-ok` for decoration just
because you like green.

### 1.5 Typography

| Token             | Stack                                                 |
| ----------------- | ----------------------------------------------------- |
| sans (default)    | Inter → system-ui → sans-serif                        |
| sans-zh           | PingFang SC → Hiragino Sans GB → Microsoft YaHei → WQY Micro Hei |
| `--font-dm-mono`  | Geist Mono → JetBrains Mono → ui-monospace            |
| `--font-dm-display` | Instrument Serif (italic only)                      |

**Display italic is the accent voice.** The site has two kinds of
headline emphasis:

1. **Gradient word** — `bg-clip-text` with the 135° accent gradient,
   display italic. Used once per heading for the key verb/noun
   (`Hero.tsx:87-90`, `CtaFinal.tsx:27-35`).
2. **Quiet italic** — `dm-display` italic at `dm-ink-2`, no gradient.
   Used for reflective subclauses (`FeaturesGrid.tsx:33-36`).

Never use display italic for more than one phrase per heading; it loses
its weight.

### 1.6 Radii

| Token           | Value    | Use                              |
| --------------- | -------- | -------------------------------- |
| `--radius-dm`   | `12px`   | Cards, dialogs, large buttons    |
| `--radius-dm-sm`| `8px`    | Chips, keycaps, small buttons    |

Explicit pixel radii (`rounded-[10px]`, `rounded-[14px]`, `rounded-[16px]`)
are common and acceptable at component level — the tokens are for
cross-component consistency, not a straitjacket. `rounded-[0px]` (hard
corner) is not ours — see §3.2.

### 1.7 Motion

Keyframes live in `globals.css` `@theme`. The important ones:

- `dm-pulse` — 2.2s `ease-in-out infinite`, opacity 1 → 0.5 → 1. Live dot,
  streaming indicator.
- `slide-down-fade` / `slide-up-fade` / `fade-in` — 150–200ms `ease-out`,
  for menu / tooltip / toast entry.

**Reduced motion is honored.** `@media (prefers-reduced-motion: reduce)`
disables `.dm-animated` transitions/animations. If you author something
animated that isn't critical to comprehension, gate it via `.dm-animated`.

---

## 2. Composition patterns

### 2.1 The CTA button

```tsx
<Link
  className="inline-flex items-center gap-[10px] rounded-[10px] px-5 py-3 font-semibold text-[14px] text-white no-underline transition-all hover:-translate-y-px"
  style={{
    background: 'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))',
    boxShadow: '0 10px 30px -10px color-mix(in srgb, var(--color-dm-accent-2) 60%, transparent)',
  }}
>
  Download Dockerman
  <span
    className="rounded-md px-[10px] py-1 font-[var(--font-dm-mono)] text-[11px]"
    style={{ background: 'rgb(255 255 255 / 0.18)', opacity: 0.9 }}
  >
    macOS · Win · Linux
  </span>
</Link>
```

Recipe:
- Gradient fill (135° accent → accent-2)
- Soft drop shadow in the _same_ indigo with `color-mix`
- 1px lift on hover (`-translate-y-px`), never a scale
- Inline meta pill at 18% white fill inside the gradient body

### 2.2 The secondary button

```tsx
<a className="inline-flex items-center gap-2 rounded-[10px] border border-dm-line-strong bg-transparent px-[18px] py-3 font-medium text-[14px] text-dm-ink-2 transition-colors hover:bg-dm-bg-soft hover:text-dm-ink">
  View on GitHub →
</a>
```

`dm-line-strong` border + transparent fill; hover darkens the ground to
`dm-bg-soft` and promotes text to `dm-ink`.

### 2.3 The card

```tsx
<article className="rounded-[14px] border border-dm-line bg-dm-bg-elev p-6 transition-all hover:border-dm-line-strong hover:-translate-y-px">
  {/* icon chip: 32×32, rounded-[8px], color-mix 12% accent background */}
  {/* title: text-[18px] font-semibold dm-ink tracking-[-0.015em] */}
  {/* body: text-[13.5px] dm-ink-3 leading-[1.5] */}
</article>
```

The icon chip uses `color-mix(in srgb, var(--color-dm-accent) 12%, transparent)`
for background + solid accent for foreground — a soft tint, never a
solid pill. See `FeaturesGrid.tsx:72-85` for the `accent` / `accent-2` /
`accent-warm` / `ok` / `err` icon color variants.

### 2.4 The eyebrow / section kicker

```tsx
<div
  className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
  style={{ color: 'var(--color-dm-accent)' }}
>
  <span className="text-dm-ink-4">// </span>features
</div>
```

Mono, `dm-accent`, preceded by a muted `// ` comment prefix. One kicker
per section max.

### 2.5 The "chrome" strip (window topbar, meta rail)

Mono, 11–12px, `dm-ink-3`, separated by `•` or small rounded dots
(`h-[3px] w-[3px] rounded-full bg-dm-ink-4`). Strong words promoted to
`dm-ink` with `font-semibold`. See `Hero.tsx:170-186`.

### 2.6 The keycap / code chip

```tsx
<span className="rounded border border-dm-line bg-dm-bg-soft px-[6px] py-[2px] font-[var(--font-dm-mono)] text-[10.5px] text-dm-ink-3">
  ⌘ K
</span>
```

Mono, recessed (`dm-bg-soft`), hairline border, smaller than surrounding
text. Used for shortcuts, version numbers, asset sizes.

### 2.7 The live dot

```tsx
<span
  style={{
    background: 'var(--color-dm-ok)',
    boxShadow: '0 0 0 4px color-mix(in srgb, var(--color-dm-ok) 30%, transparent)',
    animation: 'dm-pulse 2.2s ease-in-out infinite',
  }}
  className="h-[6px] w-[6px] rounded-full"
/>
```

6px dot + 4px halo (30% of its own color) + `dm-pulse`. Use for running
containers, healthy services, "live" streams. See
`LiveDashboard.tsx:ContainerRow` and `Hero.tsx:72-79`.

---

## 3. Interaction states

### 3.1 Focus rings

**Pattern:** put the focus affordance on a _wrapping label_, not on the
raw input. The input itself is styled `border-0 bg-transparent outline-none`.

```tsx
<label className="flex items-center gap-[10px] rounded-[10px] border border-dm-line-strong bg-dm-bg-elev px-[14px] py-[9px]
  focus-within:border-[var(--color-dm-accent-2)]
  focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-dm-accent-2)_18%,transparent)]">
  <input type="search" className="flex-1 border-0 bg-transparent outline-none" />
</label>
```

- Border shifts to `dm-accent-2`
- 3px soft halo in the same indigo at 18% opacity
- No blue Chrome default, no `@tailwindcss/forms` ring (we suppress it
  globally in `globals.css` `@layer base`)

### 3.2 What focus is **not**

- Not the Tailwind blue-600 ring (`#2563eb`). That ring is the
  `@tailwindcss/forms` plugin default and is globally suppressed — if
  you see it, check your CSS hasn't regressed the override.
- Not a hard 0-radius rectangle on a rounded input.
- Not `:focus-visible:outline` alone (too thin, too Chrome-default).

### 3.3 Hover

- Buttons rise by 1px (`hover:-translate-y-px`), never scale.
- Cards firm up their border (`dm-line` → `dm-line-strong`).
- Links / icon buttons shift text/icon color `dm-ink-3` → `dm-ink`, and
  optionally ground `transparent` → `dm-bg-soft`.
- Transition durations default to `transition-colors` / `transition-all`
  (Tailwind defaults, ~150ms). Longer transitions are reserved for
  content swaps (slide cross-fade 450ms, chart curve 1200ms).

---

## 4. Shadows and glows

The site has a small shadow vocabulary — use these, don't invent new
ones.

| Purpose           | Recipe                                                                                                      |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| Button halo       | `0 10px 30px -10px color-mix(in srgb, var(--color-dm-accent-2) 60%, transparent)`                          |
| Card hover lift   | implicit via `-translate-y-px` + border change — no shadow                                                 |
| Viewer chrome     | `0 20px 40px -20px rgb(0 0 0 / 0.35)` (opaque black, high blur, large `-y`)                                |
| Overlay / lightbox| `0 30px 60px -20px rgb(0 0 0 / 0.6)`                                                                        |
| Focus halo        | `0 0 0 3px color-mix(in srgb, var(--color-dm-accent-2) 18%, transparent)`                                  |
| Live dot halo     | `0 0 0 4px color-mix(in srgb, var(--color-dm-ok) 30%, transparent)`                                        |
| Brand mark        | `inset 0 0 0 1px rgb(255 255 255 / 0.1), 0 4px 12px -4px var(--color-dm-accent)`                           |

Notice the pattern: **glows use `color-mix` with the glow's own accent,
never plain black-on-color**. This keeps the glow chromatically coherent
with what it's highlighting.

---

## 5. Data viz

### 5.1 Sparklines

- Smooth curves (Catmull-Rom → cubic Bézier, tension 6). No jagged
  polylines. See `Sparkline.tsx:buildSmoothPath`.
- `preserveAspectRatio="none"` + `vectorEffect="non-scaling-stroke"` so
  the line stays 1.5–2px at any width.
- `transition: d 1200ms cubic-bezier(0.22, 1, 0.36, 1)` — the path
  smoothly morphs when data updates (supported in Chrome 128+, Safari
  17+, Firefox 129+).
- Stroke uses `dm-accent` or a status token; fill uses the same color
  with a 8–12% `color-mix` for the area shade.

### 5.2 Grid overlays

For decorative backgrounds (CTAs, hero gradient zone):

```css
background-image:
  linear-gradient(var(--color-dm-grid) 1px, transparent 1px),
  linear-gradient(90deg, var(--color-dm-grid) 1px, transparent 1px);
background-size: 40px 40px;
```

40px cell, `dm-grid` hairlines, often with `opacity: 0.5`. See
`CtaFinal.tsx:15-24`.

---

## 6. Copy voice (visual-language adjacent)

Decisions that affect visual weight as much as content:

- **Dockerman is not open source.** Don't show `MIT licensed` chips.
- **Analytics are opt-out, not absent.** The meta line is
  `local-first · opt-out analytics`, not `no telemetry`. The privacy doc
  at `/privacy` is the source of truth.
- **Only remote features are paid.** `CtaFinal.tsx` copy says local use
  is free and unrestricted.
- **The download CTA names a platform.** It detects the OS from
  `navigator.userAgent` and shows `Download for macOS / Windows / Linux`
  with the real asset size from `config/downloads.ts`. Don't hardcode
  "18 MB" next to a universal label.

---

## 7. Anti-patterns

Things that look like this system but aren't:

| Looks like           | Actually is                                               |
| -------------------- | --------------------------------------------------------- |
| Thin sharp blue ring | Browser default / `@tailwindcss/forms` leak — suppress it |
| `blue-500` / `sky-*` | Not ours. Reach for `dm-accent-2` indigo or rethink.      |
| `gray-*`             | Not ours. Use `dm-ink-*` (text) or `dm-bg-*` (surface).   |
| Drop shadow on a card at rest | We lift by border + translate, not by shadow       |
| Two display-italic phrases in one heading | One per heading, max                      |
| Solid accent chip background | 12% tint via `color-mix`, solid foreground         |
| Emoji in UI chrome   | Not our voice. Use an SVG icon.                           |

---

## 8. Where to look

| Pattern                 | File                                                        |
| ----------------------- | ----------------------------------------------------------- |
| Tokens, dark mode, reset| `apps/landing/src/app/globals.css`                          |
| Gradient CTA            | `apps/landing/src/components/landing/Hero.tsx`              |
| Secondary CTA, final card | `apps/landing/src/components/landing/CtaFinal.tsx`        |
| Feature card grid       | `apps/landing/src/components/landing/FeaturesGrid.tsx`      |
| Live dot + mono chrome  | `apps/landing/src/components/landing/LiveDashboard.tsx`     |
| Sparkline curve + morph | `apps/landing/src/components/ui/Sparkline.tsx`              |
| Focus-within ring       | `apps/landing/src/components/changelog/ChangelogSearch.tsx` |
| Footer minimal          | `apps/landing/src/components/shell/Footer.tsx`              |
| Scroll-pinned slide deck| `apps/landing/src/components/snapshot/SnapshotShowcase.tsx` |

When in doubt, open one of these and copy the shape — don't invent a
new one.
