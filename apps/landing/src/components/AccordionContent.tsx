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
        'grid grid-rows-[0fr] transition-[grid-template-rows,visibility] duration-200 ease-out-strong',
        'data-[state=open]:grid-rows-[1fr] data-[state=open]:duration-250',
        'data-[state=closed]:invisible',
        'motion-reduce:transition-none'
      )}
      forceMount
      ref={ref}
      {...props}
    >
      <div className="min-h-0 overflow-hidden">
        <div className={cx('pb-4 text-sm', 'text-gray-700 dark:text-gray-200', className)}>
          {children}
        </div>
      </div>
    </AccordionPrimitives.Content>
  )
}
