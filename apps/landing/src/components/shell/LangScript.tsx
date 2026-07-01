import { defaultLocale, locales } from '@repo/shared/i18n'
import Script from 'next/script'

// The root layout must stay statically rendered (no headers()/dynamic APIs),
// otherwise every [locale] route opts out of SSG. We render lang={defaultLocale}
// in the static HTML and correct it from the URL before paint. Googlebot runs
// this script; the hreflang alternates in the static <head> remain the primary
// language signal for crawlers that don't.
export function LangScript() {
  const script = `
    try {
      var locales = ${JSON.stringify(locales)};
      var fallback = ${JSON.stringify(defaultLocale)};
      var applyLang = function () {
        var seg = location.pathname.split('/')[1];
        document.documentElement.lang = locales.indexOf(seg) !== -1 ? seg : fallback;
      };
      applyLang();
      var pushState = history.pushState;
      history.pushState = function () {
        var result = pushState.apply(this, arguments);
        applyLang();
        return result;
      };
      var replaceState = history.replaceState;
      history.replaceState = function () {
        var result = replaceState.apply(this, arguments);
        applyLang();
        return result;
      }
      addEventListener('popstate', applyLang);
    } catch (e) {}
  `
  return (
    <Script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: runs before hydration to keep static root layout while applying the URL locale
      dangerouslySetInnerHTML={{ __html: script }}
      id="dm-lang-script"
      strategy="beforeInteractive"
    />
  )
}
