import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { DownloadHero } from '@/components/download/DownloadHero'
import { HomebrewBlock } from '@/components/download/HomebrewBlock'
import { IntegrityBar } from '@/components/download/IntegrityBar'
import { PlatformCard } from '@/components/download/PlatformCard'
import { ReleasesTable } from '@/components/download/ReleasesTable'
import { CtaFinal } from '@/components/landing/CtaFinal'
import { downloadsConfig } from '@/config/downloads'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { t } = await getTranslation(locale as Locale)
  return {
    title: t('meta.download.title'),
    description: t('meta.download.description')
  }
}

const MacIcon = (
  <svg fill="currentColor" height="26" viewBox="0 0 24 24" width="26">
    <path d="M17.05 13.15c0-2.45 2-3.63 2.09-3.68-1.14-1.66-2.91-1.89-3.55-1.92-1.51-.15-2.95.89-3.72.89-.77 0-1.95-.87-3.2-.85-1.65.03-3.17.96-4.02 2.44-1.72 2.97-.44 7.37 1.24 9.78.82 1.18 1.79 2.51 3.07 2.46 1.24-.05 1.71-.8 3.2-.8 1.5 0 1.92.8 3.22.77 1.33-.02 2.17-1.2 2.98-2.39.94-1.37 1.33-2.7 1.35-2.77-.03-.01-2.6-1-2.66-3.93zM14.94 5.85c.68-.82 1.14-1.96 1.01-3.1-.98.04-2.17.65-2.87 1.47-.63.73-1.18 1.89-1.03 3.01 1.09.08 2.21-.55 2.89-1.38z" />
  </svg>
)

const WindowsIcon = (
  <svg fill="currentColor" height="26" viewBox="0 0 24 24" width="26">
    <path d="M3 5.5L10.5 4.5v7H3zM11.5 4.3L21 3v8.5H11.5zM3 12.5H10.5V19.5L3 18.5zM11.5 12.5H21V21L11.5 19.7z" />
  </svg>
)

const LinuxIcon = (
  <svg fill="currentColor" height="26" viewBox="0 0 24 24" width="26">
    <path d="M12 2c-2 0-3 2-3 4 0 1 .2 2 .5 3l-1 2c-1 2-2 4-2 6 0 2 1 4 3 4h5c2 0 3-2 3-4 0-2-1-4-2-6l-1-2c.3-1 .5-2 .5-3 0-2-1-4-3-4zm-2 4c0-1 .5-2 1-2 .5 0 1 .5 1 1 0 .5-.5 1-1 1s-1 0-1-0z" />
  </svg>
)

async function detectPlatform(): Promise<'macos' | 'windows' | 'linux'> {
  const h = await headers()
  const ua = h.get('user-agent') ?? ''
  if (/Windows/i.test(ua)) return 'windows'
  if (/Mac OS X|Macintosh|iPhone|iPad/i.test(ua)) return 'macos'
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'linux'
  return 'macos'
}

export default async function DownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  const { t } = await getTranslation(l)
  const resolveAssets = (platform: 'macos' | 'windows' | 'linux') =>
    downloadsConfig.latest.installers[platform].map((a) => ({
      filename: a.filename,
      label: t(a.labelKey),
      size: a.size,
      verification: a.verification
    }))
  const installers = {
    macos: resolveAssets('macos'),
    windows: resolveAssets('windows'),
    linux: resolveAssets('linux')
  }
  const platformStrings = {
    recommended: t('download.platforms.recommended'),
    appleNotarized: t('download.verification.appleNotarized'),
    tauriSig: t('download.verification.tauriSig')
  }
  const detectedPlatform = await detectPlatform()

  return (
    <main>
      <DownloadHero locale={l} />

      <section className="px-8 pt-20 pb-10">
        <div className="mx-auto max-w-[1140px]">
          <div className="mb-8 max-w-[680px]">
            <div
              className="font-[var(--font-dm-mono)] text-[12px] tracking-[0.04em]"
              style={{ color: 'var(--color-dm-accent-2)' }}
            >
              <span className="text-dm-ink-4">// </span>
              {t('download.platforms.kicker')}
            </div>
            <h2 className="mx-0 mt-[10px] mb-3 font-bold text-[clamp(28px,3.6vw,40px)] text-dm-ink leading-[1.05] tracking-[-0.03em]">
              {t('download.platforms.titleLead')}{' '}
              <em className="font-[var(--font-dm-display)] font-normal text-dm-ink-2 italic">
                {t('download.platforms.titleAccent')}
              </em>{' '}
              {t('download.platforms.titleTrail')}
            </h2>
            <p className="m-0 text-[15.5px] text-dm-ink-3 leading-[1.55]">
              {t('download.platforms.descriptionPre')}
              <code className="rounded bg-dm-bg-soft px-[5px] py-[1px] font-[var(--font-dm-mono)] text-[14px]">
                main
              </code>
              {t('download.platforms.descriptionMid')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2 lg:grid-cols-3">
            <PlatformCard
              assets={installers.macos}
              featured={detectedPlatform === 'macos'}
              icon={MacIcon}
              minSpec={t('download.platforms.macos.minSpec')}
              strings={platformStrings}
              title={t('download.platforms.macos.title')}
            />
            <PlatformCard
              assets={installers.windows}
              featured={detectedPlatform === 'windows'}
              icon={WindowsIcon}
              minSpec={t('download.platforms.windows.minSpec')}
              strings={platformStrings}
              title={t('download.platforms.windows.title')}
            />
            <PlatformCard
              assets={installers.linux}
              featured={detectedPlatform === 'linux'}
              icon={LinuxIcon}
              minSpec={t('download.platforms.linux.minSpec')}
              strings={platformStrings}
              title={t('download.platforms.linux.title')}
            />
          </div>

          <IntegrityBar locale={l} />
        </div>
      </section>

      <HomebrewBlock locale={l} />

      <ReleasesTable locale={l} />
      <CtaFinal locale={l} />
    </main>
  )
}
