import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import type { CompareFaqItem } from '@/config/compare'
import s from './compare.module.css'
import { SectionHeading } from './SectionHeading'

/** Collapsed questions; the answers stay in the HTML for readers who open them and for search. */
export async function CompareFaq({ locale, items }: { locale: Locale; items: CompareFaqItem[] }) {
  const { t } = await getTranslation(locale)
  const cjk = locale === 'zh' || locale === 'ja'
  return (
    <section className="px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-[1140px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-14">
        <SectionHeading
          accent={t('compare.faq.titleAccent')}
          cjk={cjk}
          kicker={t('compare.faq.kicker')}
          lead={t('compare.faq.titleLead')}
        />
        <div className="border-dm-line border-t">
          {items.map((item) => (
            <details className={`group border-dm-line border-b ${s.faq}`} key={item.question}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-semibold text-[16px] text-dm-ink tracking-[-0.01em] outline-none focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-dm-accent focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden">
                {item.question}
                <svg
                  aria-hidden="true"
                  className="size-4 shrink-0 text-dm-ink-4 transition-transform duration-300 ease-[var(--ease-out-strong)] group-open:rotate-45 motion-reduce:transition-none"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 3v10M3 8h10" />
                </svg>
              </summary>
              <p className="mt-0 mb-0 max-w-[62ch] pr-10 pb-6 text-[15px] text-dm-ink-3 leading-[1.65]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
