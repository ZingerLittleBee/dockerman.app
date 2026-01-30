'use client'

import Balancer from 'react-wrap-balancer'
import { Badge } from '@/components/Badge'
import { useTranslation, useLocale } from '@/lib/i18n/client'
import ChangelogContentEn from '@/content/changelog/en/page.mdx'
import ChangelogContentZh from '@/content/changelog/zh/page.mdx'

const changelogContent = {
  en: ChangelogContentEn,
  zh: ChangelogContentZh
}

export default function ChangelogPage() {
  const { t } = useTranslation()
  const locale = useLocale()
  const ChangelogContent = changelogContent[locale]

  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section
        aria-labelledby="changelog-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards'
        }}
      >
        <Badge>{t('changelog.badge')}</Badge>
        <h1
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
          id="changelog-overview"
        >
          <Balancer>{t('changelog.title')}</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-gray-700 text-lg dark:text-gray-400">
          {t('changelog.description')}
        </p>
      </section>

      <section className="my-16 max-w-4xl">
        <ChangelogContent />
      </section>
    </div>
  )
}
