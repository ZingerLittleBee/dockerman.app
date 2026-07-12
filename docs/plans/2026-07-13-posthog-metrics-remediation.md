# PostHog Metrics Remediation Plan

## Goal

Make the website analytics trustworthy, privacy-safe, and understandable without
changing the desktop client's PostHog instrumentation or shared project-wide
collection settings.

## Research baseline

PostHog Web Analytics already provides the standard website metrics we need:
visitors, page views, sessions, session duration, bounce rate, traffic sources,
entry and exit paths, and device/browser/OS breakdowns. Custom dashboards should
therefore focus on Dockerman-specific behavior and conversion instead of
rebuilding every generic web metric.

PostHog Trends default to total event count. Unique-user metrics must be selected
explicitly when the question is about people rather than actions.

Creem's successful redirect contains checkout identifiers, but its official
production guidance recommends webhooks for authoritative payment completion.
The `checkout.completed` webhook is signed with HMAC-SHA256 using the raw request
body and the `creem-signature` header. Failed deliveries are retried.

Primary sources:

- [PostHog Web Analytics](https://posthog.com/docs/web-analytics/getting-started)
- [PostHog Trends aggregations](https://posthog.com/docs/product-analytics/trends/aggregations)
- [PostHog ecommerce events](https://posthog.com/docs/data/event-spec/ecommerce-events)
- [Creem webhooks](https://docs.creem.io/code/webhooks)

## Current problems

1. The shared PostHog project contains website and desktop events, while several
   dashboard insights did not identify the website source consistently.
2. The conversion dashboard only observes `checkout_redirected`. That is a
   checkout start, not a purchase, so it cannot report a real conversion rate.
3. The checkout route sends analytics with an unawaited `fetch`. A serverless
   invocation may finish before the request is delivered.
4. Checkout attempts use a timestamp-based request ID. It is not personal data,
   but an opaque random ID has clearer semantics and safer collision behavior.
5. The existing analytics design documents describe events that are no longer
   emitted, which caused stale or empty dashboard tiles.
6. Dashboard labels do not explain whether a value counts events, visitors, or
   successful purchases.

## Architecture

### Sources of truth

- Use PostHog Web Analytics for generic traffic statistics.
- Use custom PostHog dashboards for product-specific behavior and conversion.
- Use Vercel Speed Insights for Core Web Vitals and runtime performance.
- Use Creem's signed `checkout.completed` webhook as the source of truth for a
  completed purchase.

### Website event boundary

Every website-owned server event will include:

```text
source = website
$host = dockerman.app
$geoip_disable = true
```

These properties allow website dashboards to filter safely without changing any
desktop event or shared PostHog project setting.

### Conversion correlation

The checkout route will create one opaque UUID and use it as Creem's `request_id`
and PostHog's `distinct_id` for `checkout_redirected`. Creem checkout metadata
will carry only the selected plan and locale.

When Creem later sends `checkout.completed`, the verified webhook will capture
`purchase_completed` with the same request ID as its `distinct_id`. This enables
an aggregate checkout-start to purchase-complete funnel without browser identity,
email addresses, names, customer IDs, or device fingerprints.

### Delivery behavior

Checkout creation must never fail because analytics is unavailable. The route
will await PostHog delivery with a short timeout after Creem has created the
checkout, log a delivery failure without sensitive payload data, and still
redirect the customer.

The webhook will verify the signature before parsing or capturing an event. It
will acknowledge unrelated valid Creem events without analytics side effects.
PostHog's `$insert_id` will be derived from the opaque request ID so repeated
Creem deliveries are deduplicated. If PostHog does not accept a purchase event,
the webhook will return 503 so Creem's documented retry schedule can deliver it
again without producing a duplicate conversion.

## Privacy contract

Allowed PostHog properties:

| Property | Reason |
| --- | --- |
| `plan` | Aggregate product preference and conversion breakdown |
| `locale` | Aggregate language experience quality |
| `amount_minor` | Aggregate revenue without transaction identity |
| `currency` | Required interpretation for monetary values |
| `source` | Website/desktop isolation |
| `$host` | Website dashboard filter |
| `$geoip_disable` | Prevent IP-derived enrichment |
| `$insert_id` | Retry deduplication using an opaque checkout request ID |

Forbidden PostHog properties:

- Customer name or email
- Customer, order, checkout, or payment identifiers
- Billing address or country
- IP address or user agent added by application code
- Raw webhook payloads or signatures

The random checkout request ID is used only as a short-lived funnel correlation
key. It is not linked to the browser's persistent PostHog identity.

## Event definitions

### `checkout_redirected`

Meaning: Creem created a checkout and the website is redirecting the visitor to
it. Count this as a checkout start, never as a sale.

Properties: `plan`, `locale`, `source`, `$host`, `$geoip_disable`.

### `purchase_completed`

Meaning: Creem delivered a valid signed `checkout.completed` webhook whose order
status is paid.

Properties: `plan`, `locale`, `amount_minor`, `currency`, `source`, `$host`,
`$geoip_disable`, `$insert_id`.

### Existing behavior events

- `page_scroll_depth`: one event per reached 25/50/75/100 percent threshold.
- `page_engaged`: one event after at least 10 seconds plus an interaction.
- `about_social_clicked`: a social-link click on the About page.
- `footer_theme_changed`: a footer theme selection.

No new DOM autocapture or form-field capture is required.

## Dashboard remediation

Only the website dashboards will be changed. Shared project settings and desktop
dashboards are out of scope.

### Traffic

Keep page views, unique visitors, referrers, UTM fields, and device type. Add an
explanation card that points users to built-in Web Analytics for sessions, bounce
rate, duration, landing pages, and exit pages. All custom tiles must filter on
`$host = dockerman.app`.

### Behavior

Keep current emitted events only. Labels must state whether they count actions or
pages. All custom tiles must filter on `$host = dockerman.app`.

### Conversion

After production begins receiving `purchase_completed`, add:

1. Checkout starts, total and daily trend.
2. Checkout starts by plan.
3. Checkout start to purchase completion funnel.
4. Completed purchases by plan.
5. Revenue by currency, only when PostHog can aggregate `amount_minor` without
   mixing currencies.

Conversion server events must filter on `source = website`; they do not depend on
the browser `$host` property being inferred.

### Performance

Keep the explanatory card directing users to Vercel Speed Insights. Do not
duplicate Core Web Vitals with custom PostHog events.

## Public test seams

1. **Signed webhook parser**: a valid literal HMAC fixture produces a sanitized
   purchase event; invalid signatures, malformed bodies, and unpaid orders do not.
2. **Creem webhook HTTP route**: a valid `checkout.completed` request returns 200
   and submits only the allowed PostHog fields; an invalid signature returns 401
   and submits nothing; unrelated signed events return 200 and submit nothing.
3. **Checkout HTTP route**: Creem receives one opaque UUID plus `plan`/`locale`
   metadata; PostHog receives the same UUID with the website privacy properties;
   the route keeps its 303 redirect and remains successful when analytics fails.

Network boundaries may use the repository's existing fetch interception pattern;
cryptographic verification and payload sanitization are tested with real values,
not mocked implementations.

## Deployment steps

1. Deploy the website changes with `CREEM_WEBHOOK_SECRET` configured.
2. Register `https://dockerman.app/api/webhooks/creem` for
   `checkout.completed` in Creem Developers > Webhooks.
3. Send a Creem test webhook and confirm one privacy-safe
   `purchase_completed` event in PostHog Live Events.
4. Confirm a repeated delivery is deduplicated.
5. Build the conversion dashboard tiles only after the event schema is observed
   in production.
6. Re-check that desktop events and shared PostHog project settings are unchanged.
