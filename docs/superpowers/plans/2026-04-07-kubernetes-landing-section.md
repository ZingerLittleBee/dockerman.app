# Kubernetes Landing Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Kubernetes support showcase section to the landing page between Hero and Globe, with dark full-width layout, screenshot, feature cards, and GSAP scroll animations.

**Architecture:** New `Kubernetes` client component with GSAP ScrollTrigger animations, lazy-loaded via `next/dynamic`. Inserted into the main page between Hero and GlobalLazy. All text internationalized across 4 locales.

**Tech Stack:** Next.js (App Router), GSAP + @gsap/react, next/image, next/dynamic, @repo/shared/i18n

**Spec:** `docs/superpowers/specs/2026-04-07-kubernetes-landing-section-design.md`

---

### Task 1: Add i18n translations for all 4 locales

**Files:**
- Modify: `packages/shared/src/locales/en.json:294` (insert after `"global"` block closing `},`)
- Modify: `packages/shared/src/locales/zh.json:294` (same position)
- Modify: `packages/shared/src/locales/ja.json:294` (same position)
- Modify: `packages/shared/src/locales/es.json:294` (same position)

- [ ] **Step 1: Add English translations**

In `packages/shared/src/locales/en.json`, insert after line 294 (`},` closing the `"global"` block), before `"privacy"`:

```json
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
  },
```

- [ ] **Step 2: Add Chinese translations**

In `packages/shared/src/locales/zh.json`, insert at the same position (after `"global"` block, before `"privacy"`):

```json
  "kubernetes": {
    "badge": "Kubernetes 支持",
    "title": "掌控你的",
    "titleBreak": "Kubernetes 集群",
    "description": "从节点监控到服务编排，用直观的桌面界面管理你的所有 K8s 资源。",
    "features": {
      "clusterOverview": {
        "name": "集群概览",
        "description": "一目了然地监控集群中的节点、Pod 和事件。"
      },
      "workloads": {
        "name": "工作负载管理",
        "description": "全面管理 Pod、Deployment、StatefulSet 和 CronJob 的完整生命周期。"
      },
      "serviceNetwork": {
        "name": "服务与网络",
        "description": "可视化管理集群中的 Service、Ingress 和 Endpoints 网络。"
      }
    }
  },
```

- [ ] **Step 3: Add Japanese translations**

In `packages/shared/src/locales/ja.json`, same position:

```json
  "kubernetes": {
    "badge": "Kubernetes サポート",
    "title": "Kubernetes クラスターを",
    "titleBreak": "完全に掌握",
    "description": "ノード監視からサービスオーケストレーションまで、直感的なデスクトップインターフェースですべての K8s リソースを管理。",
    "features": {
      "clusterOverview": {
        "name": "クラスター概要",
        "description": "クラスター全体のノード、Pod、イベントを一目で監視します。"
      },
      "workloads": {
        "name": "ワークロード管理",
        "description": "Pod、Deployment、StatefulSet、CronJob をライフサイクル全体で管理します。"
      },
      "serviceNetwork": {
        "name": "サービス & ネットワーク",
        "description": "クラスターネットワークの Service、Ingress、Endpoints を可視化・管理します。"
      }
    }
  },
```

- [ ] **Step 4: Add Spanish translations**

In `packages/shared/src/locales/es.json`, same position:

```json
  "kubernetes": {
    "badge": "Soporte Kubernetes",
    "title": "Domina Tu",
    "titleBreak": "Clúster Kubernetes",
    "description": "Desde la monitorización de nodos hasta la orquestación de servicios, gestiona todos tus recursos K8s con una interfaz de escritorio intuitiva.",
    "features": {
      "clusterOverview": {
        "name": "Vista del Clúster",
        "description": "Monitorea nodos, pods y eventos de todo tu clúster de un vistazo."
      },
      "workloads": {
        "name": "Gestión de Cargas",
        "description": "Gestiona Pods, Deployments, StatefulSets y CronJobs con control total del ciclo de vida."
      },
      "serviceNetwork": {
        "name": "Servicios y Red",
        "description": "Visualiza y gestiona Services, Ingresses y Endpoints de la red de tu clúster."
      }
    }
  },
```

- [ ] **Step 5: Commit**

```bash
git add packages/shared/src/locales/en.json packages/shared/src/locales/zh.json packages/shared/src/locales/ja.json packages/shared/src/locales/es.json
git commit -m "feat: add kubernetes section i18n translations for all 4 locales"
```

---

### Task 2: Create the Kubernetes component

**Files:**
- Create: `apps/landing/src/components/ui/Kubernetes.tsx`

**Reference:** Follow the patterns from `apps/landing/src/components/ui/Global.tsx` (client component, GSAP, useTranslation, badge style) and `apps/landing/src/components/ui/Hero.tsx` (useGSAP hook pattern).

- [ ] **Step 1: Create the Kubernetes component**

Create `apps/landing/src/components/ui/Kubernetes.tsx`:

```tsx
'use client'

import { useGSAP } from '@gsap/react'
import { useTranslation } from '@repo/shared/i18n/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useRef } from 'react'

export const Kubernetes = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      const items = gsap.utils.toArray<HTMLElement>('[data-k8s-animate]')
      items.forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: i * 0.1,
        })
      })
    },
    { scope: sectionRef }
  )

  const featureKeys = ['clusterOverview', 'workloads', 'serviceNetwork'] as const

  const features = featureKeys.map((key) => ({
    name: t(`kubernetes.features.${key}.name`),
    description: t(`kubernetes.features.${key}.description`),
  }))

  return (
    <div className="px-3">
      <section
        aria-labelledby="kubernetes-title"
        className="relative mx-auto mt-28 flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-3xl bg-gray-950 py-24 md:mt-40"
        ref={sectionRef}
      >
        {/* Badge */}
        <div
          className="inline-block rounded-lg border border-indigo-400/20 bg-indigo-800/20 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tight sm:text-sm"
          data-k8s-animate
        >
          <span className="bg-gradient-to-b from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            {t('kubernetes.badge')}
          </span>
        </div>

        {/* Title */}
        <h2
          className="mt-6 inline-block bg-gradient-to-b from-white to-indigo-100 bg-clip-text px-2 text-center font-bold text-5xl text-transparent tracking-tighter md:text-7xl"
          data-k8s-animate
          id="kubernetes-title"
        >
          {t('kubernetes.title')} <br /> {t('kubernetes.titleBreak')}
        </h2>

        {/* Description */}
        <p
          className="mt-6 max-w-xl px-4 text-center text-gray-400 text-lg"
          data-k8s-animate
        >
          {t('kubernetes.description')}
        </p>

        {/* Screenshot */}
        <div
          className="mt-12 w-full max-w-4xl px-6"
          data-k8s-animate
        >
          <div className="overflow-hidden rounded-xl border border-gray-800/50 shadow-xl shadow-black/40">
            <Image
              alt="Kubernetes cluster management interface"
              height={900}
              quality={80}
              src="/screenshots/kubernetes.png"
              width={1440}
              className="w-full"
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div
          className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-4 px-6 md:grid-cols-3"
          data-k8s-animate
        >
          {features.map((feature) => (
            <div
              className="rounded-xl border border-gray-800 bg-gray-900/80 p-6"
              key={feature.name}
            >
              <h3 className="font-semibold text-white">{feature.name}</h3>
              <p className="mt-2 text-gray-400 text-sm leading-6">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Verify file was created correctly**

Run: `head -5 apps/landing/src/components/ui/Kubernetes.tsx`
Expected: `'use client'` on line 1, imports on following lines.

- [ ] **Step 3: Commit**

```bash
git add apps/landing/src/components/ui/Kubernetes.tsx
git commit -m "feat: create Kubernetes landing section component"
```

---

### Task 3: Create the lazy wrapper and wire into page

**Files:**
- Create: `apps/landing/src/components/ui/KubernetesLazy.tsx`
- Modify: `apps/landing/src/app/[locale]/(main)/page.tsx`

**Reference:** Follow the exact pattern from `apps/landing/src/components/ui/GlobalLazy.tsx`.

- [ ] **Step 1: Create KubernetesLazy.tsx**

Create `apps/landing/src/components/ui/KubernetesLazy.tsx`:

```tsx
'use client'

import dynamic from 'next/dynamic'

const Kubernetes = dynamic(
  () => import('./Kubernetes').then((module) => ({ default: module.Kubernetes })),
  { ssr: false }
)

export default Kubernetes
```

- [ ] **Step 2: Add KubernetesLazy to the main page**

In `apps/landing/src/app/[locale]/(main)/page.tsx`, add the import and insert the component between `<Hero>` and `<GlobalLazy />`.

The file should become:

```tsx
import type { Locale } from '@repo/shared/i18n'
import CtaSectionLazy from '@/components/ui/CtaSectionLazy'
import FaqsLazy from '@/components/ui/FaqsLazy'
import Features from '@/components/ui/Features'
import GlobalLazy from '@/components/ui/GlobalLazy'
import Hero from '@/components/ui/Hero'
import HeroImage from '@/components/ui/HeroImage'
import KubernetesLazy from '@/components/ui/KubernetesLazy'
import SnapshotPlaygroundLazy from '@/components/ui/SnapshotPlaygroundLazy'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <main className="flex flex-col overflow-hidden">
      <Hero>
        <HeroImage />
      </Hero>
      <KubernetesLazy />
      <GlobalLazy />
      <SnapshotPlaygroundLazy />
      <Features locale={locale as Locale} />
      <div className="mx-auto mt-36 max-w-6xl px-3">
        <FaqsLazy />
      </div>
      <CtaSectionLazy />
    </main>
  )
}
```

- [ ] **Step 3: Verify the dev server compiles without errors**

Run: `cd apps/landing && npx next build --no-lint 2>&1 | tail -20` (or start dev server and check for compilation errors)

Expected: No build errors related to Kubernetes component.

- [ ] **Step 4: Commit**

```bash
git add apps/landing/src/components/ui/KubernetesLazy.tsx apps/landing/src/app/\\[locale\\]/\\(main\\)/page.tsx
git commit -m "feat: wire Kubernetes section into landing page between Hero and Globe"
```

---

### Task 4: Visual verification and final adjustments

**Files:**
- Possibly modify: `apps/landing/src/components/ui/Kubernetes.tsx` (if spacing/style adjustments needed)

- [ ] **Step 1: Start dev server and verify visually**

Run: `cd apps/landing && pnpm dev`

Open `http://localhost:3000` (or whatever port), scroll down past Hero section. Verify:
1. Kubernetes section appears between Hero and Globe
2. Dark background with rounded corners
3. Badge shows "Kubernetes Support" with indigo gradient
4. Title shows gradient text
5. Screenshot renders correctly
6. 3 feature cards display in a row on desktop
7. Scroll animations trigger on viewport entry

- [ ] **Step 2: Verify responsive layout**

Resize browser to mobile width (<768px). Verify:
1. Feature cards stack vertically (1 column)
2. Screenshot scales proportionally
3. Text remains readable and centered

- [ ] **Step 3: Verify i18n**

Navigate to `/zh`, `/ja`, `/es` locale routes. Verify translated text appears for badge, title, description, and feature cards.

- [ ] **Step 4: Commit any adjustments**

If any spacing/style tweaks were needed:

```bash
git add -u
git commit -m "fix: adjust Kubernetes section spacing and responsive layout"
```
