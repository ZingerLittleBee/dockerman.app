import { type HomeT, list } from './copy'
import { CONTAINER_ROWS, type ContainerState, PINNED_CONTAINERS, SIDEBAR_ICONS } from './data'
import s from './home.module.css'
import { BoxIcon, CogIcon, cn, Ic, RefreshIcon, SearchIcon, ServerIcon } from './primitives'

// The host badge rolls through every engine and loops back to the first.
const HOST_ENGINES = ['Docker', 'Podman', 'Colima', 'OrbStack', 'WSL2', 'Apple Container', 'Docker']

/** Static replica of the app's container list; all motion is CSS-driven. */
export function AppWindow({ t }: { t: HomeT }) {
  const nav = list(t, 'home.window.nav')
  const ago = list(t, 'home.window.ago')
  const status = (state: ContainerState) => t(`home.window.status.${state}`)

  return (
    <div className={s.stage}>
      <div aria-hidden="true" className={s.floor} />
      <div className={s.tilt} data-tilt="">
        <div aria-label={t('home.hero.windowAria')} className={s.win} role="img">
          <div className={s.wbody}>
            <aside className={s.side}>
              <div className={s.sTop}>
                <span className={cn(s.tl, s.r)} />
                <span className={cn(s.tl, s.y)} />
                <span className={cn(s.tl, s.g)} />
                <span className={s.sIc}>
                  <Ic>
                    <rect height="16" rx="2" width="18" x="3" y="4" />
                    <path d="M9 4v16" />
                  </Ic>
                  <Ic>
                    <path d="m15 18-6-6 6-6" />
                  </Ic>
                  <Ic>
                    <path d="m9 18 6-6-6-6" />
                  </Ic>
                </span>
              </div>
              <div className={s.host}>
                <span className={s.hico}>
                  <ServerIcon />
                </span>
                <div className={s.hmeta}>
                  <b>Localhost</b>
                  <span className={s.hsub}>
                    localhost
                    <span className={s.hbadge}>
                      <span className={s.hrollT}>
                        {HOST_ENGINES.map((name, i) => (
                          <span key={i}>{name}</span>
                        ))}
                      </span>
                    </span>
                  </span>
                </div>
                <Ic>
                  <path d="m7 15 5 5 5-5" />
                  <path d="m7 9 5-5 5 5" />
                </Ic>
              </div>
              <div className={s.sl}>
                {nav.map((label, i) => (
                  <div className={cn(s.si, i === 1 && s.on)} key={label}>
                    <Ic>
                      <path d={SIDEBAR_ICONS[i]} />
                    </Ic>
                    {label}
                  </div>
                ))}
              </div>
              <div className={s.pinH}>
                <span>{t('home.window.pinned')}</span>
                <span className={s.cbad}>5</span>
                <RefreshIcon />
                <Ic>
                  <path d="m6 9 6 6 6-6" />
                </Ic>
              </div>
              <div className={s.pins}>
                {PINNED_CONTAINERS.map((name) => (
                  <span className={s.pin} key={name}>
                    {name}
                  </span>
                ))}
              </div>
              <div className={s.sFt}>
                <Ic>
                  <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M12 7v5l3 2" />
                </Ic>
                <Ic>
                  <path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6" />
                </Ic>
                <Ic>
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </Ic>
                <CogIcon />
                <Ic>
                  <rect height="14" rx="4" width="8" x="8" y="6" />
                  <path d="M12 20v-9M3 13h5M16 13h5M5 7l3 2M19 7l-3 2M5 19l3-2M19 19l-3-2" />
                </Ic>
              </div>
            </aside>
            <div className={s.wmain}>
              <div className={s.mh}>
                <b>{t('home.window.title')}</b>
                <span className={s.vt}>
                  <i className={s.on}>
                    <Ic>
                      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                    </Ic>
                  </i>
                  <i>
                    <Ic>
                      <rect height="7" rx="1" width="7" x="3" y="3" />
                      <rect height="7" rx="1" width="7" x="14" y="3" />
                      <rect height="7" rx="1" width="7" x="3" y="14" />
                      <rect height="7" rx="1" width="7" x="14" y="14" />
                    </Ic>
                  </i>
                </span>
                <span className={s.mhR}>
                  <RefreshIcon />
                  <Ic>
                    <path d="M5 12h.01M12 12h.01M19 12h.01" />
                  </Ic>
                  <Ic>
                    <path d="M12 5v14M5 12h14" />
                  </Ic>
                </span>
              </div>
              <div className={s.tbar}>
                <span className={s.srch}>
                  <SearchIcon />
                  <span>{t('home.window.search')}</span>
                </span>
                <span className={s.fseg}>
                  <span className={cn(s.fs, s.fa)}>
                    {t('home.window.all')}
                    <em>10</em>
                  </span>
                  <span className={cn(s.fs, s.fb)}>
                    {t('home.window.running')}
                    <em>5</em>
                  </span>
                  <span className={cn(s.fs, s.fc)}>
                    {t('home.window.attention')}
                    <em>5</em>
                  </span>
                  <span className={s.fs}>
                    {t('home.window.stopped')}
                    <em>3</em>
                  </span>
                </span>
                <span className={s.tbR}>
                  <span className={s.ib}>
                    <Ic>
                      <path d="m3 7 2 2 4-4M3 17l2 2 4-4M13 6h8M13 12h8M13 18h8" />
                    </Ic>
                  </span>
                  <span className={s.sa2}>
                    <Ic>
                      <path d="M19 21 12 17 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
                    </Ic>
                    {t('home.window.showAll')}
                  </span>
                </span>
              </div>
              <div className={s.tbl}>
                <div className={s.th}>
                  <span />
                  <span>ID</span>
                  <span>{t('home.window.columns.name')}</span>
                  <span>{t('home.window.columns.image')}</span>
                  <span>{t('home.window.columns.ports')}</span>
                  <span>{t('home.window.columns.status')}</span>
                  <span>{t('home.window.columns.created')}</span>
                  <span className={s.dots}>
                    <CogIcon />
                  </span>
                </div>
                {CONTAINER_ROWS.map((row) => (
                  <div className={cn(s.tr, row.state === 'running' ? s.ru : s.na)} key={row.id}>
                    <span className={s.chev}>›</span>
                    <span className={cn(s.mono, s.idc)}>{row.id}</span>
                    <span className={s.mono}>{row.name}</span>
                    <span className={s.mono}>{row.image}</span>
                    <span className={s.ports}>
                      {row.ports.length > 0 ? (
                        row.ports.map((port) => (
                          <span
                            className={cn(s.pt, s.mono, port.startsWith('+') && s.more)}
                            key={port}
                          >
                            {port}
                          </span>
                        ))
                      ) : (
                        <span className={cn(s.pt, s.none)}>-</span>
                      )}
                    </span>
                    <span className={s.stc}>
                      <span className={s.sa}>{status('created')}</span>
                      <span className={s.sb}>{status(row.state)}</span>
                    </span>
                    <span className={s.ago}>{ago[row.ago]}</span>
                    <span className={s.dots}>···</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className={cn(s.fl, s.f1)}>
          <div className={s.chip}>
            <span className={s.ci}>
              <Ic>
                <path d="M12 19V5" />
                <path d="m6 11 6-6 6 6" />
              </Ic>
            </span>
            <div>
              <span className={s.mono}>
                redis:7.2 → <span className={s.okc}>7.4</span>
              </span>
              <small>{t('home.window.chips.upgrade')}</small>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className={cn(s.fl, s.f2)}>
          <div className={s.chip}>
            <span className={s.ci}>
              <Ic>
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18" />
                <path d="M12 3a14 14 0 0 1 0 18" />
                <path d="M12 3a14 14 0 0 0 0 18" />
              </Ic>
            </span>
            <span className={s.mono}>myapp.dockerman.localhost</span>
            <span className={cn(s.okp, s.mono)}>200</span>
          </div>
        </div>
        <div aria-hidden="true" className={cn(s.fl, s.f3)}>
          <div className={s.chip}>
            <span className={cn(s.ci, s.g)}>
              <BoxIcon />
            </span>
            <div>
              <span className={s.pods}>
                <span className={s.pod} />
                <span className={s.pod} />
                <span className={s.pod} />
                <span className={s.pod} />
              </span>
              <small>{t('home.window.chips.pods')}</small>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className={cn(s.fl, s.f4)}>
          <div className={s.chip}>
            <div>
              <small>{t('home.window.chips.memory')}</small>
              <span className={s.big}>&lt; 30 MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
