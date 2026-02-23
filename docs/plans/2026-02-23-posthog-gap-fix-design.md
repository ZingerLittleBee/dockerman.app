# PostHog Gap Fix — Web Vitals + Missing Event Tracking

**Date:** 2026-02-23
**Scope:** Fix Web Vitals config + add 4 missing event trackings + update Behavior dashboard

## What's Being Fixed

### 1. Web Vitals Configuration

Performance dashboard (1300761) has 4 insights (LCP/CLS/INP trends, LCP by device) that depend on `$web_vitals` events. The current `instrumentation-client.ts` does not explicitly enable `capture_performance`, relying on remote config fallback which is unreliable.

**Fix:** Add `capture_performance: { web_vitals: true }` to PostHog init config.

### 2. New Events (4 total)

#### `about_social_clicked`
- **Trigger:** Click any social link on About page (4 links total)
- **Properties:** `platform` (github | twitter), `section` (team_member | join_us), `url`
- **File:** `src/app/[locale]/about/page.tsx`

#### `faq_issues_link_clicked`
- **Trigger:** Click "Open Issues" link in FAQ section
- **Properties:** `url`
- **File:** `src/components/ui/Faqs.tsx`

#### `footer_theme_changed`
- **Trigger:** Theme switch via footer ThemeSwitch component
- **Properties:** `from_theme`, `to_theme`, `location: 'footer'`
- **File:** `src/components/ThemeSwitch.tsx`

#### `mobile_menu_toggled`
- **Trigger:** Click hamburger menu button on mobile
- **Properties:** `action` (open | close)
- **File:** `src/components/ui/Navbar.tsx`

### 3. Dashboard Update

Behavior dashboard (1300759) — add 1 new insight:
- **About 社交点击** — Trends bar, `about_social_clicked`, breakdown by `platform`

### What We're NOT Doing

- CopyToClipboard tracking — component is unused in the codebase
- Lightbox zoom/close tracking — low-value interaction, core behavior already covered by `feature_tab_switched`
- All events use deferred `import('posthog-js')` pattern for bundle optimization
