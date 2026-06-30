import { focusRing } from '@repo/shared/utils'
import { tv } from 'tailwind-variants'

export const buttonVariants = tv({
  base: [
    'relative inline-flex items-center justify-center whitespace-nowrap rounded-lg border px-3 py-2 text-center font-medium text-sm shadow-sm transition-all duration-100 ease-in-out',
    'disabled:pointer-events-none disabled:shadow-none',
    focusRing
  ],
  variants: {
    variant: {
      primary: [
        'border-transparent',
        'text-white dark:text-white',
        'bg-indigo-600 dark:bg-indigo-500',
        'hover:bg-indigo-700 dark:hover:bg-indigo-400',
        'disabled:bg-indigo-100 disabled:text-indigo-400',
        'disabled:dark:bg-indigo-800 disabled:dark:text-indigo-600'
      ],
      secondary: [
        'border-gray-300 dark:border-gray-800',
        'text-gray-900 dark:text-gray-50',
        'bg-white dark:bg-gray-950',
        'hover:bg-gray-50 dark:hover:bg-gray-900/60',
        'disabled:text-gray-400',
        'disabled:dark:text-gray-600'
      ],
      light: [
        'shadow-none',
        'border-transparent',
        'text-gray-900 dark:text-gray-50',
        'bg-gray-200 dark:bg-gray-900',
        'hover:bg-gray-300/70 dark:hover:bg-gray-800/80',
        'disabled:bg-gray-100 disabled:text-gray-400',
        'disabled:dark:bg-gray-800 disabled:dark:text-gray-600'
      ],
      ghost: [
        'shadow-none',
        'border-transparent',
        'text-gray-900 dark:text-gray-50',
        'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800/80',
        'disabled:text-gray-400',
        'disabled:dark:text-gray-600'
      ],
      destructive: [
        'text-white',
        'border-transparent',
        'bg-red-600 dark:bg-red-700',
        'hover:bg-red-700 dark:hover:bg-red-600',
        'disabled:bg-red-300 disabled:text-white',
        'disabled:dark:bg-red-950 disabled:dark:text-red-400'
      ]
    }
  },
  defaultVariants: {
    variant: 'primary'
  }
})
