'use client'

import { useGSAP } from '@gsap/react'
import type { RemixiconComponentType } from '@remixicon/react'
import clsx from 'clsx'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import posthog from 'posthog-js'
import { memo, useCallback, useRef, useState } from 'react'

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
const SCROLL_THROTTLE_MS = 50 // 节流间隔，避免过于频繁的状态更新
const FAST_SCROLL_THRESHOLD = 3 // 快速滚动判定：连续跳过 N 个 index

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

function SnapshotPlaygroundScroll({ screenshots }: { screenshots: Screenshot[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tabListRef = useRef<HTMLDivElement>(null)
  const tabInnerRef = useRef<HTMLDivElement>(null)
  const imageAreaRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isFastScrolling, setIsFastScrolling] = useState(false)
  const lastIndexRef = useRef(0)
  const isNavigatingRef = useRef(false) // Track if navigating via tab click
  const lastUpdateTimeRef = useRef(0) // 节流时间戳
  const pendingIndexRef = useRef<number | null>(null) // 待处理的 index
  const rafIdRef = useRef<number | null>(null) // requestAnimationFrame ID
  const fastScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null) // 当前的滚动动画

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

      // 取消任何待执行的滚动更新，防止竞争条件
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      pendingIndexRef.current = null

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

      // Kill 旧的滚动动画，防止其 onComplete 干扰状态
      if (scrollTweenRef.current) {
        scrollTweenRef.current.kill()
        scrollTweenRef.current = null
      }

      scrollTweenRef.current = gsap.to(window, {
        scrollTo: { y: targetScroll },
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          // 只有当这是当前活动的动画时才重置标志
          scrollTweenRef.current = null
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

  useGSAP(
    () => {
      if (
        !(wrapperRef.current && containerRef.current && tabListRef.current && imageAreaRef.current)
      )
        return

      const totalHeight = screenshots.length * window.innerHeight * (SCROLL_HEIGHT_PER_ITEM / 100)

      // 节流版本的 index 更新
      const handleIndexChange = (newIndex: number) => {
        // Skip if navigating via tab click (prevents loading intermediate images)
        if (isNavigatingRef.current) return

        // 如果 index 没变，直接返回
        if (lastIndexRef.current === newIndex) return

        const now = performance.now()
        const timeDelta = now - lastUpdateTimeRef.current
        const indexDelta = Math.abs(newIndex - lastIndexRef.current)

        // 检测是否快速滚动（跳过多个 index 或更新过于频繁）
        const isCurrentlyFastScrolling =
          indexDelta >= FAST_SCROLL_THRESHOLD || timeDelta < SCROLL_THROTTLE_MS

        if (isCurrentlyFastScrolling) {
          // 快速滚动时：禁用 transition，立即更新
          setIsFastScrolling(true)

          // 清除之前的恢复定时器
          if (fastScrollTimeoutRef.current) {
            clearTimeout(fastScrollTimeoutRef.current)
          }

          // 延迟恢复 transition（滚动停止后）
          fastScrollTimeoutRef.current = setTimeout(() => {
            setIsFastScrolling(false)
          }, 150)
        }

        // 使用 requestAnimationFrame 批量更新，避免阻塞滚动
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current)
        }

        pendingIndexRef.current = newIndex
        rafIdRef.current = requestAnimationFrame(() => {
          // 再次检查是否正在导航，防止覆盖用户点击的目标位置
          if (isNavigatingRef.current) {
            rafIdRef.current = null
            pendingIndexRef.current = null
            return
          }

          const pendingIndex = pendingIndexRef.current
          if (pendingIndex !== null && pendingIndex !== lastIndexRef.current) {
            const fromLabel = screenshots[lastIndexRef.current]?.label
            const toLabel = screenshots[pendingIndex]?.label

            lastIndexRef.current = pendingIndex
            lastUpdateTimeRef.current = performance.now()
            setActiveIndex(pendingIndex)

            // 延迟 posthog 调用，不阻塞主线程
            setTimeout(() => {
              posthog.capture('feature_tab_switched', {
                from_tab: fromLabel,
                to_tab: toLabel,
                to_tab_index: pendingIndex,
                trigger: 'scroll',
                location: 'snapshot_playground'
              })
            }, 0)
          }
          rafIdRef.current = null
          pendingIndexRef.current = null
        })
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
        {/* 左侧标签列表 - 只显示选中项及前后各一项 */}
        <div
          className="absolute top-0 left-0 z-20 hidden h-full md:flex md:flex-col md:justify-center"
          ref={tabListRef}
        >
          <div className="flex flex-col items-center gap-2">
            {/* 到顶部按钮 */}
            <button
              aria-label="Go to first"
              className={clsx(
                'flex h-10 w-48 items-center justify-center rounded-lg transition-all duration-300',
                activeIndex === 0
                  ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300'
              )}
              disabled={activeIndex === 0}
              onClick={() => handleTabClick(0)}
              type="button"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M5 15l7-7 7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
                <path d="M5 9h14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            </button>

            {/* Tab 列表区域 - 使用 translateY 实现平移滚动 */}
            <div
              className="relative w-48 overflow-hidden"
              ref={tabInnerRef}
              style={{ height: `${5 * 68}px` }}
            >
              {/* 上方渐变遮罩 */}
              {activeIndex > 0 && (
                <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-16 bg-gradient-to-b from-white to-transparent dark:from-gray-950" />
              )}

              {/* 滚动内容 */}
              <div
                className={clsx(
                  'flex flex-col gap-2 ease-out',
                  !isFastScrolling && 'transition-transform duration-300'
                )}
                style={{ transform: `translateY(${(2 - activeIndex) * 68}px)` }}
              >
                {screenshots.map((screenshot, index) => {
                  const isActive = activeIndex === index
                  const distance = Math.abs(index - activeIndex)
                  const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.3

                  return (
                    <button
                      className={clsx(
                        'group relative flex h-[60px] w-full items-center justify-start gap-4 rounded-xl px-4 py-3 text-left',
                        !isFastScrolling && 'transition-all duration-300',
                        isActive && 'bg-gray-100 shadow-sm dark:bg-white/5'
                      )}
                      key={screenshot.label}
                      onClick={() => handleTabClick(index)}
                      style={{ opacity }}
                      type="button"
                    >
                      <span className="relative z-10 flex w-full items-center gap-3">
                        <span
                          className={clsx(
                            'flex size-9 shrink-0 items-center justify-center rounded-lg border',
                            !isFastScrolling && 'transition-colors duration-300',
                            isActive
                              ? 'border-gray-200 bg-white text-indigo-600 dark:border-white/10 dark:bg-gray-800 dark:text-indigo-400'
                              : 'border-transparent bg-transparent text-gray-500 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-300'
                          )}
                        >
                          <screenshot.icon className="size-5" />
                        </span>
                        <span
                          className={clsx(
                            'truncate font-medium',
                            !isFastScrolling && 'transition-colors duration-300',
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

              {/* 下方渐变遮罩 */}
              {activeIndex < screenshots.length - 1 && (
                <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-16 bg-gradient-to-t from-white to-transparent dark:from-gray-950" />
              )}
            </div>

            {/* 到底部按钮 */}
            <button
              aria-label="Go to last"
              className={clsx(
                'flex h-10 w-48 items-center justify-center rounded-lg transition-all duration-300',
                activeIndex === screenshots.length - 1
                  ? 'cursor-not-allowed text-gray-300 dark:text-gray-600'
                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-500 dark:hover:bg-white/5 dark:hover:text-gray-300'
              )}
              disabled={activeIndex === screenshots.length - 1}
              onClick={() => handleTabClick(screenshots.length - 1)}
              type="button"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
                <path d="M5 15h14" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              </svg>
            </button>
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
                    'col-start-1 row-start-1 ease-out will-change-[opacity]',
                    !isFastScrolling && 'transition-opacity duration-300',
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
