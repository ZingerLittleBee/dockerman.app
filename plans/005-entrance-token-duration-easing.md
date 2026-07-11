# 005 — Fix the slide-fade entrance tokens: real duration, ease-out family

- **Status**: DONE (commit fdd27be)
- **Commit**: 7955cd6
- **Severity**: MEDIUM
- **Category**: Easing & duration / correctness
- **Estimated scope**: 3 files (globals.css, about page, pricing success page), ~8 lines

## Problem

The two shared entrance tokens declare no duration — the CSS `animation` shorthand then defaults to `0s`, so the token is a no-op on its own — and use `ease-in-out`, the wrong easing family for an entrance (entrances should start fast: ease-out):

```css
/* apps/landing/src/app/globals.css:31-32 — current */
--animate-slide-down-fade: slide-down-fade ease-in-out forwards;
--animate-slide-up-fade: slide-up-fade ease-in-out forwards;
```

Both consumers are forced to patch the missing duration inline:

```tsx
// apps/landing/src/app/[locale]/(main)/about/page.tsx:44-51 — current
<section
  aria-labelledby="about-overview"
  className="animate-slide-up-fade"
  style={{
    animationDuration: '600ms',
    animationFillMode: 'backwards'
  }}
>
```

```tsx
// apps/landing/src/app/[locale]/(main)/pricing/success/page.tsx:14-17 — current
<section
  className="max-w-lg animate-slide-up-fade text-center"
  style={{ animationDuration: '600ms', animationFillMode: 'backwards' }}
>
```

## Target

Self-contained tokens with a real duration, a strong ease-out, and `both` fill (covers both the delay window and the end state); consumers drop their inline patches:

```css
/* apps/landing/src/app/globals.css:31-32 — target */
--animate-slide-down-fade: slide-down-fade 600ms var(--ease-out-strong) both;
--animate-slide-up-fade: slide-up-fade 600ms var(--ease-out-strong) both;
```

600ms is kept: these are rare, first-view marketing entrances (about page, checkout success), where longer-than-UI durations are allowed.

`--ease-out-strong` is `cubic-bezier(0.22, 1, 0.36, 1)`. If plan 001 has not run yet and the token does not exist in globals.css, add it to the first `@theme` block (after `--font-sans-zh`):

```css
--ease-out-strong: cubic-bezier(0.22, 1, 0.36, 1);
```

## Repo conventions to follow

- `--animate-*` tokens in the first `@theme` block of `apps/landing/src/app/globals.css` are the animation vocabulary; consumers use the generated `animate-<name>` utility with no inline style. Exemplar of a complete token: `--animate-fade-in: fade-in 200ms ease-out;` (globals.css:33).

## Steps

1. `apps/landing/src/app/globals.css:31-32` — replace with the two Target lines. Ensure `--ease-out-strong` exists (see Target; add if missing).
2. `apps/landing/src/app/[locale]/(main)/about/page.tsx:44-51` — delete the whole `style={{ animationDuration: '600ms', animationFillMode: 'backwards' }}` prop; keep `className="animate-slide-up-fade"`.
3. `apps/landing/src/app/[locale]/(main)/pricing/success/page.tsx:14-17` — same deletion; keep `className="max-w-lg animate-slide-up-fade text-center"`.

## Boundaries

- Do NOT change the keyframes `slide-up-fade` (globals.css:117-126) or `slide-down-fade` (globals.css:127-136).
- Do NOT touch any other `--animate-*` token.
- Do NOT add new dependencies.
- If the cited lines differ (drift since commit 7955cd6), STOP and report.

## Verification

- **Mechanical**: `bun run check` passes; `cd apps/landing && bunx tsc --noEmit` passes. Grep proof: `grep -rn "animationDuration" apps/landing/src/app` returns nothing.
- **Feel check**: `bun run dev:landing`:
  - Open /en/about — the page content slides up 12px and fades in over ~600ms, starting FAST and settling gently (ease-out). Compare with DevTools Animations panel at 10% speed: the largest movement happens in the first third.
  - The animation must actually play (before this fix the token alone was 0s — verify duration shows ~600ms in the Animations panel).
- **Done when**: both pages animate identically to before (600ms) but via the token alone, with ease-out character, and no inline animation styles remain.
