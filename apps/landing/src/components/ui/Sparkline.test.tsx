import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { Sparkline } from './Sparkline'

describe('Sparkline', () => {
  test('renders a <path> element when given data', () => {
    const html = renderToStaticMarkup(<Sparkline data={[1, 2, 3, 4, 5]} stroke="#10b981" />)
    expect(html).toContain('<path')
  })

  test('renders no path when data is empty', () => {
    const html = renderToStaticMarkup(<Sparkline data={[]} stroke="#10b981" />)
    expect(html).not.toContain('<path')
  })

  test('emits a fill path when fill prop is set', () => {
    const html = renderToStaticMarkup(
      <Sparkline data={[1, 2, 3]} fill="#10b98133" stroke="#10b981" />
    )
    expect((html.match(/<path/g) || []).length).toBe(2)
  })
})
