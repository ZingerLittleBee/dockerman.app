'use client'

import Image from 'next/image'
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from 'react'
import s from './home.module.css'
import { cn } from './primitives'

export interface ShowcaseTab {
  name: string
  description: string
  chip: string
  alt: string
  image: string
}

const SHOT_SIZES = '(max-width: 980px) 100vw, 1136px'

/**
 * Scroll-driven feature tour. A tall track pins one stage (step tabs above a large screenshot);
 * how far the stage has travelled through the track picks the step and fills its progress bar.
 * Below 980px the stage is hidden and a plain list shows every step with its own image.
 */
export function Showcase({ tabs, heading }: { tabs: ShowcaseTab[]; heading: ReactNode }) {
  const [state, setState] = useState({ tab: 0, progress: 0 })
  const track = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const count = tabs.length

  useEffect(() => {
    let frame = 0
    const sync = () => {
      frame = 0
      const trackEl = track.current
      const stageEl = stage.current
      if (!(trackEl && stageEl)) return
      // Zero while the stage is hidden on narrow screens.
      const range = trackEl.offsetHeight - stageEl.offsetHeight
      if (range <= 0) return
      const travelled = stageEl.getBoundingClientRect().top - trackEl.getBoundingClientRect().top
      const scaled = Math.min(1, Math.max(0, travelled / range)) * count
      const tab = Math.min(count - 1, Math.floor(scaled))
      const progress = scaled - tab
      setState((prev) =>
        prev.tab === tab && Math.abs(prev.progress - progress) <= 0.005 ? prev : { tab, progress }
      )
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync)
    }
    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [count])

  /** Scrolls so the stage sits at the start of step `i`. */
  const pick = (i: number) => {
    const trackEl = track.current
    const stageEl = stage.current
    if (!(trackEl && stageEl)) return
    const range = trackEl.offsetHeight - stageEl.offsetHeight
    const pinnedAt = Number.parseFloat(getComputedStyle(stageEl).top) || 0
    const trackTop = window.scrollY + trackEl.getBoundingClientRect().top
    const top = trackTop - pinnedAt + (i / count) * range + 2
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  }

  const { tab, progress } = state

  return (
    <section className={cn(s.wrap, s.sec)} id="features">
      {heading}
      <div className={s.tour} ref={track} style={{ '--n': count } as CSSProperties}>
        <div className={s.tourStage} ref={stage}>
          <div className={s.tourTabs}>
            {tabs.map((item, i) => (
              <button
                aria-current={i === tab ? 'step' : undefined}
                className={cn(s.tt, i === tab && s.on)}
                key={item.name}
                onClick={() => pick(i)}
                type="button"
              >
                <span aria-hidden="true" className={s.ttBar}>
                  <i style={{ transform: `scaleX(${i < tab ? 1 : i === tab ? progress : 0})` }} />
                </span>
                <span className={s.ttH}>
                  <span className={cn(s.stpN, s.mono)}>{`0${i + 1}`}</span>
                  {item.name}
                </span>
                <span className={s.ttD}>{item.description}</span>
              </button>
            ))}
          </div>
          <div className={s.screen}>
            {tabs.map((item, i) => (
              <div
                aria-hidden={i !== tab}
                className={cn(s.shot, i === tab && s.on)}
                key={item.name}
              >
                <Image alt={item.alt} fill sizes={SHOT_SIZES} src={item.image} />
                <span className={s.tag}>{item.chip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ol className={s.tourList}>
        {tabs.map((item, i) => (
          <li className={s.stp} key={item.name}>
            <span className={s.stpH}>
              <span className={cn(s.stpN, s.mono)}>{`0${i + 1}`}</span>
              {item.name}
            </span>
            <span className={s.stpD}>{item.description}</span>
            <span className={s.stpImg}>
              <Image alt={item.alt} fill sizes={SHOT_SIZES} src={item.image} />
              <span className={s.tag}>{item.chip}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
