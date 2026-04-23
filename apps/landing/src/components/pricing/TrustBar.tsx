import { pricingConfig } from '@/config/pricing'

export function TrustBar() {
  return (
    <section className="px-8">
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-6 border-dm-line border-y py-6 text-[12px] text-dm-ink-3 md:grid-cols-4">
        <div>
          <div className="font-[var(--font-dm-mono)] uppercase tracking-wider">Payments</div>
          <div className="mt-1 text-dm-ink-2">Stripe · cards &amp; Apple Pay</div>
        </div>
        <div>
          <div className="font-[var(--font-dm-mono)] uppercase tracking-wider">Refund</div>
          <div className="mt-1 text-dm-ink-2">{pricingConfig.refund.days}-day money-back</div>
        </div>
        <div>
          <div className="font-[var(--font-dm-mono)] uppercase tracking-wider">Users</div>
          <div className="mt-1 text-dm-ink-2">{pricingConfig.trust.users.toLocaleString()}</div>
        </div>
        <div>
          <div className="font-[var(--font-dm-mono)] uppercase tracking-wider">GitHub stars</div>
          <div className="mt-1 text-dm-ink-2">
            {pricingConfig.trust.githubStars.toLocaleString()}
          </div>
        </div>
      </div>
    </section>
  )
}
