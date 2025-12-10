"use client"
import * as Tabs from "@radix-ui/react-tabs"
import type { RemixiconComponentType } from "@remixicon/react"
import clsx from "clsx"
import { motion } from "motion/react"
import Image from "next/image"
import { memo, useCallback, useEffect, useState } from "react"

interface Screenshot {
  src: string
  alt: string
  label: string
  icon: RemixiconComponentType
}

// 图片的原始尺寸比例
const IMAGE_WIDTH = 2560
const IMAGE_HEIGHT = 1760

function SnapshotPlaygourndTabs({ screenshots }: { screenshots: Screenshot[] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // 标记图片已加载
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set(prev).add(index))
  }, [])

  // 初始加载完成后关闭加载状态
  useEffect(() => {
    if (loadedImages.has(0)) {
      setIsInitialLoad(false)
    }
  }, [loadedImages])

  return (
    <Tabs.Root
      className="mt-14 grid grid-cols-12 gap-8 md:gap-12"
      value={screenshots[activeIndex]?.label}
      onValueChange={(value) => {
        const index = screenshots.findIndex((s) => s.label === value)
        if (index !== -1) setActiveIndex(index)
      }}
      orientation="vertical"
    >
      <Tabs.List
        className="col-span-full grid grid-cols-2 gap-2 md:col-span-3 md:flex md:flex-col md:gap-3"
        aria-label="Select view"
      >
        {screenshots.map((screenshot, index) => {
          const isActive = activeIndex === index
          return (
            <Tabs.Trigger
              key={screenshot.label}
              className="group relative flex items-center justify-start gap-4 rounded-xl px-4 py-3 text-left transition-colors"
              value={screenshot.label}
              style={{
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-0 rounded-xl bg-gray-100 shadow-sm dark:bg-white/5 dark:shadow-indigo-900/10"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
              <span className="relative z-10 flex w-full items-center gap-3">
                <span
                  className={clsx(
                    "flex size-9 items-center justify-center rounded-lg border transition-colors duration-300",
                    isActive
                      ? "border-gray-200 bg-white text-indigo-600 dark:border-white/10 dark:bg-gray-800 dark:text-indigo-400"
                      : "border-transparent bg-transparent text-gray-500 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-300",
                  )}
                >
                  <screenshot.icon className="size-5" />
                </span>
                <span
                  className={clsx(
                    "font-medium transition-colors duration-300",
                    isActive
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-500 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-300",
                  )}
                >
                  {screenshot.label}
                </span>
              </span>
            </Tabs.Trigger>
          )
        })}
      </Tabs.List>

      {/* 图片容器 - 使用 grid 堆叠所有图片，让第一张图片撑开容器高度 */}
      <div className="relative col-span-full md:col-span-9">
        <div className="grid">
          {screenshots.map((screenshot, index) => {
            const isActive = activeIndex === index
            const isLoaded = loadedImages.has(index)

            return (
              <Tabs.Content
                key={screenshot.label}
                value={screenshot.label}
                forceMount
                className={clsx(
                  // 使用 grid 区域堆叠，第一张图片设定容器大小
                  "col-start-1 row-start-1 transition-all duration-300 ease-out",
                  isActive
                    ? "pointer-events-auto z-10 opacity-100"
                    : "pointer-events-none z-0 opacity-0",
                )}
              >
                <div className="overflow-hidden rounded-xl bg-slate-50/40 p-2 shadow-2xl ring-1 ring-inset ring-slate-200/50 md:rounded-2xl dark:bg-gray-900/70 dark:ring-white/10">
                  <div className="relative rounded bg-white ring-1 ring-slate-900/5 md:rounded-xl dark:bg-slate-950 dark:ring-white/15">
                    {/* 骨架加载占位符 */}
                    {!isLoaded && (
                      <div
                        className="absolute inset-0 flex animate-pulse items-center justify-center rounded bg-gray-100 md:rounded-xl dark:bg-gray-800"
                        style={{
                          aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}`,
                        }}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="size-12 rounded-lg bg-gray-200 dark:bg-gray-700" />
                          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                        </div>
                      </div>
                    )}

                    <Image
                      src={screenshot.src}
                      alt={screenshot.alt}
                      width={IMAGE_WIDTH}
                      height={IMAGE_HEIGHT}
                      className={clsx(
                        "block w-full rounded shadow transition-opacity duration-300 md:rounded-xl dark:shadow-indigo-600/10",
                        isLoaded ? "opacity-100" : "opacity-0",
                      )}
                      priority={index < 2}
                      quality={70}
                      onLoad={() => handleImageLoad(index)}
                    />
                  </div>
                </div>
              </Tabs.Content>
            )
          })}

          {/* 全局加载指示器（仅在初始加载时显示） */}
          {isInitialLoad && (
            <div
              className="col-start-1 row-start-1 z-20 flex items-center justify-center rounded-xl bg-slate-50/80 backdrop-blur-sm dark:bg-gray-900/80"
              style={{ aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}` }}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="size-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600 dark:border-indigo-800 dark:border-t-indigo-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Loading...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Tabs.Root>
  )
}

export default memo(SnapshotPlaygourndTabs)
