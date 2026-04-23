import type { Locale } from '@repo/shared/i18n'
import type { Metadata } from 'next'
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
    'Pay once. Use forever. Free for local Docker. One flat, lifetime price for remote hosts, SSH, and multi-machine management.',
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const l = locale as Locale
  const { plans, earlyBirdDeadlineUtc, refund } = pricingConfig
  const isActive = new Date(earlyBirdDeadlineUtc).getTime() > Date.now()

  const teamPrice = isActive ? plans.team.priceEarlyBird : plans.team.priceRegular
  const soloPrice = isActive ? plans.solo.priceEarlyBird : plans.solo.priceRegular

  return (
    <main>
      <PricingHero />

      {/* Countdown bar */}
      <section className="px-8 pb-10">
        <div className="mx-auto mt-2 max-w-[560px]">
          <div
            className="flex flex-wrap items-center gap-5 rounded-[14px] border p-5"
            style={{
              borderColor:
                'color-mix(in srgb, var(--color-dm-warn) 30%, var(--color-dm-line-strong))',
              backgroundImage: `radial-gradient(ellipse at 10% 50%, color-mix(in srgb, var(--color-dm-warn) 10%, transparent), transparent 60%)`,
              backgroundColor: 'var(--color-dm-bg-elev)',
            }}
          >
            <div
              className="grid h-[38px] w-[38px] flex-shrink-0 place-items-center rounded-[9px]"
              style={{
                background: 'color-mix(in srgb, var(--color-dm-warn) 14%, transparent)',
                color: 'var(--color-dm-warn)',
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
                Early Bird pricing ends{' '}
                <span
                  className="ml-2 rounded px-[7px] py-[2px] font-[var(--font-dm-mono)] font-bold text-[10px] tracking-[0.04em]"
                  style={{ background: 'var(--color-dm-warn)', color: '#000' }}
                >
                  JUN 30
                </span>
              </div>
              <div className="mt-[3px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-3">
                after that, 1-device ${plans.solo.priceRegular} · {plans.team.devices}-device $
                {plans.team.priceRegular}
              </div>
            </div>
            <Countdown deadlineUtc={earlyBirdDeadlineUtc} />
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
              ctaLabel="Current plan"
              ctaNote="you're on this plan"
              ctaVariant="disabled"
              description="Every feature, no time limit. Local Docker and Podman only."
              features={[
                { label: 'Container, image, volume, network' },
                { label: 'Compose projects & one-click deploy' },
                { label: 'Command palette, terminal, logs' },
                { label: 'Podman, Trivy scan, file browser' },
                { label: 'Light & dark themes, i18n (en/zh)' },
                { label: 'Remote hosts via SSH', included: false },
                { label: 'Multi-host management', included: false },
              ]}
              freq="forever · local only"
              label="free"
              name="Free"
              price={0}
            />

            {/* Team (highlighted) */}
            <PlanCard
              ctaHref="/checkout/team"
              ctaLabel={`Get Team — $${teamPrice}`}
              ctaNote={`one payment, ${refund.days}-day refund, lifetime updates`}
              ctaVariant="primary"
              description="Best value for small teams or anyone running multiple machines. Transferable licenses."
              features={[
                { label: <span className="font-semibold text-dm-ink">Everything in Free</span> },
                {
                  label: (
                    <>
                      <span className="font-semibold text-dm-ink">
                        ${(teamPrice / plans.team.devices).toFixed(2)}/device
                      </span>{' '}
                      — save $10 vs 1-device × {plans.team.devices}
                    </>
                  ),
                },
                { label: 'Remote Docker over SSH with heartbeat' },
                { label: 'Multi-host switching & bookmarks' },
                { label: 'Cloudflared tunnel management' },
                { label: 'Kubernetes cluster management' },
                { label: 'Lifetime updates & priority support' },
              ]}
              freq={`one-time · ${plans.team.devices} devices`}
              highlighted
              label={`${plans.team.devices} devices`}
              name={
                <>
                  Team{' '}
                  <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-3 italic">
                    or
                  </em>{' '}
                  multi-Mac
                </>
              }
              price={teamPrice}
              ribbon="Most popular"
              strikePrice={isActive ? `$${plans.team.priceRegular}` : undefined}
            />

            {/* Solo */}
            <PlanCard
              ctaHref="/checkout/solo"
              ctaLabel={`Get Solo — $${soloPrice}`}
              ctaNote={`one payment, ${refund.days}-day refund`}
              ctaVariant="ghost"
              description="For the individual developer. One license, one machine, everything unlocked."
              features={[
                { label: <span className="font-semibold text-dm-ink">Everything in Free</span> },
                { label: 'Remote Docker over SSH' },
                { label: 'Multi-host management' },
                { label: 'Cloudflared tunnels' },
                { label: 'Kubernetes clusters' },
                { label: 'Lifetime updates' },
              ]}
              freq="one-time · 1 device"
              label="1 device"
              name="Solo"
              price={soloPrice}
              strikePrice={isActive ? `$${plans.solo.priceRegular}` : undefined}
            />
          </div>

          <TrustBar />
        </div>
      </section>

      <ComparisonTable />
      <PricingFaq />

      {/* Final CTA (scoped to pricing design) */}
      <section className="px-8 pt-20">
        <div className="mx-auto max-w-[1140px]">
          <div
            className="relative overflow-hidden rounded-[20px] border border-dm-line bg-dm-bg-elev px-10 py-16 text-center"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--color-dm-accent-2) 10%, transparent), transparent 55%)`,
              }}
            />
            <h3 className="relative m-0 font-bold text-[clamp(28px,3.6vw,40px)] text-dm-ink leading-[1.1] tracking-[-0.03em]">
              Ship containers.{' '}
              <em
                className="bg-clip-text font-[var(--font-dm-display)] font-normal text-transparent italic"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, var(--color-dm-accent-2), #8b5cf6)',
                }}
              >
                From anywhere.
              </em>
            </h3>
            <p className="relative mx-auto mt-4 max-w-[52ch] text-[15px] text-dm-ink-3">
              Pay once, keep it forever. No seat math, no renewals, no upsells.
            </p>
            <div className="relative mt-7 inline-flex flex-wrap items-center justify-center gap-[10px]">
              <a
                className="inline-flex items-center gap-2 rounded-[10px] px-[22px] py-[13px] font-semibold text-[14px] text-white no-underline transition-transform hover:-translate-y-px"
                href="/checkout/team"
                style={{
                  background:
                    'linear-gradient(180deg, var(--color-dm-accent-2), color-mix(in srgb, var(--color-dm-accent-2) 80%, black))',
                  boxShadow:
                    '0 10px 24px -8px color-mix(in srgb, var(--color-dm-accent-2) 55%, transparent)',
                }}
              >
                Get Team — ${teamPrice}
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
                or start free →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
