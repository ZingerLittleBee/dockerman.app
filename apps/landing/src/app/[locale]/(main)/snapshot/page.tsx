import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import type { Metadata } from 'next'
import { SnapshotFeaturesStrip } from '@/components/snapshot/SnapshotFeaturesStrip'
import { SnapshotHero } from '@/components/snapshot/SnapshotHero'
import { SnapshotShowcase } from '@/components/snapshot/SnapshotShowcase'
import { resolveSnapshotModules } from '@/config/snapshot'

export const metadata: Metadata = {
  title: 'Snapshot — Dockerman',
  description:
    "A tour of Dockerman's 18 core modules — dashboard, terminal, logs, images, volumes, Kubernetes, and everything in between."
}

export default async function SnapshotPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  const { t } = await getTranslation(l)
  const modules = resolveSnapshotModules(t).map((m) => ({
    ...m,
    showLabel: t('snapshot.showcase.showModule', { label: m.label })
  }))
  const showcaseStrings = {
    allModules: t('snapshot.showcase.allModules'),
    moduleTabsAria: t('snapshot.showcase.moduleTabsAria'),
    moduleNavAria: t('snapshot.showcase.moduleNavAria'),
    openLightbox: t('snapshot.showcase.openLightbox'),
    prev: t('snapshot.showcase.prev'),
    next: t('snapshot.showcase.next'),
    zoom: t('snapshot.showcase.zoom'),
    close: t('snapshot.showcase.close'),
    docs: t('snapshot.showcase.docs'),
    copyLink: t('snapshot.showcase.copyLink'),
    copied: t('snapshot.showcase.copied'),
    screenshotMissing: t('snapshot.showcase.screenshotMissing'),
    screenshotMissingShort: t('snapshot.showcase.screenshotMissingShort')
  }
  return (
    <main>
      <SnapshotHero locale={l} />
      <SnapshotShowcase modules={modules} strings={showcaseStrings} />
      <SnapshotFeaturesStrip locale={l} />
    </main>
  )
}
