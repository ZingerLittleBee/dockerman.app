'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import posthog from 'posthog-js'
import { useTranslation } from '@/lib/i18n/client'
import { type Locale } from '@/lib/i18n'
import { Button } from '../Button'

export default function TrackedHeroButton() {
  const params = useParams()
  const locale = (params.locale as Locale) || 'en'
  const { t } = useTranslation(locale)

  return (
    <Button
      className="h-10 max-w-[200px] px-8 font-semibold"
      onClick={() => {
        posthog.capture('hero_cta_clicked', {
          button_text: 'Download for free',
          location: 'hero_section'
        })
      }}
    >
      <Link href={`/${locale}/download`}>{t('hero.cta')}</Link>
    </Button>
  )
}
