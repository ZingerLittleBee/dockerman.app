import clsx from 'clsx'
import Image, { type ImageProps } from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word characters except for -
    .replace(/--+/g, '-') // Replace multiple - with single -
}

function CustomHeading(props: any) {
  const slug = slugify(props.children)
  return React.createElement(
    `h${props.level}`,
    {
      id: slug,
      className: clsx('inline-flex scroll-mt-36 md:scroll-mt-24', props.className)
    },
    [
      React.createElement('a', {
        href: `#${slug}`,
        key: `link-${slug}`,
        className: 'anchor-link'
      })
    ],
    props.children
  )
}

export const H1 = ({ children }: React.HTMLProps<HTMLHeadingElement>) => (
  <CustomHeading
    className="font-bold text-3xl text-gray-900 normal-case tracking-tight sm:text-4xl dark:text-gray-50"
    level={1}
  >
    {children}
  </CustomHeading>
)

export const H2 = ({ children }: React.HTMLProps<HTMLHeadingElement>) => (
  <CustomHeading
    className="mb-4 font-semibold text-gray-900 text-lg normal-case tracking-tight dark:text-gray-50"
    level={2}
  >
    {children}
  </CustomHeading>
)

export const H3 = ({ children }: React.HTMLProps<HTMLHeadingElement>) => (
  <CustomHeading
    className="mb-2 font-semibold text-gray-900 normal-case tracking-tight dark:text-gray-50"
    level={3}
  >
    {children}
  </CustomHeading>
)

export const P = (props: React.HTMLProps<HTMLParagraphElement>) => (
  <p {...props} className="mb-8 text-gray-600 leading-7 dark:text-gray-400" />
)

export const Ul = (props: React.HTMLAttributes<HTMLUListElement>) => (
  <ul
    className="mb-10 ml-[30px] list-['–__'] space-y-1 text-gray-600 leading-8 dark:text-gray-400"
    {...props}
  />
)

export const Bold = (props: React.HTMLAttributes<HTMLSpanElement>) => (
  <span className="font-semibold text-gray-900 dark:text-gray-50" {...props} />
)

export function CustomLink(props: any) {
  const href = props.href
  const style =
    'text-indigo-600 font-medium hover:text-indigo-500 dark:text-indigo-500 hover:dark:text-indigo-400'
  if (href.startsWith('/')) {
    return (
      <Link className={style} href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  if (href.startsWith('#')) {
    return <a {...props} className={style} />
  }

  return <a className={style} rel="noopener noreferrer" target="_blank" {...props} />
}

export const ChangelogEntry = ({
  version,
  date,
  children
}: {
  version: string
  date: string
  children: any
}) => (
  <div className="relative my-20 flex flex-col justify-center gap-x-14 border-gray-200 border-b md:flex-row dark:border-gray-800">
    <div className="mb-4 md:mb-10 md:w-1/3">
      <div className="sticky top-24 flex items-center space-x-2 md:block md:space-x-0 md:space-y-1.5">
        <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 font-medium text-indigo-700 text-xs ring-1 ring-indigo-700/10 ring-inset dark:bg-indigo-500/20 dark:text-indigo-400 dark:ring-indigo-400/10">
          {version}
        </span>
        <span className="block whitespace-nowrap text-gray-600 text-sm dark:text-gray-400">
          {date}
        </span>
      </div>
    </div>
    <div className="mb-12">{children}</div>
  </div>
)

export const ChangelogImage = ({ alt, width = 1200, height = 675, src, ...props }: ImageProps) => (
  <Image
    alt={alt}
    className="mb-10 overflow-hidden rounded shadow-black/15 shadow-md ring-1 ring-gray-200/50 dark:ring-gray-800"
    height={height}
    src={src}
    width={width}
    {...props}
  />
)
