import type { Locale } from '@repo/shared/i18n'
import CtaSectionLazy from '@/components/ui/CtaSectionLazy'
import FaqsLazy from '@/components/ui/FaqsLazy'
import Features from '@/components/ui/Features'
import GlobalLazy from '@/components/ui/GlobalLazy'
import Hero from '@/components/ui/Hero'
import HeroImage from '@/components/ui/HeroImage'
import SnapshotPlaygroundLazy from '@/components/ui/SnapshotPlaygroundLazy'

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  return (
    <main className="flex flex-col overflow-hidden">
      <Hero>
        <HeroImage />
      </Hero>
      <GlobalLazy />
      <SnapshotPlaygroundLazy />
      <Features locale={locale as Locale} />
      <div className="mx-auto mt-36 max-w-6xl px-3">
        <FaqsLazy />
      </div>
      <CtaSectionLazy />
    </main>
  )
}
