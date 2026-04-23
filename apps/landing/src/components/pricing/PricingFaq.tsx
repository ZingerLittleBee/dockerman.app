'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/Accordion'
import { useTranslation } from '@repo/shared/i18n/client'

interface FaqItem {
  question: string
  answer: string
}

export function PricingFaq() {
  const { t } = useTranslation()
  const items = t('pricing.faq.items', { returnObjects: true }) as unknown as FaqItem[]
  const title = t('pricing.faq.title')

  return (
    <section className="px-8 py-16">
      <div className="mx-auto max-w-[820px]">
        <h2 className="font-bold text-[28px] text-dm-ink tracking-[-0.02em]">{title}</h2>
        <Accordion className="mt-6" collapsible type="single">
          {items.map((item, i) => (
            <AccordionItem
              className="border-dm-line"
              key={item.question}
              value={`q-${i}`}
            >
              <AccordionTrigger className="text-[15px] text-dm-ink">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-[14px] text-dm-ink-2">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
