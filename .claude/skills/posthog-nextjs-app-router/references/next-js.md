# Next.js - Docs

PostHog makes it easy to get data about traffic and usage of your [Next.js](https://nextjs.org/) app. Integrating PostHog into your site enables analytics about user behavior, custom events capture, session recordings, feature flags, and more.

This guide walks you through integrating PostHog into your Next.js app using the [React](/docs/libraries/react.md) and the [Node.js](/docs/libraries/node.md) SDKs.

> You can see a working example of this integration in our [Next.js demo app](https://github.com/PostHog/posthog-js/tree/main/playground/nextjs).

Next.js has both client and server-side rendering, as well as pages and app routers. We'll cover all of these options in this guide.

## Prerequisites

To follow this guide along, you need:

1.  A PostHog instance (either [Cloud](https://app.posthog.com/signup) or [self-hosted](/docs/self-host.md))
2.  A Next.js application

## Beta: integration via LLM

Install PostHog for Next.js in seconds with our wizard by running this prompt with [LLM coding agents](/blog/envoy-wizard-llm-agent.md) like Cursor and Bolt, or by running it in your terminal.

prompt

PostHog AI

```prompt
npx -y @posthog/wizard@latest --region us
```

Or, to integrate manually, continue with the rest of this guide.

## Client-side setup

Install `posthog-js` using your package manager:

PostHog AI

### npm

```bash
npm install --save posthog-js
```

### Yarn

```bash
yarn add posthog-js
```

### pnpm

```bash
pnpm add posthog-js
```

### Bun

```bash
bun add posthog-js
```

Add your environment variables to your `.env.local` file and to your hosting provider (e.g. Vercel, Netlify, AWS). You can find your project API key in your [project settings](https://app.posthog.com/project/settings).

.env.local

PostHog AI

```shell
NEXT_PUBLIC_POSTHOG_KEY=<ph_project_api_key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

These values need to start with `NEXT_PUBLIC_` to be accessible on the client-side.

## Integration

Next.js 15.3+ provides the [`instrumentation-client.ts|js`](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client) file for a quick, lightweight setup. Add it to the root of your Next.js app (for both app and pages router) and initialize PostHog in it like this:

PostHog AI

### instrumentation-client.js

```javascript
import posthog from 'posthog-js'
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2025-11-30'
});
```

### instrumentation-client.ts

```typescript
import posthog from 'posthog-js'
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  defaults: '2025-11-30'
});
```

Using Next.js 15.2 or older?

Older versions of Next.js don't support the `instrumentation-client.ts|js` file. You can use the following setup instead:

## App router

If your Next.js app uses the [app router](https://nextjs.org/docs/app), you can integrate PostHog by creating a `providers` file in your app folder. This is because the `posthog-js` library needs to be initialized on the client-side using the Next.js [`'use client'` directive](https://nextjs.org/docs/app/getting-started/server-and-client-components).

PostHog AI

### JSX

```jsx
// app/providers.jsx
'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from '@posthog/react'
import { useEffect } from 'react'
export function PostHogProvider({ children }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: '2025-11-30',
    })
  }, [])
  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
```

### TSX

```jsx
// app/providers.tsx
'use client'
import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from '@posthog/react'
import { useEffect } from 'react'
export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        defaults: '2025-11-30',
      })
  }, [])
  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
```

Then, import the `PostHogProvider` component into your `app/layout` file and wrap your app with it.

PostHog AI

### JSX

```jsx
// app/layout.jsx
import './globals.css'
import { PostHogProvider } from './providers'
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
```

### TSX

```jsx
// app/layout.tsx
import './globals.css'
import { PostHogProvider } from './providers'
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  )
}
```

PostHog is now set up and ready to go. It will begin to autocapture events and pageviews. Files and components accessing PostHog on the client-side need the `'use client'` directive.

## Pages router

If you use the [pages router](https://nextjs.org/docs/pages), you can integrate PostHog at the root of your app in `pages/_app.js`.

JavaScript

PostHog AI

```javascript
// pages/_app.js
import { useEffect } from 'react'
import posthog from 'posthog-js'
import { PostHogProvider } from '@posthog/react'
export default function App({ Component, pageProps }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      defaults: '2025-11-30',
      // Enable debug mode in development
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug()
      }
    })
  }, [])
  return (
    <PostHogProvider client={posthog}>
      <Component {...pageProps} />
    </PostHogProvider>
  )
}
```

Bootstrapping with `instrumentation-client`

When using `instrumentation-client`, the values you pass to `posthog.init` remain fixed for the entire session. This means bootstrapping only works if you evaluate flags **before your app renders** (for example, on the server).

If you need flag values after the app has rendered, you’ll want to:

-   Evaluate the flag on the server and pass the value into your app, or
-   Evaluate the flag in an earlier page/state, then store and re-use it when needed.

Both approaches avoid flicker and give you the same outcome as bootstrapping, as long as you use the same `distinct_id` across client and server.

See the [bootstrapping guide](/docs/feature-flags/bootstrapping.md) for more information.

Set up a reverse proxy (recommended)

We recommend [setting up a reverse proxy](/docs/advanced/proxy.md), so that events are less likely to be intercepted by tracking blockers.

We have our [own managed reverse proxy service included in the platform packages](/docs/advanced/proxy/managed-reverse-proxy.md), which routes through our infrastructure and makes setting up your proxy easy.

If you don't want to use our managed service then there are several other options for creating a reverse proxy, including using [Cloudflare](/docs/advanced/proxy/cloudflare.md), [AWS Cloudfront](/docs/advanced/proxy/cloudfront.md), and [Vercel](/docs/advanced/proxy/vercel.md).

Grouping products in one project (recommended)

If you have multiple customer-facing products (e.g. a marketing website + mobile app + web app), it's best to install PostHog on them all and [group them in one project](/docs/settings/projects.md).

This makes it possible to track users across their entire journey (e.g. from visiting your marketing website to signing up for your product), or how they use your product across multiple platforms.

Add IPs to Firewall/WAF allowlists (recommended)

For certain features like [heatmaps](/docs/toolbar/heatmaps.md), your Web Application Firewall (WAF) may be blocking PostHog’s requests to your site. Add these IP addresses to your WAF allowlist or rules to let PostHog access your site.

**EU**: `3.75.65.221`, `18.197.246.42`, `3.120.223.253`

**US**: `44.205.89.55`, `52.4.194.122`, `44.208.188.173`

These are public, stable IPs used by PostHog services (e.g., Celery tasks for snapshots).

## Accessing PostHog

## Instrumentation client

Once initialized in `instrumentation-client.js|ts`, import `posthog` from `posthog-js` anywhere and call the methods you need on the `posthog` object.

JavaScript

PostHog AI

```javascript
'use client'
import posthog from 'posthog-js'
export default function Home() {
  return (
    <div>
      <button onClick={() => posthog.capture('test_event')}>
        Click me for an event
      </button>
    </div>
  );
}
```

## PostHog provider

PostHog can be accessed throughout your Next.js app by using the `usePostHog` hook.

JavaScript

PostHog AI

```javascript
'use client'
import { usePostHog } from '@posthog/react'
export default function Home() {
  const posthog = usePostHog()
  return (
    <div>
      <button onClick={() => posthog.capture('test_event')}>
        Click me for an event
      </button>
    </div>
  );
}
```

### Usage

See the [React SDK docs](/docs/libraries/react.md) for examples of how to use:

-   [`posthog-js` functions like custom event capture, user identification, and more.](/docs/libraries/react#using-posthog-js-functions.md)
-   [Feature flags including variants and payloads.](/docs/libraries/react#feature-flags.md)

You can also read [the full `posthog-js` documentation](/docs/libraries/js/features.md) for all the usable functions.

## Server-side analytics

Next.js enables you to both server-side render pages and add server-side functionality. To integrate PostHog into your Next.js app on the server-side, you can use the [Node SDK](/docs/libraries/node.md).

First, install the `posthog-node` library:

PostHog AI

### npm

```bash
npm install posthog-node --save
```

### Yarn

```bash
yarn add posthog-node
```

### pnpm

```bash
pnpm add posthog-node
```

### Bun

```bash
bun add posthog-node
```

### Router-specific instructions

## App router

For the app router, we can initialize the `posthog-node` SDK once with a `PostHogClient` function, and import it into files.

This enables us to send events and fetch data from PostHog on the server – without making client-side requests.

JavaScript

PostHog AI

```javascript
// app/posthog.js
import { PostHog } from 'posthog-node'
export default function PostHogClient() {
  const posthogClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    flushAt: 1,
    flushInterval: 0
  })
  return posthogClient
}
```

> **Note:** Because server-side functions in Next.js can be short-lived, we set `flushAt` to `1` and `flushInterval` to `0`.
>
> -   `flushAt` sets how many capture calls we should flush the queue (in one batch).
> -   `flushInterval` sets how many milliseconds we should wait before flushing the queue. Setting them to the lowest number ensures events are sent immediately and not batched. We also need to call `await posthog.shutdown()` once done.

To use this client, we import it into our pages and call it with the `PostHogClient` function:

JavaScript

PostHog AI

```javascript
import Link from 'next/link'
import PostHogClient from '../posthog'
export default async function About() {
  const posthog = PostHogClient()
  const flags = await posthog.getAllFlags(
    'user_distinct_id' // replace with a user's distinct ID
  );
  await posthog.shutdown()
  return (
    <main>
      <h1>About</h1>
      <Link href="/">Go home</Link>
      { flags['main-cta'] &&
        <Link href="http://posthog.com/">Go to PostHog</Link>
      }
    </main>
  )
}
```

## Pages router

For the pages router, we can use the `getServerSideProps` function to access PostHog on the server-side, send events, evaluate feature flags, and more.

This looks like this:

JavaScript

PostHog AI

```javascript
// pages/posts/[id].js
import { useContext, useEffect, useState } from 'react'
import { getServerSession } from "next-auth/next"
import { PostHog } from 'posthog-node'
export default function Post({ post, flags }) {
  const [ctaState, setCtaState] = useState()
  useEffect(() => {
    if (flags) {
      setCtaState(flags['blog-cta'])
    }
  })
  return (
    <div>
      <h1>{post.title}</h1>
      <p>By: {post.author}</p>
      <p>{post.content}</p>
      {ctaState &&
        <p><a href="/">Go to PostHog</a></p>
      }
      <button onClick={likePost}>Like</button>
    </div>
  )
}
export async function getServerSideProps(ctx) {
  const session = await getServerSession(ctx.req, ctx.res)
  let flags = null
  if (session) {
    const client = new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_KEY,
      {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      }
    )
    flags = await client.getAllFlags(session.user.email);
    client.capture({
      distinctId: session.user.email,
      event: 'loaded blog article',
      properties: {
        $current_url: ctx.req.url,
      },
    });
    await client.shutdown()
  }
  const { posts } = await import('../../blog.json')
  const post = posts.find((post) => post.id.toString() === ctx.params.id)
  return {
    props: {
      post,
      flags
    },
  }
}
```

> **Note**: Make sure to *always* call `await client.shutdown()` after sending events from the server-side. PostHog queues events into larger batches, and this call forces all batched events to be flushed immediately.

### Server-side configuration

Next.js overrides the default `fetch` behavior on the server to introduce their own cache. PostHog ignores that cache by default, as this is Next.js's default behavior for any fetch call.

You can override that configuration when initializing PostHog, but make sure you understand the pros/cons of using Next.js's cache and that you might get cached results rather than the actual result our server would return. This is important for feature flags, for example.

TSX

PostHog AI

```jsx
posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  // ... your configuration
  fetch_options: {
    cache: 'force-cache', // Use Next.js cache
    next_options: {       // Passed to the `next` option for `fetch`
      revalidate: 60,     // Cache for 60 seconds
      tags: ['posthog'],  // Can be used with Next.js `revalidateTag` function
    },
  }
})
```

## Configuring a reverse proxy to PostHog

To improve the reliability of client-side tracking and make requests less likely to be intercepted by tracking blockers, you can setup a reverse proxy in Next.js. Read more about deploying a reverse proxy using [Next.js rewrites](/docs/advanced/proxy/nextjs.md), [Next.js middleware](/docs/advanced/proxy/nextjs-middleware.md), and [Vercel rewrites](/docs/advanced/proxy/vercel.md).

## Frequently asked questions

### Does wrapping my app in the PostHog provider de-opt it to client-side rendering?

No. Even though the PostHog provider is a client component, since we pass the `children` prop to it, any component inside the children tree can still be a server component. Next.js creates a boundary between server-run and client-run code.

The [`use client` reference](https://react.dev/reference/rsc/use-client) says that it "defines the boundary between server and client code on the module dependency tree, not the render tree." It also says that "During render, the framework will server-render the root component and continue through the render tree, opting-out of evaluating any code imported from client-marked code."

Pages router components are client components by default.

### What does wrapping my app in the PostHog provider do?

On top of the standard features like autocapture, custom events, session recording, and more, wrapping your app in the PostHog provider gives you:

1.  The `usePostHog`, `useFeatureFlagEnabled`, and other hooks in any component.
2.  A PostHog context you can access in any component.
3.  The `<PostHogFeature>` component which simplifies feature flag logic.

See the [React SDK docs](/docs/libraries/react.md) for more details.

### Why use a `useEffect` hook to initialize PostHog in the provider?

We want to initialize PostHog when the app is loaded. The [React docs](https://react.dev/learn/synchronizing-with-effects) recommend using a `useEffect` hook to do this:

> Effects let you specify side effects that are caused by rendering itself, rather than by a particular event.

Technically, you can also use a `window` object check to initialize PostHog. This happens outside the React lifecycle, meaning it happens earlier and it looks like this:

PostHog AI

### JavaScript

```javascript
// app/providers.js
'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from '@posthog/react'
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false // Disable automatic pageview capture, as we capture manually
  })
}
export function PHProvider({ children }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
```

### TSX

```jsx
// app/providers.tsx
'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from '@posthog/react'
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false // Disable automatic pageview capture, as we capture manually
  })
}
export function PHProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
```

The problem with this is that it can cause a [hydration and/or mismatch error](https://nextjs.org/docs/messages/react-hydration-error) like `Warning: Prop dangerouslySetInnerHTML did not match.`.

> **Tip:** If you experience hydration errors related to PostHog injecting scripts (for session recording, surveys, etc.), you can set `external_scripts_inject_target: 'head'` in your PostHog config. This tells PostHog to inject scripts into the document head instead of the body, avoiding DOM mutations that can interfere with React's hydration process. Alternatively, use `defaults: '2026-01-30'` or later which includes this setting by default. See the [JavaScript configuration docs](/docs/libraries/js/config#configuration-options.md) for more details.

### Why did the pageview component need a `useEffect`?

Before updating the JavaScript Web SDK's default behavior when capturing pageviews (`'2025-11-30'`), we suggested using a `useEffect` hook to capture pageviews. This is because it's the simplest way to accurately capture pageviews. Other approaches include:

1.  Not using a `useEffect` hook, but this might lead to duplicate page views being tracked if the component re-renders for reasons other than navigation. It might work depending on your implementation.
2.  Using `window.navigation` to track pageviews, but this approach is more complex and is [not supported](https://developer.mozilla.org/en-US/docs/Web/API/Window/navigation) in all browsers.

> **Note:** This approach of manually capturing pageviews is no longer recommended. We recommend using `defaults: '2025-11-30'` or `capture_pageview: 'history_change'` instead, which automatically handles both `$pageview` and `$pageleave` events.
>
> If you're still capturing pageviews manually, you should also capture `$pageleave` events to track important engagement metrics like time on page (`$prev_pageview_duration`) and scroll depth (`$prev_pageview_max_scroll_percentage`). To do this, set up a listener on window unload (similar to [how PostHog does it](https://github.com/PostHog/posthog-js/blob/main/packages/browser/src/posthog-core.ts#L644-L646)):
>
> JavaScript
>
> PostHog AI
>
> ```javascript
> useEffect(() => {
>   const handlePageLeave = () => {
>     posthog.capture('$pageleave', null, { transport: 'sendBeacon' })
>   }
>   // Use pagehide if available for better reliability, otherwise fallback to unload
>   const event = 'onpagehide' in window ? 'pagehide' : 'unload'
>   window.addEventListener(event, handlePageLeave)
>   return () => window.removeEventListener(event, handlePageLeave)
> }, [])
> ```
>
> Using `sendBeacon` ensures the event is sent even when users quickly close tabs. See our [time on page tutorial](/tutorials/time-on-page.md) for more details on using these metrics.

## Further reading

-   [How to set up Next.js analytics, feature flags, and more](/tutorials/nextjs-analytics.md)
-   [How to set up Next.js pages router analytics, feature flags, and more](/tutorials/nextjs-pages-analytics.md)
-   [How to set up Next.js A/B tests](/tutorials/nextjs-ab-tests.md)

### Community questions

Ask a question

### Was this page useful?

HelpfulCould be better