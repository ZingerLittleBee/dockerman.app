import type { Locale } from '@repo/shared/i18n'
import type { Metadata } from 'next'
import { CtaFinal } from '@/components/landing/CtaFinal'
import { ComparisonTable } from '@/components/pricing/ComparisonTable'
import { Countdown } from '@/components/pricing/Countdown'
import { PlanCard } from '@/components/pricing/PlanCard'
import { PricingFaq } from '@/components/pricing/PricingFaq'
import { PricingHero } from '@/components/pricing/PricingHero'
import { TrustBar } from '@/components/pricing/TrustBar'
import { pricingConfig } from '@/config/pricing'

export const metadata: Metadata = {
  title: 'Pricing — Dockerman',
  description:
    'Simple pricing for Dockerman Pro. Early bird 30% off through June 30, 2026.'
}

export default async function PricingPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const l = locale as Locale
  const { plans, earlyBirdDeadlineUtc } = pricingConfig
  const isActive = new Date(earlyBirdDeadlineUtc).getTime() > Date.now()

  return (
    <main>
      <PricingHero />
      <section className="px-8 pb-8">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-8 rounded-[14px] border border-dm-line bg-dm-bg-elev p-6 text-center">
            <div className="text-[13px] text-dm-ink-3">Early bird ends in</div>
            <div className="mt-3 flex justify-center">
              <Countdown deadlineUtc={earlyBirdDeadlineUtc} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <PlanCard
              ctaHref={`/${l}/download`}
              ctaLabel="Download"
              features={[
                'Containers, images, volumes, networks',
                'Built-in terminal & logs',
                'Compose support'
              ]}
              name="Free"
              price="$0"
              tagline="Local Docker or Podman. Forever."
            />
            <PlanCard
              ctaHref="/checkout/team"
              ctaLabel="Buy Team"
              features={[
                'Everything in Free',
                'Remote SSH hosts',
                'Multi-host switching',
                'Cloudflared tunnels',
                'Lifetime updates'
              ]}
              highlight
              highlightLabel="Most popular"
              name="Team"
              price={`$${isActive ? plans.team.priceEarlyBird : plans.team.priceRegular}`}
              priceSuffix="/ lifetime"
              strikePrice={isActive ? `$${plans.team.priceRegular}` : undefined}
              tagline={`${plans.team.devices} devices · remote hosts · lifetime updates`}
            />
            <PlanCard
              ctaHref="/checkout/solo"
              ctaLabel="Buy Solo"
              features={[
                'Everything in Free',
                'Remote SSH host',
                'Cloudflared tunnels',
                'Lifetime updates'
              ]}
              name="Solo"
              price={`$${isActive ? plans.solo.priceEarlyBird : plans.solo.priceRegular}`}
              priceSuffix="/ lifetime"
              strikePrice={isActive ? `$${plans.solo.priceRegular}` : undefined}
              tagline={`${plans.solo.devices} device · remote hosts · lifetime updates`}
            />
          </div>
        </div>
      </section>
      <TrustBar />
      <ComparisonTable />
      <PricingFaq />
      <CtaFinal locale={l} />
    </main>
  )
}
