import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { Accordion, AccordionItem, AccordionTrigger } from './Accordion'

const headerWidthClassPattern = /<h3[^>]*class="[^"]*w-full[^"]*"/
const triggerWidthClassPattern = /<button[^>]*class="[^"]*w-full[^"]*"/

describe('AccordionTrigger layout', () => {
  test('stretches the header and trigger to the full item width', () => {
    const markup = renderToStaticMarkup(
      <Accordion collapsible type="single">
        <AccordionItem value="feature">
          <AccordionTrigger>New</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    )

    expect(markup).toMatch(headerWidthClassPattern)
    expect(markup).toMatch(triggerWidthClassPattern)
  })
})
