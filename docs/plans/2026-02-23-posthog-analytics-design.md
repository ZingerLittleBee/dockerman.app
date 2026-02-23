# PostHog Analytics Redesign for Dockerman Website

**Date:** 2026-02-23
**Scope:** dockerman.app marketing website only (not desktop app)
**Approach:** Dashboard rebuild + supplemental event tracking (Plan B)

## Current State

- 14 custom events in code, but only 2 have ever fired in PostHog (low traffic)
- 5 dashboards with ~30 insights, mostly empty data or overlapping
- PostHog auto-captures: `$pageview`, `$pageleave`, `$web_vitals`, `$autocapture`, `$rageclick`
- Missing: pricing page tracking, scroll depth, checkout funnel, Web Vitals dashboards
- Website and desktop app events mixed in same project (out of scope for now)

## Design

### Dashboard Architecture

Delete all 5 existing dashboards (`1128141`, `1173831`, `1184100`-`1184103`) and their insights. Rebuild as 4 focused dashboards:

| Dashboard | Purpose |
|-----------|---------|
| Traffic | Macro traffic health: UV/PV trends, sources, geo, devices |
| Behavior | User actions: top pages, paths, scroll depth, engagement, clicks |
| Conversion | Business metrics: download funnel, pricing funnel, CTA comparison |
| Performance | Technical quality: Web Vitals (LCP/CLS/INP), error rates by device |

### New Events (6 total)

#### `pricing_plan_viewed`
- **Trigger:** Pricing page loads
- **Properties:** `locale`
- **Purpose:** Top of pricing funnel

#### `pricing_plan_selected`
- **Trigger:** Click Buy/purchase button on pricing page
- **Properties:** `plan` (1-device | 3-devices), `locale`
- **Purpose:** Middle of pricing funnel

#### `pricing_faq_expanded`
- **Trigger:** FAQ accordion expand on pricing page
- **Properties:** `question`, `faq_index`
- **Purpose:** Understand objections in purchase decision

#### `page_scroll_depth`
- **Trigger:** Page scroll reaches 25% / 50% / 75% / 100%
- **Properties:** `depth` (25 | 50 | 75 | 100), `page_path`
- **Implementation:** Throttled — fire once per depth threshold per page load
- **Purpose:** Content engagement measurement

#### `page_engaged`
- **Trigger:** User stays on page >10s AND has at least one interaction (click/scroll/keypress)
- **Properties:** `page_path`, `duration_seconds`
- **Implementation:** setTimeout + interaction listener combo
- **Purpose:** Distinguish real readers from bounces

#### `checkout_redirected`
- **Trigger:** `/api/checkout` API route processes successfully
- **Properties:** `plan`, `locale`
- **Implementation:** Server-side PostHog capture in the API route
- **Purpose:** Confirm checkout funnel completion on our side

### Insight Specifications

#### Dashboard 1: Traffic (7 insights)

1. **Daily UV** — Trends line, `$pageview` DAU, 30d
2. **Daily PV** — Trends line, `$pageview` total, 30d
3. **Weekly UV** — Trends line, `$pageview` WAU, 90d
4. **Referring Domain** — Trends bar, `$pageview` DAU, breakdown by `$referring_domain`
5. **UTM Source** — Trends bar, `$pageview` total, breakdown by `$utm_source`
6. **Geography** — Trends world map, `$pageview` DAU, breakdown by `$geoip_country_code`
7. **Device/Browser** — Trends pie, `$pageview` DAU, breakdown by `$device_type`

#### Dashboard 2: Behavior (7 insights)

1. **Top Pages** — Trends bar, `$pageview` total, breakdown by `$pathname`
2. **User Paths** — Paths visualization, starting from homepage
3. **Scroll Depth** — Trends bar, `page_scroll_depth`, breakdown by `depth`
4. **Page Engagement** — Trends line, `page_engaged` total, 30d
5. **Nav Clicks** — Trends bar, `nav_link_clicked`, breakdown by `link_text`
6. **FAQ Hot Questions** — Trends bar, `faq_item_expanded`, breakdown by `question`
7. **Locale Preference** — Trends pie, `locale_changed`, breakdown by `to_locale`

#### Dashboard 3: Conversion (6 insights)

1. **Visit→Download Funnel** — Funnel: `$pageview` → `hero_cta_clicked` OR `navbar_download_clicked` → `download_button_clicked`
2. **Pricing→Checkout Funnel** — Funnel: `pricing_plan_viewed` → `pricing_plan_selected` → `checkout_redirected`
3. **CTA Comparison** — Trends bar: hero_cta / navbar_download / cta_download side by side
4. **Platform Downloads** — Trends pie, `download_button_clicked`, breakdown by `platform`
5. **Homebrew vs Direct** — Trends pie, `homebrew_command_copied` vs `download_button_clicked`
6. **Pricing FAQ** — Trends bar, `pricing_faq_expanded`, breakdown by `question`

#### Dashboard 4: Performance (4 insights)

1. **LCP Trend** — Trends line, `$web_vitals`, property filter on LCP
2. **CLS Trend** — Trends line, `$web_vitals`, property filter on CLS
3. **INP Trend** — Trends line, `$web_vitals`, property filter on INP
4. **Performance by Device** — Trends bar, `$web_vitals` LCP, breakdown by `$device_type`

### What We Are NOT Doing

- No `posthog.identify()` — traffic too low for user-level analytics
- No Session Replay — conserves quota, low traffic makes replay less valuable
- No Feature Flags / A/B testing — premature for current stage
- No desktop app analytics changes — out of scope
- No custom Group Analytics — single-product, no multi-tenant needs

### Implementation Notes

- `page_scroll_depth`: use IntersectionObserver or scroll % calculation with a Set to track fired thresholds
- `page_engaged`: combine `setTimeout(10000)` with `hasInteracted` boolean from click/scroll listeners
- `checkout_redirected`: requires `posthog-node` server-side SDK in the API route, OR a simpler approach of firing from the client before redirect
- All new client events use deferred `posthog` import pattern matching `SnapshotPlaygroundScroll.tsx`
- Existing event naming convention (`snake_case`) preserved
