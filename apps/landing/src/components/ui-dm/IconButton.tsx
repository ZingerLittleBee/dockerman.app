import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function IconButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      {...props}
      className={`grid h-8 w-8 place-items-center rounded-md border border-transparent text-dm-ink-2 hover:bg-dm-bg-soft hover:text-dm-ink ${props.className ?? ''}`}
    >
      {children}
    </button>
  )
}
