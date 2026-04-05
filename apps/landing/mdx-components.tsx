import defaultMdxComponents from 'fumadocs-ui/mdx'
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion'
import { Callout } from 'fumadocs-ui/components/callout'
import { Card, Cards } from 'fumadocs-ui/components/card'
import { File, Files, Folder } from 'fumadocs-ui/components/files'
import { Step, Steps } from 'fumadocs-ui/components/steps'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { TypeTable } from 'fumadocs-ui/components/type-table'
import type { MDXComponents } from 'mdx/types'

const docsMdxComponents: MDXComponents = {
  Accordion,
  Accordions,
  Callout,
  Card,
  Cards,
  File,
  Files,
  Folder,
  Step,
  Steps,
  Tab,
  Tabs,
  TypeTable
}

// Fumadocs docs pages use getMDXComponents.
// Globally register the Fumadocs UI components used across the new docs so that
// individual MDX files do not need per-file imports.
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...docsMdxComponents,
    ...components
  }
}

// The docs and changelog MDX runtime both flow through useMDXComponents here.
// Keep the docs component registry available globally; page-level imports still win.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...docsMdxComponents,
    ...components
  }
}
