'use client'

import Image from 'next/image'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import s from './home.module.css'
import { cn } from './primitives'

export interface ShowcaseTab {
  name: string
  description: string
  chip: string
  alt: string
  image: string
}

const SHOT_SIZES = '(max-width: 980px) 100vw, 760px'

/**
 * Scroll-driven feature tour: the step crossing the viewport midline picks the pinned
 * screenshot. Below 980px the pinned screen is hidden and each step shows its own image.
 */
export function Showcase({ tabs, heading }: { tabs: ShowcaseTab[]; heading: ReactNode }) {
  const [state, setState] = useState({ tab: 0, progress: 0 })
  const steps = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    let frame = 0
    const sync = () => {
      frame = 0
      const mid = window.innerHeight * 0.5
      let tab = 0
      let progress = 0
      steps.current.forEach((el, i) => {
        if (!el) return
        const rect = el.getBoundingClientRect()
        if (rect.top <= mid) {
          tab = i
          progress = Math.min(1, Math.max(0, (mid - rect.top) / rect.height))
        }
      })
      setState((prev) =>
        prev.tab === tab && Math.abs(prev.progress - progress) <= 0.01 ? prev : { tab, progress }
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
  }, [])

  const pick = (i: number) => {
    const el = steps.current[i]
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const top = window.scrollY + el.getBoundingClientRect().top - window.innerHeight * 0.5 + 24
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
  }

  const { tab, progress } = state

  return (
    <section className={cn(s.wrap, s.sec)} id="features">
      {heading}
      <div className={s.showG}>
        <div className={s.steps}>
          {tabs.map((item, i) => (
            <button
              aria-current={i === tab ? 'step' : undefined}
              className={cn(s.stp, i === tab && s.on)}
              key={item.name}
              onClick={() => pick(i)}
              ref={(el) => {
                steps.current[i] = el
              }}
              type="button"
            >
              <span className={s.stpBar}>
                <i style={{ transform: `scaleY(${i < tab ? 1 : i === tab ? progress : 0})` }} />
              </span>
              <span className={s.stpH}>
                <span className={cn(s.stpN, s.mono)}>{`0${i + 1}`}</span>
                {item.name}
              </span>
              <span className={s.stpD}>{item.description}</span>
              <span aria-hidden="true" className={s.stpImg}>
                <Image alt="" fill sizes={SHOT_SIZES} src={item.image} />
                <span className={s.tag}>{item.chip}</span>
              </span>
            </button>
          ))}
        </div>
        <div className={s.showPin}>
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
          <div aria-hidden="true" className={s.sdots}>
            {tabs.map((item, i) => (
              <i className={cn(i === tab && s.on)} key={item.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
