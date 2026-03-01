'use client'

import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import posthog from 'posthog-js'

interface TrackedExternalLinkProps {
  href: string
  name: string
  section: string
}

export function TrackedExternalLink({ href, name, section }: TrackedExternalLinkProps) {
  return (
    <a
      className="flex rounded-md text-gray-500 text-sm transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      href={href}
      onClick={() => {
        posthog.capture('github_link_clicked', {
          link_url: href,
          link_text: name,
          section,
          location: 'footer'
        })
      }}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span>{name}</span>
      <div className="ml-0.5 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
        <RiArrowRightUpLine
          aria-hidden="true"
          className="size-full shrink-0 text-gray-900 dark:text-gray-300"
        />
      </div>
    </a>
  )
}

interface TrackedFooterLinkProps {
  href: string
  name: string
  section: string
  external?: boolean
}

export function TrackedFooterLink({
  href,
  name,
  section,
  external = false
}: TrackedFooterLinkProps) {
  const handleClick = () => {
    posthog.capture('footer_link_clicked', {
      link_url: href,
      link_text: name,
      section,
      is_external: external
    })
  }

  if (external) {
    return (
      <a
        className="flex rounded-md text-gray-500 text-sm transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        href={href}
        onClick={handleClick}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span>{name}</span>
        <div className="ml-1 aspect-square size-3 rounded-full bg-gray-100 p-px dark:bg-gray-500/20">
          <RiArrowRightUpLine
            aria-hidden="true"
            className="size-full shrink-0 text-gray-900 dark:text-gray-300"
          />
        </div>
      </a>
    )
  }

  return (
    <Link
      className="flex rounded-md text-gray-500 text-sm transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      href={href}
      onClick={handleClick}
    >
      <span>{name}</span>
    </Link>
  )
}
