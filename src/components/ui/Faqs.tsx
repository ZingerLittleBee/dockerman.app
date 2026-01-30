'use client'

import posthog from 'posthog-js'
import { siteConfig } from '@/app/siteConfig'
import { useTranslation } from '@/lib/i18n/client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../Accordion'

export function Faqs() {
  const { t } = useTranslation()

  const faqs = t('faqs.items', { returnObjects: true }) as Array<{
    question: string
    answer: string
  }>

  return (
    <section aria-labelledby="faq-title" className="mt-20 sm:mt-36">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-14">
        <div className="col-span-full sm:col-span-5">
          <h2
            className="inline-block scroll-my-24 bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 pr-2 font-bold text-2xl text-transparent tracking-tighter lg:text-3xl dark:from-gray-50 dark:to-gray-300"
            id="faq-title"
          >
            {t('faqs.title')}
          </h2>
          <p className="mt-4 text-base text-gray-600 leading-7 dark:text-gray-400">
            {t('faqs.description')}{' '}
            <a
              className="font-medium text-indigo-600 hover:text-indigo-300 dark:text-indigo-400"
              href={siteConfig.issuesLink}
            >
              {t('faqs.openIssues')}
            </a>{' '}
            {t('faqs.descriptionSuffix')}
          </p>
        </div>
        <div className="col-span-full mt-6 lg:col-span-7 lg:mt-0">
          <Accordion
            className="mx-auto"
            onValueChange={(value) => {
              if (value.length > 0) {
                const lastExpandedQuestion = value.at(-1)
                const faqIndex = faqs.findIndex((faq) => faq.question === lastExpandedQuestion)
                posthog.capture('faq_item_expanded', {
                  question: lastExpandedQuestion,
                  faq_index: faqIndex
                })
              }
            }}
            type="multiple"
          >
            {faqs.map((item) => (
              <AccordionItem
                className="py-3 first:pt-0 first:pb-3"
                key={item.question}
                value={item.question}
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
