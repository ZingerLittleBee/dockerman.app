'use client'

import { useTranslation } from '@repo/shared/i18n/client'
import { Accordion } from '@/components/Accordion'
import { AccordionContent } from '@/components/AccordionContent'
import { AccordionItem } from '@/components/AccordionItem'
import { AccordionTrigger } from '@/components/AccordionTrigger'
import { PricingFaqAnswer } from './PricingFaqAnswer'

const LICENSE_MANAGE_URL = 'https://license.dockerman.app/manage'

interface FaqItem {
  actionLabel?: string
  answer: string
  question: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isFaqItemArray(value: unknown): value is FaqItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (v) =>
        isRecord(v) &&
        typeof v.question === 'string' &&
        typeof v.answer === 'string' &&
        (v.actionLabel === undefined || typeof v.actionLabel === 'string')
    )
  )
}

export function PricingFaq() {
  const { t } = useTranslation()
  const raw = t('pricing.faq.items', { returnObjects: true })
  const items = isFaqItemArray(raw) ? raw : []
  const title = t('pricing.faq.title')

  return (
    <section className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[820px]">
        <h2 className="font-bold text-[28px] text-dm-ink tracking-[-0.02em]">{title}</h2>
        <Accordion className="mt-6" collapsible type="single">
          {items.map((item) => (
            <AccordionItem className="border-dm-line" key={item.question} value={item.question}>
              <AccordionTrigger className="text-[15px] text-dm-ink">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[14px] text-dm-ink-2">
                <PricingFaqAnswer
                  action={
                    item.actionLabel
                      ? { href: LICENSE_MANAGE_URL, label: item.actionLabel }
                      : undefined
                  }
                  text={item.answer}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
