# 008 — Add press feedback to interactive controls

- **Status**: DONE (commit 3957021)
- **Commit**: 7955cd6
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: ~10 files, one class-string edit per control (~18 sites)

## Problem

No element on the site has any `:active` press state (grep for `active:` across `apps/landing/src` and `packages/shared/src` returns zero Tailwind active-variants). Buttons, tabs, and copy controls respond to hover but give nothing back at the moment of the click — the interface feels inert exactly when the user acts on it.

Reference values (from the audit playbook): press feedback is `transform: scale(0.97)` on `:active`, transitioned over 100–160ms with ease-out; keep it subtle (0.95–0.98).

## Target

Uniform recipe applied per control:

1. Add `active:scale-[0.97]` to the element's className.
2. Ensure `transform` is in the element's transition property list (extend `transition-colors` to `transition-[color,background-color,border-color,transform]`; elements already transitioning transform need no change).
3. If the element has a hover translate (`hover:-translate-y-px` / `hover:translate-x-[2px]`), also add `active:translate-y-0` / `active:translate-x-0` so the press replaces the lift instead of fighting it.

Press feedback stays on under reduced motion (it is comprehension feedback, gentle, and user-initiated) — do NOT add `motion-reduce` gates here.

Note on drift: plan 006 rewrites several of these elements' `transition-*` utilities. If it has already run, the fragments below will differ — that is expected; keep 006's property list, append `transform` to it if missing, and add the `active:` classes. Any OTHER mismatch: STOP and report.

## Repo conventions to follow

- Styling is Tailwind utilities inline in the component; no shared CSS class, no new files.
- DESIGN.md §3.3 settles hover (1px lift, never scale) — press (`:active`) is a separate state and may scale.

## Steps

For each control, apply the Target recipe. Locations and current identifying fragments at commit 7955cd6:

1. `apps/landing/src/components/landing/Hero.tsx:122` — gradient download Link (`transition-all hover:-translate-y-px`): add `active:translate-y-0 active:scale-[0.97]`, ensure transform transitioned.
2. `apps/landing/src/components/landing/Hero.tsx:151` — copy-install button (`transition-colors hover:border-dm-line-strong`): extend transition list, add `active:scale-[0.97]`.
3. `apps/landing/src/components/landing/CtaFinal.tsx:44` — primary CTA (`transition-all hover:-translate-y-px`): as site 1.
4. `apps/landing/src/components/landing/CtaFinal.tsx:73` — secondary CTA link: extend transition list, add `active:scale-[0.97]`.
5. `apps/landing/src/components/shell/Navbar.tsx:94` — download Link (`transition-transform hover:-translate-y-px`): add `active:translate-y-0 active:scale-[0.97]`.
6. `apps/landing/src/components/shell/Navbar.tsx:103` — mobile menu toggle (`transition-colors hover:border-dm-line-strong`): extend transition list, add `active:scale-[0.97]`.
7. `apps/landing/src/components/ThemeSwitch.tsx:68` — radio items (`transition-colors hover:text-dm-ink`): extend transition list, add `active:scale-[0.97]`.
8. `apps/landing/src/components/shell/LocaleSwitch.tsx:55` — globe trigger (`transition-colors hover:bg-dm-bg-soft`): extend transition list, add `active:scale-[0.97]`.
9. `apps/landing/src/components/shell/LocaleSwitch.tsx` — locale menu items (the `role="menuitem"` buttons, `transition-colors`): extend transition list, add `active:scale-[0.97]`.
10. `apps/landing/src/components/snapshot/SnapshotShowcase.tsx:223` — mobile tab chips (`transition-colors`): extend transition list, add `active:scale-[0.97]`.
11. `apps/landing/src/components/snapshot/SnapshotShowcase.tsx:349` — RailItem (`transition-colors`): extend transition list, add `active:scale-[0.97]`.
12. `apps/landing/src/components/snapshot/SnapshotShowcase.tsx:450` — TopbarBtn prev/next/zoom (`transition-colors`): extend transition list, add `active:scale-[0.97]`.
13. `apps/landing/src/components/snapshot/SnapshotShowcase.tsx:614` and `:633` — CaptionStrip docs link and copy-link button (`transition-colors`): extend transition list, add `active:scale-[0.97]`.
14. `apps/landing/src/components/snapshot/SnapshotShowcase.tsx:684` — Lightbox close button (no transition today): add `transition-transform active:scale-[0.97]`.
15. `apps/landing/src/components/download/HomebrewCopyButton.tsx:20` — copy row (`transition-colors hover:border-dm-line-strong`): extend transition list, add `active:scale-[0.97]`.
16. `apps/landing/src/components/download/PlatformCard.tsx:104` — asset rows (`hover:translate-x-[2px]`): add `active:translate-x-0 active:scale-[0.97]`, ensure transform transitioned.
17. `apps/landing/src/components/pricing/PlanCard.tsx:52` — `ctaClassName` base string: add `active:scale-[0.97]` (primary variant also gets `active:translate-y-0`).
18. `apps/landing/src/app/[locale]/(main)/pricing/page.tsx:264` and `:288` — final CTA button/link: add `active:scale-[0.97]`, ensure transform transitioned.

## Boundaries

- Do NOT add press feedback to plain text navigation links (Navbar LINKS, footer links, TOC links) or to `AccordionTrigger` (a full-width text row — scaling it reads as layout wobble).
- Do NOT add it to the SnapshotShowcase `Stage` zoom button (`:487`) — it is a full-bleed screenshot surface; scaling it looks like a glitch, not feedback.
- Do NOT change hover behavior, colors, or markup.
- Do NOT introduce a shared CSS class or new dependency — utilities per element only.

## Verification

- **Mechanical**: `bun run check` passes; `cd apps/landing && bun run build` succeeds. Grep proof: `grep -rn "active:scale" apps/landing/src --include='*.tsx' --include='*.ts' | wc -l` ≥ 17.
- **Feel check**: `bun run dev:landing`:
  - Press and HOLD the hero download CTA: it sinks to 97% and stays there; release: it returns smoothly (~150ms, no snap). The sink must replace the hover lift, not stack under it.
  - Click the Homebrew copy row and a snapshot rail item on a touch device or with DevTools device emulation: the press is visible on tap.
  - Rapid-click a TopbarBtn arrow 5×: feedback tracks every press without stutter (transitions retarget).
- **Done when**: every listed control visibly sinks on press, nothing in the Boundaries list scales, and hover behavior is unchanged.
