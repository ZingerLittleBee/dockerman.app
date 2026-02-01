'use client'

import { useTranslation } from '@/lib/i18n/client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'
import HeroImage from './HeroImage'
import TrackedHeroButton from './TrackedHeroButton'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const wrap = imageWrapRef.current
      if (!wrap) return

      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        const floatDistance = Math.min(window.innerHeight * 0.2, 160)
        const pinDistance = Math.max(window.innerHeight * 0.9, 520)

        const floatTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrap,
            start: 'top bottom',
            end: 'top 70%',
            scrub: true
          }
        })

        floatTl.to(wrap, { y: -floatDistance, ease: 'none' })

        ScrollTrigger.create({
          trigger: wrap,
          start: 'top 10%',
          end: `+=${pinDistance}`,
          pin: wrap,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1
        })

        return () => {
          floatTl.kill()
        }
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
        className="relative mx-auto mt-20 ml-3 h-fit w-[40rem] max-w-6xl animate-slide-up-fade sm:ml-auto sm:w-full sm:px-2"
        ref={imageWrapRef}
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
