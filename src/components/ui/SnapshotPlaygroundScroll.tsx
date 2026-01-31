'use client'

import { useGSAP } from '@gsap/react'
import type { RemixiconComponentType } from '@remixicon/react'
import clsx from 'clsx'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import posthog from 'posthog-js'
import { memo, useCallback, useEffect, useRef, useState } from 'react'

interface Screenshot {
  src: string
  alt: string
  label: string
  icon: RemixiconComponentType
}

const IMAGE_WIDTH = 2560
const IMAGE_HEIGHT = 1760
const SCROLL_HEIGHT_PER_ITEM = 80 // vh
const HEADER_OFFSET = 100 // px - header height + top offset + padding
const INTRO_ANIMATION_SCROLL = 300 // px - scroll distance for intro animation
const MAX_SCROLL_DELTA = 80 // px - max scroll distance per wheel event to limit speed

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

function SnapshotPlaygroundScroll({ screenshots }: { screenshots: Screenshot[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tabListRef = useRef<HTMLDivElement>(null)
  const imageAreaRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const lastIndexRef = useRef(0)
  const isNavigatingRef = useRef(false) // Track if navigating via tab click

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => {
      const next = new Set(prev).add(index)
      if (next.has(0)) {
        setIsInitialLoad(false)
      }
      return next
    })
  }, [])

  const handleTabClick = useCallback(
    (index: number) => {
      if (!wrapperRef.current) return

      // Set navigating flag to skip intermediate index updates
      isNavigatingRef.current = true

      // Immediately show target image
      setActiveIndex(index)
      lastIndexRef.current = index

      const wrapperTop = wrapperRef.current.offsetTop
      const totalScrollHeight =
        screenshots.length * window.innerHeight * (SCROLL_HEIGHT_PER_ITEM / 100)
      // Add intro animation scroll to account for the entrance animation
      const targetScroll =
        wrapperTop + INTRO_ANIMATION_SCROLL + (index / screenshots.length) * totalScrollHeight

      gsap.to(window, {
        scrollTo: { y: targetScroll },
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          // Reset flag after navigation completes
          isNavigatingRef.current = false
        }
      })

      posthog.capture('feature_tab_switched', {
        from_tab: screenshots[lastIndexRef.current]?.label,
        to_tab: screenshots[index]?.label,
        to_tab_index: index,
        trigger: 'click',
        location: 'snapshot_playground'
      })
    },
    [screenshots]
  )

  // Limit scroll speed within the pinned area
  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let isInPinArea = false
    let ticking = false

    const handleWheel = (e: WheelEvent) => {
      if (!isInPinArea) return

      const delta = Math.abs(e.deltaY)
      if (delta > MAX_SCROLL_DELTA) {
        e.preventDefault()

        if (!ticking) {
          ticking = true
          const clampedDelta = Math.sign(e.deltaY) * MAX_SCROLL_DELTA

          gsap.to(window, {
            scrollTo: { y: window.scrollY + clampedDelta },
            duration: 0.15,
            ease: 'power1.out',
            onComplete: () => {
              ticking = false
            }
          })
        }
      }
    }

    const checkPinArea = () => {
      if (!wrapper) return
      const rect = wrapper.getBoundingClientRect()
      const totalScrollHeight =
        screenshots.length * window.innerHeight * (SCROLL_HEIGHT_PER_ITEM / 100)
      isInPinArea =
        rect.top <= HEADER_OFFSET && rect.top > -(INTRO_ANIMATION_SCROLL + totalScrollHeight)
    }

    window.addEventListener('scroll', checkPinArea, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })
    checkPinArea()

    return () => {
      window.removeEventListener('scroll', checkPinArea)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [screenshots.length])

  useGSAP(
    () => {
      if (
        !(wrapperRef.current && containerRef.current && tabListRef.current && imageAreaRef.current)
      )
        return

      const totalHeight = screenshots.length * window.innerHeight * (SCROLL_HEIGHT_PER_ITEM / 100)

      const handleIndexChange = (newIndex: number) => {
        // Skip if navigating via tab click (prevents loading intermediate images)
        if (isNavigatingRef.current) return

        if (lastIndexRef.current !== newIndex) {
          posthog.capture('feature_tab_switched', {
            from_tab: screenshots[lastIndexRef.current]?.label,
            to_tab: screenshots[newIndex]?.label,
            to_tab_index: newIndex,
            trigger: 'scroll',
            location: 'snapshot_playground'
          })
          lastIndexRef.current = newIndex
          setActiveIndex(newIndex)
        }
      }

      ScrollTrigger.matchMedia({
        // Desktop
        '(min-width: 768px)': () => {
          // Calculate how much to offset to break out of parent container
          const parentWidth = wrapperRef.current?.parentElement?.offsetWidth || 0
          const viewportWidth = window.innerWidth
          const offsetX = (viewportWidth - parentWidth) / 2

          // Pin the container first - this keeps tabs visible while scrolling
          ScrollTrigger.create({
            trigger: wrapperRef.current,
            start: `top ${HEADER_OFFSET}px`,
            end: `+=${INTRO_ANIMATION_SCROLL + totalHeight}`,
            pin: containerRef.current,
            pinSpacing: true,
            onUpdate: (self) => {
              // Skip intro animation phase for index calculation
              const introProgress = INTRO_ANIMATION_SCROLL / (INTRO_ANIMATION_SCROLL + totalHeight)
              if (self.progress <= introProgress) return

              // Calculate progress within the main scrolling phase
              const mainProgress = (self.progress - introProgress) / (1 - introProgress)
              const newIndex = Math.min(
                Math.floor(mainProgress * screenshots.length),
                screenshots.length - 1
              )
              handleIndexChange(newIndex)
            }
          })

          // Intro animation - container expands to full width, image scales up
          const introTl = gsap.timeline({
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: `top ${HEADER_OFFSET}px`,
              end: `+=${INTRO_ANIMATION_SCROLL}`,
              scrub: 1.5 // Higher value = smoother animation, less jittery on fast scroll
            }
          })

          // Animate container to full viewport width
          introTl.fromTo(
            containerRef.current,
            {
              x: 0,
              width: '100%',
              paddingLeft: '0',
              paddingRight: '0'
            },
            {
              x: -offsetX,
              width: viewportWidth,
              paddingLeft: '1.5rem',
              paddingRight: '2rem',
              ease: 'power2.out',
              force3D: true
            },
            0
          )

          // Image scales up and moves to center
          introTl.fromTo(
            imageAreaRef.current,
            { scale: 0.92, x: '5rem' },
            { scale: 1, x: '0rem', ease: 'power2.out', force3D: true },
            0
          )

          // Tab list slides in from left
          introTl.fromTo(
            tabListRef.current,
            { left: '0rem' },
            { left: '10rem', ease: 'power2.out', force3D: true },
            0
          )
        },
        // Mobile - simpler animation
        '(max-width: 767px)': () => {
          ScrollTrigger.create({
            trigger: containerRef.current,
            start: `top ${HEADER_OFFSET}px`,
            end: `+=${totalHeight}`,
            pin: true,
            pinSpacing: true,
            onUpdate: (self) => {
              const progress = self.progress
              const newIndex = Math.min(
                Math.floor(progress * screenshots.length),
                screenshots.length - 1
              )
              handleIndexChange(newIndex)
            }
          })
        }
      })

      return () => {
        for (const trigger of ScrollTrigger.getAll()) {
          trigger.kill()
        }
      }
    },
    { scope: wrapperRef, dependencies: [screenshots] }
  )

  return (
    <div ref={wrapperRef}>
      <div className="relative mt-14 min-h-[calc(100vh-100px)]" ref={containerRef}>
        {/* 左侧标签列表 - 绝对定位在左侧 */}
        <div
          className="absolute top-1/2 left-0 z-20 hidden -translate-y-1/2 md:block"
          ref={tabListRef}
        >
          <div className="flex flex-col gap-2 md:gap-3">
            {screenshots.map((screenshot, index) => {
              const isActive = activeIndex === index
              return (
                <button
                  className={clsx(
                    'group relative flex items-center justify-start gap-4 rounded-xl px-4 py-3 text-left transition-colors',
                    isActive && 'bg-gray-100 shadow-sm dark:bg-white/5'
                  )}
                  key={screenshot.label}
                  onClick={() => handleTabClick(index)}
                  type="button"
                >
                  <span className="relative z-10 flex w-full items-center gap-3">
                    <span
                      className={clsx(
                        'flex size-9 items-center justify-center rounded-lg border transition-colors duration-300',
                        isActive
                          ? 'border-gray-200 bg-white text-indigo-600 dark:border-white/10 dark:bg-gray-800 dark:text-indigo-400'
                          : 'border-transparent bg-transparent text-gray-500 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-300'
                      )}
                    >
                      <screenshot.icon className="size-5" />
                    </span>
                    <span
                      className={clsx(
                        'font-medium transition-colors duration-300',
                        isActive
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-300'
                      )}
                    >
                      {screenshot.label}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 图片区域 - 初始在 tab 旁边，滚动后居中 */}
        <div
          className="flex min-h-[calc(100vh-100px)] w-screen items-center justify-center px-4 md:px-0"
          ref={imageAreaRef}
          style={{ transform: 'translateX(5rem)', willChange: 'transform' }}
        >
          <div className="grid w-full max-w-[min(calc(100vw-280px),calc((100vh-220px)*2560/1760))]">
            {screenshots.map((screenshot, index) => {
              const isActive = activeIndex === index
              const isLoaded = loadedImages.has(index)

              return (
                <div
                  className={clsx(
                    'col-start-1 row-start-1 transition-opacity duration-300 ease-out will-change-[opacity]',
                    isActive
                      ? 'pointer-events-auto z-10 opacity-100'
                      : 'pointer-events-none z-0 opacity-0'
                  )}
                  key={screenshot.label}
                >
                  <div className="overflow-hidden rounded-xl bg-slate-50/40 p-2 shadow-2xl ring-1 ring-slate-200/50 ring-inset md:rounded-2xl dark:bg-gray-900/70 dark:ring-white/10">
                    <div className="relative rounded bg-white ring-1 ring-slate-900/5 md:rounded-xl dark:bg-slate-950 dark:ring-white/15">
                      {!isLoaded && (
                        <div
                          className="absolute inset-0 flex animate-pulse items-center justify-center rounded bg-gray-100 md:rounded-xl dark:bg-gray-800"
                          style={{
                            aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}`
                          }}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div className="size-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
                            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                          </div>
                        </div>
                      )}

                      <Image
                        alt={screenshot.alt}
                        className={clsx(
                          'block w-full rounded shadow transition-opacity duration-300 md:rounded-xl dark:shadow-indigo-600/10',
                          isLoaded ? 'opacity-100' : 'opacity-0'
                        )}
                        height={IMAGE_HEIGHT}
                        onLoad={() => handleImageLoad(index)}
                        priority={index < 2}
                        quality={70}
                        src={screenshot.src}
                        width={IMAGE_WIDTH}
                      />
                    </div>
                  </div>
                </div>
              )
            })}

            {isInitialLoad && (
              <div
                className="z-20 col-start-1 row-start-1 flex items-center justify-center rounded-xl bg-slate-50/80 backdrop-blur-sm dark:bg-gray-900/80"
                style={{ aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}` }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="size-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-800 dark:border-t-indigo-400" />
                  <span className="font-medium text-gray-600 text-sm dark:text-gray-400">
                    Loading...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(SnapshotPlaygroundScroll)
