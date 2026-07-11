# 007 — Make the FAQ accordion interruptible and sync its chevron

- **Status**: DONE (commit 9d5c80f)
- **Commit**: 7955cd6
- **Severity**: MEDIUM
- **Category**: Interruptibility (+ cohesion, accessibility)
- **Estimated scope**: 3 files (AccordionContent.tsx, AccordionTrigger.tsx, globals.css), ~20 lines

## Problem

The accordion (used by `apps/landing/src/components/pricing/PricingFaq.tsx`) animates with `@keyframes`. Keyframes restart from zero — toggling a panel while it is still opening snaps it to full height and replays the close from there instead of reversing from the current position. CSS transitions retarget mid-flight; expand/collapse UI must use them.

```tsx
// apps/landing/src/components/AccordionContent.tsx:10-30 — current
export function AccordionContent({ className, children, ref, ...props }: AccordionContentProps) {
  return (
    <AccordionPrimitives.Content
      className={cx(
        'transform-gpu data-[state=closed]:animate-accordionClose data-[state=open]:animate-accordionOpen'
      )}
      ref={ref}
      {...props}
    >
      <div
        className={cx(
          'overflow-hidden pb-4 text-sm',
          'text-gray-700 dark:text-gray-200',
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitives.Content>
  )
}
```

```css
/* apps/landing/src/app/globals.css:25-26 — current tokens */
--animate-accordionOpen: accordionOpen 250ms cubic-bezier(0.33, 1, 0.68, 1);
--animate-accordionClose: accordionClose 200ms cubic-bezier(0.33, 1, 0.68, 1);
/* globals.css:83-98 — keyframes animating height: 0 ↔ var(--radix-accordion-content-height) */
```

Two more defects in the same widget:

- The chevron rotates on a one-off curve and shorter duration than its own panel — two halves of one motion disagree:

```tsx
// apps/landing/src/components/AccordionTrigger.tsx:29 — current
'size-5 shrink-0 transition-transform duration-150 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:-rotate-45',
```

- Neither panel nor chevron has any `prefers-reduced-motion` handling.

## Target

Replace the keyframe height animation with a `grid-template-rows: 0fr → 1fr` transition (interruptible, retargets on reversal). Radix only keeps closing content mounted while an *animation* runs — transitions are not detected — so the content must be `forceMount`ed, with `visibility` handling accessibility/focus (`visibility` transitions discretely: it flips to `hidden` only at the END of the closing transition, and to `visible` immediately on open).

```tsx
// apps/landing/src/components/AccordionContent.tsx — target render
<AccordionPrimitives.Content
  forceMount
  className={cx(
    'grid grid-rows-[0fr] transition-[grid-template-rows,visibility] duration-200 ease-out-strong',
    'data-[state=open]:grid-rows-[1fr] data-[state=open]:duration-250',
    'data-[state=closed]:invisible',
    'motion-reduce:transition-none'
  )}
  ref={ref}
  {...props}
>
  <div
    className={cx(
      'min-h-0 overflow-hidden pb-4 text-sm',
      'text-gray-700 dark:text-gray-200',
      className
    )}
  >
    {children}
  </div>
</AccordionPrimitives.Content>
```

```tsx
// apps/landing/src/components/AccordionTrigger.tsx:29 — target (same curve + duration as the panel)
'size-5 shrink-0 transition-transform duration-200 ease-out-strong group-data-[state=open]:-rotate-45 group-data-[state=open]:duration-250',
'motion-reduce:transition-none',
```

Timing preserved from today: 250ms open, 200ms close. `--ease-out-strong` is `cubic-bezier(0.22, 1, 0.36, 1)`; if it does not exist in globals.css (plan 001 not run), add it to the first `@theme` block:

```css
--ease-out-strong: cubic-bezier(0.22, 1, 0.36, 1);
```

## Repo conventions to follow

- Radix primitives are wrapped in thin components under `apps/landing/src/components/` using `cx` from `@repo/shared/utils` — keep that structure.
- Utility-class styling only; no new CSS files.

## Steps

1. `apps/landing/src/components/AccordionContent.tsx` — replace the render with the Target markup above (adds `forceMount`, swaps animation classes for the grid transition, moves `min-h-0` onto the inner div).
2. `apps/landing/src/components/AccordionTrigger.tsx:29` — replace the chevron transition classes as in Target (add the `motion-reduce:transition-none` entry as an adjacent string in the same `cx` call).
3. Ensure `--ease-out-strong` exists in `apps/landing/src/app/globals.css` (see Target).
4. `apps/landing/src/app/globals.css` — after confirming with `grep -rn "accordionOpen\|accordionClose" apps/landing/src --include='*.tsx'` that no other consumer exists, delete the two tokens (lines 25-26) and the `accordionOpen`/`accordionClose` keyframes (lines 83-98).

## Boundaries

- Do NOT touch `PricingFaq.tsx` or any other accordion consumer — the wrappers absorb the change.
- Do NOT touch fumadocs' own accordion styling.
- Do NOT change the 250/200ms timing or the rotate-45 chevron behavior.
- If the files differ from the excerpts (drift since commit 7955cd6), STOP and report.

## Verification

- **Mechanical**: `bun run check` passes; `cd apps/landing && bunx tsc --noEmit` passes; `grep -rn "accordionOpen\|accordionClose" apps/landing/src` returns nothing.
- **Feel check**: `bun run dev:landing`, open /en/pricing, scroll to the FAQ:
  - Click a question open, then click again MID-OPEN: the panel must reverse smoothly from its current height — no snap to full height, no jump to zero. Spam-click 5×: motion always continues from where it is.
  - The plus icon rotates in step with the panel — at 10% speed (DevTools Animations panel) icon and panel start and stop together.
  - Closed panels: tab through the page — no focus lands inside a closed answer (visibility works); the closed answer text is not visible.
  - Emulate `prefers-reduced-motion: reduce`: panels snap open/closed instantly, icon snaps, content still readable.
- **Done when**: mid-toggle reversal is smooth, chevron and panel share one timing, reduced motion snaps, and the old keyframes are gone.
