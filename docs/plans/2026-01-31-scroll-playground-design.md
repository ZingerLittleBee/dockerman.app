# Scroll Playground 设计方案

## 概述

重构 `SnapshotPlaygroundTabs` 组件，将点击切换改为滚动触发切换，使用 GSAP + ScrollTrigger 实现。

## 目标效果

- 左侧：标签列表 sticky 固定，当前项自动高亮
- 右侧：图片 sticky 固定，淡入淡出切换
- 用户滚动时自动切换，也可点击跳转
- 滚动过所有项后，整个区块跟随页面滚走

## 技术选型

| 项目 | 选择 | 原因 |
|------|------|------|
| 动画库 | GSAP + ScrollTrigger | 内置 pin 功能，滚动动画行业标准 |
| 布局 | CSS Grid + Sticky | 简单可靠 |
| 图片切换 | Opacity crossfade | 性能最优，无重排 |

## 组件架构

```
ScrollPlayground (新组件)
├── 滚动容器 (高度约 12 * 80vh)
│   ├── 左侧 Sticky 区域
│   │   └── 标签列表 (当前项自动高亮)
│   │
│   └── 右侧 Sticky 区域
│       └── 图片容器 (所有图片堆叠，opacity 切换)
```

## 滚动行为

### 滚动空间

- 每个截图项占用 `80vh` 滚动距离
- 12 个项目 = 总滚动高度约 `960vh`
- 最后预留 `100vh`，让用户看完最后一张再滚走

### ScrollTrigger 配置

- 触发区域：整个组件容器
- Pin 目标：左侧列表 + 右侧图片
- 开始点：组件顶部到达视口顶部
- 结束点：滚动完所有项目

### 切换逻辑

```
滚动进度 0% ~ 8.3%    → 第1张 (Dashboard)
滚动进度 8.3% ~ 16.7% → 第2张 (Terminal)
...以此类推
```

### 点击跳转

- 保留点击切换功能
- 点击时用 `gsap.to(window, { scrollTo: ... })` 滚动到对应位置

## 图片切换动画

### 效果

- Crossfade 交叉淡入淡出
- 当前图片 `opacity: 1 → 0`
- 新图片 `opacity: 0 → 1`
- 过渡时长：`300ms`，`ease-out` 缓动

### 实现

- 所有图片用 CSS Grid 堆叠在同一位置
- 只通过 `opacity` 和 `z-index` 控制显示
- 添加 `will-change: opacity` 优化性能

### 预加载策略

- 前 2 张图片 `priority={true}`
- 其余图片 `loading="lazy"`
- 保留骨架屏加载状态

## 移动端适配

### 断点

- `>= 768px (md)`: 左右分栏布局
- `< 768px`: 上下堆叠布局

### 移动端布局

```
┌─────────────────┐
│  图片 (sticky)   │  ← 固定在顶部
├─────────────────┤
│  功能项 1        │
│  功能项 2        │  ← 滚动区域
│  ...            │
└─────────────────┘
```

### ScrollTrigger 适配

- 使用 `ScrollTrigger.matchMedia()` 为不同断点注册不同配置
- 窗口 resize 时自动切换

## 文件变更

### 新建

- `src/components/ui/SnapshotPlaygroundScroll.tsx`

### 修改

- `src/components/ui/SnapshotPlayground.tsx` - 替换子组件引用

### 删除

- `src/components/ui/SnapshotPlaygroundTabs.tsx`

## 依赖变更

```diff
+ gsap
+ @gsap/react (可选，提供 useGSAP hook)
- @radix-ui/react-tabs (如果其他地方没用到)
```

## 保留逻辑

- PostHog 埋点 (`feature_tab_switched` 事件)
- 图片懒加载和骨架屏
- 暗色模式样式
- i18n 翻译
