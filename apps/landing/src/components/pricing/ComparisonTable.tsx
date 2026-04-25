import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import { pricingConfig } from '@/config/pricing'

type TFn = (key: string, options?: Record<string, unknown>) => string

type RowValue = boolean | string | { text: string; accent?: boolean }
type RowKey =
  | 'localDocker'
  | 'palette'
  | 'terminal'
  | 'compose'
  | 'trivy'
  | 'remoteSsh'
  | 'bookmarks'
  | 'k8s'
  | 'cloudflared'
  | 'devices'
  | 'updates'
  | 'support'
  | 'commercial'

type GroupKey = 'core' | 'remote' | 'license'

interface RowDef {
  key: RowKey
  hasDesc?: boolean
  free: RowValue
  team: RowValue
  solo: RowValue
}

interface GroupDef {
  key: GroupKey
  rows: RowDef[]
}

function buildGroups(t: TFn): GroupDef[] {
  return [
    {
      key: 'core',
      rows: [
        { key: 'localDocker', hasDesc: true, free: true, team: true, solo: true },
        { key: 'palette', hasDesc: true, free: true, team: true, solo: true },
        { key: 'terminal', free: true, team: true, solo: true },
        { key: 'compose', hasDesc: true, free: true, team: true, solo: true },
        { key: 'trivy', free: true, team: true, solo: true }
      ]
    },
    {
      key: 'remote',
      rows: [
        { key: 'remoteSsh', hasDesc: true, free: false, team: true, solo: true },
        { key: 'bookmarks', free: false, team: true, solo: true },
        { key: 'k8s', hasDesc: true, free: false, team: true, solo: true },
        { key: 'cloudflared', hasDesc: true, free: false, team: true, solo: true }
      ]
    },
    {
      key: 'license',
      rows: [
        {
          key: 'devices',
          free: t('pricing.compare.values.unlimited'),
          team: String(pricingConfig.plans.team.devices),
          solo: '1'
        },
        { key: 'updates', free: false, team: true, solo: true },
        {
          key: 'support',
          free: t('pricing.compare.values.community'),
          team: t('pricing.compare.values.email'),
          solo: t('pricing.compare.values.email')
        },
        { key: 'commercial', free: false, team: true, solo: true }
      ]
    }
  ]
}

function Cell({ v, t }: { v: RowValue; t: TFn }) {
  if (typeof v === 'boolean') {
    return v ? (
      <span
        aria-label={t('pricing.compare.values.included')}
        className="inline-grid h-[22px] w-[22px] place-items-center rounded-md"
        style={{
          background: 'color-mix(in srgb, var(--color-dm-ok) 16%, transparent)',
          color: 'var(--color-dm-ok)'
        }}
      >
        <svg
          fill="none"
          height="11"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
          width="11"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    ) : (
      <span
        aria-label={t('pricing.compare.values.notIncluded')}
        className="inline-grid h-[22px] w-[22px] place-items-center rounded-md bg-dm-bg-soft text-dm-ink-4"
      >
        <svg
          fill="none"
          height="11"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          width="11"
        >
          <line x1="6" x2="18" y1="6" y2="18" />
          <line x1="6" x2="18" y1="18" y2="6" />
        </svg>
      </span>
    )
  }
  if (typeof v === 'string') {
    return <span className="font-[var(--font-dm-mono)] text-[12px] text-dm-ink-2">{v}</span>
  }
  return (
    <span
      className="font-[var(--font-dm-mono)] text-[12px]"
      style={{ color: v.accent ? 'var(--color-dm-accent-2)' : 'var(--color-dm-ink-2)' }}
    >
      {v.text}
    </span>
  )
}

export async function ComparisonTable({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)
  const groups = buildGroups(t)
  return (
    <section className="px-8 pt-24 pb-10">
      <div className="mx-auto max-w-[1140px]">
        <div className="mb-9 max-w-[680px]">
          <div
            className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
            style={{ color: 'var(--color-dm-accent-2)' }}
          >
            <span className="text-dm-ink-4">// </span>compare plans
          </div>
          <h2 className="mx-0 mt-[10px] mb-3 font-bold text-[clamp(28px,3.6vw,40px)] text-dm-ink leading-[1.05] tracking-[-0.03em]">
            {t('pricing.compare.titleLead')}{' '}
            <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
              {t('pricing.compare.titleAccent')}
            </em>
          </h2>
          <p className="m-0 text-[15.5px] text-dm-ink-3 leading-[1.55]">
            {t('pricing.compare.description')}
          </p>
        </div>

        <div className="overflow-hidden rounded-[14px] border border-dm-line bg-dm-bg-elev text-[13.5px]">
          <div
            className="grid items-center border-dm-line border-b bg-dm-bg-soft px-[22px] py-[14px] font-[var(--font-dm-mono)] font-semibold text-[11.5px] text-dm-ink-3 uppercase tracking-[0.06em]"
            style={{ gridTemplateColumns: '2.2fr 1fr 1fr 1fr' }}
          >
            <div className="text-left">{t('pricing.compare.columns.feature')}</div>
            <div className="text-center">{t('pricing.compare.columns.free')}</div>
            <div className="text-center" style={{ color: 'var(--color-dm-accent-2)' }}>
              {t('pricing.compare.columns.team')}
            </div>
            <div className="text-center">{t('pricing.compare.columns.solo')}</div>
          </div>

          {groups.map((group) => (
            <div key={group.key}>
              <div
                className="grid items-center border-dm-line border-b bg-dm-bg px-[22px] py-[14px] font-[var(--font-dm-mono)] font-semibold text-[12px] text-dm-ink-2 uppercase tracking-[0.08em]"
                style={{ gridTemplateColumns: '2.2fr 1fr 1fr 1fr' }}
              >
                <div className="text-left">{t(`pricing.compare.groups.${group.key}`)}</div>
                <div />
                <div />
                <div />
              </div>
              {group.rows.map((r) => (
                <div
                  className="grid items-center border-dm-line border-b px-[22px] py-[14px] last:border-b-0"
                  key={`${group.key}-${r.key}`}
                  style={{ gridTemplateColumns: '2.2fr 1fr 1fr 1fr' }}
                >
                  <div className="text-left">
                    <div className="font-medium text-[14px] text-dm-ink tracking-[-0.005em]">
                      {t(`pricing.compare.rows.${r.key}.label`)}
                    </div>
                    {r.hasDesc ? (
                      <div className="mt-[2px] font-[var(--font-dm-mono)] text-[11.5px] text-dm-ink-4">
                        {t(`pricing.compare.rows.${r.key}.desc`)}
                      </div>
                    ) : null}
                  </div>
                  <div className="text-center">
                    <Cell t={t} v={r.free} />
                  </div>
                  <div className="text-center">
                    <Cell t={t} v={r.team} />
                  </div>
                  <div className="text-center">
                    <Cell t={t} v={r.solo} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
