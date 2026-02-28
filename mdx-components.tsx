import type { MDXComponents } from 'mdx/types'
import {
  Bold,
  ChangelogEntry,
  ChangelogImage,
  CustomLink,
  H1,
  H2,
  H3,
  P,
  Ul
} from '@/components/mdx'

const customComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  p: P,
  Bold,
  ul: Ul,
  a: CustomLink,
  ChangelogEntry,
  ChangelogImage
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...customComponents,
    ...components
  }
}

export const useMDXComponents = getMDXComponents
