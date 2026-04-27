import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import { downloadsConfig } from '@/config/downloads'
import { formatDate } from '@/lib/format'

export async function DownloadHero({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)
  const { latest } = downloadsConfig
  const releaseDate = formatDate(latest.releaseDate, locale)
  return (
    <section className="relative overflow-hidden px-5 pt-10 pb-8 sm:px-8 sm:pt-14 sm:pb-10">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -z-[1] h-[420px] w-[900px] -translate-x-1/2 blur-[40px]"
        style={{
          background:
            'radial-gradient(ellipse at center top, color-mix(in srgb, var(--color-dm-accent-2) 22%, transparent), transparent 60%)'
        }}
      />
      <div className="mx-auto max-w-[1140px]">
        <span className="inline-flex items-center gap-[10px] rounded-full border border-dm-line-strong bg-dm-bg-elev py-[5px] pr-[10px] pl-[6px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-2">
          <span
            className="h-[6px] w-[6px] rounded-full"
            style={{
              background: 'var(--color-dm-ok)',
              boxShadow: '0 0 0 4px color-mix(in srgb, var(--color-dm-ok) 30%, transparent)',
              animation: 'dm-pulse 2.2s ease-in-out infinite'
            }}
          />
          <span>
            {t('download.hero.kickerStable', { version: latest.version, date: releaseDate })}
          </span>
          <span className="rounded-full bg-dm-ink px-2 py-[2px] font-semibold text-[10px] text-dm-bg tracking-[0.04em]">
            {t('download.hero.kickerTag')}
          </span>
        </span>

        <h1
          className="mt-[22px] font-bold text-[clamp(44px,6.4vw,80px)] text-dm-ink leading-[0.98] tracking-[-0.04em]"
          style={{ maxWidth: locale === 'zh' || locale === 'ja' ? 'none' : '16ch' }}
        >
          {t('download.hero.titleLead')}
          {locale === 'zh' || locale === 'ja' ? <br /> : ' '}
          <em
            className="bg-clip-text font-[var(--font-dm-display)] font-normal text-transparent italic"
            style={{
              backgroundImage: 'linear-gradient(135deg, var(--color-dm-accent-2), #8b5cf6)',
              letterSpacing: '-0.02em'
            }}
          >
            {t('download.hero.titleAccent')}
          </em>
        </h1>

        <p className="mt-[22px] max-w-[60ch] text-[17px] text-dm-ink-3 leading-[1.5]">
          {t('download.hero.descriptionPre')}
          <a
            className="border-b"
            href={latest.releaseUrl}
            rel="noopener noreferrer"
            style={{
              color: 'var(--color-dm-accent-2)',
              borderBottomColor: 'color-mix(in srgb, var(--color-dm-accent-2) 40%, transparent)'
            }}
            target="_blank"
          >
            {t('download.hero.descriptionLink')}
          </a>
          {t('download.hero.descriptionPost')}
        </p>

        <div className="mt-10 grid overflow-hidden rounded-[14px] border border-dm-line bg-dm-bg-elev md:grid-cols-4">
          <ReleaseMetaCell
            label={t('download.hero.meta.version')}
            value={
              <span className="font-[var(--font-dm-mono)] font-medium text-[14px] text-dm-ink-2">
                v{latest.version}
              </span>
            }
          />
          <ReleaseMetaCell label={t('download.hero.meta.released')} value={releaseDate} />
          <ReleaseMetaCell label={t('download.hero.meta.size')} value="~18 MB" />
          <ReleaseMetaCell
            label={t('download.hero.meta.platforms')}
            last
            value={t('download.hero.meta.platformsValue')}
          />
        </div>
      </div>
    </section>
  )
}

function ReleaseMetaCell({
  label,
  value,
  last
}: {
  label: string
  value: React.ReactNode
  last?: boolean
}) {
  return (
    <div
      className={`p-[18px_22px] ${last ? '' : 'border-dm-line border-b md:border-r md:border-b-0'}`}
    >
      <div className="font-[var(--font-dm-mono)] text-[11px] text-dm-ink-4 uppercase tracking-[0.05em]">
        {label}
      </div>
      <div className="mt-1 font-semibold text-[16px] text-dm-ink tabular-nums tracking-[-0.01em]">
        {value}
      </div>
    </div>
  )
}
