'use client'

import Balancer from 'react-wrap-balancer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/Accordion'
import { Badge } from '@/components/Badge'
import { PricingCard } from '@/components/ui/PricingCard'
import { useTranslation } from '@/lib/i18n/client'

export default function Pricing() {
  const { t } = useTranslation()

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
    t('pricing.features.multiHostManagement')
  ]

  const faqs = t('pricing.faq.items', { returnObjects: true }) as Array<{
    question: string
    answer: string
  }>

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
          ctaText="Coming Soon"
          description={t('pricing.plans.threeDevices')}
          disabled
          features={[
            t('pricing.features.everythingInFree'),
            t('pricing.plans.threeDevicesSaving'),
            t('pricing.features.remoteViaSSH'),
            t('pricing.features.multiHostManagement')
          ]}
          highlighted
          originalPrice={29}
          price={19}
          title="3 DEVICES"
        />

        <PricingCard
          badgeText={t('pricing.earlyBird')}
          ctaText="Coming Soon"
          description={t('pricing.plans.oneDevice')}
          disabled
          features={proFeatures}
          originalPrice={19}
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
        <Accordion className="mt-8" type="multiple">
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
