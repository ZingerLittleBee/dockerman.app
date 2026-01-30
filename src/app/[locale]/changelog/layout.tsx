'use client'

import Balancer from 'react-wrap-balancer'
import { useParams } from 'next/navigation'
import { type Locale } from '@/lib/i18n'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const params = useParams()
  const locale = (params.locale as Locale) || 'en'

  const titles: Record<Locale, string> = {
    en: 'Changelog',
    zh: '更新日志',
  }

  const descriptions: Record<Locale, string> = {
    en: "Keep yourself informed about the most recent additions and improvements we've made to Dockerman.",
    zh: '了解我们对 Dockerman 所做的最新更新和改进。',
  }

  return (
    <main
      className="mx-auto mt-36 max-w-3xl animate-slide-up-fade px-3"
      style={{
        animationDuration: '600ms',
        animationFillMode: 'backwards'
      }}
    >
      <div className="text-center">
        <h1 className="inline-block bg-gradient-to-t from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-5xl dark:from-gray-50 dark:to-gray-300">
          {titles[locale]}
        </h1>
        <p className="mt-4 text-gray-600 text-lg dark:text-gray-400">
          <Balancer>
            {descriptions[locale]}
          </Balancer>
        </p>
      </div>
      <div className="mt-28">{children}</div>
    </main>
  )
}
