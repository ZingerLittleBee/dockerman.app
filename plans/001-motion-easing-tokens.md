# 001 — Extract shared easing tokens and consolidate duplicate curves

- **Status**: DONE (commit 305c4fc)
- **Commit**: 7955cd6
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens
- **Estimated scope**: 4 files (globals.css, Hero.tsx, Sparkline.tsx, SnapshotShowcase.tsx) + DESIGN.md, ~15 line edits

## Problem

The codebase has no named easing token layer. Three near-identical "strong ease-out" curves coexist, splitting the motion vocabulary:

- `cubic-bezier(0.16, 1, 0.3, 1)` — hand-typed 7× inside `--animate-*` strings in `apps/landing/src/app/globals.css:17-30`
- `cubic-bezier(0.22, 1, 0.36, 1)` — hand-typed in `apps/landing/src/components/landing/Hero.tsx:339`, `Hero.tsx:377`, `Hero.tsx:404`, `apps/landing/src/components/ui/Sparkline.tsx:13`, `apps/landing/src/components/snapshot/SnapshotShowcase.tsx:529`
- `cubic-bezier(0.33, 1, 0.68, 1)` — accordion tokens `globals.css:25-26` (out of scope here, see plan 007)

```css
/* apps/landing/src/app/globals.css:17-30 — current */
--animate-hide: hide 150ms cubic-bezier(0.16, 1, 0.3, 1);
--animate-slideDownAndFade: slideDownAndFade 150ms
  cubic-bezier(0.16, 1, 0.3, 1);
--animate-slideLeftAndFade: slideLeftAndFade 150ms
  cubic-bezier(0.16, 1, 0.3, 1);
--animate-slideUpAndFade: slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1);
--animate-slideRightAndFade: slideRightAndFade 150ms
  cubic-bezier(0.16, 1, 0.3, 1);
--animate-accordionOpen: accordionOpen 250ms cubic-bezier(0.33, 1, 0.68, 1);
--animate-accordionClose: accordionClose 200ms cubic-bezier(0.33, 1, 0.68, 1);
--animate-dialogOverlayShow: dialogOverlayShow 150ms
  cubic-bezier(0.16, 1, 0.3, 1);
--animate-dialogContentShow: dialogContentShow 150ms
  cubic-bezier(0.16, 1, 0.3, 1);
```

```ts
// apps/landing/src/components/ui/Sparkline.tsx:12-14 — current
const PATH_TRANSITION = {
  transition: 'd 1200ms cubic-bezier(0.22, 1, 0.36, 1)'
} as const
```

```tsx
// apps/landing/src/components/snapshot/SnapshotShowcase.tsx:528-529 — current
transition:
  'opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1), clip-path 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
```

Every future component re-invents the curve by hand; the two ease-out variants drift for no design reason.

## Target

One canonical strong ease-out and one strong ease-in-out, defined as Tailwind v4 `@theme` variables (which also generates `ease-out-strong` / `ease-in-out-strong` utility classes):

```css
/* add inside the FIRST @theme block in apps/landing/src/app/globals.css (the one starting at line 11), right after --font-sans-zh */
--ease-out-strong: cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out-strong: cubic-bezier(0.77, 0, 0.175, 1);
```

The canonical value is `0.22, 1, 0.36, 1` because DESIGN.md §5.1 already settles it for the sparkline; `0.16, 1, 0.3, 1` usages migrate onto it (visually near-identical). `--ease-in-out-strong` follows the audit reference value `cubic-bezier(0.77, 0, 0.175, 1)` and is consumed by later plans (007).

All hand-typed occurrences of both ease-out curves become `var(--ease-out-strong)`.

## Repo conventions to follow

- All design tokens live in `apps/landing/src/app/globals.css` under `@theme` (see the `--animate-*` block at lines 17-33 and the `dm-*` color block at lines 150-174). Add the new tokens to the first `@theme` block.
- Tailwind v4: a `--ease-<name>` theme variable automatically creates an `ease-<name>` utility.
- `DESIGN.md` is the living design-language reference; token additions must be documented there (§1.7 Motion).

## Steps

1. `apps/landing/src/app/globals.css` — in the first `@theme` block, after the `--font-sans-zh` declaration, add the two token lines from Target.
2. Same file, lines 17-30 — replace all seven occurrences of `cubic-bezier(0.16, 1, 0.3, 1)` with `var(--ease-out-strong)`. Do NOT touch the two accordion lines (25-26) or the `--animate-slide-down-fade`/`--animate-slide-up-fade` lines (31-32).
3. `apps/landing/src/components/landing/Hero.tsx` — replace `cubic-bezier(0.22, 1, 0.36, 1)` with `var(--ease-out-strong)` at line 339 (`animation: 'dm-progress 900ms …'`), line 377 (StageLine `animation: 'dm-reveal-up 420ms …'`), line 404 (ContainerMini `animation: 'dm-reveal-up 480ms …'`).
4. `apps/landing/src/components/ui/Sparkline.tsx:13` — change to `transition: 'd 1200ms var(--ease-out-strong)'`.
5. `apps/landing/src/components/snapshot/SnapshotShowcase.tsx:528-529` — change to `'opacity 0.45s var(--ease-out-strong), clip-path 0.55s var(--ease-out-strong)'`.
6. `DESIGN.md` §1.7 Motion — document the two tokens: name, value, and rule of use ("entrances/exits and reveals use `--ease-out-strong`; on-screen morphs use `--ease-in-out-strong`; never hand-type a cubic-bezier in a component").

## Boundaries

- Do NOT touch `--animate-accordionOpen/Close` or `AccordionTrigger.tsx` (plan 007 owns the accordion).
- Do NOT touch `--animate-slide-down-fade` / `--animate-slide-up-fade` (plan 005 owns them).
- Do NOT change any duration or keyframe definition — easing values only.
- Do NOT add new dependencies.
- If a cited line doesn't match the code you find (drift since commit 7955cd6), STOP and report instead of improvising.

## Verification

- **Mechanical**: `bun run check` from repo root passes (biome/ultracite). `cd apps/landing && bunx tsc --noEmit` passes. Grep proof: `grep -rn "cubic-bezier(0.16, 1, 0.3, 1)\|cubic-bezier(0.22, 1, 0.36, 1)" apps/landing/src` returns ONLY the token definition line.
- **Feel check**: `bun run dev:landing`, then:
  - Hover a tooltip on /pricing (TrustBar) — entrance still eases out crisply, no visible change from before.
  - Watch the hero terminal animation on / — reveal timing unchanged.
  - On / LiveDashboard, sparkline curves still morph smoothly on data ticks.
- **Done when**: the greps above are clean, both tokens exist in `@theme`, DESIGN.md documents them, and the site renders with visually unchanged motion.
