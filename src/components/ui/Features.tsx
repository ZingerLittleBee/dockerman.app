'use client'

import React from 'react'
import { useTranslation } from '@/lib/i18n/client'
import { Badge } from '../Badge'

const stats = [
  { key: 'performance', value: '~0ms' },
  { key: 'bundleSize', value: '<10MB' },
  { key: 'memoryUsage', value: '<30MB' }
]

export default function Features() {
  const { t } = useTranslation()

  return (
    <section
      aria-labelledby="features-title"
      className="mx-auto mt-32 w-full max-w-6xl px-3 md:mt-44"
    >
      <Badge>{t('features.badge')}</Badge>
      <h2
        className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
        id="features-title"
      >
        {t('features.title')}
      </h2>
      <p className="mt-6 max-w-3xl text-gray-600 text-lg leading-7 dark:text-gray-400">
        {t('features.description')}
      </p>
      <dl className="mt-12 grid grid-cols-1 gap-y-8 md:grid-cols-3 md:border-gray-200 md:border-y md:py-14 dark:border-gray-800">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <div className="border-indigo-100 border-l-2 pl-6 md:border-l md:text-center lg:border-gray-200 lg:first:border-none dark:border-indigo-900 lg:dark:border-gray-800">
              <dd className="inline-block bg-gradient-to-t from-indigo-900 to-indigo-600 bg-clip-text font-bold text-5xl text-transparent tracking-tight lg:text-6xl dark:from-indigo-700 dark:to-indigo-400">
                {stat.value}
              </dd>
              <dt className="mt-1 text-gray-600 dark:text-gray-400">
                {t(`features.stats.${stat.key}`)}
              </dt>
            </div>
          </React.Fragment>
        ))}
      </dl>
    </section>
  )
}
