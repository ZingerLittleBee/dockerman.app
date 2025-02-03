import React from "react"

interface BadgeProps extends React.ComponentPropsWithoutRef<"span"> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, ...props }: BadgeProps, forwardedRef) => {
    return (
      <span
        ref={forwardedRef}
        className="z-10 block w-fit rounded-lg border border-indigo-200/20 bg-indigo-50/50 px-3 py-1.5 font-semibold uppercase leading-4 tracking-tighter sm:text-sm dark:border-indigo-800/30 dark:bg-indigo-900/20"
        {...props}
      >
        <span className="bg-gradient-to-b from-indigo-500 to-indigo-600 bg-clip-text text-transparent dark:from-indigo-200 dark:to-indigo-400">
          {children}
        </span>
      </span>
    )
  },
)

Badge.displayName = "Badge"

export { Badge, type BadgeProps }
