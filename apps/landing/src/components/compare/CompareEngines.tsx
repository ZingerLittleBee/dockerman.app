import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import Link from 'next/link'
import { ENGINES, KUBERNETES_LOGO, type LogoFit, PLATFORM_LABEL } from '@/components/home/data'
import { BrandMark } from '@/components/shell/BrandMark'
import { EngineLogo } from './EngineLogo'
import { SectionHeading } from './SectionHeading'

interface Tile {
  name: string
  logo: string
  fit: LogoFit
  tags: string[]
}

const TILES: Tile[] = [
  ...ENGINES.map((engine) => ({
    name: engine.name,
    logo: engine.logo,
    fit: engine.fit,
    tags: engine.platforms.map((platform) => PLATFORM_LABEL[platform])
  })),
  { name: 'Kubernetes', logo: KUBERNETES_LOGO, fit: 'pad', tags: ['kubeconfig', 'k3d'] }
]

/** Seven tiles share the row on wide screens; the bus runs between the first and last centers. */
const BUS_INSET = `calc((100% - ${(TILES.length - 1) * 12}px) / ${TILES.length * 2})`

export async function CompareEngines({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)
  const cjk = locale === 'zh' || locale === 'ja'
  return (
    <section className="px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[1140px]">
        <SectionHeading
          accent={t('compare.engines.titleAccent')}
          cjk={cjk}
          description={t('compare.engines.description')}
          kicker={t('compare.engines.kicker')}
          lead={t('compare.engines.titleLead')}
        />

        <div className="mt-12">
          <div className="flex justify-center">
            <span className="inline-flex rounded-[14px] border border-dm-line-strong bg-dm-bg-elev px-5 py-3 text-[18px] text-dm-ink shadow-[0_18px_50px_-24px_color-mix(in_srgb,var(--color-dm-accent-2)_55%,transparent)]">
              <BrandMark />
            </span>
          </div>

          <div aria-hidden="true" className="relative hidden h-12 lg:block">
            <span className="absolute top-0 left-1/2 h-1/2 w-px bg-gradient-to-b from-dm-accent to-dm-line-strong" />
            <span
              className="absolute top-1/2 h-px bg-dm-line-strong"
              style={{ left: BUS_INSET, right: BUS_INSET }}
            />
          </div>

          <ul className="m-0 mt-8 flex list-none flex-wrap justify-center gap-3 p-0 lg:mt-0 lg:flex-nowrap">
            {TILES.map((tile) => (
              <li
                className="relative flex basis-[calc((100%-24px)/3)] flex-col items-center gap-3 rounded-[14px] border border-dm-line bg-dm-bg-elev px-2 pt-5 pb-4 text-center sm:basis-[calc((100%-36px)/4)] lg:flex-1 lg:basis-0 lg:before:absolute lg:before:bottom-full lg:before:left-1/2 lg:before:h-6 lg:before:w-px lg:before:bg-dm-line-strong"
                key={tile.name}
              >
                <EngineLogo className="size-11 rounded-[11px]" fit={tile.fit} src={tile.logo} />
                <span className="font-semibold text-[13.5px] text-dm-ink leading-tight">
                  {tile.name}
                </span>
                <span className="flex flex-wrap justify-center gap-1">
                  {tile.tags.map((tag) => (
                    <span
                      className="rounded-[5px] bg-dm-bg-soft px-1.5 py-0.5 font-[var(--font-dm-mono)] text-[10.5px] text-dm-ink-3"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-8 mb-0 flex flex-wrap justify-center gap-x-6 gap-y-2 font-[var(--font-dm-mono)] text-[13px]">
            <Link
              className="text-dm-ink-3 hover:text-dm-ink"
              href={`/${locale}/docs/platform/windows`}
            >
              {t('compare.links.windowsDocs')} <span aria-hidden="true">→</span>
            </Link>
            <Link
              className="text-dm-ink-3 hover:text-dm-ink"
              href={`/${locale}/docs/platform/macos`}
            >
              {t('compare.links.macosDocs')} <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
