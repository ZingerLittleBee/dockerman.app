import { Pill } from '@/components/ui-dm/Pill'

export function PricingHero() {
  return (
    <section className="px-8 pt-16 pb-8">
      <div className="mx-auto max-w-[1240px]">
        <Pill>Early bird · 30% off until June 30</Pill>
        <h1 className="mt-5 max-w-[18ch] font-bold text-[clamp(40px,6vw,72px)] text-dm-ink leading-[0.95] tracking-[-0.04em]">
          Simple pricing,{' '}
          <span
            className="italic"
            style={{
              fontFamily: 'var(--font-dm-display)',
              backgroundImage:
                'linear-gradient(135deg, var(--color-dm-accent) 0%, var(--color-dm-accent-2) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              fontWeight: 400
            }}
          >
            no seats, no surveillance.
          </span>
        </h1>
      </div>
    </section>
  )
}
