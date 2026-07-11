# 002 — Disable Lenis smooth scrolling for reduced-motion users

- **Status**: DONE (commit d82fb14)
- **Commit**: 7955cd6
- **Severity**: HIGH
- **Category**: Accessibility
- **Estimated scope**: 1 file (LenisProvider.tsx), ~25 lines

## Problem

Lenis smooth scrolling is mounted app-wide with no `prefers-reduced-motion` handling. Lenis does not auto-disable for reduced motion, so users who asked the OS for less motion get inescapable scroll smoothing/inertia on every scroll of every page — the single highest-frequency motion on the site.

```tsx
// packages/shared/src/components/LenisProvider.tsx:1-18 — current (entire file)
'use client'

import { ReactLenis } from 'lenis/react'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true
      }}
      root
    >
      {children}
    </ReactLenis>
  )
}
```

Mounted at `apps/landing/src/app/[locale]/(main)/layout.tsx:18-25`.

## Target

When `(prefers-reduced-motion: reduce)` matches, render children with native scrolling (no `ReactLenis` at all). React to live changes of the media query.

```tsx
// packages/shared/src/components/LenisProvider.tsx — target (entire file)
'use client'

import { ReactLenis } from 'lenis/react'
import { useSyncExternalStore } from 'react'

function subscribeReducedMotion(listener: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', listener)
  return () => mq.removeEventListener('change', listener)
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function getServerReducedMotionSnapshot() {
  return false
}

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  )

  if (reduced) {
    return <>{children}</>
  }

  return (
    <ReactLenis
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true
      }}
      root
    >
      {children}
    </ReactLenis>
  )
}
```

## Repo conventions to follow

- The `useSyncExternalStore` + `matchMedia` reduced-motion pattern is the established convention — exemplar: `apps/landing/src/components/landing/PaletteViz.tsx:83-96` (`subscribeReducedMotion` / `getReducedMotionSnapshot` / `getServerReducedMotionSnapshot`).
- Server snapshot returns `false` (SSR renders the animated variant; the client corrects on hydration) — same as PaletteViz.

## Steps

1. Replace the entire contents of `packages/shared/src/components/LenisProvider.tsx` with the Target code above.

## Boundaries

- Do NOT touch `apps/landing/src/app/[locale]/(main)/layout.tsx` — the provider stays mounted; it self-disables.
- Do NOT change the Lenis options (`lerp`, `duration`, `smoothWheel`) for the non-reduced path.
- Do NOT add new dependencies.
- If the file differs from the excerpt above (drift since commit 7955cd6), STOP and report.

## Verification

- **Mechanical**: `bun run check` passes; `cd apps/landing && bunx tsc --noEmit` passes.
- **Feel check**: `bun run dev:landing`, open / in Chrome:
  - DevTools → Rendering panel → "Emulate CSS media feature prefers-reduced-motion: reduce" → scroll with the wheel: scrolling is native and immediate, no inertia/lerp tail.
  - Turn emulation off, reload → scrolling is smooth again (Lenis active).
  - Toggle the emulation WITHOUT reloading → behavior switches live (the `change` listener works).
- **Done when**: both scroll behaviors are observable under emulation toggle and no hydration warning appears in the console.
