import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import { cx } from '@repo/shared/utils'

export async function PricingHero({
  locale,
  earlyBirdActive = false
}: {
  locale: Locale
  earlyBirdActive?: boolean
}) {
  const { t } = await getTranslation(locale)
  const cjk = locale === 'zh' || locale === 'ja'
  return (
    <section className="relative overflow-hidden px-5 pt-12 pb-8 sm:px-8 sm:pt-16 sm:pb-10">
      <div
        aria-hidden
        className="pointer-events-none absolute top-5 left-1/2 -z-[1] h-[420px] w-[900px] -translate-x-1/2 blur-[40px]"
        style={{
          background:
            'radial-gradient(ellipse at center top, color-mix(in srgb, var(--color-dm-accent-2) 22%, transparent), transparent 60%)'
        }}
      />
      <div className="mx-auto max-w-[1140px] text-center">
        {earlyBirdActive ? (
          <span className="inline-flex items-center gap-[10px] rounded-full border border-dm-line-strong bg-dm-bg-elev py-[5px] pr-[10px] pl-[6px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-2">
            <span
              className="dm-animated h-[6px] w-[6px] rounded-full"
              style={{
                background: 'var(--color-dm-warn)',
                boxShadow: '0 0 0 4px color-mix(in srgb, var(--color-dm-warn) 30%, transparent)',
                animation: 'dm-pulse 900ms ease-in-out infinite'
              }}
            />
            <span>{t('pricing.hero.eyebrow')}</span>
            <span
              className="rounded-full px-2 py-[2px] font-semibold text-[10px]"
              style={{ background: 'var(--color-dm-warn)', color: 'var(--color-dm-bg)' }}
            >
              {t('pricing.hero.eyebrowTag')}
            </span>
          </span>
        ) : null}

        <h1
          className={cx(
            'mx-auto font-bold text-[clamp(48px,7vw,88px)] text-dm-ink',
            earlyBirdActive && 'mt-[22px]',
            cjk
              ? 'leading-[1.08] tracking-normal'
              : 'max-w-[16ch] leading-[0.98] tracking-[-0.04em]'
          )}
        >
          {t('pricing.hero.titleLead')}
          {cjk ? <br /> : ' '}
          <em
            className={
              cjk
                ? 'font-normal text-dm-accent not-italic'
                : 'font-[var(--font-dm-display)] font-normal text-dm-accent italic tracking-[-0.02em]'
            }
          >
            {t('pricing.hero.titleAccent')}
          </em>
        </h1>

        <p className="mx-auto mt-[22px] max-w-[58ch] text-[18px] text-dm-ink-3 leading-[1.5]">
          {t('pricing.hero.description')}
        </p>
      </div>
    </section>
  )
}
