'use client'

import { useParams } from 'next/navigation'
import { useTranslation } from '@/lib/i18n/client'
import { type Locale } from '@/lib/i18n'
import HeroImage from './HeroImage'
import TrackedHeroButton from './TrackedHeroButton'

export default function Hero() {
  const params = useParams()
  const locale = (params.locale as Locale) || 'en'
  const { t } = useTranslation(locale)

  return (
    <section
      aria-labelledby="hero-title"
      className="mt-32 flex flex-col items-center justify-center text-center sm:mt-40"
    >
      <h1
        className="inline-block animate-slide-up-fade bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text p-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-7xl dark:from-gray-50 dark:to-gray-300"
        id="hero-title"
        style={{ animationDuration: '700ms' }}
      >
        {t('hero.title')} <br />
        {t('hero.titleBreak')}
      </h1>
      <p
        className="mt-6 max-w-lg animate-slide-up-fade text-gray-700 text-lg dark:text-gray-400"
        style={{ animationDuration: '900ms' }}
      >
        {t('hero.description')}
      </p>
      <div
        className="mt-8 flex w-full animate-slide-up-fade justify-center gap-3 px-3 sm:flex-row"
        style={{ animationDuration: '1100ms' }}
      >
        <TrackedHeroButton />
      </div>
      <div
        className="relative mx-auto mt-20 ml-3 h-fit w-[40rem] max-w-6xl animate-slide-up-fade sm:ml-auto sm:w-full sm:px-2"
        style={{ animationDuration: '1400ms' }}
      >
        <HeroImage />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-24 -mx-10 h-2/4 bg-gradient-to-t from-white via-white to-transparent lg:h-1/4 dark:from-gray-950 dark:via-gray-950"
        />
      </div>
    </section>
  )
}
