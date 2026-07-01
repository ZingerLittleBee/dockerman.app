import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { cx } from '@repo/shared/utils'
import type { ComponentPropsWithoutRef, ElementRef, Ref } from 'react'

interface AccordionItemProps extends ComponentPropsWithoutRef<typeof AccordionPrimitives.Item> {
  ref?: Ref<ElementRef<typeof AccordionPrimitives.Item>>
}

export function AccordionItem({ className, ref, ...props }: AccordionItemProps) {
  return (
    <AccordionPrimitives.Item
      className={cx(
        'overflow-hidden border-b first:mt-0',
        'border-gray-200 dark:border-gray-800',
        className
      )}
      ref={ref}
      tremor-id="tremor-raw"
      {...props}
    />
  )
}
