# Animation Improvement Plans

Produced by an `improve-animations` audit of `apps/landing` + `packages/shared` at commit `7955cd6` (2026-07-11). Each plan is self-contained — an executor needs no context beyond the plan file.

## Plans

| # | Plan | Severity | Category | Status |
| --- | --- | --- | --- | --- |
| 001 | [Extract shared easing tokens](001-motion-easing-tokens.md) | MEDIUM | Cohesion & tokens | DONE |
| 002 | [Disable Lenis for reduced motion](002-lenis-reduced-motion.md) | HIGH | Accessibility | DONE |
| 003 | [Scope global anchor transition](003-global-anchor-transition.md) | HIGH | Performance | DONE |
| 004 | [Reduced-motion gate lands at end state](004-reduced-motion-gate-end-state.md) | MEDIUM | Accessibility | DONE |
| 005 | [Fix slide-fade entrance tokens](005-entrance-token-duration-easing.md) | MEDIUM | Easing & duration | DONE |
| 006 | [Replace transition-all with property lists](006-transition-all-sweep.md) | MEDIUM | Performance | DONE |
| 007 | [Interruptible accordion + synced chevron](007-accordion-interruptible.md) | MEDIUM | Interruptibility | DONE |
| 008 | [Press feedback on interactive controls](008-press-feedback.md) | MEDIUM | Physicality | DONE |
| 009 | [Reduced-motion coverage sweep](009-reduced-motion-coverage.md) | MEDIUM | Accessibility | DONE |

## Recommended execution order

1. **001** first — it creates the `--ease-out-strong` / `--ease-in-out-strong` tokens that 005, 006, 007 consume. (Each of those plans carries an add-if-missing fallback, so they don't hard-fail without 001, but running 001 first avoids duplicate token definitions.)
2. **002, 003, 004** in any order — independent, and 002/003 are the two HIGH findings.
3. **005, 006, 007** in any order after 001.
4. **008 after 006** — both edit the same `transition-*` class fragments; 008 explains how to reconcile if 006 already ran, but running 006 first keeps 008's edits clean.
5. **009 last** — its pulse-dot step composes with 004's gate semantics (works either way, best after 004).

## Dependencies

- 005/006/007 → 001 (soft: shared easing tokens; each has an inline fallback).
- 008 → 006 (soft: overlapping class strings; 008 documents the reconciliation).
- 009 → 004 (soft: `dm-animated` freeze behavior is nicer with 004's end-state gate).

## Audit backlog (vetted, not yet planned)

LOW-severity findings confirmed during the audit, available for future plans:

- Tooltip doesn't scale from its trigger and uses restart-from-zero keyframes (`Tooltip.tsx:59`).
- Snapshot rail active-item gradient/shadow snaps while its text eases (`SnapshotShowcase.tsx:362-371`).
- Hero MiniBars: 7 decorative CPU bars bounce forever (`Hero.tsx:452`) — delete or play once.
- `dm-pulse` runs at 900ms everywhere but DESIGN.md §2.7 documents 2.2s — code/doc drift.
- Dead motion infrastructure: `motion` v12 dependency has zero imports; `::view-transition` rules + stale comment (`globals.css:342-352`) outlive the removed clip-path theme reveal; `dialogOverlayShow`/`dialogContentShow` tokens are unused.

Missed opportunities (additive, need design sign-off):

- Lightbox opens/closes with zero animation (`SnapshotShowcase.tsx:675`) — the unused dialog tokens fit here.
- Copy-button copied-state swaps teleport (`HomebrewCopyButton.tsx:30-55`, `SnapshotShowcase.tsx:652`).
- ThemeSwitch pill crossfades per item instead of sliding between positions (`ThemeSwitch.tsx:72-80`).
- LocaleSwitch dropdown appears with no entrance at all (`LocaleSwitch.tsx:77-83`).
- Feature/platform grids could take a 30–80ms in-view stagger (`FeaturesGrid.tsx:102`, `PlatformCard.tsx:54`).
