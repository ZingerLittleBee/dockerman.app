# Kubernetes Landing Page Section Design

## Overview

Add a dedicated Kubernetes support section to the landing page to highlight the new K8s management capability. The section sits between the Hero and Globe sections, using a dark full-width centered layout with a screenshot and feature highlight cards.

## Location

Between `<Hero>` and `<GlobalLazy />` in `apps/landing/src/app/[locale]/(main)/page.tsx`.

## Visual Design

### Layout

- **Background:** `bg-gray-950` (dark), full-width, consistent with the Globe section style
- **Content:** Centered, max-width `max-w-6xl`
- **Padding:** `py-24` (desktop), `py-16` (mobile)
- **Border radius:** `rounded-3xl` on the outer container (matching Globe section)

### Component Stack (top to bottom)

1. **Badge** — Reuse the existing inline badge pattern from Globe section (indigo gradient text, `border-indigo-400/20`, `bg-indigo-800/20`, uppercase). Text: i18n key `kubernetes.badge` ("Kubernetes Support").

2. **Title** — Large gradient text (`bg-gradient-to-b from-white to-indigo-100`, `text-5xl md:text-7xl`, `font-bold`, `tracking-tighter`). Text: i18n key `kubernetes.title` / `kubernetes.titleBreak`.

3. **Description** — Secondary text (`text-gray-400`, `text-lg`, max-width ~`max-w-xl`, centered). Text: i18n key `kubernetes.description`.

4. **Screenshot** — `kubernetes.png` displayed using Next.js `<Image>` component. Wrapped in a container with `rounded-xl`, `border border-gray-800/50`, `shadow-xl shadow-black/40`. Responsive width (`max-w-4xl`). Priority: false (not above the fold). Quality: 80. Formats: AVIF/WebP.

5. **Feature Cards** — 3-column grid (`grid-cols-1 md:grid-cols-3`), `gap-4`, `max-w-4xl`. Each card:
   - Background: `bg-gray-900/80`, `border border-gray-800`, `rounded-xl`, `p-6`
   - Icon: emoji or Remix icon
   - Title: `text-white font-semibold`
   - Description: `text-gray-400 text-sm`

### Feature Cards Content

| Card | i18n key prefix | Title (en) | Description (en) |
|------|----------------|------------|-------------------|
| 1 | `kubernetes.features.clusterOverview` | Cluster Overview | Monitor nodes, pods, and events across your entire cluster at a glance. |
| 2 | `kubernetes.features.workloads` | Workloads Management | Manage Pods, Deployments, StatefulSets, and CronJobs with full lifecycle control. |
| 3 | `kubernetes.features.serviceNetwork` | Service & Network | Visualize and manage Services, Ingresses, and Endpoints for your cluster networking. |

## Animation

GSAP ScrollTrigger with staggered fade-in-up:

- Badge: `opacity: 0 → 1`, `y: 20 → 0`, triggered when section enters viewport
- Title: same, slight delay
- Description: same, slight delay
- Screenshot: same, slight delay
- Feature cards: same, slight delay (all 3 together or staggered)

Use `useGSAP` hook and `gsap.registerPlugin(ScrollTrigger)` consistent with existing components (Hero, Globe).

## Responsive Behavior

| Breakpoint | Behavior |
|-----------|----------|
| Mobile (<768px) | Single column, cards stack vertically, screenshot full-width with horizontal margin |
| Desktop (>=768px) | 3-column card grid, screenshot centered with max-width |

## Internationalization

Add `kubernetes` key to all 4 locale files (`en.json`, `zh.json`, `ja.json`, `es.json`) under `packages/shared/src/locales/`.

Structure:
```json
{
  "kubernetes": {
    "badge": "Kubernetes Support",
    "title": "Master Your",
    "titleBreak": "Kubernetes Cluster",
    "description": "From node monitoring to service orchestration, manage all your K8s resources with an intuitive desktop interface.",
    "features": {
      "clusterOverview": {
        "name": "Cluster Overview",
        "description": "Monitor nodes, pods, and events across your entire cluster at a glance."
      },
      "workloads": {
        "name": "Workloads Management",
        "description": "Manage Pods, Deployments, StatefulSets, and CronJobs with full lifecycle control."
      },
      "serviceNetwork": {
        "name": "Service & Network",
        "description": "Visualize and manage Services, Ingresses, and Endpoints for your cluster networking."
      }
    }
  }
}
```

## File Changes

| File | Action |
|------|--------|
| `apps/landing/src/components/ui/Kubernetes.tsx` | **Create** — New client component with GSAP animations |
| `apps/landing/src/components/ui/KubernetesLazy.tsx` | **Create** — Lazy wrapper with `next/dynamic` (matching existing pattern like `GlobalLazy`) |
| `apps/landing/src/app/[locale]/(main)/page.tsx` | **Edit** — Insert `<KubernetesLazy />` between `<Hero>` and `<GlobalLazy />` |
| `packages/shared/src/locales/en.json` | **Edit** — Add `kubernetes` section |
| `packages/shared/src/locales/zh.json` | **Edit** — Add `kubernetes` section (Chinese) |
| `packages/shared/src/locales/ja.json` | **Edit** — Add `kubernetes` section (Japanese) |
| `packages/shared/src/locales/es.json` | **Edit** — Add `kubernetes` section (Spanish) |

## Component Architecture

```
page.tsx
├── Hero + HeroImage
├── KubernetesLazy (new)
│   └── Kubernetes (client component, 'use client')
│       ├── Badge (inline, matching Globe pattern)
│       ├── Title (gradient h2)
│       ├── Description (p)
│       ├── Image (next/image, kubernetes.png)
│       └── Feature Cards (3x grid)
├── GlobalLazy
├── SnapshotPlaygroundLazy
├── Features
├── FaqsLazy
└── CtaSectionLazy
```

## Dependencies

No new dependencies. Uses existing:
- `gsap` + `@gsap/react` (ScrollTrigger)
- `next/image`
- `@repo/shared/i18n/client` (useTranslation)
- `next/dynamic` (lazy loading)
