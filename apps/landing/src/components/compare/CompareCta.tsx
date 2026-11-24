import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import { cx } from '@repo/shared/utils'
import Link from 'next/link'
import type { CompareVars } from '@/config/compare'
import { EngineStack } from './EngineLogo'

const STEP_KEYS = ['download', 'open', 'done'] as const

/**
 * Closing card: switching is three steps because Dockerman reads the engine already in place.
 * The `dark` scope keeps the card dark in both themes.
 */
export async function CompareCta({ locale, vars }: { locale: Locale; vars: CompareVars }) {
  const { t } = await getTranslation(locale)
  const cjk = locale === 'zh' || locale === 'ja'
  return (
    <section className="px-5 pt-6 pb-16 sm:px-8 sm:pt-10 sm:pb-24">
      <div className="dark relative mx-auto max-w-[1140px] overflow-hidden rounded-[24px] border border-dm-line-strong bg-dm-bg-elev text-dm-ink [color-scheme:dark]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 70% 90% at 0% 0%, color-mix(in srgb, var(--color-dm-accent-2) 26%, transparent), transparent 60%),
              radial-gradient(ellipse 60% 70% at 100% 100%, color-mix(in srgb, var(--color-dm-accent) 14%, transparent), transparent 60%)`
          }}
        />
        <div className="relative grid gap-12 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <div className="font-[var(--font-dm-mono)] text-[12px] text-dm-accent tracking-[0.04em]">
              <span aria-hidden="true" className="text-dm-ink-4 before:content-['//_']" />
              {t('compare.close.kicker')}
            </div>
            <h2
              className={cx(
                'mx-0 mt-3 mb-0 text-balance font-bold text-[clamp(32px,4.4vw,52px)] text-dm-ink',
                cjk ? 'leading-[1.2] tracking-normal' : 'leading-[1.02] tracking-[-0.04em]'
              )}
            >
              {t('compare.close.titleLead')}
              <br />
              <em
                className={
                  cjk
                    ? 'font-normal text-dm-ink-3 not-italic'
                    : 'font-[var(--font-dm-display)] font-normal text-dm-ink-3 italic tracking-[-0.02em]'
                }
              >
                {t('compare.close.titleAccent')}
              </em>
            </h2>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex items-center gap-[10px] rounded-[10px] bg-dm-ink px-5 py-3 font-semibold text-[14px] text-dm-bg no-underline transition-transform hover:-translate-y-px active:translate-y-0 active:scale-[0.97]"
                href={`/${locale}/download`}
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
                className="inline-flex items-center rounded-[10px] border border-dm-line-strong px-[18px] py-3 font-medium text-[14px] text-dm-ink-2 transition-[color,background-color,border-color,transform] hover:bg-dm-bg-soft hover:text-dm-ink active:scale-[0.97]"
                href={`/${locale}/pricing`}
              >
                {t('compare.cta.pricing')}
              </Link>
            </div>
          </div>

          {/* The ::before rail runs behind the step numbers. */}
          <ol className="relative m-0 flex list-none flex-col gap-7 p-0 before:absolute before:top-5 before:bottom-5 before:left-5 before:w-px before:bg-gradient-to-b before:from-dm-accent before:via-dm-line-strong before:to-dm-line">
            {STEP_KEYS.map((key, i) => (
              <li className="relative flex items-start gap-5" key={key}>
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-dm-line-strong bg-dm-bg-elev font-[var(--font-dm-mono)] font-medium text-[13px] text-dm-accent">
                  {`0${i + 1}`}
                </span>
                <div className="min-w-0 pt-1.5">
                  <div className="font-semibold text-[17px] text-dm-ink tracking-[-0.01em]">
                    {t(`compare.close.steps.${key}.title`)}
                  </div>
                  <div className="mt-1 text-[14px] text-dm-ink-3 leading-[1.5]">
                    {t(`compare.close.steps.${key}.body`, vars)}
                  </div>
                  {key === 'open' ? <EngineStack className="mt-3" /> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
