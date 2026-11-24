'use client'

import { type MouseEvent, type ReactNode, useEffect, useRef } from 'react'
import s from './home.module.css'

/**
 * Hero section that tilts its `[data-tilt]` descendant toward the pointer.
 * Writes the transform directly so pointer moves never re-render the tree.
 */
export function HeroTilt({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const frame = useRef(0)

  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const tilt = (tx: number, ty: number) => {
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const target = ref.current?.querySelector<HTMLElement>('[data-tilt]')
      if (!target) return
      target.style.transform =
        tx === 0 && ty === 0
          ? ''
          : `perspective(1800px) rotateX(${(-ty * 5).toFixed(2)}deg) rotateY(${(tx * 7).toFixed(2)}deg)`
    })
  }

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    tilt(
      (event.clientX - rect.left) / rect.width - 0.5,
      (event.clientY - rect.top) / rect.height - 0.5
    )
  }

  return (
    <section
      className={s.hero}
      id="top"
      onMouseLeave={() => tilt(0, 0)}
      onMouseMove={onMove}
      ref={ref}
    >
      {children}
    </section>
  )
}
