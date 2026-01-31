# SnapshotPlaygroundScroll 动画优化实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 优化 SnapshotPlaygroundScroll 组件的动画流畅度，将左侧 tab 改为顶部水平布局，使用 Lenis 实现丝滑滚动

**Architecture:** 集成 Lenis 平滑滚动库与 GSAP ScrollTrigger，重构组件布局为顶部 tab + 全宽图片区域，移除 intro 动画和快速滚动检测

**Tech Stack:** React, GSAP (ScrollTrigger, ScrollToPlugin), Lenis (smooth scroll), Tailwind CSS, Next.js Image

---

### Task 0: 安装 Lenis 库

**Step 1: 安装依赖**

Run: `cd /Users/zingerbee/.superset/worktrees/dockerman.app1/astronomy && npm install lenis`

Expected: 安装成功

**Step 2: 验证安装**

Run: `cat package.json | grep lenis`

Expected: 显示 lenis 版本

---

### Task 1: 创建全局 Lenis Provider

**Files:**
- Create: `src/components/providers/LenisProvider.tsx`

**Step 1: 创建 LenisProvider 组件**

```tsx
'use client'

import { ReactLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    // 将 Lenis 的 raf 添加到 GSAP ticker
    gsap.ticker.add(update)
    // 禁用 lag smoothing 以获得即时响应
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  useEffect(() => {
    // 当 Lenis 滚动时更新 ScrollTrigger
    const lenis = lenisRef.current?.lenis
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
    }

    return () => {
      lenis?.off('scroll', ScrollTrigger.update)
    }
  }, [])

  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true
      }}
      ref={lenisRef}
    >
      {children}
    </ReactLenis>
  )
}
```

**Step 2: 验证文件创建**

Run: `ls -la src/components/providers/LenisProvider.tsx`

Expected: 文件存在

---

### Task 2: 集成 LenisProvider 到布局

**Files:**
- Modify: `src/app/layout.tsx` 或项目的根布局文件

**Step 1: 查找根布局文件**

Run: `ls src/app/layout.tsx src/app/providers.tsx 2>/dev/null || ls src/components/providers/*.tsx`

**Step 2: 在根布局中包裹 LenisProvider**

在根布局的最外层包裹 `<LenisProvider>`:

```tsx
import { LenisProvider } from '@/components/providers/LenisProvider'

// 在 body 内部包裹
<LenisProvider>
  {children}
</LenisProvider>
```

---

### Task 3: 清理无用状态和 refs

**Files:**
- Modify: `src/components/ui/SnapshotPlaygroundScroll.tsx:35-44`

**Step 1: 删除 isFastScrolling 状态和相关 refs**

删除以下代码：

```tsx
// 删除这些
const [isFastScrolling, setIsFastScrolling] = useState(false)
const tabInnerRef = useRef<HTMLDivElement>(null)
const lastUpdateTimeRef = useRef(0) // 节流时间戳
const pendingIndexRef = useRef<number | null>(null) // 待处理的 index
const rafIdRef = useRef<number | null>(null) // requestAnimationFrame ID
```

保留：

```tsx
const wrapperRef = useRef<HTMLDivElement>(null)
const containerRef = useRef<HTMLDivElement>(null)
const tabListRef = useRef<HTMLDivElement>(null)
const imageAreaRef = useRef<HTMLDivElement>(null)

const [activeIndex, setActiveIndex] = useState(0)
const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set())
const [isInitialLoad, setIsInitialLoad] = useState(true)
const lastIndexRef = useRef(0)
const isNavigatingRef = useRef(false)
const scrollTweenRef = useRef<gsap.core.Tween | null>(null)
```

---

### Task 4: 删除独立滚动速度监听器

**Files:**
- Modify: `src/components/ui/SnapshotPlaygroundScroll.tsx:85-152`

**Step 1: 删除整个 useEffect（滚动速度监听）**

删除从 `// 独立的滚动速度监听器` 到其对应 `}, [])` 的整个 useEffect block（约 67 行）

**Step 2: 保留导航链接点击处理的 useEffect**

确保 `// 监听导航链接点击` 的 useEffect（第 48-83 行）保持不变

---

### Task 5: 更新 handleTabClick 使用 Lenis

**Files:**
- Modify: `src/components/ui/SnapshotPlaygroundScroll.tsx:164-216`

**Step 1: 添加 useLenis hook 导入**

```tsx
import { useLenis } from 'lenis/react'
```

**Step 2: 在组件内添加 lenis hook**

```tsx
const lenis = useLenis()
```

**Step 3: 替换 handleTabClick 函数**

```tsx
const handleTabClick = useCallback(
  (index: number) => {
    if (!wrapperRef.current || !lenis) return

    isNavigatingRef.current = true
    setActiveIndex(index)
    lastIndexRef.current = index

    const wrapperTop = wrapperRef.current.offsetTop
    const totalScrollHeight =
      screenshots.length * window.innerHeight * (SCROLL_HEIGHT_PER_ITEM / 100)
    const targetScroll =
      wrapperTop + (index / screenshots.length) * totalScrollHeight

    // 使用 Lenis 的 scrollTo 实现平滑滚动
    lenis.scrollTo(targetScroll, {
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // easeOutCubic
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
```

---

### Task 6: 简化 ScrollTrigger 配置

**Files:**
- Modify: `src/components/ui/SnapshotPlaygroundScroll.tsx:20-25`
- Modify: `src/components/ui/SnapshotPlaygroundScroll.tsx:218-376`

**Step 1: 更新常量**

```tsx
const IMAGE_WIDTH = 2560
const IMAGE_HEIGHT = 1760
const SCROLL_HEIGHT_PER_ITEM = 60 // vh - 从 80 减少到 60
const HEADER_OFFSET = 100 // px
// 删除 INTRO_ANIMATION_SCROLL
```

**Step 2: 替换整个 useGSAP hook**

```tsx
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
```

---

### Task 7: 重构 JSX - 水平 Tab 栏

**Files:**
- Modify: `src/components/ui/SnapshotPlaygroundScroll.tsx:378-506`

**Step 1: 替换左侧 tab 列表为水平 tab 栏**

删除整个左侧 tab 列表 div（从 `{/* 左侧标签列表 */}` 到其闭合标签），替换为：

```tsx
{/* 顶部水平 Tab 栏 */}
<div
  className="mb-6 flex justify-center overflow-x-auto px-4"
  ref={tabListRef}
>
  <div className="flex gap-2 rounded-xl bg-gray-100/80 p-1.5 dark:bg-white/5">
    {screenshots.map((screenshot, index) => {
      const isActive = activeIndex === index

      return (
        <button
          className={clsx(
            'relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap',
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
```

---

### Task 8: 简化图片区域

**Files:**
- Modify: `src/components/ui/SnapshotPlaygroundScroll.tsx:508-580`

**Step 1: 简化图片区域 JSX**

替换图片区域为：

```tsx
{/* 图片区域 */}
<div
  className="flex w-full items-center justify-center px-4"
  ref={imageAreaRef}
>
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
```

---

### Task 9: 更新容器样式

**Files:**
- Modify: `src/components/ui/SnapshotPlaygroundScroll.tsx`

**Step 1: 更新容器 div 的 className**

将：
```tsx
<div className="relative mt-14 min-h-[calc(100vh-100px)]" ref={containerRef}>
```

改为：
```tsx
<div className="relative flex min-h-[calc(100vh-100px)] flex-col pt-8" ref={containerRef}>
```

**Step 2: 移除图片区域的 inline style**

删除 `imageAreaRef` div 上的 `style={{ transform: 'translateX(5rem)', willChange: 'transform' }}`

---

### Task 10: 验证和测试

**Step 1: 类型检查**

Run: `cd /Users/zingerbee/.superset/worktrees/dockerman.app1/astronomy && npx tsc --noEmit`

Expected: 无错误

**Step 2: 启动开发服务器测试**

Run: `cd /Users/zingerbee/.superset/worktrees/dockerman.app1/astronomy && npm run dev`

手动测试：
1. 页面滚动是否丝滑（Lenis 效果）
2. 滚动时 tab 和图片切换是否流畅
3. 点击 tab 是否平滑跳转
4. 快速滚动是否无卡顿
5. 移动端布局是否正常

**Step 3: 提交**

```bash
git add -A
git commit -m "refactor: optimize SnapshotPlaygroundScroll with Lenis smooth scroll

- Integrate Lenis library for silky smooth scrolling
- Add LenisProvider with GSAP ticker integration
- Change left sidebar tabs to horizontal top tabs
- Remove intro animation and fast scroll detection
- Simplify ScrollTrigger config (60vh per item)
- Use Lenis scrollTo for tab click navigation
- Remove ~200 lines of unused code"
```
