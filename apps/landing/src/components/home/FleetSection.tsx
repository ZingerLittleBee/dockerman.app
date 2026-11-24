import { type HomeT, list } from './copy'
import s from './home.module.css'
import { cn, SectionTitle } from './primitives'

interface Host {
  name: string
  engine: string
  link?: string
  containers: number
  cpu: number
  memory: number
  tone: 'a' | 'g' | 'w'
  wave: string
  reconnecting?: boolean
}

// Each sparkline is a 600px wave repeated once, so panning by -600px loops seamlessly.
const HOSTS: Host[] = [
  {
    name: 'localhost',
    engine: 'Colima',
    containers: 12,
    cpu: 18,
    memory: 62,
    tone: 'a',
    wave: 'M0,40 C50,36 70,18 120,22 S200,44 250,36 S330,10 380,18 S460,40 510,34 S570,24 600,40 C650,36 670,18 720,22 S800,44 850,36 S930,10 980,18 S1060,40 1110,34 S1170,24 1200,40'
  },
  {
    name: 'homelab',
    engine: 'Docker',
    link: 'SSH · 8 ms',
    containers: 17,
    cpu: 31,
    memory: 81,
    tone: 'g',
    wave: 'M0,30 C50,26 70,40 120,34 S200,12 250,20 S330,44 380,38 S460,16 510,22 S570,36 600,30 C650,26 670,40 720,34 S800,12 850,20 S930,44 980,38 S1060,16 1110,22 S1170,36 1200,30'
  },
  {
    name: 'staging',
    engine: 'Podman',
    link: 'SSH · 62 ms',
    containers: 8,
    cpu: 9,
    memory: 38,
    tone: 'w',
    reconnecting: true,
    wave: 'M0,44 C50,40 70,30 120,32 S200,20 250,28 S330,40 380,36 S460,22 510,26 S570,38 600,44 C650,40 670,30 720,32 S800,20 850,28 S930,40 980,36 S1060,22 1110,26 S1170,38 1200,44'
  },
  {
    name: 'nas',
    engine: 'Docker',
    link: 'TCP · 3 ms',
    containers: 4,
    cpu: 3,
    memory: 24,
    tone: 'a',
    wave: 'M0,46 C50,44 70,40 120,42 S200,34 250,38 S330,46 380,44 S460,36 510,40 S570,44 600,46 C650,44 670,40 720,42 S800,34 850,38 S930,46 980,44 S1060,36 1110,40 S1170,44 1200,46'
  }
]

export function FleetSection({ t }: { t: HomeT }) {
  return (
    <section className={cn(s.wrap, s.sec)}>
      <div className={s.top2}>
        <SectionTitle lead={t('home.fleet.titleLead')} trail={t('home.fleet.titleTrail')} />
        <div className={cn(s.chips2, s.rv)}>
          {list(t, 'home.fleet.chips').map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </div>
      <div className={cn(s.fleet, s.rv)}>
        <div className={s.flBar}>
          <b>{t('home.fleet.fleet')}</b>
          <span>{t('home.fleet.hosts')}</span>
          <span>·</span>
          <span>{t('home.fleet.total')}</span>
          <span className={cn(s.live, s.mono)}>
            <i />
            live
          </span>
        </div>
        <div className={s.flGrid}>
          {HOSTS.map((host) => (
            <div className={cn(s.hc, host.reconnecting && s.rc)} key={host.name}>
              <div className={s.hcH}>
                <span className={s.sd} />
                <b className={s.mono}>{host.name}</b>
                <span className={s.eb}>{host.engine}</span>
                {host.reconnecting ? (
                  <span className={s.rcl}>
                    <span className={cn(s.o1, s.mono)}>{host.link}</span>
                    <span className={s.o2}>{t('home.fleet.reconnecting')}</span>
                  </span>
                ) : (
                  <span className={cn(s.lat2, s.mono)}>{host.link ?? t('home.fleet.local')}</span>
                )}
              </div>
              <svg aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 600 56">
                <g className={s.pan}>
                  <path className={cn(s.sp, s[host.tone])} d={host.wave} />
                </g>
              </svg>
              <div className={s.hcM}>
                <div>
                  <small>{t('home.fleet.containers')}</small>
                  <b>{host.containers}</b>
                </div>
                <div>
                  <small>CPU</small>
                  <b>{host.cpu}%</b>
                </div>
                <div>
                  <small>{t('home.fleet.memory')}</small>
                  <div className={s.mbar}>
                    <i style={{ width: `${host.memory}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
