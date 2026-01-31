'use client'

import { useGSAP } from '@gsap/react'
import type { RemixiconComponentType } from '@remixicon/react'
import clsx from 'clsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLenis } from 'lenis/react'
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
const SCROLL_HEIGHT_PER_ITEM = 60 // vh - reduced from 80 for smoother experience
const HEADER_OFFSET = 100 // px

gsap.registerPlugin(ScrollTrigger)

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

  const lenis = useLenis()

  // 监听导航链接点击 - 修复同页面导航时的白屏问题
  // 当用户在 SnapshotPlayground 滚动区域点击 Home/Logo 时，需要重置 ScrollTrigger 状态
  useEffect(() => {
    const handleNavClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')

      // 只处理内部导航链接（不是新窗口打开的）
      if (link?.href && !link.target && link.origin === window.location.origin) {
        // 重置 ScrollTrigger 状态
        for (const trigger of ScrollTrigger.getAll()) {
          trigger.kill()
        }
        ScrollTrigger.clearScrollMemory()

        // 确保滚动到顶部
        window.scrollTo(0, 0)

        // 刷新 ScrollTrigger（下一帧执行，给 DOM 时间更新）
        requestAnimationFrame(() => {
          ScrollTrigger.refresh(true)
        })
      }
    }

    // 用捕获阶段确保在导航发生前执行
    document.addEventListener('click', handleNavClick, { capture: true })

    return () => {
      document.removeEventListener('click', handleNavClick, { capture: true })
    }
  }, [])

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
      if (!(wrapperRef.current && lenis)) return

      isNavigatingRef.current = true
      setActiveIndex(index)
      lastIndexRef.current = index

      const wrapperTop = wrapperRef.current.offsetTop
      const totalScrollHeight =
        screenshots.length * window.innerHeight * (SCROLL_HEIGHT_PER_ITEM / 100)
      const targetScroll = wrapperTop + (index / screenshots.length) * totalScrollHeight

      // 使用 Lenis 的 scrollTo 实现平滑滚动
      lenis.scrollTo(targetScroll, {
        duration: 1.2,
        easing: (t: number) => 1 - (1 - t) ** 3, // easeOutCubic
        onComplete: () => {
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
    [screenshots, lenis]
  )

  useGSAP(
    () => {
      if (!(wrapperRef.current && containerRef.current)) return

      const totalHeight = screenshots.length * window.innerHeight * (SCROLL_HEIGHT_PER_ITEM / 100)

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: `top ${HEADER_OFFSET}px`,
        end: `+=${totalHeight}`,
        pin: containerRef.current,
        pinSpacing: true,
        onUpdate: (self) => {
          if (isNavigatingRef.current) return

          const newIndex = Math.min(
            Math.floor(self.progress * screenshots.length),
            screenshots.length - 1
          )

          if (lastIndexRef.current !== newIndex) {
            const fromLabel = screenshots[lastIndexRef.current]?.label
            lastIndexRef.current = newIndex
            setActiveIndex(newIndex)

            posthog.capture('feature_tab_switched', {
              from_tab: fromLabel,
              to_tab: screenshots[newIndex]?.label,
              to_tab_index: newIndex,
              trigger: 'scroll',
              location: 'snapshot_playground'
            })
          }
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
      <div className="relative flex min-h-[calc(100vh-100px)] flex-col pt-8" ref={containerRef}>
        {/* 顶部水平 Tab 栏 */}
        <div className="mb-6 flex justify-center overflow-x-auto px-4" ref={tabListRef}>
          <div className="flex gap-2 rounded-xl bg-gray-100/80 p-1.5 dark:bg-white/5">
            {screenshots.map((screenshot, index) => {
              const isActive = activeIndex === index

              return (
                <button
                  className={clsx(
                    'relative flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 font-medium text-sm',
                    isActive
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-800 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  )}
                  key={screenshot.label}
                  onClick={() => handleTabClick(index)}
                  type="button"
                >
                  <screenshot.icon className="size-4" />
                  <span>{screenshot.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 图片区域 */}
        <div className="flex w-full items-center justify-center px-4" ref={imageAreaRef}>
          <div className="grid w-full max-w-6xl">
            {screenshots.map((screenshot, index) => {
              const isActive = activeIndex === index
              const isLoaded = loadedImages.has(index)

              return (
                <div
                  className={clsx(
                    'col-start-1 row-start-1',
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
                          'block w-full rounded shadow md:rounded-xl dark:shadow-indigo-600/10',
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
