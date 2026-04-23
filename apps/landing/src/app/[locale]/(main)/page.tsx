import type { Locale } from '@repo/shared/i18n'
import type { Metadata } from 'next'
import { CommandPalette } from '@/components/landing/CommandPalette'
import { CtaFinal } from '@/components/landing/CtaFinal'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { Hero } from '@/components/landing/Hero'
import { LiveDashboard } from '@/components/landing/LiveDashboard'
import { RuntimeStrip } from '@/components/landing/RuntimeStrip'

export const metadata: Metadata = {
  title: 'Dockerman — local-first Docker, Podman & Kubernetes',
  description:
    'A local-first control surface for Docker, Podman and Kubernetes. Built in Rust and Tauri. Fast, precise, designed to stay out of your way.',
}

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const l = locale as Locale
  return (
    <main>
      <Hero locale={l} />
      <div className="relative px-8">
        <LiveDashboard />
        <CommandPalette />
      </div>
      <RuntimeStrip />
      <FeaturesGrid />
      <CtaFinal locale={l} />
    </main>
  )
}
