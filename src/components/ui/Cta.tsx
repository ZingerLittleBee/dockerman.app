'use client'

import Balancer from 'react-wrap-balancer'
import { useTranslation } from '@/lib/i18n/client'
import { TrackedChangelogLink, TrackedCtaDownloadButton } from './TrackedCtaButtons'

export default function Cta() {
  const { t } = useTranslation()

  return (
    <section
      aria-labelledby="cta-title"
      className="mx-auto mt-32 mb-20 max-w-6xl p-1 px-2 sm:mt-56"
    >
      <div className="relative flex items-center justify-center">
        <div className="max-w-4xl">
          <div className="flex flex-col items-center justify-center text-center">
            <div>
              <h3
                className="inline-block bg-gradient-to-t from-gray-900 to-gray-800 bg-clip-text p-2 font-bold text-4xl text-transparent tracking-tighter md:text-6xl dark:from-gray-50 dark:to-gray-300"
                id="cta-title"
              >
                {t('cta.title')}
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-gray-600 sm:text-lg dark:text-gray-400">
                <Balancer>{t('cta.description')}</Balancer>
              </p>
            </div>
            <div className="mt-14 rounded-[16px] bg-gray-300/5 p-1.5 ring-1 ring-black/[3%] backdrop-blur dark:bg-gray-900/10 dark:ring-white/[3%]">
              <div className="rounded-xl bg-white p-4 shadow-indigo-500/10 shadow-lg ring-1 ring-black/5 dark:bg-gray-950 dark:shadow-indigo-500/10 dark:ring-white/5">
                <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <TrackedCtaDownloadButton />
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 text-xs sm:text-sm dark:text-gray-400">
              {t('cta.learnMore')} <TrackedChangelogLink />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
