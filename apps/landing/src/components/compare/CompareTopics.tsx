import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import Link from 'next/link'
import type { CompareVars } from '@/config/compare'

const TOPIC_KEYS = ['footprint', 'license', 'engines', 'domains', 'pricing'] as const

export async function CompareTopics({ locale, vars }: { locale: Locale; vars: CompareVars }) {
  const { t } = await getTranslation(locale)
  return (
    <section className="px-5 pt-8 pb-6 sm:px-8 sm:pt-16">
      <div className="mx-auto max-w-[1140px]">
        <div className="mb-9 max-w-[680px]">
          <div
            className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
            style={{ color: 'var(--color-dm-accent)' }}
          >
            <span aria-hidden="true" className="text-dm-ink-4 before:content-['//_']" />
            {t('compare.topics.kicker')}
          </div>
          <h2
            className={
              locale === 'zh' || locale === 'ja'
                ? 'mx-0 mt-[10px] mb-3 font-bold text-[clamp(28px,3.6vw,40px)] text-dm-ink leading-[1.2] tracking-normal'
                : 'mx-0 mt-[10px] mb-3 font-bold text-[clamp(28px,3.6vw,40px)] text-dm-ink leading-[1.05] tracking-[-0.03em]'
            }
          >
            {t('compare.topics.titleLead')}
            {locale === 'zh' || locale === 'ja' ? '' : ' '}
            <em
              className={
                locale === 'zh' || locale === 'ja'
                  ? 'font-normal text-dm-ink-2 not-italic'
                  : 'font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic'
              }
            >
              {t('compare.topics.titleAccent')}
            </em>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {TOPIC_KEYS.map((key) => (
            <article
              className="rounded-[14px] border border-dm-line bg-dm-bg-elev px-5 py-6 sm:px-6 sm:py-7"
              key={key}
            >
              <h3 className="m-0 font-semibold text-[18px] text-dm-ink tracking-[-0.02em]">
                {t(`compare.topics.${key}.title`)}
              </h3>
              <p className="mt-3 mb-0 text-[14.5px] text-dm-ink-3 leading-[1.6]">
                {t(`compare.topics.${key}.body`, vars)}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="rounded-[14px] border border-dm-line bg-dm-bg-elev px-5 py-6 sm:px-6 sm:py-7">
            <h3 className="m-0 font-semibold text-[18px] text-dm-ink tracking-[-0.02em]">
              {t('compare.orbstack.title')}
            </h3>
            <p className="mt-3 mb-0 text-[14.5px] text-dm-ink-3 leading-[1.6]">
              {t('compare.orbstack.body')}
            </p>
          </article>
          <article className="rounded-[14px] border border-dm-line bg-dm-bg-elev px-5 py-6 sm:px-6 sm:py-7">
            <h3 className="m-0 font-semibold text-[18px] text-dm-ink tracking-[-0.02em]">
              {t('compare.desktopWins.title')}
            </h3>
            <p className="mt-3 mb-0 text-[14.5px] text-dm-ink-3 leading-[1.6]">
              {t('compare.desktopWins.body')}
            </p>
          </article>
        </div>

        <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-[var(--font-dm-mono)] text-[12.5px] text-dm-ink-3">
          <Link className="hover:text-dm-ink" href={`/${locale}/docs/platform/windows`}>
            {t('compare.links.windowsDocs')}
          </Link>
          <Link className="hover:text-dm-ink" href={`/${locale}/docs/platform/macos`}>
            {t('compare.links.macosDocs')}
          </Link>
          <Link className="hover:text-dm-ink" href={`/${locale}/pricing`}>
            {t('compare.links.pricing')}
          </Link>
          <Link className="hover:text-dm-ink" href={`/${locale}/download`}>
            {t('compare.links.download')}
          </Link>
        </p>
      </div>
    </section>
  )
}
