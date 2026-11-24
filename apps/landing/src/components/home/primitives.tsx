import Image from 'next/image'
import type { ReactNode } from 'react'
import type { LogoFit } from './data'
import s from './home.module.css'

/** Joins CSS-module class names; falsy entries are skipped. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/** 24px line icon drawn with the page stroke style. */
export function Ic({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg aria-hidden="true" className={cn(s.ic, className)} viewBox="0 0 24 24">
      {children}
    </svg>
  )
}

const FIT_CLASS: Record<LogoFit, string | undefined> = {
  pad: undefined,
  full: s.full,
  large: s.cl
}

/** Brand logo on a light rounded tile. Size comes from the parent's `.lgo` rules. */
export function Logo({
  src,
  fit = 'pad',
  className
}: {
  src: string
  fit?: LogoFit
  className?: string
}) {
  return (
    <span className={cn(s.lgo, FIT_CLASS[fit], className)}>
      <Image alt="" height={64} src={src} unoptimized width={64} />
    </span>
  )
}

/** Two-line section heading: a lead line and a dimmed trailing line. */
export function SectionTitle({
  lead,
  trail,
  centered,
  as: Tag = 'h2'
}: {
  lead: string
  trail: string
  centered?: boolean
  as?: 'h2' | 'h3'
}) {
  return (
    <Tag className={cn(s.h2, centered && s.ctr, s.rv)}>
      <span>{lead}</span>
      <span className={s.dim}>{trail}</span>
    </Tag>
  )
}

export const ArrowRight = () => (
  <Ic>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Ic>
)

export const DownloadIcon = () => (
  <Ic>
    <path d="M12 4v11" />
    <path d="m7 10 5 5 5-5" />
    <path d="M5 20h14" />
  </Ic>
)

export const CheckIcon = () => (
  <Ic>
    <path d="m5 12 5 5 9-10" />
  </Ic>
)

export const RefreshIcon = () => (
  <Ic>
    <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
    <path d="M21 3v5h-5" />
  </Ic>
)

export const SearchIcon = () => (
  <Ic>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </Ic>
)

export const GlobeIcon = () => (
  <Ic>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3a14 14 0 0 1 0 18" />
    <path d="M12 3a14 14 0 0 0 0 18" />
  </Ic>
)

export const BoxIcon = () => (
  <Ic>
    <path d="M12 3 4 7.5v9L12 21l8-4.5v-9Z" />
    <path d="M12 12 4 7.5M12 12l8-4.5M12 12v9" />
  </Ic>
)

export const ImageIcon = () => (
  <Ic>
    <rect height="18" rx="2" width="18" x="3" y="3" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
  </Ic>
)

export const VolumeIcon = () => (
  <Ic>
    <path d="M22 12H2M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1ZM6 16h.01M10 16h.01" />
  </Ic>
)

export const ServerIcon = () => (
  <Ic>
    <rect height="7" rx="2" width="18" x="3" y="4" />
    <rect height="7" rx="2" width="18" x="3" y="13" />
    <path d="M7 7.5h.01M7 16.5h.01" />
  </Ic>
)

export const CogIcon = () => (
  <Ic>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
  </Ic>
)

/** The Dockerman glyph, filled with currentColor. */
export function BrandGlyph({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 32 32">
      <path d="M28,12H20V4h8Zm-6-2h4V6H22Z" />
      <path d="M17,15V9H9V23H23V15Zm-6-4h4v4H11Zm4,10H11V17h4Zm6,0H17V17h4Z" />
      <path d="M26,28H6a2,2,0,0,1-2-2V6A2,2,0,0,1,6,4H16V6H6V26H26V16h2V26A2,2,0,0,1,26,28Z" />
    </svg>
  )
}
