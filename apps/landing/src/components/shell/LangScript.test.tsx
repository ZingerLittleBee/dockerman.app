import { describe, expect, test } from 'bun:test'
import vm from 'node:vm'

import { LangScript } from './LangScript'

function getInlineScript() {
  const element = LangScript()
  return element.props.dangerouslySetInnerHTML.__html
}

function createBrowserContext(pathname: string) {
  const nativePushState = () => undefined
  const nativeReplaceState = () => undefined
  const browser = vm.createContext({
    addEventListener: () => undefined,
    document: { documentElement: { lang: 'en' } },
    history: {
      pushState: nativePushState,
      replaceState: nativeReplaceState
    },
    location: { pathname }
  })

  return { browser, nativePushState, nativeReplaceState }
}

describe('LangScript', () => {
  test('sets the initial document language without patching the History API', () => {
    const { browser, nativePushState, nativeReplaceState } =
      createBrowserContext('/zh/docs/cli/images')

    vm.runInContext(getInlineScript(), browser)

    expect(browser.document.documentElement.lang).toBe('zh')
    expect(browser.history.pushState).toBe(nativePushState)
    expect(browser.history.replaceState).toBe(nativeReplaceState)
  })

  test('does not recurse when another library wraps history between executions', () => {
    const { browser } = createBrowserContext('/zh/docs/cli/images')
    const inlineScript = getInlineScript()

    vm.runInContext(inlineScript, browser)
    const firstReplaceState = browser.history.replaceState
    browser.history.replaceState = function routerReplaceState(...args: unknown[]) {
      return firstReplaceState.apply(this, args)
    }
    vm.runInContext(inlineScript, browser)

    expect(() => browser.history.replaceState({}, '', '/zh/docs/cli/images')).not.toThrow()
  })
})
