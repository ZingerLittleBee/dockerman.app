'use client'

import { useGSAP } from '@gsap/react'
import { useTranslation } from '@repo/shared/i18n/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useRef } from 'react'

export const Kubernetes = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      const items = gsap.utils.toArray<HTMLElement>('[data-k8s-animate]')
      items.forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: i * 0.1,
        })
      })
    },
    { scope: sectionRef }
  )

  const featureKeys = ['clusterOverview', 'workloads', 'serviceNetwork'] as const

  const features = featureKeys.map((key) => ({
    name: t(`kubernetes.features.${key}.name`),
    description: t(`kubernetes.features.${key}.description`),
  }))

  return (
    <div className="px-3">
      <section
        aria-labelledby="kubernetes-title"
        className="relative mx-auto mt-28 flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-3xl bg-gray-950 py-24 md:mt-40"
        ref={sectionRef}
      >
        {/* Badge */}
        <div
          className="inline-block rounded-lg border border-indigo-400/20 bg-indigo-800/20 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tight sm:text-sm"
          data-k8s-animate
        >
          <span className="bg-gradient-to-b from-indigo-200 to-indigo-400 bg-clip-text text-transparent">
            {t('kubernetes.badge')}
          </span>
        </div>

        {/* Title */}
        <h2
          className="mt-6 inline-block bg-gradient-to-b from-white to-indigo-100 bg-clip-text px-2 text-center font-bold text-5xl text-transparent tracking-tighter md:text-7xl"
          data-k8s-animate
          id="kubernetes-title"
        >
          {t('kubernetes.title')} <br /> {t('kubernetes.titleBreak')}
        </h2>

        {/* Description */}
        <p
          className="mt-6 max-w-xl px-4 text-center text-gray-400 text-lg"
          data-k8s-animate
        >
          {t('kubernetes.description')}
        </p>

        {/* Screenshot */}
        <div
          className="mt-12 w-full max-w-4xl px-6"
          data-k8s-animate
        >
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

        {/* Feature Cards */}
        <div
          className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-4 px-6 md:grid-cols-3"
          data-k8s-animate
        >
          {features.map((feature) => (
            <div
              className="rounded-xl border border-gray-800 bg-gray-900/80 p-6"
              key={feature.name}
            >
              <h3 className="font-semibold text-white">{feature.name}</h3>
              <p className="mt-2 text-gray-400 text-sm leading-6">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
