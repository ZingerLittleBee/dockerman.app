# 009 — Extend reduced-motion coverage beyond the hero stage

- **Status**: DONE (commit c43b7fa)
- **Commit**: 7955cd6
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 6 files, ~40 lines

## Problem

The `.dm-animated` reduced-motion gate is applied to exactly ONE element in the codebase (`Hero.tsx:241`, the decorative hero stage). Everything else that moves ignores `prefers-reduced-motion`:

1. **Snapshot slide wipe** — `apps/landing/src/components/snapshot/SnapshotShowcase.tsx:527-533`:

```tsx
const style: React.CSSProperties = {
  transition:
    'opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), clip-path 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
  opacity: visible ? 1 : 0,
  clipPath: active ? 'inset(0 0 0 0)' : prev ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)',
  zIndex: active ? 2 : prev ? 1 : 0
}
```

The clip-path wipe is positional movement, triggered on every module change (click, keyboard j/k/arrows, and scroll-driven via IntersectionObserver).

2. **Programmatic smooth scrolling** — `SnapshotShowcase.tsx:116`, `:118`, `:126` (`scrollTo`/`scrollIntoView` with `behavior: 'smooth'`), `:156` (`sentinel.scrollIntoView({ behavior: 'smooth', block: 'center' })`); `apps/landing/src/components/changelog/ChangelogToc.tsx:18` and `:20` (`nav.scrollTo({ ..., behavior: 'smooth' })`).

3. **Mobile nav drawer translate** — `apps/landing/src/components/shell/Navbar.tsx:145-147`:

```tsx
className={`absolute inset-x-0 top-full z-50 origin-top ... transition-all duration-200 ${
  menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
}`}
```

4. **Ungated infinite pulse dots** (the gated ones inside HeroStage are fine): `apps/landing/src/components/landing/Hero.tsx:96-102` (eyebrow "live" dot), `apps/landing/src/components/landing/LiveDashboard.tsx:262-268` ("connected" chip dot), `apps/landing/src/components/download/DownloadHero.tsx:27`, `apps/landing/src/components/pricing/PricingHero.tsx:30` — all `animation: 'dm-pulse 900ms ease-in-out infinite'` with no gate.

Reduced motion means fewer and gentler animations, not zero: keep opacity fades, drop positional movement and perpetual loops.

## Target

- Slide under reduced motion: crossfade only — `transition: 'opacity 0.2s ease-out'`, `clipPath` always `'inset(0 0 0 0)'`, same `opacity`/`zIndex` logic.
- All programmatic scrolls: `behavior: reduced ? 'auto' : 'smooth'`.
- Nav drawer: keep the opacity fade, drop the translate (`motion-reduce:translate-y-0` on the closed state so both states sit at translate-y 0 when reduced).
- Pulse dots: add the `dm-animated` class to each dot's className — the existing global gate then freezes them (static, fully visible, since `dm-pulse`'s 0%/100% frame is `opacity: 1`).

## Repo conventions to follow

- Reduced-motion detection in client components uses `useSyncExternalStore` + `matchMedia` — exemplar: `apps/landing/src/components/landing/PaletteViz.tsx:83-96` (`subscribeReducedMotion`, `getReducedMotionSnapshot`, `getServerReducedMotionSnapshot`). Copy that trio module-level into SnapshotShowcase.tsx.
- One-shot reads at call time may use bare `window.matchMedia('(prefers-reduced-motion: reduce)').matches` — exemplar: `apps/landing/src/components/landing/hooks/useSparkline.ts:30-34`.
- The `dm-animated` gating class is documented in DESIGN.md §1.7.

## Steps

1. `SnapshotShowcase.tsx` — add the PaletteViz reduced-motion trio at module level; inside `SnapshotShowcase()` read `const reduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getServerReducedMotionSnapshot)`.
2. Thread `reduced` through `Stage` to `Slide` as a prop. In `Slide`, build the style per Target when `reduced` is true, otherwise keep the current object.
3. In `scrollActiveControls` (`:104-129`) and `go` (`:150-162`), replace each `behavior: 'smooth'` with `behavior: reduced ? 'auto' : 'smooth'` (add `reduced` to the `useCallback` deps).
4. `ChangelogToc.tsx` — before the two `scrollTo` calls (`:18`, `:20`), compute `const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'` and use it in both calls.
5. `Navbar.tsx:146` — change the closed-state branch from `'-translate-y-2 opacity-0'` to `'-translate-y-2 opacity-0 motion-reduce:translate-y-0'`.
6. Add `dm-animated` to the four pulse-dot classNames: `Hero.tsx:96-102` eyebrow dot, `LiveDashboard.tsx:262-268` connected dot, `DownloadHero.tsx:27` dot, `PricingHero.tsx:30` dot (each is a `<span className="h-[6px] w-[6px] rounded-full">`-style element with the inline `dm-pulse` animation — append `dm-animated` to its className).

## Boundaries

- Do NOT change any behavior when reduced motion is OFF — every default-path value stays byte-identical.
- Do NOT touch the `.dm-animated` media query itself (plan 004 owns it) — this plan only ADDS the class to elements.
- Do NOT gate the hover micro-movements (`hover:-translate-y-px`) — out of scope, user-initiated.
- Do NOT add dependencies or extract new shared hooks — follow the existing local-trio pattern.
- If cited lines differ (drift since commit 7955cd6), STOP and report.

## Verification

- **Mechanical**: `bun run check` passes; `cd apps/landing && bunx tsc --noEmit` passes.
- **Feel check**: `bun run dev:landing`, DevTools → Rendering → emulate `prefers-reduced-motion: reduce`:
  - /en/snapshot: switch modules with click and with j/k — screenshots crossfade (~200ms), NO left-edge wipe; the rail jumps instantly (no smooth scroll). Emulation off: wipe and smooth scroll return.
  - /en/changelog: click a TOC entry — instant jump under reduce, smooth without.
  - Narrow viewport, open the mobile menu — panel fades in place, no downward slide.
  - / (homepage): the eyebrow "live" dot and LiveDashboard "connected" dot are static and fully visible; without emulation they pulse.
- **Done when**: every listed surface passes both emulation states with zero visual change in the non-reduced path.
