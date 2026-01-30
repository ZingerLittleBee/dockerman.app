'use client'

import Balancer from 'react-wrap-balancer'
import { Badge } from '@/components/Badge'
import { useTranslation } from '@/lib/i18n/client'

export default function DPA() {
  const { t } = useTranslation()

  const overviewItems = t('dpa.sections.overview.items', { returnObjects: true }) as string[]
  const localItems = t('dpa.sections.categories.localItems', { returnObjects: true }) as string[]
  const analyticsItems = t('dpa.sections.categories.analyticsItems', { returnObjects: true }) as string[]
  const securityItems = t('dpa.sections.security.items', { returnObjects: true }) as string[]
  const purposeItems = t('dpa.sections.purposes.items', { returnObjects: true }) as string[]
  const rightsItems = t('dpa.sections.rights.items', { returnObjects: true }) as string[]

  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3 pb-16">
      <section
        aria-labelledby="dpa-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards'
        }}
      >
        <Badge>{t('dpa.badge')}</Badge>
        <h1
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
          id="dpa-overview"
        >
          <Balancer>{t('dpa.title')}</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-gray-700 text-lg dark:text-gray-400">
          {t('dpa.description')}
        </p>
      </section>

      <section className="my-16 max-w-4xl">
        <div className="space-y-8 rounded-xl bg-white p-8 shadow-gray-200/50 shadow-lg ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
          {/* Data Processing Overview */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">1</span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                {t('dpa.sections.overview.title')}
              </h2>
            </div>
            <div className="ml-11 space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                {t('dpa.sections.overview.intro')}
              </p>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {overviewItems.map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Data Categories */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">2</span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                {t('dpa.sections.categories.title')}
              </h2>
            </div>
            <div className="ml-11 space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {t('dpa.sections.categories.localData')}
              </h3>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {localItems.map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 font-medium text-gray-900 dark:text-gray-100">
                {t('dpa.sections.categories.analyticsData')}
              </h3>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {analyticsItems.map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Data Storage and Security */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">3</span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                {t('dpa.sections.security.title')}
              </h2>
            </div>
            <div className="ml-11 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                {t('dpa.sections.security.intro')}
              </p>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {securityItems.map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Data Processing Purposes */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">4</span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                {t('dpa.sections.purposes.title')}
              </h2>
            </div>
            <div className="ml-11 space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                {t('dpa.sections.purposes.intro')}
              </p>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {purposeItems.map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Data Retention */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">5</span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                {t('dpa.sections.retention.title')}
              </h2>
            </div>
            <p className="ml-11 text-gray-600 dark:text-gray-400">
              {t('dpa.sections.retention.content')}
            </p>
          </div>

          {/* Data Subject Rights */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">6</span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                {t('dpa.sections.rights.title')}
              </h2>
            </div>
            <div className="ml-11 space-y-4">
              <p className="text-gray-600 dark:text-gray-400">{t('dpa.sections.rights.intro')}</p>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {rightsItems.map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">7</span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                {t('dpa.sections.contact.title')}
              </h2>
            </div>
            <p className="ml-11 text-gray-600 dark:text-gray-400">
              {t('dpa.sections.contact.content')}{' '}
              <a
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                href="mailto:support@dockerman.app"
              >
                support@dockerman.app
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
