import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'

export async function CompareFaq({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)
  const raw = t('compare.faq.items', { returnObjects: true })
  const items = Array.isArray(raw)
    ? raw.filter(
        (item): item is { question: string; answer: string } =>
          typeof item === 'object' &&
          item !== null &&
          typeof (item as { question?: unknown }).question === 'string' &&
          typeof (item as { answer?: unknown }).answer === 'string'
      )
    : []

  return (
    <section className="px-5 pt-8 pb-4 sm:px-8 sm:pt-12">
      <div className="mx-auto max-w-[820px]">
        <div
          className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
          style={{ color: 'var(--color-dm-accent-2)' }}
        >
          <span aria-hidden="true" className="text-dm-ink-4 before:content-['//_']" />
          {t('compare.faq.kicker')}
        </div>
        <h2 className="mx-0 mt-[10px] mb-8 font-bold text-[clamp(28px,3.6vw,40px)] text-dm-ink leading-[1.05] tracking-[-0.03em]">
          {t('compare.faq.titleLead')}{' '}
          <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
            {t('compare.faq.titleAccent')}
          </em>
        </h2>
        <dl className="m-0 flex flex-col gap-6">
          {items.map((item) => (
            <div className="border-dm-line border-t pt-6" key={item.question}>
              <dt className="font-semibold text-[16px] text-dm-ink tracking-[-0.015em]">
                {item.question}
              </dt>
              <dd className="mt-2 mb-0 text-[14.5px] text-dm-ink-3 leading-[1.6]">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
