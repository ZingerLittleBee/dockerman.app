import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import { Tooltip } from '@/components/Tooltip'
import { pricingConfig } from '@/config/pricing'

export async function TrustBar({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)
  return (
    <section>
      <div className="mx-auto max-w-[1140px]">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 border-dm-line border-y py-5 sm:gap-8 sm:py-6">
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
            <span>{t('pricing.trust.secure')}</span>
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
            <span>{t('pricing.trust.refund', { days: pricingConfig.refund.days })}</span>
          </Item>
          <Item>
            <svg
              fill="none"
              height="14"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              style={{ color: 'var(--color-dm-ink-4)' }}
              viewBox="0 0 24 24"
              width="14"
            >
              <path d="M12 3v12" />
              <path d="M7 10l5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            <Tooltip
              content={t('pricing.trust.downloadsEstimatedFrom', {
                source: pricingConfig.trust.downloadsEstimatedFrom
              })}
              side="top"
              triggerAsChild
            >
              <span className="cursor-help underline decoration-dm-ink-4/40 decoration-dotted underline-offset-[3px]">
                {t('pricing.trust.downloads', {
                  value: pricingConfig.trust.monthlyDownloads.toLocaleString()
                })}
              </span>
            </Tooltip>
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
              {t('pricing.trust.stars', {
                value: pricingConfig.trust.githubStars.toLocaleString()
              })}
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
