export function ThemeScript() {
  const script = `
    try {
      var stored = localStorage.getItem('theme');
      var theme = (stored === 'light' || stored === 'dark') ? stored : 'dark';
      if (theme === 'dark') document.documentElement.classList.add('dark');
    } catch (e) {
      document.documentElement.classList.add('dark');
    }
  `
  // biome-ignore lint/security/noDangerouslySetInnerHtml: inline script required to set theme before hydration to avoid flash
  return <script dangerouslySetInnerHTML={{ __html: script }} />
}
