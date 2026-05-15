import type { Locale } from '@repo/shared/i18n'
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page'
import { createRelativeLink } from 'fumadocs-ui/mdx'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { siteConfig } from '@/app/siteConfig'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildAlternates } from '@/lib/seo'
import { source } from '@/lib/source'
import { getMDXComponents } from '../../../../../mdx-components'

function buildDocPath(slug?: string[]): string {
  return slug && slug.length > 0 ? `/docs/${slug.join('/')}` : '/docs'
}

function buildBreadcrumb(locale: string, slug: string[] | undefined, title: string | undefined) {
  const items: { '@type': 'ListItem'; position: number; name: string; item: string }[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Docs',
      item: `${siteConfig.url}/${locale}/docs`
    }
  ]
  if (slug && slug.length > 0) {
    slug.forEach((segment, index) => {
      const isLast = index === slug.length - 1
      const segName = segment.replace(/-/g, ' ')
      items.push({
        '@type': 'ListItem',
        position: index + 2,
        name: isLast ? (title ?? segName) : segName,
        item: `${siteConfig.url}/${locale}/docs/${slug.slice(0, index + 1).join('/')}`
      })
    })
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  }
}

export default async function Page({
  params
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}) {
  const { locale, slug } = await params
  const page = source.getPage(slug, locale)
  if (!page) notFound()

  const MDX = page.data.body
  const path = buildDocPath(slug)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: page.data.title,
    description: page.data.description,
    inLanguage: locale,
    url: `${siteConfig.url}/${locale}${path}`,
    isPartOf: { '@type': 'WebSite', name: siteConfig.name, url: siteConfig.url },
    author: { '@type': 'Person', name: 'ZingerBee', url: 'https://github.com/ZingerLittleBee' }
  }

  return (
    <DocsPage full={page.data.full} toc={page.data.toc}>
      <JsonLd data={[articleLd, buildBreadcrumb(locale, slug, page.data.title)]} />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page)
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return source.generateParams('slug', 'locale')
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const page = source.getPage(slug, locale)
  if (!page) notFound()

  const path = buildDocPath(slug)
  const title = page.data.title
  const description = page.data.description

  return {
    title,
    description,
    alternates: buildAlternates(locale as Locale, path),
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}${path}`,
      type: 'article'
    },
    twitter: { title, description }
  }
}
