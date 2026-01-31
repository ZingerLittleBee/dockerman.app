'use client'

import { useGSAP } from '@gsap/react'
import type { RemixiconComponentType } from '@remixicon/react'
import clsx from 'clsx'
import gsap from 'gsap'
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
const SCROLL_HEIGHT_PER_ITEM = 45 // vh
const HEADER_OFFSET = 100 // px

gsap.registerPlugin(ScrollTrigger)

function SnapshotPlaygroundScroll({ screenshots }: { screenshots: Screenshot[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageAreaRef = useRef<HTMLDivElement>(null)

  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const lastIndexRef = useRef(0)

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

  useGSAP(
    () => {
      if (!(wrapperRef.current && containerRef.current && imageAreaRef.current)) return

      const totalHeight = screenshots.length * window.innerHeight * (SCROLL_HEIGHT_PER_ITEM / 100)
      const imageElements = imageAreaRef.current.querySelectorAll('.image-slide')

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: `top ${HEADER_OFFSET}px`,
          end: `+=${totalHeight}`,
          pin: containerRef.current,
          pinSpacing: true,
          scrub: true,
          onUpdate: (self) => {
            const newIndex = Math.min(
              Math.floor(self.progress * screenshots.length),
              screenshots.length - 1
            )

            if (lastIndexRef.current !== newIndex) {
              const fromLabel = screenshots[lastIndexRef.current]?.label
              lastIndexRef.current = newIndex

              posthog.capture('feature_tab_switched', {
                from_tab: fromLabel,
                to_tab: screenshots[newIndex]?.label,
                to_tab_index: newIndex,
                trigger: 'scroll',
                location: 'snapshot_playground'
              })
            }
          }
        }
      })

      // 为每张图片添加动画
      // 每张图片有3个阶段：进入(80%)、中间放大(80%→85%)、离开(85%→80%)
      imageElements.forEach((el, index) => {
        if (index === 0) {
          // 第一张：先放大，再滑到左边并缩小
          tl.fromTo(el, { scale: 0.8 }, { scale: 0.85, ease: 'none' }, 0)
          tl.to(el, { xPercent: -100, scale: 0.8, ease: 'none' }, 0.5)
        } else if (index === screenshots.length - 1) {
          // 最后一张：从右边滑到中间(80%)，然后放大到85%
          tl.fromTo(
            el,
            { xPercent: 100, scale: 0.8 },
            { xPercent: 0, scale: 0.8, ease: 'none' },
            index - 0.5
          )
          tl.to(el, { scale: 0.85, ease: 'none' }, index)
        } else {
          // 中间的：进入(80%)、放大(85%)、离开(80%)
          tl.fromTo(
            el,
            { xPercent: 100, scale: 0.8 },
            { xPercent: 0, scale: 0.8, ease: 'none' },
            index - 0.5
          )
          tl.to(el, { scale: 0.85, ease: 'none' }, index)
          tl.to(el, { xPercent: -100, scale: 0.8, ease: 'none' }, index + 0.5)
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
    <div className="relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen" ref={wrapperRef}>
      <div className="relative flex h-[calc(100vh-100px)] flex-col" ref={containerRef}>
        {/* 图片区域 */}
        <div
          className="flex h-full w-full items-center justify-center overflow-hidden"
          ref={imageAreaRef}
        >
          <div className="relative flex h-full w-full items-center justify-center">
            {screenshots.map((screenshot, index) => {
              const isLoaded = loadedImages.has(index)

              return (
                <div
                  className={clsx(
                    'image-slide flex h-full w-full items-center justify-center',
                    index === 0 ? 'relative' : 'absolute inset-0'
                  )}
                  key={screenshot.label}
                >
                  <div
                    className="relative h-full max-h-full"
                    style={{ aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}` }}
                  >
                    {!isLoaded && (
                      <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <div className="flex flex-col items-center gap-3">
                          <div className="size-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
                          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                      </div>
                    )}

                    <Image
                      alt={screenshot.alt}
                      className={clsx(
                        'block h-full w-full object-contain',
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
              )
            })}

            {isInitialLoad && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm dark:bg-gray-900/80">
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
