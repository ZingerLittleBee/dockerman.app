import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import type { Metadata } from 'next'
import {
  PolicyBody,
  PolicyContact,
  PolicyHero,
  PolicyList,
  PolicySection,
  PolicySubheading
} from '@/components/policy/PolicyShell'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { t } = await getTranslation(locale as Locale)
  return {
    title: t('privacy.title'),
    description: t('privacy.description')
  }
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string') ? value : []
}

export default async function PrivacyPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await getTranslation(locale as Locale)

  const collectedItems = asStringArray(
    t('privacy.sections.analytics.collectedItems', { returnObjects: true })
  )
  const notCollectedItems = asStringArray(
    t('privacy.sections.analytics.notCollectedItems', { returnObjects: true })
  )

  return (
    <main>
      <PolicyHero
        description={t('privacy.description')}
        eyebrow={t('privacy.badge')}
        lastUpdated={t('privacy.lastUpdated')}
        titleAccent={t('privacy.titleAccent')}
        titleLead={t('privacy.titleLead')}
      />

      <PolicyBody>
        <PolicySection index={1} title={t('privacy.sections.dataCollection.title')}>
          <p>{t('privacy.sections.dataCollection.content')}</p>
        </PolicySection>

        <PolicySection index={2} title={t('privacy.sections.analytics.title')}>
          <p>{t('privacy.sections.analytics.content')}</p>
          <PolicySubheading>{t('privacy.sections.analytics.collected')}</PolicySubheading>
          <PolicyList items={collectedItems} tone="accent" />
          <PolicySubheading>{t('privacy.sections.analytics.notCollected')}</PolicySubheading>
          <PolicyList items={notCollectedItems} tone="ok" />
        </PolicySection>

        <PolicySection index={3} title={t('privacy.sections.optOut.title')}>
          <p>{t('privacy.sections.optOut.content')}</p>
        </PolicySection>

        <PolicySection index={4} title={t('privacy.sections.localStorage.title')}>
          <p>{t('privacy.sections.localStorage.content')}</p>
        </PolicySection>

        <PolicySection index={5} title={t('privacy.sections.updates.title')}>
          <p>{t('privacy.sections.updates.content')}</p>
        </PolicySection>

        <PolicySection index={6} title={t('privacy.sections.contact.title')}>
          <PolicyContact intro={t('privacy.sections.contact.content')} />
        </PolicySection>
      </PolicyBody>
    </main>
  )
}
