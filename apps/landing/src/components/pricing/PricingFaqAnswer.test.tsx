import { expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { PricingFaqAnswer } from './PricingFaqAnswer'

test('renders the optional license management action', () => {
  const markup = renderToStaticMarkup(
    <PricingFaqAnswer
      action={{
        href: 'https://license.dockerman.app/manage',
        label: 'Open License Self-Service'
      }}
      text="Reset every device before activating again."
    />
  )

  expect(markup).toContain('href="https://license.dockerman.app/manage"')
  expect(markup).toContain('Open License Self-Service')
})

test('keeps email addresses clickable without an action', () => {
  const markup = renderToStaticMarkup(
    <PricingFaqAnswer text="Contact support@dockerman.app for help." />
  )

  expect(markup).toContain('href="mailto:support@dockerman.app"')
  expect(markup).not.toContain('license.dockerman.app')
})
