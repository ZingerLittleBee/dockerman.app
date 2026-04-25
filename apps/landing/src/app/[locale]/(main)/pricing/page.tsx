import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import type { Metadata } from 'next'
import { ComparisonTable } from '@/components/pricing/ComparisonTable'
import { Countdown } from '@/components/pricing/Countdown'
import { PlanCard } from '@/components/pricing/PlanCard'
import { PricingFaq } from '@/components/pricing/PricingFaq'
import { PricingHero } from '@/components/pricing/PricingHero'
import { TrustBar } from '@/components/pricing/TrustBar'
import { pricingConfig } from '@/config/pricing'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { t } = await getTranslation(locale as Locale)
  return {
    title: t('meta.pricing.title'),
    description: t('meta.pricing.description')
  }
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  const { t } = await getTranslation(l)
  const { plans, earlyBirdDeadlineUtc, refund } = pricingConfig
  const isActive = new Date(earlyBirdDeadlineUtc).getTime() > Date.now()

  const teamPrice = isActive ? plans.team.priceEarlyBird : plans.team.priceRegular
  const soloPrice = isActive ? plans.solo.priceEarlyBird : plans.solo.priceRegular
  const perDevice = (teamPrice / plans.team.devices).toFixed(2)

  return (
    <main>
      <PricingHero locale={l} />

      {/* Countdown bar */}
      <section className="px-8 pb-10">
        <div className="mx-auto mt-2 max-w-[560px]">
          <div
            className="flex flex-wrap items-center gap-5 rounded-[14px] border p-5"
            style={{
              borderColor:
                'color-mix(in srgb, var(--color-dm-warn) 30%, var(--color-dm-line-strong))',
              backgroundImage:
                'radial-gradient(ellipse at 10% 50%, color-mix(in srgb, var(--color-dm-warn) 10%, transparent), transparent 60%)',
              backgroundColor: 'var(--color-dm-bg-elev)'
            }}
          >
            <div
              className="grid h-[38px] w-[38px] flex-shrink-0 place-items-center rounded-[9px]"
              style={{
                background: 'color-mix(in srgb, var(--color-dm-warn) 14%, transparent)',
                color: 'var(--color-dm-warn)'
              }}
            >
              <svg
                fill="none"
                height="18"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="18"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <div className="flex-1 text-left">
              <div className="font-semibold text-[13px] text-dm-ink">
                {t('pricing.countdown.endsLead')}{' '}
                <span
                  className="ml-2 rounded px-[7px] py-[2px] font-[var(--font-dm-mono)] font-bold text-[10px] tracking-[0.04em]"
                  style={{ background: 'var(--color-dm-warn)', color: '#000' }}
                >
                  {t('pricing.countdown.endsDate')}
                </span>
              </div>
              <div className="mt-[3px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-3">
                {t('pricing.countdown.afterNote', {
                  solo: plans.solo.priceRegular,
                  devices: plans.team.devices,
                  team: plans.team.priceRegular
                })}
              </div>
            </div>
            <Countdown deadlineUtc={earlyBirdDeadlineUtc} locale={l} />
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="px-8">
        <div className="mx-auto max-w-[1140px]">
          <div
            className="grid items-stretch gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
          >
            {/* Free */}
            <PlanCard
              ctaHref={`/${l}/download`}
              ctaLabel={t('pricing.plans.free.cta')}
              ctaNote={t('pricing.plans.free.ctaNote')}
              ctaVariant="disabled"
              description={t('pricing.plans.free.description')}
              features={[
                { label: t('pricing.plans.free.features.coreSet') },
                { label: t('pricing.plans.free.features.compose') },
                { label: t('pricing.plans.free.features.palette') },
                { label: t('pricing.plans.free.features.podmanTrivy') },
                { label: t('pricing.plans.free.features.themesI18n') },
                { label: t('pricing.plans.free.features.remoteSsh'), included: false },
                { label: t('pricing.plans.free.features.multiHost'), included: false }
              ]}
              freq={t('pricing.plans.free.freq')}
              label={t('pricing.plans.free.label')}
              name={t('pricing.plans.free.name')}
              price={0}
            />

            {/* Team (highlighted) */}
            <PlanCard
              ctaHref={`/api/checkout?plan=3-devices&locale=${l}`}
              ctaLabel={t('pricing.plans.team.cta', { price: teamPrice })}
              ctaNote={t('pricing.plans.team.ctaNote', { days: refund.days })}
              ctaVariant="primary"
              description={t('pricing.plans.team.description')}
              features={[
                {
                  label: (
                    <span className="font-semibold text-dm-ink">
                      {t('pricing.plans.team.features.everythingFree')}
                    </span>
                  )
                },
                {
                  label: (
                    <>
                      <span className="font-semibold text-dm-ink">
                        {t('pricing.plans.team.features.perDevice', { perDevice })}
                      </span>
                      {t('pricing.plans.team.features.perDeviceSavings', {
                        devices: plans.team.devices
                      })}
                    </>
                  )
                },
                { label: t('pricing.plans.team.features.remote') },
                { label: t('pricing.plans.team.features.multiHost') },
                { label: t('pricing.plans.team.features.cloudflared') },
                { label: t('pricing.plans.team.features.k8s') },
                { label: t('pricing.plans.team.features.updates') }
              ]}
              freq={t('pricing.plans.team.freq', { devices: plans.team.devices })}
              highlighted
              label={t('pricing.plans.team.label', { devices: plans.team.devices })}
              name={
                <>
                  {t('pricing.plans.team.nameLead')}{' '}
                  <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-3 italic">
                    {t('pricing.plans.team.nameAccent')}
                  </em>{' '}
                  {t('pricing.plans.team.nameTrail')}
                </>
              }
              price={teamPrice}
              ribbon={t('pricing.plans.team.ribbon')}
              strikePrice={isActive ? `$${plans.team.priceRegular}` : undefined}
            />

            {/* Solo */}
            <PlanCard
              ctaHref={`/api/checkout?plan=1-device&locale=${l}`}
              ctaLabel={t('pricing.plans.solo.cta', { price: soloPrice })}
              ctaNote={t('pricing.plans.solo.ctaNote', { days: refund.days })}
              ctaVariant="ghost"
              description={t('pricing.plans.solo.description')}
              features={[
                {
                  label: (
                    <span className="font-semibold text-dm-ink">
                      {t('pricing.plans.solo.features.everythingFree')}
                    </span>
                  )
                },
                { label: t('pricing.plans.solo.features.remote') },
                { label: t('pricing.plans.solo.features.multiHost') },
                { label: t('pricing.plans.solo.features.cloudflared') },
                { label: t('pricing.plans.solo.features.k8s') },
                { label: t('pricing.plans.solo.features.updates') }
              ]}
              freq={t('pricing.plans.solo.freq')}
              label={t('pricing.plans.solo.label')}
              name={t('pricing.plans.solo.name')}
              price={soloPrice}
              strikePrice={isActive ? `$${plans.solo.priceRegular}` : undefined}
            />
          </div>

          <TrustBar locale={l} />
        </div>
      </section>

      <ComparisonTable locale={l} />
      <PricingFaq />

      {/* Final CTA */}
      <section className="px-8 pt-20">
        <div className="mx-auto max-w-[1140px]">
          <div className="relative overflow-hidden rounded-[20px] border border-dm-line bg-dm-bg-elev px-10 py-16 text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-dm-accent-2) 10%, transparent), transparent 55%)'
              }}
            />
            <h3 className="relative m-0 font-bold text-[clamp(28px,3.6vw,40px)] text-dm-ink leading-[1.1] tracking-[-0.03em]">
              {t('pricing.finalCta.titleLead')}{' '}
              <em
                className="bg-clip-text font-[var(--font-dm-display)] font-normal text-transparent italic"
                style={{
                  backgroundImage: 'linear-gradient(135deg, var(--color-dm-accent-2), #8b5cf6)'
                }}
              >
                {t('pricing.finalCta.titleAccent')}
              </em>
            </h3>
            <p className="relative mx-auto mt-4 max-w-[52ch] text-[15px] text-dm-ink-3">
              {t('pricing.finalCta.description')}
            </p>
            <div className="relative mt-7 inline-flex flex-wrap items-center justify-center gap-[10px]">
              <a
                className="inline-flex items-center gap-2 rounded-[10px] px-[22px] py-[13px] font-semibold text-[14px] text-white no-underline transition-transform hover:-translate-y-px"
                href={`/api/checkout?plan=3-devices&locale=${l}`}
                style={{
                  background:
                    'linear-gradient(180deg, var(--color-dm-accent-2), color-mix(in srgb, var(--color-dm-accent-2) 80%, black))',
                  boxShadow:
                    '0 10px 24px -8px color-mix(in srgb, var(--color-dm-accent-2) 55%, transparent)'
                }}
              >
                {t('pricing.finalCta.ctaTeam', { price: teamPrice })}
                <svg
                  fill="none"
                  height="14"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  width="14"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>
              <a
                className="inline-flex items-center px-[22px] py-[13px] font-medium text-[14px] text-dm-ink-2 transition-colors hover:text-dm-ink"
                href={`/${l}/download`}
              >
                {t('pricing.finalCta.ctaFree')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
