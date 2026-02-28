import { source } from '@/lib/source'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { baseOptions } from '@/lib/layout.shared'
import type { ReactNode } from 'react'

export default async function Layout({
  children,
  params
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <DocsLayout tree={source.getPageTree(locale)} {...baseOptions()}>
      {children}
    </DocsLayout>
  )
}
