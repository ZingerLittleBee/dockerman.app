import Script from 'next/script'

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
  return (
    <Script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: runs before hydration to avoid a theme flash
      dangerouslySetInnerHTML={{ __html: script }}
      id="dm-theme-script"
      strategy="beforeInteractive"
    />
  )
}
