'use client'

import Link from 'next/link'
import posthog from 'posthog-js'
import { useTranslation, useLocale } from '@/lib/i18n/client'
import { Button } from '../Button'

export function TrackedCtaDownloadButton() {
  const locale = useLocale()
  const { t } = useTranslation()

  return (
    <Link
      href={`/${locale}/download`}
      onClick={() => {
        posthog.capture('cta_download_clicked', {
          button_text: 'Download for Desktop',
          location: 'cta_section'
        })
      }}
    >
      <Button className="h-10 w-full sm:w-fit sm:flex-none" variant="primary">
        {t('cta.downloadButton')}
      </Button>
    </Link>
  )
}

export function TrackedChangelogLink() {
  const locale = useLocale()
  const { t } = useTranslation()

  return (
    <Link
      className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-500 dark:hover:text-indigo-400"
      href={`/${locale}/changelog`}
      onClick={() => {
        posthog.capture('changelog_link_clicked', {
          link_text: 'View the Changelog',
          location: 'cta_section'
        })
      }}
    >
      {t('cta.viewChangelog')}
    </Link>
  )
}
