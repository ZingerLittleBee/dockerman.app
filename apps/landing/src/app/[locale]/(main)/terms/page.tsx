import type { Locale } from '@repo/shared/i18n'
import { getTranslation } from '@repo/shared/i18n/server'
import type { Metadata } from 'next'
import {
  PolicyBody,
  PolicyContact,
  PolicyHero,
  PolicyList,
  PolicySection
} from '@/components/policy/PolicyShell'

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const { t } = await getTranslation(locale as Locale)
  return {
    title: t('terms.title'),
    description: t('terms.description')
  }
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string') ? value : []
}

export default async function TermsPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const { t } = await getTranslation(locale as Locale)

  const licenseItems = asStringArray(
    t('terms.sections.license.items', { returnObjects: true })
  )
  const restrictionItems = asStringArray(
    t('terms.sections.restrictions.items', { returnObjects: true })
  )

  return (
    <main>
      <PolicyHero
        description={t('terms.description')}
        eyebrow={t('terms.badge')}
        lastUpdated={t('terms.lastUpdated')}
        titleAccent={t('terms.titleAccent')}
        titleLead={t('terms.titleLead')}
      />

      <PolicyBody>
        <PolicySection index={1} title={t('terms.sections.acceptance.title')}>
          <p>{t('terms.sections.acceptance.content')}</p>
        </PolicySection>

        <PolicySection index={2} title={t('terms.sections.license.title')}>
          <p>{t('terms.sections.license.intro')}</p>
          <PolicyList items={licenseItems} tone="accent" />
        </PolicySection>

        <PolicySection index={3} title={t('terms.sections.restrictions.title')}>
          <p>{t('terms.sections.restrictions.intro')}</p>
          <PolicyList items={restrictionItems} tone="err" />
        </PolicySection>

        <PolicySection index={4} title={t('terms.sections.intellectualProperty.title')}>
          <p>{t('terms.sections.intellectualProperty.content')}</p>
        </PolicySection>

        <PolicySection index={5} title={t('terms.sections.disclaimer.title')}>
          <div
            className="rounded-[10px] border bg-dm-bg-soft p-4 text-[14px] text-dm-ink-2 leading-[1.6]"
            style={{ borderColor: 'var(--color-dm-line)' }}
          >
            {t('terms.sections.disclaimer.content')}
          </div>
        </PolicySection>

        <PolicySection index={6} title={t('terms.sections.updatesToTerms.title')}>
          <p>{t('terms.sections.updatesToTerms.content')}</p>
        </PolicySection>

        <PolicySection index={7} title={t('terms.sections.contact.title')}>
          <PolicyContact intro={t('terms.sections.contact.content')} />
        </PolicySection>
      </PolicyBody>
    </main>
  )
}
