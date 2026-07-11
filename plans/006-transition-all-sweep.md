# 006 — Replace component-level transition-all with explicit property lists

- **Status**: DONE (commit 68fd0e8)
- **Commit**: 7955cd6
- **Severity**: MEDIUM
- **Category**: Performance (+ one easing-family fix)
- **Estimated scope**: 9 files, 10 class-string edits

## Problem

Nine components use `transition-all`, which makes the browser watch every animatable property when only 1–3 actually change. One of them (`buttonVariants`) also uses `ease-in-out` for what is a hover color change (hover/color transitions should use plain `ease`). The mobile nav drawer entrance additionally inherits Tailwind's weak default easing where an ease-out belongs.

Each current class string is quoted in the Steps table below, verbatim from commit 7955cd6.

## Target

Every `transition-all` becomes `transition-[<exact properties that change>]`. Durations are unchanged unless noted. `--ease-out-strong` is `cubic-bezier(0.22, 1, 0.36, 1)`; if it does not yet exist in `apps/landing/src/app/globals.css` (plan 001 not run), add to the first `@theme` block:

```css
--ease-out-strong: cubic-bezier(0.22, 1, 0.36, 1);
```

## Repo conventions to follow

- Hover behavior is settled by DESIGN.md §3.3 (1px lift, border firming, ~150ms) — do not change what animates, only which properties are listed.
- Tailwind arbitrary transition property lists use underscores for none — plain commas work: `transition-[transform,border-color]`.

## Steps

Apply each replacement exactly. Only the `transition-*`/`ease-*` fragment of the class string changes; everything else stays.

1. `apps/landing/src/components/buttonVariants.ts:6`
   - old fragment: `transition-all duration-100 ease-in-out`
   - new fragment: `transition-[color,background-color,border-color,box-shadow] duration-100 ease-[ease]`
   (hover here changes bg/border/text color and shadow; hover/color → plain `ease`)
2. `apps/landing/src/components/landing/FeaturesGrid.tsx:103`
   - old: `... p-5 transition-all hover:-translate-y-px hover:border-dm-line-strong sm:p-6 ...`
   - new: `... p-5 transition-[transform,border-color] hover:-translate-y-px hover:border-dm-line-strong sm:p-6 ...`
3. `apps/landing/src/components/snapshot/SnapshotFeaturesStrip.tsx:43`
   - old: `... pt-[22px] transition-all hover:-translate-y-[2px] hover:border-dm-line-strong`
   - new: `... pt-[22px] transition-[transform,border-color] hover:-translate-y-[2px] hover:border-dm-line-strong`
4. `apps/landing/src/components/download/PlatformCard.tsx:54`
   - old: `... rounded-[14px] border p-6 transition-all hover:-translate-y-px`
   - new: `... rounded-[14px] border p-6 transition-transform hover:-translate-y-px`
5. `apps/landing/src/components/download/PlatformCard.tsx:104`
   - old: `... no-underline transition-all hover:translate-x-[2px] hover:border-[color:color-mix(in_srgb,var(--color-dm-accent-2)_40%,var(--color-dm-line-strong))] hover:bg-dm-bg-elev`
   - new: `... no-underline transition-[transform,border-color,background-color] hover:translate-x-[2px] hover:border-[color:color-mix(in_srgb,var(--color-dm-accent-2)_40%,var(--color-dm-line-strong))] hover:bg-dm-bg-elev`
6. `apps/landing/src/components/pricing/PlanCard.tsx:52` (the `ctaClassName` template literal)
   - old fragment: `no-underline transition-all`
   - new fragment: `no-underline transition-[transform,background-color,border-color,color]`
7. `apps/landing/src/components/landing/Hero.tsx:122` (gradient download Link)
   - old fragment: `no-underline transition-all hover:-translate-y-px`
   - new fragment: `no-underline transition-transform hover:-translate-y-px`
8. `apps/landing/src/components/landing/CtaFinal.tsx:44`
   - old fragment: `no-underline transition-all hover:-translate-y-px`
   - new fragment: `no-underline transition-transform hover:-translate-y-px`
9. `apps/landing/src/components/shell/Navbar.tsx:145` (mobile menu panel)
   - old fragment: `... shadow-[0_20px_40px_-20px_rgb(0_0_0/0.4)] transition-all duration-200`
   - new fragment: `... shadow-[0_20px_40px_-20px_rgb(0_0_0/0.4)] transition-[transform,opacity] duration-200 ease-out-strong`
   (entrance → strong ease-out; requires the `--ease-out-strong` token, see Target)

## Boundaries

- Do NOT touch `globals.css:322` (`a { transition-all }`) — that is plan 003.
- Do NOT change which properties animate on hover, any duration except adding the Navbar easing, or any markup.
- Do NOT touch `packages/shared` or fumadocs styling.
- If any old fragment is not found verbatim (drift since commit 7955cd6), STOP and report that item; apply the rest.

## Verification

- **Mechanical**: `bun run check` passes; `cd apps/landing && bun run build` succeeds. Grep proof: `grep -rn "transition-all" apps/landing/src --include='*.tsx' --include='*.ts'` returns nothing.
- **Feel check**: `bun run dev:landing`:
  - Hover a features card on / — it still lifts 1px and firms its border, smoothly.
  - Hover the hero download CTA and a pricing CTA — 1px lift unchanged.
  - Hover a `buttonVariants` button (e.g. docs UI) — background color still eases, now with `ease`.
  - On a narrow viewport, open the mobile menu — the panel slides down/fades with a fast-start (ease-out) character; at 10% speed in the Animations panel the movement front-loads.
- **Done when**: the grep is clean and every hover/entrance behaves visually as before (only the watched property set and two easings changed).
