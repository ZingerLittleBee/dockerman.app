'use client'

import type { Locale } from '@repo/shared/i18n'
import Image from 'next/image'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/Accordion'
import type { ChangelogEntryData, ChangelogItem, ChangelogSectionTone } from '@/lib/changelog'

interface ChangelogTimelineProps {
  entries: ChangelogEntryData[]
  locale: Locale
}

const sectionLabels = {
  en: {
    bugfix: 'Bug Fixes',
    feature: 'New',
    improvement: 'Updates',
    localization: 'Localization',
    other: 'Changes',
    performance: 'Performance'
  },
  zh: {
    bugfix: '修复',
    feature: '新功能',
    improvement: '改进',
    localization: '国际化',
    other: '更新',
    performance: '性能'
  }
} as const

function formatInlineText(content: string) {
  return content.split(/(`[^`]+`)/g).map((segment, index) => {
    if (!segment) {
      return null
    }

    if (segment.startsWith('`') && segment.endsWith('`')) {
      return (
        <code
          className="rounded bg-gray-900 px-1.5 py-0.5 font-medium text-[0.92em] text-white dark:bg-white dark:text-gray-950"
          key={`${content}-${index}`}
        >
          {segment.slice(1, -1)}
        </code>
      )
    }

    return <span key={`${content}-${index}`}>{segment}</span>
  })
}

function getToneBadge(tone: ChangelogSectionTone, locale: Locale) {
  switch (tone) {
    case 'feature':
      return {
        className:
          'border-none h-6 rounded-sm bg-green-600/10 text-green-600 dark:bg-green-400/10 dark:text-green-400',
        label: sectionLabels[locale].feature
      }
    case 'improvement':
      return {
        className:
          'border-none h-6 rounded-sm bg-sky-600/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400',
        label: sectionLabels[locale].improvement
      }
    case 'bugfix':
      return {
        className:
          'border-none h-6 rounded-sm bg-amber-600/10 text-amber-600 dark:bg-orange-400/10 dark:text-orange-400',
        label: sectionLabels[locale].bugfix
      }
    case 'performance':
      return {
        className:
          'border-none h-6 rounded-sm bg-fuchsia-600/10 text-fuchsia-600 dark:bg-fuchsia-400/10 dark:text-fuchsia-400',
        label: sectionLabels[locale].performance
      }
    case 'localization':
      return {
        className:
          'border-none h-6 rounded-sm bg-pink-600/10 text-pink-600 dark:bg-pink-400/10 dark:text-pink-400',
        label: sectionLabels[locale].localization
      }
    default:
      return {
        className:
          'border-none h-6 rounded-sm bg-gray-600/10 text-gray-600 dark:bg-gray-400/10 dark:text-gray-300',
        label: sectionLabels[locale].other
      }
  }
}

function renderListItem(item: ChangelogItem) {
  if (item.label && item.description) {
    return (
      <>
        {item.icon ? <span className="mr-1.5">{item.icon}</span> : null}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {formatInlineText(item.label)}
        </span>
        {': '}
        {formatInlineText(item.description)}
      </>
    )
  }

  return (
    <>
      {item.icon ? <span className="mr-1.5">{item.icon}</span> : null}
      {formatInlineText(item.content)}
    </>
  )
}

function TimelineEntry({
  defaultSectionIds,
  entry,
  isLast,
  locale
}: {
  defaultSectionIds: string[]
  entry: ChangelogEntryData
  isLast: boolean
  locale: Locale
}) {
  return (
    <div className="relative flex w-full scroll-mt-24 justify-end gap-2" id={entry.id}>
      <div className="sticky top-24 hidden w-36 flex-col items-end gap-2 self-start pb-4 md:flex">
        <span className="inline-flex rounded-sm bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700 text-sm ring-1 ring-indigo-700/10 dark:bg-indigo-500/20 dark:text-indigo-300 dark:ring-indigo-400/10">
          {entry.version}
        </span>
        <div className="text-right font-medium text-gray-500 text-sm dark:text-gray-400">
          {entry.date}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="sticky top-24 flex size-6 items-center justify-center">
          <span className="flex size-[18px] items-center justify-center rounded-full bg-indigo-500/15 dark:bg-indigo-400/20">
            <span className="size-3 rounded-full bg-indigo-600 dark:bg-indigo-400" />
          </span>
        </div>
        {isLast ? null : (
          <span className="w-px flex-1 border border-gray-200 dark:border-gray-800" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 pb-11 pl-3 md:pl-6 lg:pl-9">
        <div className="flex flex-col gap-2 md:hidden">
          <span className="inline-flex w-fit rounded-sm bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700 text-sm ring-1 ring-indigo-700/10 dark:bg-indigo-500/20 dark:text-indigo-300 dark:ring-indigo-400/10">
            {entry.version}
          </span>
          <div className="font-medium text-gray-600 text-sm dark:text-gray-400">{entry.date}</div>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-gray-950 text-xl dark:text-gray-50">{entry.title}</h2>
          <p className="text-gray-600 text-sm leading-7 dark:text-gray-400">
            {formatInlineText(entry.summary)}
          </p>
        </div>

        {entry.images.length > 0 ? (
          <div className={entry.images.length > 1 ? 'grid gap-4 md:grid-cols-2' : ''}>
            {entry.images.map((image) => (
              <Image
                alt={image.alt}
                className="overflow-hidden rounded-lg shadow-black/15 shadow-md ring-1 ring-gray-200/50 dark:ring-gray-800"
                height={675}
                key={`${entry.id}-${image.src}`}
                src={image.src}
                width={1200}
              />
            ))}
          </div>
        ) : null}

        <Accordion className="-mt-4 mb-0 w-full" defaultValue={defaultSectionIds} type="multiple">
          {entry.sections.map((section) => {
            const badge = getToneBadge(section.tone, locale)

            return (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="hover:no-underline [&>svg]:size-6">
                  <span
                    className={`inline-flex items-center px-2.5 ${badge.className} font-medium text-xs`}
                  >
                    {badge.label}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  <ul className="list-inside list-disc space-y-3 text-sm">
                    {section.items.map((item) => (
                      <li key={`${section.id}-${item.content}`}>{renderListItem(item)}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}

export default function ChangelogTimeline({ entries, locale }: ChangelogTimelineProps) {
  return (
    <div className="flex w-full flex-col">
      {entries.map((entry, index) => (
        <TimelineEntry
          defaultSectionIds={
            index === 0 ? entry.sections.slice(0, 1).map((section) => section.id) : []
          }
          entry={entry}
          isLast={index === entries.length - 1}
          key={entry.id}
          locale={locale}
        />
      ))}
    </div>
  )
}
