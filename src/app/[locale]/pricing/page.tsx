'use client'

import Balancer from 'react-wrap-balancer'
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
    t('pricing.features.systemMonitoring'),
    t('pricing.features.localDockerOnly')
  ]

  const proFeatures = [
    t('pricing.features.everythingInFree'),
    t('pricing.features.remoteViaSSH'),
    t('pricing.features.multiHostManagement')
  ]

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
          features={freeFeatures}
          price={0}
          title="FREE"
        />

        <PricingCard
          badgeText={t('pricing.earlyBird')}
          ctaHref="#"
          ctaText={t('pricing.cta.upgradeNow')}
          features={proFeatures}
          originalPrice={10}
          price={8}
          title="1 DEVICE"
          updatePolicy={t('pricing.updatePolicy')}
        />

        <PricingCard
          badgeText={t('pricing.earlyBird')}
          ctaHref="#"
          ctaText={t('pricing.cta.upgradeNow')}
          features={proFeatures}
          highlighted
          originalPrice={19}
          price={15}
          title="3 DEVICES"
          updatePolicy={t('pricing.updatePolicy')}
        />
      </section>

      <section className="mx-auto mt-12 max-w-2xl text-center">
        <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-900">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            {t('pricing.upgradeInfo.title')}
          </h2>
          <ul className="mt-4 space-y-2 text-gray-600 text-sm dark:text-gray-400">
            <li>{t('pricing.upgradeInfo.deviceUpgrade')}</li>
            <li>{t('pricing.upgradeInfo.versionUpgrade')}</li>
          </ul>
        </div>
      </section>
    </div>
  )
}
