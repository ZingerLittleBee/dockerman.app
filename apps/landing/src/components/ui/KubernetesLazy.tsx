'use client'

import dynamic from 'next/dynamic'

const Kubernetes = dynamic(
  () => import('./Kubernetes').then((module) => ({ default: module.Kubernetes })),
  { ssr: false }
)

export default Kubernetes
