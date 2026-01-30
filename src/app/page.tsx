import { BackgroundBeamsWithCollision } from '@/components/ui/background-beams-with-collision'
import Cta from '@/components/ui/Cta'
import { Faqs } from '@/components/ui/Faqs'
import Features from '@/components/ui/Features'
import { Global } from '@/components/ui/Global'
import Hero from '@/components/ui/Hero'
import LogoCloud from '@/components/ui/LogoCloud'
import SnapshotPlaygournd from '@/components/ui/SnapshotPlaygournd'

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Hero />
      <LogoCloud />
      <Global />
      <SnapshotPlaygournd />
      <Features />
      <div className="mx-auto mt-36 max-w-6xl px-3">
        <Faqs />
      </div>
      <BackgroundBeamsWithCollision>
        <Cta />
      </BackgroundBeamsWithCollision>
    </main>
  )
}
