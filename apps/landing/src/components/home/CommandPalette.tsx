'use client'

import Image from 'next/image'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import type { PaletteLabels } from './copy'
import s from './home.module.css'
import { BoxIcon, cn, Ic, ImageIcon, RefreshIcon, ServerIcon, VolumeIcon } from './primitives'

const STEP_MS = 3400
// Frames: 0 = empty palette, 1 = "redis" typed, 2 = drilled into redis-cache actions.
const FRAMES = 3
// With reduced motion the palette holds on the search results frame.
const STILL_FRAME = 1

function Row({
  icon,
  children,
  selected,
  danger
}: {
  icon: ReactNode
  children: ReactNode
  selected?: boolean
  danger?: boolean
}) {
  return (
    <div className={cn(s.rr, selected && s.sel, danger && s.dg)}>
      {icon}
      {children}
    </div>
  )
}

/** Mirrors the app's Spotlight window: empty, then a query, then container actions. */
export function CommandPalette({
  labels: l,
  background,
  heading
}: {
  labels: PaletteLabels
  background: string
  heading: ReactNode
}) {
  const [frame, setFrame] = useState(0)
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFrame(STILL_FRAME)
      return
    }
    if (!visible) return
    const id = setInterval(() => setFrame((f) => (f + 1) % FRAMES), STEP_MS)
    return () => clearInterval(id)
  }, [visible])

  const q = (k: string, i: number) => cn(s.q, k, frame === i && s.on)
  const group = (i: number) => cn(s.rg, frame === i && s.on)

  return (
    <section className={cn(s.wrap, s.sec, s.palSec)}>
      {heading}
      <div className={cn(s.palStage, s.rv)} ref={root}>
        <div aria-hidden="true" className={s.palBg}>
          <Image alt="" fill sizes="(max-width: 1200px) 100vw, 1136px" src={background} />
        </div>
        <div aria-label={l.aria} className={s.palx} role="img">
          <div className={s.pxIn}>
            <Ic>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </Ic>
            <span className={s.qs}>
              <span className={q(s.qph, 0)}>{l.placeholder}</span>
              <span className={q(s.qty, 1)}>
                <span className={s.mono}>redis</span>
              </span>
              <span className={q(s.qbk, 2)}>
                <Ic>
                  <path d="m12 19-7-7 7-7M19 12H5" />
                </Ic>
                <b className={s.mono}>redis-cache</b>
                <span>{l.placeholder}</span>
              </span>
            </span>
          </div>
          <div className={s.pxRes}>
            <div className={group(0)}>
              <div className={s.gh}>{l.pages}</div>
              <Row
                icon={
                  <Ic>
                    <rect height="9" rx="1" width="7" x="3" y="3" />
                    <rect height="5" rx="1" width="7" x="14" y="3" />
                    <rect height="9" rx="1" width="7" x="14" y="12" />
                    <rect height="5" rx="1" width="7" x="3" y="16" />
                  </Ic>
                }
                selected
              >
                {l.dashboard}
              </Row>
              <Row icon={<ServerIcon />}>{l.fleet}</Row>
              <Row icon={<BoxIcon />}>{l.containers}</Row>
              <Row icon={<ImageIcon />}>{l.images}</Row>
              <Row
                icon={
                  <Ic>
                    <rect height="6" rx="1" width="6" x="9" y="2" />
                    <rect height="6" rx="1" width="6" x="2" y="16" />
                    <rect height="6" rx="1" width="6" x="16" y="16" />
                    <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8" />
                  </Ic>
                }
              >
                {l.networks}
              </Row>
              <Row icon={<VolumeIcon />}>{l.volumes}</Row>
              <Row
                icon={
                  <Ic>
                    <rect height="18" rx="2" width="18" x="3" y="4" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </Ic>
                }
              >
                {l.events}
              </Row>
              <div className={s.gh}>Kubernetes</div>
              <Row
                icon={
                  <Ic>
                    <path d="M3 3v18h18" />
                    <path d="m7 15 4-4 3 3 5-6" />
                  </Ic>
                }
              >
                {l.cluster}
              </Row>
            </div>
            <div className={group(1)}>
              <div className={s.gh}>{l.containers}</div>
              <Row icon={<BoxIcon />} selected>
                <span className={s.mono}>redis-cache</span>
                <span className={s.sp1}>{l.running}</span>
              </Row>
              <div className={s.gh}>{l.images}</div>
              <Row icon={<ImageIcon />}>
                <span className={s.mono}>redis:7.4</span>
                <span className={cn(s.sp2, s.mono)}>117 MB</span>
              </Row>
              <Row icon={<ImageIcon />}>
                <span className={s.mono}>redis:7.2-alpine</span>
                <span className={cn(s.sp2, s.mono)}>41 MB</span>
              </Row>
              <div className={s.gh}>{l.volumes}</div>
              <Row icon={<VolumeIcon />}>
                <span className={s.mono}>redis-data</span>
              </Row>
            </div>
            <div className={group(2)}>
              <div className={s.gh}>{l.actions}</div>
              <Row
                icon={
                  <Ic>
                    <rect height="14" rx="2" width="14" x="5" y="5" />
                  </Ic>
                }
                selected
              >
                {l.stop}
              </Row>
              <Row icon={<RefreshIcon />}>{l.restart}</Row>
              <div className={s.gh}>{l.navigate}</div>
              <Row
                icon={
                  <Ic>
                    <path d="M4 6h16M4 12h10M4 18h13" />
                  </Ic>
                }
              >
                {l.logs}
              </Row>
              <Row
                icon={
                  <Ic>
                    <path d="m5 8 4 4-4 4" />
                    <path d="M12 17h7" />
                  </Ic>
                }
              >
                {l.terminal}
              </Row>
              <Row
                icon={
                  <Ic>
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </Ic>
                }
              >
                {l.stats}
              </Row>
              <div className={s.gh}>{l.danger}</div>
              <Row
                danger
                icon={
                  <Ic>
                    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
                  </Ic>
                }
              >
                {l.remove}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
