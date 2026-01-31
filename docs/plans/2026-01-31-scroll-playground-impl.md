# Scroll Playground 实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 SnapshotPlaygroundTabs 重构为滚动触发切换的组件，使用 GSAP ScrollTrigger 实现。

**Architecture:** 左右双 sticky 布局，ScrollTrigger 监听滚动进度更新当前激活项，图片通过 opacity 切换实现 crossfade 效果。移动端改为上下堆叠布局。

**Tech Stack:** GSAP + ScrollTrigger, Next.js, React, TypeScript, Tailwind CSS

---

## Task 1: 安装 GSAP 依赖

**Files:**
- Modify: `package.json`

**Step 1: 安装 gsap 和 @gsap/react**

```bash
pnpm add gsap @gsap/react
```

**Step 2: 验证安装成功**

```bash
pnpm list gsap @gsap/react
```

Expected: 显示已安装的版本

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add gsap and @gsap/react dependencies"
```

---

## Task 2: 创建 SnapshotPlaygroundScroll 组件基础结构

**Files:**
- Create: `src/components/ui/SnapshotPlaygroundScroll.tsx`

**Step 1: 创建组件文件**

```tsx
'use client'

import { useGSAP } from '@gsap/react'
import type { RemixiconComponentType } from '@remixicon/react'
import clsx from 'clsx'
import gsap from 'gsap'
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

gsap.registerPlugin(ScrollTrigger)

function SnapshotPlaygroundScroll({ screenshots }: { screenshots: Screenshot[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => {
      const next = new Set(prev).add(index)
      if (next.has(0)) {
        setIsInitialLoad(false)
      }
      return next
    })
  }, [])

  const handleTabClick = useCallback((index: number) => {
    if (!containerRef.current) return

    const containerTop = containerRef.current.offsetTop
    const totalScrollHeight = screenshots.length * window.innerHeight * (SCROLL_HEIGHT_PER_ITEM / 100)
    const targetScroll = containerTop + (index / screenshots.length) * totalScrollHeight

    gsap.to(window, {
      scrollTo: { y: targetScroll },
      duration: 0.8,
      ease: 'power2.inOut'
    })
  }, [screenshots.length])

  useGSAP(() => {
    if (!containerRef.current) return

    const totalHeight = screenshots.length * window.innerHeight * (SCROLL_HEIGHT_PER_ITEM / 100)

    ScrollTrigger.matchMedia({
      // Desktop
      '(min-width: 768px)': () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalHeight}`,
          pin: true,
          onUpdate: (self) => {
            const progress = self.progress
            const newIndex = Math.min(
              Math.floor(progress * screenshots.length),
              screenshots.length - 1
            )
            setActiveIndex((prev) => {
              if (prev !== newIndex) {
                posthog.capture('feature_tab_switched', {
                  from_tab: screenshots[prev]?.label,
                  to_tab: screenshots[newIndex]?.label,
                  to_tab_index: newIndex,
                  trigger: 'scroll',
                  location: 'snapshot_playground'
                })
              }
              return newIndex
            })
          }
        })
      },
      // Mobile
      '(max-width: 767px)': () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${totalHeight}`,
          pin: true,
          onUpdate: (self) => {
            const progress = self.progress
            const newIndex = Math.min(
              Math.floor(progress * screenshots.length),
              screenshots.length - 1
            )
            setActiveIndex((prev) => {
              if (prev !== newIndex) {
                posthog.capture('feature_tab_switched', {
                  from_tab: screenshots[prev]?.label,
                  to_tab: screenshots[newIndex]?.label,
                  to_tab_index: newIndex,
                  trigger: 'scroll',
                  location: 'snapshot_playground'
                })
              }
              return newIndex
            })
          }
        })
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, { scope: containerRef, dependencies: [screenshots] })

  return (
    <div ref={containerRef} className="grid min-h-screen grid-cols-12 gap-8 md:gap-12">
      {/* 左侧标签列表 - 桌面端 */}
      <div className="col-span-full md:col-span-3">
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

      {/* 右侧图片区域 */}
      <div className="col-span-full md:col-span-9">
        <div className="grid">
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
  )
}

export default memo(SnapshotPlaygroundScroll)
```

**Step 2: 验证 TypeScript 类型检查**

```bash
pnpm exec tsc --noEmit
```

Expected: 无错误

**Step 3: Commit**

```bash
git add src/components/ui/SnapshotPlaygroundScroll.tsx
git commit -m "feat: add SnapshotPlaygroundScroll component with GSAP ScrollTrigger"
```

---

## Task 3: 更新父组件引用

**Files:**
- Modify: `src/components/ui/SnapshotPlayground.tsx`

**Step 1: 替换 import 和组件引用**

将第22行的:
```tsx
import SnapshotPlaygourndTabs from './SnapshotPlaygourndTabs'
```

替换为:
```tsx
import SnapshotPlaygroundScroll from './SnapshotPlaygroundScroll'
```

将第76行的:
```tsx
<SnapshotPlaygourndTabs screenshots={screenshots} />
```

替换为:
```tsx
<SnapshotPlaygroundScroll screenshots={screenshots} />
```

**Step 2: 验证 TypeScript 类型检查**

```bash
pnpm exec tsc --noEmit
```

Expected: 无错误

**Step 3: Commit**

```bash
git add src/components/ui/SnapshotPlayground.tsx
git commit -m "refactor: replace tabs component with scroll component"
```

---

## Task 4: 删除旧的 Tabs 组件

**Files:**
- Delete: `src/components/ui/SnapshotPlaygourndTabs.tsx`

**Step 1: 删除文件**

```bash
rm src/components/ui/SnapshotPlaygourndTabs.tsx
```

**Step 2: 验证构建**

```bash
pnpm build
```

Expected: 构建成功

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: remove deprecated SnapshotPlaygourndTabs component"
```

---

## Task 5: 本地测试验证

**Step 1: 启动开发服务器**

```bash
pnpm dev
```

**Step 2: 手动测试清单**

- [ ] 页面加载正常，无控制台错误
- [ ] 滚动页面时左侧标签高亮跟随变化
- [ ] 滚动页面时右侧图片淡入淡出切换
- [ ] 点击左侧标签可以跳转到对应位置
- [ ] 移动端视口下布局正确（使用 DevTools 模拟）
- [ ] 滚动完所有项目后，组件随页面滚走
- [ ] 暗色模式下样式正确

**Step 3: 修复发现的问题（如有）**

**Step 4: Final Commit**

```bash
git add -A
git commit -m "feat: complete scroll playground implementation"
```

---

## 任务总览

| Task | 描述 | 预估复杂度 |
|------|------|-----------|
| 1 | 安装 GSAP 依赖 | 低 |
| 2 | 创建新组件 | 高 |
| 3 | 更新父组件引用 | 低 |
| 4 | 删除旧组件 | 低 |
| 5 | 本地测试验证 | 中 |
