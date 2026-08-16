import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import Link from 'next/link'
import { siteConfig } from '@/app/siteConfig'

export async function CompareHero({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)
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
      <div className="mx-auto max-w-[1140px]">
        <span className="inline-flex items-center gap-[10px] rounded-full border border-dm-line-strong bg-dm-bg-elev px-[10px] py-[5px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-2">
          <span
            className="h-[6px] w-[6px] rounded-full"
            style={{
              background: 'var(--color-dm-ok)',
              boxShadow: '0 0 0 4px color-mix(in srgb, var(--color-dm-ok) 30%, transparent)'
            }}
          />
          <span>{t('compare.hero.kicker')}</span>
          <span className="rounded-full bg-dm-ink px-2 py-[2px] font-semibold text-[10px] text-dm-bg tracking-[0.04em]">
            v{siteConfig.latestVersion}
          </span>
        </span>

        <h1
          className="mt-[22px] font-bold text-[clamp(44px,6.4vw,84px)] text-dm-ink leading-[0.98] tracking-[-0.04em]"
          style={{ maxWidth: locale === 'zh' || locale === 'ja' ? 'none' : '16ch' }}
        >
          {t('compare.hero.titleLead')}{' '}
          <em
            className="bg-clip-text font-[var(--font-dm-display)] font-normal text-transparent italic"
            style={{
              backgroundImage:
                'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))',
              letterSpacing: '-0.02em'
            }}
          >
            {t('compare.hero.titleAccent')}
          </em>
        </h1>

        <p className="mt-[22px] max-w-[62ch] text-[18px] text-dm-ink-3 leading-[1.5]">
          {t('compare.hero.description')}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            className="inline-flex items-center gap-[10px] rounded-[10px] px-5 py-3 font-semibold text-[14px] text-white no-underline transition-transform hover:-translate-y-px active:translate-y-0 active:scale-[0.97]"
            href={`/${locale}/download`}
            style={{
              background:
                'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))',
              boxShadow:
                '0 10px 30px -10px color-mix(in srgb, var(--color-dm-accent-2) 60%, transparent)'
            }}
          >
            <svg aria-hidden="true" fill="currentColor" height="14" viewBox="0 0 24 24" width="14">
              <path d="M12 16l-5-5h3V4h4v7h3l-5 5zm-7 4v-2h14v2H5z" />
            </svg>
            {t('compare.cta.download')}
          </Link>
          <Link
            className="inline-flex items-center rounded-[10px] border border-dm-line bg-dm-bg-elev px-[18px] py-3 font-medium text-[14px] text-dm-ink-2 transition-[color,background-color,border-color,transform] hover:border-dm-line-strong hover:text-dm-ink active:scale-[0.97]"
            href={`/${locale}/pricing`}
          >
            {t('compare.cta.pricing')}
          </Link>
        </div>
      </div>
    </section>
  )
}
