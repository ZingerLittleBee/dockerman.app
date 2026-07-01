import * as AccordionPrimitives from '@radix-ui/react-accordion'
import { RiAddLine } from '@remixicon/react'
import { cx } from '@repo/shared/utils'
import type { ComponentPropsWithoutRef, ElementRef, Ref } from 'react'

interface AccordionTriggerProps
  extends ComponentPropsWithoutRef<typeof AccordionPrimitives.Trigger> {
  ref?: Ref<ElementRef<typeof AccordionPrimitives.Trigger>>
}

export function AccordionTrigger({ className, children, ref, ...props }: AccordionTriggerProps) {
  return (
    <AccordionPrimitives.Header className="flex w-full">
      <AccordionPrimitives.Trigger
        className={cx(
          'group flex w-full flex-1 cursor-pointer items-center justify-between py-3 text-left font-medium text-sm leading-none',
          'text-gray-900 dark:text-gray-50',
          'data-[disabled]:cursor-default data-[disabled]:text-gray-400 dark:data-[disabled]:text-gray-600',
          'focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
        <RiAddLine
          aria-hidden="true"
          className={cx(
            'size-5 shrink-0 transition-transform duration-150 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:-rotate-45',
            'text-gray-400 dark:text-gray-600',
            'group-data-[disabled]:text-gray-300 group-data-[disabled]:dark:text-gray-700'
          )}
          focusable="false"
        />
      </AccordionPrimitives.Trigger>
    </AccordionPrimitives.Header>
  )
}
