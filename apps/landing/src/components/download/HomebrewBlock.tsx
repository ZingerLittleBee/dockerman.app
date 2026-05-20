import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import { downloadsConfig } from '@/config/downloads'
import { HomebrewCopyButton } from './HomebrewCopyButton'

export async function HomebrewBlock({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)
  const cmd = downloadsConfig.homebrewCommand

  return (
    <section className="px-5 sm:px-8">
      <div className="mx-auto max-w-[1140px]">
        <div className="grid grid-cols-1">
          <div className="mx-auto flex w-full min-w-0 max-w-[620px] flex-col gap-[10px] rounded-[12px] border border-dm-line bg-dm-bg-elev p-[16px_18px]">
            <div className="flex items-center gap-[10px]">
              <div className="grid h-7 w-7 place-items-center rounded-[7px] border border-dm-line bg-dm-bg-soft text-dm-ink-2">
                <svg fill="currentColor" height="14" viewBox="0 0 24 24" width="14">
                  <path d="M18 4c-1 0-2 .5-2.5 1.5C15 6.5 14 7 13 7H6.5C4 7 3 9 4 11c.5 1 2 2 3 2h7c1 0 2 1 2 2v2c0 1 .5 2 1.5 2.5S19 20 20 20c1.5 0 2-1 2-2V6c0-1-.5-2-1.5-2.5S19 3 18 4zm-9 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[13px] text-dm-ink tracking-[-0.01em]">
                  {t('download.homebrew.title')}
                </div>
                <div className="text-[11px] text-dm-ink-4">{t('download.homebrew.subtitle')}</div>
              </div>
              <div className="ml-auto font-[var(--font-dm-mono)] text-[11px] text-dm-ink-4">
                {t('download.homebrew.tag')}
              </div>
            </div>
            <HomebrewCopyButton command={cmd} />
          </div>
        </div>
      </div>
    </section>
  )
}
