# PostHog Analytics Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild PostHog dashboards and add 6 new tracking events to provide comprehensive website analytics for Dockerman.

**Architecture:** Two phases — Phase 1 creates reusable tracking hooks and adds event capture code to existing pages. Phase 2 uses PostHog MCP API to delete old dashboards and create 4 new ones with 24 insights. Client-side events use deferred `import('posthog-js')` pattern for bundle size optimization.

**Tech Stack:** Next.js 16, React 19, PostHog JS SDK (already installed), PostHog MCP API for dashboard operations.

---

## Phase 1: Code Changes (New Event Tracking)

### Task 1: Create scroll depth tracking hook

**Files:**
- Create: `src/hooks/useScrollDepth.ts`

**Step 1: Create the hook file**

```typescript
'use client'

import { useEffect } from 'react'

const THRESHOLDS = [25, 50, 75, 100] as const

export function useScrollDepth() {
  useEffect(() => {
    const fired = new Set<number>()
    const pagePath = window.location.pathname

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return

      const scrollPercent = (window.scrollY / scrollHeight) * 100

      for (const threshold of THRESHOLDS) {
        if (scrollPercent >= threshold && !fired.has(threshold)) {
          fired.add(threshold)
          import('posthog-js').then(({ default: posthog }) => {
            posthog.capture('page_scroll_depth', {
              depth: threshold,
              page_path: pagePath
            })
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
}
```

**Step 2: Verify build**

Run: `cd /Users/zingerbee/conductor/workspaces/dockerman-website/lome && bun run check`
Expected: PASS (no lint errors)

**Step 3: Commit**

```bash
git add src/hooks/useScrollDepth.ts
git commit -m "feat: add scroll depth tracking hook"
```

---

### Task 2: Create page engagement tracking hook

**Files:**
- Create: `src/hooks/usePageEngaged.ts`

**Step 1: Create the hook file**

```typescript
'use client'

import { useEffect } from 'react'

const ENGAGE_THRESHOLD_MS = 10_000

export function usePageEngaged() {
  useEffect(() => {
    let hasInteracted = false
    let hasFired = false
    const pagePath = window.location.pathname
    const startTime = Date.now()

    const markInteracted = () => {
      hasInteracted = true
    }

    const tryFire = () => {
      if (hasFired || !hasInteracted) return
      const elapsed = Date.now() - startTime
      if (elapsed < ENGAGE_THRESHOLD_MS) return

      hasFired = true
      import('posthog-js').then(({ default: posthog }) => {
        posthog.capture('page_engaged', {
          page_path: pagePath,
          duration_seconds: Math.round(elapsed / 1000)
        })
      })
    }

    window.addEventListener('click', markInteracted, { passive: true, once: true })
    window.addEventListener('scroll', markInteracted, { passive: true, once: true })
    window.addEventListener('keydown', markInteracted, { passive: true, once: true })

    const timer = setTimeout(() => {
      tryFire()
      // If no interaction yet, wait for the first one
      if (!hasInteracted) {
        const onLateInteract = () => {
          tryFire()
          cleanup()
        }
        window.addEventListener('click', onLateInteract, { passive: true, once: true })
        window.addEventListener('scroll', onLateInteract, { passive: true, once: true })
        window.addEventListener('keydown', onLateInteract, { passive: true, once: true })

        var cleanup = () => {
          window.removeEventListener('click', onLateInteract)
          window.removeEventListener('scroll', onLateInteract)
          window.removeEventListener('keydown', onLateInteract)
        }
      }
    }, ENGAGE_THRESHOLD_MS)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('click', markInteracted)
      window.removeEventListener('scroll', markInteracted)
      window.removeEventListener('keydown', markInteracted)
    }
  }, [])
}
```

**Step 2: Verify build**

Run: `cd /Users/zingerbee/conductor/workspaces/dockerman-website/lome && bun run check`
Expected: PASS

**Step 3: Commit**

```bash
git add src/hooks/usePageEngaged.ts
git commit -m "feat: add page engagement tracking hook"
```

---

### Task 3: Create analytics wrapper component for global hooks

**Files:**
- Create: `src/components/AnalyticsTracker.tsx`
- Modify: `src/app/[locale]/layout.tsx`

**Step 1: Create the AnalyticsTracker component**

This client component wraps the two hooks so they can be used in the server-rendered layout.

```typescript
'use client'

import { usePageEngaged } from '@/hooks/usePageEngaged'
import { useScrollDepth } from '@/hooks/useScrollDepth'

export function AnalyticsTracker() {
  useScrollDepth()
  usePageEngaged()
  return null
}
```

**Step 2: Add AnalyticsTracker to the locale layout**

In `src/app/[locale]/layout.tsx`, add the import and render the component inside the layout:

```diff
 import { siteConfig } from '@/app/siteConfig'
+import { AnalyticsTracker } from '@/components/AnalyticsTracker'
 import { I18nProvider } from '@/components/I18nProvider'
 ...
   return (
     <I18nProvider locale={locale}>
+      <AnalyticsTracker />
       <Navigation />
       {children}
       <Footer />
     </I18nProvider>
   )
```

**Step 3: Verify build**

Run: `cd /Users/zingerbee/conductor/workspaces/dockerman-website/lome && bun run check`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/AnalyticsTracker.tsx src/app/\[locale\]/layout.tsx
git commit -m "feat: integrate scroll depth and page engagement tracking"
```

---

### Task 4: Add pricing page event tracking

**Files:**
- Modify: `src/app/[locale]/pricing/page.tsx`
- Modify: `src/components/ui/PricingCard.tsx`

**Step 1: Add `pricing_plan_viewed` and `pricing_faq_expanded` to pricing page**

In `src/app/[locale]/pricing/page.tsx`:

1. Add a `useEffect` to fire `pricing_plan_viewed` on mount
2. Add an `onValueChange` callback to the FAQ Accordion to fire `pricing_faq_expanded`

At the top of the `Pricing()` function (after existing hooks):

```typescript
useEffect(() => {
  import('posthog-js').then(({ default: posthog }) => {
    posthog.capture('pricing_plan_viewed', { locale })
  })
}, [locale])
```

On the `<Accordion>` component, add `onValueChange`:

```tsx
<Accordion
  className="mt-8"
  onValueChange={(values: string[]) => {
    if (values.length > 0) {
      const lastValue = values[values.length - 1]
      const faqIndex = faqs.findIndex((f) => f.question === lastValue)
      import('posthog-js').then(({ default: posthog }) => {
        posthog.capture('pricing_faq_expanded', {
          question: lastValue,
          faq_index: faqIndex
        })
      })
    }
  }}
  type="multiple"
>
```

**Step 2: Add `pricing_plan_selected` to PricingCard**

In `src/components/ui/PricingCard.tsx`:

1. Add `plan` prop to the interface (optional string)
2. Fire event on CTA link click

Add to interface:

```typescript
interface PricingCardProps {
  // ... existing props
  plan?: string
}
```

Add `plan` to destructured props. Modify the CTA `<a>` tag:

```tsx
<a
  aria-label={`${ctaText} - ${title}`}
  href={ctaHref}
  onClick={() => {
    if (plan) {
      import('posthog-js').then(({ default: posthog }) => {
        posthog.capture('pricing_plan_selected', { plan })
      })
    }
  }}
  rel="noopener noreferrer"
  target="_blank"
>
```

**Step 3: Pass `plan` prop from pricing page**

In `src/app/[locale]/pricing/page.tsx`, add `plan` prop to the two paid PricingCard instances:

```tsx
<PricingCard
  // ... existing props for 3 DEVICES
  plan="3-devices"
/>

<PricingCard
  // ... existing props for 1 DEVICE
  plan="1-device"
/>
```

**Step 4: Verify build**

Run: `cd /Users/zingerbee/conductor/workspaces/dockerman-website/lome && bun run check`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/\[locale\]/pricing/page.tsx src/components/ui/PricingCard.tsx
git commit -m "feat: add pricing page analytics (plan viewed, selected, FAQ)"
```

---

### Task 5: Add checkout_redirected server-side event

**Files:**
- Modify: `src/app/api/checkout/route.ts`

**Step 1: Add PostHog capture via API call in the checkout route**

After the successful checkout redirect is about to be returned, capture the event using PostHog's HTTP API (no extra dependency needed). Insert this before the `return NextResponse.redirect(checkout.checkout_url)` line:

```typescript
// Fire checkout_redirected event via PostHog HTTP API
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
if (posthogKey) {
  fetch('https://us.i.posthog.com/capture/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: posthogKey,
      event: 'checkout_redirected',
      distinct_id: body.request_id,
      properties: { plan, locale }
    })
  }).catch(() => {
    // Non-blocking: don't fail checkout if analytics fails
  })
}
```

Note: This uses `body.request_id` (which is `${plan}-${Date.now()}`) as the `distinct_id`. This is an anonymous identifier since we don't have user identity. The event fires without blocking the redirect.

**Step 2: Verify build**

Run: `cd /Users/zingerbee/conductor/workspaces/dockerman-website/lome && bun run check`
Expected: PASS

**Step 3: Commit**

```bash
git add src/app/api/checkout/route.ts
git commit -m "feat: add checkout_redirected server-side PostHog event"
```

---

## Phase 2: PostHog Dashboard Operations (via MCP)

All tasks in this phase use PostHog MCP tools. No code changes.

### Task 6: Delete old dashboards

**Step 1:** Delete all 5 existing dashboards using `mcp__posthog__dashboard-delete`:
- `1128141` (My App Dashboard)
- `1173831` (Analytics basics)
- `1184100` (用户概览 User Overview)
- `1184101` (页面性能 Page Performance)
- `1184102` (转化分析 Conversion)
- `1184103` (用户参与 Engagement)

Note: This is a soft delete. Insights associated only with these dashboards will become orphaned but not deleted.

---

### Task 7: Create "流量概览 Traffic" dashboard and insights

**Step 1:** Create dashboard using `mcp__posthog__dashboard-create`:
- name: "流量概览 Traffic"
- description: "宏观流量健康度：UV/PV 趋势、来源分布、地理位置、设备浏览器"
- pinned: true

**Step 2:** Create 7 insights using `mcp__posthog__insight-create-from-query` and add to dashboard using `mcp__posthog__add-insight-to-dashboard`:

1. **每日独立访客 Daily UV**
   - TrendsQuery, series: `$pageview` (math: dau), interval: day, 30d, display: ActionsLineGraph

2. **每日页面浏览量 Daily PV**
   - TrendsQuery, series: `$pageview` (math: total), interval: day, 30d, display: ActionsLineGraph

3. **每周独立访客 Weekly UV**
   - TrendsQuery, series: `$pageview` (math: dau), interval: week, 90d, display: ActionsLineGraph

4. **访客来源 Referring Domain**
   - TrendsQuery, series: `$pageview` (math: dau), 30d, breakdown: `$referring_domain`, display: ActionsBarValue

5. **UTM 来源 UTM Source**
   - TrendsQuery, series: `$pageview` (math: total), 30d, breakdown: `utm_source`, display: ActionsBarValue

6. **地理分布 Geography**
   - TrendsQuery, series: `$pageview` (math: dau), 30d, breakdown: `$geoip_country_code`, display: WorldMap

7. **设备类型 Device Type**
   - TrendsQuery, series: `$pageview` (math: dau), 30d, breakdown: `$device_type`, display: ActionsPie

---

### Task 8: Create "用户行为 Behavior" dashboard and insights

**Step 1:** Create dashboard:
- name: "用户行为 Behavior"
- description: "用户行为分析：热门页面、浏览路径、滚动深度、参与度、点击分布"
- pinned: true

**Step 2:** Create 7 insights:

1. **热门页面 Top Pages**
   - TrendsQuery, series: `$pageview` (math: total), 30d, breakdown: `$pathname`, display: ActionsBarValue

2. **用户路径 User Paths**
   - PathsQuery, starting from `$pageview` (pathGroupings for locale variants)

3. **页面滚动深度 Scroll Depth**
   - TrendsQuery, series: `page_scroll_depth` (math: total), 30d, breakdown: `depth`, display: ActionsBarValue

4. **页面参与度 Page Engaged**
   - TrendsQuery, series: `page_engaged` (math: total), interval: day, 30d, display: ActionsLineGraph

5. **导航点击 Nav Clicks**
   - TrendsQuery, series: `nav_link_clicked` (math: total), 30d, breakdown: `link_text`, display: ActionsBarValue

6. **FAQ 热门问题 FAQ Hot Questions**
   - TrendsQuery, series: `faq_item_expanded` (math: total), 30d, breakdown: `question`, display: ActionsBarValue

7. **语言偏好 Locale Preference**
   - TrendsQuery, series: `locale_changed` (math: total), 30d, breakdown: `to_locale`, display: ActionsPie

---

### Task 9: Create "转化漏斗 Conversion" dashboard and insights

**Step 1:** Create dashboard:
- name: "转化漏斗 Conversion"
- description: "核心商业指标：下载漏斗、定价漏斗、CTA 效果对比、平台分布"
- pinned: true

**Step 2:** Create 6 insights:

1. **访问→下载漏斗 Visit to Download**
   - FunnelsQuery, ordered steps: `$pageview` → `hero_cta_clicked` → `download_button_clicked`, 30d

2. **定价→付费漏斗 Pricing to Checkout**
   - FunnelsQuery, ordered steps: `pricing_plan_viewed` → `pricing_plan_selected` → `checkout_redirected`, 30d

3. **CTA 效果对比 CTA Comparison**
   - TrendsQuery, 3 series: `hero_cta_clicked`, `navbar_download_clicked`, `cta_download_clicked`, 30d, display: ActionsBarValue

4. **平台下载分布 Platform Downloads**
   - TrendsQuery, series: `download_button_clicked` (math: total), 30d, breakdown: `platform`, display: ActionsPie

5. **Homebrew vs 直接下载**
   - TrendsQuery, 2 series: `homebrew_command_copied`, `download_button_clicked`, 30d, display: ActionsPie

6. **Pricing FAQ 问题**
   - TrendsQuery, series: `pricing_faq_expanded` (math: total), 30d, breakdown: `question`, display: ActionsBarValue

---

### Task 10: Create "网站性能 Performance" dashboard and insights

**Step 1:** Create dashboard:
- name: "网站性能 Performance"
- description: "Web Vitals 性能指标：LCP、CLS、INP 趋势及设备分布"
- pinned: true

**Step 2:** Create 4 insights:

1. **LCP 趋势 Largest Contentful Paint**
   - TrendsQuery, series: `$web_vitals` (math: avg, math_property: `$web_vitals_LCP_value`), interval: day, 30d, display: ActionsLineGraph

2. **CLS 趋势 Cumulative Layout Shift**
   - TrendsQuery, series: `$web_vitals` (math: avg, math_property: `$web_vitals_CLS_value`), interval: day, 30d, display: ActionsLineGraph

3. **INP 趋势 Interaction to Next Paint**
   - TrendsQuery, series: `$web_vitals` (math: avg, math_property: `$web_vitals_INP_value`), interval: day, 30d, display: ActionsLineGraph

4. **LCP 按设备分布 LCP by Device**
   - TrendsQuery, series: `$web_vitals` (math: avg, math_property: `$web_vitals_LCP_value`), 30d, breakdown: `$device_type`, display: ActionsBarValue

---

## Verification

After all tasks complete:

1. **Build check:** `bun run build` must succeed
2. **Lint check:** `bun run check` must pass
3. **Dev server test:** `bun run dev`, visit each page, check browser console for PostHog debug output showing new events
4. **PostHog verification:** Check PostHog Live Events view to confirm new events appear
5. **Dashboard verification:** Open each of the 4 new dashboards in PostHog and confirm all insights are present
