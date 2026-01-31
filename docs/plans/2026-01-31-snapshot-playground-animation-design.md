# SnapshotPlaygroundScroll 动画优化设计

## 问题

当前组件存在以下问题：
- 滚动时图片切换有延迟或跳帧
- 点击 tab 时滚动动画不流畅
- 快速滚动时整体体验差
- 左侧 tab 列表布局不合理

## 解决方案

### 1. 布局调整

将左侧垂直 tab 列表改为顶部水平排列：

```
┌─────────────────────────────────────────────┐
│  [Tab1] [Tab2] [Tab3] [Tab4] [Tab5] ...     │  ← 水平 tab 栏
├─────────────────────────────────────────────┤
│                                             │
│              [ 截图图片 ]                    │  ← 全宽图片区域
│                                             │
└─────────────────────────────────────────────┘
```

优点：
- 图片展示空间更大（不再为左侧 tab 预留宽度）
- 视觉流向更自然（从上往下）
- 动画更简单（无需左侧滑入动画）
- 移动端友好

### 2. Tab 栏样式

```
    ○ Tab1     ○ Tab2     ● Tab3     ○ Tab4     ○ Tab5
                          ───────
                          (底部指示条)
```

- 图标 + 文字水平排列
- 选中状态：底部 2px 指示条（indigo 色），文字加粗变深
- 未选中状态：灰色，hover 时变深
- 间距：tab 之间 gap 8px，内部 padding 12px 16px
- 移动端：tab 栏可水平滚动

### 3. 动画优化

**滚动时图片切换（问题 A）：**
- 移除 CSS `transition-opacity duration-300`
- 图片切换使用即时 opacity 变化（0 或 1）
- 只在点击 tab 时使用 150ms 淡入

**点击 tab 滚动（问题 B）：**
- 动画时长：0.8s → 0.5s
- ease：`power2.inOut` → `power3.out`
- 滚动过程中禁用图片过渡

**快速滚动（问题 D）：**
- 移除 `isFastScrolling` 状态和检测逻辑
- 无 CSS transition，切换即时响应

### 4. ScrollTrigger 配置

```
SCROLL_HEIGHT_PER_ITEM: 60vh（原 80vh）
HEADER_OFFSET: 100px
scrub: 0.5（原 1.5）
```

删除：
- `INTRO_ANIMATION_SCROLL` 常量
- intro timeline 动画
- `matchMedia` 桌面/移动端分支

### 5. 代码简化

**删除（约 150 行）：**
- `isFastScrolling` 状态及相关逻辑
- `tabInnerRef`、独立滚动速度监听器
- 上下箭头按钮
- intro timeline 动画（容器展开、图片缩放、tab 滑入）
- `matchMedia` 分支
- 左侧 tab 渐变遮罩

**保留：**
- `activeIndex` 状态和切换逻辑
- `loadedImages` 图片加载状态
- `handleTabClick` 点击跳转
- `handleImageLoad` 图片加载回调
- 导航点击时重置 ScrollTrigger 逻辑

**新增：**
- 水平 tab 栏组件
- 底部指示条

**预计代码量：** 585 行 → 约 350 行

## 实现步骤

1. 重构 JSX 布局结构（水平 tab + 全宽图片）
2. 实现水平 tab 栏样式和交互
3. 简化 ScrollTrigger 配置，删除 intro 动画
4. 优化图片切换动画
5. 删除无用代码和状态
6. 测试桌面端和移动端
