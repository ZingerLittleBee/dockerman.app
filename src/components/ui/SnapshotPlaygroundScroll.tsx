'use client'

import { useGSAP } from '@gsap/react'
import type { RemixiconComponentType } from '@remixicon/react'
import { RiCloseLine, RiRefreshLine, RiZoomInLine, RiZoomOutLine } from '@remixicon/react'
import clsx from 'clsx'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { TransformComponent, TransformWrapper, useControls } from 'react-zoom-pan-pinch'

interface Screenshot {
  src: string
  alt: string
  label: string
  icon: RemixiconComponentType
}

const IMAGE_WIDTH = 2400
const IMAGE_HEIGHT = 1600
const SCROLL_HEIGHT_PER_ITEM = 65 // vh - 增加高度让滚动速度变慢
const HEADER_OFFSET = 100 // px

// Hoisted style objects to prevent re-renders
const LIGHTBOX_CONTENT_STYLE = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
} as const

const LIGHTBOX_WRAPPER_STYLE = {
  width: '100%',
  height: '100%'
} as const

// 加载骨架屏组件
function LoadingSkeleton({ absolute = false }: { absolute?: boolean }) {
  return (
    <div
      className={clsx(
        'flex animate-pulse items-center justify-center bg-gray-100 dark:bg-gray-800',
        absolute && 'absolute inset-0'
      )}
      style={absolute ? undefined : { aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}` }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="size-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  )
}

// Lightbox 控制按钮组件
function LightboxControls({ onClose }: { onClose: () => void }) {
  const { zoomIn, zoomOut, resetTransform } = useControls()

  const buttons = [
    { icon: RiZoomInLine, action: zoomIn },
    { icon: RiZoomOutLine, action: zoomOut },
    { icon: RiRefreshLine, action: resetTransform },
    { icon: RiCloseLine, action: onClose }
  ]

  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      {buttons.map(({ icon: Icon, action }) => (
        <button
          className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
          key={Icon.displayName}
          onClick={(e) => {
            e.stopPropagation()
            action()
          }}
          type="button"
        >
          <Icon className="size-6" />
        </button>
      ))}
    </div>
  )
}

gsap.registerPlugin(ScrollTrigger)

function SnapshotPlaygroundScroll({ screenshots }: { screenshots: Screenshot[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const imageAreaRef = useRef<HTMLDivElement>(null)
  const screenshotsRef = useRef(screenshots)

  // Keep ref in sync with latest screenshots (for labels after language change)
  useEffect(() => {
    screenshotsRef.current = screenshots
  }, [screenshots])

  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [lightboxImage, setLightboxImage] = useState<Screenshot | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
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

  // 桌面端滚动动画 - 使用 matchMedia 检测
  useGSAP(
    () => {
      // 只在桌面端启用动画
      const mediaQuery = window.matchMedia('(min-width: 768px)')
      if (!mediaQuery.matches) return

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
              // Use ref to get current labels (handles language changes without recreating animation)
              const currentScreenshots = screenshotsRef.current
              const fromLabel = currentScreenshots[lastIndexRef.current]?.label
              lastIndexRef.current = newIndex
              setActiveIndex(newIndex)

              // Defer PostHog import to reduce initial bundle size
              import('posthog-js').then(({ default: posthog }) => {
                posthog.capture('feature_tab_switched', {
                  from_tab: fromLabel,
                  to_tab: currentScreenshots[newIndex]?.label,
                  to_tab_index: newIndex,
                  trigger: 'scroll',
                  location: 'snapshot_playground'
                })
              })
            }
          }
        }
      })

      // 为每张图片添加动画
      // 所有图片堆叠在一起，新图片从右边逐渐揭示覆盖旧图片
      imageElements.forEach((el, index) => {
        // 所有图片固定在中间，使用 clipPath 实现揭示效果
        gsap.set(el, { scale: 0.85, xPercent: 0 })

        if (index === 0) {
          // 第一张图片：初始完全显示
          gsap.set(el, { clipPath: 'inset(0 0% 0 0)' })
        } else {
          // 其他图片：初始完全隐藏，滚动时从左向右揭示
          gsap.set(el, { clipPath: 'inset(0 0 0 100%)' })
          tl.to(el, { clipPath: 'inset(0 0 0 0%)', ease: 'none' }, index - 1)
        }
      })

      return () => {
        for (const trigger of ScrollTrigger.getAll()) {
          trigger.kill()
        }
      }
    },
    { scope: wrapperRef, dependencies: [screenshots.length] }
  )

  return (
    <>
      {/* 移动端：垂直平铺布局 */}
      <div className="mt-8 flex flex-col gap-6 px-4 md:hidden">
        {screenshots.map((screenshot, index) => {
          const isLoaded = loadedImages.has(index)

          return (
            <button
              className="w-full rounded-xl bg-slate-50/40 p-2 ring-1 ring-slate-200/50 ring-inset transition-transform active:scale-[0.98] dark:bg-gray-900/70 dark:ring-white/10"
              key={screenshot.label}
              onClick={() => setLightboxImage(screenshot)}
              type="button"
            >
              <div className="overflow-hidden rounded-lg bg-white ring-1 ring-slate-900/5 dark:bg-slate-950 dark:ring-white/15">
                {!isLoaded && <LoadingSkeleton />}

                <Image
                  alt={screenshot.alt}
                  className={clsx(
                    'block w-full rounded-lg object-cover',
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  )}
                  height={IMAGE_HEIGHT}
                  onLoad={() => handleImageLoad(index)}
                  priority={index < 3}
                  quality={70}
                  src={screenshot.src}
                  width={IMAGE_WIDTH}
                />
              </div>
              <p className="mt-2 text-center font-medium text-gray-700 text-sm dark:text-gray-300">
                {screenshot.label}
              </p>
            </button>
          )
        })}
      </div>

      {/* 桌面端：滚动动画效果 */}
      <div
        className="relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] hidden w-screen md:block"
        ref={wrapperRef}
      >
        <div className="relative flex h-[calc(100vh-100px)] flex-col" ref={containerRef}>
          {/* 模块标签 Badge */}
          {(() => {
            const activeScreenshot = screenshots[activeIndex]
            const Icon = activeScreenshot?.icon
            return (
              <div className="absolute top-4 left-1/2 z-10 -translate-x-1/2">
                <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm dark:bg-gray-900/90 dark:ring-white/10">
                  {Icon && (
                    <Icon
                      className="size-5 text-indigo-600 transition-opacity duration-300 dark:text-indigo-400"
                      key={`icon-${activeIndex}`}
                    />
                  )}
                  <span
                    className="animate-fade-in font-medium text-gray-900 text-sm dark:text-white"
                    key={`label-${activeIndex}`}
                  >
                    {activeScreenshot?.label}
                  </span>
                </div>
              </div>
            )
          })()}

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
                    <div className="relative h-full max-h-full w-auto rounded-xl bg-slate-50/40 p-2 ring-1 ring-slate-200/50 ring-inset dark:bg-gray-900/70 dark:ring-white/10">
                      <div
                        className="h-full overflow-hidden rounded-lg bg-white ring-1 ring-slate-900/5 dark:bg-slate-950 dark:ring-white/15"
                        style={{ aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}` }}
                      >
                        {!isLoaded && <LoadingSkeleton absolute />}

                        <Image
                          alt={screenshot.alt}
                          className={clsx(
                            'block h-full w-full rounded-lg object-cover',
                            isLoaded ? 'opacity-100' : 'opacity-0'
                          )}
                          height={IMAGE_HEIGHT}
                          loading={index >= 3 ? 'eager' : undefined}
                          onLoad={() => handleImageLoad(index)}
                          priority={index < 3}
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

      {/* Lightbox 大图预览 - 支持手势缩放 */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90" onClick={() => setLightboxImage(null)}>
          <TransformWrapper centerOnInit={true} initialScale={1} maxScale={4} minScale={0.5}>
            <LightboxControls onClose={() => setLightboxImage(null)} />
            <TransformComponent
              contentStyle={LIGHTBOX_CONTENT_STYLE}
              wrapperStyle={LIGHTBOX_WRAPPER_STYLE}
            >
              <Image
                alt={lightboxImage.alt}
                className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
                height={IMAGE_HEIGHT}
                onClick={(e) => e.stopPropagation()}
                quality={90}
                src={lightboxImage.src}
                width={IMAGE_WIDTH}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      )}
    </>
  )
}

export default memo(SnapshotPlaygroundScroll)
