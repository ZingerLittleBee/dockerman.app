# 004 — Make the reduced-motion gate land animations at their end state

- **Status**: DONE (commit 33067d2)
- **Commit**: 7955cd6
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 1 file (globals.css), ~6 lines

## Problem

The reduced-motion gate kills animations with `animation: none`, but several elements inside the gated `.dm-animated` subtree (the hero terminal stage, `Hero.tsx:241`) depend on `animation-fill-mode: forwards` to ever REACH their visible state — they start at inline `opacity: 0` or `width: 0`:

```css
/* apps/landing/src/app/globals.css:276-282 — current */
@media (prefers-reduced-motion: reduce) {
  .dm-animated,
  .dm-animated * {
    animation: none !important;
    transition: none !important;
  }
}
```

```tsx
// apps/landing/src/components/landing/Hero.tsx:375-379 — StageLine (current)
style={{
  opacity: 0,
  animation: 'dm-reveal-up 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
  animationDelay: `${delayMs}ms`
}}
```

Same pattern: `Hero.tsx:402-406` (ContainerMini, `opacity: 0`), `Hero.tsx:335-342` (progress bar, `width: '0'`), `Hero.tsx:300-309` (typewriter span, `width: '0'`).

With `animation: none`, reduced-motion users on xl viewports see the hero right column permanently broken: invisible command text, empty log lines, blank container cards, a 0-width progress bar. Reduced motion should mean fewer/gentler animations, not a stranded initial state.

## Target

Instead of removing animations, force them to complete instantly — `forwards` fill then lands every element at its end state, and infinite loops freeze after one micro-iteration:

```css
/* apps/landing/src/app/globals.css:276-282 — target */
@media (prefers-reduced-motion: reduce) {
  .dm-animated,
  .dm-animated * {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition: none !important;
  }
}
```

End states this produces (all verified against the keyframes in globals.css):
- `dm-reveal-up` → `opacity: 1; translateY(0)` — lines/cards visible ✔
- `dm-type` → full command width ✔ (`dm-caret` → transparent caret, fine)
- `dm-progress` → full-width bar ✔
- `dm-pulse` → `opacity: 1` (its 0%/100% frame) — static dot ✔
- `dm-spark` → `scaleY(0.4)` (its 0%/100% frame) — static short bars, acceptable ✔

## Repo conventions to follow

- The `.dm-animated` gating scheme itself is documented in DESIGN.md §1.7 and stays; only the mechanism inside the media query changes.
- Update the DESIGN.md §1.7 sentence "disables `.dm-animated` transitions/animations" to say animations complete instantly at their end state instead.

## Steps

1. `apps/landing/src/app/globals.css:276-282` — replace `animation: none !important;` with the three `animation-*` lines from Target. Keep `transition: none !important;`.
2. `DESIGN.md` §1.7 — adjust the reduced-motion sentence as described above.

## Boundaries

- Do NOT touch Hero.tsx or any component — the fix is entirely in the media query.
- Do NOT remove `transition: none !important`.
- Do NOT change the keyframes.
- If the gate block differs from the excerpt (drift since commit 7955cd6), STOP and report.

## Verification

- **Mechanical**: `bun run check` passes.
- **Feel check**: `bun run dev:landing`, open / at a viewport ≥1280px wide:
  - DevTools → Rendering → emulate `prefers-reduced-motion: reduce` → reload. The hero right column shows the FULL terminal state immediately: complete command line, all `==>` log lines, full gradient progress bar, all three container cards visible. Nothing pulses or types.
  - Turn emulation off → reload → the typing/reveal sequence plays as before.
- **Done when**: under reduced-motion emulation the hero stage is fully rendered and static; without it, the animation sequence is unchanged.
