'use client'

import { useTranslation } from '@repo/shared/i18n/client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/Accordion'

interface FaqItem {
  question: string
  answer: string
}

function isFaqItemArray(value: unknown): value is FaqItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (v) =>
        typeof v === 'object' &&
        v !== null &&
        typeof (v as FaqItem).question === 'string' &&
        typeof (v as FaqItem).answer === 'string'
    )
  )
}

const EMAIL_RE_SPLIT = /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi
const EMAIL_RE_TEST = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

function renderAnswer(text: string) {
  const parts = text.split(EMAIL_RE_SPLIT)
  return parts.map((part, i) =>
    EMAIL_RE_TEST.test(part) ? (
      <a
        className="text-dm-accent-2 underline underline-offset-2 hover:opacity-80"
        href={`mailto:${part}`}
        key={`${i}-${part}`}
      >
        {part}
      </a>
    ) : (
      <span key={`${i}-t`}>{part}</span>
    )
  )
}

export function PricingFaq() {
  const { t } = useTranslation()
  const raw = t('pricing.faq.items', { returnObjects: true })
  const items = isFaqItemArray(raw) ? raw : []
  const title = t('pricing.faq.title')

  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-[820px]">
        <h2 className="font-bold text-[28px] text-dm-ink tracking-[-0.02em]">{title}</h2>
        <Accordion className="mt-6" collapsible type="single">
          {items.map((item, i) => (
            <AccordionItem className="border-dm-line" key={item.question} value={`q-${i}`}>
              <AccordionTrigger className="text-[15px] text-dm-ink">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[14px] text-dm-ink-2">
                {renderAnswer(item.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
