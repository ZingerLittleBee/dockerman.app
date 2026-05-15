import { defaultLocale, locales } from '@repo/shared/i18n'

// The root layout must stay statically rendered (no headers()/dynamic APIs),
// otherwise every [locale] route opts out of SSG. We render lang={defaultLocale}
// in the static HTML and correct it from the URL before paint. Googlebot runs
// this script; the hreflang alternates in the static <head> remain the primary
// language signal for crawlers that don't.
export function LangScript() {
  const script = `
    try {
      var seg = location.pathname.split('/')[1];
      var locales = ${JSON.stringify(locales)};
      if (locales.indexOf(seg) !== -1 && seg !== ${JSON.stringify(defaultLocale)}) {
        document.documentElement.lang = seg;
      }
    } catch (e) {}
  `
  // biome-ignore lint/security/noDangerouslySetInnerHtml: inline script must run before paint to set <html lang> without losing SSG
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
