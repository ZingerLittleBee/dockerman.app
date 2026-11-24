import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import { cx } from '@repo/shared/utils'
import { Fragment, type ReactNode } from 'react'
import type { CompareVars } from '@/config/compare'
import { EngineStack } from './EngineLogo'
import { SectionHeading } from './SectionHeading'

type Mark = 'yes' | 'partial' | 'no'

interface Row {
  key: string
  /** Feature rows carry a mark per product; footprint and cost rows are plain values. */
  dockerman?: Mark
  desktop?: Mark
}

const GROUPS: { key: 'cost' | 'features'; rows: Row[] }[] = [
  {
    key: 'cost',
    rows: [{ key: 'installer' }, { key: 'memory' }, { key: 'local' }, { key: 'license' }]
  },
  {
    key: 'features',
    rows: [
      { key: 'engines', dockerman: 'yes', desktop: 'no' },
      { key: 'domains', dockerman: 'yes', desktop: 'no' },
      { key: 'remote', dockerman: 'yes', desktop: 'partial' },
      { key: 'k8s', dockerman: 'yes', desktop: 'yes' },
      { key: 'extensions', dockerman: 'no', desktop: 'yes' },
      { key: 'admin', dockerman: 'no', desktop: 'yes' },
      { key: 'platforms', dockerman: 'yes', desktop: 'yes' }
    ]
  }
]

/** Tint that runs down the Dockerman column. */
const DM_COLUMN = 'bg-[color-mix(in_srgb,var(--color-dm-accent)_6%,transparent)]'

const MARK_TILE: Record<Mark, string> = {
  yes: 'bg-[color-mix(in_srgb,var(--color-dm-ok)_16%,transparent)] text-dm-ok',
  partial: 'bg-[color-mix(in_srgb,var(--color-dm-warn)_16%,transparent)] text-dm-warn',
  no: 'bg-dm-bg-soft text-dm-ink-4'
}

/** The icon only restates the cell text, so it stays out of the accessibility tree. */
function MarkIcon({ mark }: { mark: Mark }) {
  return (
    <span
      aria-hidden="true"
      className={cx(
        'mt-px inline-grid size-5 shrink-0 place-items-center rounded-md',
        MARK_TILE[mark]
      )}
    >
      <svg fill="none" height="11" stroke="currentColor" viewBox="0 0 24 24" width="11">
        {mark === 'yes' ? <polyline points="20 6 9 17 4 12" strokeWidth="3" /> : null}
        {mark === 'partial' ? <line strokeWidth="3" x1="6" x2="18" y1="12" y2="12" /> : null}
        {mark === 'no' ? (
          <path d="M7 7l10 10M17 7L7 17" strokeLinecap="round" strokeWidth="2.5" />
        ) : null}
      </svg>
    </span>
  )
}

const AFTER_DOT = /(?<=\.)(?=\S)/

/** Lets dotted tokens such as `*.dockerman.localhost` wrap after a dot instead of mid-word. */
function breakAfterDots(text: string): ReactNode {
  const parts = text.split(AFTER_DOT)
  return parts.length === 1
    ? text
    : parts.map((part, i) => (
        <Fragment key={`${i}-${part}`}>
          {i > 0 ? <wbr /> : null}
          {part}
        </Fragment>
      ))
}

function Cell({ mark, text, children }: { mark?: Mark; text: string; children?: ReactNode }) {
  return (
    <span className="flex items-start gap-2.5">
      {mark ? <MarkIcon mark={mark} /> : null}
      <span className="min-w-0 [overflow-wrap:anywhere]">
        {breakAfterDots(text)}
        {children}
      </span>
    </span>
  )
}

export async function CompareTable({ locale, vars }: { locale: Locale; vars: CompareVars }) {
  const { t } = await getTranslation(locale)
  const cjk = locale === 'zh' || locale === 'ja'
  return (
    <section className="px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[1140px]">
        <SectionHeading
          accent={t('compare.table.titleAccent')}
          cjk={cjk}
          kicker={t('compare.table.kicker')}
          lead={t('compare.table.titleLead')}
        />

        <div className="mt-9 overflow-hidden rounded-[16px] border border-dm-line bg-dm-bg-elev">
          <table className="w-full table-fixed border-collapse text-left text-[13.5px] max-sm:block sm:text-[15px]">
            <colgroup>
              <col className="w-[34%] sm:w-[30%]" />
              <col />
              <col />
            </colgroup>
            <thead className="max-sm:block">
              <tr className="border-dm-line border-b max-sm:grid max-sm:grid-cols-2">
                <th className="px-3 py-4 font-medium max-sm:hidden sm:px-6" scope="col">
                  <span className="sr-only">{t('compare.table.columns.topic')}</span>
                </th>
                <th
                  className={cx(
                    'px-3 py-4 font-semibold text-[14px] text-dm-accent sm:px-6 sm:text-[16px]',
                    DM_COLUMN
                  )}
                  scope="col"
                >
                  {t('compare.table.columns.dockerman')}
                </th>
                <th
                  className="px-3 py-4 font-semibold text-[14px] text-dm-ink-2 sm:px-6 sm:text-[16px]"
                  scope="col"
                >
                  {t('compare.table.columns.desktop')}
                </th>
              </tr>
            </thead>
            {GROUPS.map((group) => (
              <tbody className="max-sm:block" key={group.key}>
                <tr className="max-sm:block">
                  <th
                    className="border-dm-line border-y bg-dm-bg-soft px-3 py-2.5 font-[var(--font-dm-mono)] font-medium text-[11px] text-dm-ink-4 uppercase tracking-[0.08em] max-sm:block sm:px-6"
                    colSpan={3}
                    scope="colgroup"
                  >
                    {t(`compare.table.groups.${group.key}`)}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr
                    className="border-dm-line border-b last:border-b-0 max-sm:grid max-sm:grid-cols-2"
                    key={row.key}
                  >
                    <th
                      className="px-3 py-4 align-top font-medium text-dm-ink max-sm:col-span-2 max-sm:pb-1 sm:px-6"
                      scope="row"
                    >
                      {t(`compare.table.rows.${row.key}.label`)}
                    </th>
                    <td
                      className={cx(
                        'px-3 py-4 align-top text-dm-ink max-sm:pt-2 sm:px-6',
                        DM_COLUMN
                      )}
                    >
                      <Cell
                        mark={row.dockerman}
                        text={t(`compare.table.rows.${row.key}.dockerman`, vars)}
                      >
                        {row.key === 'engines' ? <EngineStack className="mt-2" /> : null}
                      </Cell>
                    </td>
                    <td className="px-3 py-4 align-top text-dm-ink-3 max-sm:pt-2 sm:px-6">
                      <Cell mark={row.desktop} text={t(`compare.table.rows.${row.key}.desktop`)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
        <p className="mt-4 mb-0 text-[12.5px] text-dm-ink-4">{t('compare.table.note')}</p>
      </div>
    </section>
  )
}
