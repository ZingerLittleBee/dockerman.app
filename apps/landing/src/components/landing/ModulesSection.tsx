import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'

const MODULE_KEYS = ['containers', 'compose', 'images', 'system'] as const

const MODULE_NUMS: Record<(typeof MODULE_KEYS)[number], string> = {
  containers: '01 / containers',
  compose: '02 / compose',
  images: '03 / images',
  system: '04 / system'
}

export async function ModulesSection({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)

  return (
    <section className="px-8 py-24" id="modules">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-12 flex max-w-[780px] flex-col gap-[14px]">
          <div
            className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
            style={{ color: 'var(--color-dm-accent)' }}
          >
            <span className="text-dm-ink-4">// </span>modules
          </div>
          <h2 className="m-0 font-bold text-[clamp(32px,4.5vw,56px)] text-dm-ink leading-[1.02] tracking-[-0.035em]">
            {t('modulesSection.titleLead')}{' '}
            <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
              {t('modulesSection.titleAccent')}
            </em>{' '}
            {t('modulesSection.titleTrail')}
          </h2>
          <p className="m-0 max-w-[52ch] text-[17px] text-dm-ink-3 leading-[1.5]">
            {t('modulesSection.descriptionPre')}
            <code className="rounded bg-dm-bg-soft px-[6px] py-[1px] font-[var(--font-dm-mono)] text-[14px]">
              docker
            </code>
            {t('modulesSection.descriptionPost')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
          {MODULE_KEYS.map((key) => {
            const bullets = t(`modulesSection.modules.${key}.bullets`, {
              returnObjects: true
            }) as string[]
            return (
              <article className="border-dm-line border-t pt-10" key={key}>
                <div className="flex items-center justify-between pb-[18px] font-[var(--font-dm-mono)] text-[12px] text-dm-ink-4">
                  <span>{MODULE_NUMS[key]}</span>
                  <span
                    className="rounded-full px-2 py-[3px] font-semibold"
                    style={{
                      background: 'color-mix(in srgb, var(--color-dm-accent) 10%, transparent)',
                      color: 'var(--color-dm-accent)'
                    }}
                  >
                    {t(`modulesSection.modules.${key}.chip`)}
                  </span>
                </div>
                <h3 className="mb-[10px] font-semibold text-[24px] text-dm-ink tracking-[-0.02em]">
                  {t(`modulesSection.modules.${key}.title`)}
                  <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
                    {t(`modulesSection.modules.${key}.titleEm`)}
                  </em>
                </h3>
                <p className="m-0 text-[14.5px] text-dm-ink-3 leading-[1.55]">
                  {t(`modulesSection.modules.${key}.body`)}
                </p>
                <ul className="m-0 mt-[18px] flex list-none flex-col gap-[6px] p-0">
                  {bullets.map((b) => (
                    <li
                      className="flex items-center gap-[10px] font-[var(--font-dm-mono)] text-[13px] text-dm-ink-2"
                      key={b}
                    >
                      <span
                        aria-hidden="true"
                        className="inline-block h-px w-[6px]"
                        style={{ background: 'var(--color-dm-accent)' }}
                      />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
