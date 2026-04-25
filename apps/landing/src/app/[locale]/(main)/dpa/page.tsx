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
    title: t('dpa.title'),
    description: t('dpa.description')
  }
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string') ? value : []
}

export default async function DPAPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await getTranslation(locale as Locale)

  const overviewItems = asStringArray(t('dpa.sections.overview.items', { returnObjects: true }))
  const localItems = asStringArray(t('dpa.sections.categories.localItems', { returnObjects: true }))
  const analyticsItems = asStringArray(
    t('dpa.sections.categories.analyticsItems', { returnObjects: true })
  )
  const securityItems = asStringArray(t('dpa.sections.security.items', { returnObjects: true }))
  const purposeItems = asStringArray(t('dpa.sections.purposes.items', { returnObjects: true }))
  const rightsItems = asStringArray(t('dpa.sections.rights.items', { returnObjects: true }))

  return (
    <main>
      <PolicyHero
        description={t('dpa.description')}
        eyebrow={t('dpa.badge')}
        lastUpdated={t('dpa.lastUpdated')}
        titleAccent={t('dpa.titleAccent')}
        titleLead={t('dpa.titleLead')}
      />

      <PolicyBody>
        <PolicySection index={1} title={t('dpa.sections.overview.title')}>
          <p>{t('dpa.sections.overview.intro')}</p>
          <PolicyList items={overviewItems} tone="accent" />
        </PolicySection>

        <PolicySection index={2} title={t('dpa.sections.categories.title')}>
          <PolicySubheading>{t('dpa.sections.categories.localData')}</PolicySubheading>
          <PolicyList items={localItems} tone="accent" />
          <PolicySubheading>{t('dpa.sections.categories.analyticsData')}</PolicySubheading>
          <PolicyList items={analyticsItems} tone="warn" />
        </PolicySection>

        <PolicySection index={3} title={t('dpa.sections.security.title')}>
          <p>{t('dpa.sections.security.intro')}</p>
          <PolicyList items={securityItems} tone="ok" />
        </PolicySection>

        <PolicySection index={4} title={t('dpa.sections.purposes.title')}>
          <p>{t('dpa.sections.purposes.intro')}</p>
          <PolicyList items={purposeItems} tone="accent" />
        </PolicySection>

        <PolicySection index={5} title={t('dpa.sections.retention.title')}>
          <p>{t('dpa.sections.retention.content')}</p>
        </PolicySection>

        <PolicySection index={6} title={t('dpa.sections.rights.title')}>
          <p>{t('dpa.sections.rights.intro')}</p>
          <PolicyList items={rightsItems} tone="accent" />
        </PolicySection>

        <PolicySection index={7} title={t('dpa.sections.contact.title')}>
          <PolicyContact intro={t('dpa.sections.contact.content')} />
        </PolicySection>
      </PolicyBody>
    </main>
  )
}
