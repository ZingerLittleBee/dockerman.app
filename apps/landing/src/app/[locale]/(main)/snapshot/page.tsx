import type { Metadata } from 'next'
import { SnapshotFeaturesStrip } from '@/components/snapshot/SnapshotFeaturesStrip'
import { SnapshotHero } from '@/components/snapshot/SnapshotHero'
import { SnapshotShowcase } from '@/components/snapshot/SnapshotShowcase'

export const metadata: Metadata = {
  title: 'Snapshot — Dockerman',
  description:
    "A tour of Dockerman's 18 core modules — dashboard, terminal, logs, images, volumes, Kubernetes, and everything in between."
}

export default function SnapshotPage() {
  return (
    <main>
      <SnapshotHero />
      <SnapshotShowcase />
      <SnapshotFeaturesStrip />
    </main>
  )
}
