import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import { downloadsConfig } from '@/config/downloads'

export async function IntegrityBar({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)
  const { latest } = downloadsConfig
  return (
    <section className="px-5 sm:px-8">
      <div className="mx-auto mt-10 max-w-[1140px]">
        <div className="flex flex-wrap items-center gap-4 rounded-[12px] border border-dm-line bg-dm-bg-elev px-4 py-4 text-[13px] sm:gap-[18px] sm:px-[22px] sm:py-[18px]">
          <div
            className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-[8px]"
            style={{
              background: 'color-mix(in srgb, var(--color-dm-ok) 12%, transparent)',
              color: 'var(--color-dm-ok)'
            }}
          >
            <svg
              fill="none"
              height="16"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="16"
            >
              <path d="M12 2l9 4v6c0 5-3.5 9.5-9 10-5.5-.5-9-5-9-10V6l9-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div className="flex-1 text-dm-ink-2">
            <strong className="font-semibold text-dm-ink">{t('download.integrity.lead')}</strong>
            {t('download.integrity.body')}
          </div>
          <div className="flex gap-[14px] font-[var(--font-dm-mono)] text-[12px]">
            <IntegrityLink href={latest.releaseUrl}>
              {t('download.integrity.releasePage')}
            </IntegrityLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function IntegrityLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      className="rounded-md border border-dm-line bg-dm-bg px-[10px] py-[6px] text-dm-ink-3 no-underline transition-colors hover:border-dm-line-strong hover:text-dm-ink"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  )
}
