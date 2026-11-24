import type { Locale } from '@repo/shared/i18n'
import type { HomeT } from './copy'
import { DownloadCtas } from './DownloadCtas'
import { ENGINES, STACK_LOGOS } from './data'
import { downloadLabels } from './HomeHero'
import s from './home.module.css'
import { cn, Logo } from './primitives'

const ORBIT_SLOT = [s.o1, s.o2, s.o3, s.o4, s.o5, s.o6, s.o7, s.o8, s.o9, s.o10]

/** Closing call to action, circled by the images and engines Dockerman runs. */
export function FinalCta({ locale, t }: { locale: Locale; t: HomeT }) {
  return (
    <section className={s.cta} id="download">
      <div aria-hidden="true" className={s.ctaGlow} />
      <div aria-hidden="true" className={s.orbit}>
        <div className={s.ringO}>
          {STACK_LOGOS.map((item, i) => (
            <span className={cn(s.os, ORBIT_SLOT[i])} key={item.name}>
              <b className={s.mono}>
                <Logo fit={item.fit} src={item.logo} />
                {item.name}
              </b>
            </span>
          ))}
        </div>
        <div className={s.ringI}>
          {ENGINES.map((engine, i) => (
            <span className={cn(s.os, ORBIT_SLOT[i])} key={engine.name}>
              <b>
                <Logo fit={engine.fit} src={engine.logo} />
                {engine.name}
              </b>
            </span>
          ))}
        </div>
      </div>
      <div className={cn(s.wrap, s.ctaC)}>
        <h2 className={cn(s.hCta, s.rv)}>
          <span>{t('home.cta.titleLead')}</span>
          <span>
            <span className={s.shine}>{t('home.cta.titleAccent')}</span>
          </span>
        </h2>
        <p className={s.sub2}>{t('home.cta.description')}</p>
        <DownloadCtas labels={downloadLabels(t)} locale={locale} />
        <div className={s.pp}>
          <span>{t('home.cta.local')}</span>
          <span>{t('home.cta.remote')}</span>
        </div>
      </div>
    </section>
  )
}
