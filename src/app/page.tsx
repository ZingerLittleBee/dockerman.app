import Cta from "@/components/ui/Cta"
import Features from "@/components/ui/Features"
import { Global } from "@/components/ui/Global"
import Hero from "@/components/ui/Hero"
import LogoCloud from "@/components/ui/LogoCloud"
import SnapshotPlaygournd from "@/components/ui/SnapshotPlaygournd"

export default function Home() {
  return (
    <main className="flex flex-col overflow-hidden">
      <Hero />
      <LogoCloud />
      <Global />
      <SnapshotPlaygournd />
      <Features />
      <Cta />
    </main>
  )
}
