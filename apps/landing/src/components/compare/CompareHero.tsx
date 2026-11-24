import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import { cx } from '@repo/shared/utils'
import Image from 'next/image'
import Link from 'next/link'
import { siteConfig } from '@/app/siteConfig'
import type { CompareVars } from '@/config/compare'

/** Each figure pins to an edge of the screenshot on wide screens and joins a 2x2 grid below it otherwise. */
const STATS = [
  { key: 'installer', place: 'lg:top-[30%] lg:-left-6 xl:-left-14' },
  { key: 'memory', place: 'lg:top-[9%] lg:-right-6 xl:-right-14' },
  { key: 'local', place: 'lg:bottom-[8%] lg:-left-8 xl:-left-16' },
  { key: 'remote', place: 'lg:bottom-[26%] lg:-right-8 xl:-right-16' }
] as const

export async function CompareHero({ locale, vars }: { locale: Locale; vars: CompareVars }) {
  const { t } = await getTranslation(locale)
  const cjk = locale === 'zh' || locale === 'ja'
  const shot = `/compare/containers-${locale === 'zh' ? 'zh' : 'en'}.webp`
  return (
    <section className="relative overflow-hidden px-5 pt-14 pb-2 sm:px-8 sm:pt-20 sm:pb-4">
      <div
        aria-hidden
        className="pointer-events-none absolute top-5 left-1/2 -z-[1] h-[520px] w-[1000px] -translate-x-1/2 blur-[40px]"
        style={{
          background:
            'radial-gradient(ellipse at center top, color-mix(in srgb, var(--color-dm-accent-2) 22%, transparent), transparent 60%)'
        }}
      />
      <div className="mx-auto max-w-[1140px]">
        <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
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
            className={cx(
              'mt-6 text-balance font-bold text-[clamp(42px,6.4vw,80px)] text-dm-ink',
              cjk ? 'leading-[1.1] tracking-normal' : 'leading-[0.98] tracking-[-0.045em]'
            )}
          >
            {t('compare.hero.titleLead')}
            <br />
            <em
              className={
                cjk
                  ? 'font-normal text-dm-accent not-italic'
                  : 'bg-clip-text font-[var(--font-dm-display)] font-normal text-transparent italic'
              }
              style={
                cjk
                  ? undefined
                  : {
                      backgroundImage:
                        'linear-gradient(135deg, var(--color-dm-accent), var(--color-dm-accent-2))',
                      letterSpacing: '-0.02em'
                    }
              }
            >
              {t('compare.hero.titleAccent')}
            </em>
          </h1>

          <p className="mt-6 mb-0 max-w-[52ch] text-pretty text-[17px] text-dm-ink-3 leading-[1.55]">
            {t('compare.hero.description')}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
              <svg
                aria-hidden="true"
                fill="currentColor"
                height="14"
                viewBox="0 0 24 24"
                width="14"
              >
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

        <div className="relative mt-14 sm:mt-16">
          {/* The window fades out at the bottom, so it reads as rising out of the page. */}
          <div className="relative overflow-hidden rounded-t-[14px] border border-dm-line-strong border-b-0 bg-[#0a0a0a] shadow-[0_-20px_80px_-30px_color-mix(in_srgb,var(--color-dm-accent-2)_45%,transparent)] [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] max-sm:-mr-5 max-sm:rounded-tr-none max-sm:border-r-0">
            {/* Phones show the left part of the shot at a readable scale. */}
            <div className="relative max-sm:w-[170%]">
              <Image
                alt={t('compare.hero.shotAlt')}
                className="block h-auto w-full"
                height={832}
                priority
                sizes="(max-width: 639px) 170vw, (max-width: 1204px) 100vw, 1140px"
                src={shot}
                width={2048}
              />
              {/* macOS window controls, placed where the app leaves room for them (sized in % of the shot). */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-[3%] flex gap-[0.5%] pl-[1.25%] [&>i]:block [&>i]:aspect-square [&>i]:w-[0.75%] [&>i]:rounded-full"
              >
                <i className="bg-[#ff5f57]" />
                <i className="bg-[#febc2e]" />
                <i className="bg-[#28c840]" />
              </span>
            </div>
          </div>

          <dl className="m-0 mt-5 grid grid-cols-2 gap-3 lg:mt-0 lg:block">
            {STATS.map((stat, i) => (
              <div
                className={cx(
                  'flex flex-col-reverse gap-1.5 rounded-[14px] border border-dm-line bg-dm-bg-elev/90 px-4 py-3 shadow-[0_18px_40px_-22px_rgb(0_0_0/0.45)] backdrop-blur-md motion-safe:animate-slide-up-fade lg:absolute lg:min-w-[170px] lg:px-5 lg:py-4',
                  stat.place
                )}
                key={stat.key}
                style={{ animationDelay: `${240 + i * 90}ms` }}
              >
                <dt className="text-[12.5px] text-dm-ink-3 leading-[1.35]">
                  {t(`compare.stats.${stat.key}.label`)}
                </dt>
                <dd
                  className={cx(
                    'm-0 font-[var(--font-dm-mono)] font-semibold text-[22px] leading-none tracking-[-0.03em] sm:text-[26px]',
                    stat.key === 'local' ? 'text-dm-accent' : 'text-dm-ink'
                  )}
                >
                  {t(`compare.stats.${stat.key}.value`, vars)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
