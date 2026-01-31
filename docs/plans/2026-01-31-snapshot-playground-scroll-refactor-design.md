# SnapshotPlaygroundScroll 重构设计

## 概述

重构 SnapshotPlaygroundScroll 组件的交互方式，移除标签列表，改用滚动驱动的水平滑动动画展示截图。

## 目标

1. 移除顶部标签列表
2. 实现连续滚动驱动的水平滑动动画
3. 旧图片从中间滑向左边消失，新图片从右边滑入中间
4. 相邻图片有重叠过渡效果（走马灯）
5. 所有图片展示完毕后，区域取消固定，继续正常滚动

## 动画原理

使用 GSAP ScrollTrigger 的 `scrub` 模式，将滚动进度直接映射到图片的 `xPercent` 属性：

```
滚动进度 0% → 100%
  ↓
图片 0: xPercent 0 → -100（从中间滑到左边消失）
图片 1: xPercent 100 → 0 → -100（从右边滑入中间，再滑到左边）
图片 2: xPercent 100 → 0 → -100
...
图片 N: xPercent 100 → 0（从右边滑入中间，停在中间）
```

## GSAP Timeline 实现

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: wrapperRef.current,
    start: `top ${HEADER_OFFSET}px`,
    end: `+=${totalHeight}`,
    pin: containerRef.current,
    scrub: true,
  }
})

screenshots.forEach((_, index) => {
  const imageEl = `.image-${index}`

  if (index === 0) {
    // 第一张：从中间滑到左边
    tl.fromTo(imageEl, { xPercent: 0 }, { xPercent: -100 }, index)
  } else if (index === screenshots.length - 1) {
    // 最后一张：从右边滑到中间
    tl.fromTo(imageEl, { xPercent: 100 }, { xPercent: 0 }, index - 0.5)
  } else {
    // 中间的：从右边滑入，再滑到左边
    tl.fromTo(imageEl, { xPercent: 100 }, { xPercent: 0 }, index - 0.5)
    tl.to(imageEl, { xPercent: -100 }, index + 0.5)
  }
})
```

## DOM 结构变化

### 移除

- `tabListRef` 及整个标签栏 JSX
- `activeIndex` 状态
- `handleTabClick` 函数
- `isNavigatingRef` 相关逻辑
- grid 布局（改用 absolute 定位）

### 保留

- `wrapperRef` - 外层容器，ScrollTrigger 触发器
- `containerRef` - 固定的内容区域
- `imageAreaRef` - 图片展示区域
- `loadedImages` 和加载占位符
- `isInitialLoad` 初始加载遮罩
- 导航链接点击重置 ScrollTrigger 逻辑
- PostHog 埋点（仅记录滚动触发）

### 新结构

```tsx
<div ref={wrapperRef}>
  <div ref={containerRef} className="relative min-h-[calc(100vh-100px)] pt-8">
    <div ref={imageAreaRef} className="flex w-full items-center justify-center px-4 overflow-hidden">
      <div className="relative w-full max-w-6xl">
        {screenshots.map((screenshot, index) => (
          <div
            key={screenshot.label}
            className={`image-slide absolute inset-0 ${index === 0 ? 'relative' : ''}`}
            data-index={index}
          >
            {/* 图片卡片内容 */}
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
```

## 样式要点

1. 图片容器添加 `overflow-hidden` 裁剪超出边界的图片
2. 使用 absolute 定位堆叠所有图片
3. 第一张图片用 relative 撑开容器高度
4. 移除 opacity 切换逻辑，靠位移控制可见性

## 埋点调整

```typescript
onUpdate: (self) => {
  const newIndex = Math.min(
    Math.floor(self.progress * screenshots.length),
    screenshots.length - 1
  )

  if (lastIndexRef.current !== newIndex) {
    posthog.capture('feature_tab_switched', {
      from_tab: screenshots[lastIndexRef.current]?.label,
      to_tab: screenshots[newIndex]?.label,
      to_tab_index: newIndex,
      trigger: 'scroll',
      location: 'snapshot_playground'
    })
    lastIndexRef.current = newIndex
  }
}
```
