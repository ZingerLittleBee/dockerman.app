import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import { cx } from '@repo/shared/utils'
import Link from 'next/link'
import { siteConfig } from '@/app/siteConfig'
import { ENGINES } from '@/components/home/data'
import { EngineLogo } from './EngineLogo'

/** Docker Desktop's bundle, top to bottom. */
const DESKTOP_LAYERS = ['ui', 'extensions', 'engine', 'vm'] as const

/** Entrance: Desktop's layers stack up from the VM, then Dockerman's UI settles onto the engines. */
const STACK_STEP_MS = 90
const UI_DROP_DELAY_MS = 520

export async function CompareHero({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)
  const cjk = locale === 'zh' || locale === 'ja'
  return (
    <section className="relative overflow-hidden px-5 pt-12 pb-10 sm:px-8 sm:pt-20 sm:pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute top-5 left-1/2 -z-[1] h-[420px] w-[900px] -translate-x-1/2 blur-[40px]"
        style={{
          background:
            'radial-gradient(ellipse at center top, color-mix(in srgb, var(--color-dm-accent-2) 22%, transparent), transparent 60%)'
        }}
      />
      <div className="mx-auto grid max-w-[1140px] items-center gap-12 lg:grid-cols-2 lg:gap-14">
        <div>
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
              'mt-6 text-balance font-bold text-[clamp(40px,4.8vw,60px)] text-dm-ink',
              cjk ? 'leading-[1.12] tracking-normal' : 'leading-[1] tracking-[-0.04em]'
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

          <p className="mt-5 mb-0 max-w-[44ch] text-pretty text-[17px] text-dm-ink-3 leading-[1.55]">
            {t('compare.hero.description')}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
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

        <StackDiagram t={t} />
      </div>
    </section>
  )
}

type HeroT = Awaited<ReturnType<typeof getTranslation>>['t']

/**
 * Docker Desktop ships UI, extensions, engine and VM as one solid stack; Dockerman is a single thin
 * UI layer over whichever engine is already installed (the dashed box). Both stacks share a baseline.
 */
function StackDiagram({ t }: { t: HeroT }) {
  return (
    <div className="relative rounded-[20px] border border-dm-line bg-dm-bg-elev p-4 shadow-[0_40px_90px_-50px_color-mix(in_srgb,var(--color-dm-accent-2)_55%,transparent)] sm:p-7">
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <div className="flex flex-col">
          <div className="mb-5 font-semibold text-[13px] text-dm-ink-3 sm:text-[14px]">
            {t('compare.table.columns.desktop')}
          </div>
          <div className="mt-auto flex flex-col gap-1.5 rounded-[14px] border border-dm-line-strong bg-dm-bg-soft p-1.5">
            {DESKTOP_LAYERS.map((layer, i) => (
              <div
                className="rounded-[9px] border border-dm-line bg-dm-bg-elev px-3 py-3 font-medium text-[12.5px] text-dm-ink-2 leading-tight motion-safe:animate-slide-up-fade sm:py-3.5 sm:text-[13.5px]"
                key={layer}
                style={{ animationDelay: `${(DESKTOP_LAYERS.length - 1 - i) * STACK_STEP_MS}ms` }}
              >
                {t(`compare.hero.diagram.layers.${layer}`)}
              </div>
            ))}
          </div>
          <div className="mt-3 font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-4">
            {t('compare.hero.diagram.bundle')}
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-5 font-semibold text-[13px] text-dm-accent sm:text-[14px]">
            {t('compare.table.columns.dockerman')}
          </div>
          <div className="mt-auto flex flex-col">
            <div
              className="flex items-center justify-between gap-2 rounded-[12px] border border-[color-mix(in_srgb,var(--color-dm-accent)_45%,transparent)] bg-[color-mix(in_srgb,var(--color-dm-accent)_10%,var(--color-dm-bg-elev))] px-3 py-3 shadow-[0_12px_30px_-14px_color-mix(in_srgb,var(--color-dm-accent-2)_70%,transparent)] motion-safe:animate-slide-down-fade sm:py-3.5"
              style={{ animationDelay: `${UI_DROP_DELAY_MS}ms` }}
            >
              <span className="font-semibold text-[12.5px] text-dm-ink leading-tight sm:text-[13.5px]">
                {t('compare.hero.diagram.ui')}
              </span>
              <span className="font-[var(--font-dm-mono)] text-[11px] text-dm-accent sm:text-[12px]">
                {t('compare.hero.diagram.uiSize')}
              </span>
            </div>
            <span
              aria-hidden="true"
              className="mx-auto block h-5 w-px bg-gradient-to-b from-dm-accent to-dm-line-strong sm:h-6"
            />
            <div className="grid grid-cols-3 justify-items-center gap-1.5 rounded-[12px] border border-dm-line-strong border-dashed p-2 sm:flex sm:justify-between sm:gap-1.5">
              {ENGINES.map((engine) => (
                <span className="flex" key={engine.name} title={engine.name}>
                  <EngineLogo className="size-7 rounded-[7px]" fit={engine.fit} src={engine.logo} />
                  <span className="sr-only">{engine.name}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="mt-3 font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-4">
            {t('compare.hero.diagram.yourEngine')}
          </div>
        </div>
      </div>
    </div>
  )
}
