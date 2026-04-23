import { pricingConfig } from '@/config/pricing'

export function TrustBar() {
  return (
    <section className="px-8">
      <div className="mx-auto max-w-[1140px]">
        <div className="flex flex-wrap items-center justify-center gap-8 border-dm-line border-y py-6">
          <Item>
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: 'var(--color-dm-ink-4)' }}
              viewBox="0 0 24 24"
              width="14"
            >
              <rect height="10" rx="2" width="16" x="4" y="11" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span>Stripe secure checkout</span>
          </Item>
          <Item>
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: 'var(--color-dm-ink-4)' }}
              viewBox="0 0 24 24"
              width="14"
            >
              <path d="M12 2l9 4v6c0 5-3.5 9.5-9 10-5.5-.5-9-5-9-10V6l9-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span>{pricingConfig.refund.days}-day refund, no questions</span>
          </Item>
          <Item>
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: 'var(--color-dm-ink-4)' }}
              viewBox="0 0 24 24"
              width="14"
            >
              <path d="M12 2v20M2 12h20" />
            </svg>
            <span>
              <Num>{pricingConfig.trust.users.toLocaleString()}+</Num> developers
            </span>
          </Item>
          <Item>
            <svg
              fill="currentColor"
              height="14"
              style={{ color: 'var(--color-dm-ink-4)' }}
              viewBox="0 0 24 24"
              width="14"
            >
              <path d="M12 2l2.5 6.7L22 9.5l-5.5 5 1.5 7.5L12 18.5 6 22l1.5-7.5L2 9.5l7.5-.8z" />
            </svg>
            <span>
              <Num>{pricingConfig.trust.githubStars.toLocaleString()}</Num> GitHub stars
            </span>
          </Item>
        </div>
      </div>
    </section>
  )
}

function Item({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 font-[var(--font-dm-mono)] text-[12px] text-dm-ink-3">
      {children}
    </div>
  )
}

function Num({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-semibold text-[13px] text-dm-ink tabular-nums">{children}</span>
  )
}
