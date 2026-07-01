import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { cx } from '@repo/shared/utils'
import type { ComponentPropsWithoutRef, ElementRef, Ref } from 'react'

interface AccordionContentProps
  extends ComponentPropsWithoutRef<typeof AccordionPrimitives.Content> {
  ref?: Ref<ElementRef<typeof AccordionPrimitives.Content>>
}

export function AccordionContent({ className, children, ref, ...props }: AccordionContentProps) {
  return (
    <AccordionPrimitives.Content
      className={cx(
        'transform-gpu data-[state=closed]:animate-accordionClose data-[state=open]:animate-accordionOpen'
      )}
      ref={ref}
      {...props}
    >
      <div
        className={cx(
          'overflow-hidden pb-4 text-sm',
          'text-gray-700 dark:text-gray-200',
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitives.Content>
  )
}
