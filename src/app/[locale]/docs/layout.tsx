import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import type { ReactNode } from 'react'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

export default async function Layout({
  children,
  params
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <DocsLayout tree={source.getPageTree(locale)} {...baseOptions(locale)}>
      {children}
    </DocsLayout>
  )
}
