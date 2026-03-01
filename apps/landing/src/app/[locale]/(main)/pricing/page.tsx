'use client'

import { useEffect, useState } from 'react'
import Balancer from 'react-wrap-balancer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/Accordion'
import { Badge } from '@/components/Badge'
import { PricingCard } from '@/components/ui/PricingCard'
import { useLocale, useTranslation } from '@repo/shared/i18n/client'

const DEADLINE = new Date('2026-04-01T00:00:00')

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = target.getTime() - Date.now()
    return diff > 0 ? diff : 0
  })

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      const diff = target.getTime() - Date.now()
      setTimeLeft(diff > 0 ? diff : 0)
    }, 1000)
    return () => clearInterval(timer)
  }, [target, timeLeft])

  const seconds = Math.floor((timeLeft / 1000) % 60)
  const minutes = Math.floor((timeLeft / 1000 / 60) % 60)
  const hours = Math.floor((timeLeft / 1000 / 60 / 60) % 24)
  const days = Math.floor(timeLeft / 1000 / 60 / 60 / 24)

  return { days, hours, minutes, seconds, expired: timeLeft <= 0 }
}

export default function Pricing() {
  const { t } = useTranslation()
  const locale = useLocale()
  const countdown = useCountdown(DEADLINE)

  const freeFeatures = [
    t('pricing.features.containerManagement'),
    t('pricing.features.imageManagement'),
    t('pricing.features.volumeManagement'),
    t('pricing.features.networkManagement'),
    t('pricing.features.realTimeMonitoring'),
    t('pricing.features.integratedTerminal'),
    t('pricing.features.logViewer'),
    t('pricing.features.fileBrowser'),
    t('pricing.features.composeSupport'),
    t('pricing.features.darkMode')
  ]

  const freeExcludedFeatures = [t('pricing.features.localDockerOnly')]

  const proFeatures = [
    t('pricing.features.everythingInFree'),
    t('pricing.features.remoteViaSSH'),
    t('pricing.features.multiHostManagement'),
    t('pricing.features.lifetimeUpdates')
  ]

  const faqs = t('pricing.faq.items', { returnObjects: true }) as Array<{
    question: string
    answer: string
  }>

  useEffect(() => {
    import('posthog-js').then(({ default: posthog }) => {
      posthog.capture('pricing_plan_viewed', { locale })
    })
  }, [locale])

  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3 pb-16">
      <section
        aria-labelledby="pricing-overview"
        className="animate-slide-up-fade text-center"
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards'
        }}
      >
        <div className="flex justify-center">
          <Badge>{t('pricing.badge')}</Badge>
        </div>
        <h1
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
          id="pricing-overview"
        >
          <Balancer>{t('pricing.title')}</Balancer>
        </h1>
        <p className="mt-2 text-gray-600 text-xl dark:text-gray-400">{t('pricing.subtitle')}</p>
        <p className="mx-auto mt-4 max-w-xl text-gray-500 text-lg dark:text-gray-500">
          {t('pricing.description')}
        </p>
      </section>

      {!countdown.expired && (
        <section
          className="mx-auto mt-10 w-full max-w-xl animate-slide-up-fade text-center"
          style={{
            animationDuration: '600ms',
            animationDelay: '200ms',
            animationFillMode: 'backwards'
          }}
        >
          <p className="mb-4 font-medium text-orange-600 text-sm dark:text-orange-400">
            🔥 {t('pricing.deadline')}
          </p>
          <div className="flex justify-center gap-3">
            {(
              [
                [countdown.days, t('pricing.countdown.days')],
                [countdown.hours, t('pricing.countdown.hours')],
                [countdown.minutes, t('pricing.countdown.minutes')],
                [countdown.seconds, t('pricing.countdown.seconds')]
              ] as const
            ).map(([value, label]) => (
              <div
                className="flex min-w-[4rem] flex-col items-center rounded-xl bg-gray-900 px-3 py-2.5 shadow-lg dark:bg-white/10"
                key={label}
              >
                <span className="font-bold text-2xl text-white tabular-nums sm:text-3xl">
                  {String(value).padStart(2, '0')}
                </span>
                <span className="mt-0.5 text-gray-400 text-xs uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-16 grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <PricingCard
          ctaText={t('pricing.cta.currentPlan')}
          disabled
          excludedFeatures={freeExcludedFeatures}
          features={freeFeatures}
          price={0}
          title="FREE"
        />

        <PricingCard
          badgeText={t('pricing.earlyBird')}
          ctaHref={`/api/checkout?plan=3-devices&locale=${locale}`}
          ctaText={t('pricing.cta.upgradeNow')}
          description={t('pricing.plans.threeDevices')}
          features={[
            t('pricing.features.everythingInFree'),
            t('pricing.plans.threeDevicesSaving'),
            t('pricing.features.remoteViaSSH'),
            t('pricing.features.multiHostManagement'),
            t('pricing.features.lifetimeUpdates')
          ]}
          highlighted
          originalPrice={29}
          plan="3-devices"
          price={19}
          title="3 DEVICES"
        />

        <PricingCard
          badgeText={t('pricing.earlyBird')}
          ctaHref={`/api/checkout?plan=1-device&locale=${locale}`}
          ctaText={t('pricing.cta.upgradeNow')}
          description={t('pricing.plans.oneDevice')}
          features={proFeatures}
          originalPrice={19}
          plan="1-device"
          price={14}
          title="1 DEVICE"
        />
      </section>

      <section aria-labelledby="pricing-faq" className="mx-auto mt-20 w-full max-w-3xl">
        <h2
          className="scroll-my-24 bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-center font-bold text-2xl text-transparent tracking-tighter lg:text-3xl dark:from-gray-50 dark:to-gray-300"
          id="pricing-faq"
        >
          {t('pricing.faq.title')}
        </h2>
        <Accordion
          className="mt-8"
          onValueChange={(values: string[]) => {
            if (values.length > 0) {
              const lastValue = values.at(-1)
              const faqIndex = faqs.findIndex((f) => f.question === lastValue)
              import('posthog-js').then(({ default: posthog }) => {
                posthog.capture('pricing_faq_expanded', {
                  question: lastValue,
                  faq_index: faqIndex
                })
              })
            }
          }}
          type="multiple"
        >
          {faqs.map((item) => (
            <AccordionItem
              className="py-3 first:pt-0 first:pb-3"
              key={item.question}
              value={item.question}
            >
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  )
}
