'use client'

import Link from 'next/link'
import posthog from 'posthog-js'
import { useLocale, useTranslation } from '@repo/shared/i18n/client'
import { Button } from '../Button'

export default function TrackedHeroButton() {
  const locale = useLocale()
  const { t } = useTranslation()

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
