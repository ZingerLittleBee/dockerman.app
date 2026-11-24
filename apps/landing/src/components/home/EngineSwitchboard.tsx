'use client'

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { type EngineMeta, PLATFORM_LABEL, type Platform } from './data'
import s from './home.module.css'
import { BrandGlyph, cn, Ic, Logo } from './primitives'

export interface EngineCard extends EngineMeta {
  description: string
  tag: string
}

export interface SwitchboardLabels {
  all: string
  platformAria: string
  connecting: string
  connected: string
  hubFooter: string
}

type Filter = 'all' | Platform

const FILTERS: Filter[] = ['all', 'mac', 'win', 'linux']
const CYCLE_MS = 3400

// Wire geometry (88x340 columns): each engine row meets the hub at its vertical centre.
const LEFT_WIRES = ['M0,50 C44,50 44,170 88,170', 'M0,170 L88,170', 'M0,290 C44,290 44,170 88,170']
const RIGHT_WIRES = ['M88,50 C44,50 44,170 0,170', 'M88,170 L0,170', 'M88,290 C44,290 44,170 0,170']
const PULSE_PATHS = [s.pa, s.pb, s.pc, s.pd, s.pe, s.pf]

/** Engine picker wired into a mock Dockerman hub; cycles while visible. */
export function EngineSwitchboard({
  engines,
  labels,
  heading
}: {
  engines: EngineCard[]
  labels: SwitchboardLabels
  /** Section title, rendered beside the platform filter. */
  heading: ReactNode
}) {
  const [active, setActive] = useState(0)
  const [filter, setFilter] = useState<Filter>('all')
  const [cycle, setCycle] = useState(0)
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  const matches = useCallback(
    (i: number, f: Filter) => f === 'all' || engines[i].platforms.includes(f),
    [engines]
  )
  const nextMatch = useCallback(
    (from: number, f: Filter) => {
      for (let step = 1; step <= engines.length; step++) {
        const i = (from + step) % engines.length
        if (matches(i, f)) return i
      }
      return from
    },
    [engines.length, matches]
  )

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // `cycle` restarts the countdown after every manual pick.
  // biome-ignore lint/correctness/useExhaustiveDependencies: cycle is an intentional reset key
  useEffect(() => {
    if (!visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setActive((current) => nextMatch(current, filter)), CYCLE_MS)
    return () => clearInterval(id)
  }, [visible, filter, nextMatch, cycle])

  const pickEngine = (i: number) => {
    setActive(i)
    setCycle((n) => n + 1)
  }

  const pickFilter = (f: Filter) => {
    setFilter(f)
    setActive((current) => (matches(current, f) ? current : nextMatch(current, f)))
    setCycle((n) => n + 1)
  }

  const engineButton = (engine: EngineCard, i: number) => (
    <button
      aria-pressed={i === active}
      className={cn(s.eng, i === active && s.on, !matches(i, filter) && s.dim)}
      key={engine.name}
      onClick={() => pickEngine(i)}
      type="button"
    >
      <Logo fit={engine.fit} src={engine.logo} />
      <span>
        <b>{engine.name}</b>
        <small>{engine.platforms.map((p) => PLATFORM_LABEL[p]).join(' · ')}</small>
      </span>
      <span className={s.chk} />
    </button>
  )

  const wireColumn = (paths: string[], offset: number) => (
    <div aria-hidden="true" className={s.wcol}>
      <svg viewBox="0 0 88 340">
        {paths.map((d, k) => {
          const i = offset + k
          return (
            <path
              className={cn(s.wp, i === active && s.on, !matches(i, filter) && s.dim)}
              d={d}
              key={d}
            />
          )
        })}
      </svg>
      {paths.map((d, k) => {
        const i = offset + k
        return <span className={cn(s.pulse, PULSE_PATHS[i], i === active && s.on)} key={d} />
      })}
    </div>
  )

  return (
    <div ref={root}>
      <div className={s.top2}>
        {heading}
        <fieldset aria-label={labels.platformAria} className={s.filt}>
          {FILTERS.map((f) => (
            <button
              aria-pressed={f === filter}
              className={cn(f === filter && s.on)}
              key={f}
              onClick={() => pickFilter(f)}
              type="button"
            >
              {f === 'all' ? labels.all : PLATFORM_LABEL[f]}
            </button>
          ))}
        </fieldset>
      </div>
      <div className={s.sw}>
        <div className={s.ecol}>{engines.slice(0, 3).map((e, i) => engineButton(e, i))}</div>
        {wireColumn(LEFT_WIRES, 0)}
        <div className={s.hub}>
          <div className={s.hubTop}>
            <span className={s.logo}>
              <BrandGlyph />
            </span>
            <b>Dockerman</b>
            <span>· Localhost</span>
            <Ic>
              <path d="m8 9 4-4 4 4" />
              <path d="m8 15 4 4 4-4" />
            </Ic>
          </div>
          <div className={s.hstack}>
            {engines.map((engine, i) => (
              <div
                aria-hidden={i !== active}
                className={cn(s.hs, i === active && s.on)}
                key={engine.name}
              >
                <div className={s.hsH}>
                  <Logo fit={engine.fit} src={engine.logo} />
                  <div>
                    <b>{engine.name}</b>
                    <small className={s.mono}>{engine.endpoint}</small>
                  </div>
                  <span className={s.conn}>
                    <span className={s.cA}>{labels.connecting}</span>
                    <span className={s.cB}>{labels.connected}</span>
                  </span>
                </div>
                <p className={s.hsD}>{engine.description}</p>
                <div className={s.hsP}>
                  {engine.platforms.map((p) => (
                    <span className={s.pl} key={p}>
                      {PLATFORM_LABEL[p]}
                    </span>
                  ))}
                  <span className={s.tg}>{engine.tag}</span>
                </div>
              </div>
            ))}
          </div>
          <div className={s.hubFt}>
            <span className={s.radar} />
            {labels.hubFooter}
          </div>
        </div>
        {wireColumn(RIGHT_WIRES, 3)}
        <div className={s.ecol}>{engines.slice(3).map((e, i) => engineButton(e, i + 3))}</div>
      </div>
    </div>
  )
}
