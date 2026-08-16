import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import type { CompareVars } from '@/config/compare'

const GRID = 'minmax(0, 1.4fr) minmax(0, 1.3fr) minmax(0, 1.3fr)'

const ROW_KEYS = [
  'install',
  'memory',
  'local',
  'license',
  'windows',
  'macos',
  'domains',
  'remote',
  'k8s',
  'platforms'
] as const

export async function CompareTable({ locale, vars }: { locale: Locale; vars: CompareVars }) {
  const { t } = await getTranslation(locale)
  return (
    <section className="px-5 pt-8 pb-10 sm:px-8 sm:pt-12">
      <div className="mx-auto max-w-[1140px]">
        <div className="mb-9 max-w-[680px]">
          <div
            className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
            style={{ color: 'var(--color-dm-accent-2)' }}
          >
            <span aria-hidden="true" className="text-dm-ink-4 before:content-['//_']" />
            {t('compare.table.kicker')}
          </div>
          <h2 className="mx-0 mt-[10px] mb-3 font-bold text-[clamp(28px,3.6vw,40px)] text-dm-ink leading-[1.05] tracking-[-0.03em]">
            {t('compare.table.titleLead')}{' '}
            <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
              {t('compare.table.titleAccent')}
            </em>
          </h2>
          <p className="m-0 text-[15.5px] text-dm-ink-3 leading-[1.55]">
            {t('compare.table.description')}
          </p>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-dm-line bg-dm-bg-elev text-[13.5px]">
          <div
            className="grid items-center gap-3 border-dm-line border-b bg-dm-bg-soft px-3 py-[14px] font-[var(--font-dm-mono)] font-semibold text-[11px] text-dm-ink-3 uppercase tracking-[0.06em] sm:px-[22px] sm:text-[11.5px]"
            style={{ gridTemplateColumns: GRID }}
          >
            <div className="text-left">{t('compare.table.columns.topic')}</div>
            <div className="text-left" style={{ color: 'var(--color-dm-accent-2)' }}>
              {t('compare.table.columns.dockerman')}
            </div>
            <div className="text-left">{t('compare.table.columns.desktop')}</div>
          </div>

          {ROW_KEYS.map((key) => (
            <div
              className="grid items-start gap-3 border-dm-line border-b px-3 py-[14px] last:border-b-0 sm:px-[22px] sm:py-4"
              key={key}
              style={{ gridTemplateColumns: GRID }}
            >
              <div className="font-medium text-[12.5px] text-dm-ink tracking-[-0.005em] sm:text-[14px]">
                {t(`compare.table.rows.${key}.label`)}
              </div>
              <div className="text-[12.5px] text-dm-ink-2 leading-[1.45] sm:text-[13.5px]">
                {t(`compare.table.rows.${key}.dockerman`, vars)}
              </div>
              <div className="text-[12.5px] text-dm-ink-3 leading-[1.45] sm:text-[13.5px]">
                {t(`compare.table.rows.${key}.desktop`)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
