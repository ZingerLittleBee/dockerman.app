import type { CSSProperties } from 'react'
import { type HomeT, list } from './copy'
import { ENGINES, KUBERNETES_LOGO } from './data'
import { type EngineCard, EngineSwitchboard } from './EngineSwitchboard'
import s from './home.module.css'
import { cn, Logo, SectionTitle } from './primitives'

const SshMark = () => (
  <span className={cn(s.lgo, s.dk)}>
    <svg
      aria-hidden="true"
      fill="none"
      stroke="#c7cbff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.2"
      style={{ width: '64%', height: '64%' }}
      viewBox="0 0 24 24"
    >
      <path d="m5 8 4 4-4 4" />
      <path d="M12 17h7" />
    </svg>
  </span>
)

const MARQUEE = [
  ...ENGINES.map((engine) => ({
    name: engine.name,
    mark: <Logo fit={engine.fit} src={engine.logo} />
  })),
  { name: 'Remote SSH', mark: <SshMark /> },
  { name: 'Kubernetes', mark: <Logo src={KUBERNETES_LOGO} /> }
]

/** Infinite logo strip of every supported runtime. The list is doubled for a seamless loop. */
export function EngineMarquee({ t }: { t: HomeT }) {
  return (
    <section aria-label={t('home.hero.runsOn')} className={s.mqSec}>
      <div className={s.mq}>
        <div className={s.mqT}>
          {[false, true].flatMap((copy) =>
            MARQUEE.map((item) => (
              <span aria-hidden={copy || undefined} className={s.mqI} key={`${item.name}-${copy}`}>
                {item.mark}
                {item.name}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

export function EnginesSection({ t }: { t: HomeT }) {
  const copy = list<{ description: string; tag: string }>(t, 'home.engines.items')
  const engines: EngineCard[] = ENGINES.map((engine, i) => ({ ...engine, ...copy[i] }))

  return (
    <section className={cn(s.wrap, s.sec)} id="engines">
      <EngineSwitchboard
        engines={engines}
        heading={
          <SectionTitle lead={t('home.engines.titleLead')} trail={t('home.engines.titleTrail')} />
        }
        labels={{
          all: t('home.engines.all'),
          platformAria: t('home.engines.platformAria'),
          connecting: t('home.engines.connecting'),
          connected: t('home.engines.connected'),
          hubFooter: t('home.engines.hubFooter')
        }}
      />
      <div className={cn(s.also, s.rv)}>
        <div className={s.al}>
          <div aria-hidden="true" className={cn(s.alV, s.rmt)}>
            <span className={s.n1} />
            <span className={s.lk}>
              <i />
            </span>
            <span className={s.n2} />
            <span className={cn(s.lat, s.mono)}>23 ms</span>
          </div>
          <div>
            <h3>{t('home.engines.remoteTitle')}</h3>
            <p>{t('home.engines.remoteBody')}</p>
          </div>
        </div>
        <div className={s.al}>
          <div aria-hidden="true" className={cn(s.alV, s.k8)}>
            {[0, 1, 2].map((node) => (
              <div className={s.kn} key={node}>
                <i />
                <i />
                <i />
              </div>
            ))}
          </div>
          <div>
            <h3>{t('home.engines.k8sTitle')}</h3>
            <p>{t('home.engines.k8sBody')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const STATS = [
  { value: 30, prefix: '<', unit: 'MB', key: 'memory' },
  { value: 45, unit: 'MB', key: 'download' },
  { value: 6, key: 'engines' },
  { value: 0, prefix: '$', key: 'free', countDown: true }
] as const

/** Four headline numbers; the digits count up as the strip scrolls into view (CSS only). */
export function StatsStrip({ t }: { t: HomeT }) {
  return (
    <section className={cn(s.wrap, s.stats, s.sec, s.cs)}>
      {STATS.map((stat) => {
        const prefix = 'prefix' in stat ? stat.prefix : ''
        const unit = 'unit' in stat ? stat.unit : ''
        return (
          <div className={cn(s.sx, s.rv)} key={stat.key}>
            <div className={s.num}>
              <span className="sr-only">{`${prefix}${stat.value} ${unit}`}</span>
              {prefix ? (
                <span aria-hidden="true" className={s.p}>
                  {prefix}
                </span>
              ) : null}
              <span
                aria-hidden="true"
                className={cn(s.cnt, 'countDown' in stat && s.cd)}
                style={{ '--dmh-n': stat.value } as CSSProperties}
              />
              {unit ? (
                <span aria-hidden="true" className={s.u}>
                  {unit}
                </span>
              ) : null}
            </div>
            <p>{t(`home.stats.${stat.key}`)}</p>
          </div>
        )
      })}
    </section>
  )
}
