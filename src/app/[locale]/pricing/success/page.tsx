'use client'

import { RiCheckboxCircleFill, RiMailLine } from '@remixicon/react'
import Link from 'next/link'
import { Button } from '@/components/Button'
import { useTranslation } from '@/lib/i18n/client'

export default function PricingSuccess() {
  const { t } = useTranslation()

  return (
    <div className="mt-36 flex flex-col items-center overflow-hidden px-3 pb-16">
      <section className="animate-slide-up-fade max-w-lg text-center" style={{ animationDuration: '600ms', animationFillMode: 'backwards' }}>
        <div className="flex justify-center">
          <RiCheckboxCircleFill className="size-16 text-green-500" />
        </div>

        <h1 className="mt-6 bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text font-bold text-3xl text-transparent tracking-tighter sm:text-4xl dark:from-gray-50 dark:to-gray-300">
          {t('pricing.success.title')}
        </h1>

        <p className="mt-4 text-gray-600 text-lg dark:text-gray-400">
          {t('pricing.success.description')}
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-left dark:border-gray-800 dark:bg-gray-900">
          <h2 className="font-semibold text-gray-900 text-sm dark:text-gray-100">
            {t('pricing.success.nextSteps')}
          </h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-gray-600 text-sm dark:text-gray-400">
            <li>{t('pricing.success.step1')}</li>
            <li>{t('pricing.success.step2')}</li>
            <li>{t('pricing.success.step3')}</li>
          </ol>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/download">
            <Button className="w-full sm:w-auto" variant="primary">
              {t('pricing.success.downloadNow')}
            </Button>
          </Link>
          <a href="mailto:support@dockerman.app">
            <Button className="w-full sm:w-auto" variant="secondary">
              <RiMailLine className="mr-2 size-4" />
              {t('pricing.success.contactSupport')}
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
