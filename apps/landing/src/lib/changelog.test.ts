import { describe, expect, mock, test } from 'bun:test'

// The module under test imports 'server-only', a Next.js-provided side-effect
// module that cannot resolve in a bun:test runner. parseEntry itself is pure,
// so we stub the side-effect module before importing changelog.ts.
mock.module('server-only', () => ({}))

const { parseEntry } = await import('./changelog')

describe('changelog parser', () => {
  test('captures a single Callout block', () => {
    const body = `## Title\n\nlede\n\n<Callout type="tip">Use brew.</Callout>\n\n### Features\n\n- x`
    const entry = parseEntry('1.0.0', '2026-04-23', body)
    expect(entry.blocks).toHaveLength(1)
    expect(entry.blocks[0]).toEqual({ body: 'Use brew.', kind: 'callout', type: 'tip' })
  })

  test('captures a Figure block with src and caption', () => {
    const body = `## Title\n\n<Figure src="/a.png" caption="A" />`
    const entry = parseEntry('1.0.0', '2026-04-23', body)
    expect(entry.blocks).toHaveLength(1)
    expect(entry.blocks[0]).toEqual({ caption: 'A', kind: 'figure', src: '/a.png' })
  })

  test('returns empty blocks array when no new tags are present', () => {
    const body = `## Title\n\nlede\n\n### Features\n\n- x`
    const entry = parseEntry('1.0.0', '2026-04-23', body)
    expect(entry.blocks).toEqual([])
  })
})
