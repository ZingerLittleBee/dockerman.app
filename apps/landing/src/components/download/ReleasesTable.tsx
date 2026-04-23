import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import Link from 'next/link'
import { downloadsConfig } from '@/config/downloads'

export async function ReleasesTable({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)
  return (
    <section className="px-8 pt-20 pb-10">
      <div className="mx-auto max-w-[1140px]">
        <div className="mb-8 max-w-[680px]">
          <div
            className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
            style={{ color: 'var(--color-dm-accent-2)' }}
          >
            <span className="text-dm-ink-4">// </span>
            {t('download.releases.kicker')}
          </div>
          <h2 className="mx-0 mt-[10px] mb-3 font-bold text-[clamp(28px,3.6vw,40px)] text-dm-ink leading-[1.05] tracking-[-0.03em]">
            {t('download.releases.titleLead')}{' '}
            <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
              {t('download.releases.titleAccent')}
            </em>
          </h2>
          <p className="m-0 text-[15.5px] text-dm-ink-3 leading-[1.55]">
            {t('download.releases.description')}
          </p>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-dm-line bg-dm-bg-elev">
          {downloadsConfig.history.map((h, i) => {
            const noteKey = `download.releases.notes.${h.summarySlug}`
            const translated = t(noteKey)
            const note = translated === noteKey ? t('download.releases.fallbackNote') : translated
            return (
              <div
                className="grid items-center gap-4 border-dm-line border-b px-[22px] py-[14px] last:border-b-0 hover:bg-dm-bg-soft"
                key={h.version}
                style={{ gridTemplateColumns: '120px 1fr 180px 80px' }}
              >
                <div className="font-[var(--font-dm-mono)] font-semibold text-[13px] tracking-[-0.01em]">
                  v{h.version}
                  {i === 0 ? (
                    <span
                      className="ml-2 rounded px-[6px] py-[2px] font-bold text-[9.5px] tracking-[0.04em]"
                      style={{
                        background: 'color-mix(in srgb, var(--color-dm-accent-2) 14%, transparent)',
                        color: 'var(--color-dm-accent-2)'
                      }}
                    >
                      {t('download.releases.latest')}
                    </span>
                  ) : null}
                </div>
                <div className="hidden truncate text-[13px] text-dm-ink-2 md:block">{note}</div>
                <div className="font-[var(--font-dm-mono)] text-[12px] text-dm-ink-4">{h.date}</div>
                <Link
                  className="text-right font-[var(--font-dm-mono)] text-[12px] text-dm-ink-3 no-underline hover:text-[var(--color-dm-accent-2)]"
                  href={`/${locale}/changelog#${h.summarySlug}`}
                >
                  {t('download.releases.notesLink')}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
