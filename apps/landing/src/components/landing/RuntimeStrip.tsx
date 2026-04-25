import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'

const RUNTIMES = ['Docker', 'Podman', 'Kubernetes', 'SSH', 'Cloudflared', 'WSL2'] as const

export async function RuntimeStrip({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale)
  return (
    <section className="border-dm-line border-y bg-dm-bg-elev/50">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-5 text-[12px] text-dm-ink-3 sm:px-8 sm:py-6">
        <span className="font-[var(--font-dm-mono)] uppercase tracking-wider">
          {t('runtimeStrip.label')}
        </span>
        {RUNTIMES.map((name) => (
          <span className="inline-flex items-center gap-2 text-dm-ink-2" key={name}>
            <span
              className="h-[6px] w-[6px] rounded-full"
              style={{ background: 'var(--color-dm-accent)' }}
            />
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}
