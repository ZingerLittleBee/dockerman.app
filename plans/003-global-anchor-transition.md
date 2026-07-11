# 003 — Scope the global anchor transition to color properties

- **Status**: DONE (commit 03943ec)
- **Commit**: 7955cd6
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (globals.css), 1 line

## Problem

Every `<a>` on the site carries `transition-all`, so the browser watches every animatable property (layout properties included) on every link, site-wide — docs, changelog, nav, footer, MDX body links. Only text color and underline color actually change on hover.

```css
/* apps/landing/src/app/globals.css:321-323 — current */
a {
  @apply scroll-my-24 decoration-gray-400 transition-all;
}
```

`transition: all` is an unconditional performance finding: it animates unintended properties off-GPU (e.g. a link whose `padding`/`width` changes from a class toggle would animate layout).

## Target

```css
/* apps/landing/src/app/globals.css:321-323 — target */
a {
  @apply scroll-my-24 decoration-gray-400 transition-[color,text-decoration-color];
}
```

## Repo conventions to follow

- This rule lives in plain CSS with `@apply` in `globals.css`; keep the `@apply` form.
- Component-level links that need to animate transform (e.g. CTA buttons with `hover:-translate-y-px`) already declare their own `transition-*` utility on the element, which overrides this base rule — they are unaffected (their cleanup is plan 006).

## Steps

1. `apps/landing/src/app/globals.css:322` — replace `transition-all` with `transition-[color,text-decoration-color]`.

## Boundaries

- Do NOT touch any component file — this plan is exactly one line.
- Do NOT remove `scroll-my-24` or `decoration-gray-400`.
- If the line doesn't match the excerpt (drift since commit 7955cd6), STOP and report.

## Verification

- **Mechanical**: `bun run check` passes; `cd apps/landing && bun run build` succeeds. Grep proof: `grep -n "transition-all" apps/landing/src/app/globals.css` returns nothing.
- **Feel check**: `bun run dev:landing`:
  - Hover a nav link and a docs body link — color still eases (~150ms), identical to before.
  - Hover the hero download CTA — the 1px lift still animates (it has its own transition utility).
- **Done when**: the grep is clean and link hover color still transitions.
