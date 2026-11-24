import type { Locale } from '@repo/shared/i18n'
import { siteConfig } from '@/app/siteConfig'
import { AppWindow } from './AppWindow'
import type { HomeT } from './copy'
import { type DownloadCtaLabels, DownloadCtas } from './DownloadCtas'
import { ENGINES } from './data'
import { HeroTilt } from './HeroTilt'
import s from './home.module.css'
import { cn, Logo } from './primitives'

export function downloadLabels(t: HomeT): DownloadCtaLabels {
  return {
    download: {
      mac: t('home.hero.download.mac'),
      windows: t('home.hero.download.windows'),
      linux: t('home.hero.download.linux')
    },
    copy: t('home.hero.copy'),
    copied: t('home.hero.copied'),
    copyAria: t('home.hero.copyAria')
  }
}

export function HomeHero({ locale, t }: { locale: Locale; t: HomeT }) {
  return (
    <HeroTilt>
      <div aria-hidden="true" className={s.glow} />
      <div className={cn(s.wrap, s.heroC)}>
        <a className={s.badge} href="#sandbox">
          <span className={s.badgeIn}>
            <span className={s.dot} />
            <span className={cn(s.mono, s.v)}>v{siteConfig.latestVersion}</span>
            <span>{t('home.hero.badge')}</span>
            <span className={s.bNew}>{t('home.hero.badgeNew')}</span>
            <span aria-hidden="true" className={s.arr}>
              →
            </span>
          </span>
        </a>
        <h1 className={s.h1}>
          <span className={s.ln}>
            <span className={s.lnI}>{t('home.hero.titleLead')}</span>
          </span>
          <span className={s.ln}>
            <span className={cn(s.lnI, s.shine)}>{t('home.hero.titleAccent')}</span>
          </span>
        </h1>
        <p className={s.sub}>{t('home.hero.description')}</p>
        <DownloadCtas labels={downloadLabels(t)} locale={locale} />
        <div className={s.engs}>
          <span className={s.engsL}>{t('home.hero.runsOn')}</span>
          {ENGINES.map((engine) => (
            <span className={s.ep} key={engine.name}>
              <Logo fit={engine.fit} src={engine.logo} />
              {engine.name}
            </span>
          ))}
        </div>
        <div className={s.meta}>
          <span>macOS</span>
          <i />
          <span>Windows</span>
          <i />
          <span>Linux</span>
          <i />
          <span>{t('home.hero.freeLocal')}</span>
        </div>
      </div>
      <AppWindow t={t} />
    </HeroTilt>
  )
}
