'use client'

import { useGSAP } from '@gsap/react'
import { useTranslation } from '@repo/shared/i18n/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type ReactNode, useRef } from 'react'
import TrackedHeroButton from './TrackedHeroButton'

export default function Hero({ children }: { children?: ReactNode }) {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger)

      const wrap = imageWrapRef.current
      if (!wrap) return

      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        const pinDistance = Math.max(window.innerHeight * 0.95, 520)

        // 只保留 pin 效果，不添加视差动画，让图片跟随页面正常滚动
        ScrollTrigger.create({
          trigger: wrap,
          start: 'top 10%',
          end: `+=${pinDistance}`,
          pin: wrap,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1
        })
      })

      return () => {
        mm.revert()
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      aria-labelledby="hero-title"
      className="relative mt-32 flex flex-col items-center justify-center text-center sm:mt-40"
      ref={sectionRef}
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
        className="relative mx-auto mt-20 ml-3 h-fit w-[40rem] max-w-6xl sm:ml-auto sm:w-full sm:px-2"
        ref={imageWrapRef}
      >
        {children}
      </div>
    </section>
  )
}
