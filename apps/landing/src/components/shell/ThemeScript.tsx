export function ThemeScript() {
  const script = `
    try {
      var stored = localStorage.getItem('theme');
      var theme = (stored && stored !== 'system')
        ? stored
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      if (theme === 'dark') document.documentElement.classList.add('dark');
    } catch (e) {}
  `
  // biome-ignore lint/security/noDangerouslySetInnerHtml: inline script required to set theme before hydration to avoid flash
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
