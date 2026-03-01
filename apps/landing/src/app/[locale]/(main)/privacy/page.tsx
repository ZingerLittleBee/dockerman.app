'use client'

import Balancer from 'react-wrap-balancer'
import { Badge } from '@/components/Badge'
import { useTranslation } from '@repo/shared/i18n/client'

export default function Privacy() {
  const { t } = useTranslation()

  const collectedItems = t('privacy.sections.analytics.collectedItems', {
    returnObjects: true
  }) as string[]
  const notCollectedItems = t('privacy.sections.analytics.notCollectedItems', {
    returnObjects: true
  }) as string[]

  const sections = [
    { key: 'dataCollection' },
    { key: 'localStorage' },
    { key: 'updates' },
    { key: 'contact' }
  ]

  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3 pb-16">
      <section
        aria-labelledby="privacy-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards'
        }}
      >
        <Badge>{t('privacy.badge')}</Badge>
        <h1
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
          id="privacy-overview"
        >
          <Balancer>{t('privacy.title')}</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-gray-700 text-lg dark:text-gray-400">
          {t('privacy.description')}
        </p>
      </section>

      <section className="my-16 max-w-3xl">
        <div className="space-y-12">
          {/* Data Collection */}
          <div className="rounded-xl bg-white p-6 shadow-gray-200/50 shadow-lg ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
            <h2 className="mb-4 font-semibold text-gray-900 text-xl dark:text-gray-100">
              {t('privacy.sections.dataCollection.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-400">
              {t('privacy.sections.dataCollection.content')}
            </p>
          </div>

          {/* Anonymous Analytics */}
          <div className="rounded-xl bg-white p-6 shadow-gray-200/50 shadow-lg ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
            <h2 className="mb-4 font-semibold text-gray-900 text-xl dark:text-gray-100">
              {t('privacy.sections.analytics.title')}
            </h2>
            <p className="mb-4 text-gray-700 dark:text-gray-400">
              {t('privacy.sections.analytics.content')}
            </p>

            <h3 className="mt-6 mb-2 font-medium text-gray-900 dark:text-gray-100">
              {t('privacy.sections.analytics.collected')}
            </h3>
            <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {collectedItems.map((item, index) => (
                <li className="flex items-center gap-2" key={index}>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 mb-2 font-medium text-gray-900 dark:text-gray-100">
              {t('privacy.sections.analytics.notCollected')}
            </h3>
            <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
              {notCollectedItems.map((item, index) => (
                <li className="flex items-center gap-2" key={index}>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Opt Out */}
          <div className="rounded-xl bg-white p-6 shadow-gray-200/50 shadow-lg ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
            <h2 className="mb-4 font-semibold text-gray-900 text-xl dark:text-gray-100">
              {t('privacy.sections.optOut.title')}
            </h2>
            <p className="text-gray-700 dark:text-gray-400">
              {t('privacy.sections.optOut.content')}
            </p>
          </div>

          {/* Other sections */}
          {sections.slice(1).map((section) => (
            <div
              className="rounded-xl bg-white p-6 shadow-gray-200/50 shadow-lg ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800"
              key={section.key}
            >
              <h2 className="mb-4 font-semibold text-gray-900 text-xl dark:text-gray-100">
                {t(`privacy.sections.${section.key}.title`)}
              </h2>
              <p className="text-gray-700 dark:text-gray-400">
                {t(`privacy.sections.${section.key}.content`)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
