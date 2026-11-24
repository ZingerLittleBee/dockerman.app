import Image from 'next/image'
import type { ReactNode } from 'react'
import type { HomeT } from './copy'
import { ONE_CLICK_APPS } from './data'
import s from './home.module.css'
import { CheckIcon, cn, GlobeIcon, SectionTitle } from './primitives'

function Tile({
  wide,
  title,
  body,
  children
}: {
  wide?: boolean
  title: string
  body: string
  children: ReactNode
}) {
  return (
    <article className={cn(s.tile, wide && s.w2, s.rv)}>
      <div className={s.viz}>{children}</div>
      <h3 className={s.tt}>{title}</h3>
      <p className={s.td}>{body}</p>
    </article>
  )
}

const APP_TONE = { nc: s.apNc, jf: s.apJf, gt: s.apGt, n8: s.apN8, uk: s.apUk, vw: s.apVw }

/** Bento of small conveniences, each with a looping CSS vignette. */
export function DetailsSection({ t }: { t: HomeT }) {
  const d = (key: string) => t(`home.details.${key}`)

  return (
    <section className={cn(s.wrap, s.sec)} id="details">
      <SectionTitle lead={d('titleLead')} trail={d('titleTrail')} />
      <div className={s.bento}>
        <Tile body={d('domainsBody')} title={d('domainsTitle')} wide>
          <div>
            <div className={cn(s.url, s.mono)}>
              <GlobeIcon />
              <span className={s.typed}>myapp.dockerman.localhost</span>
              <span className={s.okp}>200 OK</span>
            </div>
            <div aria-hidden="true" className={cn(s.map, s.mono)}>
              <span>web:3000</span>
              <span className={s.wireH}>
                <i />
              </span>
              <span>:80</span>
            </div>
          </div>
        </Tile>
        <Tile body={d('backupBody')} title={d('backupTitle')}>
          <div aria-hidden="true" className={cn(s.bk2, s.mono)}>
            <span className={s.cx}>api</span>
            <span className={s.lk2}>
              <i />
            </span>
            <span className={s.arc}>
              api.tar
              <span className={s.bkp}>
                <i />
              </span>
            </span>
          </div>
        </Tile>
        <Tile body={d('tunnelBody')} title={d('tunnelTitle')}>
          <div aria-hidden="true" className={cn(s.tun, s.mono)}>
            <span className={s.nd}>:8080</span>
            <span className={s.wireV}>
              <i />
              <i />
            </span>
            <span className={cn(s.nd, s.cl2)}>*.trycloudflare.com</span>
          </div>
        </Tile>
        <Tile body={d('upgradeBody')} title={d('upgradeTitle')}>
          <div aria-hidden="true" className={s.upg}>
            <div className={cn(s.ver, s.mono)}>
              <div className={s.vr}>
                <span>redis:7.2</span>
                <span className={s.okc}>redis:7.4</span>
              </div>
            </div>
            <div className={s.bk}>
              <CheckIcon />
              {d('backupReady')}
            </div>
          </div>
        </Tile>
        <Tile body={d('alertsBody')} title={d('alertsTitle')}>
          <div aria-hidden="true" className={s.toasts}>
            <div className={s.toast}>
              <span className={s.ed} />
              <div>
                <b className={s.mono}>worker</b>
                <small>{d('alertExited')}</small>
              </div>
            </div>
            <div className={s.toast}>
              <span className={cn(s.ed, s.wd)} />
              <div>
                <b className={s.mono}>api</b>
                <small>{d('alertOom')}</small>
              </div>
            </div>
          </div>
        </Tile>
        <Tile body={d('composeBody')} title={d('composeTitle')} wide>
          <div aria-hidden="true" className={cn(s.dr, s.mono)}>
            <div className={s.drCmd}>
              <span className={s.acc}>$ </span>
              <span className={s.tw}>docker run -d -p 8080:80 -v data:/data nginx</span>
            </div>
            <div className={s.drAr}>↓</div>
            <div className={s.drY}>
              <div className={s.ya}>
                <span className={s.k}>services:</span>
              </div>
              <div className={s.yb}>
                {'  '}
                <span className={s.k}>nginx:</span>
              </div>
              <div className={s.yc}>{'    image: nginx'}</div>
              <div className={s.yd}>{'    ports: ["8080:80"]'}</div>
              <div className={s.ye}>{'    volumes: ["data:/data"]'}</div>
            </div>
          </div>
        </Tile>
        <Tile body={d('appsBody')} title={d('appsTitle')} wide>
          <div aria-hidden="true" className={s.mk}>
            {ONE_CLICK_APPS.map((app) => (
              <div className={cn(s.app, app.tone === 'jf' && s.inst)} key={app.name}>
                <span className={cn(s.ai, APP_TONE[app.tone])}>
                  <Image alt="" height={28} src={app.logo} unoptimized width={28} />
                  {app.tone === 'jf' ? (
                    <span className={s.okb}>
                      <CheckIcon />
                    </span>
                  ) : null}
                </span>
                {app.name}
              </div>
            ))}
          </div>
        </Tile>
        <Tile body={d('terminalBody')} title={d('terminalTitle')}>
          <div aria-hidden="true" className={cn(s.term, s.mono)}>
            <div>
              <span className={s.pr}>$</span> <span className={s.ty}>docker exec -it api sh</span>
            </div>
            <div className={s.t2}>
              <span className={s.pr}>/app #</span> <span className={s.cur2} />
            </div>
          </div>
        </Tile>
        <Tile body={d('pruneBody')} title={d('pruneTitle')}>
          <div aria-hidden="true" className={s.prn}>
            <div className={s.du}>
              <i className={s.u1} />
              <i className={s.u2} />
              <i className={s.u3} />
              <i className={s.u4} />
            </div>
            <div className={s.duL}>
              <span className={s.mono}>12.4 GB</span>
              <b className={cn(s.rec, s.mono)}>−8.6 GB</b>
            </div>
          </div>
        </Tile>
      </div>
    </section>
  )
}
