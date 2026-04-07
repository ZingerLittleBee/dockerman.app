'use client'

import { useTranslation } from '@repo/shared/i18n/client'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useEffect } from 'react'

export const Kubernetes = () => {
  const { t } = useTranslation()

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [])

  return (
    <div className="px-3">
      <section
        aria-labelledby="kubernetes-title"
        className="relative mx-auto mt-28 flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-3xl bg-gray-950 py-24 md:mt-40"
      >
        {/* Badge */}
        <div className="inline-block rounded-lg border border-indigo-400/20 bg-indigo-800/20 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tight sm:text-sm">
          <span className="bg-gradient-to-b from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            {t('kubernetes.badge')}
          </span>
        </div>

        {/* Title */}
        <h2
          className="mt-6 inline-block bg-gradient-to-b from-white to-indigo-100 bg-clip-text px-2 text-center font-bold text-5xl text-transparent tracking-tighter md:text-7xl"
          id="kubernetes-title"
        >
          {t('kubernetes.title')} <br /> {t('kubernetes.titleBreak')}
        </h2>

        {/* Description */}
        <p className="mt-6 max-w-xl px-4 text-center text-gray-400 text-lg">
          {t('kubernetes.description')}
        </p>

        {/* Screenshot */}
        <div className="mt-12 w-full max-w-4xl px-6">
          <div className="overflow-hidden rounded-xl border border-gray-800/50 shadow-xl shadow-black/40">
            <Image
              alt="Kubernetes cluster management interface"
              height={900}
              quality={80}
              src="/screenshots/kubernetes.png"
              width={1440}
              className="w-full"
            />
          </div>
        </div>

      </section>
    </div>
  )
}
