import type { Locale } from '@repo/shared/i18n'
import Balancer from 'react-wrap-balancer'
import { Badge } from '@/components/Badge'
import type { ChangelogEntryData } from '@/lib/changelog'
import ChangelogSubscribeForm, { type ChangelogSubscribeCopy } from './ChangelogSubscribeForm'
import ChangelogTimeline from './ChangelogTimeline'

interface ChangelogPageContentProps {
  copy: {
    badge: string
    description: string
    subscribe: ChangelogSubscribeCopy
    title: string
  }
  entries: ChangelogEntryData[]
  locale: Locale
  showSubscribeForm?: boolean
}

export default function ChangelogPageContent({
  copy,
  entries,
  locale,
  showSubscribeForm = false
}: ChangelogPageContentProps) {
  return (
    <div className="flex flex-col">
      <section
        aria-labelledby="changelog-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards'
        }}
      >
        <div>
          <Badge>{copy.badge}</Badge>
        </div>
        <h1
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
          id="changelog-overview"
        >
          <Balancer>{copy.title}</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-gray-700 text-lg dark:text-gray-400">
          {copy.description}
        </p>
      </section>

      {showSubscribeForm ? (
        <section className="mt-12">
          <ChangelogSubscribeForm copy={copy.subscribe} />
        </section>
      ) : null}

      <section className="my-16">
        <ChangelogTimeline entries={entries} locale={locale} />
      </section>
    </div>
  )
}
